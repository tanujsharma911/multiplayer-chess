import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useUser from '@/store/user';
import {
  ChessQueen,
  LogOut,
  SquareDashed,
  SquareMinus,
  SquarePlus,
  Timer,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';

export interface gameModelType {
  player1: {
    avatar: string;
    email: string;
    name: string;
    rating: number;
    _id: string;
  };
  player2: {
    avatar: string;
    email: string;
    name: string;
    rating: number;
    _id: string;
  };
  moves: {
    after: string;
    before: string;
    color: string;
    from: string;
    to: string;
    lan: string;
    san: string;
    piece: string;
  }[];
  result: 'w' | 'b' | 'draw' | null;
  startedAt: Date;
  chats: {
    message: string;
    time: Date;
    from: string;
  }[];
  reason: string | null;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}

const Account = () => {
  const { user, logoutUser } = useUser();
  const api = useAxiosPrivate();
  const navigate = useNavigate();

  const [games, setGames] = useState([]);

  const handleLogout = async () => {
    const result = await api.post('/auth/logout');

    if (result.status === 200) {
      logoutUser();
      navigate('/login');
    } else {
      alert('Logout failed. Please try again.');
    }
  };

  useEffect(() => {
    const fetchUserGame = async () => {
      try {
        const response = await api.get('/game/getgames');
        console.log('User games:', response.data.games);
        setGames(response.data.games);
      } catch (error) {
        console.error('Error fetching user games:', error);
      }
    };

    fetchUserGame();
  }, []);

  return (
    <div className="lg:max-w-4xl mx-auto mt-20 p-4">
      <Card className="shadow-none text-white">
        <CardContent className="px-6 py-2">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={user?.avatar || '/placeholder.svg'}
                alt={user?.name || 'User Avatar'}
                referrerPolicy="no-referrer"
              />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="text-xl font- text-white truncate">
                {user?.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>

            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mt-8 mb-4">Your Games</h2>

        {games.length === 0 ? (
          <p>You have no games played yet.</p>
        ) : (
          <ul className="space-y-4">
            {games.map((game: gameModelType) => {
              const playerColor =
                game.player1.email === user?.email ? 'b' : 'w';

              return (
                <li
                  key={game._id}
                  className="p-4 border rounded-lg flex gap-6 items-center justify-between hover:border-zinc-700 transition-all cursor-pointer"
                >
                  <Link
                    className="w-full flex items-center justify-between"
                    to={`/analyse/${game._id}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col justify-center items-center gap-2 mx-2">
                        <Timer size={32} color="#1e74ff" />
                        <p className="text-xs text-gray-400">10 Min</p>
                      </div>
                      <div>
                        <div className="flex items-center text-gray-300 gap-2">
                          <div className="h-2 w-2 bg-gray-300"></div>{' '}
                          {game.player2.name}{' '}
                          {game.result === 'w' && (
                            <ChessQueen size={12} color="#ffa51e" />
                          )}
                        </div>
                        <div className="flex items-center text-gray-300 gap-2">
                          <div className="h-2 w-2 bg-accent border"></div>{' '}
                          {game.player1.name}
                          {game.result === 'b' && (
                            <ChessQueen size={12} color="#ffa51e" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center w-full justify-end gap-2">
                          <div className="text-gray-400">Moves</div>{' '}
                          {game.moves.length}
                        </div>
                        <div>{new Date(game.startedAt).toDateString()}</div>
                      </div>
                      <div>
                        {playerColor === game.result ? (
                          <SquarePlus color="oklch(62.7% 0.194 149.214)" />
                        ) : game.result === 'draw' ? (
                          <SquareDashed color="oklch(44.6% 0.043 257.281)" />
                        ) : (
                          <SquareMinus color="oklch(50.5% 0.213 27.518)" />
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Account;
