import { Request, Response } from "express";
import * as projectService from "../service/project.service.js";
export const createProject = async (req: Request, res: Response) => {
  try {
    const response = await projectService.createProject(req.body.name);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      response,
    });
  } catch (err) {
    res.status(500).json({
      message: "internal server error"
    })
  }
};
