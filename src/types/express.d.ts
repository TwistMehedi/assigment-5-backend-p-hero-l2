interface IGlobalUser {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IGlobalUser;
    }
  }
}

export {};
