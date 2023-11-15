import React, {useState, useEffect} from 'react'
import Sidebar from '../../../../../Sidebar/sidebar';
import '../../../../../../assets/global/style.css';
import { Link, useNavigate } from 'react-router-dom';
import '../../../../../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import BASE_URL from '../../../../../../assets/global/url';
import swal from 'sweetalert';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import {
    Plus,
    Trash,
    NotePencil,
  } from "@phosphor-icons/react";



function CreateSpareParts() {

const [validated, setValidated] = useState(false);
const [fetchSupp, setFetchSupp] = useState([]);
const [fetchSubPart, setFetchSubPart] = useState([]);
const [code, setCode] = useState('');
const [name, setName] = useState('');
const [supp, setSupp] = useState([]);
const [desc, setDesc] = useState('');

// for display selected subPart in Table
const [SubParts, setSubParts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);


const navigate = useNavigate();




useEffect(() => {
  axios.get(BASE_URL + '/supplier/fetchTable')
    .then(res => setFetchSupp(res.data))
    .catch(err => console.log(err));
}, []);

useEffect(() => {
  axios.get(BASE_URL + '/subPart/fetchTable')
    .then(res => setFetchSubPart(res.data))
    .catch(err => console.log(err));
}, []);

//for supplier selection values
const handleSelectChange = (selectedOptions) => {
  setSupp(selectedOptions);
};

const handleSelectChange_SubPart = (selectedOptions) => {
  setSubParts(selectedOptions);
};

const handleAddSubPartClick = () => {
  setShowDropdown(true);
};

const add = async e => {
  e.preventDefault();

  const form = e.currentTarget;
  if (form.checkValidity() === false) {
    e.preventDefault();
    e.stopPropagation();
  // if required fields has NO value
  //    console.log('requried')
      swal({
          icon: 'error',
          title: 'Fields are required',
          text: 'Please fill the red text fields'
        });
  }
  else{
    axios.post(`${BASE_URL}/sparePart/create`, {
       code, name, supp, desc, SubParts
    })
    .then((res) => {
      console.log(res);
      if (res.status === 200) {
        swal({
          title: 'The Spare Parts sucessfully added!',
          text: 'The Spare Parts has been updated successfully.',
          icon: 'success',
          button: 'OK'
        }).then(() => {
         navigate('/spareParts')
          
        });
      } else if (res.status === 201) {
        swal({
          icon: 'error',
          title: 'Code Already Exist',
          text: 'Please input another code'
        });
      } else {
        swal({
          icon: 'error',
          title: 'Something went wrong',
          text: 'Please contact our support'
        });
      }
    })

  }

  setValidated(true); //for validations

  
};

// React.useEffect(() => {
//     $(document).ready(function () {
//         $('#order-listing').DataTable();
//     });
//     }, []);

  return (
    <div className="main-of-containers">
        <div className="left-of-main-containers">
            <Sidebar/>
        </div>
        <div className="right-of-main-containers">
            <div className="right-body-contents-a">
              <Form noValidate validated={validated} onSubmit={add}>
                <h1>Add Spare Parts</h1>
                <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                          General Information
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '18rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                 
                          <div className="row mt-3">
                          <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Code: </Form.Label>
                                <Form.Control onChange={(e) => setCode(e.target.value) } required type="text" placeholder="Enter item code" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Name: </Form.Label>
                                <Form.Control type="text" onChange={(e) => setName(e.target.value) } required placeholder="Enter item name" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-4">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Supplier: </Form.Label>

                                  <Select
                                    isMulti
                                    options={fetchSupp.map(supplier => ({
                                      value: supplier.supplier_code,
                                      label: supplier.supplier_name 
                                    }))}
                                    onChange={handleSelectChange}
                                  />

                                </Form.Group>
                              </div>
                          </div>
                       
                        <div className="row">
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Details: </Form.Label>
                                <Form.Control onChange={(e) => setDesc(e.target.value) } as="textarea"placeholder="Enter details name" style={{height: '100px', fontSize: '15px'}}/>
                            </Form.Group>
                        </div>
                        

                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '30px' }}>
                          Sub Parts List
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '85%',
                              left: '12rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                        <div className="supplier-table">
                            <div className="table-containss">
                                <div className="main-of-all-tables">
                                  <table>
                                    <thead>
                                      <tr>
                                        <th className='tableh'>Product Code</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                     
                                          {SubParts.length > 0 ? (
                                            SubParts.map((subPart) => (
                                              <tr>
                                                <td key={subPart.value}>{subPart.label}</td>
                                              </tr>
                                            ))
                                          ) : (
                                            <tr>
                                              <td>No Sub Part selected</td>
                                            </tr>
                                          )}
                                      
                                      {showDropdown && (
                                        <div className="dropdown mt-3">
                                          <Select
                                            isMulti
                                            options={fetchSubPart.map((subPart) => ({
                                              value: subPart.id,
                                              label: subPart.subPart_name,
                                            }))}
                                            onChange={handleSelectChange_SubPart}
                                          />
                                        </div>
                                      )}

                                      <Button
                                        className='btn btn-danger mt-1'
                                        onClick={handleAddSubPartClick}
                                        size="md"
                                        style={{ fontSize: '15px', margin: '0px 5px' }}
                                      >
                                        Add Sub-Part
                                      </Button>
                                    </tbody>
                                  </table>
                                </div>
                            </div>
                        </div>
                        <div className='save-cancel'>
                          <Button type='submit' className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Save</Button>
                          <Link to='/spareParts' className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                              Close
                          </Link>
                        </div>
                </Form>
            </div>
        </div>
    </div>
  )
}

export default CreateSpareParts
