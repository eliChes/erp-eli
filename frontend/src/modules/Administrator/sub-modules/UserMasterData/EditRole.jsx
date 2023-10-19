import React, {useState, useEffect } from 'react';
import Sidebar from '../../../Sidebar/sidebar';
import Header from '../../../Sidebar/header';
import '../../styles/userRole.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import swal from 'sweetalert';
import Button from 'react-bootstrap/Button';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import BASE_URL from '../../../../assets/global/url';

function EditRole() {
  const navigate = useNavigate();
  const { id } = useParams(); // This gets the role ID from the URL parameter

  const [role, setRole] = useState([]);
  const [rolename, setRolename] = useState(''); // Initialize the state for Role Name
  const [desc, setDesc] = useState(''); // Initialize the state for Description

  useEffect(() => {
    axios.get(BASE_URL + `/userRole/fetchuserroleEDIT/${id}`)
      .then(res => {
        setRole(res.data[0]); // Assuming the response is an array with a single object
        setRolename(res.data[0].col_rolename); // Set the Role Name
        setDesc(res.data[0].col_desc); // Set the Description
        // Assuming res.data is an array with the role data
        // You can then set your selectedCheckboxes state based on the retrieved role data
        const selectedCheckboxes = res.data.map(item => ({
          value: item.col_authorization,
          rolename: item.col_rolename,
          desc: item.col_desc,
          authorization: item.col_authorization,
        }));
        setSelectedCheckboxes(selectedCheckboxes);
      })
      .catch(err => console.log(err));
  }, [id]);
  console.log(role);


// Inserting to database checkboxes

const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  
console.log('dasd' + selectedCheckboxes)

const handleSubmit = async (e) => {
  e.preventDefault();

  const rolename = document.getElementsByName("rolename")[0].value;
  const desc = document.getElementsByName("desc")[0].value;
 


  try {
    const response = await fetch(BASE_URL + `/userRole/editUserrole/${id}/${rolename}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selectedCheckboxes: selectedCheckboxes.map(item => ({
          ...item,
          rolename,
          desc
        }))
      }),
    });

    // Handle the response as needed
    if (response.status === 200) {
      swal({
        icon: 'success',
        title: 'Success!',
        text: 'User roles Updated Successfully!',
      })
      .then(() => {
        navigate("/userRole");
      });
    } 
    else if (response.status === 202) {
      swal({
        icon: 'error',
        title: 'Rolename is already exist',
        text: 'Please input new rolename!',
      });
    } 
    else {
      swal({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    }
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};


// Inserting to database checkboxes


//select unselect all checkboxes


const handleCheckboxChange = (value) => {
    const rolename = document.getElementsByName("rolename")[0].value;
    const desc = document.getElementsByName("desc")[0].value;
    const authorization = value; // Value from the checkbox
    
    if (selectedCheckboxes.some(item => item.value === value)) {
      setSelectedCheckboxes(selectedCheckboxes.filter(item => item.value !== value));
    } else {
      setSelectedCheckboxes([...selectedCheckboxes, { value, rolename, desc, authorization }]);
    }
  };
  
  const handleSelectAll = () => {
    // Select all checkboxes
    const allCheckboxValues = [
      "Analytic Dashboard - Add",
      "Analytic Dashboard - Edit",
      "Analytic Dashboard - Delete",
      "Analytic Dashboard - View",
      "Master List - Add",
      "Master List - Edit",
      "Master List - Delete",
      "Master List - View",
      "Employee Position - Add",
      "Employee Position - Edit",
      "Employee Position - Delete",
      "Employee Position - View",
      "User Access Role - Add",
      "User Access Role - Edit",
      "User Access Role - Delete",
      "User Access Role - View",
      "Product List - Add",
      "Product List - Edit",
      "Product List - Delete",
      "Product List - View",
      "Product Categories - Add",
      "Product Categories - Edit",
      "Product Categories - Delete",
      "Product Categories - View",
      "Bin Location - Add",
      "Bin Location - Edit",
      "Bin Location - Delete",
      "Bin Location - View",
      "Cost Centre - Add",
      "Cost Centre - Edit",
      "Cost Centre - Delete",
      "Cost Centre - View",
      "Supplier - Add",
      "Supplier - Edit",
      "Supplier - Delete",
      "Supplier - View",
      "Asset Monitoring - Add",
      "Asset Monitoring - Edit",
      "Asset Monitoring - Delete",
      "Asset Monitoring - View",
      "Item Master Data - Add",
      "Item Master Data - Edit",
      "Item Master Data - Delete",
      "Item Master Data - View",
      "Inventory Type - Add",
      "Inventory Type - Edit",
      "Inventory Type - Delete",
      "Inventory Type - View",
      "PO Transaction - Add",
      "PO Transaction - Edit",
      "PO Transaction - Delete",
      "PO Transaction - View",
      "Invoice - Add",
      "Invoice - Edit",
      "Invoice - Delete",
      "Invoice - View",
      "Warehouse Master List - Add",
      "Warehouse Master List - Edit",
      "Warehouse Master List - Delete",
      "Warehouse Master List - View",
      "Quality Check - Add",
      "Quality Check - Edit",
      "Quality Check - Delete",
      "Quality Check - View",
      "Receiving - Add",
      "Receiving - Edit",
      "Receiving - Delete",
      "Receiving - View",
      "Stock Management - Add",
      "Stock Management - Edit",
      "Stock Management - Delete",
      "Stock Management - View",
      "Asset List - Add",
      "Asset List - Edit",
      "Asset List - Delete",
      "Asset List - View",
      "Activity Log - Add",
      "Activity Log - Edit",
      "Activity Log - Delete",
      "Activity Log - View",
      "Audit Trail - Add",
      "Audit Trail - Edit",
      "Audit Trail - Delete",
      "Audit Trail - View"
    ];
    
  
    const updatedCheckboxes = allCheckboxValues.map(value => ({
      value,
      rolename: document.getElementsByName("rolename")[0].value,
      desc: document.getElementsByName("desc")[0].value,
      authorization: value,
    }));
  
    setSelectedCheckboxes(updatedCheckboxes);
  };
  
  const handleUnselectAll = () => {
    // Unselect all checkboxes
    setSelectedCheckboxes([]);
  };






  return (
    <div className="container-fluid page-body-wrapper">
      <Sidebar/>
      <Header/>
      <div className='main-panel'>
        <div className='content-wrapper'>
            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                  <div className="card-body">
                    <h3>
                      Edit User Role
                    </h3>



                    <div className='d-flex flex-column justify-content-start align-items-start'> {/*CONTENTS BODY*/}
                        <p className='mt-4 text-align-start'>
                          Role-Based Access Control (RBAC) allows for users to have different privileges, which provides a means to separate administration roles to better align with skill sets and responsibilities.
                        </p>
                        <form className='w-100 mt-3' onSubmit={handleSubmit}>
                        
                            <div>
                              <Row>
                                <Col>
                                <div className='w-60 d-flex flex-column justify-content-start align-items-start'>
                                  <label className='lbl_desc_rname'>Role Name</label>
                                  <input type="text" placeholder='Enter RoleName....' className="form-control" name="rolename" value={rolename} // Set the value from state
                                      onChange={e => setRolename(e.target.value)} // Handle changes and update the state
                                      required/>
                                </div>
                                </Col>
                                <Col>
                                  <div className='w-60 d-flex flex-column justify-content-start align-items-start'>
                                    <label className='lbl_desc_rname'>Description</label>
                                    <input type="text" placeholder='Enter Description....' className="form-control" name="desc" value={desc} // Set the value from state
                                      onChange={e => setDesc(e.target.value)} // Handle changes and update the state
                                      required/>
                                  </div>               
                                </Col>
                              </Row>           
                            </div>


                            <div className='w-25 mt-5'>
                              <Row>
                                <Col>
                                  <div>
                                  <Button variant="light border-secondary" onClick={handleSelectAll}>
                                    Select All
                                  </Button>
                                  </div>
                                </Col>
                                <Col>
                                  <div>
                                    <Button variant="light border-secondary" onClick={handleUnselectAll}>
                                      Unselect All
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                            </div>

                            <div className='w-100 mt-1'>
                            
                              
  <table class="table">
    <thead>
      <tr>
        <th style={{fontSize: 15}}>Module</th>
        <th style={{fontSize: 15}}>Add</th>
        <th style={{fontSize: 15}}>Edit</th>
        <th style={{fontSize: 15}}>Delete</th>
        <th style={{fontSize: 15}}>View</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><h3>Dashboard</h3>
          <td>Analytic Dashboard</td>
        </td>
        <td>
          <div className='input-group'>
              <input
                type="checkbox"
                id="Analytic Dashboard - Add"
                name="vehicle1"
                value="Analytic Dashboard - Add"
                checked={selectedCheckboxes.some(item => item.value === 'Analytic Dashboard - Add')}
                onChange={() => handleCheckboxChange('Analytic Dashboard - Add')}
                
              />
                <label className='p-3' htmlFor="Analytic Dashboard - Add"></label>

            </div>
          </td>
          <td>
            <div className='input-group'>
              <input
                type="checkbox"
                id="Analytic Dashboard - Edit"
                name="vehicle1"
                value="Analytic Dashboard - Edit"
                checked={selectedCheckboxes.some(item => item.value === 'Analytic Dashboard - Edit')}
                onChange={() => handleCheckboxChange('Analytic Dashboard - Edit')}
                
              />
                <label className='p-3' htmlFor="Analytic Dashboard - Edit"></label>

            </div>
          </td>

          <td>
            <div className='input-group'>
              <input
                type="checkbox"
                id="Analytic Dashboard - Delete"
                name="vehicle1"
                value="Analytic Dashboard - Delete"
                checked={selectedCheckboxes.some(item => item.value === 'Analytic Dashboard - Delete')}
                onChange={() => handleCheckboxChange('Analytic Dashboard - Delete')}
              />
                <label className='p-3' htmlFor="Analytic Dashboard - Delete"></label>

            </div>
          </td>

          <td>
            <div className='input-group'>
              <input
                type="checkbox"
                id="Analytic Dashboard - View"
                name="vehicle1"
                value="Analytic Dashboard - View"
                checked={selectedCheckboxes.some(item => item.value === 'Analytic Dashboard - View')}
                onChange={() => handleCheckboxChange('Analytic Dashboard - View')}
              />
                <label className='p-3' htmlFor="Analytic Dashboard - View"></label>
            </div>
                                    
          </td>
      </tr>

      {/* --------------------------------------BREAK ------------------------------*/}

      <tr>
      <td><h3>Administrator</h3>
          <td>Master List</td>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Master List - Add"
              name="vehicle1"
              value="Master List - Add"
              checked={selectedCheckboxes.some(item => item.value === 'Master List - Add')}
              onChange={() => handleCheckboxChange('Master List - Add')}
            />
              <label className='p-3' htmlFor="Master List - Add"></label>

          </div>
        </td>


        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Master List - Edit"
              name="vehicle1"
              value="Master List - Edit"
              checked={selectedCheckboxes.some(item => item.value === 'Master List - Edit')}
              onChange={() => handleCheckboxChange('Master List - Edit')}
            />
              <label className='p-3' htmlFor="Master List - Edit"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Master List - Delete"
              name="vehicle1"
              value="Master List - Delete"
              checked={selectedCheckboxes.some(item => item.value === 'Master List - Delete')}
              onChange={() => handleCheckboxChange('Master List - Delete')}
            />
              <label className='p-3' htmlFor="Master List - Delete"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Master List - View"
              name="vehicle1"
              value="Master List - View"
              checked={selectedCheckboxes.some(item => item.value === 'Master List - View')}
              onChange={() => handleCheckboxChange('Master List - View')}
            />
              <label className='p-3' htmlFor="Master List - View"></label>

          </div>
        </td>          
      </tr>

      <tr>
        <td>
          <td>
            Employee Position
          </td> 
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Employee Position - Add"
              name="vehicle1"
              value="Employee Position - Add"
              checked={selectedCheckboxes.some(item => item.value === 'Employee Position - Add')}
              onChange={() => handleCheckboxChange('Employee Position - Add')}
            />
              <label className='p-3' htmlFor="Employee Position - Add"></label>

          </div>
        </td>


        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Employee Position - Edit"
              name="vehicle1"
              value="Employee Position - Edit"
              checked={selectedCheckboxes.some(item => item.value === 'Employee Position - Edit')}
              onChange={() => handleCheckboxChange('Employee Position - Edit')}
            />
              <label className='p-3' htmlFor="Employee Position - Edit"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Employee Position - Delete"
              name="vehicle1"
              value="Employee Position - Delete"
              checked={selectedCheckboxes.some(item => item.value === 'Employee Position - Delete')}
              onChange={() => handleCheckboxChange('Employee Position - Delete')}
            />
              <label className='p-3' htmlFor="Employee Position - Delete"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Employee Position - View"
              name="vehicle1"
              value="Employee Position - View"
              checked={selectedCheckboxes.some(item => item.value === 'Employee Position - View')}
              onChange={() => handleCheckboxChange('Employee Position - View')}
            />
              <label className='p-3' htmlFor="Employee Position - View"></label>

          </div>
        </td>
      </tr>


      <tr>
        <td>
          <td>
            User Access Role
          </td>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="User Access Role - Add"
              name="vehicle1"
              value="User Access Role - Add"
              checked={selectedCheckboxes.some(item => item.value === 'User Access Role - Add')}
              onChange={() => handleCheckboxChange('User Access Role - Add')}
            />
              <label className='p-3' htmlFor="User Access Role - Add"></label>

          </div>
        </td>


        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="User Access Role - Edit"
              name="vehicle1"
              value="User Access Role - Edit"
              checked={selectedCheckboxes.some(item => item.value === 'User Access Role - Edit')}
              onChange={() => handleCheckboxChange('User Access Role - Edit')}
            />
              <label className='p-3' htmlFor="User Access Role - Edit"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="User Access Role - Delete"
              name="vehicle1"
              value="User Access Role - Delete"
              checked={selectedCheckboxes.some(item => item.value === 'User Access Role - Delete')}
              onChange={() => handleCheckboxChange('User Access Role - Delete')}
            />
              <label className='p-3' htmlFor="User Access Role - Delete"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="User Access Role - View"
              name="vehicle1"
              value="User Access Role - View"
              checked={selectedCheckboxes.some(item => item.value === 'User Access Role - View')}
              onChange={() => handleCheckboxChange('User Access Role - View')}
            />
              <label className='p-3' htmlFor="User Access Role - View"></label>

          </div>
        </td>
      </tr>

      <tr>
          <td>
            <td>
              Product List
            </td>

          </td>

          <td> 
            <div className='input-group'>
              <input
                type="checkbox"
                id="Product List - Add"
                name="vehicle1"
                value="Product List - Add"
                checked={selectedCheckboxes.some(item => item.value === 'Product List - Add')}
                onChange={() => handleCheckboxChange('Product List - Add')}
              />
                <label className='p-3' htmlFor="Product List - Add"></label>

            </div>
          </td>


          <td> 
            <div className='input-group'>
              <input
                type="checkbox"
                id="Product List - Edit"
                name="vehicle1"
                value="Product List - Edit"
                checked={selectedCheckboxes.some(item => item.value === 'Product List - Edit')}
                onChange={() => handleCheckboxChange('Product List - Edit')}
              />
                <label className='p-3' htmlFor="Product List - Edit"></label>

            </div>
          </td>

          <td> 
            <div className='input-group'>
              <input
                type="checkbox"
                id="Product List - Delete"
                name="vehicle1"
                value="Product List - Delete"
                checked={selectedCheckboxes.some(item => item.value === 'Product List - Delete')}
                onChange={() => handleCheckboxChange('Product List - Delete')}
              />
                <label className='p-3' htmlFor="Product List - Delete"></label>

            </div>
          </td>

          <td> 
            <div className='input-group'>
              <input
                type="checkbox"
                id="Product List - View"
                name="vehicle1"
                value="Product List - View"
                checked={selectedCheckboxes.some(item => item.value === 'Product List - View')}
                onChange={() => handleCheckboxChange('Product List - View')}
              />
                <label className='p-3' htmlFor="Product List - View"></label>

            </div>
          </td>
      </tr>

      <tr>
        <td>
          <td>
            Product Categories
          </td>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Product Categories - Add"
              name="vehicle1"
              value="Product Categories - Add"
              checked={selectedCheckboxes.some(item => item.value === 'Product Categories - Add')}
              onChange={() => handleCheckboxChange('Product Categories - Add')}
            />
              <label className='p-3' htmlFor="Product Categories - Add"></label>

          </div>
        </td>


        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Product Categories - Edit"
              name="vehicle1"
              value="Product Categories - Edit"
              checked={selectedCheckboxes.some(item => item.value === 'Product Categories - Edit')}
              onChange={() => handleCheckboxChange('Product Categories - Edit')}
            />
              <label className='p-3' htmlFor="Product Categories - Edit"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Product Categories - Delete"
              name="vehicle1"
              value="Product Categories - Delete"
              checked={selectedCheckboxes.some(item => item.value === 'Product Categories - Delete')}
              onChange={() => handleCheckboxChange('Product Categories - Delete')}
            />
              <label className='p-3' htmlFor="Product Categories - Delete"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Product Categories - View"
              name="vehicle1"
              value="Product Categories - View"
              checked={selectedCheckboxes.some(item => item.value === 'Product Categories - View')}
              onChange={() => handleCheckboxChange('Product Categories - View')}
            />
              <label className='p-3' htmlFor="Product Categories - View"></label>

          </div>
        </td>
      </tr>


      <tr>
        <td>
          <td>
            Bin Location
          </td>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Bin Location - Add"
              name="vehicle1"
              value="Bin Location - Add"
              checked={selectedCheckboxes.some(item => item.value === 'Bin Location - Add')}
              onChange={() => handleCheckboxChange('Bin Location - Add')}
            />
              <label className='p-3' htmlFor="Bin Location - Add"></label>

          </div>
        </td>


        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Bin Location - Edit"
              name="vehicle1"
              value="Bin Location - Edit"
              checked={selectedCheckboxes.some(item => item.value === 'Bin Location - Edit')}
              onChange={() => handleCheckboxChange('Bin Location - Edit')}
            />
              <label className='p-3' htmlFor="Bin Location - Edit"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Bin Location - Delete"
              name="vehicle1"
              value="Bin Location - Delete"
              checked={selectedCheckboxes.some(item => item.value === 'Bin Location - Delete')}
              onChange={() => handleCheckboxChange('Bin Location - Delete')}
            />
              <label className='p-3' htmlFor="Bin Location - Delete"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Bin Location - View"
              name="vehicle1"
              value="Bin Location - View"
              checked={selectedCheckboxes.some(item => item.value === 'Bin Location - View')}
              onChange={() => handleCheckboxChange('Bin Location - View')}
            />
              <label className='p-3' htmlFor="Bin Location - View"></label>

          </div>
        </td>
      </tr>

      <tr>
        <td>
          <td>
            Cost Centre
          </td>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Cost Centre - Add"
              name="vehicle1"
              value="Cost Centre - Add"
              checked={selectedCheckboxes.some(item => item.value === 'Cost Centre - Add')}
              onChange={() => handleCheckboxChange('Cost Centre - Add')}
            />
              <label className='p-3' htmlFor="Cost Centre - Add"></label>

          </div>
        </td>


        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Cost Centre - Edit"
              name="vehicle1"
              value="Cost Centre - Edit"
              checked={selectedCheckboxes.some(item => item.value === 'Cost Centre - Edit')}
              onChange={() => handleCheckboxChange('Cost Centre - Edit')}
            />
              <label className='p-3' htmlFor="Cost Centre - Edit"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Cost Centre - Delete"
              name="vehicle1"
              value="Cost Centre - Delete"
              checked={selectedCheckboxes.some(item => item.value === 'Cost Centre - Delete')}
              onChange={() => handleCheckboxChange('Cost Centre - Delete')}
            />
              <label className='p-3' htmlFor="Cost Centre - Delete"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Cost Centre - View"
              name="vehicle1"
              value="Cost Centre - View"
              checked={selectedCheckboxes.some(item => item.value === 'Cost Centre - View')}
              onChange={() => handleCheckboxChange('Cost Centre - View')}
            />
              <label className='p-3' htmlFor="Cost Centre - View"></label>

          </div>
        </td>
      </tr>

      <tr>
        <td>
          <td>
            Supplier
          </td>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Supplier - Add"
              name="vehicle1"
              value="Supplier - Add"
              checked={selectedCheckboxes.some(item => item.value === 'Supplier - Add')}
              onChange={() => handleCheckboxChange('Supplier - Add')}
            />
              <label className='p-3' htmlFor="Supplier - Add"></label>

          </div>
        </td>


        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Supplier - Edit"
              name="vehicle1"
              value="Supplier - Edit"
              checked={selectedCheckboxes.some(item => item.value === 'Supplier - Edit')}
              onChange={() => handleCheckboxChange('Supplier - Edit')}
            />
              <label className='p-3' htmlFor="Supplier - Edit"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Supplier - Delete"
              name="vehicle1"
              value="Supplier - Delete"
              checked={selectedCheckboxes.some(item => item.value === 'Supplier - Delete')}
              onChange={() => handleCheckboxChange('Supplier - Delete')}
            />
              <label className='p-3' htmlFor="Supplier - Delete"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Supplier - View"
              name="vehicle1"
              value="Supplier - View"
              checked={selectedCheckboxes.some(item => item.value === 'Supplier - View')}
              onChange={() => handleCheckboxChange('Supplier - View')}
            />
              <label className='p-3' htmlFor="Supplier - View"></label>

          </div>
        </td>
      </tr>

      <tr>
        <td>
          <td>
            Asset Monitoring
          </td>
          
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Asset Monitoring - Add"
              name="vehicle1"
              value="Asset Monitoring - Add"
              checked={selectedCheckboxes.some(item => item.value === 'Asset Monitoring - Add')}
              onChange={() => handleCheckboxChange('Asset Monitoring - Add')}
            />
              <label className='p-3' htmlFor="Asset Monitoring - Add"></label>

          </div>
        </td>


        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Asset Monitoring - Edit"
              name="vehicle1"
              value="Asset Monitoring - Edit"
              checked={selectedCheckboxes.some(item => item.value === 'Asset Monitoring - Edit')}
              onChange={() => handleCheckboxChange('Asset Monitoring - Edit')}
            />
              <label className='p-3' htmlFor="Asset Monitoring - Edit"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Asset Monitoring - Delete"
              name="vehicle1"
              value="Asset Monitoring - Delete"
              checked={selectedCheckboxes.some(item => item.value === 'Asset Monitoring - Delete')}
              onChange={() => handleCheckboxChange('Asset Monitoring - Delete')}
            />
              <label className='p-3' htmlFor="Asset Monitoring - Delete"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Asset Monitoring - View"
              name="vehicle1"
              value="Asset Monitoring - View"
              checked={selectedCheckboxes.some(item => item.value === 'Asset Monitoring - View')}
              onChange={() => handleCheckboxChange('Asset Monitoring - View')}
            />
              <label className='p-3' htmlFor="Asset Monitoring - View"></label>

          </div>
        </td>
      </tr>

      <tr>
        <td><h3>Inventory</h3>
          <td>Item Master Data</td>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Item Master Data - Add"
              name="vehicle1"
              value="Item Master Data - Add"
              checked={selectedCheckboxes.some(item => item.value === 'Item Master Data - Add')}
              onChange={() => handleCheckboxChange('Item Master Data - Add')}
            />
              <label className='p-3' htmlFor="Item Master Data - Add"></label>

          </div>
        </td>


        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Item Master Data - Edit"
              name="vehicle1"
              value="Item Master Data - Edit"
              checked={selectedCheckboxes.some(item => item.value === 'Item Master Data - Edit')}
              onChange={() => handleCheckboxChange('Item Master Data - Edit')}
            />
              <label className='p-3' htmlFor="Item Master Data - Edit"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Item Master Data - Delete"
              name="vehicle1"
              value="Item Master Data - Delete"
              checked={selectedCheckboxes.some(item => item.value === 'Item Master Data - Delete')}
              onChange={() => handleCheckboxChange('Item Master Data - Delete')}
            />
              <label className='p-3' htmlFor="Item Master Data - Delete"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Item Master Data - View"
              name="vehicle1"
              value="Item Master Data - View"
              checked={selectedCheckboxes.some(item => item.value === 'Item Master Data - View')}
              onChange={() => handleCheckboxChange('Item Master Data - View')}
            />
              <label className='p-3' htmlFor="Item Master Data - View"></label>

          </div>
        </td>
      </tr>

      <tr>
        <td>
          <td>
            Inventory Type
          </td>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Inventory Type - Add"
              name="vehicle1"
              value="Inventory Type - Add"
              checked={selectedCheckboxes.some(item => item.value === 'Inventory Type - Add')}
              onChange={() => handleCheckboxChange('Inventory Type - Add')}
            />
              <label className='p-3' htmlFor="Inventory Type - Add"></label>

          </div>
        </td>


        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Inventory Type - Edit"
              name="vehicle1"
              value="Inventory Type - Edit"
              checked={selectedCheckboxes.some(item => item.value === 'Inventory Type - Edit')}
              onChange={() => handleCheckboxChange('Inventory Type - Edit')}
            />
              <label className='p-3' htmlFor="Inventory Type - Edit"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Inventory Type - Delete"
              name="vehicle1"
              value="Inventory Type - Delete"
              checked={selectedCheckboxes.some(item => item.value === 'Inventory Type - Delete')}
              onChange={() => handleCheckboxChange('Inventory Type - Delete')}
            />
              <label className='p-3' htmlFor="Inventory Type - Delete"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Inventory Type - View"
              name="vehicle1"
              value="Inventory Type - View"
              checked={selectedCheckboxes.some(item => item.value === 'Inventory Type - View')}
              onChange={() => handleCheckboxChange('Inventory Type - View')}
            />
              <label className='p-3' htmlFor="Inventory Type - View"></label>

          </div>
        </td>
      </tr>

      <tr>
        <td><h3>Purchase Order Interface</h3>
          <td>
            PO Transaction
          </td>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="PO Transaction - Add"
              name="vehicle1"
              value="PO Transaction - Add"
              checked={selectedCheckboxes.some(item => item.value === 'PO Transaction - Add')}
              onChange={() => handleCheckboxChange('PO Transaction - Add')}
            />
              <label className='p-3' htmlFor="PO Transaction - Add"></label>

          </div>
        </td>


        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="PO Transaction - Edit"
              name="vehicle1"
              value="PO Transaction - Edit"
              checked={selectedCheckboxes.some(item => item.value === 'PO Transaction - Edit')}
              onChange={() => handleCheckboxChange('PO Transaction - Edit')}
            />
              <label className='p-3' htmlFor="PO Transaction - Edit"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="PO Transaction - Delete"
              name="vehicle1"
              value="PO Transaction - Delete"
              checked={selectedCheckboxes.some(item => item.value === 'PO Transaction - Delete')}
              onChange={() => handleCheckboxChange('PO Transaction - Delete')}
            />
              <label className='p-3' htmlFor="PO Transaction - Delete"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="PO Transaction - View"
              name="vehicle1"
              value="PO Transaction - View"
              checked={selectedCheckboxes.some(item => item.value === 'PO Transaction - View')}
              onChange={() => handleCheckboxChange('PO Transaction - View')}
            />
              <label className='p-3' htmlFor="PO Transaction - View"></label>

          </div>
        </td>
      </tr>

      <tr>
        <td>
          <td>Invoice</td>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Invoice - Add"
              name="vehicle1"
              value="Invoice - Add"
              checked={selectedCheckboxes.some(item => item.value === 'Invoice - Add')}
              onChange={() => handleCheckboxChange('Invoice - Add')}
            />
              <label className='p-3' htmlFor="Invoice - Add"></label>

          </div>
        </td>


        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Invoice - Edit"
              name="vehicle1"
              value="Invoice - Edit"
              checked={selectedCheckboxes.some(item => item.value === 'Invoice - Edit')}
              onChange={() => handleCheckboxChange('Invoice - Edit')}
            />
              <label className='p-3' htmlFor="Invoice - Edit"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Invoice - Delete"
              name="vehicle1"
              value="Invoice - Delete"
              checked={selectedCheckboxes.some(item => item.value === 'Invoice - Delete')}
              onChange={() => handleCheckboxChange('Invoice - Delete')}
            />
              <label className='p-3' htmlFor="Invoice - Delete"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Invoice - View"
              name="vehicle1"
              value="Invoice - View"
              checked={selectedCheckboxes.some(item => item.value === 'Invoice - View')}
              onChange={() => handleCheckboxChange('Invoice - View')}
            />
              <label className='p-3' htmlFor="Invoice - View"></label>

          </div>
        </td>
      </tr>

      <tr>
        <td> <h3>Warehouse</h3>
          <td>Warehouse Master List</td>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Warehouse Master List - Add"
              name="vehicle1"
              value="Warehouse Master List - Add"
              checked={selectedCheckboxes.some(item => item.value === 'Warehouse Master List - Add')}
              onChange={() => handleCheckboxChange('Warehouse Master List - Add')}
            />
              <label className='p-3' htmlFor="Warehouse Master List - Add"></label>

          </div>
        </td>


        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Warehouse Master List - Edit"
              name="vehicle1"
              value="Warehouse Master List - Edit"
              checked={selectedCheckboxes.some(item => item.value === 'Warehouse Master List - Edit')}
              onChange={() => handleCheckboxChange('Warehouse Master List - Edit')}
            />
              <label className='p-3' htmlFor="Warehouse Master List - Edit"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Warehouse Master List - Delete"
              name="vehicle1"
              value="Warehouse Master List - Delete"
              checked={selectedCheckboxes.some(item => item.value === 'Warehouse Master List - Delete')}
              onChange={() => handleCheckboxChange('Warehouse Master List - Delete')}
            />
              <label className='p-3' htmlFor="Warehouse Master List - Delete"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Warehouse Master List - View"
              name="vehicle1"
              value="Warehouse Master List - View"
              checked={selectedCheckboxes.some(item => item.value === 'Warehouse Master List - View')}
              onChange={() => handleCheckboxChange('Warehouse Master List - View')}
            />
              <label className='p-3' htmlFor="Warehouse Master List - View"></label>

          </div>
        </td>
      </tr>

      <tr>
        <td>
          <td>Quality Check</td>
        </td>

          <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Quality Check - Add"
              name="vehicle1"
              value="Quality Check - Add"
              checked={selectedCheckboxes.some(item => item.value === 'Quality Check - Add')}
              onChange={() => handleCheckboxChange('Quality Check - Add')}
            />
              <label className='p-3' htmlFor="Quality Check - Add"></label>

          </div>
          </td>


          <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Quality Check - Edit"
              name="vehicle1"
              value="Quality Check - Edit"
              checked={selectedCheckboxes.some(item => item.value === 'Quality Check - Edit')}
              onChange={() => handleCheckboxChange('Quality Check - Edit')}
            />
              <label className='p-3' htmlFor="Quality Check - Edit"></label>

          </div>
          </td>

          <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Quality Check - Delete"
              name="vehicle1"
              value="Quality Check - Delete"
              checked={selectedCheckboxes.some(item => item.value === 'Quality Check - Delete')}
              onChange={() => handleCheckboxChange('Quality Check - Delete')}
            />
              <label className='p-3' htmlFor="Quality Check - Delete"></label>

          </div>
          </td>

          <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Quality Check - View"
              name="vehicle1"
              value="Quality Check - View"
              checked={selectedCheckboxes.some(item => item.value === 'Quality Check - View')}
              onChange={() => handleCheckboxChange('Quality Check - View')}
            />
              <label className='p-3' htmlFor="Quality Check - View"></label>

          </div>
          </td>
      </tr>

      <tr>
        <td>
          <td>Receiving</td>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Receiving - Add"
              name="vehicle1"
              value="Receiving - Add"
              checked={selectedCheckboxes.some(item => item.value === 'Receiving - Add')}
              onChange={() => handleCheckboxChange('Receiving - Add')}
            />
              <label className='p-3' htmlFor="Receiving - Add"></label>

          </div>
        </td>


        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Receiving - Edit"
              name="vehicle1"
              value="Receiving - Edit"
              checked={selectedCheckboxes.some(item => item.value === 'Receiving - Edit')}
              onChange={() => handleCheckboxChange('Receiving - Edit')}
            />
              <label className='p-3' htmlFor="Receiving - Edit"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Receiving - Delete"
              name="vehicle1"
              value="Receiving - Delete"
              checked={selectedCheckboxes.some(item => item.value === 'Receiving - Delete')}
              onChange={() => handleCheckboxChange('Receiving - Delete')}
            />
              <label className='p-3' htmlFor="Receiving - Delete"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Receiving - View"
              name="vehicle1"
              value="Receiving - View"
              checked={selectedCheckboxes.some(item => item.value === 'Receiving - View')}
              onChange={() => handleCheckboxChange('Receiving - View')}
            />
              <label className='p-3' htmlFor="Receiving - View"></label>

          </div>
        </td>
      </tr>

      <tr>
        <td>
          <td>Stock Management</td>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Stock Management - Add"
              name="vehicle1"
              value="Stock Management - Add"
              checked={selectedCheckboxes.some(item => item.value === 'Stock Management - Add')}
              onChange={() => handleCheckboxChange('Stock Management - Add')}
            />
              <label className='p-3' htmlFor="Stock Management - Add"></label>

          </div>
        </td>


        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Stock Management - Edit"
              name="vehicle1"
              value="Stock Management - Edit"
              checked={selectedCheckboxes.some(item => item.value === 'Stock Management - Edit')}
              onChange={() => handleCheckboxChange('Stock Management - Edit')}
            />
              <label className='p-3' htmlFor="Stock Management - Edit"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Stock Management - Delete"
              name="vehicle1"
              value="Stock Management - Delete"
              checked={selectedCheckboxes.some(item => item.value === 'Stock Management - Delete')}
              onChange={() => handleCheckboxChange('Stock Management - Delete')}
            />
              <label className='p-3' htmlFor="Stock Management - Delete"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Stock Management - View"
              name="vehicle1"
              value="Stock Management - View"
              checked={selectedCheckboxes.some(item => item.value === 'Stock Management - View')}
              onChange={() => handleCheckboxChange('Stock Management - View')}
            />
              <label className='p-3' htmlFor="Stock Management - View"></label>

          </div>
        </td>
      </tr>

      <tr>
        <td><h3>Asset Monitoring</h3>
          <td>
            Asset List
          </td>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Asset List - Add"
              name="vehicle1"
              value="Asset List - Add"
              checked={selectedCheckboxes.some(item => item.value === 'Asset List - Add')}
              onChange={() => handleCheckboxChange('Asset List - Add')}
            />
              <label className='p-3' htmlFor="Asset List - Add"></label>

          </div>
        </td>


        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Asset List - Edit"
              name="vehicle1"
              value="Asset List - Edit"
              checked={selectedCheckboxes.some(item => item.value === 'Asset List - Edit')}
              onChange={() => handleCheckboxChange('Asset List - Edit')}
            />
              <label className='p-3' htmlFor="Asset List - Edit"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Asset List - Delete"
              name="vehicle1"
              value="Asset List - Delete"
              checked={selectedCheckboxes.some(item => item.value === 'Asset List - Delete')}
              onChange={() => handleCheckboxChange('Asset List - Delete')}
            />
              <label className='p-3' htmlFor="Asset List - Delete"></label>

          </div>
        </td>

        <td> 
          <div className='input-group'>
            <input
              type="checkbox"
              id="Asset List - View"
              name="vehicle1"
              value="Asset List - View"
              checked={selectedCheckboxes.some(item => item.value === 'Asset List - View')}
              onChange={() => handleCheckboxChange('Asset List - View')}
            />
              <label className='p-3' htmlFor="Asset List - View"></label>

          </div>
        </td>
      </tr>

      <tr>
        <td> <h3>Activity Module</h3>
           <td>Activity Log</td>
        </td>

            <td> 
            <div className='input-group'>
              <input
                type="checkbox"
                id="Activity Log - Add"
                name="vehicle1"
                value="Activity Log - Add"
                checked={selectedCheckboxes.some(item => item.value === 'Activity Log - Add')}
                onChange={() => handleCheckboxChange('Activity Log - Add')}
              />
                <label className='p-3' htmlFor="Activity Log - Add"></label>

            </div>
            </td>


            <td> 
            <div className='input-group'>
              <input
                type="checkbox"
                id="Activity Log - Edit"
                name="vehicle1"
                value="Activity Log - Edit"
                checked={selectedCheckboxes.some(item => item.value === 'Activity Log - Edit')}
                onChange={() => handleCheckboxChange('Activity Log - Edit')}
              />
                <label className='p-3' htmlFor="Activity Log - Edit"></label>

            </div>
            </td>

            <td> 
            <div className='input-group'>
              <input
                type="checkbox"
                id="Activity Log - Delete"
                name="vehicle1"
                value="Activity Log - Delete"
                checked={selectedCheckboxes.some(item => item.value === 'Activity Log - Delete')}
                onChange={() => handleCheckboxChange('Activity Log - Delete')}
              />
                <label className='p-3' htmlFor="Activity Log - Delete"></label>

            </div>
            </td>

            <td> 
            <div className='input-group'>
              <input
                type="checkbox"
                id="Activity Log - View"
                name="vehicle1"
                value="Activity Log - View"
                checked={selectedCheckboxes.some(item => item.value === 'Activity Log - View')}
                onChange={() => handleCheckboxChange('Activity Log - View')}
              />
                <label className='p-3' htmlFor="Activity Log - View"></label>

            </div>
            </td>
      </tr>

      <tr>
          <td>
            <td>Audit Trail</td>
          </td>

          <td> 
            <div className='input-group'>
              <input
                type="checkbox"
                id="Audit Trail - Add"
                name="vehicle1"
                value="Audit Trail - Add"
                checked={selectedCheckboxes.some(item => item.value === 'Audit Trail - Add')}
                onChange={() => handleCheckboxChange('Audit Trail - Add')}
              />
                <label className='p-3' htmlFor="Audit Trail - Add"></label>

            </div>
          </td>


          <td> 
            <div className='input-group'>
              <input
                type="checkbox"
                id="Audit Trail - Edit"
                name="vehicle1"
                value="Audit Trail - Edit"
                checked={selectedCheckboxes.some(item => item.value === 'Audit Trail - Edit')}
                onChange={() => handleCheckboxChange('Audit Trail - Edit')}
              />
                <label className='p-3' htmlFor="Audit Trail - Edit"></label>

            </div>
          </td>

          <td> 
            <div className='input-group'>
              <input
                type="checkbox"
                id="Audit Trail - Delete"
                name="vehicle1"
                value="Audit Trail - Delete"
                checked={selectedCheckboxes.some(item => item.value === 'Audit Trail - Delete')}
                onChange={() => handleCheckboxChange('Audit Trail - Delete')}
              />
                <label className='p-3' htmlFor="Audit Trail - Delete"></label>

            </div>
          </td>

          <td> 
            <div className='input-group'>
              <input
                type="checkbox"
                id="Audit Trail - View"
                name="vehicle1"
                value="Audit Trail - View"
                checked={selectedCheckboxes.some(item => item.value === 'Audit Trail - View')}
                onChange={() => handleCheckboxChange('Audit Trail - View')}
              />
                <label className='p-1' htmlFor="Audit Trail - View"></label>

            </div>
          </td>
      </tr>




     
    </tbody>
  </table>


                             

                              
                              <div className='d-flex flex-row mt-4'>
                              <Row>
                                <Col>
                                  <div>
                                    <Link to="/userRole" className=' btn_saveCancel btn btn-danger align-right'>Back</Link>
                                  </div>
                                </Col>
                                <Col>
                                  <div >
                                    <Button type="submit" className='btn_saveCancel' variant="primary border-secondary">
                                      Modify
                                    </Button>
                                  </div>
                                  
                                </Col>
                              </Row>
                              </div>           
                            </div>    
                        </form>     
                    </div>  
                   
                  </div>
              </div>
            </div>
                
        </div>
                
      </div>
    </div>  
    
  )
}

export default EditRole