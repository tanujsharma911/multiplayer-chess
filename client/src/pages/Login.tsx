import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Key } from "lucide-react";
import { useGoogleLogin, type CodeResponse } from "@react-oauth/google";
import { toast } from "sonner";
import { sendGoogleAuthCode } from "@/api/api";
import { useState } from "react";
import useUser from "@/store/user";
import { useNavigate } from "react-router";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useUser();
  const navigate = useNavigate();

  const handleOnSuccess = async (authResponse: {
    code?: string;
    scope?: string;
  }) => {
    if (authResponse?.code) {
      const userData = await sendGoogleAuthCode(authResponse.code);

      loginUser({
        name: userData.user.name,
        email: userData.user.email,
        avatar: userData.user.avatar,
      });

      toast.success("Login Successful");

      navigate("/");
    }
    setIsLoading(false);
  };

  const handleOnError = (
    error: Pick<CodeResponse, "error" | "error_description" | "error_uri">
  ) => {
    console.log("Login Failed:", error);
    toast.error("Login Failed");
    setIsLoading(false);
  };

  const login = useGoogleLogin({
    onSuccess: handleOnSuccess,
    onError: handleOnError,
    flow: "auth-code",
  });
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="max-w-5xl mx-auto mt-5">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          Login
        </h1>
        <div className="p-10">
          <Button
            onClick={() => {
              login();
              setIsLoading(true);
            }}
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : <Key />}
            Sign In With Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
