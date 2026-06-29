# 🏠 UniRoom — Piattaforma Full-Stack per la Ricerca di Coinquilini

> Una piattaforma web full-stack per la ricerca di coinquilini e l'affitto di stanze che consente agli studenti universitari di trovare coinquilini compatibili e ai proprietari di pubblicare annunci di stanze disponibili. Il progetto è concepito come un esempio didattico end-to-end: dai **concetti teorici** all'**esecuzione locale di ciascun servizio**, fino al **deployment containerizzato** con Docker, Nginx e WebSocket.

---

## 📑 Indice

1. [Concetti teorici](#-1-concetti-teorici)
2. [Stack tecnologico](#-2-stack-tecnologico)
3. [Struttura del progetto](#-3-struttura-del-progetto)
4. [Prerequisiti](#-4-prerequisiti)
5. [Variabili d'ambiente](#-5-variabili-dambiente)
6. [Configurazione Backend (sviluppo locale)](#-6-configurazione-backend-sviluppo-locale)
7. [Configurazione Frontend (sviluppo locale)](#-7-configurazione-frontend-sviluppo-locale)
8. [Documentazione delle API](#-8-documentazione-delle-api)
9. [Deployment locale con Docker e Nginx](#-9-deployment-locale-con-docker-e-nginx)
10. [Comandi utili (cheat sheet)](#-10-comandi-utili-cheat-sheet)
11. [Risoluzione dei problemi (troubleshooting)](#-11-risoluzione-dei-problemi-troubleshooting)

---

## 📚 1. Concetti teorici

Prima di immergersi nel codice, è utile chiarire i concetti alla base dell'applicazione. UniRoom mette in pratica quasi tutti i pilastri del moderno sviluppo web.

### 1.1 Architettura Client-Server

L'applicazione è suddivisa in due "metà" che comunicano attraverso la rete:

- **Client (frontend)**: viene eseguito nel browser dell'utente, gestisce l'interfaccia utente (UI) e l'interazione.
- **Server (backend)**: viene eseguito su una macchina remota (o in un container), espone dati e logica di business attraverso un'**API** e gestisce le connessioni WebSocket.

Le due parti sono **disaccoppiate** (decoupled): comunicano solo tramite messaggi HTTP e WebSocket, in modo da poter essere sviluppate, testate e scalate in modo indipendente.

### 1.2 REST API

Il backend espone una **REST API** (Representational State Transfer). I principi chiave applicati in questo progetto sono:

- **Risorse** identificate da URL (es. `/api/v1/rooms`, `/api/v1/rooms/:id`, `/api/v1/users/:id/user`).
- **Verbi HTTP** che descrivono l'operazione: `GET` (lettura), `POST` (creazione), `PUT` (aggiornamento), `PATCH` (aggiornamento parziale, es. segnare i messaggi come letti), `DELETE` (eliminazione).
- **Stateless** (senza stato): ogni richiesta HTTP è autocontenuta e trasporta tutto il necessario per essere elaborata (incluso il token di autenticazione).
- **Codici di stato HTTP semantici**: `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict` (per i duplicati), `500 Internal Server Error`.
- **Versionamento delle API** tramite il prefisso `/api/v1/`, in modo che le API possano evolvere senza interrompere il funzionamento dei client esistenti.

### 1.3 Single Page Application (SPA)

Il frontend è una **SPA** realizzata con **React**: la pagina HTML viene caricata una sola volta, dopodiché il contenuto viene aggiornato dinamicamente da JavaScript senza ricaricare l'intera pagina. La navigazione tra le "pagine" (come Home, Login, Dettagli della stanza e ricerca/matchmaking) è gestita lato client da **React Router**. Ciò richiede un accorgimento lato server (vedi [Nginx](#94-il-cuore-del-deployment-nginx-come-reverse-proxy)): qualsiasi URL deve restituire `index.html`, lasciando al router il compito di mostrare la vista corretta.

### 1.4 Autenticazione con JWT (JSON Web Token)

L'autenticazione è **stateless** e basata su token:

1. L'utente invia email + password a `/api/v1/auth/login`.
2. Il server verifica le credenziali (la password viene confrontata con l'hash memorizzato tramite `bcryptjs`, mai in chiaro) e, if valide, genera un **JWT firmato** utilizzando una chiave segreta (`JWT_SECRET`), contenente il `userId`, il `ruolo` (role) e altre credenziali.
3. Il client memorizza il token nel `localStorage` e lo allega alle richieste successive nell'header `Authorization: Bearer <token>`.
4. Un **middleware** (`authMiddleware.js`) sul server verifica la firma del token su ogni richiesta protetta, garantendo un'autenticazione stateless.

Le password non vengono mai salvate in chiaro: sono **crittografate (hashed)** con `bcryptjs` (un algoritmo lento e salato, resistente agli attacchi a forza bruta) tramite un hook Mongoose `pre("save")` sul modello `User`.

### 1.5 Database NoSQL (MongoDB) e ODM (Mongoose)

I dati sono memorizzati in **MongoDB**, un **database NoSQL orientato ai documenti**: i record sono documenti in formato BSON/JSON, raggruppati in collezioni, senza uno schema rigido imposto dal motore del database.

Per dare comunque una struttura e una validazione ai dati, il progetto utilizza **Mongoose**, un **ODM** (Object-Data Mapping) che consente di:

- definire **schemi** con tipi, vincoli (`required`, `min`, `enum`, `unique`) e valori predefiniti;
- creare **relazioni** tra documenti utilizzando riferimenti `ObjectId` + `ref` (es. un annuncio `Room` fa riferimento all'utente creatore/proprietario `User`; i documenti `Message` fanno riferimento a un `mittente` e a un `destinatario` della collezione `User`);
- popolare i riferimenti con `.populate()` (es. allegare il `nome` e l'`email` del proprietario quando si recuperano i dettagli della stanza).

### 1.6 Comunicazione in tempo reale con i WebSocket (Socket.IO)

Per la messaggistica interattiva in tempo reale, l'applicazione implementa una comunicazione bidirezionale utilizzando i **WebSocket** tramite **Socket.IO**.

- **Handshake e Connessione**: all'avvio del client, viene stabilita una connessione WebSocket persistente con il backend.
- **Associazione Utente**: a connessione avvenuta, il client invia un evento `registra_utente` con l'ID dell'utente. Il server mantiene in memoria una mappa (`utentiConnessi`) tra gli ID utente attivi e il rispettivo ID del socket.
- **Smistamento dei Messaggi**: quando un utente invia un messaggio, viene emesso un evento `invia_messaggio`. Il server controlla la mappa `utentiConnessi` per trovare il socket ID del destinatario e inoltra immediatamente il messaggio usando `io.to().emit("ricevi_messaggio")`.
- **Persistenza Stateless**: il messaggio viene contemporaneamente salvato su MongoDB (tramite il modello `Message`) per mantenere lo storico permanente della chat, garantendo che i messaggi non vadano persi e possano essere recuperati quando si apre una chat.

### 1.7 Reverse Proxy (Nginx)

In produzione, un **reverse proxy** è un server che si interpone tra il client e i servizi dell'applicazione. In questo progetto, **Nginx**:

- serve i file statici della SPA React (HTML/CSS/JS precompilati nel container frontend);
- **inoltra** (proxies) le richieste `/api/` al backend Node.js;
- **gestisce le connessioni WebSocket** inoltrando le richieste `/socket.io/` ed effettuando l'upgrade della connessione HTTP a un canale WebSocket persistente;
- presenta tutto su una **singola origine** (`http://localhost`), eliminando i problemi di **CORS** e nascondendo la topologia interna dei container.

### 1.8 Containerizzazione con Docker

**Docker** pacchettizza ogni servizio (database, backend, frontend+nginx) in un **container**: un ambiente isolato e riproducibile che racchiude codice, runtime e dipendenze. Concetti utilizzati nel progetto:

- **Immagine**: il "template" immutabile creato a partire da un `Dockerfile`.
- **Container**: un'istanza in esecuzione di un'immagine.
- **Multi-stage build** (frontend): una fase di "build" con Node compila la SPA React, e una fase finale leggera con Nginx serve solo gli asset generati -> immagine finale più piccola e sicura.
- **Volume**: persistenza dei dati (es. `mongo-data`) che sopravvive ai riavvii o alla ricreazione dei container, prevenendo la perdita di dati.
- **Rete** e **service discovery**: con Docker Compose, i container si raggiungono a vicenda tramite il **nome del servizio** (es. `mongo`, `backend`) anziché tramite indirizzo IP.
- **Docker Compose**: orchestratore che descrive e avvia più container contemporaneamente con un singolo comando (`docker-compose.yml`).

---

## 🧰 2. Stack tecnologico

| Livello | Tecnologia | Ruolo |
|---|---|---|
| **Frontend** | React 19 + React Router 7 | Interfaccia utente (SPA) |
| | Vite | Build tool e dev server |
| | Socket.io-client | Comunicazioni WebSocket in tempo reale |
| | Lucide React | Set di icone vettoriali moderne |
| **Backend** | Node.js 20 + Express 5 | Server e REST API |
| | Socket.IO | Server WebSocket per la chat in tempo reale |
| | Mongoose | ODM per MongoDB |
| | jsonwebtoken | Generazione/verifica dei JWT |
| | bcryptjs | Hashing delle password |
| | swagger-jsdoc + swagger-ui-express | Documentazione interattiva delle API |
| **Database** | MongoDB 7 | Persistenza dei dati (NoSQL) |
| **Infrastruttura** | Docker + Docker Compose | Containerizzazione e orchestrazione |
| | Nginx | Web server statico + reverse proxy + WebSocket proxy |

---

## 📂 3. Struttura del progetto

```
PROGETTO WEB/
├── docker-compose.yml          # Orchestrazione dei 3 servizi (mongo, backend, frontend)
├── .env                        # Variabili d'ambiente (NON committare!)
│
├── nginx/
│   └── nginx.conf              # Configurazione reverse proxy + SPA static files + WebSocket proxying
│
├── Backend/                    # REST API + Socket.IO (Node.js + Express)
│   ├── Dockerfile              # Build dell'immagine backend
│   ├── .dockerignore
│   ├── .gitignore
│   ├── server.js               # Entry point: connessioni, Socket.IO, middleware, rotte
│   ├── package.json            # Dipendenze e script (start/dev/seed/clean)
│   ├── swagger.js              # Specifiche OpenAPI per Swagger UI
│   ├── seed.js                 # Popola il DB con dati di esempio (studenti, proprietari, stanze)
│   ├── clean.js                # Svuota le collezioni del DB
│   ├── models/                 # Schemi Mongoose
│   │   ├── User.js             #   utente (+ hashing password)
│   │   ├── Room.js             #   annuncio stanza (ref a User)
│   │   └── Message.js          #   messaggio chat (ref a User)
│   ├── controllers/            # Logica di business
│   │   ├── authController.js   #   registrazione / login
│   │   ├── usersController.js  #   profili utente, ricerca e matchmaking
│   │   ├── roomsController.js  #   CRUD stanze e annunci (filtro città/prezzo)
│   │   ├── messageController.js#   operazioni sul database per la chat
│   │   └── healthController.js #   controllo dello stato (health check)
│   ├── routes/                 # Definizioni degli endpoint
│   │   ├── authRoutes.js       #   /api/v1/auth
│   │   ├── usersRoutes.js      #   /api/v1/users
│   │   ├── roomsRoutes.js      #   /api/v1/rooms
│   │   ├── messagesRoutes.js   #   /api/v1/messages
│   │   └── healthRoutes.js     #   /health
│   └── middleware/             # Middleware Express
│       ├── authMiddleware.js   #   verifica del token JWT
│       └── roleMiddleware.js   #   verifica del ruolo (restrizione ai soli proprietari)
│
└── Frontend/                   # SPA (React + Vite)
    ├── Dockerfile              # Multi-stage build (Node → Nginx)
    ├── .dockerignore
    ├── .gitignore
    ├── index.html              # Template HTML principale
    ├── package.json            # Dipendenze e script (dev/build/preview/lint)
    ├── vite.config.js          # Configurazione Vite (proxy di sviluppo per /api e /socket.io)
    ├── eslint.config.js        # Impostazioni ESLint
    └── src/
        ├── main.jsx            # Entry point di React
        ├── App.jsx             # Routing e layout principale
        ├── index.css           # Stili globali e variabili del design system
        ├── App.css             # Stili specifici dei layout dei componenti
        ├── services/
        │   └── api.js          # Chiamate HTTP e helper per le API WebSocket
        └── components/         # Componenti grafici e viste
            ├── Annunci/        #   Elenco degli annunci e vista dettagli
            ├── Chat/           #   Interfaccia UI della chat in tempo reale
            ├── Dettagli/       #   Vista dettagliata del singolo annuncio
            ├── Footer/         #   Componente footer globale
            ├── Header/         #   Navbar e azioni sullo stato dell'autenticazione
            ├── Home/           #   Landing page principale (Homepage)
            ├── Login/          #   Form di registrazione e login
            ├── New/            #   Pagina di creazione annuncio (per i proprietari)
            ├── Profilo/        #   Setup del profilo utente e tag preferenze
            ├── Ricerca/        #   Dashboard di matchmaking dei coinquilini
            └── assets/         #   Immagini statiche e risorse del frontend
```

---

## ✅ 4. Prerequisiti

A seconda di come si desidera eseguire il progetto:

**Per lo sviluppo locale (backend e frontend avviati separatamente):**

- [Node.js](https://nodejs.org/) **≥ 18** (include `npm`)
- [MongoDB](https://www.mongodb.com/try/download/community) in esecuzione localmente **oppure** un cluster gratuito su [MongoDB Atlas](https://www.mongodb.com/atlas)

**Per il deployment containerizzato (consigliato):**

- [Docker](https://docs.docker.com/get-docker/) **≥ 20**
- [Docker Compose](https://docs.docker.com/compose/) (incluso in Docker Desktop)

Verifica le installazioni:

```bash
node -v        # es. v20.x
npm -v
docker -v
docker compose version
```

---

## 🔐 5. Variabili d'ambiente

Le variabili vengono caricate tramite la libreria `dotenv`. Nello sviluppo locale, il backend cercherà un file `.env` nella cartella radice del progetto. Un file `.env` configurato ha la seguente struttura:

```env
# === Database ===
MONGODB_URI=mongodb://mongo:27017/uniroom_db

# === Auth ===
JWT_SECRET=inserisci_qui_la_tua_chiave_segreta_jwt

# === Server ===
PORT=3000

# === URL Frontend (per fallback CORS) ===
FRONTEND_URL=http://localhost:5173
```

| Variabile | Descrizione | Esempio |
|---|---|---|
| `MONGODB_URI` | Stringa di connessione a MongoDB | `mongodb://mongo:27017/uniroom_db` (Docker) o `mongodb://localhost:27017/uniroom_db` (locale) |
| `JWT_SECRET` | Chiave segreta utilizzata per firmare i JWT | una stringa lunga e casuale |
| `PORT` | Porta su cui il backend rimane in ascolto | `3000` |
| `FRONTEND_URL`| URL del frontend per la configurazione CORS | `http://localhost:5173` |

> ⚠️ **Importante**
> - Quando si utilizza Docker Compose, l'host del database è il **nome del servizio** (`mongo`), non `localhost`: `MONGODB_URI=mongodb://mongo:27017/uniroom_db`.
> - Nello sviluppo locale "puro" (backend avviato con `npm`), utilizzare invece `localhost`: `MONGODB_URI=mongodb://localhost:27017/uniroom_db`.
> - Il file `.env` contiene dati sensibili: è già escluso dalle immagini Docker (`.dockerignore`) e **non deve mai essere committato** su Git.
> - Genera una stringa sicura per `JWT_SECRET`, ad esempio tramite: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

---

## ⚙️ 6. Configurazione Backend (sviluppo locale)

Questa modalità è utile per sviluppare e testare le API e il server Socket senza ricorrere ai container. Richiede un'istanza MongoDB raggiungibile (locale o Atlas).

### 6.1 Inizializzare il progetto e installare le librerie

Dalla cartella principale, spostarsi nella directory `Backend` e installare le dipendenze dichiarate:

```bash
cd Backend
npm install
```

Se si **inizia da zero** (senza un `package.json` esistente), inizializzare il progetto e installare le librerie esplicitamente:

```bash
cd Backend

# Crea un package.json con i valori predefiniti
npm init -y

# Dipendenze a runtime
npm install express mongoose cors dotenv jsonwebtoken bcryptjs socket.io swagger-jsdoc swagger-ui-express

# Dipendenza solo per lo sviluppo (riavvio automatico alle modifiche dei file)
npm install --save-dev nodemon
```

Scopo di ciascuna libreria:

| Libreria | Scopo |
|---|---|
| `express` | Web framework: routing, middleware, server HTTP |
| `mongoose` | ODM per modellare e interrogare MongoDB |
| `cors` | Abilita le richieste Cross-Origin tra frontend e backend |
| `dotenv` | Carica le variabili d'ambiente dal file `.env` |
| `jsonwebtoken` | Crea e verifica i JWT utilizzati per l'autenticazione |
| `bcryptjs` | Esegue l'hashing e la verifica delle password |
| `socket.io` | Gestisce i WebSocket per la messaggistica in tempo reale |
| `swagger-jsdoc` + `swagger-ui-express` | Generano e servono la documentazione interattiva delle API |
| `nodemon` *(dev)* | Riavvia automaticamente il server ad ogni modifica dei file |

Assicurarsi che `package.json` contenga gli script di progetto:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "seed": "node seed.js",
  "clean": "node clean.js"
}
```

### 6.2 Configurare e avviare

```bash
# 1. Configura le variabili d'ambiente nel file .env nella cartella radice del progetto
# 2. (Opzionale) Popola il database con i dati di test
npm run seed

# 3. Avvia il server
npm run dev      # con nodemon (auto-restart ad ogni modifica)
# oppure
npm start        # avvio semplice con node
```

Se tutto è corretto, nella console visualizzerai il seguente output:

```
Usando DNS pubblici per la risoluzione SRV: [ '8.8.8.8', '1.1.1.1' ]
Connesso correttamente a MongoDB!
Il server è in ascolto sulla porta 3000...
API documentation available at http://localhost:3000/api-docs
```

### 6.3 Script npm disponibili (backend)

| Comando | Azione |
|---|---|
| `npm start` | Avvia il server con `node server.js` |
| `npm run dev` | Avvia con `nodemon` (hot-reload in sviluppo) |
| `npm run seed` | Svuota e ripopola il DB con 10 studenti, 10 proprietari, 12 stanze e messaggi di test |
| `npm run clean` | Svuota tutte le collezioni del database (`users`, `rooms`, `messages`) |

> 💡 Lo script di `seed` crea degli account di test pronti all'uso. Puoi utilizzarli sia per accedere al frontend sia per effettuare chiamate alle API:
> - **Profilo Studente (preimpostato nel login del frontend):** `cioccafra@gmail.com` / `password5`
> - **Profilo Studente (Poliba):** `d.lanzo@studenti.poliba.it` / `PasswordSicura123`
> - **Profilo Proprietario:** `roberto.esposito@gmail.com` / `PasswordSicura123`

---

## 🎨 7. Configurazione Frontend (sviluppo locale)

Il frontend utilizza **Vite**. In modalità di sviluppo, le chiamate a `/api` e `/socket.io` vengono inoltrate automaticamente al backend all'indirizzo `http://localhost:3000` tramite il **proxy** configurato in `vite.config.js` (evitando problemi di CORS e mappando i protocolli WebSocket).

> ⚠️ Avvia **prima** il backend (sezione 6), altrimenti le richieste API e WebSocket falliranno.

### 7.1 Inizializzare il progetto e installare le librerie

Spostarsi nella cartella `Frontend` ed installare le dipendenze:

```bash
cd Frontend
npm install
```

Se si **inizia da zero** (senza un `package.json` esistente), inizializzare il progetto e installare le librerie esplicitamente:

```bash
cd Frontend

# Crea un package.json con i valori predefiniti
npm init -y

# Dipendenze a runtime
npm install react react-dom react-router-dom socket.io-client axios lucide-react cookie

# Dipendenze solo per lo sviluppo (build tool + plugin React compiler + ESLint)
npm install --save-dev vite @vitejs/plugin-react eslint
```

Scopo delle librerie:

| Libreria | Scopo |
|---|---|
| `react` | Libreria core per la UI (componenti, hook, stato) |
| `react-dom` | Effettua il rendering dei componenti React nel DOM del browser |
| `react-router-dom` | Gestisce il routing lato client della SPA |
| `socket.io-client` | Connessione WebSocket in tempo reale al server chat |
| `axios` | Client HTTP per l'esecuzione di richieste |
| `lucide-react` | Pacchetto di icone vettoriali |
| `cookie` | Helper per il parsing dei cookie |
| `vite` *(dev)* | Strumento di build e server di sviluppo |
| `@vitejs/plugin-react` *(dev)* | Aggiunge il supporto React (JSX, Fast Refresh) a Vite |

Assicurarsi che il file `package.json` contenga gli script del progetto:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

### 7.2 Avviare il dev server

```bash
npm run dev
```

Il server di sviluppo sarà raggiungibile all'indirizzo **http://localhost:5173**.

### 7.3 Script npm disponibili (frontend)

| Comando | Azione |
|---|---|
| `npm run dev` | Avvia il server di sviluppo Vite (hot-reload) su `:5173` |
| `npm run build` | Compila la SPA per la produzione all'interno della cartella `dist/` |
| `npm run lint` | Esegue ESLint per verificare errori di sintassi o stile nel codice |
| `npm run preview` | Serve la build `dist/` localmente per un'anteprima |

---

## 📖 8. Documentazione delle API

A backend avviato, la documentazione interattiva **Swagger UI** (OpenAPI 3.0) è disponibile all'indirizzo:

👉 **http://localhost:3000/api-docs**

Da qui è possibile esplorare ed effettuare test per ogni endpoint direttamente nel browser. Per gli endpoint protetti, cliccare su **Authorize** e incollare il token JWT ottenuto al login.

### Riepilogo degli endpoint

Tutte le rotte dell'applicazione sono accessibili sotto il prefisso **`/api/v1`** (eccetto `/health`). 🔒 = richiede autenticazione (header `Authorization: Bearer <token>`).

| Metodo | Endpoint | Descrizione | Autenticazione |
|---|---|---|:---:|
| `GET` | `/health` | Controllo dello stato del server | |
| `POST` | `/api/v1/auth/register` | Registrazione di un nuovo utente | |
| `POST` | `/api/v1/auth/login` | Login (restituisce il JWT) | |
| `GET` | `/api/v1/users/users` | Recupera tutti gli utenti | |
| `GET` | `/api/v1/users/search` | Cerca/matcha coinquilini (query: `?q=`) | 🔒 |
| `GET` | `/api/v1/users/:id/user` | Recupera i dettagli del profilo di un singolo utente | 🔒 |
| `PUT` | `/api/v1/users/:id/user` | Aggiorna i dettagli del profilo utente | 🔒 |
| `DELETE` | `/api/v1/users/:id/user` | Elimina l'account di un utente | 🔒 |
| `GET` | `/api/v1/rooms` | Recupera tutte le stanze (filtri: `?citta=`, `?prezzoMin=`, `?prezzoMax=`) | |
| `GET` | `/api/v1/rooms/mine` | Recupera gli annunci creati dall'utente loggato (Proprietario) | 🔒 |
| `GET` | `/api/v1/rooms/:id` | Recupera i dettagli di un singolo annuncio stanza | 🔒 |
| `POST` | `/api/v1/rooms` | Crea un nuovo annuncio stanza (solo per Proprietari) | 🔒 |
| `PUT` | `/api/v1/rooms/:id` | Aggiorna un annuncio stanza (solo per Proprietari) | 🔒 |
| `DELETE` | `/api/v1/rooms/:id` | Elimina un annuncio stanza (solo per Proprietari) | 🔒 |
| `GET` | `/api/v1/messages/conversations` | Recupera la lista delle conversazioni attive | 🔒 |
| `GET` | `/api/v1/messages/unread` | Recupera il numero totale di messaggi non letti | 🔒 |
| `GET` | `/api/v1/messages/:conChiId` | Recupera la cronologia messaggi con un utente specifico | 🔒 |
| `POST` | `/api/v1/messages` | Invia un messaggio | 🔒 |
| `PATCH` | `/api/v1/messages/read/:mittenteId` | Segna come letti i messaggi ricevuti da un utente | 🔒 |
| `DELETE` | `/api/v1/messages/:messaggioId` | Elimina un singolo messaggio | 🔒 |

---

## 🐳 9. Deployment locale con Docker e Nginx

Questo è il metodo **consigliato** per eseguire l'intero stack con un solo comando: avvia automaticamente MongoDB, il backend Node ed il frontend (servito da Nginx), pre-configurati per comunicare tra loro.

### 9.1 Preparazione

Dalla **cartella radice** del progetto (quella contenente `docker-compose.yml`):

Assicurarsi che nel file `.env` le variabili d'ambiente siano impostate per l'ambiente Docker:

```env
MONGODB_URI=mongodb://mongo:27017/uniroom_db
JWT_SECRET=inserisci_qui_la_tua_chiave_segreta_jwt
PORT=3000
FRONTEND_URL=http://localhost
```

### 9.2 Avvio dei container

```bash
# Esegue la build delle immagini e avvia tutti i servizi in background (-d = detached)
docker compose up --build -d
```

Al primo avvio Docker si occuperà di:
1. Scaricare l'immagine di `mongo:7`;
2. Compilare l'immagine del **backend** a partire da `Backend/Dockerfile`;
3. Compilare l'immagine del **frontend** mediante una **multi-stage build** (Node compila la SPA React → Nginx si occupa di servirla).

Una volta avviato:

| Servizio | URL / Porta |
|---|---|
| **Applicazione (frontend + API + WebSocket via proxy)** | http://localhost |
| **API Diretta (backend)** | http://localhost:3000 |
| **Swagger UI** | http://localhost:3000/api-docs |
| **MongoDB** | `localhost:27017` |

### 9.3 Popolare il database (seed)

Al primo avvio il database è vuoto. Eseguire il popolamento tramite lo script di seed **dentro** il container backend:

```bash
docker compose exec backend npm run seed
```

Ora puoi aprire **http://localhost** e accedere con un profilo di test (es. `cioccafra@gmail.com` / `password5`).

### 9.4 Il cuore del deployment: Nginx come reverse proxy

Il container `frontend` non si limita a servire i file statici della SPA: agisce da **reverse proxy** grazie al file `nginx/nginx.conf` (montato in sola lettura). In sintesi:

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;     # file statici della SPA
    index index.html;

    # SPA: ogni rotta non riconosciuta restituisce index.html (routing lato client)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Le chiamate API vengono inoltrate al backend
    location /api/ {
        proxy_pass http://backend:3000;   # "backend" = nome del servizio in Docker
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_buffering off;              
        proxy_request_buffering off;
    }

    # Le richieste di connessione WebSocket vengono inoltrate al backend
    location /socket.io/ {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Tre meccanismi fondamentali:
- **`try_files ... /index.html`** → fa funzionare il routing della SPA: ricaricando la pagina su un URL interno (like `/rooms/123`), viene comunque restituito `index.html` e React Router mostra la vista corretta.
- **`proxy_pass http://backend:3000`** → tutto ciò che inizia con `/api/` o `/socket.io/` viene inoltrato al backend. Frontend e backend condividono la **stessa origine** (eliminando i problemi di CORS).
- **Header `Upgrade` e `Connection`** → essenziali per i **WebSocket**: Nginx intercetta le richieste di upgrade di protocollo e le inoltra, stabilendo un canale WebSocket persistente e bidirezionale verso il backend.

### 9.5 Monitoraggio e log

```bash
# Stato dei container
docker compose ps

# Visualizza i log di tutti i servizi in tempo reale
docker compose logs -f

# Visualizza i log di un singolo servizio
docker compose logs -f backend
```

### 9.6 Spegnimento e rimozione

```bash
# Arresta i container (mantenendo i dati del DB)
docker compose stop

# Arresta e rimuove container e reti (mantenendo il volume del DB)
docker compose down

# Rimuove ANCHE il volume del database (ATTENZIONE: cancella tutti i dati!)
docker compose down -v
```

> 💾 **Persistenza dei dati**: MongoDB memorizza i dati nel volume Docker `mongo-data`. Con `docker compose down` (senza `-v`), i dati **sopravvivono** al riavvio. Solo `docker compose down -v` li cancella definitivamente.

---

## ⚡ 10. Comandi utili (cheat sheet)

```bash
# === Docker Compose (dalla cartella principale del progetto) ===
docker compose up --build -d           # build + avvio in background
docker compose up -d                   # avvio (senza ricompilare le immagini)
docker compose ps                      # stato dei servizi
docker compose logs -f backend         # log del backend in tempo reale
docker compose exec backend npm run seed    # popola il database
docker compose exec backend npm run clean   # svuota il database
docker compose exec backend sh         # apre una shell nel container backend
docker compose restart backend         # riavvia solo il servizio backend
docker compose down                    # arresta e rimuove i container
docker compose down -v                 # ... e rimuove anche il volume del database
docker compose build --no-cache        # ricompila le immagini da zero

# === Sviluppo locale Backend ===
cd Backend && npm install && npm run dev

# === Sviluppo locale Frontend ===
cd Frontend && npm install && npm run dev
```

---

## 🛠️ 11. Risoluzione dei problemi (troubleshooting)

| Problema | Possibile causa / Soluzione |
|---|---|
| Il backend non riesce a connettersi a MongoDB | Controlla `MONGODB_URI` in `.env`. Con Docker l'host deve essere `mongo`, localmente deve essere `localhost`. Verifica che l'istanza MongoDB locale o Atlas sia online. |
| `401 Unauthorized` / `403 Forbidden` nelle rotte | Token mancante o scaduto (effettua nuovamente il login), oppure stai tentando di eseguire azioni riservate ai Proprietari (es. creare o modificare annunci di stanze) con un account studente (ruolo: `inquilino`). |
| Messaggi di chat non inviati o non ricevuti in tempo reale | Connessione WebSocket fallita. Verifica le configurazioni di upgrade di Nginx (per Docker) o le regole del proxy di Vite. Controlla la console del browser per errori di connessione. |
| Pagina vuota ricaricando una rotta interna | Assicurati che la regola Nginx `try_files ... /index.html` sia attiva nella configurazione del container frontend, o che tu stia utilizzando il dev server di Vite. |
| Errori CORS in fase di sviluppo | Accertati di accedere al frontend tramite l'indirizzo `http://localhost:5173` (dev server di Vite) che fa da proxy per il backend. Non aprire i file `index.html` manualmente nel browser e non fare richieste dirette alla porta 3000. |
| `port is already allocated` | Una delle porte (80, 3000 o 27017) è già occupata da un altro processo. Terminalo o cambia la mappatura delle porte in `docker-compose.yml`. |
| Le modifiche al codice non si riflettono nei container | Le build dei container Docker sono memorizzate in cache. Forza la ricompilazione avviando con `docker compose up --build` o eseguendo `docker compose build --no-cache`. |
| Il catalogo annunci è vuoto | Esegui lo script di popolamento: `docker compose exec backend npm run seed` (Docker) o `npm run seed` all'interno della cartella Backend. |

---

## 👥 Sviluppatori del Progetto
Questo progetto è stato realizzato per l'esame di Fondamenti del Web da:
- **Giuseppe**
- **Francesca**
- **Pierpaolo**
