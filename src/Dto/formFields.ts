import { z } from "zod";

const blankToNull = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? null : value;

const toNumber = (value: unknown) =>
  typeof value === "string" && value.trim() !== "" ? Number(value) : value;

export const requiredText = (label: string, max: number) =>
  z
    .string({ error: `Enter ${label}` })
    .trim()
    .min(1, `Enter ${label}`)
    .max(max, `${label} must not exceed ${max} characters`);

export const optionalText = (label: string, max: number) =>
  z.preprocess(
    blankToNull,
    z.string().trim().max(max, `${label} must not exceed ${max} characters`).nullable(),
  );

export const selectedId = (label: string) =>
  z.preprocess(
    toNumber,
    z
      .number({ error: `Select ${label}` })
      .int(`Select ${label}`)
      .positive(`Select ${label}`),
  );

export const selectedName = (label: string) =>
  z
    .string({ error: `Select ${label}` })
    .trim()
    .min(1, `Select ${label}`);

export const optionalOpenPositions = z.preprocess(
  (value) => toNumber(blankToNull(value)),
  z
    .number({ error: "Enter the number of open positions as a whole number" })
    .int("Enter the number of open positions as a whole number")
    .nonnegative("Open positions cannot be negative")
    .nullable(),
);

export const optionalUrl = z.preprocess(
  blankToNull,
  z.url({ error: "Enter a valid link, for example https://example.com/role" }).nullable(),
);

export const optionalClosingDate = z.preprocess((value) => {
  const date = blankToNull(value);
  return typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? `${date}T00:00:00.000Z`
    : date;
}, z.iso.datetime({ error: "Enter a closing date in the format YYYY-MM-DD" }).nullable());

export const requiredEmail = z
  .string({ error: "Enter your email address" })
  .trim()
  .min(1, "Enter your email address")
  .pipe(z.email({ error: "Enter an email address in the correct format, like name@example.com" }));

// Hasło bez .trim(), bo spacja na początku lub na końcu jest w nim prawidłowym znakiem.
export const requiredPassword = z
  .string({ error: "Enter your password" })
  .min(1, "Enter your password");
