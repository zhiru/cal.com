import type { Prisma } from "@prisma/client";
import type { NextApiRequest } from "next";

import { HttpError } from "@calcom/lib/http-error";
import { defaultResponder } from "@calcom/lib/server";
import { OrganizationRepository } from "@calcom/lib/server/repository/organization";
import prisma from "@calcom/prisma";

import { withMiddleware } from "~/lib/helpers/withMiddleware";
import { schemaQuerySingleOrMultipleUserEmails } from "~/lib/validations/shared/queryUserEmail";
import { schemaUsersReadPublic } from "~/lib/validations/user";

/**
 * @swagger
 * /users:
 *   get:
 *     operationId: listUsers
 *     summary: Find all users.
 *     parameters:
 *       - in: query
 *         name: apiKey
 *         required: true
 *         schema:
 *           type: string
 *         description: Your API key
 *       - in: query
 *         name: email
 *         required: false
 *         schema:
 *          type: array
 *          items:
 *            type: string
 *            format: email
 *         style: form
 *         explode: true
 *         description: The email address or an array of email addresses to filter by
 *     tags:
 *     - users
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *        description: Authorization information is missing or invalid.
 *       404:
 *         description: No users were found
 */
export async function getHandler(req: NextApiRequest) {
  const {
    userId,
    isSystemWideAdmin,
    isOrganizationOwnerOrAdmin,
    pagination: { take, skip },
  } = req;
  let where: Prisma.UserWhereInput = {};
  // If user is not ADMIN, return only his data.
  if (!isSystemWideAdmin || !isOrganizationOwnerOrAdmin) where.id = userId;

  if (isOrganizationOwnerOrAdmin) {
    const org = await OrganizationRepository.getUserOrganization({ userId });
    if (!org) throw new HttpError({ message: "Organization not found", statusCode: 404 });
    where = { ...where, teams: { some: { teamId: org.id } } };
  }

  if (req.query.email) {
    const validationResult = schemaQuerySingleOrMultipleUserEmails.parse(req.query);
    where.email = {
      in: Array.isArray(validationResult.email) ? validationResult.email : [validationResult.email],
    };
  }

  const [total, data] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({ where, take, skip }),
  ]);
  const users = schemaUsersReadPublic.parse(data);
  return { users, total };
}

export default withMiddleware("pagination")(defaultResponder(getHandler));
