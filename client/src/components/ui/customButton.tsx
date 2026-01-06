import { cn } from "@/lib/utils";
import React from "react";

interface CustomButtonProps {
  children: React.ReactNode;
  handleOnClick: () => void;
  disabled?: boolean;
}

const CustomButton = ({
  children,
  handleOnClick,
  disabled,
}: CustomButtonProps) => {
  return (
    <button
      className={cn(
        "bg-purple-500 font-bold flex items-center motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-xs gap-2 text-shadow-md px-5 py-2 border-purple-300 border-2 rounded-md shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-102 transition-all duration-100 ease-in-out inset-shadow-sm inset-shadow-purple-700 motion-delay-100",
        disabled
          ? "cursor-not-allowed bg-gray-500 border-gray-300  inset-shadow-gray-700 shadow-gray-500/30 hover:shadow-purple-500/30 hover:scale-100"
          : ""
      )}
      onClick={handleOnClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default CustomButton;
