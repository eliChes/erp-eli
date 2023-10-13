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
    axios.get(BASE_URL + `/fetchuserroleEDIT/${id}`)
      .then(res => {
        setRole(res.data); // Assuming the response is an array with a single object
        setRolename(res.data.col_rolename); // Set the Role Name
        setDesc(res.data.col_desc); // Set the Description
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
  
  
  
  console.log('dasd' + role)


// Inserting to database checkboxes

const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

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
      "Analytic Dashboard",
      "BP Master Data - Supplier Delete",
      "Transfer Out Interface",
      "MasterList",
      "Commodity Settings - Categories Add",
      "Sub Branch Interface - Log-in",
      "RBAC (Role-based Access Control) List",
      "Commodity Settings - Categories Edit",
      "Sub Branch interface - Dashboard",
      "BP Master Data - Customer Add",
      "Commodity Settings - Categories Delete",
      "Sub Branch interface - Batch List",
      "BP Master Data - Customer Edit",
      "Commodities Interface - Batch List Add",
      "Sub Branch interface - Type Sorting",
      "BP Master Data - Customer Delete",
      "Commodities Interface - Type Sorting",
      "Sub Branch interface - Shredding",
      "BP Master Data - Supplier Add",
      "Inventory Interface View",
      "Transfer Out Interface",
      "Warehouse master list",
      "Report Interface",
      "BP Master Data - Supplier Edit"
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
                            
                              <div className='p-2'>
                                <Row>
                                      <Col>
                                        <div className='input-group'>
                                        <input
                                          type="checkbox"
                                          id="Analytic Dashboard"
                                          name="vehicle1"
                                          value="Analytic Dashboard"
                                          checked={selectedCheckboxes.some(item => item.value === 'Analytic Dashboard')}
                                          onChange={() => handleCheckboxChange('Analytic Dashboard')}
                                        />

                                          <label className='p-1' htmlFor="Analytic Dashboard">Analytic Dashboard</label>

                                        </div>
                                      </Col>
                                      <Col>
                                        <div className='input-group'>
                                            <input
                                              type="checkbox"
                                              id="BP Master Data - Supplier Delete"
                                              name="vehicle2"
                                              value="BP Master Data - Supplier Delete"
                                              checked={selectedCheckboxes.some(item => item.value === 'BP Master Data - Supplier Delete')}
                                              onChange={() => handleCheckboxChange('BP Master Data - Supplier Delete')}
                                            />
                                            <label className='p-1' htmlFor="BP Master Data - Supplier Delete">BP Master Data - Supplier Delete</label>
                                        </div>
                                      </Col>
                                      <Col>
                                        <div className='input-group'>

                                            <input
                                              type="checkbox"
                                              id="Transfer Out Interface<"
                                              name="vehicle2"
                                              value="Transfer Out Interface"
                                              checked={selectedCheckboxes.some(item => item.value === 'Transfer Out Interface')}
                                              onChange={() => handleCheckboxChange('Transfer Out Interface')}
                                            />
                                            <label className='p-1' htmlFor="Transfer Out Interface<">Transfer Out Interface</label>
                                          
                                        </div>
                                      </Col>
                                </Row>

                              </div>


                              <div className='p-2'>
                                <Row>
                                      <Col>
                                        <div className='input-group'>
                                            <input
                                              type="checkbox"
                                              id="MasterList"
                                              name="vehicle2"
                                              value="MasterList"
                                              checked={selectedCheckboxes.some(item => item.value === 'MasterList')}
                                              onChange={() => handleCheckboxChange('MasterList')}
                                            />
                                          <label className='p-1' for="MasterList">MasterList</label>
                                        </div>
                                      </Col>
                                      <Col>
                                        <div className='input-group'>
                                          <input
                                              type="checkbox"
                                              id="Commodity Settings - Categories Add"
                                              name="vehicle2"
                                              value="Commodity Settings - Categories Add"
                                              checked={selectedCheckboxes.some(item => item.value === 'Commodity Settings - Categories Add')}
                                              onChange={() => handleCheckboxChange('Commodity Settings - Categories Add')}
                                            />
                                          <label className='p-1' for="Commodity Settings - Categories Add">Commodity Settings - Categories Add</label>
                                        </div>
                                      </Col>
                                      <Col>
                                        <div className='input-group'>
                                          <input
                                              type="checkbox"
                                              id="Sub Branch Interface - Log-in"
                                              name="vehicle2"
                                              value="Sub Branch Interface - Log-in"
                                              checked={selectedCheckboxes.some(item => item.value === 'Sub Branch Interface - Log-in')}
                                              onChange={() => handleCheckboxChange('Sub Branch Interface - Log-in')}
                                            />
                                          <label className='p-1' for="Sub Branch Interface - Log-in">Sub Branch Interface - Log-in</label>
                                        </div>
                                      </Col>
                                </Row>

                              </div>



                              <div className='p-2'>
                                <Row>
                                      <Col>
                                        <div className='input-group'>
                                          <input
                                              type="checkbox"
                                              id="RBAC (Role-based Access Control) List"
                                              name="vehicle2"
                                              value="RBAC (Role-based Access Control) List"
                                              checked={selectedCheckboxes.some(item => item.value === 'RBAC (Role-based Access Control) List')}
                                              onChange={() => handleCheckboxChange('RBAC (Role-based Access Control) List')}
                                            />
                                          <label className='p-1' for="RBAC (Role-based Access Control) List">RBAC (Role-based Access Control) List</label>
                                        </div>
                                      </Col>
                                      <Col>
                                        <div className='input-group'>
                                            <input
                                              type="checkbox"
                                              id="Commodity Settings - Categories Edit"
                                              name="vehicle2"
                                              value="Commodity Settings - Categories Edit"
                                              checked={selectedCheckboxes.some(item => item.value === 'Commodity Settings - Categories Edit')}
                                              onChange={() => handleCheckboxChange('Commodity Settings - Categories Edit')}
                                            />
                                          <label className='p-1' for="Commodity Settings - Categories Edit">Commodity Settings - Categories Edit</label>
                                        </div>
                                      </Col>
                                      <Col>
                                        <div className='input-group'>
                                            <input
                                              type="checkbox"
                                              id="Sub Branch interface - Dashboard"
                                              name="vehicle2"
                                              value="Sub Branch interface - Dashboard"
                                              checked={selectedCheckboxes.some(item => item.value === 'Sub Branch interface - Dashboard')}
                                              onChange={() => handleCheckboxChange('Sub Branch interface - Dashboard')}
                                            />
                                          <label className='p-1' for="Sub Branch interface - Dashboard">Sub Branch interface - Dashboard</label>
                                        </div>
                                      </Col>
                                </Row>

                              </div>

                              <div className='p-2'>
                                <Row>
                                      <Col>
                                        <div className='input-group'>
                                            <input
                                              type="checkbox"
                                              id="BP Master Data - Customer Add"
                                              name="vehicle2"
                                              value="BP Master Data - Customer Add"
                                              checked={selectedCheckboxes.some(item => item.value === 'BP Master Data - Customer Add')}
                                              onChange={() => handleCheckboxChange('BP Master Data - Customer Add')}
                                            />
                                          <label className='p-1' for="BP Master Data - Customer Add">BP Master Data - Customer Add</label>
                                        </div>
                                      </Col>
                                      <Col>
                                        <div className='input-group'>
                                            <input
                                              type="checkbox"
                                              id="Commodity Settings - Categories Delete"
                                              name="vehicle2"
                                              value="Commodity Settings - Categories Delete"
                                              checked={selectedCheckboxes.some(item => item.value === 'Commodity Settings - Categories Delete')}
                                              onChange={() => handleCheckboxChange('Commodity Settings - Categories Delete')}
                                            />
                                          <label className='p-1' for="Commodity Settings - Categories Delete">Commodity Settings - Categories Delete</label>
                                        </div>
                                      </Col>
                                      <Col>
                                        <div className='input-group'>
                                            <input
                                              type="checkbox"
                                              id="Sub Branch interface - Batch List"
                                              name="vehicle2"
                                              value="Sub Branch interface - Batch List"
                                              checked={selectedCheckboxes.some(item => item.value === 'Sub Branch interface - Batch List')}
                                              onChange={() => handleCheckboxChange('Sub Branch interface - Batch List')}
                                            />
                                          <label className='p-1' for="Sub Branch interface - Batch List">Sub Branch interface - Batch List</label>
                                        </div>
                                      </Col>
                                </Row>

                              </div>

                              <div className='p-2'>
                                <Row>
                                      <Col>
                                        <div className='input-group'>
                                            <input
                                              type="checkbox"
                                              id="BP Master Data - Customer Edit"
                                              name="vehicle2"
                                              value="BP Master Data - Customer Edit"
                                              checked={selectedCheckboxes.some(item => item.value === 'BP Master Data - Customer Edit')}
                                              onChange={() => handleCheckboxChange('BP Master Data - Customer Edit')}
                                            />
                                          <label className='p-1' for="BP Master Data - Customer Edit">BP Master Data - Customer Edit</label>
                                        </div>
                                      </Col>
                                      <Col>
                                        <div className='input-group'>
                                            <input
                                              type="checkbox"
                                              id="Commodities Interface - Batch List Add"
                                              name="vehicle2"
                                              value="Commodities Interface - Batch List Add"
                                              checked={selectedCheckboxes.some(item => item.value === 'Commodities Interface - Batch List Add')}
                                              onChange={() => handleCheckboxChange('Commodities Interface - Batch List Add')}
                                            />
                                          <label className='p-1' for="Commodities Interface - Batch List Add">Commodities Interface - Batch List Add</label>
                                        </div>
                                      </Col>
                                      <Col>
                                        <div className='input-group'>
                                            <input
                                              type="checkbox"
                                              id="Sub Branch interface - Type Sorting"
                                              name="vehicle2"
                                              value="Sub Branch interface - Type Sorting"
                                              checked={selectedCheckboxes.some(item => item.value === 'Sub Branch interface - Type Sorting')}
                                              onChange={() => handleCheckboxChange('Sub Branch interface - Type Sorting')}
                                            />
                                          <label className='p-1' for="Sub Branch interface - Type Sorting">Sub Branch interface - Type Sorting</label>
                                        </div>
                                      </Col>
                                </Row>

                              </div>

                              <div className='p-2'>
                                <Row>
                                      <Col>
                                        <div className='input-group'>
                                            <input
                                              type="checkbox"
                                              id="BP Master Data - Customer Delete"
                                              name="vehicle2"
                                              value="BP Master Data - Customer Delete"
                                              checked={selectedCheckboxes.some(item => item.value === 'BP Master Data - Customer Delete')}
                                              onChange={() => handleCheckboxChange('BP Master Data - Customer Delete')}
                                            />
                                          <label className='p-1' for="BP Master Data - Customer Delete">BP Master Data - Customer Delete</label>
                                        </div>
                                      </Col>
                                      <Col>
                                        <div className='input-group'>
                                            <input
                                              type="checkbox"
                                              id="Commodities Interface - Type Sorting<"
                                              name="vehicle2"
                                              value="Commodities Interface - Type Sorting"
                                              checked={selectedCheckboxes.some(item => item.value === 'Commodities Interface - Type Sorting')}
                                              onChange={() => handleCheckboxChange('Commodities Interface - Type Sorting')}
                                            />
                                          <label className='p-1' for="Commodities Interface - Type Sorting<">Commodities Interface - Type Sorting</label>
                                        </div>
                                      </Col>
                                      <Col>
                                        <div className='input-group'>
                                            <input
                                              type="checkbox"
                                              id="Sub Branch interface - Shredding"
                                              name="vehicle2"
                                              value="Sub Branch interface - Shredding"
                                              checked={selectedCheckboxes.some(item => item.value === 'Sub Branch interface - Shredding')}
                                              onChange={() => handleCheckboxChange('Sub Branch interface - Shredding')}
                                            />
                                          <label className='p-1' for="Sub Branch interface - Shredding">Sub Branch interface - Shredding</label>
                                        </div>
                                      </Col>
                                </Row>

                              </div>

                              <div className='p-2'>
                                <Row>
                                      <Col>
                                        <div className='input-group'>
                                            <input
                                              type="checkbox"
                                              id="BP Master Data - Supplier Add"
                                              name="vehicle2"
                                              value="BP Master Data - Supplier Add"
                                              checked={selectedCheckboxes.some(item => item.value === 'BP Master Data - Supplier Add')}
                                              onChange={() => handleCheckboxChange('BP Master Data - Supplier Add')}
                                            />
                                          <label className='p-1' for="BP Master Data - Supplier Add">BP Master Data - Supplier Add</label>
                                        </div>
                                      </Col>
                                      <Col>
                                        <div className='input-group'>
                                            <input
                                              type="checkbox"
                                              id="Inventory Interface View"
                                              name="vehicle2"
                                              value="Inventory Interface View"
                                              checked={selectedCheckboxes.some(item => item.value === 'Inventory Interface View')}
                                              onChange={() => handleCheckboxChange('Inventory Interface View')}
                                            />
                                          <label className='p-1' for="Inventory Interface View">Inventory Interface View</label>
                                        </div>
                                      </Col>
                                      <Col>
                                        <div className='input-group'>
                                            <input
                                              type="checkbox"
                                              id="Transfer Out Interface"
                                              name="vehicle2"
                                              value="Transfer Out Interface"
                                              checked={selectedCheckboxes.some(item => item.value === 'Transfer Out Interface')}
                                              onChange={() => handleCheckboxChange('Transfer Out Interface')}
                                            />
                                          <label className='p-1' for="Transfer Out Interface">Transfer Out Interface</label>
                                        </div>
                                      </Col>
                                </Row>

                              </div>

                              <div className='p-2'>
                                <Row>
                                      <Col>
                                        <div className='input-group'>
                                            <input
                                              type="checkbox"
                                              id="BP Master Data - Supplier Edit"
                                              name="vehicle2"
                                              value="BP Master Data - Supplier Edit"
                                              checked={selectedCheckboxes.some(item => item.value === 'BP Master Data - Supplier Edit')}
                                              onChange={() => handleCheckboxChange('BP Master Data - Supplier Edit')}
                                            />
                                          <label className='p-1' for="BP Master Data - Supplier Edit">BP Master Data - Supplier Edit</label>
                                        </div>
                                      </Col>
                                      <Col>
                                        <div className='input-group'>
                                            <input
                                              type="checkbox"
                                              id="Warehouse master list"
                                              name="vehicle2"
                                              value="Warehouse master list"
                                              checked={selectedCheckboxes.some(item => item.value === 'Warehouse master list')}
                                              onChange={() => handleCheckboxChange('Warehouse master list')}
                                            />
                                          <label className='p-1' for="Warehouse master list">Warehouse master list</label>
                                        </div>
                                      </Col>
                                      <Col>
                                        <div className='input-group'>
                                            <input
                                              type="checkbox"
                                              id="Report Interface"
                                              name="vehicle2"
                                              value="Report Interface"
                                              checked={selectedCheckboxes.some(item => item.value === 'Report Interface')}
                                              onChange={() => handleCheckboxChange('Report Interface')}
                                            />
                                          <label className='p-1' for="Report Interface">Report Interface</label>
                                        </div>
                                      </Col>
                                </Row>

                              </div> 

                             

                              
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