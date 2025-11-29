import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import NewsItem from "./NewsItem.jsx";
import SearchBar from "./SearchBar.jsx";
import RelatedNews from "./RelatedNews.jsx";

function capitalize(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : "";
}

const isTrending = (article) => {
  const text = `${article.title || ""} ${article.description || ""} ${article.source?.name || ""}`.toLowerCase();
  const hotWords = ["breaking", "trending", "exclusive", "viral", "must watch", "hot news", "update", "revealed", "announcement", "ai", "crypto",];
  return hotWords.some((word) => text.includes(word));
};

const News = ({country = "us", pageSize = 8, category = "general", apiKey, setProgress,}) => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  const fetchPage = async (p = 1) => {
    try {
      setProgress?.(20);
      setLoading(true);
      const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${p}&pageSize=${pageSize}`;
      const res = await fetch(url);
      setProgress?.(50);
      const data = await res.json();
      setProgress?.(80);

      if (data.articles) {
        const sortedArticles = [...data.articles].sort((a, b) => {
          const aTrend = isTrending(a);
          const bTrend = isTrending(b);
          return bTrend - aTrend;
        });

        if (p === 1) {
          setArticles(sortedArticles);
        } else {
          setArticles((prev) => [...prev, ...sortedArticles]);
        }
      }
      setTotalResults(data.totalResults || 0);
    } catch (err) {
      console.error("Error fetching page:", err);
    } finally {
      setLoading(false);
      setProgress?.(100);
    }
  };

  useEffect(() => {
    document.title = `${capitalize(category)} - NewsWave`;
    setPage(1);
    fetchPage(1);
  }, [category, country, apiKey]);

  const fetchMoreData = async () => {
    if (searchActive) return; 
    const next = page + 1;
    setPage(next);
    await fetchPage(next);
  };

  const handleSearchResults = (results, query) => {
    setLastQuery(query);

    if (!query || query.trim().length === 0) {
      setSearchActive(false);
      setPage(1);
      fetchPage(1);
      return;
    }

    const sortedResults = (results || []).sort((a, b) => {
      const aTrend = isTrending(a);
      const bTrend = isTrending(b);
      return bTrend - aTrend;
    });

    setArticles(sortedResults);
    setSearchActive(true);
  };

  return (
      <section className="px-3 sm:px-6 lg:px-10 mt-4 sm:mt-6">
        <SearchBar apiKey={apiKey} onResults={handleSearchResults} />
        <h1 className="text-center font-bold tracking-tight text-gray-900 text-xl sm:text-2xl lg:text-3xl mt-4 mb-6">{capitalize(category)} Headlines</h1>
        {searchActive ? (
          <>
            <div className="mb-10">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-gray-800 text-center">Search Results for “{lastQuery}”</h2>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {articles.length > 0 ? (
                  articles.map((article, index) => (
                    <NewsItem
                      key={index}
                      title={article.title}
                      description={article.description}
                      imageUrl={article.urlToImage}
                      newsUrl={article.url}
                      author={article.author}
                      date={article.publishedAt}
                      source={article.source?.name}
                      isTrending={isTrending(article)}/>
                  ))
                ) : (
                  <p className="text-center text-gray-500 col-span-full">No results found.</p>
                )}
              </div>
            </div>
            {/* Related News */}
            <div className="mt-10 border-t border-gray-200 pt-8">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-gray-800 text-center">More Articles You Might Like</h2>
              <RelatedNews keyword={lastQuery} apiKey={apiKey} excludeUrls={articles.map((a) => a.url)}/>
            </div>
          </>
          ) : (
          <InfiniteScroll dataLength={articles.length} next={fetchMoreData} hasMore={articles.length < totalResults} loader={<h4 className="text-center text-gray-500 py-4">Loading more...</h4>}>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {articles.map((article, index) => (
                <NewsItem
                  key={index}
                  title={article.title}
                  description={article.description}
                  imageUrl={article.urlToImage}
                  newsUrl={article.url}
                  author={article.author}
                  date={article.publishedAt}
                  source={article.source?.name}
                  isTrending={isTrending(article)}/>
              ))}
            </div>
          </InfiniteScroll>
        )}
      </section>
  );
};

export default News;
