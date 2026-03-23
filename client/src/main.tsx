import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="923962697390-fo9075680mbi0dlons43fqnemv1bokvc.apps.googleusercontent.com">
    <BrowserRouter>
      <AuthProvider>   
        <App />
      </AuthProvider>
    </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);