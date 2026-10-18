import { Request, Response } from 'express';
import { ProjectModel } from '../models/Project.js';
import { getStorageMode, getLocalProjects, saveLocalProjects } from '../config/db.js';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { ownerId, guestSessionId } = req.query;
    const { isConnected } = getStorageMode();

    if (isConnected) {
      const query: any = {};
      if (ownerId) query.ownerId = ownerId;
      else if (guestSessionId) query.guestSessionId = guestSessionId;
      else return res.json([]);

      const projects = await ProjectModel.find(query).sort({ updatedAt: -1 });
      return res.json(projects);
    } else {
      const local = getLocalProjects();
      const filtered = local.filter((p) => {
        if (ownerId && p.ownerId === ownerId) return true;
        if (guestSessionId && p.guestSessionId === guestSessionId) return true;
        return false;
      });
      return res.json(filtered);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isConnected } = getStorageMode();

    if (isConnected) {
      const project = await ProjectModel.findById(id);
      if (!project) return res.status(404).json({ error: 'Project not found' });
      return res.json(project);
    } else {
      const local = getLocalProjects();
      const project = local.find((p) => p._id === id || p.id === id);
      if (!project) return res.status(404).json({ error: 'Project not found' });
      return res.json(project);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const projectData = req.body;
    const { isConnected } = getStorageMode();

    if (isConnected) {
      const newProj = new ProjectModel(projectData);
      const saved = await newProj.save();
      return res.status(201).json(saved);
    } else {
      const local = getLocalProjects();
      const newId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const saved = {
        ...projectData,
        _id: newId,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      local.unshift(saved);
      saveLocalProjects(local);
      return res.status(201).json(saved);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const { isConnected } = getStorageMode();

    if (isConnected) {
      const updated = await ProjectModel.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) return res.status(404).json({ error: 'Project not found' });
      return res.json(updated);
    } else {
      const local = getLocalProjects();
      const index = local.findIndex((p) => p._id === id || p.id === id);
      if (index === -1) return res.status(404).json({ error: 'Project not found' });

      local[index] = {
        ...local[index],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
      saveLocalProjects(local);
      return res.json(local[index]);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isConnected } = getStorageMode();

    if (isConnected) {
      await ProjectModel.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Project deleted' });
    } else {
      let local = getLocalProjects();
      local = local.filter((p) => p._id !== id && p.id !== id);
      saveLocalProjects(local);
      return res.json({ success: true, message: 'Project deleted' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const duplicateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isConnected } = getStorageMode();

    let original: any = null;
    if (isConnected) {
      original = await ProjectModel.findById(id);
    } else {
      const local = getLocalProjects();
      original = local.find((p) => p._id === id || p.id === id);
    }

    if (!original) return res.status(404).json({ error: 'Original project not found' });

    const duplicateData = {
      ...(original.toObject ? original.toObject() : original),
      title: `${original.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    delete duplicateData._id;
    delete duplicateData.id;

    if (isConnected) {
      const newProj = new ProjectModel(duplicateData);
      const saved = await newProj.save();
      return res.status(201).json(saved);
    } else {
      const local = getLocalProjects();
      const newId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const saved = {
        ...duplicateData,
        _id: newId,
        id: newId,
      };
      local.unshift(saved);
      saveLocalProjects(local);
      return res.status(201).json(saved);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
