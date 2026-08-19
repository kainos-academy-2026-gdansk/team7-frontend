import { z } from "zod";
import { requiredText } from "./formFields";

export const CreateApplicationSchema = z.object({
  experience: requiredText("your experience", 1000),
  salaryExpectation: requiredText("your salary expectations", 100),
  skills: requiredText("your skills", 2000),
});

export type CreateApplicationDto = z.infer<typeof CreateApplicationSchema>;
