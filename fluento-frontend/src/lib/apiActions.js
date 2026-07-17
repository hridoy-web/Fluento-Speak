import { authClient } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

async function getAuthHeaders() {
  const { data: session } = await authClient.getSession();
  const headers = {
    "Content-Type": "application/json",
  };
  if (session?.token) {
    headers["Authorization"] = `Bearer ${session.token}`;
  }
  return headers;
}

export const apiActions = {
  /** 1. Explore / Home / Filters API **/
  getAllLessons: async (queryParams = {}) => {
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await fetch(`${BASE_URL}/lessons?${queryString}`, {
      method: "GET",
      cache: "no-store",
    });
    return response.json();
  },

  /** 2. Public Lesson Details **/
  getLessonDetails: async (id) => {
    const response = await fetch(`${BASE_URL}/lessons/${id}`, {
      method: "GET",
      cache: "no-store",
    });
    return response.json();
  },

  /** 3. My Lessons Workspace (Protected Student Route) **/
  getMyLessons: async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/lessons/my-lessons`, {
      method: "GET",
      headers,
    });
    return response.json();
  },

  /** 4. Add New Lesson (Protected) **/
  addLesson: async (lessonData) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/lessons`, {
      method: "POST",
      headers,
      body: JSON.stringify(lessonData),
    });
    return response.json();
  },

  /** 5. Update Existing Lesson (Protected - Owner Only) **/
  updateLesson: async (id, updatedData) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/lessons/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(updatedData),
    });
    return response.json();
  },

  /** 6. Delete Lesson (Protected - Owner Only) **/
  deleteLesson: async (id) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/lessons/${id}`, {
      method: "DELETE",
      headers,
    });
    return response.json();
  },
};