import z from "zod";

export const channelSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  location: z.string().min(2, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export const createMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  genre: z.string().min(2, "Genre is required"),
  director: z.string().min(2, "Director name is required"),

  cast: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) && parsed.length > 0;
    } catch {
      return false;
    }
  }, "Cast must be a valid JSON array of strings"),

  duration: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Duration must be a valid number",
  }),

  releaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),

  isPremium: z.string().refine((val) => val === "true" || val === "false", {
    message: "isPremium must be either 'true' or 'false'",
  }),

  price: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Price must be a valid number",
  }),
});

export const updateMovieSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(10).optional(),
  genre: z.string().optional(),
  director: z.string().optional(),
  categoryId: z.string().uuid().optional(),

  cast: z
    .string()
    .refine((val) => {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed);
      } catch {
        return false;
      }
    }, "Invalid cast format")
    .optional(),

  duration: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)))
    .optional(),
  releaseDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .optional(),
  isPremium: z.enum(["true", "false"]).optional(),
  price: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)))
    .optional(),
});
