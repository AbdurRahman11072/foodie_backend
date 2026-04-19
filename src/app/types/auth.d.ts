export type AuthType = {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'provider' | 'admin';
  restaurantId: string;
  banned: boolean;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthType;
    }
  }
}
