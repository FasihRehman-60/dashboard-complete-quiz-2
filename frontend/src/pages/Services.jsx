import React from "react";
import { 
  Search, Filter, Share2, Clock, TrendingUp, Moon, Bookmark, ThumbsUp, RefreshCw, Layers, LogIn, UserPlus, LayoutDashboard, UserCircle2
} from "lucide-react";

const services = [
  {
    icon: <UserPlus className="w-8 h-8 text-amber-500" />,
    title: "User Registration (Sign Up)",
    description:
      "Easily create your account using a simple sign-up process. Provide your name, email, password, and start exploring personalized news right away.",
  },
  {
    icon: <LogIn className="w-8 h-8 text-amber-500" />,
    title: "Secure Sign In",
    description:
      "Log in securely with email and password. Your session is protected with token-based authentication to ensure safe access to your account.",
  },
  {
    icon: <LayoutDashboard className="w-8 h-8 text-amber-500" />,
    title: "Personal Dashboard",
    description:
      "Once signed in, access your personalized dashboard where you can view saved articles, manage bookmarks, and see trending topics tailored to your preferences.",
  },
  {
    icon: <UserCircle2 className="w-8 h-8 text-amber-500" />,
    title: "Profile Personalization",
    description:
      "Update your profile and manage your personal information easily. Customize preferences to enhance your browsing and reading experience.",
  },
  {
    icon: <Filter className="w-8 h-8 text-amber-500" />,
    title: "Category Filtering",
    description:
      "Browse news by categories and sub-categories (e.g., Sports → Football, Cricket) to quickly find what interests you most.",
  },
  {
    icon: <Search className="w-8 h-8 text-amber-500" />,
    title: "Search with Suggestions",
    description:
      "Our intelligent search bar gives instant suggestions as you type, helping you discover related news quickly and efficiently.",
  },
  {
    icon: <Share2 className="w-8 h-8 text-amber-500" />,
    title: "Share to Social Media",
    description:
      "Share your favorite articles instantly to social media platforms such as Facebook, Twitter, or WhatsApp.",
  },
  {
    icon: <RefreshCw className="w-8 h-8 text-amber-500" />,
    title: "Infinite Scroll / Load More",
    description:
      "Enjoy continuous browsing with infinite scroll or a 'Load More' button to keep exploring without page reloads.",
  },
  {
    icon: <Clock className="w-8 h-8 text-amber-500" />,
    title: "Estimated Reading Time",
    description:
      "Each article shows an estimated reading time so you can plan your reading easily, even on a busy schedule.",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-amber-500" />,
    title: "Trending News Section",
    description:
      "Stay updated with the most trending and popular news articles across various categories.",
  },
  {
    icon: <Layers className="w-8 h-8 text-amber-500" />,
    title: "Related News Section",
    description:
      "After finishing an article, view related news on similar topics to dive deeper into your interests.",
  },
  {
    icon: <Moon className="w-8 h-8 text-amber-500" />,
    title: "Dark Mode / Light Mode Toggle",
    description:
      "Switch easily between dark and light modes for a comfortable reading experience at any time of the day.",
  },
  {
    icon: <Bookmark className="w-8 h-8 text-amber-500" />,
    title: "Bookmarks / Save for Later",
    description:
      "Save interesting articles to read later, and access them anytime from your personalized dashboard.",
  },
  {
    icon: <ThumbsUp className="w-8 h-8 text-amber-500" />,
    title: "Like / Upvote System",
    description:
      "Like or upvote articles you enjoy. See what’s popular and engage with content that matters to you.",
  },{
  icon: <Layers className="w-8 h-8 text-amber-500" />,
  title: "Public API Access",
  description:
    "Fetch the latest news using our Public API. Get articles by category, company, source, date, or search query. Works with or without an API key for preview mode.",
  },
];

const Services = () => {
  return (
    <section className="bg-gray-50 py-12 px-4 sm:py-16 sm:px-6 lg:px-20 min-h-screen">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mb-12">
          Our platform offers an all-in-one experience for browsing, saving, and sharing news.
          With user accounts, smart recommendations, and advanced features, we aim to make news reading interactive and effortless.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white shadow-md hover:shadow-lg transition rounded-2xl p-5 sm:p-6 flex flex-col items-start text-left border border-gray-100"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
