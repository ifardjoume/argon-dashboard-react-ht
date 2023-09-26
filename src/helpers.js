import axios from "axios";
import { GET_REPORT_PDF, SERVER_URL } from "./const";
import { UPDATE_COMPANY } from "./queries";
import {
  format,
  formatInTimeZone,
  utcToZonedTime,
  zonedTimeToUtc,
} from "date-fns-tz";
import { es } from "date-fns/locale"; // Cambia el idioma de los meses y días a español si es necesario

//funcion para sacar diferencial porcentual con el dia/mes anterior
export function getPercentageChange(oldNumber, newNumber) {
  var decreaseValue = oldNumber - newNumber;

  if (oldNumber === 0 || newNumber === 0 || oldNumber === newNumber)
    return null;

  return ((decreaseValue / oldNumber) * 100).toFixed(1) + "%";
}

//funcion para decodear el token y sacar la info
export function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  localStorage.setItem("mbt", JSON.parse(jsonPayload).mb);
  return JSON.parse(jsonPayload);
}

//funcion para descargar reporte en pdf
export async function fetchReportFile(shipment_id) {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(GET_REPORT_PDF + shipment_id, {
      headers: { authorization: `Bearer ${token}` },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `report-${shipment_id}.pdf`);
    document.body.appendChild(link);
    link.click();
  } catch {
    alert("Error intentando descargar el reporte");
  }
}

//funcion para formatear la fecha de las notificaciones
export function formatNotiDate(date, language) {
  Number.prototype.padLeft = function (base, chr) {
    var len = String(base || 10).length - String(this).length + 1;
    return len > 0 ? new Array(len).join(chr || "0") + this : this;
  };

  if (language === "es") {
    return (
      [
        date.getDate().padLeft(),
        (date.getMonth() + 1).padLeft(),
        date.getFullYear(),
      ].join("/") +
      " " +
      [date.getHours().padLeft(), date.getMinutes().padLeft()].join(":")
    );
  } else {
    return (
      [
        (date.getMonth() + 1).padLeft(),
        date.getDate().padLeft(),
        date.getFullYear(),
      ].join("/") +
      " " +
      [date.getHours().padLeft(), date.getMinutes().padLeft()].join(":")
    );
  }
}
//seteo data general en local storage
export const setLocalStorageData = (token, date) => {
  localStorage.setItem("token", token);
  localStorage.setItem("expiration", date);
  localStorage.setItem("notifications", "");
  localStorage.setItem("notificationsENG", "");
  localStorage.setItem("numberNoti", 0);
};
// funcion para sacar al usuario q se quiere meter x la fuerza donde no tiene acceso
export const logOut = () => {
  console.log("out!!!");
  localStorage.setItem("token", "");
  localStorage.setItem("expiration", "");
  localStorage.setItem("notifications", "");
  localStorage.setItem("notificationsENG", "");
  localStorage.setItem("numberNoti", "");
  localStorage.setItem("access", "");
  localStorage.setItem("assigned_to", null);
  localStorage.setItem("tempAlert", false);
  localStorage.setItem("intrusion", false);
  window.location.replace("/");
};

export const getDeviceLocation = async (company_id) => {
  const token = localStorage.getItem("token");
  const result = await axios.get(`${SERVER_URL}/getgeo/${company_id}`, {
    headers: { authorization: `Bearer ${token}` },
  });

  return result.data;
};

export const calcBoundaries = (devices) => {
  const boundaries = {
    min_coords: {
      lng: null,
      lat: null,
    },
    max_coords: {
      lng: null,
      lat: null,
    },
  };
  let lat = devices.map(function (p) {
    return p.lat;
  });
  let lng = devices.map(function (p) {
    return p.lng;
  });

  boundaries.min_coords.lng = Math.min.apply(null, lng);
  boundaries.min_coords.lat = Math.min.apply(null, lat);
  boundaries.max_coords.lng = Math.max.apply(null, lng);
  boundaries.max_coords.lat = Math.max.apply(null, lat);

  return boundaries;
};
export const getColor = (companyAlertParams, range, temp, intrusion) => {
  let backColor = "";
  //filtro el rango c nombre (REF, CON,AMB)
  let rangesToCompare = companyAlertParams?.filter(
    (temp) => temp?.name === range
  )[0];

  let tempAlert = false;

  if (intrusion) localStorage.setItem("intrusion", true);

  if (temp < rangesToCompare?.min || temp > rangesToCompare?.max) {
    tempAlert = true;
    backColor = "red";

    // localStorage.setItem('tempAlert',true);
  }
  //SI TENGO INTRUSION Y NO ALERTA DE TEMP.
  else if (intrusion && !tempAlert) backColor = "#F0EA3F"; //yellow
  // SI TENGO INTRUSION Y ALERTA DE TEMP. GANA TEMP!
  else if (intrusion && tempAlert) backColor = "#D60707";
  // SI ESTA TODO BIEN VERDE
  else backColor = "#33B27F";

  return backColor;
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const convertirHoraLocal = (fechaISO, zonaHoraria) => {
  
  if (fechaISO && zonaHoraria && localStorage.getItem('language') === 'es') {
    const fechaUtc = utcToZonedTime(fechaISO, zonaHoraria);
    const fechaFormateada = format(
      fechaUtc,
      "MMM dd  h:mm a",
      { locale: es }
    );

    return capitalizeFirstLetter(fechaFormateada)
  }
  if (fechaISO && zonaHoraria && localStorage.getItem('language') !== 'es') {
    const fechaUtc = formatInTimeZone(fechaISO, zonaHoraria, 'MMM dd  h:mm a');
    return fechaUtc;
  }
};
