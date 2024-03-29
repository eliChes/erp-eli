import React, { useEffect, useState } from 'react';
import Sidebar from '../../Sidebar/sidebar';
import '../../../assets/global/style.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    ArrowCircleLeft,
    Plus,
    Paperclip,
    NotePencil,
    DotsThreeCircle,
    CalendarBlank,
  } from "@phosphor-icons/react";
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
import swal from 'sweetalert';
import * as $ from 'jquery';
import { jwtDecode } from "jwt-decode";

function PurchaseRequestPreview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [prNum, setPrNum] = useState('');
  const [status, setStatus] = useState('');
  const [dateCreated, setDateCreated] = useState('');
  const [dateNeed, setDateNeed] = useState(null);
  const [useFor, setUseFor] = useState('');
  const [remarks, setRemarks] = useState('');
  const [product, setProduct] = useState([]); //para pag fetch ng mga registered products


  const [inputValues, setInputValues] = useState({});

  const [showDropdown, setShowDropdown] = useState(false);

  const [productSelectedFetch, setProductSelectedFetch] = useState([]); //para pag display sa product na selected sa pag create patungong table
  const [assemblySelectedFetch, setAssemblySelectedFetch] = useState([]); //para pag display sa assembly na selected sa pag create patungong table
  const [spareSelectedFetch, setSpareSelectedFetch] = useState([]); //para pag display sa spare na selected sa pag create
  const [subPartSelectedFetch, setSubPartSelectedFetch] = useState([]); //para pag display sa subpart na selected sa pag create patungong table

  const [validated, setValidated] = useState(false);
  const [isReadOnly, setReadOnly] = useState(false);


  const [files, setFiles] = useState([]);
  const [rejustifyRemarks, setRejustifyRemarks] = useState('');

  const [ProductQuant, setProductQuant] = useState([]);
  // const [Fname, setFname] = useState('');
  // const [username, setUsername] = useState('');
  // const [userRole, setUserRole] = useState('');
  const [userId, setuserId] = useState('');

  const decodeToken = () => {
    var token = localStorage.getItem('accessToken');
    if(typeof token === 'string'){
    var decoded = jwtDecode(token);
    // setUsername(decoded.username);
    // setFname(decoded.Fname);
    // setUserRole(decoded.userrole);
    setuserId(decoded.id);
    }
  }

  useEffect(() => {
    decodeToken();
  }, [])

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };


  const handleEditClick = () => {
    // for clicking the button can be editted not readonly
    setReadOnly(true);
  };
  
  const handleCancelEdit = () => {
    // for clicking the button can be editted not readonly
    setReadOnly(false);
  };

  const handleApproveClick = () => {

    swal({
      title: "Are you sure?",
      text: "You are attempting to approve this request",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (approve) => {
      if (approve) {
        try {
          axios.post(`${BASE_URL}/PR/approve`, null, {
            params:{
              id: id,
              userId,
            }
             
          })
          .then((res) => {
            console.log(res);
            if (res.status === 200) {
              swal({
                title: 'The Purchase sucessfully approved!',
                text: 'The Purchase been approved successfully.',
                icon: 'success',
                button: 'OK'
              }).then(() => {
                navigate('/purchaseRequest')
                
              });
            } else {
              swal({
                icon: 'error',
                title: 'Something went wrong',
                text: 'Please contact our support'
              });
            }
          })


        } catch (err) {
          console.log(err);
        }
      } else {
        swal({
          title: "Cancelled Successfully",
          icon: "warning",
        });
      }
    });

  };


  
  const handleUploadRejustify = async () => {
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
       
      }
      formData.append('remarks', rejustifyRemarks);
      formData.append('id', id);

      const response = await axios.post(BASE_URL + `/PR_rejustify/rejustify`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          userId: userId,
        },
      });

      if (response.status === 200){
        swal({
          title: 'Request rejustify!',
          text: 'The Request has been successfully rejustified',
          icon: 'success',
          button: 'OK'
        }).then(() => {
          navigate('/purchaseRequest')
          
        });
      } else {
        swal({
          icon: 'error',
          title: 'Something went wrong',
          text: 'Please contact our support'
        });
      }

      console.log(response.data);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };
  


  //Where clause sa product PR
  useEffect(() => {
    axios.get(BASE_URL + '/PR_product/fetchPrProduct', {
      params: {
        id: id
      }
    })
      .then(res => {
        const data = res.data;
        setProductSelectedFetch(data);
        // const selectedPRproduct = data.map((row) => ({
        //   value: row.product_id,
        //   label: `Product Code: ${row.product.product_code} / Name: ${row.product.product_name}`,
        //   quants: row.quantity,
        // }));
        // setvaluePRproduct(selectedPRproduct);
      })
      .catch(err => console.log(err));
  }, [id]);

  //Where clause ng assembly
  useEffect(() => {
    axios.get(BASE_URL + '/PR_assembly/fetchViewAssembly', {
      params: {
        id: id
      }
    })
      .then(res => {
        const data = res.data;
        setAssemblySelectedFetch(data);
        // const selectedPRAssembly = data.map((row) => ({
        //   value: row.id,
        //   label: `Assembly Code: ${row.assembly.assembly_code} / Name: ${row.assembly.assembly_name}`,
        // }));
        // setvaluePRassembly(selectedPRAssembly);
      })
      .catch(err => console.log(err));
  }, [id]);


  //Where clause sa spare parts
  useEffect(() => {
    axios.get(BASE_URL + '/PR_spare/fetchViewSpare', {
      params: {
        id: id
      }
    })
      .then(res => {
        const data = res.data;
        setSpareSelectedFetch(data);
      //   const selectedPRspare = data.map((row) => ({
      //     value: row.id,
      //     label: `Spare Code: ${row.sparePart.spareParts_code} / Name: ${row.sparePart.spareParts_name}`,
      //   }));
      //   setvalueSpare(selectedPRspare);
      })
      .catch(err => console.log(err));
  }, [id]);


  
  //Where clause sa sub parts
  useEffect(() => {
    axios.get(BASE_URL + '/PR_subpart/fetchViewSubpart', {
      params: {
        id: id
      }
    })
      .then(res => {
        const data = res.data;
        setSubPartSelectedFetch(data);
        // const selectedPRsub = data.map((row) => ({
        //   value: row.id,
        //   label: `SubPart Code: ${row.subPart.subPart_code} / Name: ${row.subPart.subPart_name}`,
        // }));
        // setvaluePRsub(selectedPRsub);
      })
      .catch(err => console.log(err));
  }, [id]);



  useEffect(() => {
    axios.get(BASE_URL + '/PR/fetchView', {
      params: {
        id: id
      }
    })
    .then(res => {
      setPrNum(res.data.pr_num);
      setStatus(res.data.status);
      setDateCreated(res.data.createdAt);
      const parsedDate = new Date(res.data.date_needed);
      setDateNeed(parsedDate);
      setUseFor(res.data.used_for);
      setRemarks(res.data.remarks);
      setProduct(res.data.product_id);
    })
    .catch(err => {
      console.error(err);
    });
  }, [id]);
  



  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  
  const handleClose = () => {
    setShowModal(false);
  };

      //date format
      function formatDatetime(datetime) {
        const options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        };
        return new Date(datetime).toLocaleString('en-US', options);
      }

       //date format
    function formatDatetime(datetime) {
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Date(datetime).toLocaleString('en-US', options);
    }


    
  return (
    <div className="main-of-containers">
        <div className="right-of-main-containers">
            <div className="right-body-contents-a">
          <Row>      
            <Col>
                <div className='create-head-back' style={{display: 'flex', alignItems: 'center'}}>
                    <Link style={{ fontSize: '1.5rem' }} to="/purchaseRequest">
                        <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                    </Link>
                    <h1>
                    Purchase Request Preview
                    </h1>
                </div>
                    <p1>Purchasing please purchase the following item enumerated below </p1>
              </Col>
                <Col>
                <div className='Status' style={{display: 'flex', alignItems: 'center'}}>
                    

                    <h4>
                        <div className="row">
                    Status: {status}
                    </div>
                        <div className="row">
                    Date Created: {formatDatetime(dateCreated)}
                    </div>
                    </h4>

                </div>
                </Col>
            </Row>
            <Form noValidate validated={validated}>
                <div className="gen-info" 
                  style={{ fontSize: '20px', 
                           position: 'relative', 
                           paddingTop: '20px',
                           fontFamily: 'Poppins, Source Sans Pro' }}>
                          Purchase Information
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '21rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                          <div className="row mt-3">
                            <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>PR #: </Form.Label>
                                <Form.Control type="text" value={prNum} readOnly style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>

                            <div className="col-4">
                                <Form.Group controlId="exampleForm.ControlInput2" className='datepick'>
                                    <Form.Label style={{ fontSize: '20px' }}>Date Needed: </Form.Label>
                                      <DatePicker
                                        readOnly={!isReadOnly} 
                                        selected={dateNeed}
                                        onChange={(date) => setDateNeed(date)}
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText="Start Date"
                                        className="form-control"
                                      />
                                </Form.Group>
                              </div>

                              <div className="col-4">
                                <Form.Group controlId="exampleForm.ControlInput1">
                                  <Form.Label style={{ fontSize: '20px' }}>To be used for: </Form.Label>
                                  <Form.Control type="text" value={useFor}  readOnly={!isReadOnly} onChange={e => setUseFor(e.target.value)}  style={{height: '40px', fontSize: '15px'}}/>
                                </Form.Group>
                              </div>

                  
                          </div>
                        <div className="row">

                            <div className="col-6">
                            <Form.Group controlId="exampleForm.ControlInput1">
                              <Form.Label style={{ fontSize: '20px' }}>Remarks: </Form.Label>
                                <Form.Control readOnly={!isReadOnly} onChange={e => setRemarks(e.target.value)} value={remarks} 
                                    as="textarea"
                                    rows={3}
                                    style={{
                                    fontFamily: 'Poppins, Source Sans Pro',
                                    fontSize: "16px",
                                    height: "150px",
                                    maxHeight: "150px",
                                    resize: "none",
                                    overflowY: "auto",
                                    }}/>
                            </Form.Group>
                            </div>
                            <div className="col-6">

                            </div>
                        </div>
                        <div className="gen-info" 
                        style={{ fontSize: '20px', 
                        position: 'relative', 
                        paddingTop: '20px',
                        fontFamily: 'Poppins, Source Sans Pro' }}>
                          Order Items
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '12rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                        
                        
                            <div className="table-containss">
                                <div className="main-of-all-tables">
                                    <table id=''>
                                            <thead>
                                            <tr>
                                                <th className='tableh'>Product Code</th>
                                                <th className='tableh'>Quantity</th>
                                                <th className='tableh'>U/M</th>
                                                <th className='tableh'>Product Name</th>
                                                <th className='tableh'>Description</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                              {productSelectedFetch.map((data, i) => (
                                                <tr key={i} >
                                                    <td >{data.product.product_code}</td>
                                                    <td >{data.quantity}</td>
                                                    <td >{data.product.product_unitMeasurement}</td>
                                                    <td >{data.product.product_name}</td>
                                                    <td >{data.description}</td>
                                                </tr>
                                              ))}   

                                              {assemblySelectedFetch.map((data, i) => (
                                                <tr key={i} >
                                                    <td >{data.assembly.assembly_code}</td>
                                                    <td >{data.quantity}</td>
                                                    <td >{data.assembly.assembly_unitMeasurement}</td>
                                                    <td >{data.assembly.assembly_name}</td>
                                                    <td >{data.description}</td>
                                                </tr>
                                              ))}     

                                              {spareSelectedFetch.map((data, i) => (
                                                <tr key={i} >
                                                    <td >{data.sparePart.spareParts_code}</td>
                                                    <td >{data.quantity}</td>
                                                    <td >{data.sparePart.spareParts_unitMeasurement}</td>
                                                    <td >{data.sparePart.spareParts_name}</td>
                                                    <td >{data.description}</td>
                                                </tr>
                                              ))}     

                                              {subPartSelectedFetch.map((data, i) => (
                                                <tr key={i} >
                                                    <td >{data.subPart.subPart_code}</td>
                                                    <td >{data.quantity}</td>
                                                    <td >{data.subPart.subPart_unitMeasurement}</td>
                                                    <td >{data.subPart.subPart_name}</td>
                                                    <td >{data.description}</td>
                                                </tr>
                                                ))}                                            
                                            </tbody>
                                        
                                    </table>
                                </div>
                            </div>
                        
                        <div className='save-cancel'>
                              {isReadOnly && (
                                <Button type='submit' variant='outline-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Save</Button>
                              )}
                               {isReadOnly && (
                                <Button type='button' onClick={handleCancelEdit} variant='outline-secondary' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Cancel Edit</Button>
                              )}


                              {status === 'For-Approval' ? (
                                <>
                                  {!isReadOnly && (
                                    <Button
                                      type='button'
                                      onClick={handleApproveClick}
                                      className='btn btn-warning'
                                      size="md"
                                      style={{ fontSize: '20px', margin: '0px 5px' }}
                                    >
                                      Approve
                                    </Button>
                                  )}
                                    {/* {!isReadOnly && (
                                      <Button
                                        type='button'
                                        onClick={handleEditClick}
                                        className='btn btn-success'
                                        size="s"
                                        style={{ fontSize: '20px', margin: '0px 5px' }}
                                      >
                                        <NotePencil /> Edit
                                      </Button>
                                    )} */}

                                  {!isReadOnly && (

                                    <Button 
                                        onClick={handleShow} 
                                        className='btn btn-secondary btn-md' 
                                        size="md" 
                                        style={{ fontSize: '20px', margin: '0px 5px'  }}>
                                      Rejustify
                                    </Button> 
                                  )}
                                </>
                                
                              ):
                              status === 'For-Rejustify' ? (
                                <>
                                  {!isReadOnly && (
                                    <Button
                                    
                                      type='button'
                                      onClick={handleApproveClick}
                                      className='btn btn-warning'
                                      size="md"
                                      style={{ fontSize: '20px', margin: '0px 5px' }}
                                    >
                                      Approve
                                    </Button>

                                  )}

                                    {/* {!isReadOnly && (
                                      <Button
                                        type='button'
                                        onClick={handleEditClick}
                                        className='btn btn-success'
                                        size="s"
                                        style={{ fontSize: '20px', margin: '0px 5px' }}
                                      >
                                        <NotePencil /> Edit
                                      </Button>
                                    )} */}

                                  {!isReadOnly && (

                                    <Button 
                                        onClick={handleShow} 
                                        className='btn btn-secondary btn-md' 
                                        size="md" 
                                        style={{ fontSize: '20px', margin: '0px 5px'  }}>
                                      Rejustify
                                    </Button> 
                                  )}

                              </>
                              ):
                             
                              (
                               <></>
                              )
                              
                              }                                         
                        </div>
                        </Form>
              <Modal show={showModal} onHide={handleClose}>
                <Form>
                  <Modal.Header closeButton>
                    <Modal.Title style={{ fontSize: '24px' }}>For Rejustification</Modal.Title>     
                  </Modal.Header>
                    <Modal.Body>
                    <div className="row mt-3">
                                  <div className="col-6">
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                      <Form.Label style={{ fontSize: '20px' }}>PR No.: </Form.Label>
                                      <Form.Control type="text" value={prNum} readOnly style={{height: '40px', fontSize: '15px'}}/>
                                    </Form.Group>
                                  </div>
                                  <div className="col-6">
                                  <Form.Group controlId="exampleForm.ControlInput2" className='datepick'>
                                      <Form.Label style={{ fontSize: '20px' }}>Date Needed: </Form.Label>
                                        <DatePicker
                                          readOnly
                                          selected={dateNeed}
                                          onChange={(date) => setDateNeed(date)}
                                          dateFormat="MM/dd/yyyy"
                                          placeholderText="Start Date"
                                          className="form-control"
                                        />
                                  </Form.Group>
                                    </div>
                                </div>
                                
                              <div className="row">
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                      <Form.Label style={{ fontSize: '20px' }}>Remarks: </Form.Label>
                                      <Form.Control as="textarea"  onChange={e => setRejustifyRemarks(e.target.value)}  placeholder="Enter details" style={{height: '100px', fontSize: '15px'}}/>
                                  </Form.Group>
                                <div className="col-6">
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                      <Form.Label style={{ fontSize: '20px' }}>Attach File: </Form.Label>
                                      <input type="file" onChange={handleFileChange} />
                                  </Form.Group>

                                  </div>
                              </div>
                      </Modal.Body>
                      <Modal.Footer>
                          <Button variant="secondary" size="md" onClick={handleClose} style={{ fontSize: '20px' }}>
                              Cancel
                          </Button>
                          <Button type="button" onClick={handleUploadRejustify} variant="warning" size="md" style={{ fontSize: '20px' }}>
                              Save
                          </Button>
                      </Modal.Footer>
                  </Form>
                </Modal>
                       
                       
            </div>
        </div>
    </div>
  )
}

export default PurchaseRequestPreview
