// API Service layer connecting Expo frontend to FastAPI backend

const DEFAULT_API_URL = "https://lingopeer-backend-psi.vercel.app";

export const getApiBaseUrl = (): string => {
  const envUrl =
    process.env.EXPO_PUBLIC_BACKEND_URL ||
    process.env.EXPO_BACKEND_URL ||
    DEFAULT_API_URL;
  return envUrl.endsWith("/") ? envUrl.slice(0, -1) : envUrl;
};

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const baseUrl = getApiBaseUrl();
  const normalizedPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${normalizedPath}`;

  const [pathOnly, queryOnly] = normalizedPath.split("?");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-invoke-path": pathOnly,
    ...(options.headers as Record<string, string>),
  };

  if (queryOnly) {
    headers["x-invoke-query"] = queryOnly;
  }

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorJson.message || errorDetail;
    } catch {}
    throw new Error(errorDetail);
  }

  const data = await response.json();
  if (data && typeof data === "object" && (data as any).message === "FastAPI route not found") {
    throw new Error(`API route not found: ${(data as any).requested_path || endpoint}`);
  }

  return data;
};

// ---------------------------------------------------------------------------
// Auth Types & API
// ---------------------------------------------------------------------------
export interface UserProfile {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
  created_at?: string;
}

export interface AuthResponse {
  user?: UserProfile;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  message?: string;
}

export interface OAuthUrlResponse {
  url: string;
  provider: string;
}

// ---------------------------------------------------------------------------
// Agents & Chat Types
// ---------------------------------------------------------------------------
export interface AIAgentItem {
  id: string;
  name: string;
  avatarBg: string;
  avatarEmoji: string;
  style: string;
  vibe: string;
  levelRange: string;
  isFormal?: boolean;
  description?: string;
}

export interface CorrectionItem {
  original: string;
  corrected: string;
  explanation: string;
}

export interface VocabularyTipItem {
  word: string;
  translation: string;
  example: string;
}

export interface ChatMessageItem {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  corrections?: CorrectionItem[];
  vocabulary_tips?: VocabularyTipItem[];
  created_at: string;
}

export interface ChatSessionItem {
  id: string;
  user_id: string;
  agent_id: string;
  language: string;
  title: string;
  system_prompt?: string;
  created_at: string;
  updated_at: string;
  messages?: ChatMessageItem[];
}

export interface ChatTurnResult {
  session_id: string;
  user_message: ChatMessageItem;
  tutor_reply: ChatMessageItem;
  corrections: CorrectionItem[];
  vocabulary_tips: VocabularyTipItem[];
  xp_earned: number;
}

export interface UserProgressData {
  user_id: string;
  language: string;
  total_xp: number;
  streak_days: number;
  words_learned: number;
  sessions_completed: number;
  last_practice_date: string;
}

export const api = {
  // Authentication
  login: async (payload: { email: string; password: string }) => {
    const res = await request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res.access_token) {
      setAuthToken(res.access_token);
    }
    return res;
  },

  register: async (payload: {
    email: string;
    password: string;
    full_name?: string;
    metadata?: Record<string, any>;
  }) => {
    const res = await request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res.access_token) {
      setAuthToken(res.access_token);
    }
    return res;
  },

  getGoogleAuthUrl: (redirectTo?: string) => {
    const query = redirectTo ? `?redirect_to=${encodeURIComponent(redirectTo)}` : "";
    return request<OAuthUrlResponse>(`/api/auth/google/url${query}`);
  },

  exchangeOAuthCode: async (code: string, redirectTo?: string) => {
    const query = redirectTo
      ? `?code=${encodeURIComponent(code)}&redirect_to=${encodeURIComponent(redirectTo)}`
      : `?code=${encodeURIComponent(code)}`;
    const res = await request<AuthResponse>(`/api/auth/callback${query}`);
    if (res.access_token) {
      setAuthToken(res.access_token);
    }
    return res;
  },

  handleOAuthCallbackUrl: async (callbackUrl: string, redirectTo?: string) => {
    try {
      const hashIndex = callbackUrl.indexOf("#");
      const queryIndex = callbackUrl.indexOf("?");
      const hashParams = hashIndex !== -1 ? new URLSearchParams(callbackUrl.substring(hashIndex + 1)) : null;
      const queryParams = queryIndex !== -1 ? new URLSearchParams(callbackUrl.substring(queryIndex + 1).split("#")[0]) : null;

      const accessToken = hashParams?.get("access_token") || queryParams?.get("access_token");
      if (accessToken) {
        setAuthToken(accessToken);
        return { access_token: accessToken };
      }

      const code = queryParams?.get("code") || hashParams?.get("code");
      if (code) {
        return await api.exchangeOAuthCode(code, redirectTo);
      }
    } catch (e) {
      console.warn("Error parsing OAuth callback url:", e);
    }
    return null;
  },

  loginWithGoogleIdToken: async (idToken: string) => {
    const res = await request<AuthResponse>("/api/auth/google/id-token", {
      method: "POST",
      body: JSON.stringify({ id_token: idToken }),
    });
    if (res.access_token) {
      setAuthToken(res.access_token);
    }
    return res;
  },

  getMe: () => request<UserProfile>("/api/auth/me"),

  logout: async () => {
    try {
      await request<{ message: string; success: boolean }>("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      setAuthToken(null);
    }
  },

  // Agents
  getAgents: () => request<AIAgentItem[]>("/api/agents"),
  getAgent: (agentId: string) => request<AIAgentItem>(`/api/agents/${agentId}`),

  // Chat Sessions
  createChatSession: (payload: {
    agent_id: string;
    language?: string;
    title?: string;
    custom_prompt?: string;
  }) =>
    request<ChatSessionItem>("/api/chat/sessions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getChatSession: (sessionId: string) =>
    request<ChatSessionItem>(`/api/chat/sessions/${sessionId}`),

  listChatSessions: () =>
    request<ChatSessionItem[]>("/api/chat/sessions"),

  // Messaging (LangGraph Execution)
  sendMessage: (sessionId: string, content: string) =>
    request<ChatTurnResult>(`/api/chat/sessions/${sessionId}/message`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),

  // User Progress
  getUserProgress: (language: string = "Spanish") =>
    request<UserProgressData>(`/api/user/progress?language=${encodeURIComponent(language)}`),
};
