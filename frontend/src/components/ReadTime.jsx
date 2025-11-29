import React, { useMemo } from "react";
import { Timer } from "lucide-react";

const ReadTime = ({ text, category }) => {
  if (!text) return null;

  const plainText = useMemo(() => {
    return text.replace(/<[^>]+>/g, "").trim();
  }, [text]);

  const wordCount = useMemo(() => {
    return plainText.split(/\s+/).filter(Boolean).length;
  }, [plainText]);

  if (wordCount === 0) return null;

  const readingSpeeds = {
    default: 200,
    tech: 180,
    science: 160,
    finance: 170,
    entertainment: 220,
    sports: 250,
  };

  const speed = readingSpeeds[category] || readingSpeeds.default;
  const minutes = wordCount / speed;

  let displayText;
  if (minutes < 1) displayText = "Less than 1 min read";
  else if (minutes < 2) displayText = "1 min read";
  else displayText = `${Math.ceil(minutes)} mins read`;

  const isLongRead = minutes >= 7; 
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex items-center gap-1 text-xs text-gray-500"><Timer size={14} /><span>{displayText}</span></div>
      {isLongRead && (
        <span className="rounded-full bg-purple-100 text-purple-700 text-[10px] font-medium px-2 py-0.5">Long Read</span>
      )}
    </div>
  );
};

export default ReadTime;