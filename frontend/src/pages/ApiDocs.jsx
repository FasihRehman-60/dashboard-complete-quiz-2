import React, { useState, useEffect } from "react";
import { Copy, Code, Info } from "lucide-react";
import api from "../utils/api"; // your axios instance
import BackButton from "../components/BackButton";

export default function ApiDocs() {
  const [copied, setCopied] = useState("");
  const [apiKey, setApiKey] = useState(null);

  const baseUrl = "http://localhost:5000/api/news"; // full URL

  // Fetch user API key if available
  useEffect(() => {
    async function fetchApiKey() {
      try {
        const res = await api.get("/user/api-key/stats");
        if (res.data.apiKey) setApiKey(res.data.apiKey);
      } catch (err) {
        setApiKey(null); // fallback to preview
      }
    }
    fetchApiKey();
  }, []);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  const examples = [
    {
      label: "cURL",
      code: `curl "${baseUrl}?category=technology&limit=5${
        apiKey ? `&api_key=${apiKey}` : ""
      }"`,
    },
    {
      label: "JavaScript (Axios)",
      code: `import axios from "axios";

const res = await axios.get("${baseUrl}", {
  params: { category: "technology", limit: 5${
    apiKey ? `, api_key: "${apiKey}"` : ""
  } }
});
console.log(res.data);`,
    },
    {
      label: "Python (requests)",
      code: `import requests

res = requests.get("${baseUrl}", params={{
  "category": "technology", "limit": 5${
    apiKey ? `, "api_key": "${apiKey}"` : ""
  }
}})
print(res.json())`,
    },
    {
      label: "React (Fetch)",
      code: `fetch("${baseUrl}?category=technology&limit=5${
        apiKey ? `&api_key=${apiKey}` : ""
      }")
  .then(res => res.json())
  .then(data => console.log(data));`,
    },
  ];

  const previewUrl = `${baseUrl}?category=default&company=default`;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Header */}
      <BackButton/>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2 flex-wrap">
        <Code className="text-blue-600" /> API Documentation
      </h1>

      {/* Overview */}
      <div className="bg-white p-4 md:p-5 rounded-lg shadow mb-6 border border-gray-200">
        <h2 className="font-semibold mb-2 flex items-center gap-2">
          <Info className="text-blue-600" /> Overview
        </h2>
        <p className="text-gray-600 text-sm">
          Fetch the latest news using filters like <b>category</b>, <b>company</b>, <b>source</b>, <b>since</b>, <b>limit</b>, or <b>q</b>.
        </p>
        <p className="text-gray-600 text-sm mt-1">
          Preview URL without API key:{" "}
          <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{previewUrl}</code>
        </p>
      </div>

      {/* Quick Start */}
      <div className="bg-white p-4 md:p-5 rounded-lg shadow mb-6 border border-gray-200">
        <h2 className="font-semibold mb-2">Quick Start</h2>
        <div className="bg-gray-100 p-2 rounded text-sm break-words mb-2">
          GET {previewUrl}
        </div>

        <p className="text-gray-600 text-sm font-medium">Query Parameters</p>
        <ul className="list-disc ml-5 text-gray-600 text-sm">
          <li>category – e.g. technology, business</li>
          <li>company – filter by organization</li>
          <li>source – news source</li>
          <li>since – after YYYY-MM-DD</li>
          <li>limit – max results (default 20, max 500)</li>
          <li>q – keyword search</li>
        </ul>
      </div>

      {/* Examples */}
      <div className="bg-white p-4 md:p-5 rounded-lg shadow mb-6 border border-gray-200">
        <h2 className="font-semibold mb-3">Code Examples</h2>
        {examples.map((ex) => (
          <div key={ex.label} className="mb-4">
            <div className="flex justify-between items-center mb-1 flex-wrap">
              <span className="font-medium text-gray-700">{ex.label}</span>
              <button
                onClick={() => copyToClipboard(ex.code, ex.label)}
                className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 mt-1 md:mt-0"
              >
                <Copy size={14} /> {copied === ex.label ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto break-words whitespace-pre-wrap">
              {ex.code}
            </pre>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="bg-white p-4 md:p-5 rounded-lg shadow border border-gray-200 mb-6">
        <h2 className="font-semibold mb-2">Notes</h2>
        <ul className="list-disc ml-5 text-gray-600 text-sm">
          <li>Preview URL works without an API key.</li>
          <li>API keys have a daily limit.</li>
          <li>Exceeding the limit returns 429 Too Many Requests.</li>
          <li>Keep your API key secure.</li>
        </ul>
      </div>
    </div>
  );
}
