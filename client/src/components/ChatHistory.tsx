import { cn } from "@/lib/utils";
import { useGame } from "@/store/game";
import { useEffect } from "react";

const ChatHistory = () => {
  const { game } = useGame();
  const yourColor = game?.you;

  useEffect(() => {
    console.log("Chat history updated:", game?.chats);
  }, [game?.chats]);

  return (
    <div className="h-full p-2 pt-3 rounded-lg flex flex-col gap-3">
      {game?.chats &&
        game.chats.map(
          (
            chat: { time: string; message: string; from: string },
            index: number
          ) => (
            <div
              key={index}
              className={cn(`mb-2 w-full flex`, {
                "justify-end": chat.from === yourColor,
              })}
            >
              <div
                className={cn(
                  "text-white p-2 rounded-md w-fit flex flex-col gap-1 space-y-1",
                  chat.from === yourColor ? "bg-gray-800" : "bg-emerald-800/50"
                )}
              >
                <span>{chat.message}</span>

                <span className="text-gray-300 text-xs">
                  {new Date(chat?.time).toLocaleTimeString()}
                </span>
              </div>
            </div>
          )
        )}
    </div>
  );
};

export default ChatHistory;
