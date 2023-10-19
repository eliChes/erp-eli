import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../../assets/global/style.css';
import '../../../styles/react-style.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Sidebar from '../../../Sidebar/sidebar';
// import Header from '../../../Sidebar/header';
import swal from 'sweetalert';
import BASE_URL from '../../../../assets/global/url';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faMagnifyingGlass, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.min.css'
import Form from 'react-bootstrap/Form';
// import '../../../../assets/skydash/vendors/feather/feather.css';
// import '../../../../assets/skydash/vendors/css/vendor.bundle.base.css';
// import '../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
// import '../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
// import '../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
// import '../../../../assets/skydash/css/vertical-layout-light/style.css';
// import '../../../../assets/skydash/vendors/js/vendor.bundle.base';
// import '../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
// import '../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
// import '../../../../assets/skydash/js/off-canvas';

// import * as $ from 'jquery';
// import Input from '@mui/material/Input';
// import inputClasses from '@mui/material/Input';
import {
  MagnifyingGlass,
  Gear, 
  Bell,
  UserCircle,
  Plus,
  Trash,
  NotePencil,
} from "@phosphor-icons/react";


function MasterList() {
  const [masterListt, setmasterListt] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);

  const [formData, setFormData] = useState({
    cname: '',
    caddress: '',
    cnum: '',
    cemail: '',
    cuname: '',
    crole: '',
    cpass: '',
    cstatus: false,
  });

  const [updateFormData, setUpdateFormData] = useState({
    // uarole: '',
    // uaname: '',
    // uaemail: '',
    // uapass: '',
    // ustatus: false,

    uaname: '',
    uaaddress: '',
    uanum: '',
    uaemail: '',
    uauname: '',
    uarole: '',
    uapass: '',
    ustatus: false,
    updateId: null,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredstudent, setFilteredStudent] = useState([]);

  useEffect(() => {
    axios.get(BASE_URL + '/masterList/masterTable')
      .then(res => setmasterListt(res.data))
      .catch(err => console.log(err));
  }, []);

  console.log(masterListt)

  useEffect(() => {
    const filtered = masterListt.filter(data =>
      data.col_Fname.toLowerCase().includes(searchQuery.toLowerCase())
    );

//   Pagination
    setPagination(filtered);
    setCurrentPage(1);
    //   Pagination

    setFilteredStudent(filtered);
  }, [searchQuery, masterListt]);

//   Pagination
  const [pagination, setPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredStudent = pagination.slice(indexOfFirstItem, indexOfLastItem);

//   Pagination

  const handleClose = () => {
    setShowModal(false);
    // Clear the form fields
    setFormData({
      cname: '',
      caddress: '',
      cnum: '',
      cemail: '',
      cuname: '',
      crole: '',
      cpass: '',
      cstatus: false,
    });
  };

  const handleShow = () => setShowModal(true);

  const handleModalToggle = (updateData = null) => {
    setUpdateModalShow(!updateModalShow);
    if (updateData) {
      
      setUpdateFormData({
      
        uaname: updateData.col_Fname,
        uaaddress: updateData.col_address,
        uanum: updateData.col_phone,
        uaemail: updateData.col_email,
        uauname: updateData.col_username,
        uarole: updateData.col_roleID,
        uapass: updateData.col_Pass,
        ustatus: updateData.col_status === 'Active',
        updateId: updateData.col_id,
      });
    } else {
      setUpdateFormData({
        uaname: '',
        uaaddress: '',
        uanum: '',
        uaemail: '',
        uauname: '',
        uarole: '',
        uapass: '',
        ustatus: false,
        updateId: null,
      });
    }
  };

  const handleFormChange = e => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prevData => ({
        ...prevData,
        [name]: checked
      }));
    } else if (name === 'cname') {
      // Check if the value contains invalid characters
      const isValid = /^[a-zA-Z\s',.\-]*$/.test(value);

      if (isValid) {
        setFormData(prevData => ({
          ...prevData,
          [name]: value
        }));
      }
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleUpdateFormChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setUpdateFormData(prevData => ({
        ...prevData,
        [name]: checked
      }));
    } else {
      setUpdateFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    try {
      const status = formData.cstatus ? 'Active' : 'Inactive';
      const response = await axios.post(BASE_URL + '/masterList/createMaster', formData);
      setShowModal(false);

      if (response.status === 200) {
        swal({
          title: 'User Added!',
          text: 'The user has been added successfully.',
          icon: 'success',
          button: 'OK'
        })
        .then(() => {
          const newId = response.data.col_id;
          console.log(newId)
          setmasterListt(prevStudent => [...prevStudent, {
            col_id: newId,
            col_Fname: formData.cname,
            col_address: formData.caddress,
            col_phone: formData.cnum,
            col_email: formData.cemail,
            col_username: formData.cuname,
            col_roleID: formData.crole,         
            col_Pass: formData.cpass,
            col_status: status
          }]);

          // Reset the form fields
          setFormData({
            cname: '',
            caddress: '',
            cnum: '',
            cemail: '',
            cuname: '',
            crole: '',
            cpass: '',
            cstatus: false,
          });
        });
      } else if (response.status === 202) {
        swal({
          icon: 'error',
          title: 'Email already exists',
          text: 'Please input another Email'
        });
      } else {
        swal({
          icon: 'error',
          title: 'Something went wrong',
          text: 'Please contact our support'
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateSubmit = async e => {
    e.preventDefault();
    try {
      const updaemasterID = updateFormData.updateId;
      console.log(updaemasterID)
      const response = await axios.put(
        BASE_URL + `/masterList/updateMaster/${updateFormData.updateId}`,
        {
          col_Fname: updateFormData.uaname,
          col_address: updateFormData.uaaddress,
          col_phone: updateFormData.uanum,
          col_email: updateFormData.uaemail,
          col_username: updateFormData.uauname,
          col_roleID: updateFormData.uarole,
          col_Pass: updateFormData.uapass,
          col_status: updateFormData.ustatus ? 'Active' : 'Inactive'
        }
      );

      if (response.status === 200) {
        swal({
          title: 'Update successful!',
          text: 'The user has been updated successfully.',
          icon: 'success',
          button: 'OK'
        }).then(() => {

          window.location.reload();
          handleModalToggle();
          setmasterListt(prevStudent => prevStudent.map(data =>
            data.col_ID === updateFormData.updateId
              ? {
                ...data,
                col_Fname: updateFormData.uaname,
                col_address: updateFormData.uaaddress,
                col_phone: updateFormData.uanum,
                col_email: updateFormData.uaemail,
                col_username: updateFormData.uauname,
                col_roleID: updateFormData.uarole,
                col_Pass: updateFormData.uapass,
                col_status: updateFormData.ustatus ? 'Active' : 'Inactive'
              }
              : data
          ));

          // Reset the form fields
          setUpdateFormData({
            uaname: '',
            uaaddress: '',
            uanum: '',
            uaemail: '',
            uauname: '',
            uarole: '',
            uapass: '',
            ustatus: false,
            updateId: null,
          });
        });
      } else if (response.status === 202) {
        swal({
          icon: 'error',
          title: 'Email already exists',
          text: 'Please input another Email'
        });
      } else {
        swal({
          icon: 'error',
          title: 'Something went wrong',
          text: 'Please contact our support'
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async param_id => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          // console.log(param_id)
          await axios.delete(BASE_URL + `/masterList/deleteMaster/${param_id}`);
          setmasterListt(prevStudent => prevStudent.filter(data => data.col_id !== param_id));
          swal("Poof! The User has been deleted!", {
            icon: "success",
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        swal({
          title: "Cancelled Successfully",
          text: "User is Safe",
          icon: "warning",
        });
      }
    });
  };

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    axios.get(BASE_URL + '/userRole/fetchuserrole')
      .then(response => {
        setRoles(response.data);
      })
      .catch(error => {
        console.error('Error fetching roles:', error);
      });
  }, []);


  return (
    <div className="Masterlist-main">
      <div className="masterlist-sidebar">
        {/* Assuming Sidebar is defined */}
        <Sidebar />
      </div>

      <div className="masterlist-content">
        <div className="master-cardbody">

          <div className="settings-search-master">
            <div className="dropdown-search-cont">
              <div className="dropdownss">
                <select name="" id="" className="dropdownmaster">
                  <option value="">Name</option>
                  <option value="">Age</option>
                  <option value="">Id</option>
                </select>
              </div>
              <div className="searchesbar">
                <div style={{ position: "relative" }}>
                  <input
                    type="search"
                    placeholder="Search"
                    className="searchInput"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  ></input>
                  <MagnifyingGlass
                    size={23}
                    style={{
                      position: "absolute",
                      top: "23%",
                      left: "0.9rem",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
                {/* <button className="searchButton">Search</button> */}
              </div>
            </div>
            
            <div className="settings-bellss-users">
              <div className="gear-notif-circless-content">
                <div className="gearsettings">
                  <Gear size={35}/>
                </div>

                <div className="notifset">
                <Bell size={35}/>
                </div>

                <div className="usercircless">
                  <UserCircle size={35}/>
                </div>
              </div>
            </div>

          </div> {/*settings-search-master*/}

          <div className="Employeetext-button">
               <div className="emptext">
                    <p>Employee Master Data</p>
                </div> 

                <div className="Buttonmodal-new">
                  <button className='Newemp-btn' onClick={handleShow}>
                    <span style={{ }}>
                      <Plus size={25} />
                    </span>
                    New Employee
                  </button>
                </div>
          </div> {/*Employeetext-button*/}

          <div className="sortingplacess">
              <div className="sortingboxess">
                  <span>Show</span>
                  <select name="" id="" className='entriesselect'>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="All">All</option>
                  </select>
                  <span className='userstexts'>Entries</span>
              </div>
          </div>
          
          <div className="tablecontains">
                  <div className="master-data-table">
                      <table className="tabless">
                        <thead>
                          <tr>
                            <th className='tableh'>ID</th>
                            <th className='tableh'>User</th>
                            <th className='tableh'>Name</th>
                            <th className='tableh'>Email</th>
                            <th className='tableh'>Status</th>
                            <th className='tableh'>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                              {filteredStudent.map((data, i) => (
                              <tr key={i} className={i % 2 === 0 ? 'even-row' : 'odd-row'}>
                                <td>{data.col_id}</td>
                                <td>{data.col_roleID}</td>
                                <td>{data.col_Fname}</td>
                                <td>{data.col_email}</td>
                                <td>{data.col_status}</td>
                                <td>
                                  <button className='btn' onClick={() => handleModalToggle(data)}><NotePencil size={32} /></button>
                                  <button className='btn' onClick={() => handleDelete(data.col_id)}><Trash size={32} color="#e60000" /></button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
             </div>
        </div>
      </div>


              <Modal show={showModal} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                  <Modal.Title style={{ fontSize: '24px' }}>New Employee</Modal.Title>            
                </Modal.Header>
                <form onSubmit={handleFormSubmit}>
                      <Modal.Body>
                      <div className="gen-info" style={{ fontSize: '20px', position: 'relative' }}>
                          General Information
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '78%',
                              background: '#FFA500',
                              top: '65%',
                              left: '18rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                        <Form>
                          <div className="row mt-3">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Name: </Form.Label>
                                <Form.Control type="text" placeholder="Enter your name" style={{height: '40px', fontSize: '15px'}} value={formData.cname} onChange={handleFormChange} name="cname" required/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label style={{ fontSize: '20px' }}>Address: </Form.Label>
                                <Form.Control type="text" placeholder="Slashtech, Valenzuela City 164" style={{height: '40px', fontSize: '15px'}} value={formData.caddress} onChange={handleFormChange} name="caddress" required />
                              </Form.Group>
                            </div>
                          </div>
                        </Form>

                        <Form>
                          <div className="row">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Contact: </Form.Label>
                                <Form.Control type="number" placeholder="Enter your contact number" style={{height: '40px', fontSize: '15px'}} 
                                value={formData.cnum} onChange={handleFormChange} name="cnum" required/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label style={{ fontSize: '20px' }}>Email: </Form.Label>
                                <Form.Control type="email" placeholder="email@example.com"
                                value={formData.cemail} onChange={handleFormChange} required name="cemail"
                                style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                          </div>
                        </Form>

                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative' }}>
                          Account Access
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '82%',
                              background: '#FFA500',
                              top: '65%',
                              left: '14rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                        <Form>
                          <div className="row mt-3">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Username: </Form.Label>
                                <Form.Control type="text" placeholder="Enter your username" style={{height: '40px', fontSize: '15px'}} 
                                value={formData.cuname} onChange={handleFormChange} name="cuname" required/>
                                {/* <input type="text" style={{height: '40px', fontSize: '15px'}} placeholder="Complete Name" className="form-control" value={formData.cname} onChange={handleFormChange} name="cname" required /> */}
                              </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Role Type: </Form.Label>
                                  <Form.Select aria-label="Default select example" 
                                  name="crole" value={formData.crole} onChange={handleFormChange} required
                                  style={{ height: '40px', fontSize: '15px' }}>
                                    <option disabled value="">Role</option>
                                        {roles.map(role => (
                                          <option key={role.col_roleID} value={role.col_roleID}>
                                            {role.col_rolename}
                                          </option>
                                        ))}
                                  </Form.Select>
                                </Form.Group>
                              </div>

                          </div>
                        </Form>

                        <Form>
                          <div className="row">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Password: </Form.Label>
                                <Form.Control type="password"
                                value={formData.cpass} onChange={handleFormChange} required name="cpass"
                                placeholder="Enter your password" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label style={{ fontSize: '20px' }}>Confirm Password: </Form.Label>
                                <Form.Control type="password" placeholder="Confirm your password" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                          </div>
                        </Form>

                        <div className="form-group">
                        <React.Fragment>
                            <input
                              type="checkbox"
                              name="cstatus"
                              onChange={handleFormChange}
                              defaultChecked={FormData.cstatus} 
                            />
                            <label className='userstatus'>User Status</label>
                          </React.Fragment>
                        </div>
                      </Modal.Body>
                  <Modal.Footer>
                    <Button type="submit" variant="primary" size="md" style={{ fontSize: '20px' }}>
                      Add
                    </Button>
                    <Button variant="secondary" size="md" onClick={handleClose} style={{ fontSize: '20px' }}>
                      Cancel
                  </Button>
                </Modal.Footer>
              </form>
            </Modal>

            <Modal show={updateModalShow} onHide={() => handleModalToggle()} size="xl">
                <form onSubmit={handleUpdateSubmit}>
                  <Modal.Header closeButton>
                    <Modal.Title className='modal-titles' style={{ fontSize: '24px' }}>Update User</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <div className="gen-info" style={{ fontSize: '20px', position: 'relative' }}>
                    General Information
                    <span
                      style={{
                        position: 'absolute',
                        height: '0.5px',
                        width: '78%',
                        background: '#FFA500',
                        top: '65%',
                        left: '18rem',
                        transform: 'translateY(-50%)',
                      }}
                    ></span>
                  </div>
                  <Form>
                    <div className="row mt-3">
                      <div className="col-6">
                        <Form.Group controlId="exampleForm.ControlInput1">
                          <Form.Label style={{ fontSize: '20px' }}>Name: </Form.Label>
                          <Form.Control type="text"
                          value={updateFormData.uaname} onChange={handleUpdateFormChange} name="uaname"
                          placeholder="Enter your name" style={{height: '40px', fontSize: '15px'}}/>
                        </Form.Group>
                      </div>
                      <div className="col-6">
                        <Form.Group controlId="exampleForm.ControlInput2">
                          <Form.Label style={{ fontSize: '20px' }}>Address: </Form.Label>
                          <Form.Control type="text" value={updateFormData.uaaddress} onChange={handleUpdateFormChange} name="uaaddress"
                          placeholder="Slashtech, Valenzuela City 164" style={{height: '40px', fontSize: '15px'}}/>
                        </Form.Group>
                      </div>
                    </div>
                  </Form>

                  <Form>
                    <div className="row">
                      <div className="col-6">
                        <Form.Group controlId="exampleForm.ControlInput1">
                          <Form.Label style={{ fontSize: '20px' }}>Contact: </Form.Label>
                          <Form.Control type="number" value={updateFormData.uanum} onChange={handleUpdateFormChange} name="uanum" placeholder="Enter your contact number" style={{height: '40px', fontSize: '15px'}}/>
                        </Form.Group>
                      </div>
                      <div className="col-6">
                        <Form.Group controlId="exampleForm.ControlInput2">
                          <Form.Label style={{ fontSize: '20px' }}>Email: </Form.Label>
                          <Form.Control type="email" placeholder="name@example.com"
                          value={updateFormData.uaemail} onChange={handleUpdateFormChange} name="uaemail"
                           style={{height: '40px', fontSize: '15px'}}/>
                        </Form.Group>
                      </div>
                    </div>
                  </Form>

                  <div className="gen-info" style={{ fontSize: '20px', position: 'relative' }}>
                    Account Access
                    <span
                      style={{
                        position: 'absolute',
                        height: '0.5px',
                        width: '82%',
                        background: '#FFA500',
                        top: '65%',
                        left: '14rem',
                        transform: 'translateY(-50%)',
                      }}
                    ></span>
                  </div>
                  <Form>
                    <div className="row mt-3">
                      <div className="col-6">
                        <Form.Group controlId="exampleForm.ControlInput1">
                          <Form.Label style={{ fontSize: '20px' }}>Username: </Form.Label>
                          <Form.Control type="text" value={updateFormData.uauname} onChange={handleUpdateFormChange} name="uauname"
                          placeholder="Enter your name" style={{height: '40px', fontSize: '15px'}}/>
                        </Form.Group>
                      </div>
                      <div className="col-6">
                          <Form.Group controlId="exampleForm.ControlInput2">
                            <Form.Label style={{ fontSize: '20px' }}>Role Type: </Form.Label>
                            <Form.Select aria-label="Default select example" 
                            name="uarole" value={updateFormData.uarole} onChange={handleUpdateFormChange} required
                            style={{ height: '40px', fontSize: '15px' }}>
                                 <option disabled value="">Role</option>
                            {roles.map(role => (
                              <option key={role.col_roleID} value={role.col_roleID}>
                                {role.col_rolename}
                              </option>
                            ))}
                            </Form.Select>
                          </Form.Group>
                        </div>
                    </div>
                  </Form>

                  <Form>
                    <div className="row">
                      <div className="col-6">
                        <Form.Group controlId="exampleForm.ControlInput1">
                          <Form.Label style={{ fontSize: '20px' }}>Password: </Form.Label>
                          <Form.Control type="password"
                          value={updateFormData.uapass} onChange={handleUpdateFormChange} required name="uapass"
                           placeholder="Enter your password" style={{height: '40px', fontSize: '15px'}}/>
                        </Form.Group>
                      </div>
                      <div className="col-6">
                        <Form.Group controlId="exampleForm.ControlInput2">
                          <Form.Label style={{ fontSize: '20px' }}>Confirm Password: </Form.Label>
                          <Form.Control type="password" value={updateFormData.uapass} onChange={handleUpdateFormChange} required name="uapass"
                           placeholder="Confirm your password" style={{height: '40px', fontSize: '15px'}}/>
                        </Form.Group>
                      </div>
                    </div>
                  </Form>


                  <div className="form-group">
                    <React.Fragment>
                      <input
                        type="checkbox"
                        name="ustatus"
                        onChange={handleUpdateFormChange}
                        defaultChecked={updateFormData.ustatus} // Set defaultChecked based on ustatus
                      />
                      <label className='userstatus'>User Status</label>
                    </React.Fragment>
                  </div>

                  {/* name="uarole" value={updateFormData.uarole} onChange={handleUpdateFormChange} required

                    <option disabled value="">Role</option>
                    {roles.map(role => (
                      <option key={role.col_roleID} value={role.col_roleID}>
                        {role.col_rolename}
                      </option>
                    ))}

                    <input type="text" className="form-control"  />

                    <input type="email" className="form-control"  />

                    <input type="password" className="form-control"  /> */}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button type="submit" variant="primary" className='' style={{ fontSize: '20px' }}>
                      Update
                    </Button>
                    <Button variant="secondary" onClick={() => setUpdateModalShow(!updateModalShow)} style={{ fontSize: '20px' }}>
                      Close
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>

    </div>

  );
}
export default MasterList;
