import { Route, redirect } from "@tanstack/react-router";
import { rootRoute } from "./Root_";
import PrettyRegister from "../pages/Register";
import { getAuthUser } from "../lib/auth";
import toast from "react-hot-toast";

export const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/register",
  beforeLoad: async () => {
    const user = await getAuthUser();

    if (user) {
      throw redirect({
        to: "/",
      });

    }
  },

  component: PrettyRegister,
});
