import { Route } from "@tanstack/react-router";
import { rootRoute } from "./Root_";
import { Project } from "../pages/Project";
import { Home } from "../pages/Home";
export const projectRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/project",
  component: Project ,
});
