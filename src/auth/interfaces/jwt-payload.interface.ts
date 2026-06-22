export interface JwtPayload {
  sub: string; // usually user id
  email: string;
  iat?: number; // issued at
  exp?: number; // expires at
}
