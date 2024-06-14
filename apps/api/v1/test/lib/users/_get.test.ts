import prismaMock from "../../../../../../tests/libs/__mocks__/prisma";

import type { Request, Response } from "express";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import { describe, test } from "vitest";

import handler from "../../../pages/api/users/_get";

type CustomNextApiRequest = NextApiRequest & Request;
type CustomNextApiResponse = NextApiResponse & Response;

// vi.mock("~/lib/helpers/withMiddleware", () => {
//   return;
// });

describe("GET /api/users", () => {
  describe("organization scope", () => {
    test("Can get users in an organization", async () => {
      const { req, res } = createMocks<CustomNextApiRequest, CustomNextApiResponse>({
        method: "GET",
        body: {},
      });
      await prismaMock.team.create({
        data: {
          id: 1,
          name: "Non-org team",
          isOrganization: false,
        },
      });
      req.isSystemWideAdmin = true;
      req.userId = 123;

      const response = await handler(req, res);
      console.log("🚀 ~ test ~ response:", response);
    });
  });
});
