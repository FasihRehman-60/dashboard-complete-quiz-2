import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    author: String,
    source: String,
    url: String,
    urlToImage: String,
    publishedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Article", articleSchema);
