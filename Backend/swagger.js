const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Uniroom API Documentazione",
      version: "1.0.0",
      description:
        "Documentazione ufficiale delle API REST per la piattaforma Room4U\n\nrealizzato da Giuseppe, Francesca e Pierpaolo",
      contact: {
        name: "Giuseppe, Francesca e Pierpaolo",
      },
    },
    servers: [
      {
        url: "http://localhost:" + (process.env.PORT || 5000),
        description: "Server di Sviluppo Locale",
      },
    ],
    tags: [
      { name: "AuthController", description: "Registrazione e autenticazione utente" },
      { name: "UserController", description: "Gestione profilo utente" },
      { name: "RoomsController", description: "Gestione stanze" },
      { name: "MessageController", description: "Gestione messaggi / chat" },
      { name: "default", description: "Health check" }
    ],
    paths: {
      "/api/auth/register": {
        post: {
          tags: ["AuthController"],
          summary: "Registrazione nuovo utente",
          description: "Crea un account nel database cifrando la password e salvando le preferenze.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RegisterRequest"
                }
              }
            }
          },
          responses: {
            201: {
              description: "Utente registrato con successo.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/User"
                  }
                }
              }
            },
            400: {
              description: "Campi obbligatori mancanti."
            }
          }
        }
      },
      "/api/auth/login": {
        post: {
          tags: ["AuthController"],
          summary: "Login utente",
          description: "Verifica le credenziali dell'utente e restituisce un messaggio di successo con token JWT.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginRequest"
                }
              }
            }
          },
          responses: {
            200: {
              description: "Login effettuato con successo.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/LoginResponse"
                  }
                }
              }
            },
            401: {
              description: "Credenziali errate."
            }
          }
        }
      },
      "/api/users/users": {
        get: {
          tags: ["UserController"],
          summary: "Elenco utenti",
          description: "Restituisce un array con tutti i profili degli utenti registrati.",
          responses: {
            200: {
              description: "Elenco degli utenti recuperato con successo.",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/User"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/users/search":{
        get:{
          tags: ['UserController'],
          summary: 'Cerca utenti',
          description:'Cerca attraverso input i nomi degli utenti nel DB',
          parameters:[{
            name:'q', 
            in: 'query', 
            required:true, 
            schema:{type:'string'}, 
            description: 'Nome, cognome o email da cercare'}],
            responses:{200:{description:'Risultati ricerca.'}}
        }, 500: {
              description: "Errore nella ricerca utenti."}
    },
    "/api/users/{id}/user": {
      get: {
          tags: ["UserController"],
          summary: "Dettaglio utente", // Matching screenshot style or description
          security: [{ bearerAuth: [] }],
          description: "Mostra i dettagli di uno studente o host tramite il suo ID per la pagina del profilo o il matchmaking.",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string"
              },
              description: "L'ID univoco (ObjectId) dell'utente"
            }
          ],
          responses: {
            200: {
              description: "Profilo recuperato con successo.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/User"
                  }
                }
              }
            },
            404: {
              description: "Utente non trovato."
            }
          }
        },
        put: {
          tags: ["UserController"],
          summary: "Aggiorna profilo",
          security: [{ bearerAuth: [] }],
          description: "Permette di modificare la bio, l'età o l'array dei tag delle preferenze.",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string"
              }
            }
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    bio: {
                      type: "string",
                      example: "Studente Poliba. Amo l'automazione."
                    },
                    tagPreferenze: {
                      type: "array",
                      items: {
                        type: "string"
                      },
                      example: ["ordinato", "studio-notturno"]
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: "Profilo aggiornato con successo.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/User"
                  }
                }
              }
            }
          }
        },
        delete: {
          tags: ["UserController"],
          summary: "Elimina utente",
          description: "Permette di eliminare l'account di un utente registrato tramite ID.",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string"
              }
            }
          ],
          responses: {
            200: {
              description: "Profilo eliminato con successo."
            },
            404: {
              description: "Utente non trovato."
            }
          }
        }
      },
    "/api/rooms":{
      get:{
          tags:['RoomsController'],
          summary:'Elenco stanze',
          description: 'Cerca stanze in Ricerca.jsx',
          parameters:[
            {name: 'citta',
              in: 'query',
              schema:{type:'string'}},
            {name: 'prezzoMin',
              in: 'query',
              schema:{type: 'number'}
            },
            {name: 'prezzoMax',
              in: 'query',
              schema:{type: 'number'}
            }
          ],
          responses: {200:{description:'Elenco stanze'}}
      },
      post:{
          tags:['RoomsController'],
          summary: 'Solo il proprietario può creare una nuova stanza',
          description: "creazione della stanza dopo la verifica che l'utente sia proprietario",
          security: [{ bearerAuth: [] }],
          requestBody:{
            required:true,
            content:{
              'application/json':{
                schema:{
                  type:'object',
                  required:['titolo', 'descrizione','prezzo','citta','indirizzo','superficie','arredamento'],
                  properties:{
                    titolo: {type: 'string', example: 'Stanza Luminosa'},
                    descrizione: { type: "string", example: "Ottima per studenti" },
                    prezzo: { type: "number", example: 300 },
                    citta: { type: "string", example: "Bari" },
                    indirizzo: { type: "string", example: "Via Roma 10" },
                    superficie: { type: "number", example: 20 },
                    arredamento: { type: "number", example: 1 },
                    disponibilita:{type:'string', example: '2 giugno'},
                    postiLettoTotali: { type: "number", example: 1 },
                    postiLettoDisponibili: { type: "number", example: 1 },
                    inquiliniAssegnati: { type: "string", example: "" },
                    abitantiNonRegistrati: { type: "string", example: "Mario Rossi" }
                  }
                }
              }
            }
          },
          responses:{
            201: {description:'Stanza creata'}
          }
      }
    },
      "/api/rooms/mine":{
        get:{
          tags:['RoomsController'],
          summary: 'Area Riservata',
          description: 'Cerca le stanze compatibili al mio Id per la mia area riservata',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Elenco stanze del proprietario loggato." } }
        }
      },
      "/api/rooms/{id}": {
        get: {
          tags: ["RoomsController"],
          summary: "Dettaglio singola stanza",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Dettagli stanza recuperati." } }
        },
        put: {
          tags: ["RoomsController"],
          summary: "Modifica annuncio stanza",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    titolo: { type: "string" },
                    prezzo: { type: "number" }
                  }
                }
              }
            }
          },
          responses: { 200: { description: "Stanza aggiornata." } }
        },
        delete: {
          tags: ["RoomsController"],
          summary: "Cancella stanza",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Stanza eliminata." } }
        }
      },
      "/api/messages/conversations":{
        get:{
          tags:['MessageController'],
          summary: 'Recupera conversazoni attive',
          description: 'Conversazioni nella sidebar',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Lista interlocutori." } }
        }
      },
      "/api/messages/unread": {
        get: {
          tags: ["MessageController"],
          summary: "Recupera messaggi non letti (Notifiche)",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Lista e conteggio messaggi non letti." } }
        }
      },
      "/api/messages/{conChiId}": {
        get: {
          tags: ["MessageController"],
          summary: "Recupera storico chat",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "conChiId", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Storico chat recuperato." } }
        }
      },
      "/api/messages": {
        post: {
          tags: ["MessageController"],
          summary: "Invia nuovo messaggio",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["destinatarioId", "testo"],
                  properties: {
                    destinatarioId: { type: "string" },
                    testo: { type: "string" }
                  }
                }
              }
            }
          },
          responses: { 201: { description: "Messaggio inviato." } }
        }
      },
      "/api/messages/read/{mittenteId}": {
        patch: {
          tags: ["MessageController"],
          summary: "Segna messaggi come letti",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "mittenteId", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Messaggi aggiornati." } }
        }
      },
      "/api/messages/{messaggioId}": {
        delete: {
          tags: ["MessageController"],
          summary: "Elimina messaggio",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "messaggioId", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Messaggio eliminato." } }
        }
      },
      "/health": {
        get: {
          tags: ["default"],
          summary: "Health check",
          description: "Verifica lo stato di salute del server.",
          responses: {
            200: {
              description: "Server attivo e funzionante.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      messagge: { type: "string", example: "Server attivo e funzionante!" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Inserisci il tuo token JWT per autorizzare le chiamate.",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            nome: { type: "string" },
            cognome: { type: "string" },
            email: { type: "string" },
            eta: { type: "integer" },
            ruolo: { type: "string", enum: ["inquilino", "proprietario"] },
            tagPreferenze: { type: "array", items: { type: "string" }, example: ["ordinato", "non fumatore", "studente"]},
            bio: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Room: {
          type: "object",
          properties: {
            id: { type: "string" },
            titolo: { type: "string" },
            descrizione: { type: "string" },
            prezzo: { type: "number" },
            citta: { type: "string" },
            indirizzo: { type: "string" },
            creatoDa: { type: "string" },
            superficie: { type: "number" },
            arredamento: { type: "number" },
            postiLettoTotali: { type: "number" },
            postiLettoDisponibili: { type: "number" },
            inquiliniAssegnati: { type: "string" },
            inquiliniNonRegistrati: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Message: {
          type: "object",
          properties: {
            id: { type: "string" },
            mittente: { type: "string" },
            destinatario: { type: "string" },
            testo: { type: "string" },
            letto: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        RegisterRequest: {
          type: "object",
          required: ["nome", "cognome", "email", "password", "eta", "ruolo"],
          properties: {
            nome: { type: "string", example: "Giuseppe" },
            cognome: { type: "string", example: "Test" },
            email: { type: "string", example: "giuseppe.test@poliba.it" },
            password: { type: "string", example: "PasswordSicura123" },
            eta: { type: "integer", example: 22 },
            ruolo: { type: "string", enum: ["inquilino", "proprietario"], example: "inquilino" },
            tagPreferenze: { type: "array", items: { type: "string" }, example: ["ordinato", "non-fumatore"] },
            bio: { type: "string", example: "Studente di Ingegneria Informatica." }
          }
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "giuseppe.test@poliba.it" },
            password: { type: "string", example: "PasswordSicura123" }
          }
        },
        LoginResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            messaggio: { type: "string", example: "Login effettuato con successo!" },
            token: { type: "string" },
            utente: {
              type: "object",
              properties: {
                id: { type: "string" },
                nome: { type: "string" },
                email: { type: "string" },
                ruolo: { type: "string" }
              }
            }
          }
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            messaggio: { type: "string", example: "Errore interno del server." },
            dettaglio: { type: "string" }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [], // Do not parse external files, take configuration directly from here
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = swaggerDocs;
