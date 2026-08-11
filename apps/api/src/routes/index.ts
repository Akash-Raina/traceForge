import express from "express";
import { createProject } from "../controller/project.controller.js";
import { validateCreateProject, validateIngestionData, validateIngestionHeader } from "../middleware/validation.middleware.js";
import { ingestionAuth } from "../middleware/api-key.middleware.js";

const router = express.Router();

router.post('/project', validateCreateProject, createProject);
router.post('/ingest', validateIngestionHeader, validateIngestionData, ingestionAuth, );

export default router;
