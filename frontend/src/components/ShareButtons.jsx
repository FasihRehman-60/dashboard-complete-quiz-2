import React, { useState } from "react";
import { Share2, Twitter, Facebook, Linkedin, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const socialLinks = [{ 
    name: "Twitter",
    icon: <Twitter className="w-5 h-5" />,
    url: (title, link) =>`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(link)}`,
    color: "text-sky-500",
    hoverBg: "hover:bg-sky-50",
    hoverBorder: "hover:border-sky-400",
  },{
    name: "Facebook",
    icon: <Facebook className="w-5 h-5" />,
    url: (title, link) =>`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
    color: "text-blue-600",
    hoverBg: "hover:bg-blue-50",
    hoverBorder: "hover:border-blue-600",
  },{
    name: "WhatsApp",
    icon: <MessageCircle className="w-5 h-5" />,
    url: (title, link) =>`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + link)}`,
    color: "text-green-600",
    hoverBg: "hover:bg-green-50",
    hoverBorder: "hover:border-green-600",
  },{
    name: "LinkedIn",
    icon: <Linkedin className="w-5 h-5" />,
    url: (title, link) =>`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
    color: "text-blue-500",
    hoverBg: "hover:bg-blue-50",
    hoverBorder: "hover:border-blue-500",
  },
];

const ShareButtons = ({ url, title }) => {
  const [tooltip, setTooltip] = useState(null);
  const shareData = {
    title: title || "Check this out!",
    text: title,
    url,
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setTooltip("Shared!");
      } catch {
        setTooltip("Failed to share");
      } finally {
        setTimeout(() => setTooltip(null), 1500);
      }
    } else {
      setTooltip("Not supported");
      setTimeout(() => setTooltip(null), 1500);
    }
  };

  const handleClickSocial = (name) => {
    setTooltip(`Shared on ${name}!`);
    setTimeout(() => setTooltip(null), 1500);
  };

  return (
    <div className="relative flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {/* Main Share Button */}
      <motion.button whileTap={{ scale: 1.15 }} whileHover={{ scale: 1.1 }} onClick={handleShare}
        className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full 
          border border-gray-300 bg-white hover:border-gray-500 hover:bg-gray-50 
          text-gray-600 transition">
        <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
      </motion.button>

      {/* Social Icons */}
      {socialLinks.map((s) => (
        <motion.a key={s.name} href={s.url(title, url)} target="_blank" rel="noreferrer" onClick={() => handleClickSocial(s.name)}
          whileHover={{ scale: 1.15, y: -4 }} whileTap={{ scale: 1.1 }}
          className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full 
            border border-gray-300 ${s.color} ${s.hoverBg} ${s.hoverBorder} transition`}
          title={`Share on ${s.name}`}>
          {s.icon}
        </motion.a>
      ))}

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: -15 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.25 }}
            className="absolute -top-7 sm:-top-8 bg-black text-white text-xs px-3 py-1 
              rounded-md shadow-md whitespace-nowrap">
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareButtons;