'use strict';
const express = require('express');
const router = express.Router();
const Item = require('../models/item');

/* GET home page. */
router.get('/', async (req, res, next) => {
  const title = 'Trusty';
  if (req.user) {
    const item = await Item.findAll({
      where: {
        createdBy: req.user.id
      },
      order: [['updatedAt', 'DESC']]
    });
    res.render('index', {
      title: title,
      user: req.user,
      item: item
    });
  } else {
    res.render('index', { title: title, user: req.user });
  }
});

module.exports = router;
