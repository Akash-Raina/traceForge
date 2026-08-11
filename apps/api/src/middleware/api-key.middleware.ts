import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { hashApiKey } from "../utils/api-Key.js";

export const ingestionAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apikey = req.headers["x-api-key"] as string;

  const apiKeyHash = hashApiKey(apikey);

  const project = await prisma.project.findUnique({
    where: {
      apiKeyHash,
    },
    select: {
      id: true,
    },
  });
  if (!project)
    return res.status(401).json({
      success: false,
      message: "Invalid api key",
    });

  req.projectId = project.id;

  next();
};
