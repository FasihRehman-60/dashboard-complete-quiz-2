import mongoose from "mongoose";

const customCategorySchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    name: { 
      type: String, 
      required: true 
    },

    // Stores article IDs added to this category
    articles: [
      { 
        type: String 
      }
    ]
  },
  { timestamps: true }
);

customCategorySchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model("CustomCategory", customCategorySchema);
