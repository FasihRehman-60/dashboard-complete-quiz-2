import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import NewsItem from "./NewsItem";
import api from "../utils/api";

const NewsFeed = ({ apiKey }) => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&pageSize=20&apiKey=${apiKey}`
      );
      const data = await res.json();
      if (data.articles) {
        setArticles(data.articles);
        setFilteredArticles(data.articles);
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 py-6">
      <SearchBar apiKey={apiKey} onResults={(results) => setFilteredArticles(results)}/>
      {loading ? (<p className="text-center text-gray-500 mt-10">Loading articles...</p>) : filteredArticles.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No articles found</p>) : (
        <div className="grid gap-4 sm:gap-6 mt-6 grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 l:grid-cols-4">
          {filteredArticles.map((article, idx) => (<NewsItem key={article.url || idx} {...article} />))}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;