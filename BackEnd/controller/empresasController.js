const db = require('../db');
const sql = require('mssql');


async function getCompanyNameByNIF(NIF) {
  try {
 
    const query = 'SELECT Name FROM Company WHERE NIF = @NIF';
    
   
    const params = {
      NIF: { value: NIF, type: sql.VarChar(50) } 
    };

    const result = await db.executeQuery(query, params);
    

    return result.length > 0 ? result[0].Name : null;
  } catch (error) {
    console.error('Error fetching company name:', error);
    throw error;
  }
}


async function getAllCompanies() {
  try {
    const query = 'SELECT * FROM Company';
    
    const result = await db.executeQuery(query);
    
    return result;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
}



module.exports = {
  getCompanyNameByNIF,
  getAllCompanies
};
