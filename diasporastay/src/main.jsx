import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";  // ← IMPORTANT
import "./styles/theme.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


window.addEventListener("unhandledrejection", (e) => {
  console.error("UNHANDLED PROMISE:", e.reason);
});


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
