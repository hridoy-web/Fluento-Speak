import { authClient } from "@/lib/auth-client";

// BASE_URL 
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api";

async function getAuthHeaders() {
  const { data } = await authClient.getSession();
  const headers = {
    "Content-Type": "application/json",
  };
  if (data?.session?.token) {
    headers["Authorization"] = `Bearer ${data.session.token}`;
  }
  return headers;
}

// Helper to handle both JSON and non-JSON responses safely
async function handleResponse(response) {
  const contentType = response.headers.get("content-type");
  
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  } else {
    const text = await response.text();
    console.error("Non-JSON Server Response:", text);
    return {
      success: false,
      message: `Server Connection Error (${response.status}). Check backend route URL.`,
    };
  }
}

export const apiActions = {
  getAllLessons: async (queryParams = {}) => {
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await fetch(`${BASE_URL}/lessons?${queryString}`, {
      method: "GET",
      cache: "no-store",
    });
    return handleResponse(response);
  },

  getLatestHomeLessons: async () => {
    try {
      const response = await fetch(`${BASE_URL}/lessons/latest-home`, {
        method: "GET",
        cache: "no-store", 
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error in getLatestHomeLessons action:", error);
      return { success: false, data: [] };
    }
  },

  getLessonDetails: async (id) => {
    const response = await fetch(`${BASE_URL}/lessons/${id}`, {
      method: "GET",
      cache: "no-store",
    });
    return handleResponse(response);
  },

  getMyLessons: async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/lessons/my-lessons`, {
      method: "GET",
      headers,
    });
    return handleResponse(response);
  },

  addLesson: async (lessonData) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/lessons`, {
      method: "POST",
      headers,
      body: JSON.stringify(lessonData),
    });
    return handleResponse(response);
  },

  updateLesson: async (id, updatedData) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/lessons/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(updatedData),
    });
    return handleResponse(response);
  },

  deleteLesson: async (id) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/lessons/${id}`, {
      method: "DELETE",
      headers,
    });
    return handleResponse(response);
  },

  generateLessonWithAI: async (topic) => {
    try {
      const response = await fetch(`${BASE_URL}/ai/generate-lesson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('AI Generation API Error:', error);
      return { success: false, message: 'Server connection failed.' };
    }
  },

  sendMessageToAIChat: async (chatPayload) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${BASE_URL}/ai/chat-partner`, {
        method: "POST",
        headers,
        body: JSON.stringify(chatPayload), 
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error in sendMessageToAIChat action:", error);
      return { success: false, message: "Failed to connect to AI Chat Partner Service." };
    }
  },
};