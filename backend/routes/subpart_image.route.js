const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {SubPart, Subpart_image} = require('../db/models/associations')
const session = require('express-session')

router.route('/fetchsubpartImage').get(async (req, res) => {
    try {
      const data = await Subpart_image.findAll({
        include:[{
          model: SubPart,
          required: true
        }],
        where: {
          subpart_id: req.query.id,
        },
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