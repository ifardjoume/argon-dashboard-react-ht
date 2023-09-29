import { useEffect, useState } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  TabContent,
  TabPane,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import useShipmentsTable from "graphql/queries/ShipmentsTable";

const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");

  //traigo data para la tabla
  const [changeFilter, infoLength, info] = useShipmentsTable();

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  const [activeTab, setActiveTab] = useState("inTransit");

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
    changeFilter(tab);
  };
  // Datos simulados
  const data = {
    inTransit: [
      {
        ID: 1,
        ORIGIN: "Origin 1",
        DEPARTURE: "Departure 1",
        "LAST CHECKPOINT": "Checkpoint 1",
        CONTENT: "Content 1",
        COMMENTS: "Comments 1",
      },
      {
        ID: 2,
        ORIGIN: "Origin 2",
        DEPARTURE: "Departure 2",
        "LAST CHECKPOINT": "Checkpoint 2",
        CONTENT: "Content 2",
        COMMENTS: "Comments 2",
      },
      // Agrega más datos según sea necesario
    ],
    completed: [
      {
        ID: 1,
        ORIGIN: "Origin A",
        SENT: "Sent A",
        RECEIVED: "Received A",
        DESTINATION: "Destination A",
        ALERTS: "Alerts A",
        COMMENTS: "Comments A",
      },
      {
        ID: 2,
        ORIGIN: "Origin B",
        SENT: "Sent B",
        RECEIVED: "Received B",
        DESTINATION: "Destination B",
        ALERTS: "Alerts B",
        COMMENTS: "Comments B",
      },
      // Agrega más datos según sea necesario
    ],
    succeeded: [
      {
        ID: 1,
        ORIGIN: "Origin X",
        SENT: "Sent X",
        RECEIVED: "Received X",
        DESTINATION: "Destination X",
        ALERTS: "Alerts X",
        COMMENTS: "Comments X",
      },
      {
        ID: 2,
        ORIGIN: "Origin Y",
        SENT: "Sent Y",
        RECEIVED: "Received Y",
        DESTINATION: "Destination Y",
        ALERTS: "Alerts Y",
        COMMENTS: "Comments Y",
      },
      // Agrega más datos según sea necesario
    ],
    uncertain: [
      {
        ID: 1,
        ORIGIN: "Origin M",
        SENT: "Sent M",
        RECEIVED: "Received M",
        DESTINATION: "Destination M",
        ALERTS: "Alerts M",
        COMMENTS: "Comments M",
      },
      {
        ID: 2,
        ORIGIN: "Origin N",
        SENT: "Sent N",
        RECEIVED: "Received N",
        DESTINATION: "Destination N",
        ALERTS: "Alerts N",
        COMMENTS: "Comments N",
      },
      // Agrega más datos según sea necesario
    ],
    failed: [
      {
        ID: 1,
        ORIGIN: "Origin F",
        SENT: "Sent F",
        RECEIVED: "Received F",
        DESTINATION: "Destination F",
        ALERTS: "Alerts F",
        COMMENTS: "Comments F",
      },
      {
        ID: 2,
        ORIGIN: "Origin G",
        SENT: "Sent G",
        RECEIVED: "Received G",
        DESTINATION: "Destination G",
        ALERTS: "Alerts G",
        COMMENTS: "Comments G",
      },
      // Agrega más datos según sea necesario
    ],
  };

  useEffect(() => {
    console.log("desde el effect");
    console.log(info);
  }, [changeFilter]);

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
          <Table>
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
                  <td>{item.origin_id}</td>
                  <td>{item.departure}</td>
                  <td>ult check</td>
                  <th>content modal</th>
                  <th>comments modal</th>
                  {/* Agrega más celdas según lo que quieras mostrar */}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Table>
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
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
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
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Performance
                    </h6>
                    <h2 className="mb-0">Total orders</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Bar
                    data={chartExample2.data}
                    options={chartExample2.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              {/* <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Tabla de viajes</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader> */}

              {/* -----------tabla---------------- */}
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
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Social traffic</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Referral</th>
                    <th scope="col">Visitors</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Facebook</th>
                    <td>1,480</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">60%</span>
                        <div>
                          <Progress
                            max="100"
                            value="60"
                            barClassName="bg-gradient-danger"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Facebook</th>
                    <td>5,480</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">70%</span>
                        <div>
                          <Progress
                            max="100"
                            value="70"
                            barClassName="bg-gradient-success"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Google</th>
                    <td>4,807</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">80%</span>
                        <div>
                          <Progress max="100" value="80" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Instagram</th>
                    <td>3,678</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">75%</span>
                        <div>
                          <Progress
                            max="100"
                            value="75"
                            barClassName="bg-gradient-info"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">twitter</th>
                    <td>2,645</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">30%</span>
                        <div>
                          <Progress
                            max="100"
                            value="30"
                            barClassName="bg-gradient-warning"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
