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
import React, { useState } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import ProgressBar from "@ramonak/react-progress-bar";
// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Form,
  Input,
  ListGroupItem,
  ListGroup,
  Media,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  Spinner,
  TabContent,
  TabPane,
  CardTitle,
  CardText,
  PaginationItem,
  PaginationLink,
  Pagination,
  ModalHeader,
  Modal,
  ModalBody,
  ModalFooter,
  CardFooter,
  UncontrolledTooltip,
} from "reactstrap";

// core components
import CardsHeader from "components/Headers/CardsHeader.js";

import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample6,
  chartExample7,
} from "variables/charts.js";
import { useShipments } from "graphql/queries/ShipmentsCards";
import useShipmentsTable from "graphql/queries/ShipmentsTable";
import { convertirHoraLocal } from "helpers";
import { useFailedUncertain } from "queries/stats";
import inTransitIcon from "../../../assets/img/icons/common/oldIcons/viajesEnCurso.png";
import completedIcon from "../../../assets/img/icons/common/oldIcons/viajesHechos.png";
import succededIcon from "../../../assets/img/icons/common/oldIcons/viajesConformes.png";
import uncertainIcon from "../../../assets/img/icons/common/oldIcons/viajesParaRevision.png";
import failedIcon from "../../../assets/img/icons/common/oldIcons/viajesConformes.png";
import "../../../assets/css/myCss/global.css";
import { set } from "date-fns";
import CheckpointsModal from "./modals/CheckpointsModal";
import ContentsModal from "./modals/ContentsModal";

import Comments from "./modals/Comments";
import Estadisticas from "./grafico de barras/Estadisticas";
import TempIntrusionChart from "./graficoTempIntrusion/TempIntrusionChart";

function Dashboard() {
  //hooks
  const [
    inTransitShipsState,
    loading,
    allData,
    handlerInitialFilter,
    prevData,
    initialFilter,
  ] = useShipments();

  //states
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [navPills, setNavPills] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalCheckpoints, setModalCheckpoints] = useState(false);
  const [modalContents, setModalContents] = useState(false);
  const [modalComments, setModalComments] = useState(false);
  const [modalAlerts, setModalAlerts] = useState(false);
  const [shipment_id, setShipment_id] = useState(null);

  const toggleModalCheckpoints = (e, shipment_id) => {
    setModalCheckpoints(!modalCheckpoints);
    setShipment_id(shipment_id);
  };
  const toggleModalContents = (e, shipment_id) => {
    setModalContents(!modalContents);
    setShipment_id(shipment_id);
  };
  const toggleModalComments = (e, shipment_id) => {
    setModalComments(!modalComments);
    setShipment_id(shipment_id);
  };
  const toggleModalAlerts = (e, shipment_id) => {
    setModalAlerts(!modalAlerts);
    setShipment_id(shipment_id);
   
  };
  // const toggleNavs = (e, index) => {
  //   e.preventDefault();
  //   setActiveNav(index);
  //   setChartExample1Data(chartExample1Data === "data1" ? "data2" : "data1");
  // };

  // const toggleNavs2 = (e, state, index) => {
  //   e.preventDefault();
  //   setNavPills(index);
  // };
  //completyed data
  const graphicData = {
    datasets: [
      {
        data: [
          allData?.succShipsState,
          allData?.uncertShipsState,
          allData?.failShipsState,
        ],
        backgroundColor: ["#2dce89", "#5e72e4", "#f5365c"],
        labels: ["Success", "Uncertain", "Failed"],
      },
    ],
  };
  const options = {
    tooltips: false,
  };
  //failed/uncertain data
  let failUncertain = {};
  failUncertain = {
    datasets: [
      {
        data: [allData?.uncertShipsState, allData?.failShipsState],
        backgroundColor: ["#5e72e4", "#f5365c"],
        borderWidth: 2,
        cutout: "78%",
        radius: "80%",
      },
    ],
  };

  //causes data
  let total =
    allData?.causes?.temperature +
    allData?.causes?.acceleration +
    allData?.causes?.intrusion;

  const temperaturePercentage = Math.ceil(
    (100 * allData?.causes?.temperature) / total
  );
  const accelerationPercentage = Math.ceil(
    (100 * allData?.causes?.acceleration) / total
  );
  const intrusionPercentage = Math.ceil(
    (100 * allData?.causes?.intrusion) / total
  );
  //branches with more alerts data
  const branchesData = allData?.branchesWithMoreAlerts;

  //traigo data para la tabla
  const [
    changeFilter,
    infoLength,
    info,
    company_detail,
    setPage,
    page,
    ,
    lazyPaginatedDataLoading,
    paginatedDataLoading,
  ] = useShipmentsTable();

  const itemsPerPage = 8;
  const totalPages = Math.ceil(info?.total / itemsPerPage);
  const changePage = (e, page) => {
    e.preventDefault();
    setPage(page);
  };

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const [activeTab, setActiveTab] = useState("inTransit");

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setPage(1);
    }
    changeFilter(tab);
  };

  // const renderTable = (tab) => {
  //   const columns = Object.keys(data[tab][0]);

  //   const columnMappings = {
  //     COMMENTS: "mo.coments",
  //     ALERTS: "mo.Alerts",
  //     "LAST CHECKPOINT": "mo.Check",
  //   };
  //   const handleDivClick = (column) => {
  //     console.log("clickeando ando en " + column);
  //   };

  //   return (
  //     <Table hover>
  //       <thead>
  //         <tr>
  //           {columns.map((column) => (
  //             <th key={column}>{column}</th>
  //           ))}
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {data[tab].map((item, index) => (
  //           <tr key={index} className="table-row">
  //             {columns.map((column) => (
  //               <td key={column}>
  //                 {column === "COMMENTS" ||
  //                 column === "ALERTS" ||
  //                 column === "LAST CHECKPOINT" ? (
  //                   <div
  //                     onClick={() => handleDivClick(column)}
  //                     style={{ cursor: "pointer" }}
  //                   >
  //                     {columnMappings[column] || item[column]}
  //                   </div>
  //                 ) : (
  //                   item[column]
  //                 )}
  //               </td>
  //             ))}
  //           </tr>
  //         ))}
  //       </tbody>
  //     </Table>
  //   );
  // };
  function TablaDatos() {
    if (lazyPaginatedDataLoading || paginatedDataLoading) {
      return (
        <>
          <div
            style={{
              display: "flex",
              position: "relative",

              alignItems: "center",
              justifyContent: "center",
              height: "20vw",
              //border: "solid red 1px",
            }}
          >
            <Spinner className="spinner" />
          </div>
        </>
      );
    }

    if (!info?.selectedItems || info?.selectedItems?.length === 0) {
      return (
        <div
          style={{
            display: "flex",
            position: "relative",

            alignItems: "center",
            justifyContent: "center",
            height: "20vw",
            //border: "solid red 1px",
          }}
        >
          No data to show
        </div>
      );
    }
    return (
      <>
        {activeTab === "inTransit" ? (
          <Table className="align-items-center table-flush" responsive>
            <thead>
              <tr>
                <th style={{ textAlign: "center", fontSize: "0.8vw" }}>ID</th>
                <th style={{ textAlign: "center", fontSize: "0.8vw" }}>QR</th>
                <th style={{ textAlign: "center", fontSize: "0.8vw" }}>
                  ORIGIN
                </th>
                <th style={{ textAlign: "center", fontSize: "0.8vw" }}>
                  DEPARTURE
                </th>
                <th style={{ textAlign: "center", fontSize: "0.8vw" }}>
                  LAST CHECKPOINT
                </th>
                <th style={{ textAlign: "center", fontSize: "0.8vw" }}>
                  CONTENT
                </th>
                <th style={{ textAlign: "center", fontSize: "0.8vw" }}>
                  COMMENTS
                </th>
                {/* Agrega más encabezados según lo que quieras mostrar */}
              </tr>
            </thead>
            <tbody>
              {info?.selectedItems?.map((item, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "center" }}>
                    {item.shipment_id.split("-")[1]}
                  </td>
                  <td style={{ textAlign: "center" }}>{item.qr}</td>
                  <td style={{ textAlign: "center" }}>
                    {" "}
                    {company_detail?.company?.branches?.map(
                      (b) => b?.branch_id === item?.origin_id && b?.name
                    )}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {convertirHoraLocal(
                      item?.departure,
                      company_detail?.company?.gmt
                    )}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {" "}
                    {item?.checkpoints?.[item?.checkpoints.length - 1] ? (
                      <button
                        className="btn-last-checkpoint"
                        onClick={(e) =>
                          toggleModalCheckpoints(e, item.shipment_id)
                        }
                      >
                        {
                          // fecha y hora
                          convertirHoraLocal(
                            item?.checkpoints[item.checkpoints.length - 1]
                              .timestamp,
                            company_detail?.company?.gmt
                          ) +
                            "  " +
                            //ope
                            item?.checkpoints[item.checkpoints.length - 1]
                              ?.responsible_name +
                            " - " +
                            //branch
                            item?.checkpoints[item.checkpoints.length - 1]
                              ?.location
                        }
                      </button>
                    ) : (
                      " No checkpoints"
                    )}
                  </td>
                  <th style={{ textAlign: "center" }}>
                    <button
                      className="btn-last-checkpoint"
                      onClick={(e) => toggleModalContents(e, item.shipment_id)}
                    >
                      OPEN
                    </button>
                  </th>
                  <th style={{ textAlign: "center" }}>
                    <button
                      className="btn-last-checkpoint"
                      onClick={(e) => toggleModalComments(e, item.shipment_id)}
                    >
                      OPEN
                    </button>
                  </th>
                  {/* Agrega más celdas según lo que quieras mostrar */}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Table className="align-items-center table-flush" responsive>
            <thead>
              <tr>
                <th style={{ textAlign: "center", fontSize: "0.8vw" }}>ID</th>
                <th style={{ textAlign: "center", fontSize: "0.8vw" }}>QR</th>
                <th style={{ textAlign: "center", fontSize: "0.8vw" }}>
                  ORIGIN
                </th>
                <th style={{ textAlign: "center", fontSize: "0.8vw" }}>SENT</th>
                <th style={{ textAlign: "center", fontSize: "0.8vw" }}>
                  RECEIVED
                </th>
                <th style={{ textAlign: "center", fontSize: "0.8vw" }}>
                  DESTINATION
                </th>
                <th style={{ textAlign: "center", fontSize: "0.8vw" }}>
                  ALERTS
                </th>
                <th style={{ textAlign: "center", fontSize: "0.8vw" }}>
                  COMMENTS
                </th>
                {/* Agrega más encabezados según lo que quieras mostrar */}
              </tr>
            </thead>
            <tbody>
              {info?.selectedItems?.map((item, index) => (
                <tr key={index}>
                  {/* id */}
                  <td style={{ textAlign: "center" }}>
                    {item.shipment_id.split("-")[1]}
                  </td>
                  {/* qr */}
                  <td style={{ textAlign: "center" }}>{item.qr}</td>
                  {/* origin */}
                  <td style={{ textAlign: "center" }}>
                    {company_detail?.company?.branches?.map(
                      (b) => b?.branch_id === item?.origin_id && b?.name
                    )}
                  </td>
                  {/* sent */}
                  <td style={{ textAlign: "center" }}>
                    {convertirHoraLocal(
                      item?.departure,
                      company_detail?.company?.gmt
                    )}
                  </td>
                  {/* received */}
                  <td style={{ textAlign: "center" }}>
                    {convertirHoraLocal(
                      item?.arrival,
                      company_detail.company.gmt
                    )}
                  </td>
                  {/* destination */}
                  <td style={{ textAlign: "center" }}>
                    {" "}
                    {company_detail?.company?.branches?.map(
                      (b) => b.branch_id === item.destination_id && b.name
                    )}
                  </td>
                  <th style={{ textAlign: "center" }}>
                    <button
                      className="btn-last-checkpoint"
                      onClick={(e)=>toggleModalAlerts(e, item.shipment_id)}
                    >
                      ALERTS
                    </button>
                  </th>

                  <th style={{ textAlign: "center" }}>
                    <button
                      className="btn-last-checkpoint"
                      onClick={(e) => toggleModalComments(e, item.shipment_id)}
                    >
                      OPEN
                    </button>
                  </th>
                  {/* Agrega más celdas según lo que quieras mostrar */}
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </>
    );
  }
  //pagination
  const changePage2 = (e, value) => {
    e.preventDefault();
    console.log(value);
    if (value === "prev") {
      setPage(page - 1);
      setCurrentPage(page);
    } else if (value === "next") {
      setPage(page + 1);
      setCurrentPage(page);
    } else {
      setPage(value);
      setCurrentPage(page);
    }
  };
  const iconCard = {
    // border: "red solid 1px",
    width: "2vw",
    height: "2vw",
  };
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <PaginationItem key={i} className={page === i ? "active" : ""}>
        <PaginationLink href="#pablo" onClick={(e) => changePage(e, i)}>
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }
  return (
    <>
      <CardsHeader
        name="Default"
        parentName="Dashboards"
        inTransitShipsState={inTransitShipsState}
        loading={loading}
        allData={allData}
        handlerInitialFilter={handlerInitialFilter}
        prevData={prevData}
        initialFilter={initialFilter}
      />

      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* ------------grafico de torta completed- --------- */}

        <Row style={{ display: "flex" }}>
          <Col xl="4">
            <Card>
              {/* <h2 style={{ marginTop: "1vw", marginLeft: "1vw" }}>
                COMPLETED: {allData?.completedShipsState}
              </h2> */}
              <CardTitle
                tag="h3"
                className="text-uppercase text-muted mb-0"
                style={{ marginTop: "1vw", marginLeft: "1vw" }}
              >
                COMPLETED: {allData?.completedShipsState}
              </CardTitle>
              <CardBody>
                <div className="chart">
                  {loading ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "80%",
                      }}
                    >
                      <Spinner className="spinner" />
                    </div>
                  ) : (
                    <>
                      <Card style={{ height: "100%", padding: "2%" }}>
                        {/* <Doughnut data={graphicData} options={options} /> */}
                        <Pie data={graphicData} options={options} />
                      </Card>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col className="mb-5 mb-xl-0" xl="8">
            <Card style={{ height: "80%" }}>
              {/*<CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">Sales value</h2>
                  </div>
                 
                </Row> 
              </CardHeader>*/}
              <CardBody style={{ height: "50%" }}>
                {/* Chart */}
                {/* <div className="chart" style={{height:"20vw"}}> */}
                <Row>
                  {/* FAILED/UNCERTAIN */}
                  <Col
                    xs="4"
                    style={{
                      /*  border: "solid purple 1px", */ height: "25vw",
                    }}
                  >
                    <Card
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "80%",
                        width: "100%",
                      }}
                    >
                      <CardTitle
                        tag="h3"
                        className="text-uppercase text-muted mb-0"
                        style={{ marginTop: "1vw", marginLeft: "1vw" }}
                      >
                        FAILED/UNCERTAIN:{" "}
                        {allData?.uncertShipsState + allData?.failShipsState > 0
                          ? allData?.uncertShipsState + allData?.failShipsState
                          : 0}
                      </CardTitle>
                      <CardBody>
                        {loading ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "100%",
                            }}
                          >
                            <Spinner className="spinner" />
                          </div>
                        ) : (
                          <>
                            <div style={{ height: "100%" }}>
                              {/* <Doughnut data={failUncertain} options={options} /> */}
                              <Pie data={failUncertain} options={options} />
                            </div>
                          </>
                        )}
                      </CardBody>
                    </Card>
                  </Col>
                  {/* PROGRESS BAR */}
                  {/* CAUSES */}
                  <Col
                    xs="4"
                    style={{
                      /*  border: "solid purple 1px", */ height: "25vw",
                    }}
                  >
                    <Card
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "80%",
                      }}
                    >
                      <CardTitle
                        tag="h3"
                        className="text-uppercase text-muted mb-0"
                        style={{ marginTop: "1vw", marginLeft: "1vw" }}
                      >
                        CAUSES
                      </CardTitle>
                      {!loading ? (
                        <>
                          {total ? (
                            <>
                              <div className="progressBarContainer">
                                <div className="progressBar">
                                  <span>
                                    {temperaturePercentage}% - Temperature
                                  </span>

                                  <Progress
                                    max="100"
                                    value={Math.floor(
                                      (100 * allData?.causes?.temperature) /
                                        total
                                    )}
                                    color="danger"
                                  />
                                </div>

                                <div className="progressBar">
                                  <span>
                                    {intrusionPercentage}% - Intrusion
                                  </span>

                                  <Progress
                                    value={Math.floor(
                                      (100 * allData?.causes?.intrusion) / total
                                    )}
                                    max="100"
                                    color="#5e72e4"
                                  />
                                </div>
                                <div className="progressBar">
                                  <span>
                                    {accelerationPercentage}% - Acceleration
                                  </span>

                                  <Progress
                                    max="100"
                                    value={Math.floor(
                                      (100 * allData?.causes?.acceleration) /
                                        total
                                    )}
                                    color="default"
                                  />
                                </div>
                              </div>
                            </>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                              }}
                            >
                              No data to show
                            </div>
                          )}
                        </>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                          }}
                        >
                          <Spinner className="spinner" />
                        </div>
                      )}
                    </Card>
                  </Col>

                  <Col
                    xs="4"
                    style={{
                      /*  border: "solid purple 1px", */ height: "25vw",
                    }}
                  >
                    <Card
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "80%",
                        width: "100%",
                      }}
                    >
                      <CardTitle
                        tag="h3"
                        className="text-uppercase text-muted mb-0"
                        style={{ marginTop: "1vw", marginLeft: "1vw" }}
                      >
                        BRANCHES WITH MORE ALERTS
                      </CardTitle>
                      <div className="progressBarContainer">
                        {!loading ? (
                          <div>
                            {branchesData?.[0] ? (
                              <div>
                                {branchesData.map((b) => (
                                  <div key={b.branch}>
                                    <span className="spanProgressBar">
                                      {company_detail?.company?.branches?.map(
                                        (br) =>
                                          br.branch_id === b.branch && br.name
                                      )}
                                    </span>
                                    <div className="progressBar">
                                      <Progress
                                        value={Math.ceil(
                                          (100 * b.failed) / b.total
                                        )}
                                        max={Math.ceil(
                                          (100 * b.total) / b.total
                                        )}
                                        color="danger"
                                        className="barra-fondo-warning"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div>no alerts</div>
                            )}
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "100%",
                            }}
                          >
                            <Spinner className="spinner" />
                          </div>
                        )}
                      </div>
                    </Card>
                  </Col>
                </Row>
                {/* </div> */}
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* -----------tabla/grafico de barras---------------- */}

        <Row>
          {/* grafico de barras */}
          <Col xl="4">
            <Card style={{ display: "flex", height: "90%" }}>
              {/* <CardHeader >
                <h6 className="surtitle">Overview</h6>
                <h5 className="h3 mb-0">Product comparison</h5>
              </CardHeader>  */}
              <CardBody>
                {/* <Bar
                    data={chartExample7.data}
                    options={chartExample7.options}
                    className="chart-canvas"
                    id="chart-bar-stacked"
                  /> */}

                <Estadisticas />
              </CardBody>
            </Card>
          </Col>
          {/* tabla */}
          <Col xl="8">
            <Card className="shadow" >
              <div >
                <Nav>
                  <NavItem className="navText">
                    <NavLink
                      className={classnames({
                        active: activeTab === "inTransit",
                      })}
                      onClick={() => toggleTab("inTransit")}
                      href="#"
                      style={{
                        color: activeTab === "inTransit" && "#5e72e4",
                        textDecoration: activeTab === "inTransit" ? "underline" : "none",
                      }}
                      id="tooltipTransit"
                    >
                      {activeTab === "inTransit" ? (
                        "IN TRANSIT"
                      ) : (
                        <img style={iconCard} src={inTransitIcon} alt="" />
                      )}
                      {/* tooltip  transit*/}
                      {activeTab !== "inTransit" && (
                        <UncontrolledTooltip
                          delay={0}
                          placement="top"
                          target="tooltipTransit"
                          style={{
                            fontSize: "1vw",
                            color: "#5e72e4",
                            backgroundColor: "#fafafa",
                            fontFamily: "Open Sans, sans-serif",
                          }}
                        >
                         In transit
                        </UncontrolledTooltip>
                      )}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "completed",
                      })}
                      onClick={() => toggleTab("completed")}
                      href="#"
                      style={{
                        color: activeTab === "completed" && "#5e72e4",
                        textDecoration: activeTab === "completed" ? "underline" : "none",
                      }}
                      id="tooltipCompleted"
                    >
                      {activeTab === "completed" ? (
                        "COMPLETED"
                      ) : (
                        <img style={iconCard} src={completedIcon} alt="" />
                      )}
                         {/* tooltip  transit*/}
                         {activeTab !== "completed" && (
                        <UncontrolledTooltip
                          delay={0}
                          placement="top"
                          target="tooltipCompleted"
                          style={{
                            fontSize: "1vw",
                            color: "#5e72e4",
                            backgroundColor: "#fafafa",
                            fontFamily: "Open Sans, sans-serif",
                          }}
                        >
                         Completed
                        </UncontrolledTooltip>
                      )}
                    </NavLink>
                  </NavItem>
                  
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "succeeded",
                      })}
                      onClick={() => toggleTab("succeeded")}
                      href="#"
                      style={{
                        color: activeTab === "succeeded" && "#5e72e4",
                        textDecoration: activeTab === "succeeded" ? "underline" : "none",

                      }}
                      id="tooltipSucceeded"
                    >
                      {activeTab === "succeeded" ? (
                        "SUCCEDED"
                      ) : (
                        <img style={iconCard} src={succededIcon} alt="" />
                      )}
                        {activeTab !== "succeeded" && (
                        <UncontrolledTooltip
                          delay={0}
                          placement="top"
                          target="tooltipSucceeded"
                          style={{
                            fontSize: "1vw",
                            color: "#5e72e4",
                            backgroundColor: "#fafafa",
                            fontFamily: "Open Sans, sans-serif",
                          }}
                        >
                         Succeeded
                        </UncontrolledTooltip>
                      )}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "uncertain",
                      })}
                      onClick={() => toggleTab("uncertain")}
                      href="#"
                      style={{
                        color: activeTab === "uncertain" && "#5e72e4",
                        textDecoration: activeTab === "uncertain" ? "underline" : "none",
                      }}
                      id="tooltipUncertain"
                    >
                      {activeTab === "uncertain" ? (
                        "UNCERTAIN"
                      ) : (
                        <img style={iconCard} src={uncertainIcon} alt="" />
                      )}
                       {activeTab !== "uncertain" && (
                        <UncontrolledTooltip
                          delay={0}
                          placement="top"
                          target="tooltipUncertain"
                          style={{
                            fontSize: "1vw",
                            color: "#5e72e4",
                            backgroundColor: "#fafafa",
                            fontFamily: "Open Sans, sans-serif",
                          }}
                        >
                         Uncertain
                        </UncontrolledTooltip>
                      )}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "failed" })}
                      onClick={() => toggleTab("failed")}
                      href="#"
                      style={{
                        color: activeTab === "failed" && "#5e72e4",
                        textDecoration: activeTab === "failed" ? "underline" : "none",
                      }}
                      id="tooltipFailed"
                    >
                      {activeTab === "failed" ? (
                        "FAILED"
                      ) : (
                        <img style={iconCard} src={failedIcon} alt="" />
                      )}
                      {activeTab !== "failed" && (
                        <UncontrolledTooltip
                          delay={0}
                          placement="top"
                          target="tooltipFailed"
                          style={{
                            fontSize: "1vw",
                            color: "#5e72e4",
                            backgroundColor: "#fafafa",
                            fontFamily: "Open Sans, sans-serif",
                           
                          }}
                        >
                          
                        Failed
                        </UncontrolledTooltip>
                      )}
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent
                  activeTab={activeTab}
                  style={{ /* border: "solid red 1px", */ minHeight: "22vw" }}
                >
                  <TabPane tabId="inTransit">{TablaDatos("inTransit")}</TabPane>
                  <TabPane tabId="completed">{TablaDatos("completed")}</TabPane>
                  <TabPane tabId="succeeded">{TablaDatos("succeeded")}</TabPane>
                  <TabPane tabId="uncertain">{TablaDatos("uncertain")}</TabPane>
                  <TabPane tabId="failed">{TablaDatos("failed")}</TabPane>
                </TabContent>
              </div>

              {/* pagination */}
              <CardFooter
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <nav aria-label="Page navigation example">
                  <Pagination>
                    <PaginationItem disabled={page === 1}>
                      <PaginationLink
                        aria-label="Previous"
                        href="#pablo"
                        onClick={(e) => changePage(e, page - 1)}
                      >
                        <i className="fa fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>

                    {paginationItems}

                    <PaginationItem disabled={page === totalPages}>
                      <PaginationLink
                        aria-label="Next"
                        href="#pablo"
                        onClick={(e) => changePage(e, page + 1)}
                      >
                        <i className="fa fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* modal Checkpoints */}
      <Modal
        className="custom-modal" // Agrega una clase CSS personalizada
        isOpen={modalCheckpoints}
        toggle={toggleModalCheckpoints}
      >
        <ModalHeader toggle={toggleModalCheckpoints}>CHECKPOINTS</ModalHeader>
        <ModalBody>
          <CheckpointsModal shipment_id={shipment_id} />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModalCheckpoints}>
            Close
          </Button>
          {/* <Button color="primary" type="button">
              Save changes
            </Button> */}
        </ModalFooter>
      </Modal>

      {/* modal Contents */}
      <Modal
        className="modal-dialog-centered"
        isOpen={modalContents}
        toggle={toggleModalContents}
        style={{ maxWidth: "80vw" }}
      >
        <ModalHeader toggle={toggleModalContents}>CONTENTS MODAL</ModalHeader>
        <ModalBody>
          <ContentsModal shipment_id={shipment_id} />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModalContents}>
            Close
          </Button>
          {/* <Button color="primary" type="button">
              Save changes
            </Button> */}
        </ModalFooter>
      </Modal>

      {/* modal Comments */}
      <Modal
        className="modal-dialog-centered"
        isOpen={modalComments}
        toggle={toggleModalComments}
      >
        <ModalHeader toggle={toggleModalComments}>{`Shipment #${
          shipment_id?.split("-")[1]
        }`}</ModalHeader>
        <ModalBody style={{ maxHeight: "60vh" }}>
          <Comments shipment_id={shipment_id} shipment_table={true} />
        </ModalBody>
        <ModalFooter>
          {/* <Button color="secondary" onClick={toggleModalComments}>
              Close
            </Button> */}
        </ModalFooter>
      </Modal>

      {/* modal Alerts */}
      <Modal
        className="modal-dialog-centered"
        isOpen={modalAlerts}
        toggle={toggleModalComments}
      >
        <ModalHeader toggle={toggleModalAlerts}>ALERTS MODAL</ModalHeader>
        <ModalBody>
       <TempIntrusionChart  shipment_id={shipment_id} />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModalAlerts}>
            Close
          </Button>
          {/* <Button color="primary" type="button">
              Save changes
            </Button> */}
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Dashboard;
