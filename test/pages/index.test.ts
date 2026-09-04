import path from "node:path";
import nunjucks from "nunjucks";
import { describe, expect, it } from "vitest";

const env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(path.join(process.cwd(), "src", "views")),
  { autoescape: true },
);

env.addGlobal("currentYear", () => new Date().getFullYear());

describe("pages/index.njk", () => {
  it("fills the layout blocks", () => {
    const html = env.render("pages/index.njk");

    expect(html).toContain("<title>Home</title>");
    expect(html).toContain("Find your next role at Kainos");
    expect(html).toContain('alt="Kainos"');
    expect(html).toContain('alt="A job seeker aiming for their next role at Kainos"');
    expect(html).toContain("Digital services");
    expect(html).toContain('href="/job-roles">View job roles</a>');
    expect(html).toContain('href="https://www.kainos.com/digital-services"');
    expect(html).toContain("About us");
    expect(html).toContain('href="https://www.kainos.com/about-us"');
    expect(html).not.toContain("careers.kainos.com");
  });
});
