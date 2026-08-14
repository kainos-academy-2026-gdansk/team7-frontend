import { z } from "zod";
import { registrationPassword, requiredEmail } from "./formFields";

export const registerSchema = z.object({
  email: requiredEmail,
  password: registrationPassword,
});

export type RegisterDto = z.infer<typeof registerSchema>;
