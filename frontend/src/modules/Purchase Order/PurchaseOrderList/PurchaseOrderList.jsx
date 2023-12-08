import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../../Sidebar/sidebar';
import '../../../assets/global/style.css';
import '../../styles/react-style.css';
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
import Button from 'react-bootstrap/Button';
import swal from 'sweetalert';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    Gear, 
    Bell,
    UserCircle,
    CalendarBlank,
    XCircle
  } from "@phosphor-icons/react";
  import '../../../assets/skydash/vendors/feather/feather.css';
  import '../../../assets/skydash/vendors/css/vendor.bundle.base.css';
  import '../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
  import '../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
  import '../../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
  import '../../../assets/skydash/css/vertical-layout-light/style.css';
  import '../../../assets/skydash/vendors/js/vendor.bundle.base';
  import '../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
  import '../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
  import '../../../assets/skydash/js/off-canvas';
  
  import * as $ from 'jquery';

function PurchaseOrderList() {

const navigate = useNavigate();
const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);
const [selectedStatus, setSelectedStatus] = useState('');
const [filteredPR, setFilteredPR] = useState([]);
const [allPR, setAllPR] = useState([]);

const handleXCircleClick = () => {
  setStartDate(null);
};

const handleXClick = () => {
  setEndDate(null);
};

const handleStatusChange = (e) => {
  setSelectedStatus(e.target.value);
};

const [pr_req, setPr_req] = useState([]);

  const reloadTable = () => {
    axios
      .get(BASE_URL + '/PR/fetchTable_PO')
      .then((res) => {
        setPr_req(res.data)
        setAllPR(res.data);
        setFilteredPR(res.data); 
      })
      .catch((err) => console.log(err));
  };
  
  useEffect(() => {
     reloadTable()
    }, []);

    //Function when user click the Go button to filter
    const handleGoButtonClick = () => {
      if (!startDate && !endDate && !selectedStatus) {
        return;
      }
    
      const filteredData = allPR.filter((data) => {
        const createdAt = new Date(data.createdAt);
    
        const isWithinDateRange =
          (!startDate || createdAt >= startDate) &&
          (!endDate || createdAt <= endDate);
    
        const isMatchingStatus =
          !selectedStatus || data.status === selectedStatus;
    
        return isWithinDateRange && isMatchingStatus;
      });
    
      setFilteredPR(filteredData);
    };
    

    //function when user click the clear filter button
    const clearFilters = () => {
      setStartDate(null);
      setEndDate(null);
      setSelectedStatus('');
  
      reloadTable();
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

  
    useEffect(() => {
      // Initialize DataTable when role data is available
      if ($('#order-listing').length > 0 && pr_req.length > 0) {
        $('#order-listing').DataTable();
      }
    }, [pr_req]);


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
                        <div className="emp-text-side">
                            <p>Purchase Order List</p>
                        </div>
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
                        <div className="button-create-side">
                          <div style={{ position: "relative", marginBottom: "15px" }}>
                                <DatePicker
                                  selected={startDate}
                                  onChange={(date) => setStartDate(date)}
                                  placeholderText="Choose Date From"
                                  dateFormat="yyyy-MM-dd"
                                  wrapperClassName="custom-datepicker-wrapper"
                                  popperClassName="custom-popper"
                                  style={{fontFamily: 'Poppins, Source Sans Pro'}}
                                />
                                <CalendarBlank
                                  size={20}
                                  weight="thin"
                                  style={{
                                    position: "absolute",
                                    left: "8px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: 'pointer',
                                  }}
                                />
                                {startDate && (
                                  <XCircle
                                    size={16}
                                    weight="thin"
                                    style={{
                                      position: "absolute",
                                      right: "19px",
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                      cursor: 'pointer',
                                    }}
                                    onClick={handleXCircleClick}
                                  />
                                )}
                              </div>

                              <div style={{ position: "relative", marginBottom: "15px" }}>
                                <DatePicker
                                  selected={endDate}
                                  onChange={(date) => setEndDate(date)}
                                  placeholderText="Choose Date To"
                                  dateFormat="yyyy-MM-dd"
                                  wrapperClassName="custom-datepicker-wrapper"
                                  popperClassName="custom-popper"
                                  style={{fontFamily: 'Poppins, Source Sans Pro'}}
                                />
                                <CalendarBlank
                                  size={20}
                                  weight="thin"
                                  selected={endDate}
                                  onChange={(date) => setEndDate(date)}
                                  style={{
                                    position: "absolute",
                                    left: "8px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: 'pointer',
                                  }}
                                />
                                {endDate && (
                                  <XCircle
                                    size={16}
                                    weight="thin"
                                    style={{
                                      position: "absolute",
                                      right: "19px",
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                      cursor: 'pointer',
                                    }}
                                    onClick={handleXClick}
                                  />
                                )}
                              </div>
                              <Form.Select aria-label="item status"
                                value={selectedStatus}
                              onChange={handleStatusChange}
                                style={{width: '450px', height: '40px', fontSize: '15px', marginBottom: '15px', fontFamily: 'Poppins, Source Sans Pro'}}>
                                  <option value="" disabled selected>
                                    Select Status
                                  </option>
                                  <option value="For-Approval">For-Approval</option>
                                  <option value="For-Rejustify">For-Rejustify</option>
                                  <option value="For-Canvassing">For-Canvassing</option>
                                  <option value="Cancelled">Cancelled</option>
                                </Form.Select>  
                                  <button className='goesButton' onClick={handleGoButtonClick}>
                                    GO
                                  </button>
                                  <button className='Filterclear' onClick={clearFilters}>
                                    Clear Filter
                                  </button>
                                  <div className="Buttonmodal-new">
                                </div>
                        </div>

                    </div>
                </div>
                              
                <div className="table-containss">
                    <div className="main-of-all-tables">
                      <table id='order-listing'>
                          <thead>
                            <tr>
                              <th className='tableh'>PR No.</th>
                              <th className='tableh'>Requestor</th>
                              <th className='tableh'>Status</th>
                              <th className='tableh'>Date Approved</th>
                              <th className='tableh'>Remarks</th>
                            </tr>
                          </thead>
                          {filteredPR.length > 0 ? (
                                <tbody>
                                {filteredPR.map((data, i) => (
                              <tr key={i}>
                             <td
                                  onClick={() =>
                                    data.status === 'For-Approval (PO)' ? 
                                    navigate(`/PO_approvalRejustify/${data.id}`) :
                                    data.status === 'For-Rejustify (PO)' ?
                                      navigate(`/PO_approvalRejustify/${data.id}`) :
                                      data.status === 'To-Receive' ?
                                      navigate(`/PO_receive/${data.id}`) :
                                      navigate(`/purchaseOrderListPreview/${data.id}`)
                                  }
                                >
                                  {data.pr_num}
                                </td>

                              <td onClick={() => 
                                          data.status === 'For-Approval (PO)' ? 
                                            navigate(`/PO_approvalRejustify/${data.id}`) :
                                            data.status === 'For-Rejustify (PO)' ?
                                              navigate(`/PO_approvalRejustify/${data.id}`) :
                                              data.status === 'To-Receive' ?
                                              navigate(`/PO_receive/${data.id}`) :
                                              navigate(`/purchaseOrderListPreview/${data.id}`)
                                        }>
                                    --
                                </td>

                                

                                <td onClick={() => 
                                           data.status === 'For-Approval (PO)' ? 
                                           navigate(`/PO_approvalRejustify/${data.id}`) :
                                           data.status === 'For-Rejustify (PO)' ?
                                             navigate(`/PO_approvalRejustify/${data.id}`) :
                                             data.status === 'To-Receive' ?
                                             navigate(`/PO_receive/${data.id}`) :
                                             navigate(`/purchaseOrderListPreview/${data.id}`)
                                        }>
                                           <button className='btn btn-secondary' style={{fontSize: '12px'}}>
                                              {(data.status === 'For-Approval (PO)' ? 'For Approval' :
                                                data.status === 'For-Rejustify (PO)' ? 'For Rejustify' :
                                                data.status)} 
                                            </button>
                                          
                                  </td>

                                  <td onClick={() => 
                                           data.status === 'For-Approval (PO)' ? 
                                           navigate(`/PO_approvalRejustify/${data.id}`) :
                                           data.status === 'For-Rejustify (PO)' ?
                                             navigate(`/PO_approvalRejustify/${data.id}`) :
                                             data.status === 'To-Receive' ?
                                             navigate(`/PO_receive/${data.id}`) :
                                             navigate(`/purchaseOrderListPreview/${data.id}`)
                                        }>
                                    {formatDatetime(data.updatedAt)}
                                </td>

                                <td onClick={() => 
                                           data.status === 'For-Approval (PO)' ? 
                                           navigate(`/PO_approvalRejustify/${data.id}`) :
                                           data.status === 'For-Rejustify (PO)' ?
                                             navigate(`/PO_approvalRejustify/${data.id}`) :
                                             data.status === 'To-Receive' ?
                                             navigate(`/PO_receive/${data.id}`) :
                                             navigate(`/purchaseOrderListPreview/${data.id}`)
                                        }>
                                   {data.remarks}
                                </td>

{/*                           
                                <td onClick={() => navigate(`/purchaseOrderListPreview/${data.id}`)}>{data.pr_num}</td>
                                <td onClick={() => navigate(`/purchaseOrderListPreview/${data.id}`)}>--</td>
                                <td onClick={() => navigate(`/purchaseOrderListPreview/${data.id}`)}>
                                  <button className='btn btn-secondary' style={{fontSize: '12px'}}>
                                          {data.status}
                                  </button></td>
                                <td onClick={() => navigate(`/purchaseOrderListPreview/${data.id}`)}>{formatDatetime(data.updatedAt)}</td>
                                <td onClick={() => navigate(`/purchaseOrderListPreview/${data.id}`)}>{data.remarks}</td> */}
                              </tr>
                            ))}
                          </tbody>
                          ) : (
                            <tbody>
                            <tr>
                              <td colSpan="6" style={{ textAlign: 'center' }}>
                                No matches found.
                              </td>
                            </tr>
                          </tbody>
                        )}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PurchaseOrderList