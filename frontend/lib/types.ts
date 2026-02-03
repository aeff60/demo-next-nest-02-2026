export interface User {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'MANAGER';
  authSource: 'LOCAL' | 'LDAP';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LdapLoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}