import express from "express";
import { validateApiKey } from "../middleware/validateApiKey.js";
import PublicNews from "../models/PublicNews.js";

const router = express.Router();

// GET /api/public/news?category=&company=&source=&limit=&since=&q=
router.get("/news", async (req, res) => {
  try {
    let { category = "default", company = "default", source, limit = 50, since, q } = req.query;

    // Determine if API key is required
    const requiresApiKey =
      (category.toLowerCase() !== "default" ||
        company.toLowerCase() !== "default" ||
        source ||
        since ||
        q);

    if (requiresApiKey) {
      const apiKey = req.headers["x-api-key"] || req.query.api_key;
      if (!apiKey) {
        return res.status(401).json({
          success: false,
          error: "API key required for this query"
        });
      }

      const valid = await validateApiKey(apiKey);
      if (!valid) {
        return res.status(403).json({
          success: false,
          error: "Invalid API key"
        });
      }
    }

    const query = {};

    if (category.toLowerCase() !== "default") query.category = category.toLowerCase();
    if (company.toLowerCase() !== "default") query.company = { $regex: new RegExp(company, "i") };
    if (source) query["source.name"] = { $regex: new RegExp(source, "i") };
    if (since) {
      const parsed = new Date(since);
      if (!isNaN(parsed.getTime())) query.publishedAt = { $gte: parsed };
    }
    if (q && q.trim()) query.$text = { $search: q.trim() };

    const maxLimit = 500;
    let safeLimit = Math.min(Number(limit) || 50, maxLimit);

    if (!requiresApiKey) safeLimit = Math.min(safeLimit, 20);

    const news = await PublicNews.find(query).sort({ publishedAt: -1 }).limit(safeLimit);

    return res.json({
      success: true,
      count: news.length,
      data: news
    });

  } catch (err) {
    console.error("public news error:", err);
    return res.status(500).json({
      success: false,
      error: "Server error fetching news",
      details: err.message
    });
  }
});

export default router;
