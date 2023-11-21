const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const Assembly = require('../db/models/assembly.model')
const Assembly_Supplier = require('../db/models/assembly_supplier.model')
// const {Assembly_Supplier, Assembly, Assembly_SparePart} = require('../db/models/associations')
const Assembly_SparePart = require('../db/models/assembly_spare.model')


const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

  


router.route('/fetchTable').get(async (req, res) => {
  try {
  //   const data = await MasterList.findAll({
  //     include: {
  //       model: UserRole,
  //       required: false,
  //     },
  //   });
    const data = await Assembly.findAll();

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
  //   const data = await MasterList.findAll({
  //     include: {
  //       model: UserRole,
  //       required: false,
  //     },
  //   });
    const data = await Assembly.findAll({
      where: {
        id : req.query.id
      }
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


router.route('/create').post(async (req, res) => {
    try {
       const {code, name, supp, desc, spareParts} = req.body;
        // Check if the supplier code is already exists in the table
        const existingDataCode = await Assembly.findOne({
          where: {
            assembly_code: code,
          },
        });
    
        if (existingDataCode) {
          return res.status(201).send('Exist');
        } else {
          const spare_newData = await Assembly.create({
            assembly_code: code.toUpperCase(),
            assembly_name: name,
            assembly_desc: desc
          });

          const createdID = spare_newData.id;

          for (const supplier of supp) {
            const supplierValue = supplier.value;
    
            await Assembly_Supplier.create({
                assembly_id: createdID,
                supplier_code: supplierValue,
            });
          }

          for (const sparePart of spareParts) {
            const sparePartval = sparePart.value;

            // console.log('subpart id' + sparePartval)
    
            await Assembly_SparePart.create({
                assembly_id: createdID,
                sparePart_id: sparePartval,
            });
          }
    
    
          res.status(200).json();
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
      }
});


router.route('/update').post(async (req, res) => {
  try {
    //  const {code, name, supp, desc, spareParts} = req.query;
      // Check if the supplier code is already exists in the table\
      console.log(req.query.code)
      const existingDataCode = await Assembly.findOne({
        where: {
          assembly_code: req.query.code,
          id: { [Op.ne]: req.query.id }, // Exclude the current record
        },
      });
  
      if (existingDataCode) {
        return res.status(201).send('Exist');
      } else {
        const spare_newData = await Assembly.update({
          assembly_code: req.query.code.toUpperCase(),
          assembly_name: req.query.name,
          assembly_desc: req.query.desc
        }, {
          where: {
            id: req.query.id
          }
        });


        if(spare_newData){
          const deletesparepart  = Assembly_SparePart.destroy({
            where : {
              assembly_id: req.query.id
            }
          })
          if(deletesparepart){
            for (const subPart of req.query.spareParts) {
              const subPartValue = subPart.value;
    
              // console.log('subpart id' + subPartValue)
      
              await Assembly_SparePart.create({
                  assembly_id: req.query.id,
                  sparePart_id: subPartValue,
              });
            }
          }; //delete sparePart if end

          const deletesupp  = Assembly_Supplier.destroy({
            where : {
              assembly_id: req.query.id
            }
          })
          if(deletesupp){
            for (const supplier of req.query.supp) {
              const suppValue = supplier.value;
    
              // console.log('subpart id' + subPartValue)
      
              await Assembly_Supplier.create({
                  assembly_id: req.query.id,
                  supplier_code: suppValue,
              });
            }
          }; //delete supplier if end

        }
  
        res.status(200).json();
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
          await Assembly.destroy({
          where : {
            id: id
          }
        })
        .then(
            (del) => {
                if(del){


                  Assembly_Supplier.destroy({
                    where : {
                      assembly_id: id
                    }
                  })
                  .then(
                      (del) => {
                          if(del){
                              
                            
                            Assembly_SparePart.destroy({
                              where : {
                                assembly_id: id
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