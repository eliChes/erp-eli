const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const { Supplier_SparePart, Supplier, SparePart } = require("../db/models/associations"); 
const SparePart = require('../db/models/sparePart.model')
const Supplier_SparePart = require('../db/models/supplier_sparePart.model')
const SubPart_SparePart = require('../db/models/subPart_sparePart.model')
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));


router.route('/fetchTableEdit').get(async (req, res) => {
  try {
    
    const data = await SparePart.findAll({
      where: {
        id: req.query.id,
    },
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


router.route('/fetchTable').get(async (req, res) => {
  try {
  //   const data = await MasterList.findAll({
  //     include: {
  //       model: UserRole,
  //       required: false,
  //     },
  //   });
    const data = await SparePart.findAll();

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

router.route('/create').post(async (req, res) => {
    try {
       const {code, name, supp, desc, SubParts} = req.body;
        // Check if the supplier code is already exists in the table
        const existingDataCode = await SparePart.findOne({
          where: {
            spareParts_code: code,
          },
        });
    
        if (existingDataCode) {
          return res.status(201).send('Exist');
        } else {
          const spare_newData = await SparePart.create({
            spareParts_code: code.toUpperCase(),
            spareParts_name: name,
            spareParts_desc: desc
          });

          const createdID = spare_newData.id;

          for (const supplier of supp) {
            const supplierValue = supplier.value;
    
            await Supplier_SparePart.create({
                sparePart_id: createdID,
                supplier: supplierValue,
            });
          }

          for (const subPart of SubParts) {
            const subPartValue = subPart.value;

            console.log('subpart id' + subPartValue)
    
            await SubPart_SparePart.create({
                sparePart_id: createdID,
                subPart_code: subPartValue,
            });
          }
    
    
          res.status(200).json();
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
      }
});



router.route('/update/:param_id').put(async (req, res) => {
  try {
    const { subPart_code, subPart_name, supplier, subPart_desc } = req.body;
    const updatemasterID = req.params.param_id;
    console.log('id:' + updatemasterID)
    console.log('code:' + subPart_code)


    // Check if the email already exists in the table for other records
    const existingData = await SubPart.findOne({
      where: {
        subPart_code: subPart_code,
        id: { [Op.ne]: updatemasterID }, // Exclude the current record
      },
    });

    if (existingData) {
      res.status(202).send('Exist');
    } else {

      // Update the record in the table
      const [affectedRows] = await SubPart.update(
        {
          subPart_code: subPart_code.toUpperCase(),
          subPart_name: subPart_name,
          supplier: supplier,
          subPart_desc: subPart_desc,
        },
        {
          where: { id: updatemasterID },
        }
      );

      res.status(200).json({ message: "Data updated successfully", affectedRows });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});


router.route('/delete/:table_id').delete(async (req, res) => {
    const id = req.params.table_id;
  
  
    // await Product.findAll({
    //   where: {
    //     product_manufacturer: id,
    //   },
    // })
    //   .then((check) => {
    //     if (check && check.length > 0) {
    //       res.status(202).json({ success: true });
    //     }
    //     else{
            await SparePart.destroy({
            where : {
              id: id
            }
          })
          .then(
              (del) => {
                  if(del){


                    Supplier_SparePart.destroy({
                      where : {
                        sparePart_id: id
                      }
                    })
                    .then(
                        (del) => {
                            if(del){
                                
                              
                              SubPart_SparePart.destroy({
                                where : {
                                  sparePart_id: id
                                }
                              })
                              .then(
                                  (del) => {
                                      if(del){
                                          return res.status(200).json({success : true})
                                      }
                                      else{
                                          res.status(400).json({success : false})
                                      }
                                  }
                              )
                              .catch(
                                  (err) => {
                                      console.error(err)
                                      res.status(409)
                                  }
                              );



                            }
                            else{
                                res.status(400).json({success : false})
                            }
                        }
                    )
                    .catch(
                        (err) => {
                            console.error(err)
                            res.status(409)
                        }
                    );
              
                  }
                  else{
                      res.status(400).json({success : false})
                  }
              }
          )
          .catch(
              (err) => {
                  console.error(err)
                  res.status(409)
              }
          );
    //     }
    //   })
  });
  



module.exports = router;