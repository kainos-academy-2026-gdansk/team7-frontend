import { describe, expect, it } from "vitest";
import router from "../../src/routes/JobRoleRouter";

type RouteLayer = {
  route?: {
    path: string;
    methods: Record<string, boolean>;
  };
};

describe("JobRoleRouter", () => {
  it("registers every page route with the correct HTTP method", () => {
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
      { method: "get", path: "/" },
      { method: "get", path: "/job-roles" },
      { method: "get", path: "/job-roles/new" },
      { method: "post", path: "/job-roles/new" },
      { method: "get", path: "/job-roles/:id/edit" },
      { method: "post", path: "/job-roles/:id/edit" },
      { method: "get", path: "/job-roles/:id/delete" },
      { method: "post", path: "/job-roles/:id/delete" },
      { method: "get", path: "/job-roles/:id" },
    ]);
  });
});
