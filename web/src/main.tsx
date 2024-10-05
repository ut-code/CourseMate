import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import Layout from "./layout";

/* @template Tanstack Router https://tanstack.com/router/latest/docs/framework/react/quick-start */

// you don't need to edit routeTree.gen, Vite will do it automatically for us.
import { routeTree } from "./routeTree.gen";
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const root = document.getElementById("root");
if (!root) throw "couldn't find root!";

// ? Tanstack router template does this like this. I don't understand why, but it may be related to SSR or something so I'll leave this like this.
// delete this if cond if something goes wrong. (like watch mode not working? idk)
if (!root.innerHTML) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </React.StrictMode>,
  );
}
