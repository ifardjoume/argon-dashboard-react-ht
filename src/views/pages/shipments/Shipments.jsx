import React, { useEffect, useState } from "react";
import {
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Label,
  Button,
  Table,
  Collapse,
  Spinner,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { AiOutlineDownload } from "react-icons/ai";
import styles from "./shipments.module.css";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_COMPANY_DETAIL } from "queries";
import { GET_SHIPMENTS_PAG_TO_HEADER } from "queries";
import { GET_SHIPMENT_DETAIL } from "queries";
import { company_id } from "const";
import { convertirHoraLocal } from "helpers";
import { fetchReportFile } from "helpers";
import { saveAs } from "file-saver";
import { useCompare } from "hooks/UseCompare";
import "bootstrap/dist/css/bootstrap.min.css";
//icons
import rombo_succes from "../../../assets/img/icons/statusIcons/IconoStatus_SUCCESS.png";
import rombo_uncert from "../../../assets/img/icons/statusIcons/IconoStatus_UNCERTAIN.png";
import rombo_fail from "../../../assets/img/icons/statusIcons/IconoStatus_FAILED.png";
import DropdownShipments from "./dropdowShipments/DropdownShipments";
const Shipments = () => {
  const { handleCheck, arrayState, clearSelection, errorState, error } =
    useCompare();
  //estado para guardarme la info filtrada
  const [filters, setFilters] = useState({
    status: null,
    from_date: "",
    to_date: "",
    origin_id: "",
    origin_op_id: "",
    destination_id: "",
    destination_op_id: "",
    item_id: "",
    in_transit: false,
    qr: "",
    shipment_id: "",
  });
  //estados para la paginacion
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  //estado para el input de busqueda por id
  const [searchInput, setSearchInput] = useState("");

  // QUERIES/MUTATIONS ---------------------------------------------------------------------------------
  //query para traerme las branches de la compañia al principio
  const {
    // loading: companyDetailLoading,
    // error: companyDetailError,
    data: company_detail,
  } = useQuery(GET_COMPANY_DETAIL, {
    variables: {
      company_id: company_id,
    },
  });

  //lazy query para traerme cuando submiteo filtros
  const [
    filterData,
    {
      loading: filtersLoading,
      // error: filtersError,
      data: filtersResult,
    },
  ] = useLazyQuery(GET_SHIPMENTS_PAG_TO_HEADER);
  const [
    dataToCsv,
    {
      loading: toCsvLoading,
      // error: filtersError,
      data: toCsv,
    },
  ] = useLazyQuery(GET_SHIPMENT_DETAIL);

  // VARIABLE PARA GUARDAR LA DATA -----------------------------------------------------
  let dataLength = "";
  let data = "";

  let info = [];
  //CADA VEZ QUE CAMBIO DE PAGINA VUELVO A HACER LA QUERY ------------------------------------------------------------------------
  useEffect(() => {
    if (typeof data !== "string") {
      filterData({
        variables: {
          company_id,
          status: filters.status,
          from_date: filters.from_date,
          to_date: filters.to_date,
          origin_id: filters.origin_id,
          origin_op_id: filters.origin_op_id,
          destination_id: filters.destination_id,
          destination_op_id: filters.destination_op_id,
          item_id: filters.item_id,
          page,
          per_page: rowsPerPage,
          in_transit: false,
          qr: filters.qr,
          shipment_id: filters.shipment_id,
        },
      });
    }

    info = filtersResult?.shipments;
    console.log("infoooo");
    console.log(info);
  }, [page]);

  //HANDLERS ---------------------------------------------------------------------------------------------
  //handler cuando cambio filtros
  const handleChange = function (e) {
    if (e.target.value === "") {
      setFilters({
        ...filters,
        [e.target.name]: null,
      });
    } else {
      setFilters({
        ...filters,
        [e.target.name]: e.target.value,
      });
    }
  };

  //handler cuando submiteo los filtros
  const handleFilter = async (e) => {
    e.preventDefault();
    console.log("filtros");
    console.log(filters);
    try {
      await filterData({
        variables: {
          company_id,
          status: filters.status,
          from_date: filters.from_date,
          to_date: filters.to_date,
          origin_id: filters.origin_id,
          origin_op_id: filters.origin_op_id,
          destination_id: filters.destination_id,
          destination_op_id: filters.destination_op_id,
          item_id: filters.item_id,
          page,
          per_page: rowsPerPage,
          in_transit: false,
          qr: filters.qr,
          shipment_id:
            filters.shipment_id === "" || !filters.shipment_id
              ? ""
              : `SHI-${filters.shipment_id}-${company_id.split("-")[1]}`,
        },
      });
      dataLength = filtersResult?.shipments?.total;
      data = filtersResult?.shipments?.selectedItems;
    } catch (error) {
      console.log(error);
    }
  };

  //CUANDO ENCUENTRE RESULTADOS LA DATA VA A SER ESTA -------------------------------------------------------------
  if (filtersResult?.shipments?.selectedItems) {
    dataLength = filtersResult?.shipments?.total;
    data = filtersResult?.shipments?.selectedItems;
  }

  // PARA LA BUSQUEDA POR NOMBRE -----------------------------------------------------
  if (searchInput !== "") {
    let infoCopy = data;
    data = infoCopy?.filter((s) =>
      s?.shipment_id
        ?.split("-")[1]
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    );
  }

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);

  const toggleRow = (e, id) => {
    if (!e.target.closest('input[type="checkbox"]')) {
      setSelectedRows((prevSelectedRows) => {
        if (prevSelectedRows.includes(id)) {
          return prevSelectedRows.filter((rowId) => rowId !== id);
        } else {
          return [...prevSelectedRows, id];
        }
      });
    }
  };

  // download reports
  //handler descarga de reporte
  const handleDownload = async (e, shipment_id) => {
    e.stopPropagation(); // con esto evito que el accordion se abra o cierrre cuando descargo un reporte
    await fetchReportFile(shipment_id);
  };

  const getTimestamp = (tick, csv) => {
    let date = new Date(tick);
    const timezoneOffset = date.getTimezoneOffset();
    date.setHours(date.getHours() /*  - (timezoneOffset / 60) */);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Asegura que tenga 2 dígitos
    const day = String(date.getDate()).padStart(2, "0"); // Asegura que tenga 2 dígitos
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Asegura que tenga 2 dígitos
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12; // Si hours es 0, se muestra como 12

    let strTime = "";

    if (csv) {
      strTime = `${year}/${month}/${day} ${formattedHours}:${minutes} ${ampm}`;
    } else {
      strTime = `${month}/${day} ${formattedHours}:${minutes} ${ampm}`;
    }
    return strTime;
  };

  const downloadCsv2 = async (e, s) => {
    let response;
    console.log(s);
    e.stopPropagation();
    console.log(s);
    try {
      response = await dataToCsv({
        variables: {
          shipment_id: s.shipment_id,
        },
      });
      console.log(response?.data?.shipment);
    } catch (error) {
      console.log(error);
    }
    const origin_branch = company_detail?.company?.branches
      ?.map((b) => b?.branch_id === s?.origin_id && b?.name)
      .filter((branch) => branch !== false);
    const ope_sender = company_detail?.company?.operators
      ?.map(
        (o) =>
          o?.operator_id === s?.origin_op_id &&
          `${o.name} (${o.operator_id.split("-")[0]}-${
            o.operator_id.split("-")[1]
          })`
      )
      .filter((ope) => ope !== false);
    const destination_branch = company_detail?.company?.branches
      ?.map((b) => b.branch_id === s?.destination_id && b.name)
      .filter((branch) => branch !== false);
    const ope_receiver = company_detail?.company?.operators
      ?.map(
        (o) =>
          o.operator_id === s?.destination_op_id &&
          `${o.name} (${o.operator_id.split("-")[0]}-${
            o.operator_id.split("-")[1]
          })`
      )
      .filter((ope) => ope !== false);

    let csvContent = "DATA\n";
    csvContent +=
      "shipment_id,origin,sender,departure,destination,receiver,arribal,status\n";
    csvContent += `${s.shipment_id},${origin_branch},${ope_sender},${s.departure},${destination_branch},${ope_receiver},${s.arrival},${s.status}\n\n`;
    csvContent += "READINGS\n";
    csvContent += "timestamp,value\n";

    response?.data?.shipment?.temperature_readings?.forEach((reading) => {
      csvContent += `\n${getTimestamp(reading?.timestamp, true)},${
        reading.cv ? reading?.cv?.toFixed(2) : reading?.value?.toFixed(2)
      }`;

      //csvContent += `\n${convertirHoraLocal(reading?.timestamp,company_detail?.company?.gmt)},${reading?.value}`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `${s.shipment_id}.csv`);
  };
  const stopCollapse = (e) => {
    e.stopPropagation();
  };

  const itemsPerPage = 15;
  const totalPages = Math.ceil(filtersResult?.shipments?.total / itemsPerPage);

  const changePage = (e, page) => {
    e.preventDefault();
    setPage(page);
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
  // render
  const renderPaginationItems = () => {
    const items = [];
    const visiblePages = 10; // Número de páginas visibles antes de los puntos suspensivos

    // Calcular el rango de páginas basado en la página actual
    const startPage = Math.max(1, page - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    // Agregar páginas al arreglo
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i} active={i === page}>
          <PaginationLink href="#pablo" onClick={(e) => changePage(e, i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Agregar los puntos suspensivos si hay más páginas
    if (totalPages > endPage) {
      items.push(
        <PaginationItem disabled key="dots">
          <PaginationLink href="#pablo" onClick={(e) => e.preventDefault()}>
            ...
          </PaginationLink>
        </PaginationItem>
      );

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#pablo"
            onClick={(e) => changePage(e, totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <h2 className={styles.reportsTitle}>Reports</h2>
      {/* FILTROS */}
      <Form className={styles.form} onSubmit={handleFilter}>
        <div className={styles.subContainer}>
          <FormGroup className={styles.origin_destination}>
            {/* origin */}
            <Label for="example-text-input" className={styles.label}>
              ORIGIN
            </Label>
            <Input
              type="select"
              name="origin_id"
              id="example-select"
              className={styles.input}
              onChange={handleChange}
            >
              <option value="" className={styles.option}>
                All
              </option>
              {company_detail?.company?.branches.map((b) => (
                <option value={b.branch_id} key={b.branch_id}>
                  {b.name}
                </option>
              ))}
            </Input>
            {/* destination */}
            <Label for="example-text-input" className={styles.label}>
              DESTINATION
            </Label>
            <Input
              type="select"
              name="destination_id"
              id="example-select"
              className={styles.input}
              onChange={handleChange}
            >
              <option value="">
                {localStorage.getItem("language") === "en" ? "All" : "Todos"}
              </option>
              {company_detail?.company?.branches.map((b) => (
                <option value={b.branch_id} key={b.branch_id}>
                  {b.name}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup className={styles.from_to}>
            {/* from */}
            <Label for="example-date-input" className={styles.label}>
              FROM
            </Label>
            <Input
              // defaultValue={new Date().getFullYear() + "-11-23"}
              id="example-date-input"
              type="date"
              className={styles.input}
              name="from_date"
              onChange={handleChange}
            />
            {/* to */}
            <Label for="example-date-input" className={styles.label}>
              TO
            </Label>
            <Input
              //  defaultValue={new Date().getFullYear() + "-11-23"}
              id="example-date-input"
              type="date"
              className={styles.input}
              name="to_date"
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup className={styles.sender_receiver}>
            {/* sender */}
            <Label for="example-text-input" className={styles.label}>
              SENDER
            </Label>
            <Input
              type="select"
              name="origin_op_id"
              id="example-select"
              className={styles.input}
              onChange={handleChange}
            >
              <option value="" className={styles.option}>
                {localStorage.getItem("language") === "en" ? "All" : "Todos"}
              </option>
              {company_detail?.company?.operators.map((o) => (
                <option value={o.operator_id} key={o.operator_id}>
                  {o.name} (
                  {o.operator_id.split("-")[0] +
                    "-" +
                    o.operator_id.split("-")[1]}
                  )
                </option>
              ))}
            </Input>
            {/* receiver */}
            <Label for="example-text-input" className={styles.label}>
              RECEIVER
            </Label>
            <Input
              type="select"
              name="destination_op_id"
              id="example-select"
              className={styles.input}
              onChange={handleChange}
            >
              <option value="" className={styles.option}>
                {localStorage.getItem("language") === "en" ? "All" : "Todos"}
              </option>
              {company_detail?.company?.operators.map((o) => (
                <option value={o.operator_id} key={o.operator_id}>
                  {o.name} (
                  {o.operator_id.split("-")[0] +
                    "-" +
                    o.operator_id.split("-")[1]}
                  )
                </option>
              ))}
            </Input>
          </FormGroup>
        </div>

        <FormGroup className={styles.status_barcode_qr}>
          {/* shipment status */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Label for="example-text-input" className={styles.label}>
              STATUS
            </Label>
            <Input
              type="select"
              name="status"
              id="example-select"
              className={styles.input}
              onChange={handleChange}
            >
              <option value="">All</option>
              <option value="SUCCESSFUL">Successful</option>
              <option value="UNCERTAIN">Uncertain</option>
              <option value="FAILED">Failed</option>
            </Input>
          </div>

          {/* BARCODE */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Label for="example-date-input" className={styles.label}>
              BARCODE
            </Label>
            <Input
              type="text"
              className={styles.input}
              name="barcode"
              onChange={handleChange}
            />
          </div>

          {/* qr */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Label for="example-date-input" className={styles.label}>
              QR
            </Label>
            <Input
              type="text"
              className={styles.input}
              name="qr"
              onChange={handleChange}
            />
          </div>

          {/* id */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Label for="example-date-input" className={styles.label}>
              ID
            </Label>
            <Input
              type="text"
              className={styles.input}
              name="shipment_id"
              onChange={handleChange}
            />
          </div>
        </FormGroup>
        <div className={styles.buttons}>
          <Button
            className="btn-icon btn-3"
            color="primary"
            type="button"
            onClick={handleFilter}
          >
            <span className="btn-inner--icon">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <span className="btn-inner--text">Search</span>
          </Button>

          <Button className={styles.button_compare}>Compare</Button>
          <Button className={styles.button_clear} onClick={clearSelection}>
            Clear
          </Button>
        </div>
      </Form>

      {/* TABLA */}
      {filtersLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "50%",
          }}
        >
          <Spinner className="spinner" />
        </div>
      ) : (
        <div >
          {/* Por si no hay filtros puestos */}
          {typeof data === "string" ? (
            <div className={styles.message1}>Please select search settings</div>
          ) : data?.[0] ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "97%",
                height: "50%",
                margin: "auto",
              }}
            >
              <Table>
                <thead>
                  <tr>
                    <th className={styles.theader}>ID</th>
                    <th className={styles.theader}>QR</th>
                    <th className={styles.theader}>ORIGIN</th>
                    <th className={styles.theader}>SENDER</th>
                    <th className={styles.theader}>DEPARTURE</th>
                    <th className={styles.theader}>DESTINATION</th>
                    <th className={styles.theader}>RECEIVER</th>
                    <th className={styles.theader}>ARRIVAL</th>
                    <th className={styles.theader}>STATUS</th>
                    <th className={styles.theader}>REPORTS</th>
                    <th className={styles.theader}>SELECT</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((s, index) => (
                    <>
                      {" "}
                      <tr
                        onClick={(e) => toggleRow(e, s.shipment_id)}
                        className={styles.headerData}
                        style={
                          data.indexOf(s) % 2 === 0
                            ? { background: "#FAFAFA" }
                            : { background: "#D9F1F5" }
                            
                        }
                      >
                        {/* id */}
                        <td>
                          <div className={styles.moveDown}>
                            {" "}
                            {s?.shipment_id.split("-")[1]}
                          </div>
                        </td>
                        {/* qr */}
                        <td>
                          <div className={styles.moveDown}>{s?.qr}</div>
                        </td>
                        {/* origin */}
                        <td>
                          <div className={styles.moveDown}>
                            {company_detail?.company?.branches?.map(
                              (b) => b?.branch_id === s?.origin_id && b?.name
                            )}{" "}
                          </div>
                        </td>
                        {/* sender */}
                        <td>
                          <div className={styles.moveDown}>
                            {company_detail?.company?.operators?.map(
                              (o) =>
                                o?.operator_id === s?.origin_op_id &&
                                `${o.name} (${o.operator_id.split("-")[0]}-${
                                  o.operator_id.split("-")[1]
                                })`
                            )}
                          </div>
                        </td>
                        {/* departure */}
                        <td className={styles.departure_arrival}>
                          {
                            convertirHoraLocal(
                              s?.departure,
                              company_detail?.company?.gmt
                            ).split("  ")[0]
                          }
                          <br />
                          {
                            convertirHoraLocal(
                              s?.departure,
                              company_detail?.company?.gmt
                            ).split("  ")[1]
                          }
                        </td>
                        {/* destination */}
                        <td>
                          <div className={styles.moveDown}>
                            {company_detail?.company?.branches?.map(
                              (b) =>
                                b?.branch_id === s?.destination_id && b?.name
                            )}
                          </div>
                        </td>
                        {/* receiver */}
                        <td>
                          <div className={styles.moveDown}>
                            {company_detail?.company?.operators?.map(
                              (o) =>
                                o.operator_id === s?.destination_op_id &&
                                `${o.name} (${o.operator_id.split("-")[0]}-${
                                  o.operator_id.split("-")[1]
                                })`
                            )}
                          </div>
                        </td>
                        {/* arrival */}
                        <td className={styles.departure_arrival}>
                          {
                            convertirHoraLocal(
                              s?.arrival,
                              company_detail?.company?.gmt
                            ).split("  ")[0]
                          }
                          <br />
                          {
                            convertirHoraLocal(
                              s?.arrival,
                              company_detail?.company?.gmt
                            ).split("  ")[1]
                          }
                        </td>
                        {/* status */}
                        <td>
                          {s?.status === "SUCCESSFUL" && (
                            <img
                              alt=""
                              src={rombo_succes}
                              className={styles.rombo}
                            />
                          )}
                          {s?.status === "UNCERTAIN" && (
                            <img
                              alt=""
                              src={rombo_uncert}
                              className={styles.rombo}
                            />
                          )}
                          {s?.status === "FAILED" && (
                            <img
                              alt=""
                              src={rombo_fail}
                              className={styles.rombo}
                            />
                          )}
                        </td>
                        {/* reports */}
                        <td>
                          {" "}
                          <button
                            onClick={(e) => handleDownload(e, s?.shipment_id)}
                            style={{
                              border: "none",
                              background: "none",
                              width: "50%",
                            }}
                          >
                            <AiOutlineDownload size="2vw" />
                            <br />
                            PDF
                          </button>
                          <button
                            onClick={(e) => downloadCsv2(e, s)}
                            style={{
                              border: "none",
                              background: "none",
                              width: "50%",
                            }}
                          >
                            <AiOutlineDownload size="2vw" />
                            <br />
                            CSV
                          </button>
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            name="shipsTocompare"
                            onChange={(e) => {
                              handleCheck(e);
                              e.stopPropagation();
                            }}
                            value={s?.shipment_id}
                            className={styles.checkBox}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="11" style={{ border: "none" }}>
                          <Collapse
                            isOpen={selectedRows.includes(s.shipment_id)}
                          >
                           <DropdownShipments 
                          shipment_id={s.shipment_id}
                          //expanded={expanded}
                          index={index}
                          gmt={company_detail.company.gmt}/>
                          </Collapse>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className={styles.message1}>No results found</div>
          )}
        </div>
      )}
      {/* pagination */}
      {filtersResult?.shipments?.total > 0 && (
        <CardFooter
          style={{
            display: "flex",
            justifyContent: "flex-end",
            overflowX: "auto", // Desplazamiento horizontal
            backgroundColor: "transparent",
            border: "none",
          }}
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

              {renderPaginationItems()}

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
      )}
    </div>
  );
};

export default Shipments;
