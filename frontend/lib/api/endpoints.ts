/**
 * Centralized API endpoint constants.
 * All routes here are derived from the backend's `api/router.py`.
 */

const API_BASE = "/api"

export const ENDPOINTS = {
  // Auth
  auth: {
    register: `${API_BASE}/register`,
    login: `${API_BASE}/login`,
    me: `${API_BASE}/me`,
  },

  // Users
  users: {
    list: `${API_BASE}/User/`,
    byId: (id: number) => `${API_BASE}/User/${id}`,
    create: `${API_BASE}/User/create-user`,
    updateRole: (id: number) => `${API_BASE}/User/${id}/role`,
    resetPassword: (id: number) =>
      `${API_BASE}/User/users/${id}/reset-password`,
    delete: (id: number) => `${API_BASE}/User/?user_id=${id}`,
  },

  // Tickets
  tickets: {
    myTickets: `${API_BASE}/Ticket/me`,
    assignedTickets: `${API_BASE}/Ticket/assigned`,
    all: `${API_BASE}/Ticket/`,
    create: `${API_BASE}/Ticket/`,
    byId: (id: number) => `${API_BASE}/Ticket/${id}`,
    update: (id: number) => `${API_BASE}/Ticket/${id}`,
    assign: (id: number) => `${API_BASE}/Ticket/${id}/assign`,
    status: (id: number) => `${API_BASE}/Ticket/${id}/status`,
    close: (id: number) => `${API_BASE}/Ticket/${id}/close`,
  },

  // Comments
  comments: {
    list: (ticketId: number) => `${API_BASE}/Comment/${ticketId}/comments`,
    create: (ticketId: number) => `${API_BASE}/Comment/${ticketId}/comments`,
  },
}
