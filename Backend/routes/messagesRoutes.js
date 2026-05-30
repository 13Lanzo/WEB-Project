/* deve prevedere:
- CREATE di un nuovo messaggio (POST --> /messages)
- READ della cronologia chat tra due utenti (GET --> /messages/:userId)
- UPDATE per aggiornare lo stato di lettura (booleano) di un messaggio (PATCH --> /messages/:id/read)
- DELETE (opzionale) per eliminare un messaggio (DELETE --> /messages/:id)
*/
const express = require('express');
const router = express.Router();
const verificaToken = require('../middleware/authMiddleware');
const MessageController = require('../controllers/messageController');

// =========================================================================
// 1. CREATE: Salva un nuovo messaggio nel DB
// ROUTE: POST /api/messages
// (Questo endpoint verrà invocato spesso dal server per salvare i messaggi di Socket.IO)
// =========================================================================
/**
 * @openapi
 * /api/messages/{id}/messages:
 *   post:
 *     summary: Salva un nuovo messaggio nella chat
 *     description: Registra la transazione del messaggio tra mittente e destinatario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mittente
 *               - destinatario
 *               - testo
 *             properties:
 *               mittente:
 *                 type: string
 *                 description: L'ID o il Nome dell'utente che invia
 *                 example: "6a12f544c411ee6d0a7b055f"
 *               destinatario:
 *                 type: string
 *                 description: L'ID o il Nome dell'utente che riceve
 *                 example: "6a12f623c411ee6d0a7b0560"
 *               testo:
 *                 type: string
 *                 example: "Ciao! La stanza è ancora disponibile?"
 *     responses:
 *       201:
 *         description: Messaggio inviato e salvato.
 */
router.post('/:id/messages', verificaToken, MessageController.createMessage);

// =========================================================================
// 2. READ: Recupera la conversazione tra l'utente loggato e un altro utente
// ROUTE: GET /api/messages/conversazione/:conChiId
// =========================================================================
/**
 * @openapi
 * /api/messages/{id}/messages/{conChiId}:
 *   get:
 *     summary: Recupera la cronologia dei messaggi tra due utenti
 *     description: Estrae tutti i messaggi scambiati tra l'utente corrente (mioId) e l'interlocutore (conChiId).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dell'utente
 *       - in: path
 *         name: conChiId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dell'altro utente della chat
 *       - in: query
 *         name: mioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dell'utente attualmente loggato (necessario per i test)
 *     responses:
 *       200:
 *         description: Storico messaggi recuperato con successo.
 */
router.get('/:id/messages/:conChiId', verificaToken, MessageController.getMessages);



// =========================================================================
// 3. UPDATE: Segna come letti tutti i messaggi ricevuti in una conversazione
// ROUTE: PATCH /api/messages/leggi/:mittenteId
// =========================================================================

router.patch('/:id/messages/:mittenteId', verificaToken, MessageController.updateMessage);

// =========================================================================
// 4. DELETE: Elimina un singolo messaggio tramite il suo ID
// ROUTE: DELETE /api/messages/:id
// =========================================================================
/**
 * @openapi
 * /api/messages/{id}/messages/{messaggioId}:
 *   delete:
 *     summary: Elimina un singolo messaggio tramite il suo ID
 *     description: Rimuove permanentemente un messaggio inviato per errore dal database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del messaggio da eliminare
 *     responses:
 *       200:
 *         description: Messaggio eliminato.
 *       404:
 *         description: Messaggio non trovato.
 */
router.delete('/:id/messages/:messaggioId', verificaToken, MessageController.deleteMessage);

module.exports = router;