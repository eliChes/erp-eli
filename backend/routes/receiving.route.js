const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const {
  Receiving_Prd,
  Receiving_Asm,
  Receiving_Spare,
  Receiving_Subpart,
  PR_PO,
  PR_PO_asmbly,
  PR_PO_spare,
  PR_PO_subpart,
  Receiving_Image
} = require("../db/models/associations");
const session = require("express-session");

router.route("/insertReceived").post(async (req, res) => {
  const parentArray = req.body.addReceivebackend;
  const shippingFee = req.body.shippingFee;
  const receving_site = req.body.suppReceving;
  const productImages = req.body.productImages;
  const pr_id = req.body.id;
  const po_id = req.body.po_id;

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
console.log(formattedDate);

  for (const parent of parentArray) {
    for (const child of parent.serializedArray) {
      totalReceived += parseInt(child.Received_quantity || 0);

      console.log(`child.Received_quantity ${child.Received_quantity}`)
    }
  }

  freighCost = (shippingFee / totalReceived).toFixed(2);

  

  for (const parent of parentArray) {
    for (const child of parent.serializedArray) {
      const receivedQuantity = parseInt(child.Received_quantity);
        if (!isNaN(receivedQuantity)) {
        
      if (child.type === "Product") {
        // console.log(`Product ${freighCost}`)

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
            canvassed_id: child.canvassed_ID,
            set_quantity: child.set_quantity || 0,
            freight_cost: freighCost,
            received_quantity: child.Received_quantity,
            remaining_quantity: child.Remaining_quantity,
            ref_code: `PRD-${formattedDate}`,
            status: status,
          });
        }
      } else if (child.type === "Product Assembly") {
        // console.log(`Assembly ${freighCost}`)

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
            canvassed_id: child.canvassed_ID,
            set_quantity: child.set_quantity || 0,
            freight_cost: freighCost,
            received_quantity: child.Received_quantity,
            remaining_quantity: child.Remaining_quantity,
            ref_code: `ASM-${formattedDate}`,
            status: status,
          });
        }
      } else if (child.type === "Product Part") {
        // console.log(`SparePart ${freighCost}`)

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
            canvassed_id: child.canvassed_ID,
            set_quantity: child.set_quantity || 0,
            freight_cost: freighCost,
            received_quantity: child.Received_quantity,
            remaining_quantity: child.Remaining_quantity,
            ref_code: `SPR-${formattedDate}`,
            status: status,
          });
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
            canvassed_id: child.canvassed_ID,
            set_quantity: child.set_quantity || 0,
            freight_cost: freighCost,
            received_quantity: child.Received_quantity,
            remaining_quantity: child.Remaining_quantity,
            ref_code: `SBP-${formattedDate}`,
            status: status,
          });
        }
      } else {
        console.log(`Not a Product`);
      }

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

module.exports = router;