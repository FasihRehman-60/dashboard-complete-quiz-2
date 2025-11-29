import React, { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import { Copy, RefreshCw } from "lucide-react";
import BackButton from "../components/BackButton";

export default function DeveloperAPI() {
  const [loading, setLoading] = useState(false);
  const [apiKeyInfo, setApiKeyInfo] = useState(null);

  const baseURL = "http://localhost:5000"; // Full backend URL
  const previewURL = `${baseURL}/api/public/news?category=default&company=default`;

  // Fetch API key info
  const fetchKey = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/api-key/stats");
      setApiKeyInfo(res.data.apiKey ? res.data : null);
    } catch (err) {
      console.error("Failed to get API key:", err?.response?.data || err.message);
      setApiKeyInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKey();
  }, [fetchKey]);

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Copied to clipboard"))
      .catch(() => alert("Failed to copy"));
  };

  const handleCreateKey = async () => {
    if (!window.confirm("Create a new API key?")) return;
    try {
      setLoading(true);
      const res = await api.post("/user/api-key/create");
      setApiKeyInfo(res.data);
      alert("API key created successfully");
    } catch (err) {
      console.error("Failed to create API key:", err);
      alert(err?.response?.data?.error || "Failed to create API key");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!window.confirm("Regenerate your API key? This will disable the old key.")) return;
    try {
      setLoading(true);
      const res = await api.post("/user/api-key/regenerate");
      setApiKeyInfo((prev) => ({ ...prev, apiKey: res.data.apiKey }));
      alert("API key regenerated. Old key disabled.");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed to regenerate API key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
        <BackButton/>
      <h1 className="text-2xl font-bold mb-6">Developer API</h1>

      <div className="bg-white p-5 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-3">Your API Key</h2>

        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : apiKeyInfo ? (
          <>
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <div className="bg-gray-100 px-3 py-2 rounded-md break-all">{apiKeyInfo.apiKey}</div>

              <button onClick={() => copyToClipboard(apiKeyInfo.apiKey)} className="px-3 py-1 bg-blue-600 text-white rounded flex items-center gap-2">
                <Copy size={14} /> Copy
              </button>

              <button onClick={handleRegenerate} className="px-3 py-1 bg-orange-500 text-white rounded flex items-center gap-2">
                <RefreshCw size={14} /> Regenerate
              </button>

              <div className="text-sm text-gray-500 ml-auto">
                Daily limit: {apiKeyInfo.dailyLimit} • Used: {apiKeyInfo.usageToday}
              </div>
            </div>

            {/* Template GET Links */}
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-1">Preview GET link (no API key required):</p>
              <div className="flex items-center gap-3 flex-wrap">
                <code className="bg-gray-100 px-3 py-2 rounded break-all">
                  {previewURL}
                </code>
                <button
                  onClick={() => copyToClipboard(previewURL)}
                  className="px-3 py-1 bg-blue-600 text-white rounded flex items-center gap-2"
                >
                  <Copy size={14} /> Copy Link
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-1 mt-2">
                API GET link (replace category/company as needed):
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <code className="bg-gray-100 px-3 py-2 rounded break-all">
                  {`${baseURL}/api/public/news?category=default&company=default&api_key=${apiKeyInfo.apiKey}`}
                </code>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `${baseURL}/api/public/news?category=default&company=default&api_key=${apiKeyInfo.apiKey}`
                    )
                  }
                  className="px-3 py-1 bg-blue-600 text-white rounded flex items-center gap-2"
                >
                  <Copy size={14} /> Copy Link
                </button>
              </div>
            </div>
          </>
        ) : (
          <div>
            <p className="text-gray-500 mb-2">You do not have an API key yet.</p>
            <button
              onClick={handleCreateKey}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Create API Key
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
