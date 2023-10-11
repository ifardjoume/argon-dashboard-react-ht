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
  UncontrolledTooltip,
  Spinner,
  TabContent,
  TabPane,
  CardTitle,
  CardText,
} from "reactstrap";

// core components
import CardsHeader from "components/Headers/CardsHeader.js";

import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample6,
} from "variables/charts.js";
import { useShipments } from "graphql/queries/ShipmentsCards";
import useShipmentsTable from "graphql/queries/ShipmentsTable";
import { convertirHoraLocal } from "helpers";
import { useFailedUncertain } from "queries/stats";
import "../../../assets/css/myCss/global.css";
function Dashboard() {
  const [
    inTransitShipsState,
    loading,
    allData,
    handlerInitialFilter,
    prevData,
    initialFilter,
  ] = useShipments();
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data(chartExample1Data === "data1" ? "data2" : "data1");
  };
  //completyed data
  const graphicData = {
    datasets: [
      {
        data: [
          allData?.succShipsState,
          allData?.uncertShipsState,
          allData?.failShipsState,
        ],
        backgroundColor: ["#2dce89", "#fb6340", "#f5365c"],
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
        backgroundColor: ["#fb6340", "#f5365c"],
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
  const [changeFilter, infoLength, info, company_detail] = useShipmentsTable();
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const [activeTab, setActiveTab] = useState("inTransit");

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
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
    if (!info?.selectedItems || info?.selectedItems?.length === 0) {
      return <div>No hay datos para mostrar.</div>;
    }
    return (
      <>
        {activeTab === "inTransit" ? (
          <Table className="align-items-center table-flush" responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>ORIGIN</th>
                <th>DEPARTURE</th>
                <th>LAST CHECKPOINT</th>
                <th>CONTENT</th>
                <th>COMMENTS</th>
                {/* Agrega más encabezados según lo que quieras mostrar */}
              </tr>
            </thead>
            <tbody>
              {info?.selectedItems?.map((item, index) => (
                <tr key={index}>
                  <td>{item.shipment_id}</td>
                  <td>
                    {" "}
                    {company_detail?.company?.branches?.map(
                      (b) => b?.branch_id === item?.origin_id && b?.name
                    )}
                  </td>
                  <td>
                    {convertirHoraLocal(
                      item?.departure,
                      company_detail?.company?.gmt
                    )}
                  </td>
                  <td>
                    {" "}
                    {item?.checkpoints?.[item?.checkpoints.length - 1] ? (
                      <button

                      // onClick={() =>
                      //   handleCheckpointsModal(s.shipment_id)
                      // }
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
                  <th>content modal</th>
                  <th>comments modal</th>
                  {/* Agrega más celdas según lo que quieras mostrar */}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Table className="align-items-center table-flush" responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>ORIGIN</th>
                <th>SENT</th>
                <th>RECEIVED</th>
                <th>DESTINATION</th>
                <th>ALERTS</th>
                <th>COMMENTS</th>
                {/* Agrega más encabezados según lo que quieras mostrar */}
              </tr>
            </thead>
            <tbody>
              {info?.selectedItems?.map((item, index) => (
                <tr key={index}>
                  <td>{item.shipment_id}</td>
                  <td>{item.origin_id}</td>
                  <td>{item.origin_op_id}</td>
                  <td>{item.destination_op_id}</td>
                  <td>{item.destination_id}</td>
                  <td>alert modal</td>
                  <th>comments modal</th>
                  {/* Agrega más celdas según lo que quieras mostrar */}
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </>
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

        <Row style={{ display: "flex", border: "solid red 1px" }}>
          <Col xl="4" style={{ border: "solid blue 1px" }}>
            <Card>
              <h2 style={{ marginTop: "1vw", marginLeft: "1vw" }}>
                COMPLETED: {allData?.completedShipsState}
              </h2>
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
                      <Card>
                        {/* <Doughnut data={graphicData} options={options} /> */}
                        <Pie data={graphicData} options={options} />
                      </Card>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="8">
            <Row>
              {/* ------------grafico de torta failed/uncertain- --------- */}
              <div style={{ height: "400px" }}>
                <Col style={{ height: "100%" }}>
                  <Card style={{ height: "100%" }}>
                    <h2 className="statsTitle">
                      FAILED/UNCERTAIN:{" "}
                      {allData?.uncertShipsState + allData?.failShipsState > 0
                        ? allData?.uncertShipsState + allData?.failShipsState
                        : 0}
                    </h2>

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
                            <Pie data={failUncertain} />
                          </div>
                        </>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              </div>

              <div style={{ height: "400px" }}>
                <Col style={{ height: "100%" }}>
                  <Card style={{ height: "100%" }}>
                    <h2 className="statsTitle">
                      FAILED/UNCERTAIN:{" "}
                      {allData?.uncertShipsState + allData?.failShipsState > 0
                        ? allData?.uncertShipsState + allData?.failShipsState
                        : 0}
                    </h2>

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
                            <Pie data={failUncertain} />
                          </div>
                        </>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              </div>

              <div style={{ height: "400px" }}>
                <Col style={{ height: "100%" }}>
                  <Card style={{ height: "100%" }}>
                    <h2 className="statsTitle">
                      FAILED/UNCERTAIN:{" "}
                      {allData?.uncertShipsState + allData?.failShipsState > 0
                        ? allData?.uncertShipsState + allData?.failShipsState
                        : 0}
                    </h2>

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
                            <Pie data={failUncertain} />
                          </div>
                        </>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              </div>
            </Row>
          </Col>
        </Row>

        {/* -----------tabla---------------- */}
        <Row className="mt-5" style={{ border: "solid red 1px" }}>
          <Col>
            <Card className="shadow">
              <div>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "inTransit",
                      })}
                      onClick={() => toggleTab("inTransit")}
                      href="#"
                    >
                      In Transit
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "completed",
                      })}
                      onClick={() => toggleTab("completed")}
                      href="#"
                    >
                      Completed
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "succeeded",
                      })}
                      onClick={() => toggleTab("succeeded")}
                      href="#"
                    >
                      Succeeded
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === "uncertain",
                      })}
                      onClick={() => toggleTab("uncertain")}
                      href="#"
                    >
                      Uncertain
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "failed" })}
                      onClick={() => toggleTab("failed")}
                      href="#"
                    >
                      Failed
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="inTransit">{TablaDatos("inTransit")}</TabPane>
                  <TabPane tabId="completed">{TablaDatos("completed")}</TabPane>
                  <TabPane tabId="succeeded">{TablaDatos("succeeded")}</TabPane>
                  <TabPane tabId="uncertain">{TablaDatos("uncertain")}</TabPane>
                  <TabPane tabId="failed">{TablaDatos("failed")}</TabPane>
                </TabContent>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
// {/* --failed/uncertain -causes -braanches with more alerts----------------------- */}
//         <Col xl="4">
//           {/* FAILED/UNCERTAIN */}
// <Card>
//   <h2 className="statsTitle">
//     FAILED/UNCERTAIN:{" "}
//     {allData?.uncertShipsState + allData?.failShipsState > 0
//       ? allData?.uncertShipsState + allData?.failShipsState
//       : 0}
//   </h2>

//   <CardBody>
//     {loading ? (
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "100%",
//         }}
//       >
//         <Spinner className="spinner" />
//       </div>
//     ) : (
//       <>
//         <div style={{ height: "100%" }}>
//           {/* <Doughnut data={failUncertain} options={options} /> */}
//           <Pie data={failUncertain} />
//         </div>
//       </>
//     )}
//   </CardBody>
// </Card>
//         </Col>

//         <Col xl="4">
//           {/* PROGRESS BAR */}
//           {/* CAUSES */}
//           <Card>
//             <h2 className="statsTitle">CAUSES</h2>
//             <CardBody>
//               {!loading ? (
//                 <>
//                   {total ? (
//                     <>
//                       <div className="progressBarContainer">
//                         <div className="progressBar">
//                           <span>{temperaturePercentage}% - Temperature</span>

//                           <Progress
//                             max="100"
//                             value={Math.floor(
//                               (100 * allData?.causes?.temperature) / total
//                             )}
//                             color="danger"
//                           />
//                         </div>

//                         <div className="progressBar">
//                           <span>{intrusionPercentage}% - Intrusion</span>

//                           <Progress
//                             value={Math.floor(
//                               (100 * allData?.causes?.intrusion) / total
//                             )}
//                             max="100"
//                             color="warning"
//                           />
//                         </div>
//                         <div className="progressBar">
//                           <span>
//                             {accelerationPercentage}% - Acceleration
//                           </span>

//                           <Progress
//                             max="100"
//                             value={Math.floor(
//                               (100 * allData?.causes?.acceleration) / total
//                             )}
//                             color="default"
//                           />
//                         </div>
//                       </div>
//                     </>
//                   ) : (
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         height: "100%",
//                       }}
//                     >
//                       No data to show
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     height: "100%",
//                   }}
//                 >
//                   <Spinner className="spinner" />
//                 </div>
//               )}
//             </CardBody>
//           </Card>
//         </Col>

//         <Col xl="4">
//           {/* BRANCHES WITH MORE ALERTS */}
//           <Card>
//             <h2 className="statsTitle">BRANCHES WITH MORE ALERTS</h2>
//             <CardBody style={{ height: "80%" }}>
//               <div style={{ height: "100%" }}>
//                 {!loading ? (
//                   <div>
//                     {branchesData?.[0] ? (
//                       <div>
//                         {branchesData.map((b) => (
//                           <div key={b.branch}>
//                             <span className="spanProgressBar">
//                               {company_detail?.company?.branches?.map(
//                                 (br) => br.branch_id === b.branch && br.name
//                               )}
//                             </span>
//                             <div className="progressBar">
//                               <Progress
//                                 value={Math.ceil((100 * b.failed) / b.total)}
//                                 max={Math.ceil((100 * b.total) / b.total)}
//                                 color="danger"
//                                 className="barra-fondo-warning"
//                               />
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div>no alerts</div>
//                     )}
//                   </div>
//                 ) : (
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       height: "100%",
//                     }}
//                   >
//                     <Spinner className="spinner" />
//                   </div>
//                 )}
//               </div>
//             </CardBody>
//           </Card>
//         </Col>
