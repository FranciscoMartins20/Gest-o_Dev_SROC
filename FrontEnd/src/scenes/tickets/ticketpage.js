import React, { useState, useEffect, useCallback } from 'react';
import { fetchTickets, fetchCompanyNameByNIF,fetchUserDetailsByUsername } from '../../service/api';
import './ticketpage.css';
import ExcelJS from 'exceljs';
import { useNavigate } from 'react-router-dom';
import imagem_info from "./assets/imagem_info_data";
const saveAs = require('file-saver');

const exportToExcel = async (tickets, fileName, month, year, responsible) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tickets');


// Adicionar uma imagem (logo) às células de A1 a G3
const logo = workbook.addImage({
    base64: imagem_info,
    extension: 'png',
});

worksheet.addImage(logo, {
    tl: { col: 0.2, row: 0.2 }, // Configuração de posição superior esquerda
    br: { col: 6.0, row: 4.3 } // Configuração de posição inferior direita
});


    worksheet.views = [{ showGridLines: false }];

    // Definindo os cabeçalhos das colunas
    const headers = [
        { name: 'Data', key: 'Date', width: 15 },
        { name: 'Tempo', key: 'Time', width: 10 },
        { name: 'Empresa', key: 'Company', width: 20 },
        { name: 'Serviço', key: 'Service', width: 30 },
        { name: 'Comentários', key: 'Commentary', width: 30 },
        { name: 'Estado', key: 'Status', width: 15 },
        { name: 'Responsável', key: 'Responsible', width: 15 }
    ];

    worksheet.columns = headers.map(col => ({
        key: col.key,
        width: col.width
    }));

    const table = worksheet.addTable({
        name: 'TicketsTable',
        ref: 'A6',
        headerRow: true,
        totalsRow: false,
        style: {
            theme: 'TableStyleLight9',
            showRowStripes: true,
        },
        columns: headers.map(header => ({
            name: header.name,
            filterButton: true
        })),
        rows: tickets.map(ticket => headers.map(header => ticket[header.key]))
    });
    table.commit();

    // Adicionando três linhas de espaço
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);

    // Criação de um objeto para contabilizar o tempo por empresa
    const totalHoursByCompany = {};
    for (const ticket of tickets) {
        const timeComponents = ticket.Time.split(':');
        const hours = parseInt(timeComponents[0]);
        const minutes = parseInt(timeComponents[1]);
        const totalMinutes = hours * 60 + minutes;
        totalHoursByCompany[ticket.Company] = (totalHoursByCompany[ticket.Company] || 0) + totalMinutes;
    }

    // Adicionando os totais à mesma planilha
    const totalsStartRow = headers.length + 8;
    const totalsStartColumn = 1;
    worksheet.getCell(`A${totalsStartRow}`).value = 'Empresa';
    worksheet.getCell(`B${totalsStartRow}`).value = 'Total Horas';
    let totalsRowIndex = totalsStartRow + 1;
    for (const company in totalHoursByCompany) {
        const totalMinutes = totalHoursByCompany[company];
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        worksheet.getCell(`A${totalsRowIndex}`).value = company;
        worksheet.getCell(`B${totalsRowIndex}`).value = `${hours}:${minutes.toString().padStart(2, '0')}`;
        totalsRowIndex++;
    }

    // Formatando a tabela de totais
    const empresaRange = worksheet.getCell(`A${totalsStartRow}:A${totalsRowIndex - 1}`);
    empresaRange.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
    empresaRange.alignment = { horizontal: 'center', vertical: 'middle' };
    empresaRange.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9EAD3' } };
    empresaRange.font = { bold: true };
    
    const totalHorasRange = worksheet.getCell(`B${totalsStartRow}:B${totalsRowIndex - 1}`);
    totalHorasRange.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
    totalHorasRange.alignment = { horizontal: 'center', vertical: 'middle' };
    totalHorasRange.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9EAD3' } };
    totalHorasRange.font = { bold: true };
    
    // Ajustando larguras das colunas
    worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, cell => {
            let cellLength = cell.value ? cell.value.toString().length : 0;
            if (cellLength > maxLength) {
                maxLength = cellLength;
            }
        });
        column.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    // Salvando o arquivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${fileName}_${month}_${year}_${responsible}.xlsx`);
};




const TicketPage = () => {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        Company: '',
        Date: '',
        Month: '',
        Year: '',
        Responsible: ''
    });

    const clearFilters = () => {
        setFilters({
            Company: '',
            Date: '',
            Month: '',
            Year: '',
            Responsible: ''
        });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    const loadTickets = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await fetchTickets();
            const ticketsWithCompanyNames = await Promise.all(data.map(async (ticket) => {
                try {
                    const companyName = await fetchCompanyNameByNIF(ticket.Company);
                    const userDetails = await fetchUserDetailsByUsername(ticket.Responsible);
                    const responsibleName = userDetails.Name;
                    return { ...ticket, Company: companyName, Responsible: responsibleName };
                } catch {
                    return { ...ticket, Company: 'Nome indisponível', Responsible: 'Nome indisponível' };
                }
            }));

            const filteredData = ticketsWithCompanyNames.filter(ticket => {
                const ticketDate = new Date(ticket.Date);
                const filterDate = filters.Date ? new Date(filters.Date) : null;

                const ticketDateString = `${('0' + ticketDate.getDate()).slice(-2)}-${('0' + (ticketDate.getMonth() + 1)).slice(-2)}-${ticketDate.getFullYear()}`;
                const filterDateString = filterDate ? `${('0' + filterDate.getDate()).slice(-2)}-${('0' + (filterDate.getMonth() + 1)).slice(-2)}-${filterDate.getFullYear()}` : null;

                return (filters.Company === '' || ticket.Company.toLowerCase().includes(filters.Company.toLowerCase())) &&
                    (filters.Date === '' || ticketDateString === filterDateString) &&
                    (filters.Month === '' || ticketDate.getMonth() + 1 === parseInt(filters.Month)) &&
                    (filters.Year === '' || ticketDate.getFullYear() === parseInt(filters.Year)) &&
                    (filters.Responsible === '' || ticket.Responsible === filters.Responsible);
            });

            setTickets(filteredData);
            setError(null);
        } catch (error) {
            setError('Falha ao buscar tickets: ' + error.message);
        }
        setIsLoading(false);
    }, [filters]);

    const handleCreateTicket = () => {
        navigate('/create-ticket');
    };

    const handleRowClick = (ticketId) => {
        navigate(`/edit-ticket/${ticketId}`);
    };

    const handleExportExcel = () => {
        const { Month, Year, Responsible } = filters;
        exportToExcel(tickets, 'Lista_de_Tickets', Month, Year, Responsible);
    };

    useEffect(() => {
        loadTickets();
    }, [filters, loadTickets]);

    return (
        <div className="ticket-page">
            <h1 className="ticket-title">Lista de Serviços</h1>
            <div className="filter-container">
                <input
                    type="text"
                    name="Company"
                    value={filters.Company}
                    onChange={handleFilterChange}
                    placeholder="Filtrar por Empresa"
                    className="filter-input filter-empresa"
                />
                <input
                    type="date"
                    name="Date"
                    value={filters.Date}
                    onChange={handleFilterChange}
                    placeholder="Filtrar por data"
                    className="filter-input filter-data"
                />
                <select
                    name="Year"
                    value={filters.Year}
                    onChange={handleFilterChange}
                    className="filter-input filter-year"
                >
                    <option value="">Ano</option>
                    <option value="2024">2024</option>
                    {/* Adicione mais opções de anos conforme necessário */}
                </select>
                <select
                    name="Month"
                    value={filters.Month}
                    onChange={handleFilterChange}
                    className="filter-input filter-month"
                >
                    <option value="">Mês</option>
                    <option value="1">Janeiro</option>
                    <option value="2">Fevereiro</option>
                    <option value="3">Março</option>
                    <option value="4">Abril</option>
                    <option value="5">Maio</option>
                    <option value="6">Junho</option>
                    <option value="7">Julho</option>
                    <option value="8">Agosto</option>
                    <option value="9">Setembro</option>
                    <option value="10">Outubro</option>
                    <option value="11">Novembro</option>
                    <option value="12">Dezembro</option>
                </select>
                <select
                    name="Responsible"
                    value={filters.Responsible}
                    onChange={handleFilterChange}
                    className="filter-input filter-responsible"
                >
                    <option value="">Responsável</option>
                    <option value="Administrador">Administrador</option>
             

                </select>
                <button onClick={clearFilters} className="filter-clear-button">Limpar Filtros</button>
            </div>
            <div className="actions-container">
                <button onClick={handleExportExcel} className="action-button export-button">Exportar para Excel</button>
                <button onClick={handleCreateTicket} className="action-button create-ticket-button">Criar Novo Serviço</button>
            </div>
            {isLoading ? (
                <p className="loading-message">Carregando...</p>
            ) : error ? (
                <p className="error-message">Erro: {error}</p>
            ) : (
                <table className="tickets-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Tempo</th>
                            <th>Empresa</th>
                            <th>Serviço</th>
                            <th>Comentários</th>
                            <th>Estado</th>
                            <th>Responsável</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(ticket => (
                            <tr key={ticket.Id} onClick={() => handleRowClick(ticket.Id)} className="ticket-row">
                                <td>{new Date(ticket.Date).toLocaleDateString()}</td>
                                <td>{ticket.Time}</td>
                                <td>{ticket.Company}</td>
                                <td>{ticket.Service}</td>
                                <td>{ticket.Commentary}</td>
                                <td>{ticket.Status}</td>
                                <td>{ticket.Responsible}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TicketPage;