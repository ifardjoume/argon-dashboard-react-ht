import {
  Card,
  CardBody,
  CardTitle,
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  Button,
  Spinner,
} from "reactstrap";
import { useShipments } from "../../graphql/queries/Shipments";
import { getPercentageChange } from "helpers";
const Header = () => {
  const [
    inTransitShipsState,
    loading,
    allData,
    handlerInitialFilter,
    prevData,
    initialFilter,
  ] = useShipments();
  //obtengo la diferencia porcentual entre envios de hoy y dia/mes anterior
  const percentageChange_completed = getPercentageChange(
    prevData?.prevCompletedShipsState ? prevData?.prevCompletedShipsState : 0,
    allData?.completedShipsState
  );
  const cardStyle = {
    minHeight: "150px", // Modifica la altura según tus necesidades
  };
  const containerStyle = {
    border: "red solid 1px",
    display:'flex'
  };
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid style={containerStyle}>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              {/* card in transit---------- */}
              <Col xs="12" sm="6" md="4" lg="3" xl="2">
                <Card className="card-stats mb-4 mb-xl-0" style={cardStyle}>
                  <CardBody>
                    <Row>
                      <div /* className="col" */>
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          In Transit
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {loading ? (
                            <Spinner color="primary" />
                          ) : (
                            inTransitShipsState
                          )}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                    {/* <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" /> 3.48%
                      </span>{" "}
                      <span className="text-nowrap">Since last month</span>
                    </p> */}
                  </CardBody>
                </Card>
              </Col>

              {/* card completed---------------- */}
              <Col xs="12" sm="6" md="4" lg="3" xl="2">
                <Card className="card-stats mb-4 mb-xl-0" style={cardStyle}>
                  <CardBody>
                    <Row>
                      <div /* className="col" */>
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Completed
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {loading ? (
                            <Spinner color="primary" />
                          ) : (
                            allData?.completedShipsState
                          )}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-chart-pie" />
                        </div>
                      </Col>
                    </Row>
                    <div className="mt-3 mb-0 text-muted text-sm">
                      {percentageChange_completed &&
                        (percentageChange_completed.includes("-") ? (
                          <div /* className={styles.percentInfoContainer} */>
                            <div /* className={styles.percentPos} */>
                              <span className="text-success mr-2">
                                {initialFilter === "month" && (
                                  <i className="fa fa-arrow-up" />
                                )}

                                {initialFilter === "month" &&
                                  percentageChange_completed.slice(1)}
                              </span>{" "}
                            </div>

                            <div /*  className={styles.percentText} */>
                              {initialFilter === "month" &&
                                "over the last month"}
                            </div>
                          </div>
                        ) : (
                          <div /* className={styles.percentInfoContainer} */>
                            <div /* className={styles.percentNeg} */>
                              <span className="text-warning mr-2">
                                <i className="fas fa-arrow-down" />{" "}
                                {initialFilter === "month" &&
                                  percentageChange_completed}
                              </span>{" "}
                            </div>

                            <div /* className={styles.percentText} */>
                              {initialFilter === "month"
                                ? "  over the last month"
                                : ""}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardBody>
                </Card>
              </Col>

              {/* card Succeded---------- */}
              <Col xs="12" sm="6" md="4" lg="3" xl="2">
                <Card className="card-stats mb-4 mb-xl-0" style={cardStyle}>
                  <CardBody>
                    <Row>
                      <div /* className="col" */>
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Succeded
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {loading ? (
                            <Spinner color="primary" />
                          ) : (
                            allData?.succShipsState
                          )}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="fas fa-users" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-warning mr-2">
                        <i className="fas fa-arrow-down" /> 1.10%
                      </span>{" "}
                      <span className="text-nowrap">Since yesterday</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              {/* uncertain---------------- */}
              <Col xs="12" sm="6" md="4" lg="3" xl="2">
                <Card className="card-stats mb-4 mb-xl-0" style={cardStyle}>
                  <CardBody>
                    <Row>
                      <div /* className="col" */>
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Uncertain
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {loading ? (
                            <Spinner color="primary" />
                          ) : (
                            allData?.uncertShipsState
                          )}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-percent" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fas fa-arrow-up" /> 12%
                      </span>{" "}
                      <span className="text-nowrap">Since last month</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>

              {/* card failed--------------- */}
              <Col xs="12" sm="6" md="4" lg="3" xl="2">
                <Card className="card-stats mb-4 mb-xl-0" style={cardStyle}>
                  <CardBody>
                    <Row>
                      <div /* className="col" */>
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Failed
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {loading ? (
                            <Spinner color="primary" />
                          ) : (
                            allData?.failShipsState
                          )}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-percent" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fas fa-arrow-up" /> 12%
                      </span>{" "}
                      <span className="text-nowrap">Since last month</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>

              {/* ---buttons---------- */}
              <div>
                <Button
                  style={{
                    borderColor: initialFilter !== "month" && "initial",
                    borderWidth: "1px",
                  }}
                  color="primary"
                  id="initial_filter_day"
                  value="day"
                  onClick={handlerInitialFilter}
                >
                  Today
                </Button>
                <Button
                  style={{
                    borderColor: initialFilter === "month" && "initial",
                    borderWidth: "1px",
                  }}
                  color="success"
                  value="month"
                  onClick={handlerInitialFilter}
                >
                  This month
                </Button>
              </div>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
