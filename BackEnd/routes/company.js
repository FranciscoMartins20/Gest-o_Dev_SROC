const express = require('express');
const router = express.Router();
const empresasController = require('../controller/empresasController');

// Route to fetch company name by NIF
router.get('/:NIF', async (req, res) => {
  try {
    const { NIF } = req.params;
    const companyName = await empresasController.getCompanyNameByNIF(NIF);
    if (companyName) {
      res.json({ companyName });
    } else {
      res.status(404).json({ message: 'Company not found for the provided NIF' });
    }
  } catch (error) {
    console.error('Error fetching company data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
    try {
      const allCompanies = await empresasController.getAllCompanies();
      res.json(allCompanies);
    } catch (error) {
      console.error('Error fetching all companies:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;
