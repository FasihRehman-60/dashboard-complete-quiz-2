import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";

import {
  getFullDashboard,
  toggleLike,
  toggleSave,
  recordView,
  getArticleStatus,

  createCategory,
  addArticleToCategory,
  deleteCategory,

  sortArticles,
  getAnalytics,

  markArticleReadStatus,
  deleteArticles,
} from "../controllers/dashboardController.js";

const router = express.Router();
router.get("/full", authenticate, getFullDashboard);
router.post("/toggle-like", authenticate, toggleLike);
router.post("/toggle-save", authenticate, toggleSave);
router.post("/record-view", authenticate, recordView);
router.get("/status/:articleId", authenticate, getArticleStatus);
router.post("/category/create", authenticate, createCategory);
router.post("/category/add", authenticate, addArticleToCategory);
router.delete("/category/:id", authenticate, deleteCategory);
router.get("/sort", authenticate, sortArticles);
router.get("/analytics", authenticate, getAnalytics);
router.patch("/mark/:tab/:id", authenticate, markArticleReadStatus);
router.delete("/delete/:tab/:id", authenticate, deleteArticles);

export default router;
