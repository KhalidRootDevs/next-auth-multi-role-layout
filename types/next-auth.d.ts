import '@auth/core/jwt';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string;
      email: string;
      image?: string;
      role: 'admin' | 'manager' | 'support' | 'user';
      accessToken: string;
      refreshToken: string;
    };
  }

  interface User {
    id?: string;
    name?: string;
    email: string;
    role: 'admin' | 'manager' | 'support' | 'user';
    accessToken: string;
    refreshToken: string;
  }

  interface CredentialsInputs {
    email: string;
    password: string;
  }
}

declare module '@auth/core/types' {
  interface User {
    id?: string;
    name?: string;
    email: string;
    role: 'admin' | 'manager' | 'support' | 'user';
    accessToken: string;
    refreshToken: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string;
      email: string;
      image?: string;
      role: 'admin' | 'manager' | 'support' | 'user';
      accessToken: string;
      refreshToken: string;
    };
  }
}

declare module '@auth/core/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    name?: string;
    image?: string;
    role: 'admin' | 'manager' | 'support' | 'user';
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}
