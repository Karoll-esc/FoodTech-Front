const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface ApiErrorPayload {
  error: string;
  message: string;
  status: number;
  path: string;
  timestamp: string;
}

export class ApiError extends Error {
  status: number;
  path: string;
  timestamp: string;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.status = payload.status;
    this.path = payload.path;
    this.timestamp = payload.timestamp;
    this.name = payload.error;
  }
}

type AccessTokenProvider = (() => Promise<string>) | null;

let accessTokenProvider: AccessTokenProvider = null;

export const registerAccessTokenProvider = (provider: () => Promise<string>) => {
  accessTokenProvider = provider;
};

const buildHeaders = async (requiresAuth: boolean) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth && accessTokenProvider) {
    const token = await accessTokenProvider();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let payload: ApiErrorPayload = {
      error: 'HTTP_ERROR',
      message: `HTTP error! status: ${response.status}`,
      status: response.status,
      path: response.url,
      timestamp: new Date().toISOString(),
    };

    try {
      payload = await response.json();
    } catch {
      // Ignore JSON parse errors; fallback payload already set
    }

    throw new ApiError(payload);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};

class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string, requiresAuth = true): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: await buildHeaders(requiresAuth),
    });

    return handleResponse<T>(response);
  }

  async post<T, R>(endpoint: string, data: T, requiresAuth = true): Promise<R> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: await buildHeaders(requiresAuth),
      body: JSON.stringify(data),
    });

    return handleResponse<R>(response);
  }

  async patch<T>(endpoint: string, data?: unknown, requiresAuth = true): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: await buildHeaders(requiresAuth),
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  }

  async put<T, R>(endpoint: string, data: T, requiresAuth = true): Promise<R> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: await buildHeaders(requiresAuth),
      body: JSON.stringify(data),
    });

    return handleResponse<R>(response);
  }

  async delete(endpoint: string, requiresAuth = true): Promise<void> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: await buildHeaders(requiresAuth),
    });

    await handleResponse(response);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
