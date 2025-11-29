import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true, 
    index: true 
  },

  createdAt: { type: Date, default: Date.now },

  usageToday: { type: Number, default: 0 },
  dailyLimit: { type: Number, default: 500 },

  lastUsageDate: { type: Date, default: Date.now },

  status: { 
    type: String, 
    enum: ["active", "disabled"], 
    default: "active" 
  }
});

apiKeySchema.methods.resetDailyUsageIfNewDay = function () {
  const today = new Date().toDateString();
  const lastUsed = this.lastUsageDate?.toDateString();

  if (today !== lastUsed) {
    this.usageToday = 0;
    this.lastUsageDate = new Date();
  }
};

export default mongoose.model("ApiKey", apiKeySchema);
