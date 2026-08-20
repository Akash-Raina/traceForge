import express from "express";
import { ingestTelemetry } from "../controller/ingestion.controller.js";
import { createProject } from "../controller/project.controller.js";
import { getTrace, getTraces } from "../controller/trace.controller.js";
import { apiKeyAuth } from "../middleware/api-key.middleware.js";
import { validateApiKeyHeader, validateCreateProject, validateIngestionData, validateTraceParams } from "../middleware/validation.middleware.js";

const router = express.Router();

router.post('/project', validateCreateProject, createProject);
router.post('/ingest', validateApiKeyHeader, validateIngestionData, apiKeyAuth, ingestTelemetry);
router.get('/traces', validateApiKeyHeader, apiKeyAuth, getTraces);
router.get('/traces/:traceId', validateTraceParams, validateApiKeyHeader, apiKeyAuth, getTrace)

export default router;
