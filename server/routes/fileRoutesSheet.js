// routes/fileRoutes.js
import express from 'express';
import File from '../models/File.js';

const router = express.Router();

router.post('/files/:id/save-sheet', async (req, res) => {
  const { id } = req.params;
  const { fileName, routeUsed } = req.body;

  try {
    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: "File not found" });

    file.downloadedSheets.push({
      fileName,
      routeUsed
    });

    await file.save();

    res.status(200).json({ message: "Sheet info saved" });
  } catch (error) {
    console.error("Error saving sheet info:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
