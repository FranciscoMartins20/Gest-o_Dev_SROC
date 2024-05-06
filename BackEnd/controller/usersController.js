const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { executeQuery } = require('../db');
const sql = require('mssql');

const registrarUtilizador = async (req, res) => {
    const { Username, Name, Email, Email_Optional, Password, Role } = req.body;
    
    console.log('Dados recebidos do corpo da solicitação:');
    console.log('Username:', Username);
    console.log('Name:', Name);
    console.log('Email:', Email);
    console.log('Email_Optional:', Email_Optional);
    console.log('Password:', Password);
    console.log('Role:', Role);

    try {
        if (!Password) {
            throw new Error('Senha não fornecida');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);
        console.log('Senha criptografada:', hashedPassword);

        const query = `
            INSERT INTO Users (Username, Name, Email, Email_Optional, Password, Role)
            VALUES (@Username, @Name, @Email, @Email_Optional, @Password, @Role)
        `;
        const params = {
            Username: { value: Username, type: sql.VarChar(50) },
            Name: { value: Name, type: sql.NVarChar(50) },
            Email: { value: Email, type: sql.VarChar(50) },
            Email_Optional: { value: Email_Optional, type: sql.VarChar(50) },
            Password: { value: hashedPassword, type: sql.NVarChar(255) },
            Role: { value: Role, type: sql.VarChar(50) }
        };

        await executeQuery(query, params);

        res.send('Utilizador registado com sucesso!');
    } catch (error) {
        console.error('Erro ao registar utilizador:', error);
        res.status(500).send('Erro ao registar utilizador');
    }
};

const fazerLogin = async (req, res) => {
    const { Username, Password } = req.body;

    try {
        if (!Username || !Password) {
            throw new Error('Username ou senha não fornecidos');
        }

        const query = "SELECT * FROM Users WHERE Username = @Username";
        const params = { Username: { value: Username, type: sql.VarChar(50) } };
        const users = await executeQuery(query, params);

        if (users.length === 0) {
            throw new Error('Utilizador não encontrado');
        }

        const user = users[0];
        const passwordMatch = await bcrypt.compare(Password, user.Password);

        if (passwordMatch) {
            const token = jwt.sign({ Username: user.Username, Role: user.Role }, 'secreto');
            res.status(200).json({ token: token, message: 'Login bem-sucedido!' });
        } else {
            throw new Error('Senha incorreta');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(401).send('Falha no login');
    }
};

const logout = (req, res) => {
    res.clearCookie('jwtToken');
    res.status(200).send('Logout realizado com sucesso.');
};

const getUtilizador = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, 'secreto');
        const Username = decoded.Username;

        const query = "SELECT Username, Name, Email, Role FROM Users WHERE Username = @Username";
        const params = { Username: { value: Username, type: sql.VarChar(50) } };
        const user = await executeQuery(query, params);

        if (user.length > 0) {
            res.json(user[0]);
        } else {
            res.status(404).send('Usuário não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao obter informações do usuário:', error);
        res.status(500).send('Erro interno do servidor');
    }
};

const getUtilizadorByUsername = async (req, res) => {
    try {
        const { Username } = req.params;

        
        const query = "SELECT Username, Name, Email, Role FROM Users WHERE Username = @Username";
        const params = { Username: { value: Username, type: sql.VarChar(50) } };
        const user = await executeQuery(query, params);

        if (user.length > 0) {
            res.json(user[0]);
        } else {
            res.status(404).send('Usuário não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao obter informações do usuário:', error);
        res.status(500).send('Erro interno do servidor');
    }
};

const getAllUtilizadores = async (req, res) => {
    try {
        const query = "SELECT * FROM Users";
        const users = await executeQuery(query);

        if (users.length > 0) {
            res.json(users);
        } else {
            res.status(404).send('Nenhum usuário encontrado.');
        }
    } catch (error) {
        console.error('Erro ao buscar todos os usuários:', error);
        res.status(500).send('Erro interno do servidor');
    }
};

module.exports = {
    getUtilizadorByUsername,
    registrarUtilizador,
    fazerLogin,
    logout,
    getUtilizador,
    getAllUtilizadores
};
