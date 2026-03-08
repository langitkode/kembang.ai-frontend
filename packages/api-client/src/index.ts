import axios, { AxiosInstance } from "axios";

export interface ChatRequest {
  message: string;
  user_identifier?: string;
  conversation_id?: string;
}

export interface ChatResponse {
  reply: string;
  conversation_id: string;
  user_identifier: string;
  sources: string[];
}

class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string = "/api/v1") {
    this.instance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  setApiKey(apiKey: string) {
    this.instance.defaults.headers.common["X-API-Key"] = apiKey;
  }

  setToken(token: string) {
    this.instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // Widget Chat
  async sendMessage(data: ChatRequest): Promise<ChatResponse> {
    const response = await this.instance.post<ChatResponse>(
      "/widget/chat",
      data,
    );
    return response.data;
  }

  // Auth
  async login(credentials: any) {
    const response = await this.instance.post("/auth/login", credentials);
    return response.data;
  }

  async getMe() {
    const response = await this.instance.get("/auth/me");
    return response.data;
  }

  // KB
  async uploadDocument(tenantId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await this.instance.post(
      `/kb/upload/${tenantId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  }
}

export const api = new ApiClient();
export default api;
