import type { AuthUser } from "./user";

declare module "socket.io" {
  interface Socket {
    data: {
      user?: AuthUser;
    };
  }
}
