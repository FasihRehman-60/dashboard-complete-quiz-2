import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  const goBack = () => {
    // Navigate to the dashboard URL
    navigate("/dashboard");
  };

  return (
    <button
      onClick={goBack}
      className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 mb-4"
    >
      <ArrowLeft size={16} /> Back to Dashboard
    </button>
  );
}
