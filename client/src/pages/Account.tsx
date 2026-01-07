import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useUser from "@/store/user";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router";

const Account = () => {
  const { user, logoutUser } = useUser();
  const api = useAxiosPrivate();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await api.post("/auth/logout");

    if (result.status === 200) {
      logoutUser();
      navigate("/login");
    } else {
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="lg:max-w-4xl mx-auto mt-20 p-4">
      <Card className="shadow-none bg-gray-800 text-white">
        <CardContent className="px-6 py-2">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={user?.avatar || "/placeholder.svg"}
                alt={user?.name || "User Avatar"}
              />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font- text-white truncate">
                {user?.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
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
    </div>
  );
};

export default Account;
