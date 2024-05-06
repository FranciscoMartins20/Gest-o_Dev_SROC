const express = require('express');
const router = express.Router();
const usersRoutes = require('./users');
const feriasRoutes = require('./ferias');
const ticketsRoutes = require('./ticket');
const companyRoutes = require('./company');

router.use('/', usersRoutes);
router.use('/ferias', feriasRoutes);
router.use('/ticket', ticketsRoutes);
router.use('/company', companyRoutes)


module.exports = router;
