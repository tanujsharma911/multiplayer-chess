import useUser from "@/store/user";
import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";

const Navbar = () => {
  const { user } = useUser();

  const navigate = useNavigate();

  return (
    <nav className="absolute top-0 left-0 right-0 bg-gray-600/50 backdrop-blur-2xl border-b border-b-gray-600 flex justify-center z-100">
      <div className="w-full max-w-5xl flex items-center justify-between gap-2 p-2">
        <Link to={"/"} className="font-black text-xl z-100">
          Chess
        </Link>
        {user.isLoggedIn ? (
          <div>{user?.name}</div>
        ) : (
          <Button onClick={() => navigate("/login")}>Login</Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
