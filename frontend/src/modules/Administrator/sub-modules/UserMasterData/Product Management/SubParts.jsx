import React, { useEffect, useState } from 'react';
import Sidebar from '../../../../Sidebar/sidebar';
import '../../../../../assets/global/style.css';
import '../../../../styles/react-style.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../../../../assets/global/url';
import Button from 'react-bootstrap/Button';
import swal from 'sweetalert';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {
    MagnifyingGlass,
    Gear, 
    Bell,
    UserCircle,
    Plus,
    Trash,
    NotePencil,
  } from "@phosphor-icons/react";
  import '../../../../../assets/skydash/vendors/feather/feather.css';
  import '../../../../../assets/skydash/vendors/css/vendor.bundle.base.css';
  import '../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
  import '../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
  import '../../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
  import '../../../../../assets/skydash/css/vertical-layout-light/style.css';
  import '../../../../../assets/skydash/vendors/js/vendor.bundle.base';
  import '../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
  import '../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
  import '../../../../../assets/skydash/js/off-canvas';
  
  import * as $ from 'jquery';

function SubParts() {
    

// Artifitial data

      const aData = [
        {
          cat_id: '2434',
          cat_name: 'Sub Part A',
          cat_remarks: 'Supplier A',
          cat_added: '--',
        },
      ]

// Artifitial data

    const [subParts, setSubParts] = useState([]);
    const [validated, setValidated] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [updateModalShow, setUpdateModalShow] = useState(false);

    const [subPartCode, setSubPartCode] = useState(''); // New state for subPart_code
    const [subPartsName, setSubPartsName] = useState('');
    const [supplier, setSupplier] = useState([]);
    const [slctSupplier, setslctSupplier] = useState('');
    const [subPartsDesc, setSubPartsDesc] = useState('');

    const [subPartCodeExists, setSubPartCodeExists] = useState(false);
  
    const handleClose = () => {
      setShowModal(false);
      window.location.reload();
    };

    const handleSubPartCodeChange = (e) => {
      // Get the input value and remove non-alphanumeric characters
      const inputValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
  
      // Automatically capitalize the input value
      const capitalizedValue = inputValue.toUpperCase();
  
      // Update the subPartCode state with the cleaned and capitalized value
      setSubPartCode(capitalizedValue);
    };

    
    const handleShow = () => setShowModal(true);

    useEffect(() => {
      axios.get(BASE_URL + '/supplier/fetchTable')
        .then(response => {
          setSupplier(response.data);
        })
        .catch(error => {
          console.error('Error fetching suppliers:', error);
        });
    }, []);

    useEffect(() => {
      axios.get(BASE_URL + '/subPart/fetchTable')
        .then(res => setSubParts(res.data))
        .catch(err => console.log(err));
    }, []);

    function formatDate(isoDate) {
      const date = new Date(isoDate);
      return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
    }
    
    function padZero(num) {
      return num.toString().padStart(2, '0');
    }

    const [updateFormData, setUpdateFormData] = useState({
      subPart_name: '',
      supplier: '',
      subPart_desc: '',
      updatedAt: '',
      subPart_code: '',
    });
  
    const handleModalToggle = (updateData = null) => {
      setUpdateModalShow(!updateModalShow);
      if (updateData) {
        setUpdateFormData({
          subPart_code: updateData.subPart_code,
          subPart_name: updateData.subPart_name,
          supplier: updateData.supplier,
          subPart_desc: updateData.subPart_desc,
        });
        setslctSupplier(updateData.supplier); // Set the selected supplier
      } else {
        setUpdateFormData({
          subPart_code: '',
          subPart_name: '',
          supplier: '',
          subPart_desc: '',
        });
        setslctSupplier(''); // Reset the selected supplier
      }
    };
    
    

    const handleUpdateFormChange = e => {
      const { name, value } = e.target;
      if (name === 'supplier') {
        setUpdateFormData(prevData => ({
          ...prevData,
          supplier: value, // Set the supplier name
        }));
      } else {
        setUpdateFormData(prevData => ({
          ...prevData,
          [name]: value
        }));
      }
    };
    
    
  
    const handleFormSubmit = async (e) => {
      e.preventDefault();
    
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
        swal({
          icon: 'error',
          title: 'Fields are required',
          text: 'Please fill the required fields',
        });
      } else {
        // Check if the subPartCode already exists
        const isSubPartCodeExists = subParts.some((data) => data.subPart_code === subPartCode);
        if (isSubPartCodeExists) {
          swal({
            icon: 'error',
            title: 'Sub Part Code Exists',
            text: 'The Sub Part Code is already in use. Please use a different code.',
          });
        } else {
          axios
            .post(BASE_URL + '/subPart/create', {
              subPartCode: subPartCode,
              subPartName: subPartsName,
              supplier: slctSupplier, // Use the selected supplier
              subPartDesc: subPartsDesc,
            })
            .then((response) => {
              if (response.status === 200) {
                // Sub Part created successfully
                swal({
                  title: 'Creation successful!',
                  text: 'You successfully added a new Sub Part.',
                  icon: 'success',
                  button: 'OK',
                }).then(() => {
                  // Handle success
                  const newId = response.data.subPart_code;
                  setSubParts((prev) => [
                    ...prev,
                    {
                      subPart_code: newId,
                      subPart_name: response.data.subPart_name,
                      supplier: response.data.supplier,
                      subPart_desc: response.data.subPart_desc,
                    },
                  ]);
                  setShowModal(false);
                });
              } else if (response.status === 409) {
                // Sub Part code already exists
                swal({
                  icon: 'error',
                  title: 'Sub Part Code Exists',
                  text: 'The Sub Part Code is already in use. Please use a different code.',
                  button: 'OK',
                });
              } else {
                swal({
                  icon: 'error',
                  title: 'Something went wrong',
                  text: 'Please contact our support',
                });
              }
            });
        }
      }
      setValidated(true); //for validations
    };
    
    

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = updateFormData.subPart_code;
  
      // Check if the required fields are filled
      if (!updateFormData.subPart_name || !slctSupplier) { // Use slctSupplier here
        swal({
          icon: 'error',
          title: 'Fields are required',
          text: 'Please fill the required fields',
        });
        return;
      }
  
      // Send the update request to the backend
      const response = await axios.put(BASE_URL + `/subPart/update/${id}`, {
        ...updateFormData,
        supplier: slctSupplier, // Make sure to include the selected supplier
      });

      if (response.status === 200) {
        swal({
          title: 'Update successful!',
          text: 'The Sub Part has been updated successfully.',
          icon: 'success',
          button: 'OK',
        }).then(() => {
          handleModalToggle(); // Close the update modal
          setSubParts((prev) =>
            prev.map((data) =>
              data.subPart_code === updateFormData.subPart_code
                ? {
                    ...data,
                    subPart_name: updateFormData.subPart_name,
                    supplier: updateFormData.supplier,
                    subPart_desc: updateFormData.subPart_desc,
                  }
                : data
            )
          );

          // Reset the form fields
          setUpdateFormData({
            subPart_code: '',
            subPart_name: '',
            supplier: '',
            subPart_desc: '',
          });
          window.location.reload();
        });
      } else if (response.status === 202) {
        swal({
          icon: 'error',
          title: 'Sub Part is already exists',
          text: 'Please input another Sub Part',
        });
      } else {
        swal({
          icon: 'error',
          title: 'Something went wrong',
          text: 'Please contact our support',
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  const handleDelete = async table_id => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {

          const response = await axios.delete(BASE_URL + `/subPart/delete/${table_id}`);
         
          // swal("The User has been deleted!", {
          //   icon: "success",
          // });

          if (response.status === 200) {
            swal({
              title: 'The Sub Part has been deleted!',
              text: 'The Sub Part has been updated successfully.',
              icon: 'success',
              button: 'OK'
            }).then(() => {
              setSubParts(prev => prev.filter(data => data.subPart_code !== table_id));
              window.location.reload();
            });
          } else if (response.status === 202) {
            swal({
              icon: 'error',
              title: 'Delete Prohibited',
              text: 'You cannot delete Sub Part that is used'
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
      } else {
        swal({
          title: "Cancelled Successfully",
          text: "Sub Part not Deleted!",
          icon: "warning",
        });
      }
    });
  };
  
  
  React.useEffect(() => {
    if ($('#order-listing').length > 0 && subParts.length > 0) {
      $('#order-listing').DataTable();
    }
  }, [subParts]);

  return (
    <div className="main-of-containers">
        <div className="left-of-main-containers">
            <Sidebar/>
        </div>

        <div className="mid-of-main-containers">
        </div>

        <div className="right-of-main-containers">
            <div className="right-body-contents">
                <div className="settings-search-master">

                <div className="dropdown-and-iconics">
                    <div className="dropdown-side">

                    </div>
                    <div className="iconic-side">
                        <div className="gearsides">
                            <Gear size={35}/>
                        </div>
                        <div className="bellsides">
                            <Bell size={35}/>
                        </div>
                        <div className="usersides">
                            <UserCircle size={35}/>
                        </div>
                        <div className="username">
                          <h3>User Name</h3>
                        </div>
                    </div>
                </div>

                </div>
                <div className="Employeetext-button">
                    <div className="employee-and-button">
                        <div className="emp-text-side">
                            <p>Sub Parts</p>
                        </div>

                        <div className="button-create-side">
                        <div className="Buttonmodal-new">
                            <button onClick={handleShow} className='button'>
                                <span style={{ }}>
                                <Plus size={25} />
                                </span>
                                New Product
                            </button>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="table-containss">
                    <div className="main-of-all-tables">
                        <table id='order-listing'>
                                <thead>
                                <tr>
                                    <th className='tableh'>Code</th>
                                    <th className='tableh'>Sub Parts Name</th>
                                    <th className='tableh'>Supplier</th>
                                    <th className='tableh'>Details</th>
                                    <th className='tableh'>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                      {subParts.map((data,i) =>(
                                        <tr key={i}>
                                          <td>{data.subPart_code}</td>
                                          <td>{data.subPart_name}</td>
                                          <td>{data.supplier}</td>
                                          <td>{data.subPart_desc}</td>
                                          <td>
                                          <button onClick={() => handleModalToggle(data)} className='btn'><NotePencil size={32} /></button>
                                          <button onClick={() => handleDelete(data.subPart_code)} className='btn'><Trash size={32} color="#e60000" /></button>
                                          </td>
                                        </tr>
                                      ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <Modal show={showModal} onHide={handleClose}>
          <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
            <Modal.Header closeButton>
              <Modal.Title style={{ fontSize: '24px' }}>New Sub Part</Modal.Title>     
            </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <div className='col-4'>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label style={{ fontSize: '20px' }}>Code: </Form.Label>
                      <Form.Control type="text" placeholder="Enter Code.." maxLength={5} style={{height: '40px', fontSize: '15px'}}required onChange={handleSubPartCodeChange}/>
                    </Form.Group>
                  </div>
                  <div className='col-8'>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label style={{ fontSize: '20px' }}>Sub Part Name: </Form.Label>
                      <Form.Control type="text" placeholder="Enter Sub Part Name..." style={{height: '40px', fontSize: '15px'}}required onChange={e => setSubPartsName(e.target.value)}/>
                    </Form.Group>
                  </div>
                </div>
                <div>
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: '20px' }}>Supplier: </Form.Label>
                  <Form.Select
                    onChange={e => setslctSupplier(e.target.value)}
                    // name="supplier"
                    style={{ height: '40px', fontSize: '15px' }}required
                  >
                    <option value="">Select a supplier</option>
                    {supplier.map(supplierItem => (
                      <option key={supplierItem.supplier_code} value={supplierItem.supplier_Name}>
                        {supplierItem.supplier_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form>
                      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label style={{ fontSize: '18px' }}>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} style={{fontSize: '16px', height: '200px', maxHeight: '200px', resize: 'none', overflowY: 'auto'}}  onChange={e => setSubPartsDesc(e.target.value)}/>
                      </Form.Group>
                    </Form>
              </div>
                    

                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" variant="warning" size="md" style={{ fontSize: '20px' }}>
                        Add
                    </Button>
                    <Button variant="secondary" size="md" onClick={handleClose} style={{ fontSize: '20px' }}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Form>
          </Modal>

            <Modal show={updateModalShow} onHide={() => handleModalToggle()}>
                <Form noValidate validated={validated} onSubmit={handleUpdateSubmit}>
                  <Modal.Header closeButton>
                    <Modal.Title className='modal-titles' style={{ fontSize: '24px' }}>Update Sub Part</Modal.Title>

                    <div className="form-group d-flex flex-row ">
                    </div>        
                  </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <div className='col-4'>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label style={{ fontSize: '20px' }}>Code: </Form.Label>
                      <Form.Control type="text" value={updateFormData.subPart_code} readOnly name="subPart_code" maxLength={5} placeholder="Enter Code..." style={{ height: '40px', fontSize: '15px' }} required />
                    </Form.Group>
                  </div>
                  <div className='col-8'>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label style={{ fontSize: '20px' }}>Sub Part Name: </Form.Label>
                      <Form.Control
                        type="text"
                        value={updateFormData.subPart_name}
                        onChange={handleUpdateFormChange}
                        name="subPart_name"
                        placeholder="Sub Part Name..."
                        style={{ height: '40px', fontSize: '15px' }}
                        required
                      />
                    </Form.Group>
                  </div>
                </div>
                <div>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: '20px' }}>Supplier: </Form.Label>
                    <Form.Select
                      as="select"
                      value={updateFormData.supplier}
                      onChange={handleUpdateFormChange}
                      name="supplier"
                      style={{ height: '40px', fontSize: '15px' }}
                    >
                      <option value="">Select a supplier</option>
                      {supplier.map(supplierItem => (
                        <option key={supplierItem.supplier_code} value={supplierItem.supplier_name}>
                          {supplierItem.supplier_name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
                <div>
                  
                <Form>
                      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label style={{ fontSize: '18px' }}>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} value={updateFormData.subPart_desc}  onChange={handleUpdateFormChange} name="subPart_desc" placeholder="Enter Sub Part Descriptions..." style={{fontSize: '16px', height: '200px', maxHeight: '200px', resize: 'none', overflowY: 'auto'}} />
                      </Form.Group>
                    </Form>
              </div>
                    

                </Modal.Body>
                  <Modal.Footer>
                    <Button type="submit" variant="warning" className='' style={{ fontSize: '20px' }}>
                      Update
                    </Button>
                    <Button variant="secondary" onClick={() => setUpdateModalShow(!updateModalShow)} style={{ fontSize: '20px' }}>
                      Close
                    </Button>
                    
                  </Modal.Footer>
                </Form>
              </Modal>
    </div>
  )
}

export default SubParts
