import React, { useEffect } from "react";

const TrendingNews = ({ apiKey, country = "us", onTrendingFetched, getLocalScore }) => {
  useEffect(() => {
    let ignore = false; 

    const fetchTrending = async () => {
      try {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=breaking OR top OR latest&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`
        );
        const data = await res.json();
        if (!data.articles || ignore) return;

        const scoredArticles = data.articles.map((article) => {
          const baseScore = article.popularity || 0;
          const localScore = getLocalScore ? getLocalScore(article) : 0;
          return {...article, trendingScore: baseScore + localScore,};
        });

        scoredArticles.sort((a, b) => b.trendingScore - a.trendingScore);
        onTrendingFetched?.(scoredArticles);
      } catch (err) {
        console.error("Error fetching trending news:", err);
      }
    };
    fetchTrending();
    return () => {ignore = true;
    };}, [apiKey, country, onTrendingFetched, getLocalScore]);
  return null;
};

export default TrendingNews;