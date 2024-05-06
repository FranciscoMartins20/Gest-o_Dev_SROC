const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
        return res.status(401).send('Acesso negado. Nenhum token fornecido.');
    }

    const token = bearerHeader.split(' ')[1];
    jwt.verify(token, 'secreto', (err, decoded) => {
        if (err) {
            res.status(401).send('Token inválido');
        } else {
            req.user = decoded; // Certifique-se de que esta linha está correta
            next();
        }
    });
};

// O middleware verificarRole permanece o mesmo
const verificarRole = (rolesPermitidas) => (req, res, next) => {
    if (!req.decoded || !rolesPermitidas.includes(req.decoded.Role)) {
        return res.status(403).send('Acesso negado');
    }
    next();
};

module.exports = {
    verificarToken,
    verificarRole
};
