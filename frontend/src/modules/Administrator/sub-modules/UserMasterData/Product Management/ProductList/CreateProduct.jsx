import React, { useState, useEffect, useRef } from 'react'
import swal from 'sweetalert';
import BASE_URL from '../../../../../../assets/global/url';
import axios from 'axios';
import Sidebar from '../../../../../Sidebar/sidebar';
import '../../../../../../assets/global/style.css';
import { Link, useNavigate } from 'react-router-dom';
import '../../../../../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import cls_unitMeasurement from '../../../../../../assets/global/unitMeasurement';
import cls_unit from '../../../../../../assets/global/unit';
import Select from 'react-select';
import Dropzone from 'react-dropzone';

function CreateProduct() {
  const navigate = useNavigate();


  const [validated, setValidated] = useState(false);// for form validation

  const [category, setcategory] = useState([]); // for fetching category data
  const [binLocation, setbinLocation] = useState([]); // for fetching bin location data
  const [manufacturer, setManufacturer] = useState([]); // for fetching manufacturer data

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [slct_category, setslct_category] = useState([]); // for getting the value of selected category
  const [unit, setunit] = useState('');
  const [slct_binLocation, setslct_binLocation] = useState([]); // for getting the value of selected bin location
  const [unitMeasurement, setunitMeasurement] = useState('');
  const [slct_manufacturer, setslct_manufacturer] = useState([]); // for getting the value of selected manufacturer 
  const [details, setDetails] = useState('');
  const [thresholds, setThresholds] = useState('');
  const [fetchSparePart, setFetchPart] = useState([]);
  const [fetchSubPart, setFetchsub] = useState([]);
  const [fetchAssembly, setAssembly] = useState([]);
  const [spareParts, setSparePart] = useState([]);
  const [subparting, setsubparting] = useState([]);
  const [assembly, setassemblies] = useState([]);

  // ----------------------------------- for image upload --------------------------//
  const fileInputRef = useRef(null);
  const [selectedimage, setselectedimage] = useState(null);

  const onDropImage = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];

    if (
        selectedFile.type === 'image/png' || 
        selectedFile.type === 'image/jpeg') 
        {
          setselectedimage(selectedFile);
    } else {
        swal({
            title: 'Invalid file type',
            text: 'Please select a  PNG, or JPG file.',
            icon: 'error',
            button: 'OK'
        })
    }
    
  };

  //Assembly Fetch
  useEffect(() => {
    axios.get(BASE_URL + '/assembly/fetchTable')
      .then(res => setAssembly(res.data))
      .catch(err => console.log(err));
  }, []);
  
  //Subpart Fetch
  useEffect(() => {
    axios.get(BASE_URL + '/subpart/fetchTable')
      .then(res => setFetchsub(res.data))
      .catch(err => console.log(err));
  }, []);
  
  //Spare part Fetch
  useEffect(() => {
    axios.get(BASE_URL + '/sparePart/fetchTable')
      .then(res => setFetchPart(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleSparepartChange = (selectedOptions) => {
    setSparePart(selectedOptions);
  };
  
  const handleSubpartChange = (selectedOption) => {
    setsubparting(selectedOption);
  };

  const handleAssemblyChange = (selectedOptions) => {
    setassemblies(selectedOptions);
  };

  // for Unit on change function
  const handleChangeUnit = (event) => {
    setunit(event.target.value);
  };

  // for Unit Measurement on change function
  const handleChangeMeasurement = (event) => {
    setunitMeasurement(event.target.value);
  };

  // for Catergory on change function
  const handleFormChangeCategory = (event) => {
    setslct_category(event.target.value);
  };

  // for Bin Location on change function
  const handleFormChangeBinLocation = (event) => {
    setslct_binLocation(event.target.value);
  };

  // for Unit Measurement on change function
  const handleFormChangeManufacturer = (event) => {
    setslct_manufacturer(event.target.value);
  };

  useEffect(() => {
    axios.get(BASE_URL + '/binLocation/fetchTable')
      .then(response => {
        setbinLocation(response.data);
      })
      .catch(error => {
        console.error('Error fetching roles:', error);
      });
  }, []);

  useEffect(() => {
    axios.get(BASE_URL + '/category/fetchTable')
      .then(response => {
        setcategory(response.data);
      })
      .catch(error => {
        console.error('Error fetching roles:', error);
      });
  }, []);


  useEffect(() => {
    axios.get(BASE_URL + '/manufacturer/retrieve')
      .then(response => {
        setManufacturer(response.data);
      })
      .catch(error => {
        console.error('Error fetching roles:', error);
      });
  }, []);

  const add = async e => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
        swal({
            icon: 'error',
            title: 'Fields are required',
            text: 'Please fill the red text fields'
          });
    }
    else{
      const formData = new FormData();
      formData.append('code', code);
      formData.append('name', name);
      formData.append('slct_category', slct_category);
      formData.append('unit', unit);
      formData.append('slct_binLocation', slct_binLocation);
      formData.append('unitMeasurement', unitMeasurement);
      formData.append('slct_manufacturer', slct_manufacturer);
      formData.append('details', details);
      formData.append('thresholds', thresholds);
      formData.append('selectedimage', selectedimage);
      formData.append('assemblies', JSON.stringify(assembly));
      formData.append('sparepart', JSON.stringify(spareParts));
      formData.append('subpart', JSON.stringify(subparting));
      
      axios.post(`${BASE_URL}/product/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        console.log(res);
        if(res.status === 200){
          SuccessInserted(res);
        }
        else if(res.status === 201){
          Duplicate_Message();
        }
        else{
          ErrorInserted();
        }
      })
    }
    setValidated(true); //for validations
  };

  const SuccessInserted = (res) => {
    swal({
      title: 'Product Created',
      text: 'The Product has been added successfully',
      icon: 'success',
      button: 'OK'
    })
    .then(() => {
     
     navigate('/productList')


    })
  }
  const Duplicate_Message = () => {
    swal({
      title: 'Product Already Exist',
      text: 'The input other product',
      icon: 'error',
      button: 'OK'
    })
  }

  const ErrorInserted = () => {
    swal({
      title: 'Something went wrong',
      text: 'Please Contact our Support',
      icon: 'error',
      button: 'OK'
    })  
  }

  return (
    <div className="main-of-containers">
        <div className="left-of-main-containers">
            <Sidebar/>
        </div>
        <div className="right-of-main-containers">
            <div className="right-body-contents-a">
                <h1>Add Product</h1>
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
                        <Form  noValidate validated={validated} onSubmit={add}>
                          <div className="row mt-3">
                          <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Item Code: </Form.Label>
                                <Form.Control required type="text" onChange={(e) => setCode(e.target.value)} placeholder="Enter item code" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Item Name: </Form.Label>
                                <Form.Control required type="text" onChange={(e) => setName(e.target.value)} placeholder="Enter item name" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-4">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Category: </Form.Label>

                                  <Form.Select 
                                    aria-label="" 
                                    onChange={handleFormChangeCategory} 
                                    required
                                    style={{ height: '40px', fontSize: '15px' }}
                                    defaultValue=''
                                  >


                                      <option disabled value=''>
                                          Select Category ...
                                      </option>
                                        {category.map(category => (
                                          <option key={category.category_code} value={category.category_code}>
                                            {category.category_name}
                                          </option>
                                        ))}
                                  </Form.Select>
                                </Form.Group>
                              </div>
                          </div>

                          <div className="row">
                            <div className="col-4">
                                  <Form.Group controlId="exampleForm.ControlInput2">
                                    <Form.Label style={{ fontSize: '20px' }}>Assembly: </Form.Label>
                                    <Select
                                      isMulti
                                      options={fetchAssembly.map(assembly => ({
                                        value: assembly.id,
                                        label: assembly.assembly_name 
                                      }))}
                                      onChange={handleAssemblyChange}
                                    />
                                  </Form.Group>
                                </div>
                              <div className="col-4">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Sub Parts: </Form.Label>
                                  <Select
                                    isMulti
                                    options={fetchSubPart.map(subpart => ({
                                      value: subpart.id,
                                      label: subpart.subPart_name 
                                    }))}
                                    onChange={handleSubpartChange}
                                  />
                                </Form.Group>
                              </div>
                              <div className="col-4">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Spare Parts: </Form.Label>
                                  <Select
                                    isMulti
                                    options={fetchSparePart.map(sparePart => ({
                                      value: sparePart.id,
                                      label: sparePart.spareParts_name 
                                    }))}
                                    onChange={handleSparepartChange}
                                  />
                                </Form.Group>
                              </div>
                          </div>

                        <div className="row">
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Unit: </Form.Label>
                                  <Form.Select
                                    aria-label=""
                                    
                                    style={{ height: '40px', fontSize: '15px' }}
                                    defaultValue=''
                                    onChange={handleChangeUnit}
                                   >
                                      <option disabled value=''>
                                          Select Unit ...
                                      </option>
                                    {cls_unit.map((unit, index) => (
                                      <option key={index} value={unit}>
                                          {unit}
                                      </option>
                                    ))}
                                  </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Bin Location: </Form.Label>
                                  <Form.Select 
                                    aria-label="" 
                                    onChange={handleFormChangeBinLocation} 
                                    required
                                    style={{ height: '40px', fontSize: '15px' }}
                                    defaultValue=''
                                  >


                                      <option disabled value=''>
                                          Select Bin Location ...
                                      </option>
                                        {binLocation.map(binLocation => (
                                          <option key={binLocation.bin_id} value={binLocation.bin_id}>
                                            {binLocation.bin_name}
                                          </option>
                                        ))}
                                  </Form.Select>
                                </Form.Group>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Unit of Measurment: </Form.Label>
                                  <Form.Select
                                    aria-label=""
                                    
                                    style={{ height: '40px', fontSize: '15px' }}
                                    defaultValue=''
                                    onChange={handleChangeMeasurement}
                                   
                                  >
                                      <option disabled value=''>
                                          Select Unit Measurement ...
                                      </option>
                                    {cls_unitMeasurement.map((unitM, index) => (
                                      <option key={index} value={unitM}>
                                          {unitM}
                                      </option>
                                    ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Manufacturer: </Form.Label>
                                  <Form.Select 
                                    aria-label="" 
                                    onChange={handleFormChangeManufacturer} 
                                    required
                                    style={{ height: '40px', fontSize: '15px' }}
                                    defaultValue=''
                                  >


                                      <option disabled value=''>
                                          Select Manufacturer ...
                                      </option>
                                        {manufacturer.map(manufacturer => (
                                          <option key={manufacturer.manufacturer_code} value={manufacturer.manufacturer_code}>
                                            {manufacturer.manufacturer_name}
                                          </option>
                                        ))}
                                  </Form.Select>
                                </Form.Group>
                            </div>
                        </div>

                        <div className="row">
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Details Here: </Form.Label>
                                <Form.Control as="textarea"  onChange={(e) => setDetails(e.target.value)} placeholder="Enter item name" style={{height: '100px', fontSize: '15px'}}/>
                            </Form.Group>
                        </div>


                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '30px' }}>
                          Notification Thresholds
                          <p>Sets your preferred thresholds.</p>
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '65%',
                              left: '21rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>

                          <div className="row mt-3">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Critical Inventory Thresholds: </Form.Label>
                                <Form.Control onChange={(e) => setThresholds(e.target.value)} type="number" placeholder="Minimum Stocking" style={{height: '40px', fontSize: '15px'}}/>
                                </Form.Group>
                            </div>
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Image Upload: </Form.Label>
                                  {/* <input className="form-control" type="file" 
                                  onChange={handleFileChange}/> */}
                                  <div style={{border: "1px #DFE3E7 solid", height: 'auto', maxHeight: '140px', fontSize: '15px', width: '50%', padding: 10}}>
                                      <Dropzone onDrop={onDropImage}>
                                          {({ getRootProps, getInputProps }) => (
                                          <div className='w-100 h-100' {...getRootProps()}>
                                              <input
                                                  ref={fileInputRef}
                                                  type="file"
                                                  style={{display: 'none'}}
                                              />
                                              <div className='d-flex align-items-center' style={{width: '100%', height: '2.5em'}}>
                                                <p className='fs-5 w-100 p-3 btn btn-secondary' style={{color: 'white', fontWeight: 'bold'}}>Drag and drop a file here, or click to select a file</p>
                                              </div>
                                              {selectedimage && 
                                                  <div className='d-flex align-items-center justify-content-center' style={{border: "1px green solid", width: '100%', height: '5em'}}>
                                                    <p 
                                                      style={{color: 'green', fontSize: '15px',}}>
                                                        Uploaded Image: {selectedimage.name}
                                                    </p>
                                                  </div>}
                                          </div>
                                          )}
                                      </Dropzone>
                                      
                                  </div>                    
                              </Form.Group>   
                            </div>

                          </div>
                        
                        <div className='save-cancel'>
                        <Button  type="submit" variant="warning" size="md" style={{ fontSize: '20px' }}>Save</Button>
                        <Link to='/productList' className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                            Close
                        </Link>
                        </div>
                      </Form>
            </div>
        </div>
    </div>
  )
}

export default CreateProduct
