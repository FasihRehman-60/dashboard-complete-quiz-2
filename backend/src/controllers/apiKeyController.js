import crypto from "crypto";
import ApiKey from "../models/ApiKey.js";

// Create API key manually
export const createApiKey = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "User not authenticated" });
    }

    const userId = req.user.id;
    const existing = await ApiKey.findOne({ userId, status: "active" });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: "You already have an active API key. Regenerate if needed."
      });
    }

    const key = "newswave_" + crypto.randomBytes(24).toString("hex");
    const keyDoc = await ApiKey.create({ key, userId });

    return res.json({
      success: true,
      apiKey: keyDoc.key,
      usageToday: keyDoc.usageToday,
      dailyLimit: keyDoc.dailyLimit,
      status: keyDoc.status
    });

  } catch (err) {
    console.error("Create API Key error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Regenerate API key (disable old one and create a new one)
export const regenerateApiKey = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "User not authenticated" });
    }
    const userId = req.user.id;
    await ApiKey.updateMany({ userId }, { status: "disabled" });

    const key = "newswave_" + crypto.randomBytes(24).toString("hex");
    const newKey = await ApiKey.create({ key, userId });

    return res.json({
      success: true,
      apiKey: newKey.key,
      message: "API key regenerated successfully"
    });

  } catch (err) {
    console.error("Regenerate API Key error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Get API key usage stats
export const getApiKeyStats = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "User not authenticated" });
    }

    const keyDoc = await ApiKey.findOne({ userId: req.user.id, status: "active" });
    if (!keyDoc) {
      return res.json({
        success: true,
        apiKey: null,
        usageToday: 0,
        dailyLimit: 0,
        status: "none"
      });
    }

    keyDoc.resetDailyUsageIfNewDay();
    await keyDoc.save();

    return res.json({
      success: true,
      apiKey: keyDoc.key,
      usageToday: keyDoc.usageToday,
      dailyLimit: keyDoc.dailyLimit,
      status: keyDoc.status
    });

  } catch (err) {
    console.error("Get API stats error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
