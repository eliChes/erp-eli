import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../../assets/global/style.css';
import '../../../styles/react-style.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Sidebar from '../../../Sidebar/sidebar';
import swal from 'sweetalert';
import BASE_URL from '../../../../assets/global/url';
import 'bootstrap/dist/css/bootstrap.min.css'
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
import '../../../../assets/skydash/vendors/feather/feather.css';
import '../../../../assets/skydash/vendors/css/vendor.bundle.base.css';
import '../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
import '../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
import '../../../../assets/skydash/css/vertical-layout-light/style.css';
import '../../../../assets/skydash/vendors/js/vendor.bundle.base';
import '../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
import '../../../../assets/skydash/js/off-canvas';

import * as $ from 'jquery';


function Productvariants(){
  const [data, setData] = useState([
    { id: 1001, name: 'ePson', code: 'ESPN', date: '09/20/2023' },
    // Add more data here
  ]);


  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  
  React.useEffect(() => {
    $(document).ready(function () {
      $('#order-listing').DataTable();
    });
  }, []);

  return(
  <div className="main-of-containers">
      <div className="left-of-main-containers">
        <Sidebar />
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
                              <h3>User Name</h3>
                            </div>
                        </div>

                  </div>

                  <div className="Employeetext-button">
                    <div className="employee-and-button">
                        <div className="emp-text-side">
                            <p>User Master Data</p>
                        </div>

                        <div className="button-create-side">
                          <div className="Buttonmodal-new">
                              <button onClick={handleShow}>
                                <span style={{ }}>
                                  <Plus size={25} />
                                </span>
                                Create New
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
                        <th className='tableh'>ID</th>
                        <th className='tableh'>NAME</th>
                        <th className='tableh'>CODE</th>
                        <th className='tableh'>DATE CREATE</th>
                        <th className='tableh'>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', paddingTop: '20px' }}>No data matche(s) found</td>
                        </tr>
                      ) : (
                        data.map((item) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.code}</td>
                            <td>{item.date}</td>
                            <td>
                              <button className="btn">
                                <NotePencil size={32} />
                              </button>
                              <button className="btn">
                                <Trash size={32} color="#e60000" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
              </div>
            </div>

          </div>
      </div>

      <Modal show={show} onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '24px' }}>Create Manufacturer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="gen-info" style={{ fontSize: '20px', position: 'relative' }}>
                  Manufacturer Info
                  <span
                    style={{
                      position: 'absolute',
                      height: '0.5px',
                      width: '75%',
                      background: '#FFA500',
                      top: '64%',
                      left: '18rem',
                      transform: 'translateY(-50%)',
                    }}
                  ></span>
                </div>

                <Form style={{marginLeft: '10px', marginTop: '10px'}}>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: '18px' }}>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" style={{height: '40px', fontSize: '15px', width: '50%'}}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label style={{ fontSize: '18px' }}>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} style={{fontSize: '16px', height: '200px', maxHeight: '200px', resize: 'none', overflowY: 'auto'}} />
                  </Form.Group>
                </Form>
         
        </Modal.Body>
        <Modal.Footer>
        <Button variant="warning" size="md" style={{ fontSize: '20px' }}>Save</Button>
          <Button variant="secondary" size="md" style={{ fontSize: '20px' }} onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
  </div>
  );
}
export default Productvariants;