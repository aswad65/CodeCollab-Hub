import { Route ,redirect} from "@tanstack/react-router";
import { rootRoute } from "./Root_";
import { Home } from "../pages/Home";
import { getAuthUser } from "../lib/auth";
import toast from "react-hot-toast";
export const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",

  beforeLoad: async () => {
    const user = await getAuthUser();

    if (!user) {
      throw redirect({
        to: "/login",
        search: {
          error: "login_required",
        },
      });
    }

    return { user };
  },
  component: Home,
});
