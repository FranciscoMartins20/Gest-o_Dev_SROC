const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'Sql202!s@',
  server: 'localhost\\sql2017',
  database: 'SROC',
  port: 1433,
  options: {
    encrypt: false
  }
};

async function executeQuery(query, params = {}) {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    // Processa cada chave no objeto params
    Object.keys(params).forEach(key => {
      const { value, type } = params[key]; // Espera-se que cada parâmetro seja um objeto com 'value' e 'type'
      request.input(key, type, value); // Adiciona o parâmetro à requisição SQL
    });

    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error('Erro ao executar consulta:', error);
    throw error;
  }
}


module.exports = {
  config, // Exporta as configurações de conexão
  executeQuery, // Exporta a função executeQuery
};
