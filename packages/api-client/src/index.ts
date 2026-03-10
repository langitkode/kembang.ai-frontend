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
  private _instance: AxiosInstance;

  constructor() {
    // Get baseURL from environment if available (for Next.js)
    let baseURL =
      typeof process !== "undefined"
        ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1"
        : "/api/v1";

    // Ensure baseURL ends with a slash for proper relative path concatenation
    if (baseURL && !baseURL.endsWith("/")) {
      baseURL += "/";
    }

    this._instance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 second timeout
    });

    // Add response interceptor for better error handling
    this._instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
          console.error(
            "❌ Network Error: Cannot connect to backend at",
            this._instance.defaults.baseURL,
          );
          console.error("Make sure your backend is running and accessible");
        } else if (error.response?.status === 401) {
          console.error("❌ Authentication Error: Invalid or expired token");
        } else if (error.response?.status === 404) {
          console.error("❌ Not Found:", error.config?.url);
        }
        return Promise.reject(error);
      },
    );
  }

  setBaseURL(url: string) {
    this._instance.defaults.baseURL = url;
    console.log("[API] BaseURL changed to:", url);
  }

  // Expose the axios instance for interceptors
  get instance() {
    return this._instance;
  }

  setApiKey(apiKey: string) {
    this._instance.defaults.headers.common["X-API-Key"] = apiKey;
  }

  setToken(token: string) {
    this._instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  setTenantId(tenantId: string) {
    this._instance.defaults.headers.common["X-Tenant-ID"] = tenantId;
    console.log("[API] Tenant-ID set to:", tenantId);
  }

  // Health & System Monitoring
  async getHealth(): Promise<any> {
    const baseURL = this._instance.defaults.baseURL?.replace('/api/v1/', '/') || 'http://127.0.0.1:8000/';
    const response = await axios.get(`${baseURL}health`);
    return response.data;
  }

  async getEmbeddingHealth(): Promise<any> {
    const baseURL = this._instance.defaults.baseURL?.replace('/api/v1/', '/') || 'http://127.0.0.1:8000/';
    const response = await axios.get(`${baseURL}health/embedding`);
    return response.data;
  }

  async getLLMHealth(): Promise<any> {
    const baseURL = this._instance.defaults.baseURL?.replace('/api/v1/', '/') || 'http://127.0.0.1:8000/';
    const response = await axios.get(`${baseURL}health/llm`);
    return response.data;
  }

  async getCircuitBreakers(): Promise<any> {
    const baseURL = this._instance.defaults.baseURL?.replace('/api/v1/', '/') || 'http://127.0.0.1:8000/';
    const response = await axios.get(`${baseURL}health/circuit-breakers`);
    return response.data;
  }

  // Widget Chat (uses X-API-Key header)
  async sendMessage(data: ChatRequest): Promise<ChatResponse> {
    const response = await this._instance.post<ChatResponse>(
      "widget/chat",
      data,
    );
    return response.data;
  }

  // Chat Message (uses Bearer token - for authenticated users)
  async sendChatMessage(data: ChatRequest): Promise<ChatResponse> {
    console.log("[API] Sending chat message to:", `${this._instance.defaults.baseURL}chat/message`);
    console.log("[API] Request data:", data);
    console.log("[API] Headers:", this._instance.defaults.headers.common);
    
    try {
      const response = await this._instance.post<ChatResponse>(
        "chat/message",
        data,
      );
      console.log("[API] Chat response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("[API] Chat message error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        code: error.code,
      });
      throw error;
    }
  }

  // FAQ Management
  async getFaqs(params?: any): Promise<any> {
    const response = await this._instance.get("faq", { params });
    return response.data;
  }

  async getFaqStats(): Promise<any> {
    const response = await this._instance.get("faq/stats");
    return response.data;
  }

  async createFaq(data: any): Promise<any> {
    const response = await this._instance.post("faq", data);
    return response.data;
  }

  async updateFaq(id: string, data: any): Promise<any> {
    const response = await this._instance.put(`faq/${id}`, data);
    return response.data;
  }

  async deleteFaq(id: string): Promise<any> {
    const response = await this._instance.delete(`faq/${id}`);
    return response.data;
  }

  async toggleFaq(id: string): Promise<any> {
    const response = await this._instance.post(`faq/${id}/toggle`);
    return response.data;
  }

  async getFaqCategories(): Promise<any> {
    const response = await this._instance.get("faq/templates/categories");
    return response.data;
  }

  async importFaqTemplate(category: string): Promise<any> {
    console.log("[FAQ] Importing template for category:", category);
    try {
      const response = await this._instance.post("faq/templates/import", {
        category: category,
      });
      console.log("[FAQ] Import response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("[FAQ] Import error:", error.response?.status, error.response?.data);
      throw error;
    }
  }

  // Auth
  async login(credentials: any) {
    const response = await this._instance.post("auth/login", credentials);
    return response.data;
  }

  async getMe() {
    const response = await this._instance.get("auth/me");
    return response.data;
  }

  // Chat Admin
  async getChatSessions(): Promise<any> {
    const response = await this._instance.get("chat/sessions");
    return response.data;
  }

  async getChatHistory(conversationId: string): Promise<any> {
    const response = await this._instance.get(`chat/history/${conversationId}`);
    return response.data;
  }

  // KB
  async getDocuments(): Promise<{ documents: any[] }> {
    const response = await this._instance.get("kb/documents");
    return response.data;
  }

  async uploadDocument(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await this._instance.post("kb/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  // Admin
  async getUsageStats(): Promise<any> {
    const response = await this._instance.get("admin/usage");
    return response.data;
  }

  async getApiKey(): Promise<{ api_key: string | null }> {
    const response = await this._instance.get("admin/api-key");
    return response.data;
  }

  async generateApiKey(): Promise<{ api_key: string }> {
    const response = await this._instance.post("admin/generate-api-key");
    return response.data;
  }

  // Product Management
  async getProducts(params?: any): Promise<any> {
    const response = await this._instance.get("products", { params });
    return response.data;
  }

  async getProductStats(): Promise<any> {
    const response = await this._instance.get("products/stats");
    return response.data;
  }

  async getLowStockProducts(threshold?: number): Promise<any> {
    const response = await this._instance.get("products/low-stock", {
      params: { threshold: threshold || 10 }
    });
    return response.data;
  }

  async createProduct(data: any): Promise<any> {
    const response = await this._instance.post("products", data);
    return response.data;
  }

  async updateProduct(id: string, data: any): Promise<any> {
    const response = await this._instance.put(`products/${id}`, data);
    return response.data;
  }

  async deleteProduct(id: string): Promise<any> {
    const response = await this._instance.delete(`products/${id}`);
    return response.data;
  }

  async getProductCatalogMetadata(): Promise<any> {
    const response = await this._instance.get("products/catalog/metadata");
    return response.data;
  }

  // Superadmin API Keys
  async getApiKeys(params?: any): Promise<any> {
    const response = await this._instance.get("superadmin/api-keys", { params });
    return response.data;
  }

  async revokeApiKey(id: string): Promise<any> {
    const response = await this._instance.post(`superadmin/api-keys/${id}/revoke`);
    return response.data;
  }

  // Superadmin (cross-tenant)
  async getPlatformStats(): Promise<any> {
    const response = await this._instance.get("superadmin/stats");
    return response.data;
  }

  async listAllTenants(): Promise<any> {
    const response = await this._instance.get("superadmin/tenants");
    return response.data;
  }

  async createTenant(data: {
    name: string;
    admin_email: string;
    admin_password: string;
  }): Promise<any> {
    const response = await this._instance.post("superadmin/tenants", data);
    return response.data;
  }

  async getGlobalUsage(): Promise<any> {
    const response = await this._instance.get("superadmin/usage");
    return response.data;
  }

  async getGlobalConversations(params?: any): Promise<any> {
    const response = await this._instance.get("superadmin/conversations/paginated", { params });
    return response.data;
  }

  async getGlobalChatHistory(conversationId: string): Promise<any> {
    const response = await this._instance.get(
      `superadmin/conversations/${conversationId}`,
    );
    return response.data;
  }

  async updateTenant(id: string, data: any): Promise<any> {
    const response = await this._instance.patch(
      `superadmin/tenants/${id}`,
      data,
    );
    return response.data;
  }

  async deleteTenant(id: string): Promise<any> {
    const response = await this._instance.delete(`superadmin/tenants/${id}`);
    return response.data;
  }

  async deleteDocument(id: string): Promise<any> {
    const response = await this._instance.delete(`kb/documents/${id}`);
    return response.data;
  }

  // User Management
  async listAllUsers(): Promise<any> {
    const response = await this._instance.get("superadmin/users");
    return response.data;
  }

  async listTeamUsers(): Promise<any> {
    const response = await this._instance.get("admin/users");
    return response.data;
  }

  async createUser(data: any): Promise<any> {
    const userRole = (await this.getMe()).role;
    const endpoint =
      userRole === "superadmin" ? "superadmin/users" : "admin/users";
    const response = await this._instance.post(endpoint, data);
    return response.data;
  }

  async updateUser(id: string, data: any): Promise<any> {
    const response = await this._instance.patch(`superadmin/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string): Promise<any> {
    const userRole = (await this.getMe()).role;
    const endpoint =
      userRole === "superadmin"
        ? `superadmin/users/${id}`
        : `admin/users/${id}`;
    const response = await this._instance.delete(endpoint);
    return response.data;
  }

  // Infrastructure / System Health (endpoints at root level, not /api/v1)
  async getSystemHealth(): Promise<any> {
    // Health endpoint is at root level (http://localhost:8000/health)
    const baseURL = this._instance.defaults.baseURL?.replace('/api/v1/', '/') || 'http://127.0.0.1:8000/';
    const response = await axios.get(`${baseURL}health`);
    return response.data;
  }

  async getSystemLogs(): Promise<any> {
    // Metrics endpoint is at root level (http://localhost:8000/metrics)
    const baseURL = this._instance.defaults.baseURL?.replace('/api/v1/', '/') || 'http://127.0.0.1:8000/';
    const response = await axios.get(`${baseURL}metrics`);
    return response.data;
  }
}

export const api = new ApiClient();
export default api;
