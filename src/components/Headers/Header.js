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
import { useShipments } from "../../graphql/queries/ShipmentsCards";
import { getPercentageChange } from "helpers";
import { useEffect } from "react";
import inTransitIcon from "../../assets/img/icons/common/oldIcons/viajesEnCurso.png";
import completedIcon from '../../assets/img/icons/common/oldIcons/viajesHechos.png';
import succededIcon from '../../assets/img/icons/common/oldIcons/viajesConformes.png';
import uncertainIcon from '../../assets/img/icons/common/oldIcons/viajesParaRevision.png';
import failedIcon from '../../assets/img/icons/common/oldIcons/viajesConformes.png';
import '../../assets/myCss/global.css'
const Header = ( 
  {inTransitShipsState,
  loading,
  allData,
  handlerInitialFilter,
  prevData,
  initialFilter}) => {
 

  //obtengo la diferencia porcentual entre envios de hoy y dia/mes anterior
  const percentageChange_completed = getPercentageChange(
    prevData?.prevCompletedShipsState ? prevData?.prevCompletedShipsState : 0,
    allData?.completedShipsState
  );
  const percentageChange_succeded = getPercentageChange(
    prevData?.prevSuccShipsState ? prevData?.prevSuccShipsState : 0,
    allData?.succShipsState
  );

  const percentageChange_uncertain = getPercentageChange(
    prevData?.prevUncertShipsState ? prevData?.prevUncertShipsState : 0,
    allData?.uncertShipsState
  );
  const percentageChange_failed = getPercentageChange(
    prevData?.prevFailShipsState ? prevData?.prevFailShipsState : 0,
    allData?.failShipsState
  );

  //card styles
  const commonCardStyle = {
    minHeight: "150px",
   // borderColor: "red",
   
  };

  // Define un estilo adicional para las cards que contienen el texto "over the last month"
  const expandedCardStyle = {
    ...commonCardStyle,
    maxHeight: "200px", // Establece una altura máxima para estas cards
  };

  const buttonsContainerStyle = {
    margin: "1%",
    position: "relative",
    left: "-1%",
  };
  const cardsContainer = {
    //border: "red solid 1px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
  const iconCard = {
    // border: "red solid 1px",
    width: "2vw",
    height: "2vw",
  };
  const card_Title_Icon_container = {
    //border: "red solid 1px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  };
  const card_data = {
    // border: "red solid 1px",
    margin: "auto",
    fontSize: "2vw",
  };
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div /* className="header-body" */>
            {/* ---buttons---------- */}
            <div style={buttonsContainerStyle}>
              <Button
                style={{
                  borderColor: initialFilter !== "month" && "initial",
                  borderWidth: "1px",
                  height: "40px",
                  textAlign: "center",
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
                  height: "40px",
                  width: "150px",
                  textAlign: "center",
                }}
                color="success"
                value="month"
                onClick={handlerInitialFilter}
              >
                This month
              </Button>
            </div>

            {/* Card stats */}
            <Row style={cardsContainer}>
              {/* card in transit---------- */}
              <Col xs="12" sm="6" md="4" lg="3" xl="2">
                <Card
                  className="card-stats mb-4 mb-xl-0"
                  style={
                    initialFilter === "month"
                      ? expandedCardStyle
                      : commonCardStyle
                  }
                >
                  <CardBody>
                    <Row>
                      <div style={card_Title_Icon_container}>
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          In Transit
                        </CardTitle>

                        <img style={iconCard} src={inTransitIcon} alt="" />
                      </div>

                      <span style={card_data}>
                        {loading ? (
                          <Spinner className="spinner" />
                        ) : (
                          inTransitShipsState
                        )}
                      </span>
                      {/* <Col className="col-auto">
                         <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" /> 
                        </div> 
                      </Col>  */}
                    </Row>
                    {/* texto invisible para mantener tamaños */}
                    {/* <div className="mt-3 mb-0 text-muted text-sm">
                      {percentageChange_completed &&
                        (percentageChange_completed.includes("-") ? (
                          <div >
                            <div >
                              <span style={{visibility:" hidden"}}>
                                {initialFilter === "month" && (
                                  <i className="fa fa-arrow-up" />
                                )}{" "}
                                {initialFilter === "month" &&
                                  percentageChange_completed.slice(1)}
                              </span>{" "}
                            </div>

                            <div style={{visibility:" hidden"}}>
                              {initialFilter === "month" &&
                                "over the last month"}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div>
                              <span className="text-warning mr-2">
                                <i className="fas fa-arrow-down" />{" "}
                                {initialFilter === "month" &&
                                  percentageChange_completed}
                              </span>{" "}
                            </div>

                            <div style={{visibility:" hidden"}}>
                              {initialFilter === "month"
                                ? "  over the last month"
                                : ""}
                            </div>
                          </div>
                        ))}
                    </div> */}
                     <div>
                            <div>
                              <span className="text-warning mr-2">
                                {" "}
                              </span>{" "}
                            </div>

                            <div style={{visibility:" hidden"}}>
                              {initialFilter === "month"
                                ? "  over the last month"
                                : ""}
                            </div>
                          </div>
                  </CardBody>
                </Card>
              </Col>

              {/* card completed---------------- */}
              <Col xs="12" sm="6" md="4" lg="3" xl="2">
                <Card
                  className="card-stats mb-4 mb-xl-0"
                  style={
                    initialFilter === "month"
                      ? expandedCardStyle
                      : commonCardStyle
                  }
                >
                  <CardBody>
                    <Row>
                      <div style={card_Title_Icon_container}>
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Completed
                        </CardTitle>
                       <img style={iconCard} src={completedIcon} alt="" />
                      </div>
                      <span style={card_data}>
                          {loading ? (
                            <Spinner className="spinner" />
                          ) : (
                            allData?.completedShipsState
                          )}
                        </span>
                      {/* <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-chart-pie" />
                        </div>
                      </Col> */}
                    </Row>
                    <div className="mt-3 mb-0 text-muted text-sm">
                      {percentageChange_completed &&
                        (percentageChange_completed.includes("-") ? (
                          <div>
                            <div>
                              <span className="text-success mr-2">
                                {initialFilter === "month" && (
                                  <i className="fa fa-arrow-up" />
                                )}{" "}
                                {initialFilter === "month" &&
                                  percentageChange_completed.slice(1)}
                              </span>{" "}
                            </div>

                            <div>
                              {initialFilter === "month" &&
                                "over the last month"}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div>
                              <span className="text-warning mr-2">
                                <i className="fas fa-arrow-down" />{" "}
                                {initialFilter === "month" &&
                                  percentageChange_completed}
                              </span>{" "}
                            </div>

                            <div>
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
                <Card
                  className="card-stats mb-4 mb-xl-0"
                  style={
                    initialFilter === "month"
                      ? expandedCardStyle
                      : commonCardStyle
                  }
                >
                  <CardBody>
                    <Row>
                      <div style={card_Title_Icon_container}>
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Succeded
                        </CardTitle>
                        <img style={iconCard} src={succededIcon} alt="" />
                      </div>
                      <span style={card_data}>
                          {loading ? (
                            <Spinner className="spinner" />
                          ) : (
                            allData?.succShipsState
                          )}
                        </span>
                      {/* <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="fas fa-users" />
                        </div>
                      </Col> */}
                    </Row>
                    <div className="mt-3 mb-0 text-muted text-sm">
                      {percentageChange_succeded &&
                        (percentageChange_succeded.includes("-") ? (
                          <div>
                            <div>
                              <span className="text-success mr-2">
                                {initialFilter === "month" && (
                                  <i className="fa fa-arrow-up" />
                                )}{" "}
                                {initialFilter === "month" &&
                                  percentageChange_succeded.slice(1)}
                              </span>{" "}
                            </div>

                            <div>
                              {initialFilter === "month" &&
                                "over the last month"}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div>
                              <span className="text-warning mr-2">
                                <i className="fas fa-arrow-down" />{" "}
                                {initialFilter === "month" &&
                                  percentageChange_succeded}
                              </span>{" "}
                            </div>

                            <div>
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
              {/* uncertain---------------- */}
              <Col xs="12" sm="6" md="4" lg="3" xl="2">
                <Card
                  className="card-stats mb-4 mb-xl-0"
                  style={
                    initialFilter === "month"
                      ? expandedCardStyle
                      : commonCardStyle
                  }
                >
                  <CardBody>
                    <Row>
                      <div style={card_Title_Icon_container}>
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Uncertain
                        </CardTitle>
                        <img style={iconCard} src={uncertainIcon} alt="" />
                        
                      </div>
                      <span style={card_data}>
                          {loading ? (
                            <Spinner className="spinner" />
                          ) : (
                            allData?.uncertShipsState
                          )}
                        </span>
                      {/* <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-percent" />
                        </div>
                      </Col> */}
                    </Row>
                    <div className="mt-3 mb-0 text-muted text-sm">
                      {percentageChange_uncertain &&
                        (percentageChange_uncertain.includes("-") ? (
                          <div>
                            <div>
                              <span className="text-warning mr-2">
                                {initialFilter === "month" && (
                                  <i className="fa fa-arrow-up" />
                                )}{" "}
                                {initialFilter === "month" &&
                                  percentageChange_uncertain.slice(1)}
                              </span>{" "}
                            </div>

                            <div>
                              {initialFilter === "month" &&
                                "over the last month"}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div>
                              <span className="text-success mr-2">
                                <i className="fas fa-arrow-down" />{" "}
                                {initialFilter === "month" &&
                                  percentageChange_uncertain}
                              </span>{" "}
                            </div>

                            <div>
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

              {/* card failed--------------- */}
              <Col xs="12" sm="6" md="4" lg="3" xl="2">
                <Card
                  className="card-stats mb-4 mb-xl-0"
                  style={
                    initialFilter === "month"
                      ? expandedCardStyle
                      : commonCardStyle
                  }
                >
                  <CardBody>
                    <Row>
                      <div style={card_Title_Icon_container}>
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Failed
                        </CardTitle>
                       <img style={iconCard} src={failedIcon} alt="" />
                      </div>
                      <span style={card_data}>
                          {loading ? (
                            <Spinner  className="spinner" />
                          ) : (
                            allData?.failShipsState
                          )}
                        </span>
                      {/* <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-percent" />
                        </div>
                      </Col> */}
                    </Row>
                    <div className="mt-3 mb-0 text-muted text-sm">
                      {percentageChange_failed &&
                        (percentageChange_failed.includes("-") ? (
                          <div>
                            <div>
                              <span className="text-warning mr-2">
                                {initialFilter === "month" && (
                                  <i className="fa fa-arrow-up" />
                                )}{" "}
                                {initialFilter === "month" &&
                                  percentageChange_failed.slice(1)}
                              </span>{" "}
                            </div>

                            <div>
                              {initialFilter === "month" &&
                                "over the last month"}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div>
                              <span className="text-success mr-2">
                                <i className="fas fa-arrow-down" />{" "}
                                {initialFilter === "month" &&
                                  percentageChange_failed}
                              </span>{" "}
                            </div>

                            <div>
                              {initialFilter === "month"
                                ? "  over the last month"
                                : ""}
                            </div>
                          </div>
                        ))}
                    </div>
                    {/* texto invisible para mantener tamaños */}
                    {/* {!percentageChange_failed && 
                         <div className="mt-3 mb-0 text-muted text-sm">

                           <div style={{visibility:" hidden"}}>
                            <div>
                              <span style={{visibility:" hidden"}}>
                                {initialFilter === "month" && (
                                  <i className="fa fa-arrow-up" />
                                )}{" "}
                                {initialFilter === "month" &&
                                  percentageChange_failed}
                              </span>{" "}
                            </div>

                            <div style={{visibility:" hidden"}}>
                              {initialFilter === "month" &&
                                "over the last month"}
                            </div>
                          </div>
                         </div> 
                       } */}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
