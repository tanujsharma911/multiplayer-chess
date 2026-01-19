import { cn } from '@/lib/utils';
import { useGame } from '@/store/game';
import { useEffect, useState } from 'react';

interface PropsTypes {
  chats?: {
    message: string;
    time: string | Date;
    from: string;
  }[];
  playerColor?: string;
}

const ChatHistory = (props: PropsTypes) => {
  const { chats: chatsProp, playerColor } = props;

  const { game } = useGame();

  const [chats, setChats] = useState<
    { time: string | Date; message: string; from: string }[]
  >(chatsProp || game?.chats || []);

  const yourColor = playerColor || game?.you;

  useEffect(() => {
    const handleSetChats = () => {
      setChats(chatsProp || game?.chats || []);
    };

    handleSetChats();
  }, [game]);

  return (
    <div className="h-full p-2 pt-3 rounded-lg flex flex-col gap-3">
      {chats &&
        chats.map(
          (
            chat: {
              message: string;
              time: Date | string;
              from: string;
            },
            index: number
          ) => (
            <div
              key={index}
              className={cn(`mb-2 w-full flex`, {
                'justify-end': chat.from === yourColor,
              })}
            >
              <div
                className={cn(
                  'text-white p-2 rounded-md w-fit flex flex-col gap-1 space-y-1',
                  chat.from === yourColor ? 'bg-emerald-800/50' : 'bg-gray-800'
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
      {!chats?.length && (
        <div className="text-center text-gray-500 col-span-2 mt-4">
          No chat messages yet
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
