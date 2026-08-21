import { Request, Response } from "express";
import * as traceService from "../service/trace.service.js";

export const getTraces = async (req: Request, res: Response) => {
  try {
    const traces = await traceService.getTraces(req.projectId);

    res.status(200).json({
      success: true,
      data: traces,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const getTrace = async (req: Request, res: Response) => {
  try {
    const traceId = req.params.traceId as string;
    const trace = await traceService.getTrace(req.projectId, traceId);

    if (!trace) {
      res.status(400).json({
        success: false,
        message: "traceId not found",
      });
    }
    res.status(200).json({
      success: true,
      trace,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
