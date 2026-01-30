import { Route } from "@tanstack/react-router";
import { rootRoute } from "./Root_";
import { Profile } from "../pages/profile";
export const profileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: Profile ,
});
