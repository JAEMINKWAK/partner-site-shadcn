// src/main.jsx 또는 src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // ✅ 요게 빠졌던 거예요!
import "./index.css";    // 필요하다면 스타일도 추가

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
