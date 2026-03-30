import { z } from "zod";

export const createSeriesSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  director: z.string().optional(),

  cast: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) && parsed.length > 0;
    } catch {
      return false;
    }
  }, "Cast must be a valid JSON array of strings"),

  price: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Price must be a valid number",
    })
    .optional(),

  isPremium: z.string().refine((val) => val === "true" || val === "false", {
    message: "isPremium must be either 'true' or 'false'",
  }),

  releaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),

  genre: z.string().min(2, "Genre is required"),
});

export const updateSeriesSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  director: z.string().optional(),

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

  price: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Price must be a valid number",
    })
    .optional(),

  isPremium: z
    .string()
    .refine((val) => val === "true" || val === "false", {
      message: "isPremium must be either 'true' or 'false'",
    })
    .optional(),
});

export const createSessionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  seasonNumber: z
    .number()
    .int()
    .positive("Season number must be a positive integer"),
  seasonId: z.string().min(1, "Season ID is required"),
});

export const updateSessionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  seasonNumber: z
    .number()
    .int()
    .positive("Season number must be a positive integer")
    .optional(),
  seasonId: z.string().min(1, "Season ID is required").optional(),
});

export const createEpisodeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  episodeNumber: z
    .number()
    .int()
    .positive("Episode number must be a positive integer"),
  description: z
    .string()
    .max(200, "Description must be at most 200 characters")
    .optional(),
  duration: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Duration must be a valid number",
    })
    .optional(),
  seasonId: z.string().min(1, "Season ID is required"),
});
