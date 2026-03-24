import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Please provide a valid email address")
  .refine((val) => val.includes(".") && val.split(".").pop()!.length >= 2, {
    message: "Email domain must have a valid extension (e.g., .com, .net)",
  })
  .refine((val) => !val.endsWith("test.com") && !val.endsWith("example.com"), {
    message: "This email provider is not allowed",
  });

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
