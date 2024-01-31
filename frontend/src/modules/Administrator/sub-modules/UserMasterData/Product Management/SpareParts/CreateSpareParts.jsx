import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../../../../Sidebar/sidebar";
import "../../../../../../assets/global/style.css";
import { Link, useNavigate } from "react-router-dom";
import "../../../../../styles/react-style.css";
import Form from "react-bootstrap/Form";
import axios from "axios";
import BASE_URL from "../../../../../../assets/global/url";
import cls_unitMeasurement from "../../../../../../assets/global/unitMeasurement";
import swal from "sweetalert";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import { Plus, Trash, NotePencil, X, ArrowCircleLeft} from "@phosphor-icons/react";
import Dropzone from 'react-dropzone';

function CreateSpareParts() {
  const [validated, setValidated] = useState(false);
  const [fetchSupp, setFetchSupp] = useState([]);
  const [fetchSubPart, setFetchSubPart] = useState([]);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [supp, setSupp] = useState([]);
  const [desc, setDesc] = useState("");
  const [thresholds, setThresholds] = useState("");
  const [manufacturer, setManufacturer] = useState([]);
  const [binLocation, setbinLocation] = useState([]);
  const [slct_binLocation, setslct_binLocation] = useState("");
  const [slct_manufacturer, setslct_manufacturer] = useState("");
  const [unitMeasurement, setUnitMeasurement] = useState("");
  const [sparepriceInput, setsparePriceInput] = useState({});
  const [SpareaddPriceInput, setsparePriceInputbackend] = useState([]);
  // for display selected subPart in Table
  const [SubParts, setSubParts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(BASE_URL + "/sparePart/lastCode")
      .then((res) => {
        const codes =
          res.data !== null ? res.data.toString().padStart(6, "0") : "000001";

        // Increment the value by 1
        setCode(codes);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/supplier/fetchTable")
      .then((res) => setFetchSupp(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/subPart/fetchTable")
      .then((res) => setFetchSubPart(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/binLocation/fetchTable")
      .then((response) => {
        setbinLocation(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/manufacturer/retrieve")
      .then((response) => {
        setManufacturer(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  //for supplier selection values
  const handleSelectChange = (selectedOptions) => {
    setSupp(selectedOptions);
  };

  const handleSelectChange_SubPart = (selectedOptions) => {
    setSubParts(selectedOptions);
  };

  const handleAddSupp = () => {
    setShowDropdown(true);
  };

  const handleFormChangeBinLocation = (event) => {
    setslct_binLocation(event.target.value);
  };

  const handleChangeMeasurement = (event) => {
    setUnitMeasurement(event.target.value);
  };

  const handleFormChangeManufacturer = (event) => {
    setslct_manufacturer(event.target.value);
  };
  const handleSparePriceinput = (value, priceValue) => {
    setsparePriceInput((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        [priceValue]: value,
      };

      // Use the updatedInputs directly to create the serializedProducts array
      const serializedPrice = supp.map((supp) => ({
        price: updatedInputs[supp.value] || "",
        code: supp.codes,
      }));
      setsparePriceInputbackend(serializedPrice);

      console.log("Price Inputted:", serializedPrice);

      // Return the updatedInputs to be used as the new state
      return updatedInputs;
    });
  };

  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState([]);
  const fileInputRef = useRef(null);
  
  function selectFiles() {
    fileInputRef.current.click();
  }
  function onFileSelect(event) {
    const files = event.target.files;
  
    if (files.length === 0) return;
  
    if (images.length + files.length > 5) {
      swal({
        icon: "error",
        title: "File Limit Exceeded",
        text: "You can upload up to 5 images only.",
      });
      return;
    }
  
    for (let i = 0; i < files.length; i++) {
      const fileType = files[i].type.split('/')[1].toLowerCase();
      const fileSize = files[i].size / (1024 * 1024); // Convert size to MB
  
      if (fileSize > 5) {
        swal({
          icon: "error",
          title: "File Size Limit Exceeded",
          text: "Each image must be up to 5MB in size.",
        });
        continue;
      }
  
      if (fileType !== 'jpeg' && fileType !== 'png' && fileType !== 'webp') {
        swal({
          icon: "error",
          title: "Invalid File Type",
          text: "Only JPEG and PNG files are allowed.",
        });
        continue;
      }
  
      if (!images.some((e) => e.name === files[i].name)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages((prevImages) => [
            ...prevImages,
            {
              name: files[i].name,
              url: URL.createObjectURL(files[i]),
              base64Data: e.target.result.split(',')[1],
            },
          ]);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }
  
  function deleteImage(index){
    setImages((prevImages) => 
      prevImages.filter((_, i) => i !== index)
    )
  }
  
  function onDragOver(event){
    event.preventDefault();
    setIsDragging(true);
    event.dataTransfer.dropEffect = "copy";
  }
  
  function onDragLeave(event) {
    event.preventDefault();
    setIsDragging(false);
  }
  
  function onDropImages(event) {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
  
    if (images.length + files.length > 5) {
      swal({
        icon: "error",
        title: "File Limit Exceeded",
        text: "You can upload up to 5 images only.",
      });
      return;
    }
  
    for (let i = 0; i < files.length; i++) {
      const fileType = files[i].type.split('/')[1].toLowerCase();
      const fileSize = files[i].size / (1024 * 1024); // Convert size to MB
  
      if (fileSize > 5) {
        swal({
          icon: "error",
          title: "File Size Limit Exceeded",
          text: "Each image must be up to 5MB in size.",
        });
        continue;
      }
  
      if (fileType !== 'jpeg' && fileType !== 'png' && fileType !== 'webp') {
        swal({
          icon: "error",
          title: "Invalid File Type",
          text: "Only JPEG and PNG files are allowed.",
        });
        continue;
      }
  
      if (!images.some((e) => e.name === files[i].name)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages((prevImages) => [
            ...prevImages,
            {
              name: files[i].name,
              url: URL.createObjectURL(files[i]),
              base64Data: e.target.result.split(',')[1],
            },
          ]);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  const add = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      // if required fields has NO value
      //    console.log('requried')
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill the red text fields",
      });
    } else {
      axios
        .post(`${BASE_URL}/sparePart/create`, {
          code,
          name,
          desc,
          SubParts,
          SpareaddPriceInput,
          slct_binLocation,
          unitMeasurement,
          slct_manufacturer,
          thresholds,
          images
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            swal({
              title: "Product Spare-Part Add Successful!",
              text: "The Product Spare-Part has been Added Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/spareParts");
            });
          } else if (res.status === 201) {
            swal({
              title: "Product Spare-Part is Already Exist",
              text: "Please Input a New Product Spare-Part ",
              icon: "error",
            });
          } else {
            swal({
              icon: "error",
              title: "Something went wrong",
              text: "Please contact our support",
            });
          }
        });
    }

    setValidated(true); //for validations
  };

  // const [selectedimage, setselectedimage] = useState([]);
  // const fileInputRef = useRef(null);

  // const onDropImage = (acceptedFiles) => {
  //   const newSelectedImages = [...selectedimage];

  //   acceptedFiles.forEach((file) => {
  //     if (
  //       (file.type === "image/png" || file.type === "image/jpeg") &&
  //       newSelectedImages.length < 5
  //     ) {
  //       newSelectedImages.push(file);
  //     } else {
  //       swal({
  //         title: "Invalid file type or maximum limit reached",
  //         text: "Please select PNG or JPG files, and ensure the total selected images do not exceed 5.",
  //         icon: "error",
  //         button: "OK",
  //       });
  //     }
  //   });

  //   setselectedimage(newSelectedImages);
  // };

  // const removeImage = (index) => {
  //   const newSelectedImages = [...selectedimage];
  //   newSelectedImages.splice(index, 1);
  //   setselectedimage(newSelectedImages);
  // };
  // const uploadClick = () => {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.click();
  //   }
  // };

  // const [img, setImg] = useState([]);
  // useEffect(() => {
  //   // Create a function to handle the image processing
  //   const processImages = () => {
  //     const imageDataArray = [];

  //     selectedimage.forEach((image, index) => {
  //       const filereader = new FileReader();

  //       filereader.onload = function (event) {
  //         // Process image data
  //         const processedImage = {
  //           index, // or any other identifier for the image
  //           blobData: event.target.result,
  //           base64Data: btoa(event.target.result),
  //         };

  //         imageDataArray.push(processedImage);
  //       };

  //       if (image instanceof Blob) {
  //         filereader.readAsBinaryString(image);
  //       }
  //     });

  //     // Set the state once after processing all images
  //     setImg(imageDataArray);
  //   };

  //   // Call the image processing function
  //   processImages();
  // }, [selectedimage]);

 

  return (
    <div className="main-of-containers">
      {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
      <div className="right-of-main-containers">
        <div className="right-body-contents-a">
          <Form noValidate validated={validated} onSubmit={add}>
            <div className="arrowandtitle">
              <Link to="/spareParts">
                  <ArrowCircleLeft size={50} color="#60646c" weight="fill" />
              </Link>
                  <div className="titletext">
                    <h1>Add Spare Parts</h1>
                  </div>
              </div>
            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
              }}>
              General Information
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "18rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>

            <div className="row mt-3">
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>Spare Parts Code: </Form.Label>
                  <Form.Control
                    onChange={(e) => setCode(e.target.value)}
                    required
                    type="text"
                    value={code}
                    readOnly
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>Spare Parts Name: </Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter item name"
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Subpart:{" "}
                  </Form.Label>
                  <Select
                    isMulti
                    options={fetchSubPart.map((subPart) => ({
                      value: subPart.id,
                      label: subPart.subPart_name,
                    }))}
                    onChange={handleSelectChange_SubPart}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        color: 'red', 
                        fontSize: '15px',
                        fontWeight: 650
                      }),
                      option: (provided) => ({
                        ...provided,
                        color: 'black', 
                        fontSize: '15px', 
                      }),
                    }}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Bin Location:{" "}
                  </Form.Label>
                  <Form.Select
                    aria-label=""
                    onChange={handleFormChangeBinLocation}
                    required
                    style={{ height: "40px", fontSize: "15px" }}
                    defaultValue="">
                    <option disabled value="">
                      Select Bin Location ...
                    </option>
                    {binLocation.map((binLocation) => (
                      <option
                        key={binLocation.bin_id}
                        value={binLocation.bin_id}>
                          <strong>{binLocation.bin_name + "-"}</strong>
                          <strong>{binLocation.bin_subname}</strong>
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Unit of Measurement:{" "}
                  </Form.Label>
                  <Form.Select
                    aria-label=""
                    style={{ height: "40px", fontSize: "15px" }}
                    defaultValue=""
                    onChange={handleChangeMeasurement}>
                    <option disabled value="">
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
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Manufacturer:{" "}
                  </Form.Label>
                  <Form.Select
                    aria-label=""
                    onChange={handleFormChangeManufacturer}
                    required
                    style={{ height: "40px", fontSize: "15px" }}
                    defaultValue="">
                    <option disabled value="">
                      Select Manufacturer ...
                    </option>
                    {manufacturer.map((manufacturer) => (
                      <option
                        key={manufacturer.manufacturer_code}
                        value={manufacturer.manufacturer_code}>
                        {manufacturer.manufacturer_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            
            <div className="row">
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px" }}>Details: </Form.Label>
                <Form.Control
                  onChange={(e) => setDesc(e.target.value)}
                  as="textarea"
                  placeholder="Enter details name"
                  style={{ height: "100px", fontSize: "15px" }}
                />
              </Form.Group>
            </div>
            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "30px",
              }}>
              Notification Thresholds
              <p>Sets your preferred thresholds.</p>
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "65%",
                  left: "21rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>

            <div className="row mt-3">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Critical Inventory Thresholds:{" "}
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const sanitizedValue = inputValue.replace(/\D/g, "");
                      setThresholds(sanitizedValue);
                    }}
                    type="text"
                    placeholder="Minimum Stocking"
                    style={{ height: "40px", fontSize: "15px" }}
                    maxLength={10}
                    pattern="[0-9]*"
                  />
                </Form.Group>
              </div>
              <div className="col-6">
              <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Image Upload:{" "}
                  </Form.Label>
                  <div className="card">
                    <div className="drag-area" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDropImages}>
                        <>
                         Drag & Drop image here or {" "}
                        <span className="select" role="button" onClick={selectFiles}>
                          Browse
                        </span>
                        </>
                      <input name="file" type="file" className="file" multiple ref={fileInputRef} onChange={onFileSelect}/>
                    </div>
                    <div className="ccontainerss">
                      {images.map((images,index)=>(
                      <div className="imagess" key={index}>
                        <span className="delete" onClick={() => deleteImage(index)}>&times;</span>
                        <img src={images.url} alt={images.name} /> 
                      </div>
                      ))}
                    </div>
                  </div>
                  </Form.Group>
              </div>
            </div>

            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "30px",
              }}>
              Supplier List
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "85%",
                  left: "12rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>
            <div className="supplier-table">
              <div className="table-containss">
                <div className="main-of-all-tables">
                  <table>
                    <thead>
                      <tr>
                        <th className="tableh">Supplier Code</th>
                        <th className="tableh">Name</th>
                        <th className="tableh">Email</th>
                        <th className="tableh">Contact</th>
                        <th className="tableh">Address</th>
                        <th className="tableh">Receiving Area</th>
                        <th className="tableh">Price</th>
                        <th className="tableh">VAT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supp.length > 0 ? (
                        supp.map((supp) => (
                          <tr>
                            <td>{supp.codes}</td>
                            <td>{supp.names}</td>
                            <td>{supp.email}</td>
                            <td>{supp.contact}</td>
                            <td>{supp.address}</td>
                            <td>{supp.sparereceving}</td>
                            <td>
                              <div className="d-flex align-items-center">
                              <span
                                style={{
                                  fontSize: "20px",
                                  marginRight: "5px",
                                }}>
                                ₱
                              </span>
                              <Form.Control
                                type="number"
                                style={{ height: "35px", fontSize: '14px', fontFamily: 'Poppins, Source Sans Pro'}}
                                placeholder="Input Price"
                                value={sparepriceInput[supp.value] || ""}
                                onChange={(e) =>
                                  handleSparePriceinput(
                                    e.target.value,
                                    supp.value
                                  )
                                }
                                
                              />
                              </div>
                            </td>
                            <td>
                            {isNaN((supp.vatable / 100) * sparepriceInput[supp.value]) ? 0 : ((supp.vatable / 100) * sparepriceInput[supp.value]).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            style={{ textAlign: "center", fontSize: "18px" }}>
                            No Supplier selected
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {showDropdown && (
                      <div className="dropdown mt-3">
                        <Select
                          isMulti
                          options={fetchSupp.map((supp) => ({
                            value: `${supp.supplier_code} - ${supp.supplier_name}`,
                            label: (
                              <div>
                                Supplier Code: <strong>{supp.supplier_code}</strong> / Name:{" "}
                                <strong>{supp.supplier_name}</strong>
                              </div>
                            ),
                            codes: supp.supplier_code,
                            vatable: supp.supplier_vat,
                            names: supp.supplier_name,
                            email: supp.supplier_email,
                            contact: supp.supplier_number,
                            address: supp.supplier_address,
                            sparereceving: supp.supplier_receiving,
                            price: supp.supplier_price,
                          }))}
                          onChange={handleSelectChange}
                        />
                      </div>
                    )}

                    <Button
                      variant="outline-warning"
                      onClick={handleAddSupp}
                      size="md"
                      style={{ fontSize: "15px", marginTop: "10px" }}>
                      Add Supplier
                    </Button>
                  </table>
                </div>
              </div>
            </div>
            <div className="save-cancel">
              <Button
                type="submit"
                className="btn btn-warning"
                size="md"
                style={{ fontSize: "20px", margin: "0px 5px" }}>
                Save
              </Button>
              <Link
                to="/spareParts"
                className="btn btn-secondary btn-md"
                size="md"
                style={{ fontSize: "20px", margin: "0px 5px" }}>
                Close
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default CreateSpareParts;
