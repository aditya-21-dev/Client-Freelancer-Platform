import express from "express";
import {
  createProject,
  getAllOpenProjects,
  getProjectsForClient,
  getProject,
  updateProject,
  deleteProject
} from "../controllers/projectController.js";

const router = express.Router();

// Create project
router.post("/", createProject);

// Get all open projects (freelancer feed, with optional filters)
router.get("/", getAllOpenProjects);

// Get projects for a specific client
router.get("/client/:clientId", getProjectsForClient);

// Get single project by id
router.get("/:id", getProject);

// Update project
router.put("/:id", updateProject);

// Delete project
router.delete("/:id", deleteProject);

export default router;

