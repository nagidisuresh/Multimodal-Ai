'use strict';

const db = require('../config/db');

// POST /api/workspaces
async function createWorkspace(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, description = '', mode = 'learnable', language = 'en' } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Workspace name is required.' });
    }

    const validModes = ['learnable', 'visionvoice', 'visioncart', 'kitchenmate', 'healthlens', 'roadsense', 'cybershield'];
    const chosenMode = validModes.includes(mode) ? mode : 'learnable';
    const chosenLang = ['en', 'hi', 'te'].includes(language) ? language : 'en';

    const result = await db.query(
      `INSERT INTO workspaces (user_id, name, description, mode, language)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, description, mode, language, created_at, updated_at`,
      [userId, name.trim(), description.trim(), chosenMode, chosenLang]
    );

    res.status(201).json({
      workspace: result.rows[0],
      message: 'Workspace created successfully.'
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/workspaces
async function listWorkspaces(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT w.id, w.name, w.description, w.mode, w.language, w.created_at, w.updated_at,
              COUNT(f.id)::int AS file_count
       FROM workspaces w
       LEFT JOIN files f ON f.workspace_id = w.id
       WHERE w.user_id = $1
       GROUP BY w.id
       ORDER BY w.created_at DESC`,
      [userId]
    );

    res.json({
      workspaces: result.rows
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/workspaces/:id
async function getWorkspace(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const wsResult = await db.query(
      `SELECT id, name, description, mode, language, created_at, updated_at
       FROM workspaces
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (wsResult.rows.length === 0) {
      return res.status(404).json({ error: 'Workspace not found or unauthorized.' });
    }

    const filesResult = await db.query(
      `SELECT id, name, original_name, file_type, mime_type, size_bytes, storage_path, status, metadata, extracted_summary, created_at
       FROM files
       WHERE workspace_id = $1 AND user_id = $2
       ORDER BY created_at DESC`,
      [id, userId]
    );

    res.json({
      workspace: wsResult.rows[0],
      files: filesResult.rows
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/workspaces/:id
async function deleteWorkspace(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await db.query(
      `DELETE FROM workspaces
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Workspace not found or unauthorized.' });
    }

    // Also delete associated files and chunks
    await db.query('DELETE FROM files WHERE workspace_id = $1', [id]).catch(() => {});
    await db.query('DELETE FROM chunks WHERE workspace_id = $1', [id]).catch(() => {});
    await db.query('DELETE FROM conversations WHERE workspace_id = $1', [id]).catch(() => {});

    res.json({
      success: true,
      deletedId: id,
      message: 'Workspace deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createWorkspace,
  listWorkspaces,
  getWorkspace,
  deleteWorkspace
};
