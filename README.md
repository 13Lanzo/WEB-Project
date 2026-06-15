# UniRoom 🏠🎓

**UniRoom** è una piattaforma web progettata per facilitare l'incontro tra studenti universitari alla ricerca di un alloggio e proprietari di immobili (o coinquilini) che offrono stanze in affitto. Il sistema include la gestione degli annunci delle stanze, profili utente personalizzati con tag di preferenze per favorire il matchmaking, e un sistema di messaggistica integrato per consentire la comunicazione diretta tra le parti.

Il progetto si compone di due parti principali:
1. **Backend**: Un server REST API sviluppato con **Node.js** ed **Express**, interfacciato a **MongoDB Atlas** (tramite Mongoose) e documentato interattivamente con **Swagger**.
2. **Frontend**: Un'applicazione web sviluppata in **React** e **Vite**, stilizzata in Vanilla CSS con un layout moderno e completamente responsive.

---

## 🛠️ Tecnologie Utilizzate

### Backend
- **Node.js** & **Express** - Runtime server e framework web.
- **MongoDB Atlas** & **Mongoose** - Database NoSQL Cloud e ODM per la modellazione dei dati.
- **JWT (JSON Web Tokens)** & **Bcryptjs** - Autenticazione sicura e cifratura delle password.
- **Swagger UI Express** & **Swagger-jsdoc** - Documentazione delle API REST interattiva e testabile via browser.
- **CORS** & **Dotenv** - Sicurezza cross-origin e gestione delle variabili d'ambiente.

### Frontend
- **React 19** & **Vite** - Libreria UI e build tool di ultima generazione estremamente performante.
- **React Router DOM 7** - Gestione avanzata del routing dell'applicazione a livello client.
- **Vanilla CSS** - Design contemporaneo ed estetico con layout flessibili e micro-animazioni.

---

## 🚀 Requisiti di Sistema
Prima di procedere all'installazione, assicurati di aver installato sul tuo computer:
- **Node.js** (versione 18.x o superiore consigliata)
- **npm** (incluso con l'installazione di Node.js)
- Connessione a Internet (necessaria per consentire al server locale di connettersi al cluster MongoDB Atlas)

---

## 📂 Struttura delle Directory
```text
PROGETTO WEB/
├── Backend/              # Server-side logic e database
│   ├── controllers/      # Logica di controllo per utenti, stanze e messaggi
│   ├── middleware/       # Middleware di autenticazione e autorizzazione (JWT)
│   ├── models/           # Modelli e schemi Mongoose (User, Room, Message)
│   ├── routes/           # Definizione delle rotte dell'API REST
│   ├── seed.js           # Script per inizializzare il DB con dati fittizi
│   ├── server.js         # Entry point dell'applicazione backend
│   ├── swagger.js        # Configurazione dettagliata di Swagger UI
│   └── .env              # Configurazione e chiavi segrete
├── Frontend/             # Client-side React Application
│   ├── src/              # Codice sorgente dell'interfaccia grafica
│   │   ├── components/   # Pagine e componenti (Chat, Home, Login, Ricerca, ecc.)
│   │   ├── App.jsx       # Gestione dello stato di autenticazione e rotte client
│   │   └── main.jsx      # Entry point per il rendering di React
│   ├── index.html        # HTML statico di base
│   └── vite.config.js    # Configurazione di bundling per Vite
└── README.md             # Questa documentazione
```

---

## ⚙️ Installazione e Configurazione

Segui questi passaggi per configurare l'applicazione in locale.

### 1. Configurazione del Backend
1. Apri il terminale e spostati all'interno della directory `Backend`:
   ```bash
   cd Backend
   ```
2. Installa le dipendenze richieste:
   ```bash
   npm install
   ```
3. Il file `.env` è già presente e preconfigurato con una stringa di connessione a un database MongoDB Atlas di test chiamato `uniroom_db`. Controlla che le variabili d'ambiente siano definite nel file `Backend/.env`:
   ```env
   MONGODB_URI=Recupera_il_tuo_URI_su_MongoDB_Atlas
   PORT=3000
   JWT_SECRET=Crea_la_tua_JWT_secret
   ```
   > [!NOTE]
   > In un ambiente di produzione reale, si consiglia di sostituire `MONGODB_URI` con il proprio cluster MongoDB Atlas e definire un `JWT_SECRET` sicuro.

### 2. Inizializzazione del Database (Seeding)
Per popolare il database con dati di test già pronti (utenti, stanze e chat di esempio), esegui lo script di seeding. Dalla cartella `Backend`, esegui:
```bash
npm run seed
```
Lo script pulirà le collezioni esistenti e caricherà:
- **10 Studenti** con profili e tag di preferenze impostati.
- **10 Proprietari** di alloggi.
- **12 Annunci di Stanze** collegate ai rispettivi proprietari.
- **Una serie di Messaggi e chat storiche** per testare la messaggistica.

### 3. Configurazione del Frontend
1. Apri una nuova scheda del terminale e posizionati nella directory `Frontend`:
   ```bash
   cd Frontend
   ```
2. Installa le dipendenze richieste:
   ```bash
   npm install
   ```

---

## 🏃‍♂️ Avvio dei Servizi

### 1. Avviare il Server Backend
All'interno della cartella `Backend`, lancia il server in modalità sviluppo (utilizza `nodemon` per il ricaricamento automatico a ogni modifica):
```bash
npm run dev
```
Dovresti visualizzare un output di conferma:
```text
Usando DNS pubblici per la risoluzione SRV: [ '8.8.8.8', '1.1.1.1' ]
Il server è in ascolto sulla porta 3000...
Testa la rotta su http://localhost:3000/
Connesso correttamente a MongoDB Atlas!
```

### 2. Avviare il Frontend React
All'interno della cartella `Frontend`, avvia l'interfaccia client con Vite:
```bash
npm run dev
```
Vite avvierà l'applicazione e indicherà l'indirizzo locale, solitamente:
```text
  ➜  Local:   http://localhost:5173/
```
Apri [http://localhost:5173/](http://localhost:5173/) nel tuo browser per visualizzare il sito UniRoom.

---

## 🧪 Testing delle API e dei Servizi

### 1. Documentazione e Sandbox API (Swagger UI) 📄
Il backend espone la documentazione di tutti gli endpoint REST tramite **Swagger**. È possibile effettuare test, esaminare le risposte e chiamare le API direttamente dal browser.
- **URL di Swagger**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

#### Autenticarsi su Swagger con JWT:
Molte rotte del backend sono protette da JWT. Per testarle da Swagger:
1. Effettua una chiamata POST all'endpoint `/api/auth/login` inserendo l'email e la password di un utente di test.
2. Copia la stringa del token presente nel JSON di risposta (`token`).
3. Clicca sul pulsante **Authorize** (in alto a destra su Swagger UI).
4. Nel campo di testo inserisci: `Bearer <INCOLLA_IL_TOKEN_QUI>` (incluso lo spazio dopo Bearer).
5. Conferma. Ora tutte le successive chiamate effettuate da Swagger invieranno l'header `Authorization: Bearer <token>`.

### 2. Credenziali di Test Preconfigurate 🔑
Puoi utilizzare questi profili (creati con il comando `npm run seed`) sia per accedere all'interfaccia Frontend sia per testare le API:

* **Profilo Studente (default sul form del frontend):**
  - **Email:** `cioccafra@gmail.com`
  - **Password:** `password5`
* **Profilo Studente (Poliba):**
  - **Email:** `d.lanzo@studenti.poliba.it`
  - **Password:** `PasswordSicura123`
* **Profilo Proprietario:**
  - **Email:** `roberto.esposito@gmail.com`
  - **Password:** `PasswordSicura123`

---

## 📬 Gestione dei Messaggi (API Chat)
Per scambiare messaggi, l'API del backend utilizza i seguenti endpoint principali (tutti richiedono un token JWT valido per l'autorizzazione):

- **Inviare un messaggio**: `POST /api/messages/:id/messages`
  - *Corpo della richiesta*: `{ "mittente": "ID_MITTENTE", "destinatario": "ID_DESTINATARIO", "testo": "Testo del messaggio..." }`
- **Recuperare la conversazione**: `GET /api/messages/:id/messages/:conChiId?mioId=ID_LOGGATO`
  - Estrae lo storico messaggi scambiati tra l'utente loggato (`mioId`) e l'interlocutore (`conChiId`).
- **Segnare i messaggi come letti**: `PATCH /api/messages/:id/messages/:mittenteId`
  - Aggiorna a `true` lo stato di lettura di tutti i messaggi ricevuti dal `mittenteId`.
- **Eliminare un messaggio**: `DELETE /api/messages/:id/messages/:messaggioId`
  - Rimuove permanentemente un messaggio inviato tramite il suo ID specifico.

---

## 👥 Sviluppatori del Progetto
Questo progetto è stato realizzato per l'esame di Fondamenti del Web da:
- **Giuseppe**
- **Francesca**
- **Pierpaolo**
