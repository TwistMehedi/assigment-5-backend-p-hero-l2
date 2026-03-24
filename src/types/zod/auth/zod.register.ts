import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address")
    .refine((val) => val.includes(".") && val.split(".").pop()!.length >= 2, {
      message: "Email domain must have a valid extension (e.g., .com, .net)",
    })
    .refine(
      (val) => !val.endsWith("test.com") && !val.endsWith("example.com"),
      {
        message: "This email provider is not allowed",
      },
    ),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),

  role: z
    .string()
    .refine((val) => ["ADMIN", "CUSTOMER", "PROVIDER"].includes(val), {
      message: "Please select a valid role",
    }),
});
