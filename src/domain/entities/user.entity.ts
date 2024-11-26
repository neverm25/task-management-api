import { Role, User } from "@prisma/client";

export type SignUpDto = {
  email: string;
  password: string;
  role: Role;
};

export type SignInDto = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};
