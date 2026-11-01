import {
  UserProfile,
  LoginRequest,
  RegisterRequest,
  PatchedProfile,
  SpecializationChoiceItem,
  ApiErrorResponse,
} from '../types/api';

const DEFAULT_BASE_URL = 'https://inai-col2.fishrungames.com';

// Listeners for network loading status ("плашка загрузки")
type LoadingListener = (activeCount: number, message: string) => void;
const loadingListeners: Set<LoadingListener> = new Set();
let activeRequests = 0;

export function subscribeToLoading(listener: LoadingListener): () => void {
  loadingListeners.add(listener);
  return () => {
    loadingListeners.delete(listener);
  };
}

function notifyLoading(message: string = '') {
  loadingListeners.forEach((fn) => fn(activeRequests, message));
}

export function getApiBaseUrl(): string {
  const custom = localStorage.getItem('spotify_band_api_base');
  return custom ? custom.replace(/\/+$/, '') : DEFAULT_BASE_URL;
}

export function setApiBaseUrl(url: string): void {
  if (!url || !url.trim()) {
    localStorage.removeItem('spotify_band_api_base');
  } else {
    localStorage.setItem('spotify_band_api_base', url.trim().replace(/\/+$/, ''));
  }
}

export function getStoredSessionId(): string | null {
  return localStorage.getItem('spotify_band_session_id');
}

export function setStoredSessionId(id: string | null): void {
  if (id) {
    localStorage.setItem('spotify_band_session_id', id);
  } else {
    localStorage.removeItem('spotify_band_session_id');
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  loadingLabel: string = 'Загрузка...'
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  activeRequests++;
  notifyLoading(loadingLabel);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const sessionId = getStoredSessionId();
  if (sessionId) {
    headers['Session-Id'] = sessionId;
  }

  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Ensures session cookie is automatically sent cross-origin
      headers,
    });

    // Check for session ID in response headers if returned or cookies
    const respSession = response.headers.get('Session-Id');
    if (respSession) {
      setStoredSessionId(respSession);
    }

    if (!response.ok) {
      let errorData: ApiErrorResponse = {};
      try {
        errorData = await response.json();
      } catch {
        // Not a JSON response
      }

      // Build descriptive error message
      let message = errorData.detail || '';
      if (!message) {
        const fieldErrors: string[] = [];
        for (const [field, errors] of Object.entries(errorData)) {
          if (Array.isArray(errors)) {
            fieldErrors.push(`${field}: ${errors.join(', ')}`);
          } else if (typeof errors === 'string') {
            fieldErrors.push(`${field}: ${errors}`);
          }
        }
        if (fieldErrors.length > 0) {
          message = fieldErrors.join(' | ');
        }
      }

      if (!message) {
        message = `Ошибка сервера: ${response.status} ${response.statusText}`;
      }

      const error = new Error(message) as Error & { status: number; data: ApiErrorResponse };
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // If 204 or empty body
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    return data as T;
  } finally {
    activeRequests = Math.max(0, activeRequests - 1);
    notifyLoading();
  }
}

export const api = {
  // Авторизация / Вход в систему
  async login(credentials: LoginRequest): Promise<UserProfile> {
    return request<UserProfile>(
      '/api/login/',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      'Вход в систему...'
    );
  },

  // Регистрация нового музыканта
  async register(credentials: RegisterRequest): Promise<UserProfile> {
    return request<UserProfile>(
      '/api/register/',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      'Регистрация музыканта...'
    );
  },

  // Выход из системы
  async logout(): Promise<void> {
    try {
      await request(
        '/api/logout/',
        {
          method: 'POST',
        },
        'Выход из профиля...'
      );
    } finally {
      setStoredSessionId(null);
    }
  },

  // Получение профиля текущего пользователя
  async getProfile(): Promise<UserProfile> {
    return request<UserProfile>(
      '/api/profile/',
      {
        method: 'GET',
      },
      'Синхронизация профиля...'
    );
  },

  // Частичное обновление профиля
  async updateProfile(profile: PatchedProfile): Promise<UserProfile> {
    return request<UserProfile>(
      '/api/profile/',
      {
        method: 'PATCH',
        body: JSON.stringify(profile),
      },
      'Сохранение изменений...'
    );
  },

  // Список доступных специализаций для выпадающего списка
  async getSpecializations(): Promise<SpecializationChoiceItem[]> {
    return request<SpecializationChoiceItem[]>(
      '/api/specializations/',
      {
        method: 'GET',
      },
      'Загрузка специализаций...'
    );
  },
};
