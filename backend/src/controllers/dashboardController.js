import LikedArticle from "../models/LikedArticle.js";
import SavedArticle from "../models/SavedArticle.js";
import ViewedArticle from "../models/ViewedArticle.js";
import User from "../models/User.js";
import Article from "../models/Article.js";
import CustomCategory from "../models/CustomCategory.js";

// Helper: get model based on tab type
const getModelByType = (type) => {
  switch (type) {
    case "liked":
      return LikedArticle;
    case "saved":
      return SavedArticle;
    case "viewed":
      return ViewedArticle;
    default:
      throw new Error("Invalid article type");
  }
};

// Helper: Save or find article in Article collection
const ensureArticleExists = async (articleData) => {
  const articleId = articleData.articleId || articleData.newsUrl;
  if (!articleId) throw new Error("Missing articleId or newsUrl in article data");

  let article = await Article.findOne({ articleId });
  if (!article) {
    article = await Article.create({ ...articleData, articleId });
  }
  return article;
};

// GET /dashboard/full
export const getFullDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const [liked, saved, viewed, categories] = await Promise.all([
      LikedArticle.find({ userId: req.user.id }),
      SavedArticle.find({ userId: req.user.id }),
      ViewedArticle.find({ userId: req.user.id }),
      CustomCategory.find({ userId: req.user.id }), // fetch user's categories
    ]);

    res.status(200).json({
      user,
      liked,
      saved,
      viewed,
      categories, // include categories in response
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    res.status(500).json({ message: "Server error fetching dashboard data." });
  }
};

// Toggle like/save (generic)
const toggleArticle = async (req, res, Model, successField) => {
  try {
    const articleId = req.body.articleId || req.body.newsUrl;
    if (!articleId) return res.status(400).json({ message: "Missing articleId or newsUrl." });

    await ensureArticleExists({ ...req.body, articleId });

    const existing = await Model.findOne({ userId: req.user.id, articleId });

    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ [successField]: false });
    } else {
      await Model.create({ userId: req.user.id, articleId, ...req.body });
      return res.status(200).json({ [successField]: true });
    }
  } catch (error) {
    console.error(`${successField} toggle error:`, error);
    res.status(500).json({ message: `Error toggling ${successField} status.` });
  }
};

export const toggleLike = (req, res) => toggleArticle(req, res, LikedArticle, "liked");
export const toggleSave = (req, res) => toggleArticle(req, res, SavedArticle, "saved");

// POST /dashboard/record-view
export const recordView = async (req, res) => {
  try {
    const articleId = req.body.articleId || req.body.newsUrl;
    if (!articleId)
      return res.status(400).json({ message: "Missing articleId or newsUrl." });

    // Ensure article exists in main Article collection
    await ensureArticleExists({ ...req.body, articleId });

    // Record view safely with upsert (won't create duplicates)
    await ViewedArticle.findOneAndUpdate(
      { userId: req.user.id, articleId },
      {
        $setOnInsert: {
          title: req.body.title,
          description: req.body.description,
          imageUrl: req.body.imageUrl,
          newsUrl: req.body.newsUrl,
          author: req.body.author,
          date: req.body.date,
          source: req.body.source,
        },
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "View recorded successfully." });
  } catch (error) {
    console.error("Record view error:", error);
    res.status(500).json({ message: "Error recording view." });
  }
};


// GET /dashboard/status/:articleId
export const getArticleStatus = async (req, res) => {
  try {
    const articleId = req.params.articleId || req.query.newsUrl;

    const [liked, saved] = await Promise.all([
      LikedArticle.findOne({ userId: req.user.id, articleId }),
      SavedArticle.findOne({ userId: req.user.id, articleId }),
    ]);

    res.status(200).json({ liked: !!liked, saved: !!saved });
  } catch (error) {
    console.error("Get status error:", error);
    res.status(500).json({ message: "Error fetching article status." });
  }
};

// CREATE /dashboard/category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });

    const category = await CustomCategory.create({ userId: req.user.id, name, articles: [] });
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({ message: "Error creating category" });
  }
};

// ADD article to category
export const addArticleToCategory = async (req, res) => {
  try {
    const { categoryId, articleId } = req.body;
    if (!categoryId || !articleId) return res.status(400).json({ message: "categoryId and articleId are required" });

    const category = await CustomCategory.findOne({ _id: categoryId, userId: req.user.id });
    if (!category) return res.status(404).json({ message: "Category not found" });

    if (!category.articles.includes(articleId)) {
      category.articles.push(articleId);
      await category.save();
    }

    res.status(200).json({ message: "Article added to category", category });
  } catch (error) {
    console.error("Add to Category Error:", error);
    res.status(500).json({ message: "Error adding article to category" });
  }
};

// SORT Articles dynamically
export const sortArticles = async (req, res) => {
  try {
    const { type, tab } = req.query; // tab = liked/saved/viewed
    const Model = getModelByType(tab);

    let results = await Model.find({ userId: req.user.id });

    if (type === "newest") results = results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (type === "oldest") results = results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (type === "source") results = results.sort((a, b) => (a.source || "").localeCompare(b.source || ""));

    res.status(200).json(results);
  } catch (error) {
    console.error("Sort Error:", error);
    res.status(500).json({ message: "Error sorting articles" });
  }
};

// ANALYTICS
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const [totalLiked, totalSaved, totalViewed] = await Promise.all([
      LikedArticle.countDocuments({ userId }),
      SavedArticle.countDocuments({ userId }),
      ViewedArticle.countDocuments({ userId }),
    ]);

    res.status(200).json({ totalLiked, totalSaved, totalViewed });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: "Error fetching analytics" });
  }
};

// MARK read/unread dynamically
export const markArticleReadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { tab, read } = req.body; // tab = liked/saved/viewed, read = true/false
    const Model = getModelByType(tab);

    const article = await Model.findOne({ _id: id, userId: req.user.id });
    if (!article) return res.status(404).json({ message: "Article not found" });

    article.isRead = read;
    await article.save();
    res.status(200).json({ message: read ? "Marked as read" : "Marked as unread", article });
  } catch (error) {
    console.error("Mark Read/Unread Error:", error);
    res.status(500).json({ message: "Error updating read status" });
  }
};

// DELETE articles dynamically
export const deleteArticles = async (req, res) => {
  try {
    const { tab, id } = req.params; // tab = liked/saved/viewed
    const Model = getModelByType(tab);

    if (id === "all") {
      await Model.deleteMany({ userId: req.user.id });
      return res.status(200).json({ message: `All ${tab} articles deleted` });
    }

    await Model.deleteOne({ _id: id, userId: req.user.id });
    res.status(200).json({ message: "Article deleted" });
  } catch (error) {
    console.error("Delete Article Error:", error);
    res.status(500).json({ message: "Error deleting article" });
  }
};

// DELETE category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await CustomCategory.deleteOne({ _id: id, userId: req.user.id });
    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({ message: "Error deleting category" });
  }
};
