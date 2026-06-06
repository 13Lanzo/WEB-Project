const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Uniroom API Documentazione",
      version: "1.0.0",
      description:
        "Documentazione ufficiale delle API REST per la piattaforma UniRoom\n\nrealizzato da Giuseppe, Francesca e Pierpaolo",
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
      "/api/users/{id}/user": {
        get: {
          tags: ["UserController"],
          summary: "Dettaglio utente", // Matching screenshot style or description
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
      "/api/rooms/{id}/rooms": {
        post: {
          tags: ["RoomsController"],
          summary: "Crea stanza",
          description: "Permette a un utente proprietario o coinquilino di pubblicare un annuncio per una stanza.",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string"
              },
              description: "L'ID dell'utente che crea la stanza"
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["titolo", "descrizione", "prezzo", "citta", "indirizzo"],
                  properties: {
                    titolo: { type: "string", example: "Splendida singola vicino a Poliba" },
                    descrizione: { type: "string", example: "Luminosa, silenziosa, con balcone privato." },
                    prezzo: { type: "number", example: 300 },
                    citta: { type: "string", example: "Bari" },
                    indirizzo: { type: "string", example: "Via Re David 10" },
                    serviziInclusi: { type: "array", items: { type: "string" }, example: ["Wi-Fi", "Aria Condizionata"] }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: "Stanza creata con successo.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Room"
                  }
                }
              }
            }
          }
        }
      },
      "/api/rooms/rooms": {
        get: {
          tags: ["RoomsController"],
          summary: "Elenco stanze",
          description: "Restituisce un array contenente tutti gli annunci delle stanze disponibili.",
          responses: {
            200: {
              description: "Elenco delle stanze recuperato con successo.",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Room"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/rooms/{id}/rooms/{stanzaId}": {
        get: {
          tags: ["RoomsController"],
          summary: "Dettaglio stanza",
          description: "Mostra le informazioni dettagliate su una stanza specifica tramite il suo ID.",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "L'ID dell'utente"
            },
            {
              name: "stanzaId",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "L'ID della stanza"
            }
          ],
          responses: {
            200: {
              description: "Dettagli stanza recuperati con successo.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Room"
                  }
                }
              }
            },
            404: {
              description: "Stanza non trovata."
            }
          }
        },
        put: {
          tags: ["RoomsController"],
          summary: "Modifica stanza",
          description: "Permette di aggiornare i campi dell'annuncio della stanza da parte del proprietario.",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
            { name: "stanzaId", in: "path", required: true, schema: { type: "string" } }
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    titolo: { type: "string" },
                    descrizione: { type: "string" },
                    prezzo: { type: "number" }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: "Stanza aggiornata con successo."
            }
          }
        },
        delete: {
          tags: ["RoomsController"],
          summary: "Cancella stanza",
          description: "Permette al proprietario di cancellare definitivamente l'annuncio.",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
            { name: "stanzaId", in: "path", required: true, schema: { type: "string" } }
          ],
          responses: {
            200: {
              description: "Stanza eliminata con successo."
            }
          }
        }
      },
      "/api/messages/{id}/messages": {
        post: {
          tags: ["MessageController"],
          summary: "Salva messaggio",
          description: "Registra la transazione del messaggio tra mittente e destinatario.",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["mittente", "destinatario", "testo"],
                  properties: {
                    mittente: { type: "string", example: "6a12f544c411ee6d0a7b055f" },
                    destinatario: { type: "string", example: "6a12f623c411ee6d0a7b0560" },
                    testo: { type: "string", example: "Ciao! La stanza è ancora disponibile?" }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: "Messaggio inviato e salvato.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Message"
                  }
                }
              }
            }
          }
        }
      },
      "/api/messages/{id}/messages/{conChiId}": {
        get: {
          tags: ["MessageController"],
          summary: "Recupera messaggi",
          description: "Estrae tutti i messaggi scambiati tra l'utente corrente (mioId) e l'interlocutore (conChiId).",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID dell'utente" },
            { name: "conChiId", in: "path", required: true, schema: { type: "string" }, description: "ID dell'altro utente" },
            { name: "mioId", in: "query", required: true, schema: { type: "string" }, description: "ID utente corrente" }
          ],
          responses: {
            200: {
              description: "Storico messaggi recuperato con successo.",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Message"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/messages/{id}/messages/{mittenteId}": {
        patch: {
          tags: ["MessageController"],
          summary: "Segna messaggi come letti",
          description: "Aggiorna lo stato di lettura (letto = true) di tutti i messaggi ricevuti in una conversazione.",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
            { name: "mittenteId", in: "path", required: true, schema: { type: "string" } }
          ],
          responses: {
            200: {
              description: "Messaggi aggiornati come letti con successo."
            }
          }
        }
      },
      "/api/messages/{id}/messages/{messaggioId}": {
        delete: {
          tags: ["MessageController"],
          summary: "Elimina messaggio",
          description: "Rimuove permanentemente un messaggio inviato per errore dal database.",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
            { name: "messaggioId", in: "path", required: true, schema: { type: "string" } }
          ],
          responses: {
            200: {
              description: "Messaggio eliminato."
            },
            404: {
              description: "Messaggio non trovato."
            }
          }
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
                      messagge: {
                        type: "string",
                        example: "Server attivo e funzionante!"
                      }
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
            tagPreferenze: { type: "array", items: { type: "string" } },
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
            creatoDa: { type: "string", description: "ID dell'utente proprietario" },
            serviziInclusi: { type: "array", items: { type: "string" } },
            disponibile: { type: "boolean" },
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
