import ApiKey from "../models/ApiKey.js";

export const validateApiKey = async (req, res, next) => {
  try {
    const apiKey =
      (req.headers["x-api-key"] ||
        req.query.api_key ||
        req.query.key ||
        "").trim();

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: "API key required"
      });
    }

    const keyDoc = await ApiKey.findOne({
      key: apiKey,
      status: "active"
    }).select("usageToday dailyLimit lastUsageDate userId status key");

    if (!keyDoc) {
      return res.status(403).json({
        success: false,
        error: "Invalid or disabled API key"
      });
    }

    keyDoc.resetDailyUsageIfNewDay();
    if (keyDoc.usageToday >= keyDoc.dailyLimit) {
      return res.status(429).json({
        success: false,
        error: "Daily API quota exceeded"
      });
    }

    // Increase usage count
    keyDoc.usageToday += 1;
    keyDoc.lastUsageDate = new Date();
    await keyDoc.save();

    // Attach API key doc for later use
    req.apiKeyDoc = keyDoc;

    next();
  } catch (err) {
    console.error("validateApiKey error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};
