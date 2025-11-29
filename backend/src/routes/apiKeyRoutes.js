import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {createApiKey, regenerateApiKey, getApiKeyStats,} from "../controllers/apiKeyController.js";

const router = express.Router();

// Create API key
router.post("/api-key/create", authenticate, createApiKey);
// Regenerate API key
router.post("/api-key/regenerate", authenticate, regenerateApiKey);
// Get API key stats
router.get("/api-key/stats", authenticate, getApiKeyStats);

export default router;
