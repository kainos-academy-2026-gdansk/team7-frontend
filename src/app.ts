import path from "node:path";
import express from "express";
import nunjucks from "nunjucks";
const app = express();

nunjucks.configure(
  [
    path.join(__dirname, "views"),
    path.join(__dirname, "..", "node_modules", "govuk-frontend", "dist"),
  ],
  {
    autoescape: true,
    express: app,
    noCache: true,
  },
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

app.use(
  "/govuk-frontend.min.js",
  express.static(
    path.join(
      __dirname,
      "..",
      "node_modules",
      "govuk-frontend",
      "dist",
      "govuk",
      "govuk-frontend.min.js",
    ),
  ),
);
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

app.get("/", (_req, res) => {
  res.render("pages/index.njk");
});
export default app;
