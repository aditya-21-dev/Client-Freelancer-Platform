import Project from "../models/Project.js";

// Create a new project
export const createProject = async (data) => {
  const project = new Project(data);
  return project.save();
};

// Get all open projects with optional filters
export const getOpenProjects = async (filters = {}) => {
  const query = { status: "open" };

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.experience_level) {
    query.experience_level = filters.experience_level;
  }

  if (filters.skills && filters.skills.length > 0) {
    query.skills = { $all: filters.skills };
  }

  return Project.find(query).sort({ created_at: -1 });
};

// Get projects by client
export const getClientProjects = async (clientId) => {
  return Project.find({ client_id: clientId }).sort({ created_at: -1 });
};

// Get single project by id
export const getProjectById = async (id) => {
  return Project.findById(id).populate("client_id", "name rating totalReviews");
};

// Update project (only by owner)
export const updateProject = async (id, clientId, data) => {
  return Project.findOneAndUpdate(
    { _id: id, client_id: clientId },
    { $set: data },
    { new: true }
  );
};

// Delete project (only by owner)
export const deleteProject = async (id, clientId) => {
  return Project.findOneAndDelete({ _id: id, client_id: clientId });
};

