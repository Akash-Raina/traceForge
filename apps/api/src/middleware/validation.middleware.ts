import { NextFunction, Request, Response } from "express";
import { apiKeyHeaderSchema } from "../schema/api-key.schema.js";
import { ingestionSchema } from "../schema/ingestion.schema.js";
import { createProjectSchema } from "../schema/project.schema.js";

export const validateCreateProject = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = createProjectSchema.safeParse(req.body);
  if (!result.success)
    return res.status(401).json({
      success: false,
      message: "Invalid Input",
    });
  req.body = result.data;
  next();
};

export const validateIngestionData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = ingestionSchema.safeParse(req.body);

  if (!result.success)
    return res.status(401).json({
      success: false,
      message: "Invalid Input",
    });

  req.body = result.data;

  next();
};

export const validateIngestionHeader = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = apiKeyHeaderSchema.safeParse({
    "x-api-key": req.headers["x-api-key"],
  });

  if (!result.success) {
    return res.status(401).json({
      error: "API key is required",
    });
  }

  next();
};
