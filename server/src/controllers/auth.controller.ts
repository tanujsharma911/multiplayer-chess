import type { Request, Response } from "express";
import { oauth2Client } from "../utils/googleConfig.js";
import axios from "axios";
import { User, type UserModel } from "../models/user.model.js";

const generateAccessAndRefreshTokens = (user: UserModel) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new Error("Internal server error :: token generation failed");
  }
};

const googleLogin = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code) {
      res.status(400).json({
        code: 400,
        status: "error",
        message: "Bad Request :: Missing auth code",
      });
      return;
    }

    const googleRes = await oauth2Client.getToken(code as string);

    oauth2Client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    const { name, email, picture } = userRes.data;

    const user = await User.findOne({ email });

    if (!user) {
      const user = new User({
        name,
        email,
        avatar: picture,
      });

      await user.save();
    }

    if (!user) {
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "Internal Server Error :: Can't register user",
      });
    }

    const { accessToken, refreshToken } = generateAccessAndRefreshTokens(
      user as unknown as UserModel
    );

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // skip validation

    const isProd = process.env.NODE_ENV === "production"; // TODO: Why it is required
    const cookiesOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict" as const,
    };

    res
      .cookie("accessToken", accessToken, cookiesOptions)
      .cookie("refreshToken", refreshToken, cookiesOptions)
      .json({
        code: 200,
        status: "success",
        user: {
          name,
          email,
          avatar: picture,
        },
      });
  } catch (error) {
    console.error("Error fetching Google user data:", error);
    return res
      .status(500)
      .json({ code: 500, status: "error", message: "Internal Server Error" });
  }
};

const getUserInfo = async (req: Request, res: Response) => {
  try {
    const userEmail = req?.user?.email;

    if (!userEmail) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Bad Request :: Missing user email",
      });
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: "success",
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Error retrieving user info:", error);
    return res
      .status(500)
      .json({ code: 500, status: "error", message: "Internal Server Error" });
  }
};

const userLogout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Bad Request :: Missing refresh token",
      });
    }

    const user = await User.findOne({ refreshToken });

    if (user) {
      user.refreshToken = "";
      await user.save({ validateBeforeSave: false });
    }

    res.clearCookie("accessToken").clearCookie("refreshToken").json({
      code: 200,
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return res
      .status(500)
      .json({ code: 500, status: "error", message: "Internal Server Error" });
  }
};

const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Bad Request :: Missing refresh token",
      });
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Unauthorized :: Invalid refresh token",
      });
    }

    const tokens = generateAccessAndRefreshTokens(user as unknown as UserModel);

    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    const isProd = process.env.NODE_ENV === "production";
    const cookiesOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict" as const,
    };

    res
      .cookie("accessToken", tokens.accessToken, cookiesOptions)
      .cookie("refreshToken", tokens.refreshToken, cookiesOptions)
      .json({
        code: 200,
        status: "success",
        message: "Tokens refreshed successfully",
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      });
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    return res
      .status(500)
      .json({ code: 500, status: "error", message: "Internal Server Error" });
  }
};

export { googleLogin, userLogout, getUserInfo, refreshAccessToken };
