import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

interface OrderCompleteModalProps {
  isOpen: boolean;
  onRedirect: () => void;
}

export function OrderCompleteModal({ isOpen, onRedirect }: OrderCompleteModalProps) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isOpen && countdown === 0) {
      onRedirect();
    }
  }, [isOpen, countdown, onRedirect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="text-center">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Order complete</h1>
        <p className="text-gray-600 mb-8">Redirecting...</p>
        
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}