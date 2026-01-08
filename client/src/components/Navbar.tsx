import useUser from "@/store/user";
import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";

const Navbar = () => {
  const { user } = useUser();

  const navigate = useNavigate();

  return (
    <nav className="bg-gray-600/50 backdrop-blur-2xl border-b border-b-gray-600 flex justify-center z-100">
      <div className="w-full max-w-5xl flex items-center justify-between gap-2 p-2">
        <Link to={"/"} className="font-black text-xl z-100">
          Chess
        </Link>
        {user.isLoggedIn ? (
          <Link
            to={"/account"}
            className="hover:bg-gray-800 py-1 px-2 rounded-lg"
          >
            {user?.name}
          </Link>
        ) : (
          <Button onClick={() => navigate("/login")}>Login</Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
