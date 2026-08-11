import { Request, Response } from "express";
import * as ingestService from "../service/ingestion.service.js";

export const ingestTelemetry = async (req: Request, res: Response) => {
  try {
    await ingestService.ingestTelemetry(req.projectId, req.body);

    res.status(202).json({
      status: true,
      message: "Telemetry accepted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
