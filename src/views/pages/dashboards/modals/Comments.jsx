import React, { useState, useEffect } from "react";
import {
  GET_SHIPMENT_COMMENTS,
  ADD_COMMENT,
  GET_REFRIGERATION_COMMENTS,
  ADD_REFRIGERATION_COMMENT,
  UPDATE_REFRIGERATION_ALERTS,
  GET_REFRIGERATION,
} from "queries";
import { useMutation, useLazyQuery } from "@apollo/client";
import styles from "./comments.module.css";
import { language } from "const";
import { Button, Spinner } from "reactstrap";
import ReactBSAlert from "react-bootstrap-sweetalert";
import { CommentSection } from "react-comments-section";
import "react-comments-section/dist/index.css";
export default function Comments({
  shipment_id,
  rc_freeze,
  qr,
  refrigeration_id,
  shipment_table,
  alertComments,
  alert,
  freezer,
  refetchAlertComments,
}) {
  // ESTADOS LOCALES ---------------------------------------------------------------------
  //estado para el boton add comment
  const [isAddComment, setIsAddComment] = useState(false);

  //estado para el input del comment
  const [commentAdded, setCommentAdded] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const hideAlert = () => {
    setAlertMessage(null);
  };

  // QUERIES/MUTATIONS --------------------------------------------------------------------
  //lazy query para updatear cuando se agrega un comentario
  const [
    getComments,
    {
      loading: lazyCommentsLoading,
      error: lazyCommentsError,
      data: lazyCommentsData,
    },
  ] = useLazyQuery(GET_SHIPMENT_COMMENTS, {
    variables: {
      shipment_id,
    },
  });

  const [
    getRefrigerationComments,
    {
      loading: refrigerationCommentsLoading,
      error: refrigerationCommentsError,
      data: refrigerationCommentsData,
    },
  ] = useLazyQuery(GET_REFRIGERATION_COMMENTS);

  //mutation para agregar comentario

  const [
    addComment,
    {
      loading: commentAddedLoading,
      error: commentAddedError,
      data: commentAddedData,
    },
  ] = useMutation(
    ADD_COMMENT,
    {
      variables: {
        shipment_id,
        comment_text: commentAdded,
      },
    },
    { fetchPolicy: "network-only" }
  );

  const [
    addRefrigerationComment,
    {
      loading: refCommentLoadding,
      error: refCommentError,
      data: refCommentData,
    },
  ] = useMutation(ADD_REFRIGERATION_COMMENT);
  //static---------------------------------------------------------------------

  const [
    updateAlertText,
    { loading: updateAlertLoading, error: updateAlertError },
  ] = useMutation(UPDATE_REFRIGERATION_ALERTS, {
    refetchQueries: [
      {
        query: GET_REFRIGERATION,
        variables: {
          from: null,
          to: null,
          qr: freezer?.qr,
        },
      },
    ],
  });
  //CUANDO SE INICIA EL COMPONENTE ------------------------------------------------------------------
  useEffect(() => {
    if (rc_freeze) {
      //refrigeration comment
      const fetchRefrigerationComments = async () => {
        await getRefrigerationComments({
          variables: {
            qr: qr,
          },
        });
      };
      fetchRefrigerationComments();
    }
    if (shipment_id) {
      //shipment comments
      const fetchComments = async () => {
        let result = await getComments();
      };
      fetchComments();
    }
  }, [lazyCommentsData, refrigerationCommentsData]);

  //HANDLERS ----------------------------------------------------------------------------------
  //handler del input de comentario agregado
  const handleOnChangeComment = (e) => {
    setCommentAdded(e.target.value);
  };
  const confirmAlert = () => {
    setAlertMessage(
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => hideAlert()}
        onCancel={confirmedAlert}
        showCancel
        confirmBtnBsStyle="secondary"
        confirmBtnText="Cancel"
        cancelBtnBsStyle="danger"
        cancelBtnText="Yes, send comment!"
        btnSize=""
      >
        You won't be able to revert this!
      </ReactBSAlert>
    );
  };

  const confirmedAlert = () => {
    setAlertMessage(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Sended!"
        onConfirm={() => {
          hideAlert();
          handleConfirmComment();
        }}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="primary"
        confirmBtnText="Ok"
        btnSize=""
      >
        Your comment was sent
      </ReactBSAlert>
    );
  };
  //handler del confirm del comentario agregado
  const handleConfirmComment = async () => {
    try {
      await addComment({
        variables: {
          shipment_id,
          comment_text: commentAdded,
        },
        refetchQueries: [
          {
            query: GET_SHIPMENT_COMMENTS,
            variables: { shipment_id: shipment_id },
          },
        ],
      });
      setCommentAdded("");
      setIsAddComment(false);
      await getComments();
    } catch (error) {
      console.log("hubo un error en el comentario agregado", error);
    }
  };

  const addRefComment = async () => {
    try {
      if (
        window.confirm(
          localStorage.getItem("language") === "es"
            ? "¿Estás seguro que quieres guardar cambios?"
            : "Are you sure you want to confirm changes?"
        )
      ) {
        await addRefrigerationComment({
          variables: {
            refrigeration_id: refrigeration_id,
            comment_text: commentAdded,
          },
          refetchQueries: [
            { query: GET_REFRIGERATION_COMMENTS, variables: { qr: qr } },
          ],
        });
        alert(
          language === "es" ? "Nuevo comentario agregado" : "New comment added"
        );
        setCommentAdded("");
        setIsAddComment(false);

        await getRefrigerationComments({
          variables: {
            qr: qr,
          },
        });
      }
    } catch (error) {
      console.log("hubo un error en el comentario agregado", error);
    }
  };

  //agregar comentarios a las alertas del static
  const editTextToAlertComment = (e) => {
    e.preventDefault();
    if (e.target.name === "text") {
      setCommentAdded({ ...commentAdded, [e.target.name]: e.target.value });
    }
  };

  const sendTextToAlertComment = async () => {
    try {
      await updateAlertText({
        variables: {
          refrigeration_id: freezer.refrigeration_id,
          alert_type: alert.type,
          alert_timestamp: alert.timestamp,
          add_comment: {
            text: commentAdded.text,
          },
        },
        refetchQueries: [
          {
            query: GET_REFRIGERATION,
            variables: {
              from: null,
              to: null,
              qr: freezer.qr,
            },
          },
        ],
      });
      setCommentAdded("");
      window.alert(
        language === "es"
          ? "El comentario fué agregado con éxito!"
          : "Comment added successfully"
      );
      if(shipment_id) refetchAlertComments();
     
      //window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  //MANEJO DE ERRORES ------------------------------------------------------------------------
  if (lazyCommentsError || refrigerationCommentsError)
    console.log("hubo un error en la carga de comentarios", lazyCommentsError);

  if (commentAddedError || commentAddedError)
    console.log("hubo un error en el comentario agregado", commentAddedError);

  // LOADING ------------------------------------------------------------------------------------
  if (
    lazyCommentsLoading ||
    commentAddedLoading ||
    refrigerationCommentsLoading
  ) {
    return (
      <div
        style={{
          display: "flex",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner className="spinner" />
      </div>
    );
  }
  const getTime = (time) => {
    let date = new Date(time);
    const timezoneOffset = date.getTimezoneOffset();
    date.setHours(date.getHours() + timezoneOffset);

    let month = date.getMonth() + 1; // Los meses van de 0 a 11, por lo que hay que sumarle 1
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours <= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // el 0 se convierte en 12
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = month + "/" + day + " " + hours + ":" + minutes + " " + ampm;

    return strTime;
  };
  const data = [
    {
      userId: "02b",
      comId: "017",
      fullName: "Lily",
      userProfile: "https://www.linkedin.com/in/riya-negi-8879631a9/",
      text: "I think you have a point🤔",
      avatarUrl: "https://ui-avatars.com/api/name=Lily&background=random",
      replies: [],
    },
  ];
  if (alertComments) {
    return (
      <div className={styles.alertCommentText_button_container}>
        <input
          type="text"
          name="text"
          className={styles.alertCommentText}
          placeholder={
            language === "es" ? "Nuevo comentario..." : "New comment..."
          }
          value={commentAdded.text || ""}
          // onChange={handleAlert}
          onChange={editTextToAlertComment}
        />
        <button
          className={styles.alertCommentButton}
          // onClick={(e) => handleEditAlert(e, alert)}
          onClick={sendTextToAlertComment}
        >
          send
        </button>
      </div>
    );
  }
  if (rc_freeze) {
    return (
      <>
        <div className={styles.fContainer}>
          <h3 className={styles.f_title}>Comments of shipment</h3>
          <div className={styles.f_commentsAndAddContainer}>
            {/* COMENTARIOS ---------------------------------------------------- */}
            <div className={styles.f_commentsContainer}>
              {refrigerationCommentsData?.refrigeration?.comments?.length >
              0 ? (
                refrigerationCommentsData?.refrigeration?.comments?.map(
                  (c, i) => {
                    return (
                      <div className={styles.f_eachComment} key={i + 0.5}>
                        <p className={styles.text}>{c.text}</p>

                        <div className={styles.author}>
                          {(c?.author === "0" ? "SUDO" : c?.author) +
                            "  " +
                            getTime(c?.date)}
                        </div>
                      </div>
                    );
                  }
                )
              ) : (
                <div className={styles.noComments}>
                  No comments on this shipment
                  {/* {language === "es"
                    ? "No hay comentarios para mostrar"
                    : "No comments to show"} */}
                </div>
              )}
            </div>
            {/* AGREGAR COMENTARIO -------------------------------------------------------- */}
            <div className={styles.f_addCommentContainer}>
              <input
                type="text"
                placeholder={
                  localStorage.getItem("language") === "en"
                    ? "Write a comment..."
                    : "Escribe un comentario..."
                }
                onChange={handleOnChangeComment}
                className={styles.fInput}
                maxLength="256"
                value={commentAdded}
              />
            </div>
            <div className={styles.f_buttonsContainer}>
              <button onClick={addRefComment} className={styles.fButton}>
                Save
              </button>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    // cuadro de comentarios de TablaViajes en el dashboard
    if (shipment_table) {
      return (
        <>
          {alertMessage}
          <div className={styles.table_container}>
            {/* <h3 className={styles.title}>
              
              { `Shipment #${shipment_id.split("-")[1]}`}
            </h3> */}
            <div className={styles.table_commentsAndAddContainer}>
              {/* COMENTARIOS ---------------------------------------------------- */}
              <div className={styles.table_commentsContainer}>
                {lazyCommentsData?.shipment?.comments.length > 0 ? (
                  lazyCommentsData?.shipment?.comments?.map((c, i) => {
                    return (
                      <div className={styles.eachComment} key={i}>
                        <p className={styles.text}>{c.text}</p>

                        <div className={styles.author}>
                          {(c?.author === "0" ? "SUDO" : c?.author) +
                            "  " +
                            getTime(c?.date)}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.noComments}>
                    {rc_freeze
                      ? "NO freeze comments"
                      : "No comments on this shipment"}
                  </div>
                )}
              </div>
            </div>

            {/* AGREGAR COMENTARIO -------------------------------------------------------- */}
            <div className={styles.table_addCommentContainer}>
              <input
                type="text"
                placeholder={
                  localStorage.getItem("language") === "en"
                    ? "Write a comment..."
                    : "Escribe un comentario..."
                }
                onChange={handleOnChangeComment}
                className={rc_freeze ? styles.fInput : styles.input}
                maxLength="256"
                value={commentAdded}
              />
              <div className={styles.buttonsContainer}>
                {/* <button
                  onClick={confirmAlert}
                  className={rc_freeze ? styles.fButton : styles.button}
                >
                  Save
                </button> */}
                <Button color="primary" type="button" style={{ marginTop:"15%"}} onClick={confirmAlert}>
                  Save changes
                </Button>
              </div>
            </div>
          </div>
        </>
        /////libreria de comentarios, probar
        // <>
        //   <CommentSection
        //     currentUser={{
        //       currentUserId: "01a",
        //       currentUserImg:
        //         "https://ui-avatars.com/api/name=Riya&background=random",
        //       currentUserProfile:
        //         "https://www.linkedin.com/in/riya-negi-8879631a9/",
        //       currentUserFullName: "Riya Negi",
        //     }}
        //     logIn={{
        //       loginLink: "http://localhost:3001/",
        //       signupLink: "http://localhost:3001/",
        //     }}
        //     commentData={data}
        //     onSubmitAction={(data) => console.log("check submit, ", data)}
        //     currentData={(data) => {
        //       console.log("curent data", data);
        //     }}
        //   />
        // </>
      );
    } else {
      //cuadro de comentarios de los reportes
      return (
        <>
          <div className={rc_freeze ? styles.fContainer : styles.container}>
            <h3 className={styles.title}>
              Comments of shipment
              {/* {shipment_id.split("-")[1]} */}
            </h3>
            <div className={styles.commentsAndAddContainer}>
              {/* COMENTARIOS ---------------------------------------------------- */}
              <div className={styles.commentsContainer}>
                {lazyCommentsData?.shipment?.comments.length > 0 ? (
                  lazyCommentsData?.shipment?.comments?.map((c, i) => {
                    return (
                      <div className={styles.eachComment} key={i}>
                        <p className={styles.text}>{c.text}</p>

                        <div className={styles.author}>
                          {(c?.author === "0" ? "SUDO" : c?.author) +
                            "  " +
                            getTime(c?.date)}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.noComments}>
                    {rc_freeze
                      ? "NO freeze comments"
                      : "No comments on this shipment"}
                  </div>
                )}
              </div>
              {/* AGREGAR COMENTARIO -------------------------------------------------------- */}
              <div className={styles.addCommentContainer}>
                <input
                  type="text"
                  placeholder={
                    localStorage.getItem("language") === "en"
                      ? "Write a comment..."
                      : "Escribe un comentario..."
                  }
                  onChange={handleOnChangeComment}
                  className={rc_freeze ? styles.fInput : styles.input}
                  maxLength="256"
                  value={commentAdded}
                />
                <div className={styles.buttonsContainer}>
                  <button
                    onClick={handleConfirmComment}
                    className={rc_freeze ? styles.fButton : styles.button}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  }
}
