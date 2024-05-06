import axios from 'axios';

const API_URL = 'http://localhost:4000';

export const loginUser = async (Username, Password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { Username, Password });
    const { token } = response.data;

    if (token) {
      localStorage.setItem('token', token);
      console.log(token);
      return response.data;
    } else {
      throw new Error('Token not provided by the response');
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error.response ? error.response.data : error.message);
    throw error;
  }
};


export const logoutUser = async () => {
  try {
    const token = localStorage.getItem('token');

    if (token) {
      await axios.post(`${API_URL}/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // After logging out, remove the token from local storage
      localStorage.removeItem('token');

      // Optional: Redirect the user or perform other cleanup actions
      // window.location.href = '/login';
    }
  } catch (error) {
    console.error('Error during logout:', error.response ? error.response.data : error.message);
    // Handle error (show message, redirect, etc.)
  }
};


// Adicione esta função no api.js

export const fetchTickets = async () => {
  try {
    const response = await axios.get(`${API_URL}/ticket`, {

    });
    return response.data; // Retorna os dados diretamente
  } catch (error) {
    console.error('Erro ao buscar tickets:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error;
  }
};

export const createTicket = async (ticketData) => {
  try {
    const token = localStorage.getItem('token'); // Recupera o token de autenticação do localStorage
    const response = await axios.post(`${API_URL}/ticket`, ticketData, {
      headers: {
        'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho para autenticação
      }
    });

    // Retorna os dados da resposta, que poderiam incluir detalhes do ticket criado
    return response.data;
  } catch (error) {
    console.error('Erro ao criar ticket:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error; // Lança erro para ser tratado pelo componente que chamou
  }
};

export const updateTicket = async (ticketId, ticketData) => {
  try {
    const token = localStorage.getItem('token'); // Recupera o token de autenticação do localStorage
    const response = await axios.put(`${API_URL}/ticket/${ticketId}`, ticketData, {
      headers: {
        'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho para autenticação
      }
    });

    // Retorna os dados da resposta, que podem incluir detalhes do ticket atualizado
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar ticket:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error; // Lança erro para ser tratado pelo componente que chamou
  }
};

export const fetchTicketDetails = async (ticketId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/ticket/${ticketId}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho para autenticação
      }

    });


    return response.data;
  } catch (error) {
    console.error('Erro ao buscar detalhes do ticket:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error;
  }
};

export const fetchUserDetails = async () => {
  try {
    const token = localStorage.getItem('token'); // Recupera o token de autenticação do localStorage


    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho para autenticação
      }
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar detalhes do usuário:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteTicketID = async (ticketId) => {
  try {
    const response = await axios.delete(`${API_URL}/ticket/${ticketId}`, {

    });
    return response.data;
  } catch (error) {
    console.error('Erro ao apagar o ticket:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error;
  }

}

export const fetchCompanyNameByNIF = async (NIF) => {
  try {
    const response = await axios.get(`${API_URL}/company/${NIF}`);
    return response.data.companyName;
  } catch (error) {
    console.error('Error fetching company name:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchUserDetailsByUsername = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/user/${username}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar detalhes do usuário pelo nome de usuário:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error;
  }
};

export const fetchAllCompanies = async () => {
  try {
    const response = await axios.get(`${API_URL}/company`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all companies:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error;
  }
};

export const fetchAllUsers = async () => {
  try {
    const token = localStorage.getItem('token'); // Recupera o token de autenticação do localStorage
    const response = await axios.get(`${API_URL}/getall`, {
      headers: {
        'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho para autenticação
      }
    });

    return response.data; // Retorna os dados de todos os usuários
  } catch (error) {
    console.error('Erro ao buscar todos os usuários:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error;
  }
};
