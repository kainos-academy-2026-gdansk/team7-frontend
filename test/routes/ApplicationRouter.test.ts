import { describe, expect, it } from "vitest";

import router from "../../src/routes/ApplicationRouter";

type RouteLayer = {
  route?: {
    path: string;
    methods: Record<string, boolean>;
  };
};

describe("ApplicationRouter", () => {
  it("registers the application form routes", () => {
    const routes = (router as unknown as { stack: RouteLayer[] }).stack.flatMap((layer) => {
      if (!layer.route) {
        return [];
      }

      return Object.keys(layer.route.methods).map((method) => ({
        method,
        path: layer.route?.path,
      }));
    });

    expect(routes).toEqual([
      { method: "get", path: "/job-roles/:id/apply" },
      { method: "post", path: "/job-roles/:id/apply" },
    ]);
  });
});
