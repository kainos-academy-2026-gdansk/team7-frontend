import path from "node:path";
import express from "express";
import session from "express-session";
import nunjucks from "nunjucks";
import type { UserRole } from "./models/Auth";
import AuthRouter from "./routes/AuthRouter";
import JobRoleRouter from "./routes/JobRoleRouter";

const app = express();

declare module "express-session" {
  interface SessionData {
    authToken?: string;
    authRole?: UserRole;
  }
}

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret && process.env.NODE_ENV !== "test") {
  throw new Error("SESSION_SECRET must be set");
}

app.use(
  session({
    secret: sessionSecret ?? "test-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  }),
);

app.use((req, res, next) => {
  res.locals.isAuthenticated = Boolean(req.session.authToken);
  res.locals.isProfileUser = req.session.authRole === "USER";
  res.locals.isAdmin = req.session.authRole === "ADMIN";
  next();
});

const env = nunjucks.configure(
  [
    path.join(__dirname, "..", "src", "views"),
    path.join(__dirname, "..", "node_modules", "govuk-frontend", "dist"),
  ],
  {
    autoescape: true,
    express: app,
    noCache: true,
  },
);

env.addGlobal("currentYear", () => new Date().getFullYear());

env.addFilter("formatDate", (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : "Not specified",
);

app.use(
  "/assets",
  express.static(
    path.join(__dirname, "..", "node_modules", "govuk-frontend", "dist", "govuk", "assets"),
  ),
);

app.get("/govuk-frontend.min.css", (_req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "node_modules",
      "govuk-frontend",
      "dist",
      "govuk",
      "govuk-frontend.min.css",
    ),
  );
});

app.get("/govuk-frontend.min.js", (_req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "node_modules",
      "govuk-frontend",
      "dist",
      "govuk",
      "govuk-frontend.min.js",
    ),
  );
});
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

app.use("/", JobRoleRouter);
app.use("/", AuthRouter);

export default app;
