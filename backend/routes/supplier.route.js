const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const Supplier = require('../db/models/supplier.model')
const { ProductTAGSupplier, Supplier, Activity_Log } = require("../db/models/associations"); 
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));




router.route('/lastCode').get(async (req, res) => {
  try {
    const latestPR = await Supplier.findOne({
      attributes: [[sequelize.fn('max', sequelize.col('supplier_code')), 'latestNumber']],
    });
    let latestNumber = latestPR.getDataValue('latestNumber');

    console.log('Latest Number:', latestNumber);

    // Increment the latestNumber by 1 for a new entry
    latestNumber = latestNumber !== null ? (parseInt(latestNumber, 10) + 1).toString() : '1';

    // Do not create a new entry, just return the incremented value
    return res.json(latestNumber.padStart(4, '0'));
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
    const data = await Supplier.findAll();

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
 
  // const suppCode = req.query.id; // Access query parameter using req.query
  // console.log('pasok: ' + req.query.id)

    try {
        const data = await Supplier.findAll({
        where: {
            supplier_code: req.query.id,
        },
        });

        if (!data) {
        // No record found
        return res.status(404).json({ message: 'User role not found' });
        
        }
        // console.log(data)
        return res.json(data);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
});


router.route('/create').post(async (req, res) => {
    try {
        const code = req.body.suppCode;
        const tin = req.body.suppTin;
        const terms = req.body.suppTerms;
        const telNum = req.body.suppTelNum;
        const Vat = req.body.suppVat;
        const userId = req.body.userId;

        let finalTin, finalTerms, finalTelNum, finalVat;

        if (tin === ''){
            finalTin = 0;
        }
        else{
            finalTin = tin;
        }

        if (terms === ''){
            finalTerms = 0;
        }
        else{
            finalTerms = terms;
        }

        if (telNum === ''){
            finalTelNum = 0;
        }
        else{
            finalTelNum = telNum;
        }
        if (Vat  === ''){
          finalVat = 0;
        }
        else{
          finalVat = Vat;
        }


        // Check if the supplier code is already exists in the table
        const existingDataCode = await Supplier.findOne({
          where: {
            supplier_code: code,
            // supplier_email: email,
          },
        });
    
        if (existingDataCode) {
          res.status(201).send('Exist');
        } else {
          const newData = await Supplier.create({
            supplier_code: req.body.suppCode,
            supplier_name: req.body.suppName,
            supplier_currency: req.body.suppCurr,
            supplier_tin: finalTin,
            supplier_email: req.body.suppEmail,
            supplier_address: req.body.suppAdd,
            supplier_city: req.body.suppCity,
            supplier_postcode: req.body.suppPcode,
            supplier_contactPerson: req.body.suppCperson,
            supplier_number: req.body.suppCnum,
            supplier_Telnumber: finalTelNum,
            supplier_terms: finalTerms,
            supplier_vat: finalVat,
            supplier_country: req.body.selectedCountry,
            supplier_receiving: req.body.suppReceving,
            supplier_status: req.body.suppStatus
          });
    
          await Activity_Log.create({
            masterlist_id: userId,
            action_taken: `Supplier: Created a new supplier named ${req.body.suppName}`,
          });

          res.status(200).json(newData);
          // console.log(newDa)
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
      }
});




router.route('/update').put(async (req, res) => {
  try {
    const name = req.body.suppName;
    const updatemasterID = req.body.suppCode;
    const tin = req.body.suppTin;
    const terms = req.body.suppTerms;
    const telNum = req.body.suppTelNum;
    const Vat = req.body.suppVat;
    const userId = req.body.userId;

    let finalTin, finalTerms, finalTelNum, finalVat;

    if (tin === ''){
        finalTin = 0;
    }
    else{
        finalTin = tin;
    }

    if (terms === ''){
        finalTerms = 0;
    }
    else{
        finalTerms = terms;
    }

    if (telNum === ''){
        finalTelNum = 0;
    }
    else{
        finalTelNum = telNum;
    }
    if (Vat  === ''){
      finalVat = 0;
    }
    else{
      finalVat = Vat;
    }
    // console.log(updatemasterID)

    // Check if the email already exists in the table for other records
    const existingData = await Supplier.findOne({
      where: {
        supplier_name: name,
        supplier_code: { [Op.ne]: updatemasterID }, // Exclude the current record
      },
    });

    if (existingData) {
      res.status(201).send('Exist');
    } else {

      // Update the record in the table
      const [affectedRows] = await Supplier.update(
        {
          supplier_name: req.body.suppName,
          supplier_tin: finalTin,
          supplier_email: req.body.suppEmail,
          supplier_address: req.body.suppAdd,
          supplier_city: req.body.suppCity,
          supplier_postcode: req.body.suppPcode,
          supplier_contactPerson: req.body.suppCperson,
          supplier_number: req.body.suppCnum,
          supplier_Telnumber: finalTelNum,
          supplier_terms: finalTerms,
          supplier_vat: finalVat,
          supplier_country: req.body.selectedCountry,
          supplier_receiving: req.body.suppReceving,
          supplier_status: req.body.suppStatus
        },
        {
          where: { supplier_code: updatemasterID },
        }
      );

      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `Supplier: Updated the information of supplier ${req.body.suppName}`,
      });

      res.status(200).json({ message: "Data updated successfully", affectedRows });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});


router.route('/delete/:table_id').delete(async (req, res) => {
  try{
    const id = req.params.table_id;
    const userId = req.query.userId;

    const findProduct = await ProductTAGSupplier.findAll({
      where: {
        supplier_code: id,
      },
    });

    if(findProduct && findProduct.length > 0){
      res.status(202).json({ success: true });
    } else {
      const supplierData = await Supplier.findOne({
        where : {
          supplier_code: id
        },
      });

      const suppname = supplierData.supplier_name;

      const deletionResult = await Supplier.destroy({
        where : {
          supplier_code: id
        },
      });

      if(deletionResult){
        await Activity_Log.create({
          masterlist_id: userId,
          action_taken: `Deleted the data of supplier named ${suppname}`
        });
        res.json({success : true})
      } else {
        res.status(400).json({success : false})
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

// router.route('/delete/:table_id').delete(async (req, res) => {
//   const id = req.params.table_id;

//   await ProductTAGSupplier.findAll({
//     where: {
//       supplier_code: id,
//     },
//   })
//     .then((check) => {
//       if (check && check.length > 0) {
//         res.status(202).json({ success: true });
//       }

//       else{
//         Supplier.destroy({
//           where : {
//             supplier_code: id
//           }
//         }).then(
//             (del) => {
//                 if(del){
//                     res.json({success : true})
//                 }
//                 else{
//                     res.status(400).json({success : false})
//                 }
//             }
//           ).catch(
//             (err) => {
//                 console.error(err)
//                 res.status(409)
//             }
//         );
//       }
//     })
// });




module.exports = router;