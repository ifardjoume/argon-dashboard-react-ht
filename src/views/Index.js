/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { useState } from "react";
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

const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };


  const [activeTab, setActiveTab] = useState('inTransit');

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  // Datos simulados
  const data = {
    inTransit: [
      { ID: 1, ORIGIN: 'Origin 1', DEPARTURE: 'Departure 1', 'LAST CHECKPOINT': 'Checkpoint 1', CONTENT: 'Content 1', COMMENTS: 'Comments 1' },
      { ID: 2, ORIGIN: 'Origin 2', DEPARTURE: 'Departure 2', 'LAST CHECKPOINT': 'Checkpoint 2', CONTENT: 'Content 2', COMMENTS: 'Comments 2' },
      // Agrega más datos según sea necesario
    ],
    completed: [
      { ID: 1, ORIGIN: 'Origin A', SENT: 'Sent A', RECEIVED: 'Received A', DESTINATION: 'Destination A', ALERTS: 'Alerts A', COMMENTS: 'Comments A' },
      { ID: 2, ORIGIN: 'Origin B', SENT: 'Sent B', RECEIVED: 'Received B', DESTINATION: 'Destination B', ALERTS: 'Alerts B', COMMENTS: 'Comments B' },
      // Agrega más datos según sea necesario
    ],
    succeeded: [
      { ID: 1, ORIGIN: 'Origin X', SENT: 'Sent X', RECEIVED: 'Received X', DESTINATION: 'Destination X', ALERTS: 'Alerts X', COMMENTS: 'Comments X' },
      { ID: 2, ORIGIN: 'Origin Y', SENT: 'Sent Y', RECEIVED: 'Received Y', DESTINATION: 'Destination Y', ALERTS: 'Alerts Y', COMMENTS: 'Comments Y' },
      // Agrega más datos según sea necesario
    ],
    uncertain: [
      { ID: 1, ORIGIN: 'Origin M', SENT: 'Sent M', RECEIVED: 'Received M', DESTINATION: 'Destination M', ALERTS: 'Alerts M', COMMENTS: 'Comments M' },
      { ID: 2, ORIGIN: 'Origin N', SENT: 'Sent N', RECEIVED: 'Received N', DESTINATION: 'Destination N', ALERTS: 'Alerts N', COMMENTS: 'Comments N' },
      // Agrega más datos según sea necesario
    ],
    failed: [
      { ID: 1, ORIGIN: 'Origin F', SENT: 'Sent F', RECEIVED: 'Received F', DESTINATION: 'Destination F', ALERTS: 'Alerts F', COMMENTS: 'Comments F' },
      { ID: 2, ORIGIN: 'Origin G', SENT: 'Sent G', RECEIVED: 'Received G', DESTINATION: 'Destination G', ALERTS: 'Alerts G', COMMENTS: 'Comments G' },
      // Agrega más datos según sea necesario
    ],
  };
  const renderTable = (tab) => {
    const columns = Object.keys(data[tab][0]);

    return (
      <Table hover>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data[tab].map((item, index) => (
            <tr key={index} className="table-row">
              {columns.map((column) => (
                <td key={column}>{item[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

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
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Page visits</h3>
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

              {/* tabla */}
              <div>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'inTransit' })}
            onClick={() => toggleTab('inTransit')}
            href="#"
          >
            In Transit
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'completed' })}
            onClick={() => toggleTab('completed')}
            href="#"
          >
            Completed
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'succeeded' })}
            onClick={() => toggleTab('succeeded')}
            href="#"
          >
            Succeeded
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'uncertain' })}
            onClick={() => toggleTab('uncertain')}
            href="#"
          >
            Uncertain
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'failed' })}
            onClick={() => toggleTab('failed')}
            href="#"
          >
            Failed
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="inTransit">{renderTable('inTransit')}</TabPane>
        <TabPane tabId="completed">{renderTable('completed')}</TabPane>
        <TabPane tabId="succeeded">{renderTable('succeeded')}</TabPane>
        <TabPane tabId="uncertain">{renderTable('uncertain')}</TabPane>
        <TabPane tabId="failed">{renderTable('failed')}</TabPane>
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
