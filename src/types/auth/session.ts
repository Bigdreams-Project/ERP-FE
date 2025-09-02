export type Session = {
  user: {
    id: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
};
