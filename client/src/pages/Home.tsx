import { useNavigate } from 'react-router';
// import { useSocketStore } from '../store/socket';
import useUser from '@/store/user';
import { Button } from '@/components/ui/button';
import { ChessKnight } from 'lucide-react';
import Board from '@/components/Board';
import { Chess } from 'chess.js';

const Home = () => {
  const navigate = useNavigate();
  // const { socket } = useSocketStore();
  const { user } = useUser();

  const chess = new Chess();

  const handleOnClick = () => {
    navigate('/login');
  };

  return (
    <div className="h-full w-full">
      <div className="flex flex-col lg:flex-row p-10 h-full w-full">
        <div className="w-80 mx-auto lg:mx-0 lg:w-120 aspect-square">
          <Board chess={chess} animate={true} />
        </div>
        <div className="w-fit p-6">
          <h1 className="text-7xl font-bold motion-preset-slide-up-md motion-blur-in-sm">
            Make Chess
          </h1>
          <h1 className="text-7xl font-bold motion-preset-slide-up-md motion-blur-in-sm">
            Great Again <span className='text-orange-400 text-shadow-lg text-shadow-orange-900/50'>!</span>
          </h1>
          {!user.isLoggedIn && (
            <Button
              onClick={handleOnClick}
              size={'xl'}
              className="mt-4 font-bold text-lg motion-preset-slide-up-md motion-delay-150 motion-blur-in-sm"
              variant="special"
            >
              <ChessKnight className="size-6!" />
              Play
            </Button>
          )}
        </div>

        <img
          src="/img/chess-bg.webp"
          alt=""
           draggable="false"
          className="absolute right-10 -bottom-10 opacity-10 rotate-12 motion-scale-in-0 motion-blur-in-lg"
          width="400"
        />
      </div>
    </div>
  );
};

export default Home;
