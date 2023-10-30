import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { getResumeFiles } from "./utils/resumeFileGenerator";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

getResumeFiles()
  .then((files) => {
    console.log(files);
    root.render(
      <React.StrictMode>
        <App initialFiles={files} />
      </React.StrictMode>,
    );
  })
  .catch((error) => {
    console.error("Woops, couldn't load", error);
  });
