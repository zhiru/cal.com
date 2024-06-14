import prismaMock from "../../../../../../../tests/libs/__mocks__/prismaMock";

import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import { describe, test } from "vitest";

import handler from "../../../pages/api/users/_get";

type CustomNextApiRequest = NextApiRequest & Request;
type CustomNextApiResponse = NextApiResponse & Response;

describe("GET /api/users", () => {
  describe("organization scope", () => {
    test("Can get users in an organization", async () => {
      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "GET",
        body: {},
      });
      await prismaMock.team.create({
        teamId: 1,
        isOrganization: false,
      });
      req.isSystemWideAdmin = true;

      await handler(req, res);
      return;
    });
  });
});
