const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const ticketsController = require('../controller/ticketController');

router.use(bodyParser.json()); // Middleware para parsear JSON no corpo das requisições

// Rota para buscar todos os tickets
router.get('/', async (req, res) => {
    try {
        const tickets = await ticketsController.getTickets();
        res.json(tickets);
    } catch (error) {
        res.status(500).send("Erro ao buscar tickets: " + error.message);
    }
});

// Rota para adicionar um novo ticket
router.post('/', async (req, res) => {
    try {
        await ticketsController.addTicket(req.body);
        res.status(201).send("Ticket adicionado com sucesso!");
    } catch (error) {
        res.status(500).send("Erro ao adicionar ticket: " + error.message);
    }
});

// Rota para buscar um ticket específico por ID
router.get('/:id', async (req, res) => {
    try {
        const ticket = await ticketsController.getTicketById(req.params.id);
        if (ticket) {
            res.json(ticket);
        } else {
            res.status(404).send("Ticket não encontrado");
        }
    } catch (error) {
        res.status(500).send("Erro ao buscar ticket: " + error.message);
    }
});

// Rota para atualizar um ticket
router.put('/:id', async (req, res) => {
    try {
        await ticketsController.updateTicket(req.params.id, req.body);
        res.status(200).send("Ticket atualizado com sucesso!");
    } catch (error) {
        res.status(500).send("Erro ao atualizar ticket: " + error.message);
    }
});

// Rota para deletar um ticket
router.delete('/:id', async (req, res) => {
    try {
        await ticketsController.deleteTicket(req.params.id);
        res.status(200).send("Ticket deletado com sucesso!");
    } catch (error) {
        res.status(500).send("Erro ao deletar ticket: " + error.message);
    }
});

module.exports = router;
