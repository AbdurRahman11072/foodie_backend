export type AuthType = {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'provider' | 'admin';
  banned: boolean;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthType;
    }
  }
}
