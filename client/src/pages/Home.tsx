import { ChessKnight } from "lucide-react";
import { useNavigate } from "react-router";
import { useSocketStore } from "../store/socket";
import CustomButton from "@/components/ui/customButton";
import useUser from "@/store/user";

const Home = () => {
  const navigate = useNavigate();
  const { socket } = useSocketStore();
  const { user } = useUser();

  const handleOnClick = () => {
    if (!socket) {
      console.log("No socket found");
      return;
    }
    navigate("/game");
  };

  return (
    <div className="h-full w-full">

      <div className="pt-20 flex flex-col items-center gap-4">
        <h1 className="text-5xl text-shadow-[0_0_20px_#446dbe3e] text-blue-200 font-bold motion-opacity-in-0 motion-blur-in-xs motion-translate-y-in-100 ">
          Play Chess
        </h1>
        <h1 className="text-6xl text-shadow-[0_0_20px_#446dbe7d] text-blue-100 font-bold mb-5 motion-opacity-in-0 motion-blur-in-xs motion-translate-y-in-50 motion-delay-100">
          On #1 Online Platform
        </h1>
        <div className="flex justify-between gap-4">
          <CustomButton
            handleOnClick={handleOnClick}
            disabled={!user.isLoggedIn}
          >
            <ChessKnight />
            Play Now
          </CustomButton>
          {!user.isLoggedIn && (
            <p className="text-gray-400 mt-2 motion-opacity-in-0 motion-blur-in-xs motion-translate-y-in-50 motion-delay-200">
              Please login to play
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
