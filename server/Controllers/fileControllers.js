import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

const FileRecv=(req, res) => {
    console.log('File uploaded:', req.file.filename);
    res.json({ filePath: `/uploads/${req.file.filename}` });
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default {FileRecv};
