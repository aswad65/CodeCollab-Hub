import { Route, redirect } from "@tanstack/react-router";
import { rootRoute } from "./Root_";
import PrettyLogin from "../pages/Login";
import { getAuthUser } from "../lib/auth";

export const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: async () => {
    const user = await getAuthUser();
    if (user) {
      throw redirect({
        to: "/",
      });

    }


  },

  component: PrettyLogin,
});
