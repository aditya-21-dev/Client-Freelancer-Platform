import {
  createProject as createProjectService,
  getOpenProjects,
  getClientProjects,
  getProjectById,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService
} from "../services/projectService.js";

// Basic payload validation for project creation/update
const validateProjectPayload = (body) => {
  const errors = [];

  if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
    errors.push("Title is required");
  } else if (body.title.length > 120) {
    errors.push("Title must be at most 120 characters");
  }

  if (!body.description || typeof body.description !== "string" || body.description.trim().length === 0) {
    errors.push("Description is required");
  }

  if (!body.budget_type || !["fixed", "hourly"].includes(body.budget_type)) {
    errors.push("Budget type must be 'fixed' or 'hourly'");
  }

  if (
    body.budget_min === undefined ||
    body.budget_max === undefined ||
    Number.isNaN(Number(body.budget_min)) ||
    Number.isNaN(Number(body.budget_max))
  ) {
    errors.push("Budget range is required");
  }

  if (!Array.isArray(body.skills) || body.skills.length === 0) {
    errors.push("At least one skill is required");
  }

  return errors;
};

export const createProject = async (req, res) => {
  try {
    const {
      client_id,
      title,
      description,
      skills,
      budget_type,
      budget_min,
      budget_max,
      duration,
      experience_level,
      category,
      attachments
    } = req.body;

    if (!client_id) {
      return res.status(400).json({ message: "client_id is required" });
    }

    const errors = validateProjectPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const project = await createProjectService({
      client_id,
      title: title.trim(),
      description: description.trim(),
      skills,
      budget_type,
      budget_min,
      budget_max,
      duration,
      experience_level,
      category,
      attachments
    });

    return res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ message: "Failed to create project" });
  }
};

export const getAllOpenProjects = async (req, res) => {
  try {
    const { category, experience_level, skills } = req.query;

    const filters = {};
    if (category) filters.category = category;
    if (experience_level) filters.experience_level = experience_level;
    if (skills) {
      // skills can be comma-separated string
      filters.skills = skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const projects = await getOpenProjects(filters);
    return res.json(projects);
  } catch (error) {
    console.error("Error fetching open projects:", error);
    return res.status(500).json({ message: "Failed to fetch projects" });
  }
};

export const getProjectsForClient = async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!clientId) {
      return res.status(400).json({ message: "clientId is required" });
    }

    const projects = await getClientProjects(clientId);
    return res.json(projects);
  } catch (error) {
    console.error("Error fetching client projects:", error);
    return res.status(500).json({ message: "Failed to fetch client projects" });
  }
};

export const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await getProjectById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({ message: "Failed to fetch project" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { client_id } = req.body;

    if (!client_id) {
      return res.status(400).json({ message: "client_id is required" });
    }

    const errors = validateProjectPayload({ ...req.body, client_id });
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const updated = await updateProjectService(id, client_id, req.body);

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Project not found or you are not the owner" });
    }

    return res.json(updated);
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({ message: "Failed to update project" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { client_id } = req.body;

    if (!client_id) {
      return res.status(400).json({ message: "client_id is required" });
    }

    const deleted = await deleteProjectService(id, client_id);

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Project not found or you are not the owner" });
    }

    return res.json({ message: "Project deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({ message: "Failed to delete project" });
  }
};

