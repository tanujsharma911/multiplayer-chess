import { useNavigate } from 'react-router';
import { useSocketStore } from '../store/socket';
import useUser from '@/store/user';
import { Button } from '@/components/ui/button';
import { ChessKnight } from 'lucide-react';
import Board from '@/components/Board';
import { Chess } from 'chess.js';

const Home = () => {
  const navigate = useNavigate();
  const { socket } = useSocketStore();
  const { user } = useUser();

  const chess = new Chess();

  const handleOnClick = () => {
    navigate('/login');
  };

  return (
    <div className="h-full w-full">
      <div className="flex flex-col lg:flex-row p-10 h-full w-full">
        <div className="w-120 aspect-square">
          <Board chess={chess} />
        </div>
        <div className="w-full p-6">
          <h1 className="text-5xl font-bold">
            Play Chess on the <br /> #2 Chess Platform!
          </h1>
          {!user.isLoggedIn && (
            <Button
              onClick={handleOnClick}
              size={'xl'}
              className="mt-4 font-bold text-lg"
            >
              <ChessKnight className="size-6!" />
              Play
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
