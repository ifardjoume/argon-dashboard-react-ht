/*!

=========================================================
* Argon Dashboard PRO React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom/client";
// react library for routing
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// plugins styles from node_modules
import "react-notification-alert/dist/animate.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "select2/dist/css/select2.min.css";
import "quill/dist/quill.core.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
// plugins styles downloaded
import "assets/vendor/nucleo/css/nucleo.css";
// core styles
import "assets/scss/argon-dashboard-pro-react.scss?v1.2.1";

import AdminLayout from "layouts/Admin.js";
import RTLLayout from "layouts/RTL.js";
import AuthLayout from "layouts/Auth.js";
import IndexView from "views/Index.js";
import { parseJwt } from "helpers";
import { ApolloProvider } from "@apollo/client";
import { ContextFilterDayMonth } from "context/filterDayMonth";
import { client } from "apolloClient";

const root = ReactDOM.createRoot(document.getElementById("root"));
const user_id =
  localStorage.getItem("token")?.length > 0 &&
  parseJwt(localStorage.getItem("token"))?.user_id;
//creo un espacio para guardar las notificaciones

//creo un espacio para guardar el idioma
if (user_id && !localStorage.getItem("language"))
  localStorage.setItem("language", navigator.window.language.split("-")[0]);
if (user_id && !localStorage.getItem(`notifications`))
  localStorage.setItem(`notifications`, "");
if (user_id && !localStorage.getItem(`notificationsENG`))
  localStorage.setItem(`notificationsENG`, "");
if (user_id && !localStorage.getItem(`numberNoti`))
  localStorage.setItem(`numberNoti`, "0");

if (
  !user_id || // Si no hay token
  (localStorage.getItem("token") &&
    parseInt(localStorage.getItem("expiration")) < Date.now())
) {
  console.log('no hay user_id')
  root.render(
    <ApolloProvider client={client}>
      <ContextFilterDayMonth>
        <BrowserRouter>
        <Routes>
          <Route path="/auth/*" element={<AuthLayout />} />
          <Route path="*" element={<Navigate to="/auth/login" replace />} /> {/* Redirige al inicio de sesión */}
        </Routes>
        </BrowserRouter>
      </ContextFilterDayMonth>
    </ApolloProvider>
  );
} else {
  console.log('hay user_id')
  root.render(
    <ApolloProvider client={client}>
      <ContextFilterDayMonth>
        <BrowserRouter>
          <Routes>
            <Route path="/admin/*" element={<AdminLayout />} />

            <Route path="/rtl/*" element={<RTLLayout />} />
            
            {/* <Route path="/" element={<IndexView />} /> */}
            <Route path="*" element={<Navigate to="/admin/*" replace />} />
          </Routes>
        </BrowserRouter>
      </ContextFilterDayMonth>
    </ApolloProvider>
  );
}

