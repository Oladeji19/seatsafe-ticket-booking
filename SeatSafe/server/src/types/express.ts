export type AuthUser = {
  userId: string;
  role: 'user' | 'admin';
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
