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
import { Line, Bar, Doughnut } from "react-chartjs-2";
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
} from "reactstrap";

// core components
import CardsHeader from "components/Headers/CardsHeader.js";

import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";
import { useShipments } from "graphql/queries/ShipmentsCards";
import useShipmentsTable from "graphql/queries/ShipmentsTable";
import { convertirHoraLocal } from "helpers";

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
  
  let graphicData = {};
  graphicData = {
    datasets: [
      {
        data: [
          allData?.succShipsState,
          allData?.uncertShipsState,
          allData?.failShipsState,
        ],
        backgroundColor: ["#33B27F", "#F0EA3F", "#D60707"],
        borderWidth: 2,
        cutout: "78%",
        radius: "80%",
      },
    ],
  };
  const options = {
    cutoutPercentage: 80,
  };

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
      <CardsHeader name="Default" parentName="Dashboards"
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
        <Row>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h2 className="mb-0">COMPLETED</h2>
                  </div>
                </Row>
              </CardHeader>

              <CardBody>
                <div className="chart">
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
                      <Doughnut data={graphicData} options={options} />
                      {/*aca va el total de completed */}
                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                          height: "100%",
                          textAlign: "center",
                          zIndex: "100",
                          position: "relative",
                          top: "-350px",
                        }}
                      >
                        {allData?.completedShipsState}
                      </div>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* --failed/uncertain -causes -braanches with more alerts----------------------- */}
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">Sales value</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 1,
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Month</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 2,
                          })}
                          data-toggle="tab"
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 2)}
                        >
                          <span className="d-none d-md-block">Week</span>
                          <span className="d-md-none">W</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Line
                    data={chartExample1[chartExample1Data]}
                    options={chartExample1.options}
                    getDatasetAtEvent={(e) => console.log(e)}
                  />
                </div>
              </CardBody>
            </Card>
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
