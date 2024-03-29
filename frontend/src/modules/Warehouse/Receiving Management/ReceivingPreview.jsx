import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../Sidebar/sidebar";
import "../../../assets/global/style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import NoData from "../../../assets/image/NoData.png";
import SBFLOGO from "../../../assets/image/sbflogo-noback.png";
import NoAccess from "../../../assets/image/NoAccess.png";
import "../../styles/react-style.css";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import warehouse from "../../../assets/global/warehouse";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  ArrowCircleLeft,
  Upload,
  Circle,
  ArrowUUpLeft,
} from "@phosphor-icons/react";
import * as $ from "jquery";
import axios from "axios";
import BASE_URL from "../../../assets/global/url";
import swal from "sweetalert";
import { pink } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";
import { fontStyle } from "@mui/system";
import Carousel from "react-bootstrap/Carousel";
import { jwtDecode } from "jwt-decode";

function ReceivingPreview({ authrztn }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const [prNumber, setPrNumber] = useState();
  const [usedFor, setUsedFor] = useState();
  const [department, setDepartment] = useState();
  const [requestedBy, setRequestedBy] = useState();
  const [remarks, setRemarks] = useState();
  const [status, setStatus] = useState();
  const [dateCreated, setDateCreated] = useState();
  const [poNum, setPoNum] = useState();
  const [supplierName, setSupplierName] = useState()
  const [supplierCode, setSupplierCode] = useState()
  const [supplierTerms, setSupplierTerms] = useState()
  const [requestPr, setRequestPr] = useState()

  
  const [products, setproducts] = useState([]);
  const [assembly, setassembly] = useState([]);
  const [spare, setspare] = useState([]);
  const [subpart, setsubpart] = useState([]);

  const [userId, setuserId] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };

  const decodeToken = () => {
    var token = localStorage.getItem("accessToken");
    if (typeof token === "string") {
      var decoded = jwtDecode(token);
      setuserId(decoded.id);
    }
  };

  useEffect(() => {
    decodeToken();
  }, []);

  const exportToPDF = () => {
    const input = document.getElementById('modal-body'); // Assuming you give an id to your Modal.Body container
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
  
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
  
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
  
        pdf.save('modal_content.pdf');
      });
  };

  // -------------------- fetch data value --------------------- //
  useEffect(() => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/receiving/primaryData", {
          params: {
            id: id,
          },
        })
        .then((res) => {
          setPrNumber(res.data.primary.purchase_req.pr_num);
          setUsedFor(res.data.primary.purchase_req.used_for);
          setRemarks(res.data.primary.purchase_req.remarks);
          setDepartment(
            res.data.primary.purchase_req.masterlist.department.department_name
          );
          setRequestedBy(res.data.primary.purchase_req.masterlist.col_Fname);
          setStatus(res.data.primary.status);
          setDateCreated(res.data.primary.createdAt);
          setPoNum(res.data.primary.po_id);
          setRequestPr(res.data.primary.purchase_req.createdAt)
          setSupplierCode(res.data.product[0].purchase_req_canvassed_prd.product_tag_supplier.supplier.supplier_code)
          setSupplierName(res.data.product[0].purchase_req_canvassed_prd.product_tag_supplier.supplier.supplier_name)
          setSupplierTerms(res.data.product[0].purchase_req_canvassed_prd.product_tag_supplier.supplier.supplier_terms)
          setproducts(res.data.product);
          setassembly(res.data.assembly);
          setspare(res.data.spare);
          setsubpart(res.data.subpart);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

  //date format
  function formatDatetime(datetime) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(datetime).toLocaleString("en-US", options);
  }
  function formatDatetime(datetime) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(datetime).toLocaleString("en-US", options);
  }


  // currentDAte
  const currentDate = new Date();
  
  // Options for formatting the date and time
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Manila' // Set time zone to Manila, Philippines
  };
  
  // Format the date and time according to the options
  const formattedDate = currentDate.toLocaleDateString('en-PH', options);

  // useEffect(() => {
  //   // Initialize DataTable when role data is available
  //   if ($("#order-listing").length > 0 && Transaction_prd.length > 0) {
  //     $("#order-listing").DataTable();
  //   }
  // }, [Transaction_prd]);

  return (
    <div className="main-of-containers">
      {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
      <div className="right-of-main-containers">
        {isLoading ? (
          <div className="loading-container">
            <ReactLoading className="react-loading" type={"bubbles"} />
            Loading Data...
          </div>
        ) : authrztn.includes("Receiving - View") ? (
          <div className="right-body-contents-a">
            <Row>
              <Col>
                <div
                  className="create-head-back"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Link
                    style={{ fontSize: "1.5rem" }}
                    to="/receivingManagement"
                  >
                    <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                  </Link>
                  <h1>Receiving Management Preview</h1>
                </div>
              </Col>
            </Row>

            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
                fontFamily: "Poppins, Source Sans Pro",
              }}
            >
              Purchase Request Details
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "26rem",
                  transform: "translateY(-50%)",
                }}
              ></span>
            </div>

            <div className="row">
              <div className="col-6 ">
                <Form.Label
                  style={{
                    fontSize: "20px",
                    fontFamily: "Poppins, Source Sans Pro",
                  }}
                >
                  Information{" "}
                </Form.Label>
                <div className="receive-container">
                  <div className="row">
                    <div className="col-6">
                      <div className="receiving_list d-flex flex-direction-column">
                        <ul>
                          <li>
                            <p>{`PR #: ${prNumber}`}</p>
                          </li>
                          <li>{`Requested by: ${requestedBy}`}</li>
                          <li>{`Department: ${department}`}</li>
                          <li>{`To be used for: ${usedFor}`}</li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="receiving_list_right d-flex flex-direction-column">
                        <ul>
                          <li>
                            <p>{`Received date: ${formatDatetime(
                              dateCreated
                            )}`}</p>
                          </li>

                          <li>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Circle
                                weight="fill"
                                size={20}
                                color="green"
                                style={{ margin: "10px" }}
                              />
                              <p style={{ margin: "10px", fontSize: 24 }}>
                                {status}
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label
                    style={{
                      fontSize: "20px",
                      fontFamily: "Poppins, Source Sans Pro",
                    }}
                  >
                    Remarks{" "}
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter details name"
                    value={remarks}
                    as="textarea"
                    readOnly
                    rows={3}
                    style={{
                      fontFamily: "Poppins, Source Sans Pro",
                      fontSize: "16px",
                      height: "225px",
                      maxHeight: "225px",
                      resize: "none",
                      overflowY: "auto",
                    }}
                  />
                </Form.Group>
              </div>
            </div>

            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
                fontFamily: "Poppins, Source Sans Pro",
              }}
            >
              Purchase Order No. {poNum}
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "30rem",
                  transform: "translateY(-50%)",
                }}
              ></span>
            </div>

            <div className="table-containss">
              <div className="main-of-all-tables">
                <table className="table-hover" id="order-listing">
                  <thead>
                    <tr>
                      <th className="tableh">Product Code</th>
                      <th className="tableh">Product Name</th>
                      <th className="tableh">Unit of Measurement</th>
                      <th className="tableh">Quantity Received</th>
                      <th className="tableh">Price</th>
                      <th className="tableh">Freight Cost</th>
                      <th className="tableh">Duties & Customs Cost </th>
                    </tr>
                  </thead>
                  {products.length > 0 ||
                  assembly > 0 ||
                  spare > 0 ||
                  subpart > 0 ? (
                    <tbody>
                      {products.map((data, i) => (
                        <tr key={i}>
                          <td>
                            {
                              data.purchase_req_canvassed_prd
                                .product_tag_supplier.product.product_code
                            }
                          </td>
                          <td>
                            {
                              data.purchase_req_canvassed_prd
                                .product_tag_supplier.product.product_name
                            }
                          </td>
                          <td>
                            {
                              data.purchase_req_canvassed_prd
                                .product_tag_supplier.product
                                .product_unitMeasurement
                            }
                          </td>
                          <td>{data.received_quantity}</td>

                          <td>
                            {
                              data.purchase_req_canvassed_prd
                                .product_tag_supplier.product_price
                            }
                          </td>
                          <td>{data.receiving_po.freight_cost}</td>
                          <td>
                            {data.receiving_po.customFee === null
                              ? 0
                              : data.receiving_po.customFee}
                          </td>
                        </tr>
                      ))}

                      {assembly.map((data, i) => (
                        <tr key={i}>
                          <td>
                            {
                              data.purchase_req_canvassed_asmbly
                                .assembly_supplier.assembly.assembly_code
                            }
                          </td>
                          <td>
                            {
                              data.purchase_req_canvassed_asmbly
                                .assembly_supplier.assembly.assembly_name
                            }
                          </td>
                          <td>
                            {
                              data.purchase_req_canvassed_asmbly
                                .assembly_supplier.assembly
                                .assembly_unitMeasurement
                            }
                          </td>
                          <td>{data.received_quantity}</td>

                          <td>
                            {
                              data.purchase_req_canvassed_asmbly
                                .assembly_supplier.supplier_price
                            }
                          </td>
                          <td>{data.receiving_po.freight_cost}</td>
                          <td>
                            {data.receiving_po.customFee === null
                              ? 0
                              : data.receiving_po.customFee}
                          </td>
                        </tr>
                      ))}
                      {spare.map((data, i) => (
                        <tr key={i}>
                          <td>
                            {
                              data.purchase_req_canvassed_spare
                                .sparepart_supplier.sparePart.spareParts_code
                            }
                          </td>
                          <td>
                            {
                              data.purchase_req_canvassed_spare
                                .sparepart_supplier.sparePart.spareParts_name
                            }
                          </td>
                          <td>
                            {
                              data.purchase_req_canvassed_spare
                                .sparepart_supplier.sparePart
                                .spareParts_unitMeasurement
                            }
                          </td>
                          <td>{data.received_quantity}</td>

                          <td>
                            {
                              data.purchase_req_canvassed_spare
                                .sparepart_supplier.supplier_price
                            }
                          </td>
                          <td>{data.receiving_po.freight_cost}</td>
                          <td>
                            {data.receiving_po.customFee === null
                              ? 0
                              : data.receiving_po.customFee}
                          </td>
                        </tr>
                      ))}

                      {subpart.map((data, i) => (
                        <tr key={i}>
                          <td>
                            {
                              data.purchase_req_canvassed_subpart
                                .subpart_supplier.subPart.subPart_code
                            }
                          </td>
                          <td>
                            {
                              data.purchase_req_canvassed_subpart
                                .subpart_supplier.subPart.subPart_name
                            }
                          </td>
                          <td>
                            {
                              data.purchase_req_canvassed_subpart
                                .subpart_supplier.subPart
                                .subPart_unitMeasurement
                            }
                          </td>
                          <td>{data.received_quantity}</td>

                          <td>
                            {
                              data.purchase_req_canvassed_subpart
                                .subpart_supplier.supplier_price
                            }
                          </td>
                          <td>{data.receiving_po.freight_cost}</td>
                          <td>
                            {data.receiving_po.customFee === null
                              ? 0
                              : data.receiving_po.customFee}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <div className="no-data">
                      <img src={NoData} alt="NoData" className="no-data-img" />
                      <h3>No Data Found</h3>
                    </div>
                  )}
                </table>
              </div>

              <Button
                variant="warning"
                type="submit"
                size="lg"
                className="fs-5 lg"
                onClick={(e) => setShow(true)}
              >
                Preview
              </Button>
            </div>
          </div>
        ) : (
          <div className="no-access">
            <img src={NoAccess} alt="NoAccess" className="no-access-img" />
            <h3>You don't have access to this function.</h3>
          </div>
        )}
      </div>

      <Modal show={show} onHide={handleClose} backdrop="static" size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Generation of report</Modal.Title>
        </Modal.Header>
        <Modal.Body id="modal-body">
          <div className="receipt-content">
            <div className="row">
              <div className="col-9">
                <div className="receipt-header">
                  <div className="sbflogoes">
                    <img src={SBFLOGO} alt="" />
                  </div>
                  <div className="sbftexts">
                    <span>SBF PHILIPPINES DRILLING </span>
                    <span>RESOURCES CORPORATION</span>
                    <span>Padigusan, Sta.Cruz, Rosario, Agusan del sur</span>
                    <span>Landline No. 0920-949-3373</span>
                    <span>Email Address: sbfpdrc@gmail.com</span>
                  </div>
                  <div className="spacesbf"></div>
                </div>
              </div>

              <div className="col-3">
                <li className="fs-3">{`Date: ${formattedDate}`} </li>
                <li className="fs-3">{`Request Date: ${ formatDatetime(requestPr)}`} </li>
              </div>
            </div>

            <div className="reportBody">
              <div
                className="bodyHead  w-100"
                style={{
                  textAlign: "center",
                  fontSize: "22px",
                  fontFamily: "Poppins, Source Sans Pro",
                  letterSpacing: "3px",
                }}
              >
                <li>PO Receiving Report</li>
                <li>{`PO Number: ${poNum}`} </li>
                <li>Receipts shown are the total for this Purchase Order.</li>
              </div>
              <div className="row mt-5">
                <div
                  className="col-6"
                  style={{
                    fontFamily: "Poppins, Source Sans Pro",
                    fontSize: "13px",
                    letterSpacing: "2px",
                    fontWeight: "600",
                  }}
                >
                  <li>{`Vendor Code: ${supplierCode}`} </li>
                  <li>{`Vendor: ${supplierName}`}</li>
                  <li>{`Terms: ${supplierTerms}`}</li>
                </div>
                <div
                  className="col-6"
                  style={{
                    fontFamily: "Poppins, Source Sans Pro",
                    fontSize: "13px",
                    letterSpacing: "2px",
                    fontWeight: "600",
                  }}
                >
                  <div className="right" style={{ float: "right" }}>
                    <li>{`PR Number: ${prNumber}`}</li>
                    <li>PO Date: </li>
                  </div>
                </div>
              </div>

              <div className="content mt-5">
                <div className="table-containss">
                  <div className="main-of-all-tables">
                    <table className="table-hover" id="order-listing">
                      <thead>
                        <tr>
                          <th className="tableh">Code</th>
                          <th className="tableh">Product</th>
                          <th className="tableh">UOM</th>
                          <th className="tableh">Initial Received</th>
                          <th className="tableh">Received</th>
                          <th className="tableh">Price</th>
                          <th className="tableh">Freight Cost</th>
                          <th className="tableh">Duties & Customs Cost </th>
                        </tr>
                      </thead>
                      {products.length > 0 ||
                      assembly > 0 ||
                      spare > 0 ||
                      subpart > 0 ? (
                        <tbody>
                          {products.map((data, i) => (
                            <tr key={i}>
                              <td>
                                {
                                  data.purchase_req_canvassed_prd
                                    .product_tag_supplier.product.product_code
                                }
                              </td>
                              <td>
                                {
                                  data.purchase_req_canvassed_prd
                                    .product_tag_supplier.product.product_name
                                }
                              </td>
                              <td>
                                {
                                  data.purchase_req_canvassed_prd
                                    .product_tag_supplier.product
                                    .product_unitMeasurement
                                }
                              </td>
                              <td>{data.transfered_quantity}</td>
                              <td>{data.received_quantity}</td>
                              <td>
                                {
                                  data.purchase_req_canvassed_prd
                                    .product_tag_supplier.product_price
                                }
                              </td>
                              <td>{data.receiving_po.freight_cost}</td>
                              <td>
                                {data.receiving_po.customFee === null
                                  ? 0
                                  : data.receiving_po.customFee}
                              </td>
                            </tr>
                          ))}

                          {assembly.map((data, i) => (
                            <tr key={i}>
                              <td>
                                {
                                  data.purchase_req_canvassed_asmbly
                                    .assembly_supplier.assembly.assembly_code
                                }
                              </td>
                              <td>
                                {
                                  data.purchase_req_canvassed_asmbly
                                    .assembly_supplier.assembly.assembly_name
                                }
                              </td>
                              <td>
                                {
                                  data.purchase_req_canvassed_asmbly
                                    .assembly_supplier.assembly
                                    .assembly_unitMeasurement
                                }
                              </td>
                              <td>{data.transfered_quantity}</td>
                              <td>{data.received_quantity}</td>
                              <td>
                                {
                                  data.purchase_req_canvassed_asmbly
                                    .assembly_supplier.supplier_price
                                }
                              </td>
                              <td>{data.receiving_po.freight_cost}</td>
                              <td>
                                {data.receiving_po.customFee === null
                                  ? 0
                                  : data.receiving_po.customFee}
                              </td>
                            </tr>
                          ))}
                          {spare.map((data, i) => (
                            <tr key={i}>
                              <td>
                                {
                                  data.purchase_req_canvassed_spare
                                    .sparepart_supplier.sparePart
                                    .spareParts_code
                                }
                              </td>
                              <td>
                                {
                                  data.purchase_req_canvassed_spare
                                    .sparepart_supplier.sparePart
                                    .spareParts_name
                                }
                              </td>
                              <td>
                                {
                                  data.purchase_req_canvassed_spare
                                    .sparepart_supplier.sparePart
                                    .spareParts_unitMeasurement
                                }
                              </td>
                              <td>{data.transfered_quantity}</td>
                              <td>{data.received_quantity}</td>
                              <td>
                                {
                                  data.purchase_req_canvassed_spare
                                    .sparepart_supplier.supplier_price
                                }
                              </td>
                              <td>{data.receiving_po.freight_cost}</td>
                              <td>
                                {data.receiving_po.customFee === null
                                  ? 0
                                  : data.receiving_po.customFee}
                              </td>
                            </tr>
                          ))}

                          {subpart.map((data, i) => (
                            <tr key={i}>
                              <td>
                                {
                                  data.purchase_req_canvassed_subpart
                                    .subpart_supplier.subPart.subPart_code
                                }
                              </td>
                              <td>
                                {
                                  data.purchase_req_canvassed_subpart
                                    .subpart_supplier.subPart.subPart_name
                                }
                              </td>
                              <td>
                                {
                                  data.purchase_req_canvassed_subpart
                                    .subpart_supplier.subPart
                                    .subPart_unitMeasurement
                                }
                              </td>
                              <td>{data.transfered_quantity}</td>
                              <td>{data.received_quantity}</td>
                              <td>
                                {
                                  data.purchase_req_canvassed_subpart
                                    .subpart_supplier.supplier_price
                                }
                              </td>
                              <td>{data.receiving_po.freight_cost}</td>
                              <td>
                                {data.receiving_po.customFee === null
                                  ? 0
                                  : data.receiving_po.customFee}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      ) : (
                        <div className="no-data">
                          <img
                            src={NoData}
                            alt="NoData"
                            className="no-data-img"
                          />
                          <h3>No Data Found</h3>
                        </div>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
        <Button onClick={exportToPDF}>Export to PDF</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReceivingPreview;
