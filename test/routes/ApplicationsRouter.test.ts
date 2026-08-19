import { describe, expect, it } from "vitest";
import router from "../../src/routes/ApplicationsRouter";

type RouteLayer = {
  route?: {
    path: string;
    methods: Record<string, boolean>;
  };
};

describe("ApplicationsRouter", () => {
  it("registers application list, confirmation and status-change routes", () => {
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
      { method: "get", path: "/admin/job-roles/:jobRoleId/applications/:applicationId/hire" },
      { method: "post", path: "/admin/job-roles/:jobRoleId/applications/:applicationId/hire" },
      { method: "get", path: "/admin/job-roles/:jobRoleId/applications/:applicationId/reject" },
      { method: "post", path: "/admin/job-roles/:jobRoleId/applications/:applicationId/reject" },
      { method: "get", path: "/admin/job-roles/:id/applications" },
    ]);
  });
});
