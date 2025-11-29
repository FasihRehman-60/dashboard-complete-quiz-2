import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import NewsItem from "../components/NewsItem";
import { Newspaper, Layers, Calendar, CheckCircle, LogOut, Trash2, Check, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.985, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  exit: { opacity: 0, scale: 0.98, y: 6, transition: { duration: 0.18 } },
};

const Dashboard = () => {
  const [tab, setTab] = useState("liked");
  const [data, setData] = useState({
    user: {},
    liked: [],
    saved: [],
    viewed: [],
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryMode, setCategoryMode] = useState(null);
  const [perArticleCategorySelect, setPerArticleCategorySelect] = useState({});

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const apiHeaders = { headers: { Authorization: `Bearer ${token}` } };

  //FETCH DASHBOARD
  const fetchDashboard = useCallback(async () => {
    try {
      if (!token) return navigate("/auth");
      setLoading(true);
      const res = await api.get("/dashboard/full", apiHeaders);
      const dashboardData = res.data;
      const customCategories = dashboardData.categories || [];
      [...(dashboardData.liked || []), ...(dashboardData.saved || []), ...(dashboardData.viewed || [])].forEach(
        (article) => {
          article.categories = article.categories || [];
          customCategories.forEach((cat) => {
            if (
              cat.articles.includes(article._id) ||
              cat.articles.includes(article.articleId) ||
              cat.articles.includes(article.newsUrl)
            ) {
              if (!article.categories.some((c) => (c._id || c) === cat._id)) {
                article.categories.push({ _id: cat._id, name: cat.name });
              }
            }
          });
        }
      );

      setData(dashboardData);
    } catch (err) {
      console.error("Error fetching dashboard:", err?.response?.data || err?.message);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  //MEMOIZED ACTIVE LIST
  const activeList = useMemo(() => {
    if (categoryMode) {
      const catId = categoryMode._id;
      const combined = [...data.liked, ...data.saved, ...data.viewed];
      const filtered = combined.filter((a) => (a.categories || []).some((c) => (c._id || c) === catId));
      const seen = new Set();
      return filtered.filter((a) => {
        const id = a._id || a.articleId || a.newsUrl;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
    }
    return data[tab] || [];
  }, [categoryMode, data, tab]);

  //HELPERS
  const resolveTab = useCallback(
    (item) => {
      if (data.liked.some((a) => a._id === item._id || a.articleId === item.articleId)) return "liked";
      if (data.saved.some((a) => a._id === item._id || a.articleId === item.articleId)) return "saved";
      if (data.viewed.some((a) => a._id === item._id || a.articleId === item.articleId)) return "viewed";
      return "saved";
    },
    [data]
  );

  const idOf = (a) => a._id || a.articleId || a.newsUrl;
  const handleDeleteOne = useCallback(
    async (id) => {
      if (!window.confirm("Delete this article?")) return;
      try {
        setData((prev) => {
          const updated = { ...prev };
          ["liked", "saved", "viewed"].forEach((t) => {
            updated[t] = updated[t].filter((a) => idOf(a) !== id);
          });
          return updated;
        });
        await api.delete(`/dashboard/delete/${tab}/${id}`, apiHeaders);
      } catch (error) {
        console.error("Delete one error:", error);
        alert("Failed to delete article. Refreshing data...");
        await fetchDashboard();
      }
    },
    [apiHeaders, tab, fetchDashboard]
  );

  // Remove from a category (optimistic)
  const handleDeleteFromCategory = useCallback(
    async (articleKey, categoryId) => {
      if (!window.confirm("Remove this article from the category?")) return;
      try {
        setData((prev) => {
          const updated = { ...prev };
          ["liked", "saved", "viewed"].forEach((t) => {
            updated[t] = updated[t].map((a) => {
              const key = idOf(a);
              if (key === articleKey) {
                return { ...a, categories: (a.categories || []).filter((c) => (c._id || c) !== categoryId) };
              }
              return a;
            });
          });
          return updated;
        });
        await api.post("/dashboard/category/remove", { articleId: articleKey, categoryId }, apiHeaders);
      } catch (err) {
        console.error("Remove from category error:", err);
        alert("Failed to remove from category. Refreshing data...");
        await fetchDashboard();
      }
    },
    [apiHeaders, fetchDashboard]
  );

  const handleDeleteAll = useCallback(async () => {
    if (!window.confirm(`Are you sure you want to delete all ${tab} articles?`)) return;
    try {
      setData((prev) => ({ ...prev, [tab]: [] }));
      await api.delete(`/dashboard/delete/${tab}/all`, apiHeaders);
    } catch (error) {
      console.error("Delete all error:", error);
      alert("Failed to delete all. Refreshing data...");
      await fetchDashboard();
    }
  }, [apiHeaders, tab, fetchDashboard]);

  // Sort update local tab list
  const handleSort = useCallback(
    async (type) => {
      try {
        setSortType(type);
        const res = await api.get(`/dashboard/sort?tab=${tab}&type=${type}`, apiHeaders);
        setData((prev) => ({ ...prev, [tab]: res.data }));
      } catch (error) {
        console.error("Sort error:", error);
        alert("Failed to sort. Try again.");
      }
    },
    [apiHeaders, tab]
  );

  // Create category (optimistic add)
  const handleCreateCategory = useCallback(async () => {
    if (!newCategoryName.trim()) return;
    const name = newCategoryName.trim();
    try {
      setNewCategoryName("");
      setData((prev) => ({ ...prev, categories: [...(prev.categories || []), { _id: `tmp-${Date.now()}`, name }] }));
      await api.post("/dashboard/category/create", { name }, apiHeaders);
      await fetchDashboard(); 
    } catch (error) {
      console.error("Create category error:", error);
      alert("Failed to create category. Refreshing data...");
      await fetchDashboard();
    }
  }, [newCategoryName, apiHeaders, fetchDashboard]);

  // Delete category
  const handleDeleteCategory = useCallback(
    async (categoryId) => {
      if (!window.confirm("Delete this category? This will not delete the articles.")) return;
      try {
        setData((prev) => {
          const updated = { ...prev, categories: (prev.categories || []).filter((c) => c._id !== categoryId) };
          ["liked", "saved", "viewed"].forEach((t) => {
            updated[t] = updated[t].map((a) => ({ ...a, categories: (a.categories || []).filter((c) => (c._id || c) !== categoryId) }));
          });
          return updated;
        });

        if (categoryMode?._id === categoryId) setCategoryMode(null);
        await api.delete(`/dashboard/category/${categoryId}`, apiHeaders);
      } catch (error) {
        console.error("Delete category error:", error);
        alert("Failed to delete category. Refreshing data...");
        await fetchDashboard();
      }
    },
    [apiHeaders, categoryMode, fetchDashboard]
  );

  // Add to category (optimistic)
  const handleAddToCategory = useCallback(
    async (articleKey, categoryId) => {
      if (!categoryId) return alert("Select a category first!");
      try {
        const cat = data.categories.find((c) => c._id === categoryId);
        setData((prev) => {
          const updated = { ...prev };
          ["liked", "saved", "viewed"].forEach((t) => {
            updated[t] = updated[t].map((a) => {
              const key = idOf(a);
              if (key === articleKey) {
                const existing = (a.categories || []).some((c) => (c._id || c) === categoryId);
                if (!existing) {
                  return { ...a, categories: [...(a.categories || []), { _id: categoryId, name: cat?.name || "Category" }] };
                }
              }
              return a;
            });
          });
          return updated;
        });

        // Clear select
        setPerArticleCategorySelect((s) => ({ ...s, [articleKey]: "" }));

        await api.post("/dashboard/category/add", { articleId: articleKey, categoryId }, apiHeaders);
      } catch (error) {
        console.error("Add to category error:", error);
        alert("Failed to add to category. Refreshing data...");
        await fetchDashboard();
      }
    },
    [apiHeaders, data.categories, fetchDashboard]
  );

  // Toggle read/unread (optimistic)
  const handleToggleRead = useCallback(
    async (item) => {
      try {
        const tabKey = resolveTab(item);
        const newReadStatus = !item.read;
        setData((prev) => {
          const updated = { ...prev };
          ["liked", "saved", "viewed"].forEach((t) => {
            updated[t] = updated[t].map((a) => {
              const idA = idOf(a);
              const idItem = idOf(item);
              return idA === idItem ? { ...a, read: newReadStatus } : a;
            });
          });
          return updated;
        });

        await api.patch(`/dashboard/mark/${tabKey}/${idOf(item)}`, { read: newReadStatus, tab: tabKey }, apiHeaders);
      } catch (error) {
        console.error("Toggle read error:", error);
        alert("Failed to update read status. Refreshing data...");
        await fetchDashboard();
      }
    },
    [apiHeaders, resolveTab, fetchDashboard]
  );

  const tabs = [
    { key: "liked", label: "❤️ Liked" },
    { key: "saved", label: "🔖 Saved" },
    { key: "viewed", label: "👁️ Viewed" },
  ];

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading your dashboard...
      </div>
    );

return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4 sm:p-6 lg:p-10">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="max-w-7xl mx-auto mb-6 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, <span className="text-blue-600">{data.user?.name || "User"}</span> 👋</h1>
          <p className="text-sm text-gray-600">{data.user?.email}</p>
          {data.user?.createdAt && <p className="text-xs text-gray-400 mt-1">Joined on {new Date(data.user.createdAt).toLocaleDateString()}</p>}
        </div>
        <motion.button whileHover={{ scale: 1.05, rotate: 1 }} whileTap={{ scale: 0.95 }}
          onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/auth"); }}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition">
          <LogOut size={16} /> Logout
        </motion.button>
      </motion.div>

      {/* STATS */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {[
          { icon: <Newspaper size={26} />, label: "Total Articles", value: activeList.length },
          { icon: <Layers size={26} />, label: "Active Mode", value: categoryMode ? `${categoryMode.name} (Category)` : tab },
          { icon: <Calendar size={26} />, label: "Member Since", value: data.user?.createdAt ? new Date(data.user.createdAt).toLocaleDateString() : "-" },
          { icon: <CheckCircle size={26} />, label: "Status", value: "Active", color: "text-green-600" },
        ].map((s, i) => (
          <motion.div key={i} variants={itemVariants} whileHover={{ scale: 1.04, boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }} className="bg-white rounded-2xl p-4 shadow flex items-center gap-4 cursor-pointer">
            {s.icon}
            <div>
              <div className="text-sm text-gray-500">{s.label}</div>
              <div className={`text-lg font-semibold ${s.color || ""}`}>{s.value}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* TABS */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto mb-4 flex flex-wrap justify-center gap-3">
        {tabs.map((t) => (
          <motion.button key={t.key} onClick={() => { setCategoryMode(null); setTab(t.key); }}
            whileTap={{ scale: 0.98 }} className={`px-5 py-2 rounded-full font-semibold transition ${
              tab === t.key && !categoryMode ? "bg-blue-600 text-white scale-105 shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}>
            {t.label}
          </motion.button>
        ))}
      </motion.div>

      {/* CATEGORY LIST */}
      {data.categories?.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto mb-6">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {data.categories.map((cat) => (
              <motion.button key={cat._id} onClick={() => setCategoryMode(cat)}
                whileHover={{ scale: 1.07, backgroundColor: "rgba(99,102,241,0.15)" }} className={`px-3 py-1 rounded-full text-sm transition ${categoryMode?._id === cat._id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}>
                📂 {cat.name}
              </motion.button>
            ))}
            {categoryMode && (
              <motion.button onClick={() => setCategoryMode(null)}
                whileHover={{ scale: 1.07, backgroundColor: "rgba(99,102,241,0.15)" }}
                className="ml-3 px-3 py-1 rounded-full bg-white border text-sm flex items-center gap-2 hover:shadow">
                <ChevronLeft size={14} /> Back
              </motion.button>
            )}
          </div>
          <div className="text-center text-xs text-gray-400 mt-2">Click a category to view articles in it</div>
        </motion.div>
      )}

      {/* CATEGORY MANAGEMENT */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto mb-6 bg-white p-4 rounded-xl shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Create new category (e.g., Sports)"
              className="px-3 py-2 border rounded focus:outline-none w-full sm:w-auto"/>
            <motion.button whileTap={{ scale: 0.98 }} onClick={handleCreateCategory} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create</motion.button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.categories.map((cat) => (
              <div key={cat._id} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-sm">{cat.name}</span>
                <button onClick={() => handleDeleteCategory(cat._id)} className="p-1 rounded-full hover:bg-red-500 hover:text-white">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* SORT + DELETE ALL */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-7xl mx-auto flex flex-wrap justify-end gap-3 mb-6">
        <div className="flex gap-2">
          {["newest","oldest","source"].map((t) => (
            <motion.button key={t} whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }} onClick={() => handleSort(t)} className="px-3 py-2 bg-blue-500 text-white rounded shadow capitalize">{t}</motion.button>
          ))}
        </div>
        {!categoryMode && (
          <motion.button whileHover={{ scale: 1.08, backgroundColor: "rgb(220,38,38)" }} whileTap={{ scale: 0.94 }} onClick={handleDeleteAll}
            className="px-3 py-2 bg-red-500 text-white rounded flex items-center gap-2 shadow">
            <Trash2 size={14} /> Delete All
          </motion.button>
        )}
      </motion.div>

      {/* ARTICLES GRID */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">{categoryMode ? `Category: ${categoryMode.name}` : `Your ${tab.charAt(0).toUpperCase() + tab.slice(1)} Articles`}</h2>
        {activeList.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-lg">No articles to show.</div>
        ) : (
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {activeList.map((item) => {
                const articleKey = idOf(item);
                const isRead = !!item.read;
                return (
                  <motion.div layout key={articleKey} initial="hidden" animate="show" exit="exit" variants={itemVariants} className="bg-white rounded-xl shadow p-4 flex flex-col">
                    <NewsItem {...item} />
                    <div className="flex flex-wrap gap-2 mt-3">
                      {(item.categories || []).map((c) => {
                        const cid = typeof c === "string" ? c : c._id;
                        const cname = typeof c === "string" ? c : c.name;
                        return (
                          <motion.div key={`${articleKey}-${cid}`} layout whileHover={{ scale: 1.03 }}
                            className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs">
                            <span>{cname}</span>
                            <button onClick={() => handleDeleteFromCategory(articleKey, cid)} className="p-1 rounded-full hover:bg-red-500 hover:text-white">
                              <Trash2 size={12} />
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                    {data.categories?.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <select value={perArticleCategorySelect[articleKey] || ""} onChange={(e) => setPerArticleCategorySelect((s) => ({ ...s, [articleKey]: e.target.value }))}
                          className="px-2 py-1 border rounded w-full sm:w-auto">
                          <option value="">Select Category</option>
                          {data.categories.filter((cat) => !(item.categories || []).some((c) => (typeof c === "string" ? c : c._id) === cat._id))
                            .map((cat) => (<option key={`${articleKey}-${cat._id}`} value={cat._id}>{cat.name}</option>))}
                        </select>
                        <button onClick={() => handleAddToCategory(articleKey, perArticleCategorySelect[articleKey])} disabled={!perArticleCategorySelect[articleKey]}
                          className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">Add</button>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      <button onClick={() => handleDeleteOne(articleKey)} className="flex items-center gap-1 px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600">
                        <Trash2 size={14} /> Delete
                      </button>
                      <button onClick={() => handleToggleRead(item)}
                        className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${isRead ? "bg-gray-300 text-gray-700 hover:bg-gray-400" : "bg-green-500 text-white hover:bg-green-600"}`}>
                        <Check size={14} /> {isRead ? "Read" : "Unread"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
