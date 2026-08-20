import { ingestionSchema } from "@traceforge/shared";
import { NextFunction, Request, Response } from "express";
import { apiKeyHeaderSchema } from "../schema/api-key.schema.js";
import { createProjectSchema } from "../schema/project.schema.js";
import { traceParamsSchema } from "../schema/trace.schema.js";

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

export const validateApiKeyHeader = (
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

export const validateTraceParams = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = traceParamsSchema.safeParse(req.params);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid trace ID",
    });
  }

  next();
};
