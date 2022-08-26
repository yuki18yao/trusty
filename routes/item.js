'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const { v4: uuidv4 } = require('uuid');
const Item = require('../models/item');
const User = require('../models/user');

router.get('/new', authenticationEnsurer, (req, res, next) => {
  res.render('new', { user: req.user });
});

router.post('/', authenticationEnsurer, async (req, res, next) => {
  const itemId = uuidv4();
  const updatedAt = new Date();
  const item = await Item.create({
    itemId: itemId,
    itemName: req.body.itemName.slice(0, 255) || '（未設定）',
    createdBy: req.user.id,
    updatedAt: updatedAt,
    price: req.body.price,
    condition: req.body.condition,
    brand: req.body.brand,
    category: req.body.category
  });

  res.redirect('/item/' + item.itemId);

});

router.get('/:itemId', authenticationEnsurer, async (req, res, next) => {
  const item = await Item.findOne({
    include: [
      {
        model: User,
        attributes: ['userId', 'username']
      }],
    where: {
      itemId: req.params.itemId
    },
    order: [['updatedAt', 'DESC']]
  });
  if (item) {
    res.render('item', {
      user: req.user,
      item: item,
      users: [req.user]
    });
  } else {
    const err = new Error('Could not find the item that your were looking for.');
    err.status = 404;
    next(err);
  }
});

module.exports = router;