import mongoose from "mongoose";

const likedArticleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // External article ID
    articleId: { type: String, required: true },

    // Article metadata
    title: String,
    description: String,
    imageUrl: String,
    newsUrl: String,
    author: String,
    date: String,
    source: String,

    // NEW FIELDS
    isRead: { type: Boolean, default: false },

    // For custom category placement
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true }
);

// Prevent duplicates
likedArticleSchema.index({ userId: 1, articleId: 1 }, { unique: true });

export default mongoose.model("LikedArticle", likedArticleSchema);
