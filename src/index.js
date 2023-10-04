import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import { ApolloProvider } from "@apollo/client";
import { client } from "./apolloClient";
import { parseJwt } from "./helpers";
import mapboxgl from "mapbox-gl";
import { ContextFilterDayMonth } from "context/filterDayMonth";


const mpt = localStorage.getItem("mbt");
mapboxgl.accessToken = mpt;
const root = ReactDOM.createRoot(document.getElementById("root"));
const user_id = localStorage.getItem("token")?.length > 0 && parseJwt(localStorage.getItem("token"))?.user_id;

//creo un espacio para guardar las notificaciones

//creo un espacio para guardar el idioma
if (user_id && !localStorage.getItem('language')) localStorage.setItem('language', navigator.window.language.split('-')[0]);
if (user_id && !localStorage.getItem(`notifications`)) localStorage.setItem(`notifications`, '');
if (user_id && !localStorage.getItem(`notificationsENG`)) localStorage.setItem(`notificationsENG`, '');
if (user_id && !localStorage.getItem(`numberNoti`)) localStorage.setItem(`numberNoti`, '0');


if (
  !user_id || // Si no hay token
  (localStorage.getItem("token") && parseInt(localStorage.getItem("expiration")) < Date.now())
) {
  
  root.render(
    <ApolloProvider client={client}>
     
      <BrowserRouter>
        <Routes>
          <Route path="/auth/*" element={<AuthLayout />} />
          <Route path="*" element={<Navigate to="/auth/login" replace />} /> {/* Redirige al inicio de sesión */}
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
} else {
  
  // Obtener un token válido, por lo que muestra la pantalla de administrador
  root.render(
    <ApolloProvider client={client}>
       <ContextFilterDayMonth>
         <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="*" element={<Navigate to="/admin/index" replace />} />
        </Routes>
      </BrowserRouter>
        </ContextFilterDayMonth>
     
    </ApolloProvider>
  );
}