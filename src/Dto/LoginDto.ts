import { z } from "zod";
import { requiredEmail, requiredPassword } from "./formFields";

export const loginSchema = z.object({
  email: requiredEmail,
  password: requiredPassword,
});

export type LoginDto = z.infer<typeof loginSchema>;
