import React, { useEffect, useState } from "react";
// import Sidebar from "../../../../Sidebar/sidebar";
// import Header from "../../../../../partials/header";
import "../../../../../assets/global/style.css";
import "../../../../styles/react-style.css";
import axios from "axios";
import BASE_URL from "../../../../../assets/global/url";
import ReactLoading from 'react-loading';
import NoData from '../../../../../assets/image/NoData.png';
import NoAccess from '../../../../../assets/image/NoAccess.png';
import Button from "react-bootstrap/Button";
import swal from "sweetalert";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {
  Plus,
  DotsThreeCircle,
  DotsThreeCircleVertical,
} from "@phosphor-icons/react";
import "../../../../../assets/skydash/vendors/feather/feather.css";
import "../../../../../assets/skydash/vendors/css/vendor.bundle.base.css";
import "../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css";
import "../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css";
import "../../../../../assets/skydash/css/vertical-layout-light/style.css";
import "../../../../../assets/skydash/vendors/js/vendor.bundle.base";
import "../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4";
import "../../../../../assets/skydash/js/off-canvas";

import * as $ from "jquery";
import { jwtDecode } from "jwt-decode";

function BinLocation({ authrztn }) {
  // Artifitial data

  // Artifitial data

  const [binLocation, setbinLocation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [validated, setValidated] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);

  const [binLocationName, setbinLocationName] = useState("");
  const [binLocationSubName, setbinLocationSubName] = useState("");
  const [binLocationRemarks, setbinLocationRemarks] = useState("");

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [rotatedIcons, setRotatedIcons] = useState(
    Array(binLocation.length).fill(false)
  );
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [Fname, setFname] = useState('');
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setuserId] = useState('');

  const decodeToken = () => {
    var token = localStorage.getItem('accessToken');
    if(typeof token === 'string'){
    var decoded = jwtDecode(token);
    setUsername(decoded.username);
    setFname(decoded.Fname);
    setUserRole(decoded.userrole);
    setuserId(decoded.id);
    }
  }

  useEffect(() => {
    decodeToken();
  }, [])

  const toggleDropdown = (event, index) => {
    // Check if the clicked icon is already open, close it
    if (index === openDropdownIndex) {
      setRotatedIcons((prevRotatedIcons) => {
        const newRotatedIcons = [...prevRotatedIcons];
        newRotatedIcons[index] = !newRotatedIcons[index];
        return newRotatedIcons;
      });
      setShowDropdown(false);
      setOpenDropdownIndex(null);
    } else {
      // If a different icon is clicked, close the currently open dropdown and open the new one
      setRotatedIcons(Array(binLocation.length).fill(false));
      const iconPosition = event.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: iconPosition.bottom + window.scrollY,
        left: iconPosition.left + window.scrollX,
      });
      setRotatedIcons((prevRotatedIcons) => {
        const newRotatedIcons = [...prevRotatedIcons];
        newRotatedIcons[index] = true;
        return newRotatedIcons;
      });
      setShowDropdown(true);
      setOpenDropdownIndex(index);
    }
  };


  const handleClose = () => {
    setShowModal(false);
  };

  const handleShow = () => {
    setValidated(false);
    setShowModal(true);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/binLocation/fetchTable")
      .then((res) => {
      setbinLocation(res.data)
      setIsLoading(false);
    })
    .catch((err) => {
      console.log(err);
      setIsLoading(false);
    });
}, 1000);

return () => clearTimeout(delay);
}, []);

  function formatDate(datetime) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(datetime).toLocaleString("en-US", options);
  }

  const [updateFormData, setUpdateFormData] = useState({
    bin_name: "",
    bin_subname: "",
    bin_remarks: "",
    updatedAt: "",
    bin_id: null,
  });

  const handleModalToggle = (updateData = null) => {
    setUpdateModalShow(!updateModalShow);
    if (updateData) {
      setUpdateFormData({
        bin_name: updateData.bin_name,
        bin_subname: updateData.bin_subname,
        bin_remarks: updateData.bin_remarks,
        // updatedAt: updateData.updatedAt,
        bin_id: updateData.bin_id,
      });
    } else {
      setUpdateFormData({
        bin_name: "",
        bin_subname: "",
        bin_remarks: "",
        // updatedAt: '',
        bin_id: null,
      });
    }
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      // if required fields has NO value
      //    console.log('requried')
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill the Required text fields",
      });
    } else {
      // if required fields has value (GOOD)
      // console.log(suppCperson)

      axios
        .post(BASE_URL + "/binLocation/create", {
          binLocationName,
          binLocationSubName,
          binLocationRemarks,
          userId,
        })
        .then((response) => {
          if (response.status === 200) {
            swal({
              title: "Bin Location Add Succesful!",
              text: "The Bin Location has been Added Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              const newId = response.data.bin_id;
              console.log(newId);
              setbinLocation((prev) => [
                ...prev,
                {
                  bin_id: newId,
                  bin_name: response.data.bin_name,
                  bin_remarks: response.data.bin_remarks,
                  bin_subname: response.data.bin_subname,
                  createdAt: response.data.createdAt,
                  updatedAt: response.data.updatedAt,
                },
              ]);

              setShowModal(false);

              setbinLocationName("");
              setbinLocationSubName("");
              setbinLocationRemarks("");
            });
          } else if (response.status === 201) {
            swal({
              title: "Bin Location is Already Exist",
              text: "Please Input a New Bin Location",
              icon: "error",
            });
          }
        });
    }

    setValidated(true); //for validations
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // Check if bin_name and bin_subname are empty
    if (updateFormData.bin_name.trim() === "") {
      swal({
        icon: "error",
        title: "Bin Location Name is required",
        text: "Please fill Bin Location Name field",
      });
      return;
    }
    // if (updateFormData.bin_subname.trim() === "") {
    //   swal({
    //     icon: "error",
    //     title: "Bin Location SubName is required",
    //     text: "Please fill Bin Location SubName field",
    //   });
    //   return;
    // }

    try {
      const id = updateFormData.bin_id;
      const response = await axios.put(
        BASE_URL + `/binLocation/update/${updateFormData.bin_id}?userId=${userId}`,
        {
          bin_name: updateFormData.bin_name,
          bin_subname: updateFormData.bin_subname,
          bin_remarks: updateFormData.bin_remarks,
        }
      );

      if (response.status === 200) {
        swal({
          title: "Bin Location Update Successful!",
          text: "The Bin Location has been Updated Successfully.",
          icon: "success",
          button: "OK",
        }).then(() => {
          handleModalToggle();
          setbinLocation((prev) =>
            prev.map((data) =>
              data.bin_id === updateFormData.bin_id
                ? {
                    ...data,
                    bin_id: updateFormData.bin_id,
                    bin_name: updateFormData.bin_name,
                    bin_subname: updateFormData.bin_subname,
                    bin_remarks: updateFormData.bin_remarks,
                  }
                : data
            )
          );

          // Reset the form fields
          setUpdateFormData({
            bin_name: "",
            bin_subname: "",
            bin_remarks: "",
            updatedAt: "",
            bin_id: null,
          });
        });
      } else if (response.status === 202) {
        swal({
          icon: "error",
          title: "Bin Location is already exists",
          text: "Please input another Bin Location",
        });
      } else {
        swal({
          icon: "error",
          title: "Something went wrong",
          text: "Please contact our support",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (table_id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await axios.delete(
            BASE_URL + `/binLocation/delete/${table_id}?userId=${userId}`
          );
          if (response.status === 200) {
            swal({
              title: "Bin Location Delete Successful!",
              text: "The Bin Location has been Deleted Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              setbinLocation((prev) =>
                prev.filter((data) => data.bin_id !== table_id)
              );
            });
          } else if (response.status === 202) {
            swal({
              icon: "error",
              title: "Delete Prohibited",
              text: "You cannot delete Bin Location that is used",
            });
          } else {
            swal({
              icon: "error",
              title: "Something went wrong",
              text: "Please contact our support",
            });
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        swal({
          title: "Cancelled Successfully",
          text: "Bin Location not Deleted!",
          icon: "warning",
        });
      }
    });
  };

  React.useEffect(() => {
    // Initialize DataTable when role data is available
    if ($("#order-listing").length > 0 && binLocation.length > 0) {
      $("#order-listing").DataTable();
    }
  }, [binLocation]);

  const [visibleButtons, setVisibleButtons] = useState({}); // Initialize as an empty object
  const [isVertical, setIsVertical] = useState({}); // Initialize as an empty object

  const toggleButtons = (userId) => {
    setVisibleButtons((prevVisibleButtons) => {
      const updatedVisibleButtons = { ...prevVisibleButtons };

      // Close buttons for other items
      Object.keys(updatedVisibleButtons).forEach((key) => {
        if (key !== userId) {
          updatedVisibleButtons[key] = false;
        }
      });

      // Toggle buttons for the clicked item
      updatedVisibleButtons[userId] = !prevVisibleButtons[userId];

      return updatedVisibleButtons;
    });

    setIsVertical((prevIsVertical) => {
      const updateVertical = { ...prevIsVertical };

      Object.keys(updateVertical).forEach((key) => {
        if (key !== userId) {
          updateVertical[key] = false;
        }
      });

      // Toggle buttons for the clicked item
      updateVertical[userId] = !prevIsVertical[userId];

      return updateVertical;
    });
  };

  const closeVisibleButtons = () => {
    setVisibleButtons({});
    setIsVertical({});
  };
  const setButtonVisibles = (userId) => {
    return visibleButtons[userId] || false; // Return false if undefined (closed by default)
  };

  // const [authrztn, setauthrztn] = useState([]);
  // useEffect(() => {

  //   var decoded = jwtDecode(localStorage.getItem('accessToken'));
  //   console.log("Decoded: ", decoded);
  //   axios.get(BASE_URL + '/masterList/viewAuthorization/'+ decoded.id)
  //     .then((res) => {
  //       if(res.status === 200){
  //         console.log(res);
  //         setauthrztn(res.data.col_authorization);
  //       }
  //   })
  //     .catch((err) => {
  //       console.error(err);
  //   });

  // }, []);


  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
              {isLoading ? (
                <div className="loading-container">
                  <ReactLoading className="react-loading" type={'bubbles'}/>
                  Loading Data...
                </div>
              ) : (
        authrztn.includes('Bin Location - View') ? (
        <div className="right-body-contents">
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>Bin Location</p>
              </div>

              <div className="button-create-side">
                <div className="Buttonmodal-new">
                  { authrztn?.includes('Bin Location - Add') && (
                  <button onClick={handleShow}>
                    <span style={{}}>
                      <Plus size={25} />
                    </span>
                    Create New
                  </button>
                  )}

                </div>
              </div>
            </div>
          </div>
          <div className="table-containss">
            <div className="main-of-all-tables">
              <table id="order-listing">
                <thead>
                  <tr>
                    <th className="tableh">ID</th>
                    <th className="tableh">Bin Name</th>
                    <th className="tableh">Sub Bin-Name</th>
                    <th className="tableh">Remarks</th>
                    <th className="tableh">Date Added</th>
                    <th className="tableh">Date Modified</th>
                    <th className="tableh">Action</th>
                  </tr>
                </thead>
                {binLocation.length > 0 ? (
                <tbody>
                  {binLocation.map((data, i) => (
                    <tr key={i}>
                      <td>{data.bin_id}</td>
                      <td>{data.bin_name}</td>
                      <td>{data.bin_subname}</td>
                      <td>{data.bin_remarks}</td>
                      <td>{formatDate(data.createdAt)}</td>
                      <td>{formatDate(data.updatedAt)}</td>
                      <td>
                      {isVertical[data.bin_id] ? (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <DotsThreeCircleVertical
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.bin_id);
                            }}
                          />
                          <div className="float" style={{ position: 'absolute', left: '-125px', top: '0' }}>
                            {setButtonVisibles(data.bin_id) && (
                              <div className="choices">
                              { authrztn?.includes('Bin Location - Edit') && (
                             <button
                               className="btn"
                               onClick={() => {
                                 handleModalToggle(data);
                                 closeVisibleButtons();
                               }}>
                               Update
                             </button>
                              )}

                             { authrztn?.includes('Bin Location - Delete') && (
                             <button
                               className="btn"
                               onClick={() => {
                                 handleDelete(data.bin_id);
                                 closeVisibleButtons();
                               }}>
                               Delete
                             </button>
                             )}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <DotsThreeCircle
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.bin_id);
                            }}
                          />
                          <div className="float" style={{ position: 'absolute', left: '-125px', top: '0' }}>
                            {setButtonVisibles(data.bin_id) && (
                              <div className="choices">
                              { authrztn?.includes('Bin Location - Edit') && (
                             <button
                               className="btn"
                               onClick={() => {
                                 handleModalToggle(data);
                                 closeVisibleButtons();
                               }}>
                               Update
                             </button>
                              )}

                             { authrztn?.includes('Bin Location - Delete') && (
                             <button
                               className="btn"
                               onClick={() => {
                                 handleDelete(data.bin_id);
                                 closeVisibleButtons();
                               }}>
                               Delete
                             </button>
                             )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                  ) : (
                    <div className="no-data">
                      <img src={NoData} alt="NoData" className="no-data-img" />
                      <h3>
                        No Data Found
                      </h3>
                    </div>
                )}
              </table>
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
      <Modal 
      show={showModal} 
        onHide={handleClose}
        backdrop="static"
         keyboard={false}
          size="lg">
        
          <Modal.Header closeButton>
            <Modal.Title style={{fontSize: '24px',
                fontFamily: 'Poppins, Source Sans Pro'}}>
              Create Bin Location
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px",
                                  fontFamily: 'Poppins, Source Sans Pro'}}>
                    Location Name:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{ height: "40px", 
                    fontSize: "15px", 
                    fontFamily: 'Poppins, Source Sans Pro' }}
                    required
                    value={binLocationName}
                    onChange={(e) => setbinLocationName(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px",
                      fontFamily: 'Poppins, Source Sans Pro'}}>
                    Location Sub-Name:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{ height: "40px", 
                              fontSize: "15px", 
                              fontFamily: 'Poppins, Source Sans Pro' }}
                    value={binLocationSubName}
                    onChange={(e) => setbinLocationSubName(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="mt-3">
              <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px", 
                            fontFamily: 'Poppins, Source Sans Pro' }}>
                        Description 
                  </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  style={{
                  fontFamily: 'Poppins, Source Sans Pro',
                  fontSize: "16px",
                  height: "200px",
                  maxHeight: "200px",
                  resize: "none",
                  overflowY: "auto",
                  }}
                  value={binLocationRemarks}
                  onChange={(e) => setbinLocationRemarks(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="save-cancel">
              <Button
                type="submit"
                variant="warning"
                size="md"
                style={{ fontSize: "20px",
                fontFamily: 'Poppins, Source Sans Pro',
                margin: "0px 5px"}}>
                Save
              </Button>
              <Button
                variant="secondary"
                size="md"
                style={{ fontSize: "20px",
                fontFamily: 'Poppins, Source Sans Pro',
                margin: "0px 5px"}}
                onClick={handleClose}>
                Cancel
              </Button>
            </div>
            </Form>
          </Modal.Body>
      </Modal>

      <Modal 
        show={updateModalShow} 
          onHide={() => handleModalToggle()}
          backdrop="static"
          keyboard={false}
           size="lg">
        <Form noValidate validated={validated} onSubmit={handleUpdateSubmit}>
          <Modal.Header closeButton>
            <Modal.Title style={{fontSize: '24px',
                fontFamily: 'Poppins, Source Sans Pro'}}>
              Update Bin Location
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px",
                                fontFamily: 'Poppins, Source Sans Pro'}}>
                      Location Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={updateFormData.bin_name}
                      onChange={handleUpdateFormChange}
                      name="bin_name"
                      style={{ height: "40px", 
                      fontSize: "15px", 
                      fontFamily: 'Poppins, Source Sans Pro' }}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px",
                              fontFamily: 'Poppins, Source Sans Pro'}}>
                      Location Sub-Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={updateFormData.bin_subname}
                      onChange={handleUpdateFormChange}
                      name="bin_subname"
                      style={{ height: "40px", 
                      fontSize: "15px", 
                      fontFamily: 'Poppins, Source Sans Pro' }}
                      required
                    />
                  </Form.Group>
                </div>
            </div>

            <div className="mt-3">
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label style={{ fontSize: "20px" ,
                        fontFamily: 'Poppins, Source Sans Pro'}}>
                  Description 
                </Form.Label>
                <Form.Control
                  value={updateFormData.bin_remarks}
                  onChange={handleUpdateFormChange}
                  name="bin_remarks"
                  as="textarea"
                  rows={3}
                  style={{
                  fontFamily: 'Poppins, Source Sans Pro',
                  fontSize: "16px",
                  height: "200px",
                  maxHeight: "200px",
                  resize: "none",
                  overflowY: "auto",
                  }}
                />
              </Form.Group>
            </div>
            <div className="save-cancel">
              <Button
                  type="submit"
                  variant="warning"
                  size="md"
                    style={{ fontSize: "20px",
                    fontFamily: 'Poppins, Source Sans Pro',
                    margin: "0px 5px"}}>
                  Update
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setUpdateModalShow(!updateModalShow)}
                  size="md"
                    style={{ fontSize: "20px",
                    fontFamily: 'Poppins, Source Sans Pro',
                    margin: "0px 5px"}}>
                  Close
                </Button>
            </div>
          </Modal.Body>


        </Form>
      </Modal>
    </div>
  );
}

export default BinLocation;
