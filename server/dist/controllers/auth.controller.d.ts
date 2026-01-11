import type { Request, Response } from "express";
declare const googleLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const getUserInfo: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const userLogout: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const refreshAccessToken: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export { googleLogin, userLogout, getUserInfo, refreshAccessToken };
//# sourceMappingURL=auth.controller.d.ts.map