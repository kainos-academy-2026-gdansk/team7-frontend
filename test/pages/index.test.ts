import path from "node:path";
import nunjucks from "nunjucks";
import { describe, expect, it } from "vitest";

const env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(path.join(process.cwd(), "src", "views")),
  { autoescape: true },
);

describe("pages/index.njk", () => {
  it("fills the layout blocks", () => {
    const html = env.render("pages/index.njk");

    expect(html).toContain("<title>Home</title>");
    expect(html).toContain("Find your next role at Kainos");
    expect(html).toContain('alt="Kainos"');
  });
});
