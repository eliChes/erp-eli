import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../assets/global/url";
import "../../assets/global/style.css";
import ReactLoading from 'react-loading';
import NoData from '../../assets/image/NoData.png';
import NoAccess from '../../assets/image/NoAccess.png';
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/react-style.css";
import Form from "react-bootstrap/Form";
import subwarehouse from "../../assets/global/subwarehouse";
import swal from "sweetalert";
import Button from "react-bootstrap/Button";
import {
  ArrowCircleLeft
} from "@phosphor-icons/react";

const ApprovalIssuance = ({ setActiveTab, authrztn }) => {

  const { id } = useParams();
  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };

  const [fetchProduct, setFetchProduct] = useState([]);
  const [fetchAssembly, setFetchAssembly] = useState([]);
  const [fetchSpare, setFetchSpare] = useState([]);
  const [fetchSubpart, setFetchSubpart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [fromSite, setFromSite] = useState();
  const [issuedTo, setIssuedTo] = useState();
  const [withAccountability, setWithAccountability] = useState();
  const [accountabilityRefcode, setAccountabilityRefcode] = useState();
  const [serialNumber, setSerialNumber] = useState();
  const [jobOrderRefcode, setJobOrderRefcode] = useState();
  const [receivedBy, setReceivedBy] = useState();
  const [transportedBy, setTransportedBy] = useState();
  const [mrs, setMrs] = useState();
  const [remarks, setRemarks] = useState();
  const [IssueStatus, setIssueStatus] = useState();

  const navigate = useNavigate()


  useEffect(() => {
    const delay = setTimeout(() => {
    axios.get(BASE_URL + '/issuance/approvalIssuance', {
      params: {
        id: id
      }
    })
    .then(res => {
      setFromSite(res.data[0].from_site);
      setIssuedTo(res.data[0].cost_center.name);
      setWithAccountability(res.data[0].with_accountability)
      setAccountabilityRefcode(res.data[0].accountability_refcode)
      setSerialNumber(res.data[0].serial_number)
      setJobOrderRefcode(res.data[0].job_order_refcode)
      setReceivedBy(res.data[0].received_by)
      setTransportedBy(res.data[0].transported_by)
      setMrs(res.data[0].mrs)
      setRemarks(res.data[0].remarks)
      setIssueStatus(res.data[0].status)
      setIsLoading(false);
    })
    .catch((err) => {
      console.log(err);
      setIsLoading(false);
    });
  }, 1000);

return () => clearTimeout(delay);
}, [id]);

   //get MasterList
   const [master, setMaster] = useState([]);
   useEffect(() => {
     axios
       .get(BASE_URL + "/masterList/masterTable")
       .then((response) => {
        setMaster(response.data);
       })
       .catch((error) => {
         console.error("Error fetching roles:", error);
       });
   }, []);


   useEffect(() => { 
    axios.get(BASE_URL + '/issuance/fetchApprove',{
      params: {
        id
      }
    })
        .then(res => {
          setFetchProduct(res.data.product);
          setFetchAssembly(res.data.assembly);
          setFetchSpare(res.data.spare);
          setFetchSubpart(res.data.subpart);
        })
        .catch(err => console.log(err));
  }, []);

  const handleApprove = () => {
    swal({
      title: 'Are you sure?',
      text: 'This will move as approved request',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((confirmed) => {
      if (confirmed) {
        axios.post(BASE_URL + '/issuance/approval', null,{
         params:{
            id,
            fromSite,
            fetchProduct,
            fetchAssembly,
            fetchSpare,
            fetchSubpart
         }
        })
          .then(() => {
            swal('Success!', 'You successfully approved this request', 'success')
              .then(() => {
                navigate('/inventory')
              });
          })
          .catch(err => {
            console.log(err);
            swal('Error!', 'Something went wrong. Please try again.', 'error');
          });
      }
    });
  }

  const handleReject = () => {
    swal({
      title: 'Are you sure?',
      text: 'This will move as reject this request',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((confirmed) => {
      if (confirmed) {
        axios.post(BASE_URL + '/issuance/reject', null,{
         params:{
            id
         }
        })
          .then(() => {
            swal('Success!', 'You successfully rejected this request', 'success')
              .then(() => {
                navigate('/inventory')
              });
          })
          .catch(err => {
            console.log(err);
            swal('Error!', 'Something went wrong. Please try again.', 'error');
          });
      }
    });
  }


  return (
    <div className="main-of-containers">

      <div className="right-of-main-containers">
              {isLoading ? (
                <div className="loading-container">
                  <ReactLoading className="react-loading" type={'bubbles'}/>
                  Loading Data...
                </div>
              ) : (
        authrztn.includes('Inventory - Approval') ? (
        <div className="right-body-contentss">
                    <div className="arrowandtitle">
              <Link to="/inventory">
                  <ArrowCircleLeft size={45} color="#60646c" weight="fill" />
              </Link>
                  <div className="titletext">
                      <h1>Approval Issuance</h1>
                  </div>
              </div>

            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
              }}>
              Issuance Info
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "11.5rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>

            <div className="row mt-3">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>From: </Form.Label>
                  <Form.Control
                    type="text"
                    style={{ height: "40px", fontSize: "15px" }}
                    value={fromSite}
                    readOnly
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Issued to:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    style={{ height: "40px", fontSize: "15px" }}
                    value={issuedTo}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-6"></div>
              <div className="col-6">
                <Form.Check
                  type="checkbox"
                  label="With Accountability"
                  style={{ fontSize: "15px" }}
                  checked={withAccountability === 'true'}
                  disabled
                  // onChange={(e) => setWithAccountability(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Accountability Refcode:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Refcode..."
                    style={{ height: "40px", fontSize: "15px" }}
                    value={accountabilityRefcode}
                    readOnly
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Serial Number:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Serial Number..."
                    style={{ height: "40px", fontSize: "15px" }}
                    value={serialNumber}
                    readOnly
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Job Order Refcode:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Job Order Refcode..."
                    style={{ height: "40px", fontSize: "15px" }}
                    value={jobOrderRefcode}
                    readOnly
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Received by:{" "}
                  </Form.Label>
                  <Form.Select
                    style={{ height: "40px", fontSize: "15px" }}
                    value={receivedBy}
                    disabled
                    required>
                    <option value="">Select Employee</option>
                    {master.map((master) => (
                      <option key={master.col_id} value={master.col_id}>
                        {master.col_Fname}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Transported by:{" "}
                  </Form.Label>
                  <Form.Select
                    style={{ height: "40px", fontSize: "15px" }}
                    value={transportedBy}
                    disabled
                    required>
                    <option value="">Select Employee</option>
                    {master.map((master) => (
                      <option key={master.col_id} value={master.col_id}>
                        {master.col_Fname}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-2">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>MRS #: </Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Input #"
                    style={{ height: "40px", fontSize: "15px" }}
                    value={mrs}
                    readOnly
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px" }}>Remarks: </Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter Remarks"
                  style={{ height: "100px", fontSize: "15px" }}
                  value={remarks}
                  readOnly
                />
              </Form.Group>
            </div>

            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "30px",
              }}>
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "85%",
                  left: "0rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>
            <div className="supplier-table">
              <div className="table-containss">
                <div className="main-of-all-tables">
                  <table >
                    <thead>
                      <tr>
                        <th className="tableh">Product Code</th>
                        <th className="tableh">Product Name</th>
                        <th className="tableh">UOM</th>
                        <th className="tableh">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>

                      {fetchProduct.map((data, i) => (
                        <tr key={i}>
                            <td>{data.product.product_code }</td>
                            <td>{data.product.product_name }</td>
                            <td>{data.product.product_unitMeasurement }</td>
                            <td>{data.quantity}</td>                         
                        </tr>
                        ))}

                      {fetchAssembly.map((data, i) => (
                        <tr key={i}>
                            <td>{data.assembly.assembly_code}</td>
                            <td>{data.assembly.assembly_name}</td>
                            <td>{data.assembly.assembly_unitMeasurement}</td>
                            <td>{data.quantity}</td>                         
                        </tr>
                        ))}

                        {fetchSpare.map((data, i) => (
                          <tr key={i}>
                              <td>{data.sparePart.spareParts_code}</td>
                              <td>{data.sparePart.spareParts_name}</td>
                              <td>{data.sparePart.spareParts_unitMeasurement}</td>
                              <td>{data.quantity}</td>                         
                          </tr>
                        ))}

                        {fetchSubpart.map((data, i) => (
                          <tr key={i}>
                              <td>{data.subPart.subPart_code}</td>
                              <td>{data.subPart.subPart_name}</td>
                              <td>{data.subPart.subPart_unitMeasurement}</td>
                              <td>{data.quantity}</td>                         
                          </tr>
                        ))}
                      
                    </tbody>
                  </table>
                  {IssueStatus !== "Approved" && IssueStatus !== "Rejected" && (
                  <div className="save-cancel">
                    <Button
                        type="submit"
                        className="btn btn-success"
                        size="md"
                        style={{ fontSize: "20px", margin: "0px 5px" }}
                        onClick={() => handleApprove()}
                    >
                        Approve
                    </Button>
                    <Button
                        type="button"
                        className="btn btn-danger"
                        size="md"
                        style={{ fontSize: "20px", margin: "0px 5px" }}
                        onClick={() => handleReject()}
                    >
                        Reject
                  </Button>
                </div>
                  )}
              </div>


                
              </div>
            </div>
        </div>
        ) : (
          <div className="no-access">
            <img src={NoAccess} alt="NoAccess" className="no-access-img"/>
            <h3>
              You don't have access to this function.
            </h3>
          </div>
        )
              )}
      </div>
    </div>
  );
}

export default ApprovalIssuance;
