import mongoose from "mongoose";

const viewedArticleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    articleId: { type: String, required: true },

    title: String,
    description: String,
    imageUrl: String,
    newsUrl: String,
    author: String,
    date: String,
    source: String,

    // NEW FIELDS
    isRead: { type: Boolean, default: false },

    // Category support
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },

    // Analytics
    readCount: { type: Number, default: 1 },
    lastViewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent duplicate entries
viewedArticleSchema.index({ userId: 1, articleId: 1 }, { unique: true });

export default mongoose.model("ViewedArticle", viewedArticleSchema);
