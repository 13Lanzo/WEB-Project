/**
 * Health Routes
 * Queste rotte sono utilizzate per verificare lo stato di salute del server e del database.
 * Possono essere utili per monitoraggio, debugging e test.
 * Fondamentale per la fase di deploy.
 */

// Importiamo la libreria Express per creare un router dedicato alle rotte di salute
const express = require('express');
const router = express.Router();

// Importiamo l'HearthController che contiene la logica per gestire le richieste di salute
const HealthController = require('../controllers/healthController');

// Health Check Endpoint
router.get('/', HealthController.healthCheck);

// Esporta il router per essere utilizzato nella main app
module.exports = router;