const { executeQuery } = require('../db');
const sql = require('mssql');

async function getTickets() {
    const query = 'SELECT * FROM Ticket';
    try {
      const result = await executeQuery(query);
      return result; 
    } catch (error) {
      console.error('Failed to retrieve tickets', error);
      throw error;
    }
  }

  async function addTicket(ticketData) {
    const query = `
      INSERT INTO Ticket (Date, Time, Company, Service, Commentary, Status, Responsible)
      VALUES (@Date, @Time, @Company, @Service, @Commentary, @Status, @Responsible)
    `;
    try {
        await executeQuery(query, {
            Date: { value: ticketData.Date, type: sql.Date },
            Time: { value: ticketData.Time, type: sql.NVarChar(500) },
            Company: { value: ticketData.Company, type: sql.VarChar(50) },
            Service: { value: ticketData.Service, type: sql.NVarChar(500) },
            Commentary: { value: ticketData.Commentary, type: sql.NVarChar(500) },
            Status: { value: ticketData.Status, type: sql.NVarChar(100) },
            Responsible: { value: ticketData.Responsible, type: sql.VarChar(50) }
          });
    } catch (error) {
      console.error('Failed to add ticket', error);
      throw error;
    }
  }

  async function getTicketById(id) {
    const query = 'SELECT * FROM Ticket WHERE Id = @Id';
    try {
      const result = await executeQuery(query, { Id: { value: id, type: sql.Int } });
      if (result.length > 0) {
        return result[0];
      } else {
        return null; // Nenhum ticket encontrado
      }
    } catch (error) {
      console.error('Failed to retrieve ticket', error);
      throw error;
    }
  }

  async function updateTicket(id, ticketData) {
    const query = `
      UPDATE Ticket
      SET Date = @Date, Time = @Time, Company = @Company, Service = @Service,
          Commentary = @Commentary, Status = @Status, Responsible = @Responsible
      WHERE Id = @Id
    `;
    try {
      await executeQuery(query, {
        Id: { value: id, type: sql.Int },
        Date: { value: ticketData.Date, type: sql.Date },
        Time: { value: ticketData.Time, type: sql.NVarChar(500) },
        Company: { value: ticketData.Company, type: sql.VarChar(50) },
        Service: { value: ticketData.Service, type: sql.NVarChar(500) },
        Commentary: { value: ticketData.Commentary, type: sql.NVarChar(500) },
        Status: { value: ticketData.Status, type: sql.NVarChar(100) },
        Responsible: { value: ticketData.Responsible, type: sql.VarChar(50) }
      });
    } catch (error) {
      console.error('Failed to update ticket', error);
      throw error;
    }
  }

  async function deleteTicket(id) {
    const query = 'DELETE FROM Ticket WHERE Id = @Id';
    try {
      await executeQuery(query, { Id: { value: id, type: sql.Int } });
    } catch (error) {
      console.error('Failed to delete ticket', error);
      throw error;
    }
  }
  
  module.exports = {
    getTickets,
    addTicket,
    getTicketById,
    updateTicket,
    deleteTicket
};
  
  
  