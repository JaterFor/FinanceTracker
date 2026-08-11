import type {
  Account,
  Category,
  CreateAccountInput,
  CreateCategoryInput,
  CreateTransactionInput,
  LoginInput,
  LoginResponse,
  Transaction,
} from './schemas';

export interface ApiClientOptions {
  baseUrl: string;
  getToken: () => string | null | Promise<string | null>;
}

export interface ApiClient {
  login: (input: LoginInput) => Promise<LoginResponse>;
  listTransactions: () => Promise<Transaction[]>;
  createTransaction: (input: CreateTransactionInput) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  listCategories: () => Promise<Category[]>;
  createCategory: (input: CreateCategoryInput) => Promise<Category>;
  listAccounts: () => Promise<Account[]>;
  createAccount: (input: CreateAccountInput) => Promise<Account>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createApiClient({ baseUrl, getToken }: ApiClientOptions): ApiClient {
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = await getToken();
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new ApiError(res.status, body || res.statusText);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  return {
    login: (input) =>
      request<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify(input) }),
    listTransactions: () => request<Transaction[]>('/transactions'),
    createTransaction: (input) =>
      request<Transaction>('/transactions', { method: 'POST', body: JSON.stringify(input) }),
    deleteTransaction: (id) => request<void>(`/transactions/${id}`, { method: 'DELETE' }),
    listCategories: () => request<Category[]>('/categories'),
    createCategory: (input) =>
      request<Category>('/categories', { method: 'POST', body: JSON.stringify(input) }),
    listAccounts: () => request<Account[]>('/accounts'),
    createAccount: (input) =>
      request<Account>('/accounts', { method: 'POST', body: JSON.stringify(input) }),
  };
}
