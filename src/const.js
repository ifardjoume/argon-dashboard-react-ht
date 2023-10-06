import { parseJwt,logOut } from "./helpers";

//PARA TRABAJAR LOCALMENTE
export const BASE_URL = "http://localhost:3000";

// DEVELOPMENT/
// export const GET_REPORT_PDF = "http://devs.h-trace.com/reports/";
// export const BASE_URL = "http://development.h-trace.com";
// export const SERVER_URL = "http://devs.h-trace.com";
// export const SUBSCRIPTION_URL = "ws://devs.h-trace.com/subscriptions";

// TESTING
//  export const GET_REPORT_PDF = "http://testing.h-trace.com/reports/";
//  export const BASE_URL = "http://test-dash.h-trace.com";
//  export const SERVER_URL = "http://testing.h-trace.com";
//  export const SUBSCRIPTION_URL = "ws://testing.h-trace.com/subscriptions";

// // PRODUCTION
export const GET_REPORT_PDF = "https://api.h-trace.com/reports/";
//export const BASE_URL = "https://dashboard.h-trace.com";
export const SERVER_URL = "https://api.h-trace.com";
export const SUBSCRIPTION_URL = "wss://api.h-trace.com/subscriptions";

//TIPOS DE USUARIOS
export const usersType =
  localStorage.getItem("language") === "en"
    ? ["Admin", "Calibrator", "Operator", "Shipper"]
    : ["Administrador", "Calibrador", "Operario", "Transportista"];

//TIPOS DE DISPOSITIVOS
export const devicesList = [
  "RC_Card",
  "RC_Tube",
  "RC_Pack",
  "RC_Way",
  "RC_Freezer",
];

//ALERTAS DE TEMPERATURA
export const devicesTempRanges = ["AMB", "CON", "REF"];

//TIPOS DE SENSORES DE DISPOSITIVOS
export const devicesSensors = ["TEMPERATURE", "ACCELERATION", "HALL", "LIGHT"];

//COMPANY ID / gmt
export const company_id =
  localStorage.getItem("token") &&
  parseJwt(localStorage.getItem("token")).belong_id;
export const gmt =
  localStorage.getItem("token") && parseJwt(localStorage.getItem("token")).gmt;
export const user_id =
  localStorage.getItem("token") &&
  parseJwt(localStorage.getItem("token")).user_id;

   export const level =localStorage.getItem("token")? parseJwt(localStorage.getItem("token")).lvl: '';
  const access = localStorage.getItem("access");
   const assigned = localStorage.getItem("assigned_to");

 export let access_parced =()=>{

    if (!parseJwt(localStorage.getItem("token")).SUDO) {
    if (assigned === "null") logOut();
    if (access !== "") {
      return JSON.parse(access);
      
    }
  }
  };
 
 

//MESES PARA EL CUADRO DE ESTADISTICAS
export const meses = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

//ALERTAS DE TEMPERATURA
export const temp_alerts = ["AMB", "REF", "CON"];

//ALERTAS DE ACELERACION
export const acc_alerts = ["Blood"];
export const language = localStorage.getItem("language");
