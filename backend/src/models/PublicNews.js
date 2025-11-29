import mongoose from "mongoose";

const sourceSchema = new mongoose.Schema({
  id: { type: String, default: null },
  name: { type: String, required: true },
});

const publicNewsSchema = new mongoose.Schema(
  {
    source: { type: sourceSchema, required: true },
    author: { type: String, default: "Unknown" },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    url: { type: String, required: true },
    urlToImage: { type: String, default: null },
    publishedAt: { type: Date, required: true },
    content: { type: String, default: "" },
 
    category: { type: String, default: "general" },
    company: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("PublicNews", publicNewsSchema);
