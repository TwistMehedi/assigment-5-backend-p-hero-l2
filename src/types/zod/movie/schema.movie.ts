import z from "zod";

export const channelSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  location: z.string().min(2, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});
