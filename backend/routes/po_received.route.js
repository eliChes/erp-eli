const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {PO_Received, PR_PO} = require('../db/models/associations')
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));


//-------------------------------------------------//
router.route('/insertToInventory').post(async (req, res) => {
    try {
            const newData = await PO_Received.create({
            pr_id: req.body.pr_id,
            quantity: req.body.quantity,
            quantity_received: req.body.quantity_received,
            quality_assurance: req.body.quality_assurance
        });

        res.status(200).json(newData);
      
    } catch (err) 
    {
      console.error(err);
      res.status(500).send('An error occurred');
    }
});
//-------------------------------------------------//

module.exports = router;