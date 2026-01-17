import { CHAT } from "@/App";
import ChatHistory from "./ChatHistory";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSocketStore } from "@/store/socket";
import { useState } from "react";

const ChatsPanel = () => {
  const { socket } = useSocketStore();
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!socket || message.trim() === "") return;

    socket.emit("message", {
      type: CHAT,
      payload: message,
    });

    setMessage("");
  };
  return (
    <div className="h-[60vh] grid grid-rows-[1fr_auto] gap-4">
      <div className="h-full rounded-lg bg-background overflow-scroll">
        <ChatHistory />
      </div>

      <div className="flex">
        <Input
          type="text"
          placeholder="Send a message"
          className="flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button className="ml-2" onClick={handleSendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatsPanel;
