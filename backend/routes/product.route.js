const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
// const Product = require('../db/models/product.model')
const {
  ProductTAGSupplier,
  Product,
  Inventory,
  Product_Assembly,
  Product_Spareparts,
  Product_Subparts,
} = require("../db/models/associations");
const session = require("express-session");
const multer = require("multer"); // Import multer

// const storage = multer.memoryStorage();
// const uploader = multer({ storage });
const mime = require("mime-types");
// const productTAGsupplier = require('../db/models/productTAGsupplier.model');
// Create a multer instance to handle file uploads
const upload = multer();

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// for PR  fetching all the products, assembly, sparePart, subpart
router.route("/fetchALLProduct").get(async (req, res) => {
  try {
    const data = await sequelize.query(
      `
      SELECT product_id as id, product_code as code, product_name as name,createdAt as createdAt FROM products
      UNION
      SELECT id as id, assembly_code as code, assembly_name as name, createdAt as createdAt FROM assemblies
    `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (data) {
      return res.json(data);
    } else {
      res.status(400).json({ error: "No data found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/fetchTable").get(async (req, res) => {
  try {
    //   const data = await MasterList.findAll({
    //     include: {
    //       model: UserRole,
    //       required: false,
    //     },
    //   });
    const data = await Product.findAll({
      attributes: [
        "product_id",
        "product_code",
        "product_name",
        "product_unitMeasurement",
        "createdAt",
        "updatedAt",
        'product_status'
      ],
    });

    if (data) {
      // console.log(data);
      return res.json(data);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});



router.route('/fetchTableEdit').get(async (req, res) => {

  try {
    const data = await Product.findAll({
      where: {
        product_id: req.query.id,
      },
    });

    if (!data) {
      // No record found
      return res.status(404).json();
    }
    // console.log(data)
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.route("/create").post(
  upload.fields([{ name: "selectedimage", maxCount: 1 }]),

  async (req, res) => {
    try {
      let finalThreshold;
      if (req.body.thresholds === "") {
        finalThreshold = 0;
      } else {
        finalThreshold = req.body.thresholds;
      }
        const existingDataCode = await Product.findOne({
          where: {
            product_code: req.body.code, 
          },
        });
    
        if (existingDataCode) {
          res.status(201).send('Exist');
        } else {
            let image_blob, image_blobFiletype;
            if (req.files.selectedimage) {
                image_blob = req.files.selectedimage[0].buffer;

                image_blobFiletype = mime.lookup(req.files.selectedimage[0].originalname);

            }
            else{
                image_blob = null;

                image_blobFiletype = null;
            }

            const newData = await Product.create({
            product_code: req.body.code,
            product_name: req.body.name,
            product_category: req.body.slct_category,
            product_unit: req.body.unit,
            product_location: req.body.slct_binLocation,
            product_unitMeasurement: req.body.unitMeasurement,
            product_manufacturer: req.body.slct_manufacturer,
            product_details: req.body.details,
            product_threshold: finalThreshold,
            product_image: image_blob,
            product_imageType: image_blobFiletype,
            product_status: 'Active'
          });

          //Assembly
          const IdData = newData.product_id;
          const selectedAssemblies = JSON.parse(req.body.assemblies);

          for (const assemblyDropdown of selectedAssemblies) {
            const assemblyValue = assemblyDropdown.value;
    
            console.log(assemblyValue);
    
            await Product_Assembly.create({
              product_id: IdData,
              assembly_id: assemblyValue
            });
          }
  
          //Spareparts
          const selectedSpare = JSON.parse(req.body.sparepart);
          for (const spareDropdown of selectedSpare) {
            const spareValue = spareDropdown.value;
    
            console.log(spareValue)
            await Product_Spareparts.create({
              product_id: IdData,
              sparePart_id: spareValue
            });
          }

          //Subparts
          const selectedSubparting = JSON.parse(req.body.subpart);
          for (const subpartDropdown of selectedSubparting) {
            const subpartValue = subpartDropdown.value;
    
            console.log(subpartValue)
            await Product_Subparts.create({
              product_id: IdData,
              subPart_id: subpartValue
            });
          }

          //Supplier
          const selectedSuppliers = JSON.parse(req.body.productTAGSuppliers);

          for (const supplier of selectedSuppliers) {
            const { supplier_code, price } = supplier;
          
            const InsertedSupp = await ProductTAGSupplier.create({
              product_id: IdData,
              supplier_code: supplier_code,
              product_price: price
            });
            const Inventories = InsertedSupp.id;
            await Inventory.create({
              product_tag_supp_id: Inventories,
              quantity: 0
            });

          }


          res.status(200).json(newData);
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
      }
});

router.route('/update').put(
  upload.fields([
      { name: 'selectedimage', maxCount: 1 },
    ]),
  
  async (req, res) => {
  try {
      // Check if the supplier code is already exists in the table
      const existingDataCode = await Product.findOne({
        where: {
          product_code: req.body.code,
        },
      });

      if (existingDataCode) {
        res.status(201).send("Exist");
      } else {
          let image_blob, image_blobFiletype;

          let finalThreshold;
          if (req.body.thresholds === "") {
            finalThreshold = 0;
          } else {
            finalThreshold = req.body.thresholds;
          }

          if (req.files.selectedimage) {
              image_blob = req.files.selectedimage[0].buffer;

              image_blobFiletype = mime.lookup(req.files.selectedimage[0].originalname);
          } else {
              image_blob = null;

              image_blobFiletype = null;
          }

          const newData = await Product.update({
          product_code: req.body.code,
          product_name: req.body.name,
          product_category: req.body.slct_category,
          product_unit: req.body.unit,
          product_location: req.body.slct_binLocation,
          product_unitMeasurement: req.body.unitMeasurement,
          product_manufacturer: req.body.slct_manufacturer,
          product_details: req.body.details,
          product_threshold: finalThreshold,
          product_image: image_blob,
          product_imageType: image_blobFiletype
        },
          {
            where: { product_id: req.body.id },
          }
        )
        ;

        if(newData) {
          const deleteSuppliertag = ProductTAGSupplier.destroy({
            where : {
              product_id: req.body.id,
            }
          })
          if(deleteSuppliertag){
            
            const selectedSuppliers = JSON.parse(req.body.productTAGSuppliers);
            for (const supplier of selectedSuppliers) {
              const { supplier_code, price } = supplier;
            
              await ProductTAGSupplier.create({
                product_id: req.body.id,
                supplier_code: supplier_code,
                product_price: price
              });
            }

          }
        }
  
        res.status(200).json(newData);
        // console.log(newDa)
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred");
    }
  }
);

router.route("/update").put(
  upload.fields([{ name: "selectedimage", maxCount: 1 }]),

  async (req, res) => {
    try {
      // Check if the supplier code is already exists in the table
      const existingDataCode = await Product.findOne({
        where: {
          // product_code: req.body.binLocationName, //dapat ma generate pag meron na assembly at parts
          product_code: req.body.code,
          product_id: { [Op.ne]: req.body.id },
        },
      });

      if (existingDataCode) {
        res.status(201).send("Exist");
      } else {
        let image_blob, image_blobFiletype;

        // image_blob = req.files.selectedimage[0].buffer;

        // image_blobFiletype = mime.lookup(req.files.selectedimage[0].originalname);

        if (req.files.selectedimage) {
          image_blob = req.files.selectedimage[0].buffer;

          image_blobFiletype = mime.lookup(
            req.files.selectedimage[0].originalname
          );
        } else {
          image_blob = null;

          image_blobFiletype = null;
        }

        const newData = await Product.update(
          {
            product_code: req.body.code,
            product_name: req.body.name,
            product_category: req.body.slct_category,
            product_unit: req.body.unit,
            product_location: req.body.slct_binLocation,
            product_unitMeasurement: req.body.unitMeasurement,
            product_manufacturer: req.body.slct_manufacturer,
            product_details: req.body.details,
            product_threshold: req.body.thresholds,
            product_image: image_blob,
            product_imageType: image_blobFiletype,
          },
          {
            where: { product_id: req.body.id },
          }
        );
        res.status(200).json(newData);
        // console.log(newDa)
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred");
    }
  }
);

router.route("/delete/:table_id").delete(async (req, res) => {
  const id = req.params.table_id;

  // await ProductTAGSupplier.findAll({
  //   where: {
  //     product_id: id,
  //   },
  // })
  //   .then((check) => {
  //     if (check && check.length > 0) {
  //       res.status(202).json({ success: true });
  //     }

  //     else{
  //       Product.destroy({
  //         where : {
  //           product_id: id
  //         }
  //       }).then(
  //           (del) => {
  //               if(del){
  //                   res.json({success : true})
  //               }
  //               else{
  //                   res.status(400).json({success : false})
  //               }
  //           }
  //       ).catch(
  //           (err) => {
  //               console.error(err)
  //               res.status(409)
  //           }
  //       );
  //     }
  //   })

  Product.destroy({
    where: {
      product_id: id,
    },
  })
    .then((del) => {
      if (del) {
        ProductTAGSupplier.destroy({
          where: {
            product_id: id,
          },
        })
          .then((deleted) => {
            if (deleted) {
              Inventory.destroy({
                where: {
                  product_id: id,
                },
              })
                .then((deletedInventory) => {
                  if (deletedInventory) {
                    res.status(200).json({ success: true });
                  } else {
                    res.status(400).json({ success: false });
                  }
                })
                .catch((err) => {
                  console.error(err);
                  res.status(409);
                });
            } else {
              res.status(400).json({ success: false });
            }
          })
          .catch((err) => {
            console.error(err);
            res.status(409);
          });
      } else {
        res.status(400).json({ success: false });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(409);
    });
});


router.route('/statusupdate').put(async (req, res) => {
  try {
    const { productIds, status } = req.body;

    for (const productId of productIds) {
      await Product.update(
        { product_status: status },
        { where: { product_id: productId } }
      );
    }

    res.status(200).json({ message: 'Products updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





module.exports = router;
