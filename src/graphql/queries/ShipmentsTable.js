import React, { useState, useEffect, useContext } from "react";
import {
  GET_COMPANY_DETAIL,
  GET_SHIPMENT_DETAIL,
  GET_SHIPMENTS_PAG,
  SHIPMENTS_UPDATED_SUBSCRIPTION,
  SHIPMENTS_CREATED_SUBSCRIPTION,
  SHIPMENTS_CHECKPOINTS_SUBSCRIPTION,
} from "../../queries";
import { useQuery, useLazyQuery, useSubscription } from "@apollo/client";
import { company_id } from "../../const";
import { useShipments } from "./ShipmentsCards";
import {FilterDayMonth} from "context/filterDayMonth";

export default function useShipmentsTable() {
const { initialDayMonth, setInitialDayMonth } = useContext(FilterDayMonth);
let initialFilter=initialDayMonth 

  // ESTADOS LOCALES ------------------------------------------------------------------------------------
  //estado para el filtro segun pestaña en la que este parado
  const [selectedFilter, setSelectedFilter] = useState("TRANSIT");

  const changeFilter = (filter) => {
    console.log("este es el filter");
    console.log(filter.toUpperCase());
    console.log(filter);

    switch (filter) {
      case "inTransit":
        setSelectedFilter("TRANSIT");
        break;
      case "completed":
        setSelectedFilter(null);
        break;
      case "succeeded":
        setSelectedFilter("SUCCESSFUL");
        break;
      case "failed":
        setSelectedFilter("FAILED");
        break;
      case "uncertain":
        setSelectedFilter("UNCERTAIN");
        break;
      default:
        setSelectedFilter("TRANSIT");
        break;
    }
  };
  //   //estado para paginación
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  //   //estado para el modal del contenido del envio
  //   const [content, setContent] = useState(false);

  //   //estado para el modal del graph de temp-intru
  //   const [temperatureAlert, setTemperatureAlert] = useState(false);

  //   //ESTADO PARA MODAL DE COMPARAR ENVIOS
  //   const [compareModal, setCompareModal] = useState(false);
  //   //estado para el modal de checkpoints
  //   const [checkpointsModal, setCheckpointsModal] = useState(false);

  //   //estado para el modal de comentarios
  //   const [comments, setComments] = useState(false);

  //   //estado para guardar el id del shipment para ver sus comentarios

  //   const [shipToSeeComments, setShipToSeeComments] = useState("");

  //   //SETEO DE FECHAS PARA FILTRADO -------------------------------------------------------------------------------
  const date = new Date();
  const firstDayOfMonth = new Date().setDate("01");
  const [initialDay, setInitialDay] = useState(
    new Date(new Date().setHours("00", "00", "00"))
  );
  const [initialMonth, setInitialMonth] = useState(
    new Date(new Date(firstDayOfMonth).setHours("00", "00", "00"))
  );
  const [finalDate, setFinalDate] = useState(new Date(date));

  // QUERIES Y SUBSCRIPTIONS ------------------------------------------------------------------------------------------
  //subscription para viajes iniciados
  const {
    error: createdShipError,
    // loading: createdShipLoading,
    data: createdShipData,
  } = useSubscription(SHIPMENTS_CREATED_SUBSCRIPTION);

  //subscription de viajes terminados
  const {
    // loading: updatedShipLoading,
    error: updatedShipError,
    data: updatedShipData,
  } = useSubscription(SHIPMENTS_UPDATED_SUBSCRIPTION);

  //subscription de checkpoints
  const {
    // loading: updatedCheckpointsLoading,
    error: updatedCheckpointsError,
    data: updatedCheckpointsData,
  } = useSubscription(SHIPMENTS_CHECKPOINTS_SUBSCRIPTION);

  //   //query para traerme la data paginada
  const {
    loading: paginatedDataLoading,
    error: paginatedDataError,
    data: paginatedData,
  } = useQuery(GET_SHIPMENTS_PAG, {
    variables: {
      company_id,
      in_transit: selectedFilter === "TRANSIT" ? true : false,
      status: selectedFilter !== "TRANSIT" ? selectedFilter : null,
      from_date:
        selectedFilter !== "TRANSIT"
          ? initialFilter === "month"
            ? initialMonth.toISOString()
            : initialDay.toISOString()
          : "",
      to_date: finalDate.toISOString(),
      page,
      per_page: rowsPerPage,
    },
  });

  //   //lazy query para actualizar la data
  const [
    lazyGetShipmentsPag,
    {
      loading: lazyPaginatedDataLoading,
      error: lazyPaginatedDataError,
      data: lazyPaginatedData,
    },
  ] = useLazyQuery(GET_SHIPMENTS_PAG);

  //   //query para traerme las branches de la compañia
  const {
    // loading: branchesLoading,
    error: branchesError,
    data: company_detail,
  } = useQuery(GET_COMPANY_DETAIL, {
    variables: {
      company_id,
    },
  });

  //   //lazy query para traerme el content de los viajes en transito
  const [
    getShipment,
    {
      // loading: contentLoading,
      error: contentError,
      data: contentData,
    },
  ] = useLazyQuery(GET_SHIPMENT_DETAIL);

  //   // USE EFFECT ----------------------------------------------------------------------------------------------------
    useEffect(() => {
    console.log('cambio la pagina y el numero es: ', page);

    }, [page]);

  //SI SE CREA/CIERRA UN ENVIO O HAY UN CHECKPOINT SE ACTUALIZA EL COMPONENTE
  if (updatedCheckpointsData || updatedShipData || createdShipData) {
    window.location.reload();
  }

  //   // VARIABLES DONDE GUARDO LA DATA -----------------------------------------------------------------
  let infoLength = paginatedData?.shipments?.total;
  let info = paginatedData?.shipments
//   console.log(info);
//   console.log(infoLength);

  //   // HANDLERS --------------------------------------------------------------------------------------------
  //   //handler de las solapas
  //   const handleChange = (e, newValue) => {
  //     setSelectedFilter(newValue);
  //   };

  //   //handler de la paginacion
  //   const handleChangePage = (event, value) => {
  //     setPage(value);
  //   };

  //   //handler del modal de contenido
  //   const handleContent = (shipment_id) => {
  //     getShipment({ variables: { shipment_id } });
  //     setContent(true);
  //   };

  //   //handler del cuadro de temperatura
  //   const handleTemperatureContent = (shipment_id) => {
  //     getShipment({ variables: { shipment_id } });
  //     setTemperatureAlert(true);
  //   };

  //   //handler del modal de checkpoints
  //   const handleCheckpointsModal = (shipment_id) => {
  //     getShipment({ variables: { shipment_id } });
  //     setCheckpointsModal(true);
  //   };

  //   //handler del close del modal del contenido
  //   const handleOnClose = () => {
  //     setContent(false);
  //   };

  //   //handler del close del cuadro de temperatura
  //   const handleTemperatureClose = () => {
  //     setTemperatureAlert(false);
  //   };

  //   //handler del close del modal de checkpoints
  //   const handleCheckpointsModalClose = () => {
  //     setCheckpointsModal(false);
  //   };

  //   //handler para que vuelva a la primera pagina cada vez que cambio de tab
  //   const handleOnChangeTab = () => {
  //     setPage(1);
  //   };

  //   //handler del modal de comments
  //   const handleCommentsModal = (id) => {
  //     setComments(true);
  //     setShipToSeeComments(id);
  //   };

  //   //handler del close del modal de comments
  //   const handleOnCloseComments = () => {
  //     setComments(false);
  //   };

  //   //MANEJO DE ERRORES -------------------------------------------------------------------------------------
  if (lazyPaginatedDataError)
    console.log("error en la lazy data paginada", lazyPaginatedDataError);
  if (paginatedDataError)
    console.log("error en la data paginada", paginatedDataError);
  if (createdShipError)
    console.log("error en la subscription de viajes creados", createdShipError);
  if (updatedShipError)
    console.log(
      "error en la subscription de viajes cerrados",
      updatedShipError
    );
  if (updatedCheckpointsError)
    console.log(
      "error en la subscription de checkpoints",
      updatedCheckpointsError
    );
  if (branchesError)
    console.log("error en la query de branches", branchesError);
  if (contentError)
    console.log("error en el contenido de viajes en transito", contentError);
  return [changeFilter,infoLength,info, company_detail,setPage, page, lazyPaginatedDataLoading, paginatedDataLoading];
}
