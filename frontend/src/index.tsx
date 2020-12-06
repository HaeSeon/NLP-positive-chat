import React from "react";
import ReactDOM from "react-dom";

import { App, ContextProvider } from "./App";

ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
  document.getElementById("root")
);
