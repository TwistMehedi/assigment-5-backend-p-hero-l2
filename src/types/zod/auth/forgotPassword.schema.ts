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

export const forgotEmailSchema = z.object({
  email: emailSchema,
});
