import React, { useState, useEffect, useRef, useMemo } from "react";
import { Heart, Bookmark, Share2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReadTime from "./ReadTime";
import ShareButtons from "./ShareButtons";
import AuthPopup from "./Popup";
import api from "../utils/api";

const NewsItem = ({title, description, content, imageUrl, newsUrl, author, date, source, articleId, popularity = 0,}) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  const shareRef = useRef(null);
  const navigate = useNavigate();

  const handleProtectedAction = (action) => {
    const token = localStorage.getItem("token");
    if (!token) return setShowAuthPopup(true);
    action();
  };

  const fetchUserStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const encodedId = encodeURIComponent(newsUrl);
      const res = await api.get(`/dashboard/status/${encodedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLiked(res.data.liked);
      setSaved(res.data.saved);
    } catch (err) {
      console.error("Status fetch error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchUserStatus();
  }, []);

  useEffect(() => {
    const closeShare = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShowShare(false);
      }
    };
    document.addEventListener("mousedown", closeShare);
    return () => document.removeEventListener("mousedown", closeShare);
  }, []);

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const articleData = {articleId: newsUrl, title, description, content, imageUrl, newsUrl, author, date, source,};
    try {
      setLikeLoading(true);
      const res = await api.post(`/dashboard/toggle-like`, articleData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLiked(res.data.liked);
    } catch (err) {
      console.error("Like error:", err.response?.data || err.message);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const articleData = {articleId: newsUrl, title, description, content, imageUrl, newsUrl, author, date, source,};
    try {
      setSaveLoading(true);
      const res = await api.post(`/dashboard/toggle-save`, articleData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaved(res.data.saved);
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    const recordView = async () => {
      const token = localStorage.getItem("token");
      if (!token || !articleId) return;
      try {
        await api.post(
          `/dashboard/record-view`,
          { articleId, title, description, content, imageUrl, newsUrl, author, date, source },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("View record error:", err.response?.data || err.message);
      }
    };

    recordView();
  }, [articleId]);

  const isTrending = useMemo(() => {
    let score = 0;
    const text = `${title} ${description}`.toLowerCase();
    const hotWords = [
      "breaking", "exclusive", "urgent", "latest",
      "viral", "trending", "update", "ai", "crypto"
    ];
    hotWords.forEach((w) => {
      if (text.includes(w)) score += 2;
    });

    score += popularity / 10;
    return score >= 4;
  }, [title, description, popularity]);

  return (
    <>
      <article className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all flex flex-col">
        <div className="aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden bg-gray-100">
          {imageUrl ? (<img src={imageUrl} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"/>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">No Image</div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {source && (<span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">{source}</span>)}
            {isTrending && (
              <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">🔥 Trending</span>
            )}
          </div>

          <h2 className="mt-2 line-clamp-2 text-base font-semibold text-gray-900">{title}</h2>
          {description && (<p className="mt-2 line-clamp-3 text-sm text-gray-600">{description}</p>)}

          <ReadTime text={content || description} />
          <div className="mt-4 flex flex-wrap justify-between text-xs text-gray-500 gap-1">
            <span>{author || "Unknown author"}</span>
            {date && <time dateTime={date}>{new Date(date).toLocaleString()}</time>}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <a href={newsUrl} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition">
              Read more →
            </a>

            <div className="flex items-center gap-3">
              <button onClick={() => handleProtectedAction(handleLike)} disabled={likeLoading}
                className={`transition ${liked ? "text-red-500" : "text-gray-400"} hover:text-red-500`} title="Like">
                {likeLoading ? (<Loader2 size={18} className="animate-spin" />
                ) : (<Heart size={18} />)}
              </button>

              <button onClick={() => handleProtectedAction(handleSave)} disabled={saveLoading}
                className={`transition ${saved ? "text-blue-500" : "text-gray-400"} hover:text-blue-500`}title="Save">
                {saveLoading ? (<Loader2 size={18} className="animate-spin" />
                ) : (<Bookmark size={18} />)}
              </button>

              {/* Share */}
              <div className="relative" ref={shareRef}>
                <button onClick={() => handleProtectedAction(() => setShowShare((prev) => !prev))} className="text-gray-400 hover:text-green-600 transition" title="Share">
                  <Share2 size={18} />
                </button>

                {showShare && (
                  <div className="absolute right-0 bottom-7 z-50 w-48 rounded-xl border bg-white shadow-lg p-3 animate-fadeIn"><ShareButtons url={newsUrl} title={title} /></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
      {showAuthPopup && <AuthPopup onClose={() => setShowAuthPopup(false)} />}
    </>
  );
};

export default React.memo(NewsItem);