# WEB-Project

## API Messaging

Questa API gestisce la chat tra utenti usando Mongoose e Express.

### Regole principali

- `mittente` e `destinatario` sono riferimenti a documenti `User` in MongoDB.
- L'API accetta preferibilmente gli ID utente (`mittenteId`, `destinatarioId`).
- Se non si forniscono gli ID, la route POST cerca l'utente per `nome` o `email`.
- Tutti gli endpoint principali richiedono ObjectId validi per `mioId`, `conChiId`, `mittenteId` e `id`.

---

## Endpoints

### 1. POST `/api/messages`
Crea un nuovo messaggio.

Richiesta JSON consigliata:
```json
{
  "mittenteId": "6462f7bf1a2b3c4d5e6f7890",
  "destinatarioId": "6462f7bf1a2b3c4d5e6f7891",
  "testo": "ciao"
}
```

Fallback supportato:
```json
{
  "mittente": "Marco Viscanti",
  "destinatario": "Luca Valente",
  "testo": "ciao"
}
```

### 2. GET `/api/messages/conversazione/:conChiId`
Recupera la conversazione tra l'utente loggato e un altro utente.

Parametri:
- `:conChiId` → ObjectId dell'altro utente.
- query `mioId` → ObjectId dell'utente loggato.

### 3. PATCH `/api/messages/leggi/:mittenteId`
Segna come letti i messaggi ricevuti da un altro utente.

Body JSON:
```json
{
  "mioId": "6462f7bf1a2b3c4d5e6f7890"
}
```

### 4. DELETE `/api/messages/:id`
Elimina un messaggio tramite il suo ObjectId.

---

## Note

- Se un valore non è un ObjectId valido, il server restituisce un errore di validazione.
- Per i messaggi la struttura dei dati è basata su `Message` con campi `mittente`, `destinatario`, `testo` e `letto`.
- In produzione, `mioId` dovrebbe arrivare dal token JWT anziché dalla query o dal body.

