import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../assets/global/url";
import Sidebar from "../Sidebar/sidebar";
import ReactLoading from 'react-loading';
import NoData from '../../assets/image/NoData.png';
import NoAccess from '../../assets/image/NoAccess.png';
import "../../assets/global/style.css";
import { Link, useNavigate } from "react-router-dom";
import "../styles/react-style.css";
import Form from "react-bootstrap/Form";
// import subwarehouse from "../../assets/global/subwarehouse";
import swal from "sweetalert";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import {
  ArrowCircleLeft
} from "@phosphor-icons/react";

const CreateIssuance = ({ setActiveTab, authrztn }) => {


  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };

  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [showDropdown, setShowDropdown] = useState(false);
  const [fetchProduct, setFetchProduct] = useState([]);
  const [addProduct, setAddProduct] = useState([]); // para sa pag ng product na e issue sa table
  const [addProductbackend, setAddProductbackend] = useState([]); // para sa pag ng product na e issue sa backend
  const [quantityInputs, setQuantityInputs] = useState({});
  const [fetchwarehouse, setFetchwarehouse] = useState([]);

  // assembly
  const [fetchAssembly, setFetchAssembly] = useState([]);

  //spare part
  const [fetchSpare, setFetchSpare] = useState([]);

  //sub-part
  const [fetchSubpart, setFetchSubpart] = useState([]);

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

  // React.useEffect(() => {
  //     $(document).ready(function () {
  //         $('#order-listing').DataTable();
  //     });
  //     }, []);

  const handleAddProdClick = () => {
    // para pag display ng drop down for add product
    setShowDropdown(true);
  };

  const handleSelectChange_Prod = (selectedOptions) => {
    setAddProduct(selectedOptions);
  };

  const handleQuantityChange = (
    inputValue,
    productValue,
    product_quantity_available
  ) => {
    // Remove non-numeric characters and limit length to 10
    const cleanedValue = inputValue.replace(/\D/g, "").substring(0, 10);
  
    // Convert cleanedValue to a number
    const numericValue = parseInt(cleanedValue, 10);
  
    // Create a variable to store the corrected value
    let correctedValue = cleanedValue;
  
    // Check if the numericValue is greater than the available quantity
    if (numericValue > product_quantity_available) {
      // If greater, set the correctedValue to the maximum available quantity
      correctedValue = product_quantity_available.toString();
      
      swal({
        icon: "error",
        title: "Input value exceed",
        text: "Please enter a quantity within the available limit.",
      });

    }
  
    setQuantityInputs((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        [productValue]: correctedValue,
      };
  
      // Use the updatedInputs directly to create the serializedProducts array
      const serializedProducts = addProduct.map((product) => ({
        quantity: updatedInputs[product.value] || "",
        type: product.type,
        inventory_id: product.inventory_id,
        code: product.code,
        name: product.name,
        quantity_available: product.quantity_available,
        desc: product.desc,
      }));
  
      setAddProductbackend(serializedProducts);
      // console.log("Selected Products:", serializedProducts);
  
      // Return the updatedInputs to be used as the new state
      return updatedInputs;
    });
  };
  
  
  
  //get supplier product
  useEffect(() => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/inventory/fetchToIssueProduct")
      .then((res) => {
        setFetchProduct(res.data)
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
    }, 1000);

return () => clearTimeout(delay);
}, []);

  //get supplier Assembly
  useEffect(() => {
    axios
      .get(BASE_URL + "/inventory/fetchToIssueAssembly")
      .then((res) => setFetchAssembly(res.data))
      .catch((err) => console.log(err));
  }, []);

  //get supplier Spare
  useEffect(() => {
    axios
      .get(BASE_URL + "/inventory/fetchToIssueSpare")
      .then((res) => setFetchSpare(res.data))
      .catch((err) => console.log(err));
  }, []);

  //get supplier Subpart
  useEffect(() => {
    axios
      .get(BASE_URL + "/inventory/fetchToIssueSubpart")
      .then((res) => setFetchSubpart(res.data))
      .catch((err) => console.log(err));
  }, []);

  //get warehouse
  useEffect(() => {
    axios
    .get(BASE_URL + "/warehouses/fetchtableWarehouses")
    .then((res) => setFetchwarehouse(res.data))
    .catch((err) => console.log(err))
  }, []);

  //get MasterList
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    axios
      .get(BASE_URL + "/masterList/masterTable")
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  //get Cost Center
  const [costCenter, setCostCenter] = useState([]);
  useEffect(() => {
    axios
      .get(BASE_URL + "/costCenter/getCostCenter")
      .then((response) => {
        setCostCenter(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  // ----------------------------------Start Add new Issuance------------------------------//
  const handleFormChangeTransported = (event) => {
    setTransportedBy(event.target.value);
  };
  const handleFormChangeReceived = (event) => {
    setReceivedBy(event.target.value);
  };
  const handleFormChangeIssuedTo = (event) => {
    setIssuedTo(event.target.value);
  };
  const handleFormChangeWarehouse = (event) => {
    setFromSite(event.target.value);
  };

  const add = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill the red text fields",
      });
    } else {
      // const formData = new FormData();
      //   formData.append('fromSite', fromSite);
      //   formData.append('issuedTo', issuedTo);
      //   formData.append('withAccountability', withAccountability);
      //   formData.append('accountabilityRefcode', accountabilityRefcode);
      //   formData.append('serialNumber', serialNumber);
      //   formData.append('jobOrderRefcode', jobOrderRefcode);
      //   formData.append('receivedBy', receivedBy);
      //   formData.append('transportedBy', transportedBy);
      //   formData.append('mrs', mrs);
      //   formData.append('remarks', remarks);
      //   formData.append('addProductbackend', addProductbackend);

      // axios
      // .post(BASE_URL + '/issuance/create',
      //   {
      //     fromSite,issuedTo,withAccountability,accountabilityRefcode,serialNumber,
      //     jobOrderRefcode,receivedBy,transportedBy,mrs,remarks, addProductbackend
      //   })
      fetch(BASE_URL + "/issuance/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromSite,
          issuedTo,
          withAccountability,
          accountabilityRefcode,
          serialNumber,
          jobOrderRefcode,
          receivedBy,
          transportedBy,
          mrs,
          remarks,
          addProductbackend: addProductbackend,
        }),
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          SuccessInserted(res);
        } else if (res.status === 201) {
          Duplicate_Message();
        } else {
          ErrorInserted();
        }
      });
    }
    setValidated(true); //for validations
  };
  // ----------------------------------End Add new Issuance------------------------------//

  // ----------------------------------Validation------------------------------//
  const SuccessInserted = (res) => {
    swal({
      title: "Issuance Created",
      text: "The Issuance has been added successfully",
      icon: "success",
      button: "OK",
    }).then(() => {
      navigate("/inventory");
    });
  };
  const Duplicate_Message = () => {
    swal({
      title: "Issuance Already Exist",
      text: "",
      icon: "error",
      button: "OK",
    });
  };
  const ErrorInserted = () => {
    swal({
      title: "Something went wrong",
      text: "Please Contact our Support",
      icon: "error",
      button: "OK",
    });
  };
  // const handleQuantityChange = (e, productValue) => {
  //   const updatedProducts = addProduct.map((product) => {
  //     if (product.value === productValue) {
  //       return { ...product, quantity: e.target.value };
  //     }
  //     return product;
  //   });

  //   setAddProductbackend(updatedProducts);
  //   console.log('to backend' + updatedProducts)
  // };

  // ----------------------------------End Validation------------------------------//

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
              {isLoading ? (
                <div className="loading-container">
                  <ReactLoading className="react-loading" type={'bubbles'}/>
                  Loading Data...
                </div>
              ) : (
        authrztn.includes('Inventory - Add') ? (
        <div className="right-body-contentss">
          <div className="arrowandtitle">
              <Link to="/inventory">
                  <ArrowCircleLeft size={45} color="#60646c" weight="fill" />
              </Link>
                  <div className="titletext">
                      <h1>Create Issuance</h1>
                  </div>
              </div>
          <Form noValidate validated={validated} onSubmit={add}>
            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
                fontFamily: "Poppins, Source Sans Pro"
              }}>
              Issuance Info
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "15rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>

            <div className="row mt-3">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>From: </Form.Label>
                  <Form.Select
                    style={{ height: "40px", fontSize: "15px" }}
                    required
                    onChange={handleFormChangeWarehouse}
                    defaultValue="">
                    <option disabled selected value="">
                      Select Site
                    </option>
                    {fetchwarehouse.map((ware, index) => (
                      <option key={index} value={ware.id}>
                        {ware.warehouse_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Issued to:{" "}
                  </Form.Label>
                  <Form.Select
                    style={{ height: "40px", fontSize: "15px" }}
                    required
                    onChange={handleFormChangeIssuedTo}>
                    <option value="">Select Cost Center</option>
                    {costCenter.map((costCenter) => (
                      <option key={costCenter.id} value={costCenter.id}>
                        {costCenter.name}
                      </option>
                    ))}
                  </Form.Select>
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
                  onChange={(e) => setWithAccountability(e.target.value)}
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
                    onChange={(e) => setAccountabilityRefcode(e.target.value)}
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
                    onChange={(e) => setSerialNumber(e.target.value)}
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
                    onChange={(e) => setJobOrderRefcode(e.target.value)}
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
                    required
                    onChange={handleFormChangeReceived}
                    defaultValue="">
                    <option disabled value="">
                      Select Employee
                    </option>
                    {roles.map((role) => (
                      <option key={role.col_id} value={role.col_id}>
                        {role.col_Fname}
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
                    required
                    onChange={handleFormChangeTransported}>
                    <option value="">Select Employee</option>
                    {roles.map((role) => (
                      <option key={role.col_id} value={role.col_id}>
                        {role.col_Fname}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>M.R.S #: </Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Input #"
                    style={{ height: "40px", fontSize: "15px" }}
                    onChange={(e) => setMrs(e.target.value)}
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
                  onChange={(e) => setRemarks(e.target.value)}
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
                  <table>
                    <thead>
                      <tr>
                        <th className="tableh">Product Code</th>
                        <th className="tableh">Product Name</th>
                        <th className="tableh">Quantity</th>
                        <th className="tableh">Desciptions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addProduct.length > 0 ? (
                        addProduct.map((product) => (
                          <tr key={product.value}>
                            <td key={product.value}>{product.code}</td>
                            <td key={product.value}>{product.name}</td>
                            <td>
                              <div className="d-flex flex-direction-row align-items-center">
                                <input
                                  type="number"
                                  value={quantityInputs[product.value] || ""}
                                  onInput={(e) =>
                                    handleQuantityChange(
                                      e.target.value,
                                      product.value,
                                      product.quantity_available
                                    )
                                  }
                                  required
                                  placeholder="Input quantity"
                                  style={{
                                    height: "40px",
                                    width: "120px",
                                    fontSize: "15px",
                                  }}
                                  min="0"
                                  max="9999999999"
                                />
                                /{product.quantity_available}
                              </div>
                            </td>
                            <td>{product.desc}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center", fontFamily: "Poppins, Source Sans Pro" }}>
                            No Product Selected
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {showDropdown && (
                      <Select
                        isMulti
                        filterOption={({ label }, inputValue) =>
                          label.props.children[1].props.children.toLowerCase().includes(inputValue.toLowerCase())
                        }
                        options={fetchProduct
                          .map((product) => ({
                            value: `${product.inventory_id}_Product`,
                            label: (
                              <div>
                                Product Name: <strong>
                                  {product.product_tag_supplier.product.product_name}
                                </strong>
                                / Stock: <strong>
                                  {product.quantity}
                                </strong>
                              </div>
                            ),
                            type: "Product",
                            inventory_id: product.inventory_id,
                            code: product.product_tag_supplier.product.product_code,
                            name: product.product_tag_supplier.product.product_name,
                            quantity_available: product.quantity,
                            desc: product.product_tag_supplier.product.product_details,
                          }))
                          .concat(
                            fetchAssembly.map((assembly) => ({
                              value: `${assembly.inventory_id}_Assembly`,
                              label: (
                                <div>
                                  Product Name: <strong>
                                    {assembly.assembly_supplier.assembly.assembly_name}
                                  </strong>
                                  / Stock: <strong>
                                    {assembly.quantity}
                                  </strong>
                                </div>
                              ),
                              type: "Assembly",
                              inventory_id: assembly.inventory_id,
                              code: assembly.assembly_supplier.assembly.assembly_code,
                              name: assembly.assembly_supplier.assembly.assembly_name,
                              quantity_available: assembly.quantity,
                              desc: assembly.assembly_supplier.assembly.assembly_desc,
                            }))
                          )
                          .concat(
                            fetchSpare.map((spare) => ({
                              value: `${spare.inventory_id}_Spare`,
                              label: (
                                <div>
                                  Product Name: <strong>
                                    {spare.sparepart_supplier.sparePart.spareParts_name}
                                  </strong>
                                  / Stock: <strong>
                                    {spare.quantity}
                                  </strong>
                                </div>
                              ),
                              type: "Spare",
                              inventory_id: spare.inventory_id,
                              code: spare.sparepart_supplier.sparePart.spareParts_code,
                              name: spare.sparepart_supplier.sparePart.spareParts_name,
                              quantity_available: spare.quantity,
                              desc: spare.sparepart_supplier.sparePart.spareParts_desc,
                            }))
                          )
                          .concat(
                            fetchSubpart.map((subpart) => ({
                              value: `${subpart.inventory_id}_Subpart`,
                              label: (
                                <div>
                                  Product Name: <strong>
                                    {subpart.subpart_supplier.subPart.subPart_name}
                                  </strong>
                                  / Stock: <strong>
                                    {subpart.quantity}
                                  </strong>
                                </div>
                              ),
                              type: "Subpart",
                              inventory_id: subpart.inventory_id,
                              code: subpart.subpart_supplier.subPart.subPart_code,
                              name: subpart.subpart_supplier.subPart.subPart_name,
                              quantity_available: subpart.quantity,
                              desc: subpart.subpart_supplier.subPart.subPart_desc,
                            }))
                          )}
                        onChange={handleSelectChange_Prod}
                      />
                    )}

                    <Button
                      variant="warning"
                      onClick={handleAddProdClick}
                      size="md"
                      style={{ fontSize: "15px", 
                               marginTop: "10px",
                               fontFamily: "Poppins, Source Sans Pro" }}>
                      Add Product
                    </Button>
                  </table>
                </div>
                <div className="save-cancel">
                  <Button
                    type="submit"
                    variant="warning"
                    size="md"
                    style={{ fontSize: "20px", margin: "0px 5px", fontFamily: "Poppins, Source Sans Pro" }}>
                    Save
                  </Button>
                  <Link
                    to="/inventory"  onClick={() => handleTabClick("issuance")}
                    className="btn btn-secondary btn-md"
                    size="md"
                    style={{ fontSize: "20px", margin: "0px 5px" }}>
                    Close
                  </Link>
                </div>
              </div>
            </div>
          </Form>
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

export default CreateIssuance;
