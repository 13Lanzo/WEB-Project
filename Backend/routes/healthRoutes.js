const express = require('express');
const router = express.Router();

// Importiamo l'HearthController che contiene la logica per gestire le richieste di salute
const HealthController = require('../controllers/healthController');

// Health Check Endpoint
router.get('/', HealthController.healthCheck);

// Esporta il router per essere utilizzato nella main app
module.exports = router;