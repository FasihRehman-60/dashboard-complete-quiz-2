import express from "express";
import axios from "axios";

const router = express.Router();

// 🚀 Fetch related news based on keyword
router.get("/related", async (req, res) => {
  const { q } = req.query;

  if (!q) return res.status(400).json({ error: "Query is required" });

  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      q
    )}&language=en&pageSize=6&sortBy=relevancy&apiKey=${process.env.NEWS_API_KEY}`;

    const response = await axios.get(url);

    return res.json({ articles: response.data.articles });
  } catch (err) {
    console.error("Related News Error →", err.message);
    return res.status(500).json({ error: "Failed to fetch related news" });
  }
});

export default router;
