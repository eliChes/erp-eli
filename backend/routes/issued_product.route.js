const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const Issued_Product = require('../db/models/issued_product.model')
const {Inventory, Product, ProductTAGSupplier, IssuedProduct, Issuance} = require('../db/models/associations')
const session = require('express-session');

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

router.route('/getProducts').get(async (req, res) => 
{
    try {
        const data = await IssuedProduct.findAll({
            where: {
                issuance_id: req.query.id
            },
            include:[{
                
                model: Inventory,
                required: true,

                include: [{
                    model: ProductTAGSupplier,
                    required: true,

                    include: [{
                        model: Product,
                        required: true
                    }]
                }]

            }]
        });

        if (data) {
        return res.json(data);
        } else {
        res.status(400);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json("Error");
    }
});


router.route('/getissued').get(async (req, res) => 
{
    try {
        const data = await IssuedProduct.findAll({
            include:[{
                model: Issuance,
                required: true,
                    where: {
                        issued_to: req.query.id
                    }   
            }, {
                model: Inventory,
                required: true,
                    include:[{
                        model: ProductTAGSupplier,
                        required: true,
                            include:[{
                                model: Product,
                                required: true 
                            }]
                    }]
            }]
            // include: [{
            //     model: IssuedProduct,
            //     required: true,
                
            //         include:[{
            //             model: Inventory,
            //             required: true,
                         
            //             include:[{
            //                 model: ProductTAGSupplier,
            //                 required: true,
                             
            //                 include:[{
            //                     model: Product,
            //                     required: true
            //                 }]
            //             }]
            //         }]
            // }],
        });

        if (data) {
        return res.json(data);
        } else {
        res.status(400);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json("Error");
    }
});

module.exports = router;