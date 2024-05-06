const express = require('express');
const router = express.Router();
const feriasController = require('../controller/feriasController');
const verifyToken = require('../middleware/verifyToken');



router.post('/addferias', verifyToken.verificarToken, verifyToken.verificarRole(['admin', 'gestor', 'empregado']),function(req, res) {
    feriasController.adicionarFerias(req, res);
});

router.get('/getallferias', verifyToken.verificarToken, verifyToken.verificarRole(['admin']),function(req, res) {
    feriasController.obterTodasFerias(req, res);
});



module.exports = router;
