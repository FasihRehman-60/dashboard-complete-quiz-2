import mongoose from "mongoose";

const savedArticleSchema = new mongoose.Schema(
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

    // link to user-created category
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true }
);

// Stop same article duplication
savedArticleSchema.index({ userId: 1, articleId: 1 }, { unique: true });

export default mongoose.model("SavedArticle", savedArticleSchema);
