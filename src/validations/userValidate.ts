import { z } from "zod";

export const registerInput = z.object({
  name: z.string().min(3).max(100).trim(),
  email: z.string().email("Invalid email").trim().lowercase(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(225),
  profileImage: z.string().optional(),
});

export type IUser = z.infer<typeof registerInput>;

export const loginInput = z.object({
  email: z.string().email("Invalid email").trim().lowercase(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(225),
});

export type ILogin = z.infer<typeof loginInput>