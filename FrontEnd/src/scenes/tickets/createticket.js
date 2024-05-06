import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket, fetchAllCompanies, fetchAllUsers, fetchCompanyNameByNIF } from '../../service/api'; // Importe a função fetchAllUsers
import "./createticket.css";

const CreateTicket = () => {
    const navigate = useNavigate();

    // State para os dados do ticket
    const [Date, setDate] = useState('');
    const [Time, setTime] = useState('');
    const [CompanyNIF, setCompanyNIF] = useState('');
    const [CompanyName, setCompanyName] = useState(''); 
    const [Service, setService] = useState('');
    const [Commentary, setCommentary] = useState('');
    const [Status, setStatus] = useState('');
    const [Responsible, setResponsible] = useState('');
    const [users, setUsers] = useState([]); // Estado para armazenar a lista de usuários

    // State para armazenar as empresas disponíveis
    const [companies, setCompanies] = useState([]);

    // State para controlar a submissão do formulário
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Função para buscar todas as empresas disponíveis
    const fetchCompanies = async () => {
        try {
            const companiesData = await fetchAllCompanies();
            setCompanies(companiesData);
        } catch (error) {
            console.error('Erro ao buscar empresas:', error);
            // Trate o erro conforme necessário
        }
    };

    // Função para buscar todos os usuários disponíveis
    const fetchUsers = async () => {
        try {
            const usersData = await fetchAllUsers();
            setUsers(usersData);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            // Trate o erro conforme necessário
        }
    };

    // UseEffect para buscar as empresas e usuários quando o componente for montado
    useEffect(() => {
        fetchCompanies();
        fetchUsers();
    }, []);

    // Função assíncrona para buscar e definir o nome da empresa com base no NIF selecionado
    const fetchCompanyName = async (NIF) => {
        try {
            const companyName = await fetchCompanyNameByNIF(NIF);
            setCompanyName(companyName);
        } catch (error) {
            console.error('Erro ao buscar nome da empresa:', error);
            // Trate o erro conforme necessário
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        // Criação do objeto ticketData baseado nos estados
        const ticketData = {
            Date: Date,
            Time: Time,
            Company: CompanyNIF, // Envia o NIF da empresa selecionada
            Service: Service,
            Commentary: Commentary,
            Status: Status,
            Responsible: Responsible
        };

        try {
            await createTicket(ticketData);
            navigate('/ticket'); // Redirecionar para a página de lista de tickets
        } catch (error) {
            console.error('Falha ao criar ticket:', error);
            alert('Falha ao criar ticket: ' + error.message);
        } finally {
            setIsSubmitting(false); // Resetar o estado de submissão
        }
    };

    return (
        <div className="create-ticket-page">
            <h1>Criar Novo Ticket</h1>
            <form onSubmit={handleSubmit} className="edit-ticket-form">
                <label>
                    Data:
                    <input
                        type="date"
                        value={Date}
                        onChange={e => setDate(e.target.value)}
                    />
                </label>
                <label>
                    Tempo:
                    <input
                        type="time"
                        value={Time}
                        onChange={e => setTime(e.target.value)}
                    />
                </label>
                <label>
                    Empresa:
                    <select
                        value={CompanyNIF}
                        onChange={async (e) => {
                            setCompanyNIF(e.target.value);
                            await fetchCompanyName(e.target.value);
                        }}
                    >
                        <option value="">Selecione uma empresa</option>
                        {companies.map(company => (
                            <option key={company.NIF} value={company.NIF}>{company.Name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Responsável:
                    <select
                        value={Responsible}
                        onChange={e => setResponsible(e.target.value)}
                    >
                        <option value="">Selecione um responsável</option>
                        {users.map(user => (
                            <option key={user.Username} value={user.Username}>{user.Name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Serviços:
                    <textarea
                        value={Service}
                        onChange={e => setService(e.target.value)}
                    />
                </label>
                <label>
                    Comentários:
                    <textarea
                        value={Commentary}
                        onChange={e => setCommentary(e.target.value)}
                    />
                </label>

      
                <label>
                    Estado:
                    <select  value={Status}
                        onChange={e => setStatus(e.target.value)}
>
                   
                        <option value="Pendente">Pendente</option>
                    <option value="Em Progresso">Em curso</option>
                    <option value="Finalizado">Finalizado</option>
                    </select>
                        
                        
                   
                </label>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Criando...' : 'Criar Ticket'}
                </button>
            </form>
        </div>
    );
};

export default CreateTicket;
