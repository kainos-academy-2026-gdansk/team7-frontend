import path from "node:path";
import express from "express";
import nunjucks from "nunjucks";
import JobRoleRouter from "./routes/JobRoleRouter";

const app = express();

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

export default app;
