const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const {
  Receiving_PO,
  Receiving_Prd,
  Receiving_Asm,
  Receiving_Spare,
  Receiving_Subpart,
  PR_PO,
  PR_PO_asmbly,
  PR_PO_spare,
  PR_PO_subpart,
  Receiving_Image,
  Activity_Log,
  ProductTAGSupplier,
  Product,
  Assembly_Supplier,
  Assembly,
  SparePart_Supplier,
  SparePart,
  Subpart_supplier,
  SubPart
} = require("../db/models/associations");
const session = require("express-session");

router.route("/insertReceived").post(async (req, res) => {
  const parentArray = req.body.addReceivebackend;
  const shippingFee = req.body.shippingFee;
  const receving_site = req.body.suppReceving;
  const productImages = req.body.productImages;
  const pr_id = req.body.id;
  const po_id = req.body.po_id;
  const userId = req.body.userId;

  let status = "";
  let totalReceived = 0;
  let freighCost = 0;

  if (receving_site === "Davao City") {
    status = "In-transit";
  } else if (receving_site === "Agusan Del Sur") {
    status = "For Approval";
  }
  const currentDate = new Date();
  const options = { 
      timeZone: 'Asia/Manila', 
      hour12: false,
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit'
  };
  const formattedDateTime = currentDate.toLocaleString('en-PH', options);
  const formattedDate = formattedDateTime.replace(/[/:,]/g, '').replace(/\s/g, '');

// Output the formatted current date and time in Manila time zone
    // console.log(formattedDate);


    

  for (const parent of parentArray) {
    for (const child of parent.serializedArray) {
      totalReceived += parseInt(child.Received_quantity || 0);

      console.log(`child.Received_quantity ${child.Received_quantity}`)
    }
  }

  freighCost = (shippingFee / totalReceived).toFixed(2);


  const received_PO = await Receiving_PO.create({
    pr_id: pr_id,
    freight_cost: freighCost,
    totalReceived: totalReceived,
    ref_code: formattedDate,
    status: status,
  });

console.log('dwadwa' + received_PO.id)
  


  

  for (const parent of parentArray) {
    for (const child of parent.serializedArray) {
      const receivedQuantity = parseInt(child.Received_quantity);
      console.log(child);
        if (!isNaN(receivedQuantity)) {
        
          let productName;


      if (child.type === "Product") {
        const update = PR_PO.update(
          {
            quantity: child.ordered_quantity - child.Received_quantity,
          },
          {
            where: { id: child.canvassed_ID },
          }
        );

        if (update) {
          Receiving_Prd.create({
            receiving_po_id: received_PO.id,
            canvassed_id: child.canvassed_ID,
            set_quantity: child.set_quantity || 0,
            // freight_cost: freighCost,
            received_quantity: child.Received_quantity,
            remaining_quantity: child.Remaining_quantity,
            // ref_code: `PRD-${formattedDate}`,
            // status: status,
          });

          const getProdName = await Receiving_Prd.findAll({
            include: [{
              model: PR_PO,
              required: true,
                
                include: [{
                  model: ProductTAGSupplier,
                  required: true,
  
                    include: [{
                      model: Product,
                      required: true,
                    }]
                }]
              }
            ],
          })

          // productName = getProdName[0].purchase_req_canvassed_prd.product_tag_supplier.product.product_name;

 
        }
      } else if (child.type === "Product Assembly") {
        const update = PR_PO_asmbly.update(
          {
            quantity: child.ordered_quantity - child.Received_quantity,
          },
          {
            where: { id: child.canvassed_ID },
          }
        );

        if (update) {
          Receiving_Asm.create({
            receiving_po_id: received_PO.id,
            canvassed_id: child.canvassed_ID,
            set_quantity: child.set_quantity || 0,
            // freight_cost: freighCost,
            received_quantity: child.Received_quantity,
            remaining_quantity: child.Remaining_quantity,
            // ref_code: `ASM-${formattedDate}`,
            // status: status,
          });

          const getAssemblyName = await Receiving_Asm.findAll({
            include: [{
              model: PR_PO_asmbly,
              required: true,
                
                include: [{
                  model: Assembly_Supplier,
                  required: true,
  
                    include: [{
                      model: Assembly,
                      required: true,
                    }]
                }]
              }
            ],
          })

          // productName = getAssemblyName[0].purchase_req_canvassed_asmbly.assembly_supplier.assembly.assembly_name;

        }
      } else if (child.type === "Product Part") {
        const update = PR_PO_spare.update(
          {
            quantity: child.ordered_quantity - child.Received_quantity,
          },
          {
            where: { id: child.canvassed_ID },
          }
        );

        if (update) {
          Receiving_Spare.create({
            receiving_po_id: received_PO.id,
            canvassed_id: child.canvassed_ID,
            set_quantity: child.set_quantity || 0,
            // freight_cost: freighCost,
            received_quantity: child.Received_quantity,
            remaining_quantity: child.Remaining_quantity,
            // ref_code: `SPR-${formattedDate}`,
            // status: status,
          });

          const getSpareName = await Receiving_Spare.findAll({
            include: [{
              model: PR_PO_spare,
              required: true,
                
                include: [{
                  model: SparePart_Supplier,
                  required: true,
  
                    include: [{
                      model: SparePart,
                      required: true,
                    }]
                }]
              }
            ],
          })

          // productName = getSpareName[0].purchase_req_canvassed_spare.sparepart_supplier.spareParts.spareParts_name;
        }
      } else if (child.type === "Product Subpart") {
        // console.log(`Subpart ${freighCost}`)

        const update = PR_PO_subpart.update(
          {
            quantity: child.ordered_quantity - child.Received_quantity,
          },
          {
            where: { id: child.canvassed_ID },
          }
        );

        if (update) {
            Receiving_Subpart.create({
              receiving_po_id: received_PO.id,
              canvassed_id: child.canvassed_ID,
              set_quantity: child.set_quantity || 0,
              // freight_cost: freighCost,
              received_quantity: child.Received_quantity,
              remaining_quantity: child.Remaining_quantity,
              // ref_code: `SBP-${formattedDate}`,
              // status: status,
            });

            const getSubName = await Receiving_Subpart.findAll({
              include: [{
                model: PR_PO_subpart,
                required: true,
                  
                  include: [{
                    model: Subpart_supplier,
                    required: true,
    
                      include: [{
                        model: SubPart,
                        required: true,
                      }]
                  }]
                }
              ],
            })

            // productName = getSubName[0].purchase_req_canvassed_subpart.subpart_supplier.subPart.subPart_name;
          }
        } else {
          console.log(`Not a Product`);
        }

        // await Activity_Log.create({
        //   masterlist_id: userId,
        //   action_taken: `Received ${productName} with quantity ${child.Received_quantity} and remaining ${child.Remaining_quantity}`,
        // });
      }

    }
  }

  const deleteproductImage = Receiving_Image.destroy({
    where: {
      pr_id: pr_id,
      po_num: po_id
    },
  });

  if(deleteproductImage){
    if (productImages && productImages.length > 0) {
      productImages.forEach(async (i) => {


        await Receiving_Image.create({
          pr_id: pr_id,
          po_num: po_id,
          image: i.image
        });
      });
    }
  }else{
    console.log('adwjkd')
  }


  console.log(`Total Received: ${totalReceived}`);
  console.log(`Fr ${freighCost}`);

  return res.status(200).json();
});

router.route("/fetchTransaction").get(async (req, res) => {
  try {

    const PRD = await Receiving_Prd.findAll({
      include:[{
        model: PR_PO,
        required: true,
        
          include: [{
            model: ProductTAGSupplier,
            required: true,
            include: [{
              model: Product,
              required: true,
              attributes: [
                ['product_code', 'product_code'],
                ['product_name', 'product_name'],
              ],
            }],
          }],


        where: {
          pr_id: req.query.pr_id,
          po_id: req.query.po_num
        }
      }]
    });

    const ASM = await Receiving_Asm.findAll({
      include:[{
        model: PR_PO_asmbly,
        required: true,
        
          include: [{
            model: Assembly_Supplier,
            required: true,
            include: [{
              model: Assembly,
              required: true,
              attributes: [
                ['assembly_code', 'product_code'],
                ['assembly_name', 'product_name'],
              ],
            }],
          }],


        where: {
          pr_id: req.query.pr_id,
          po_id: req.query.po_num
        }
      }]
    });

    
    const SPR = await Receiving_Spare.findAll({
      include:[{
        model: PR_PO_spare,
        required: true,
        
          include: [{
            model: SparePart_Supplier,
            required: true,
            include: [{
              model: SparePart,
              required: true,
              attributes: [
                ['spareParts_code', 'product_code'],
                ['spareParts_name', 'product_name'],
              ],
            }],
          }],


        where: {
          pr_id: req.query.pr_id,
          po_id: req.query.po_num
        }
      }]
    });

    
    const SBP = await Receiving_Subpart.findAll({
      include:[{
        model: PR_PO_subpart,
        required: true,
        
          include: [{
            model: Subpart_supplier,
            required: true,
            include: [{
              model: SubPart,
              required: true,
              attributes: [
                ['subPart_code', 'product_code'],
                ['subPart_name', 'product_name'],
              ],
            }],
          }],


        where: {
          pr_id: req.query.pr_id,
          po_id: req.query.po_num
        }
      }]
    });
    
    

    return res.json({
      prd: PRD,
      asm: ASM,
      spr: SPR,
      sbp: SBP
    });
    
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred' });
}
});

module.exports = router;
