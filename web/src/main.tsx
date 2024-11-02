import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const root = document.getElementById("root");
if (!root) throw "couldn't find root!";
ReactDOM.createRoot(root).render(<React.StrictMode></React.StrictMode>);
