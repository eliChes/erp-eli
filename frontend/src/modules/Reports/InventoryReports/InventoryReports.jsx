// import React, { useEffect, useState } from 'react';
// import Sidebar from '../../Sidebar/sidebar';
// import '../../../assets/global/style.css';
// import '../../styles/react-style.css';
// import axios from 'axios';
// import BASE_URL from '../../../assets/global/url';
// import Button from 'react-bootstrap/Button';
// import swal from 'sweetalert';
// import { Link, useNavigate } from 'react-router-dom';
// import Modal from 'react-bootstrap/Modal';
// import Form from 'react-bootstrap/Form';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import {
//     MagnifyingGlass,
//     Gear, 
//     Bell,
//     UserCircle,
//     Plus,
//     Trash,
//     NotePencil,
//     DotsThreeCircle,
//     CalendarBlank
//   } from "@phosphor-icons/react";
//   import '../../../assets/skydash/vendors/feather/feather.css';
//   import '../../../assets/skydash/vendors/css/vendor.bundle.base.css';
//   import '../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
//   import '../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
//   import '../../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
//   import '../../../assets/skydash/css/vertical-layout-light/style.css';
//   import '../../../assets/skydash/vendors/js/vendor.bundle.base';
//   import '../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
//   import '../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
//   import '../../../assets/skydash/js/off-canvas';
  
//   import * as $ from 'jquery';

// function InventoryReports() {

    
// // Artifitial data

// const data = [
//     {
//       samA: 'asd',
//       samB: 'asd',
//       samC: 'asd',
//       samD: 'asd',
//       samE: 'asd',
//     },
//     {
//       samA: 'asd',
//       samB: 'asd',
//       samC: 'asd',
//       samD: 'asd',
//       samE: 'asd',
//     },
//     {
//       samA: 'asd',
//       samB: 'asd',
//       samC: 'asd',
//       samD: 'asd',
//       samE: 'asd',
//     },
//   ]
      
// // Artifitial data


//   const navigate = useNavigate();
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
  
//     useEffect(() => {
//         if ($('#order-listing').length > 0) {
//           $('#order-listing').DataTable();
//         }
//       }, []);


//   return (
//     <div className="main-of-containers">
//         <div className="left-of-main-containers">
//             <Sidebar/>
//         </div>

//         <div className="mid-of-main-containers">
//         </div>

//         <div className="right-of-main-containers">
//             <div className="right-body-contents">
//                 <div className="settings-search-master">

//                 <div className="dropdown-and-iconics">
//                     <div className="dropdown-side">
//                     </div>
//                     <div className="iconic-side">
//                         <div className="gearsides">
//                             <Gear size={35}/>
//                         </div>
//                         <div className="bellsides">
//                             <Bell size={35}/>
//                         </div>
//                         <div className="usersides">
//                             <UserCircle size={35}/>
//                         </div>
//                         <div className="username">
//                           <h3>User Name</h3>
//                         </div>
//                     </div>
//                 </div>

//                 </div>
//                 <div className="Employeetext-button">
//                     <div className="employee-and-button">
//                     <div className="emp-text-side">
//                             <p>Inventory Reports</p>
//                         </div>
//                         <div className="button-create-side">
//                         <div className="Buttonmodal-new">
//                             <button>
//                                 <Link className='button'>
//                                 <span style={{ }}>
//                                 <Plus size={25} /> Stock Transfer
//                                 </span>
//                                 </Link>
//                             </button>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//                 <div className="table-containss">
//                     <div className="main-of-all-tables">
//                         <table id='order-listing'>
//                                 <thead>
//                                 <tr>
//                                     <th className='tableh'>PR No.</th>
//                                     <th className='tableh'>Requestor</th>
//                                     <th className='tableh'>Status</th>
//                                     <th className='tableh'>Date Created</th>
//                                     <th className='tableh'>Remarks</th>
//                                     <th className='tableh'>Action</th>
//                                 </tr>
//                                 </thead>
//                                 <tbody>
//                                       {data.map((data,i) =>(
//                                         <tr key={i}>
//                                         <td onClick={() => navigate(`/purchaseOrderListPreview`)}>{data.samA}</td>
//                                         <td onClick={() => navigate(`/purchaseOrderListPreview`)}>{data.samB}</td>
//                                         <td onClick={() => navigate(`/purchaseOrderListPreview`)}>{data.samC}</td>
//                                         <td onClick={() => navigate(`/purchaseOrderListPreview`)}>{data.samD}</td>
//                                         <td onClick={() => navigate(`/purchaseOrderListPreview`)}>{data.samE}</td>
//                                         <td>
//                                         <button className='btn'><Trash size={20} style={{color: 'red'}}/></button>
//                                         </td>
//                                         </tr>
//                                       ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>

//         </div>
//     </div>
//   )
// }

// export default InventoryReports