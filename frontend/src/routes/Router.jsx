import { createRouter } from "@tanstack/react-router";
import { rootRoute } from "./Root_";
import { homeRoute } from "./homeroute";
import { loginRoute } from "./loginroute";
import { registerRoute } from "./registerroute";
import { projectRoute } from "./projectroute";
import { profileRoute } from "./profileroute";

// Build the route tree
const routeTree = rootRoute.addChildren([
  projectRoute,
  homeRoute,
  loginRoute,
  registerRoute,
  profileRoute
]);

// ✅ MODERN router creation
export const router = createRouter({
  routeTree,
});
