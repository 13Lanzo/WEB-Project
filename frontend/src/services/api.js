const API_BASE = "/api/v1";

// Funzione helper per eseguire le richieste HTTP al backend includendo automaticamente
// l'header Authorization se presente un token JWT nel localStorage.
async function request(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json", ...options.headers };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

    // Se il token è scaduto o non valido, effettua il logout automatico del client
    // (escludendo gli endpoint di autenticazione per consentire la visualizzazione degli errori di login)
    if ((res.status === 401 || res.status === 403) && !endpoint.includes("/auth/")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
        }
        throw new Error("Sessione scaduta o non autorizzata. Effettua nuovamente l'accesso.");
    }

    if (!res.ok) {
        let errData = {};
        try {
            errData = await res.json();
        } catch (error) {
            console.error("Errore durante il parsing della risposta di errore:", error);
        }
        throw new Error(errData.errore || errData.error || errData.messaggio || errData.message || "Errore del server");
    }

    if (res.status === 204) return null;
    return await res.json();
}

//! ========= Tag: Authentication =========
export async function login(email, password) {
    return request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export async function register(userData) {
    return request("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
    });
}

//! ========= Tag: Users =========
export async function getAllUsers() {
    return request("/users/users");
}

export async function searchUsers(q) {
    return request(`/users/search?q=${encodeURIComponent(q)}`);
}

export async function getUser(id) {
    return request(`/users/${id}/user`);
}

export async function updateUser(id, data) {
    return request(`/users/${id}/user`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteUser(id) {
    return request(`/users/${id}/user`, {
        method: "DELETE",
    });
}

//! ========= Tag: Rooms =========
export async function getRooms(filters = {}) {
    const params = new URLSearchParams();
    if (filters.citta !== undefined && filters.citta !== null && filters.citta !== "") params.set("citta", filters.citta);
    if (filters.prezzoMin !== undefined && filters.prezzoMin !== null && filters.prezzoMin !== "") params.set("prezzoMin", filters.prezzoMin);
    if (filters.prezzoMax !== undefined && filters.prezzoMax !== null && filters.prezzoMax !== "") params.set("prezzoMax", filters.prezzoMax);
    const query = params.toString() ? `?${params}` : "";
    return request(`/rooms${query}`);
}

export async function getMyRooms() {
    return request("/rooms/mine");
}

export async function getRoom(id) {
    return request(`/rooms/${id}`);
}

export async function createRoom(roomData) {
    return request("/rooms", {
        method: "POST",
        body: JSON.stringify(roomData),
    });
}

export async function updateRoom(id, roomData) {
    return request(`/rooms/${id}`, {
        method: "PUT",
        body: JSON.stringify(roomData),
    });
}

export async function deleteRoom(id) {
    return request(`/rooms/${id}`, {
        method: "DELETE",
    });
}

//! ========= Tag: Messages =========
export async function getConversations() {
    return request("/messages/conversations");
}

export async function getUnreadMessages() {
    return request("/messages/unread");
}

export async function getMessages(conChiId) {
    return request(`/messages/${conChiId}`);
}

export async function createMessage(destinatarioId, testo) {
    return request("/messages", {
        method: "POST",
        body: JSON.stringify({ destinatarioId, testo }),
    });
}

export async function markMessagesAsRead(mittenteId) {
    return request(`/messages/read/${mittenteId}`, {
        method: "PATCH",
    });
}

export async function deleteMessage(messaggioId) {
    return request(`/messages/${messaggioId}`, {
        method: "DELETE",
    });
}
