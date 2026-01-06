import useUser from "@/store/user";
import { useEffect } from "react";
import { useNavigate } from "react-router";

interface AuthLayoutProps {
  authRequired: boolean;
  children: React.ReactNode;
}

const AuthLayout = (props: AuthLayoutProps) => {
  const { authRequired = true, children } = props;

  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    if (authRequired && !user.isLoggedIn) {
      navigate("/login");
    } else if (!authRequired && user.isLoggedIn) {
      navigate(-1);
    }
  }, []);

  return <div>{children}</div>;
};

export default AuthLayout;
