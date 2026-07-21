import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const getHeaders = () => {
  const tokenData = localStorage.getItem('skillxchange_tokens');
  if (tokenData) {
    const { access } = JSON.parse(tokenData);
    if (access && access !== "mock") {
      return { Authorization: `Bearer ${access}` };
    }
  }
  return {};
};

export const api = {
  // Skills explorer endpoints
  searchUsers: async (searchQuery = '', type = '', major = '', rating = '') => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (type) params.append('type', type);
      if (major) params.append('major', major);
      if (rating) params.append('rating', rating);

      const response = await axios.get(`${API_BASE_URL}/skills/search/?${params.toString()}`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (e) {
      console.warn("Backend explore search failed, utilizing local fallback filters.");
      throw e;
    }
  },

  // Proposal exchange requests endpoints
  getExchanges: async () => {
    const response = await axios.get(`${API_BASE_URL}/exchanges/`, { headers: getHeaders() });
    return response.data;
  },

  createExchange: async (receiverEmail, learnSkill, teachSkill, message = '') => {
    const response = await axios.post(`${API_BASE_URL}/exchanges/`, {
      receiver_email: receiverEmail,
      learn_skill: learnSkill,
      teach_skill: teachSkill,
      message
    }, { headers: getHeaders() });
    return response.data;
  },

  updateExchangeStatus: async (exchangeId, action) => {
    const response = await axios.post(`${API_BASE_URL}/exchanges/${exchangeId}/${action}/`, {}, {
      headers: getHeaders()
    });
    return response.data;
  },

  // Sessions and Scheduling endpoints
  getSessions: async () => {
    const response = await axios.get(`${API_BASE_URL}/sessions/`, { headers: getHeaders() });
    return response.data;
  },

  createSession: async (sessionPayload) => {
    const response = await axios.post(`${API_BASE_URL}/sessions/`, sessionPayload, {
      headers: getHeaders()
    });
    return response.data;
  },

  completeSession: async (sessionId) => {
    const response = await axios.post(`${API_BASE_URL}/sessions/${sessionId}/complete/`, {}, {
      headers: getHeaders()
    });
    return response.data;
  },

  // Review & reputation ratings endpoints
  getReviews: async (userEmail) => {
    const response = await axios.get(`${API_BASE_URL}/sessions/reviews/?user_email=${userEmail}`, {
      headers: getHeaders()
    });
    return response.data;
  },

  createReview: async (reviewPayload) => {
    const response = await axios.post(`${API_BASE_URL}/sessions/reviews/`, reviewPayload, {
      headers: getHeaders()
    });
    return response.data;
  },

  // Chat message thread logs
  getChatRooms: async () => {
    const response = await axios.get(`${API_BASE_URL}/chat/rooms/`, { headers: getHeaders() });
    return response.data;
  },

  getMessages: async (partnerEmail) => {
    const response = await axios.get(`${API_BASE_URL}/chat/messages/?partner=${partnerEmail}`, {
      headers: getHeaders()
    });
    return response.data;
  },

  sendMessage: async (receiverEmail, message) => {
    const response = await axios.post(`${API_BASE_URL}/chat/messages/`, {
      receiver_email: receiverEmail,
      message
    }, { headers: getHeaders() });
    return response.data;
  }
};
