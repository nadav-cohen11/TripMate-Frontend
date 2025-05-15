import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters"),
  email: z.string()
    .email("Please enter a valid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}); 