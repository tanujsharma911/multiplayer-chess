import { useNavigate } from 'react-router';
// import { useSocketStore } from '../store/socket';
import useUser from '@/store/user';
import { Button } from '@/components/ui/button';
import { ChessKnight } from 'lucide-react';
import Board from '@/components/Board';
import { Chess } from 'chess.js';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const chess = new Chess();

  const handleOnClick = () => {
    if (!user.isLoggedIn) {
      navigate('/login');
      return;
    }
    navigate('/game/random');
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[450px_auto] p-10 h-full w-full">
        <div className="aspect-square max-w-[450px]">
          <Board chess={chess} animate={true} />
        </div>
        <div className="flex flex-col items-start p-6">
          <h1 className="text-7xl font-bold motion-preset-slide-up-md motion-blur-in-sm">
            Make Chess
          </h1>
          <h1 className="text-7xl font-bold motion-preset-slide-up-md motion-blur-in-sm">
            Great Again{' '}
            <span className="text-orange-400 text-shadow-lg text-shadow-orange-900/50">
              !
            </span>
          </h1>
          <p className="leading-6 mt-5 opacity-75">
            chess.cloud is a real-time multiplayer chess platform with seamless
            matchmaking and AI gameplay. Players can compete with random
            opponents or challenge intelligent bots anytime. Built for speed,
            scalability, and a smooth competitive experience.
          </p>
          <Button
            onClick={handleOnClick}
            size={'xl'}
            className="mt-4 font-bold text-lg motion-preset-slide-up-md motion-delay-150 motion-blur-in-sm"
            variant="special"
          >
            <ChessKnight className="size-6!" />
            Play PvP
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
