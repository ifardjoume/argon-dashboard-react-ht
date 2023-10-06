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
import React from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_COMPANY_DETAIL } from "queries";
import { GET_USER } from "queries";
import { LOGIN } from "queries";
import { useEffect, useState } from "react";
import ReactBSAlert from "react-bootstrap-sweetalert";
// nodejs library that concatenates classes
import classnames from "classnames";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";
// core components
import AuthHeader from "components/Headers/AuthHeader.js";
//import { parseJwt, setLocalStorageData } from "../../helpers";
import { useNavigate } from "react-router-dom";
import { parseJwt } from "helpers";
import { setLocalStorageData } from "helpers";
import ForgotPass from "../forms/ForgotPass";

function Login() {
  const [focusedEmail, setfocusedEmail] = React.useState(false);
  const [focusedPassword, setfocusedPassword] = React.useState(false);

  if (window.navigator.language?.split("-")[0] === "es") {
    localStorage.setItem("language", "es");
  } else localStorage.setItem("language", "en");

  //estados
  //estado para ver si hay un error en el logeo
  const [userError, setUserError] = useState(false);
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  let userId = "";
  const [user, setUser] = useState({});
  let token = "";
  //estado para el modal de recovery code
  const [recoveryModal, setRecoveryModal] = useState(false);
  //const estado para el modal de seleccion de operario
  const [selectOpeModal, setSelectOpeModal] = useState(false);
  const [loginMutation, { data, loading, error: loginError }] =
    useMutation(LOGIN);
  const navigate = useNavigate();
  //query para traerme los operadores no asignados
  const [
    getCompanyDetail,
    {
      loading: companyDetailLoading,
      error: companyDetailError,
      data: companyDetailData,
    },
  ] = useLazyQuery(GET_COMPANY_DETAIL);

  //para traer la data del usuario
  const [
    getUser,
    {
      data: userDataLazyQuery,
      loading: userDataLazyQueryLoading,
      error: userDataLazyQueryError,
    },
  ] = useLazyQuery(GET_USER, {
    variables: {
      user_id: userId,
    },
  });

  const handleLogin = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
    console.log(login);
    
  };
  useEffect(() => {
    let access_to;
    setUser(userDataLazyQuery);

    // si es admin se loguea de una
    if (user?.user) {
      if (user.user?.type === "Admin") {
        localStorage.setItem("access", "");
        localStorage.setItem("assigned_to", "");
        // window.location.replace("/");
      }

      //si no es admin y es mono se loguea de una, sino se abre modal para elegir operario

      if (user.user?.type !== "Admin") {
        if (user?.user?.mono === false) {
          handleSelectOpeModal();
        } else {
          //busco a que compania pertenece para buscar el operario que tiene asignado
          const fetchCompanyData = async () => {
            await getCompanyDetail({
              variables: {
                company_id: user?.user?.belong_id,
              },
            });
          };
          fetchCompanyData();

          //seteo el objeto access_to del operario que tiene asaignado el usuario y lo guardo en localStorage
          access_to = companyDetailData?.company?.operators?.filter(
            (o) => o.operator_id === user?.user?.assigned_to
          )[0]?.access_to;

          if (access_to) {
            //esto es para setear la data en el context pero no funciona
            //asi que la guardo en localStorage
            // setAccessState(access_to);
            /* 
            el context no carga pq al hacer window.location se refresca la pagina 
            y pierdo los datos... ya pase context x props a home, 
            ahora desde ahi tengo que codear de nuevo las rutas protegidas
            (actualmente redirige desde login, lo cual esta mal pq guardo access en localStorage 
            y es hackeable)
            */
            // //-----------------------------------------------------//

            localStorage.setItem("access", JSON.stringify(access_to));
            localStorage.setItem("assigned_to", user?.user?.assigned_to);

            if (
              access_to.dash_control === false &&
              access_to.dash_intransit === true
            ) {
              // window.location.replace(`${BASE_URL}/#in-coming`);
              // window.location.reload(); //
            } else if (
              access_to.dash_control === false &&
              access_to.dash_report === true
            ) {
              // window.location.replace(`${BASE_URL}/#reports`);
              // window.location.reload(); //
            } else if (access_to.dash_control === true) {
              window.location.replace(`/`);
            }
          }
        }
      }
    }
  }, [userDataLazyQuery, user, token, companyDetailData]);

  //handler cuando submiteo el form
  let token_decoded = {};

  const handleSubmit = async function (e) {
    e.preventDefault();
    try {
      const result = await loginMutation({
        variables: { username: login.username, password: login.password },
      });
      token = result.data.login.token;

      if (parseJwt(token).SUDO) {
        setLocalStorageData(token, (Date.now() + 86400000).toString());
        localStorage.setItem("language", "es");
        localStorage.setItem("assigned_to", "");
        //window.location.replace(`/`);
      } else {
        //seteo el userId para traerme la info del usuario
        token_decoded = parseJwt(token);
        userId = token_decoded.user_id;
        getUser();
        setLocalStorageData(token, (Date.now() + 86400000).toString());

        console.log("logueadooo");
        window.location.reload();
      }
    } catch (error) {
      console.log("error al logearse", error);
      setUserError(true);
    }
  };

  //hanler forgotPass



 

  //handlers de select operator
  const handleSelectOpeModal = () => {
    setSelectOpeModal(true);
  };
  const handleSelectOpeModalClose = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("expiration", "");
    localStorage.setItem("notifications", "");
    localStorage.setItem("notificationsENG", "");
    localStorage.setItem("numberNoti", "");
    localStorage.setItem("access", "");
    localStorage.setItem("assigned_to", null);
    // window.location.replace("/");
    setSelectOpeModal(false);
  };
  

  return (
    <>
      <AuthHeader
        title="Welcome!"
        lead="Use these awesome forms to login or create new account in your project for free."
      />
      <Container className="mt--8 pb-5">
        <Row className="justify-content-center">
          <Col lg="5" md="7">
            <Card className="bg-secondary border-0 mb-0">
              <CardHeader className="bg-transparent pb-5">
                <div className="text-muted text-center mt-2 mb-3">
                  <small>Sign in with</small>
                </div>
                <div className="btn-wrapper text-center">
                  <Button
                    className="btn-neutral btn-icon"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="btn-inner--icon mr-1">
                      <img
                        alt="..."
                        src={
                          require("assets/img/icons/common/github.svg").default
                        }
                      />
                    </span>
                    <span className="btn-inner--text">Github</span>
                  </Button>
                  <Button
                    className="btn-neutral btn-icon"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="btn-inner--icon mr-1">
                      <img
                        alt="..."
                        src={
                          require("assets/img/icons/common/google.svg").default
                        }
                      />
                    </span>
                    <span className="btn-inner--text">Google</span>
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-4">
                  <small>Or sign in with credentials</small>
                </div>
                <Form role="form">
                  <FormGroup
                    className={classnames("mb-3", {
                      focused: focusedEmail,
                    })}
                  >
                    <InputGroup className="input-group-merge input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-email-83" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Username"
                        type="text"
                        onFocus={() => setfocusedEmail(true)}
                        onBlur={() => setfocusedEmail(true)}
                        value={login.username}
                        onChange={handleLogin}
                        name="username"
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup
                    className={classnames({
                      focused: focusedPassword,
                    })}
                  >
                    <InputGroup className="input-group-merge input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Password"
                        type="password"
                        name="password"
                        onFocus={() => setfocusedPassword(true)}
                        onBlur={() => setfocusedPassword(true)}
                        value={login.password}
                        onChange={handleLogin}
                      />
                    </InputGroup>
                  </FormGroup>
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id=" customCheckLogin"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor=" customCheckLogin"
                    >
                      <span className="text-muted">Remember me</span>
                    </label>
                  </div>
                  <div className="text-center">
                    <Button
                      className="my-4"
                      color="info"
                      type="button"
                      onClick={handleSubmit}
                    >
                      Sign in
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
            <Row className="mt-3">
              {/* forgot pass */}
              <Col className="text-center" >
              <ForgotPass/>
              </Col>
              {/* <Col className="text-right" xs="6">
                <a
                  className="text-light"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <small>Create new account</small>
                </a>
              </Col> */}
            </Row>
          </Col>
        </Row>
      
      </Container>

    </>
  );
}

export default Login;
