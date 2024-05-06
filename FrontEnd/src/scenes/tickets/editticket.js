import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateTicket, fetchTicketDetails, deleteTicketID, fetchAllCompanies, fetchAllUsers,fetchCompanyNameByNIF,fetchUserDetailsByUsername } from '../../service/api'; // Importa a função fetchAllUsers
import "./editicket.css";

const EditTicket = () => {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState({
        Date: '',
        Time: '',
        Company: '',
        Service: '',
        Commentary: '',
        Status: '',
        Responsible: ''
    });
    const [companies, setCompanies] = useState([]); // Estado para armazenar a lista de empresas
    const [users, setUsers] = useState([]); // Estado para armazenar a lista de usuários
    const [companyName, setCompanyName] = useState(''); // Estado para armazenar o nome da empresa
    const [responsibleName, setResponsibleName] = useState(''); // Estado para armazenar o nome do responsável

    useEffect(() => {
        const loadTicketData = async () => {
            try {
                const data = await fetchTicketDetails(ticketId);
                if (data) {
                    setTicket({
                        Date: data.Date ? data.Date.split('T')[0] : '',
                        Time: data.Time || '',
                        Company: data.Company || '',
                        Service: data.Service || '',
                        Commentary: data.Commentary || '',
                        Status: data.Status || '',
                        Responsible: data.Responsible || ''
                    });
                    // Carregar o nome da empresa com base no NIF
                    const name = await fetchCompanyNameByNIF(data.Company);
                    setCompanyName(name);

                    // Carregar o nome do responsável com base no username
                    const userDetails = await fetchUserDetailsByUsername(data.Responsible);
                    setResponsibleName(userDetails.Name);
                }
            } catch (error) {
                console.error('Erro ao buscar o ticket:', error);
                // Tratamento de erro adicional, como notificação ao usuário
            }
        };

        loadTicketData();
    }, [ticketId]);

    useEffect(() => {
        const fetchCompaniesAndUsers = async () => {
            try {
                const companiesData = await fetchAllCompanies();
                setCompanies(companiesData);

                const usersData = await fetchAllUsers();
                setUsers(usersData);
            } catch (error) {
                console.error('Erro ao buscar empresas e usuários:', error);
                // Tratamento de erro adicional, como notificação ao usuário
            }
        };

        fetchCompaniesAndUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTicket(prevTicket => ({
            ...prevTicket,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await updateTicket(ticketId, ticket);
            navigate('/ticket'); // Redirecionar para a lista de tickets após a atualização
        } catch (error) {
            console.error('Erro ao atualizar o ticket:', error);
            // Implementar tratamento de erro adequado, como exibição de mensagem de erro
        }
    };

    const handleDeleteTicket = async () => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir este serviço?");
        if (confirmDelete) {
            try {
                await deleteTicketID(ticketId); // Chama a função para excluir o ticket
                navigate('/ticket'); // Redireciona para a lista de tickets após a exclusão
            } catch (error) {
                console.error('Erro ao excluir o ticket:', error);
                // Implementar tratamento de erro adequado, como exibição de mensagem de erro
            }
        }
    };

    return (
        <div className="edit-ticket-page">
            <h1 className="edit-ticket-title">Editar Serviço</h1>
            <button onClick={handleDeleteTicket} className="delete-ticket-button">Excluir Serviço</button>
            <br></br>
            <br></br>
            <form onSubmit={handleSubmit} className="edit-ticket-form">
                <label>
                    Data:
                    <input
                        type="date"
                        name="Date"
                        value={ticket.Date}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Tempo:
                    <input
                        type="time"
                        name="Time"
                        value={ticket.Time}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Empresa:
                    <select
                        name="Company"
                        value={ticket.Company}
                        onChange={handleChange}
                    >
                        <option value="">Selecione uma empresa</option>
                        {companies.map(company => (
                            <option key={company.NIF} value={company.NIF}>{company.Name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Serviço:
                    <textarea
                        name="Service"
                        value={ticket.Service}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Comentários:
                    <textarea
                        name="Commentary"
                        value={ticket.Commentary}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Estado:
                    <select
                        name="Status"
                        value={ticket.Status || ''}
                        onChange={handleChange}
                    >
                     <option value="Pendente">Pendente</option>
                    <option value="Em Progresso">Em Curso</option>
                    <option value="Finalizado">Finalizado</option>
                      </select>


                </label>
                <label>
                    Responsável:
                    <select
                        name="Responsible"
                        value={ticket.Responsible}
                        onChange={handleChange}
                    >
                        <option value="">Selecione um responsável</option>
                        {users.map(user => (
                            <option key={user.Username} value={user.Username}>{user.Name}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Salvar Alterações</button>
            </form>
        </div>
    );
};

export default EditTicket;
