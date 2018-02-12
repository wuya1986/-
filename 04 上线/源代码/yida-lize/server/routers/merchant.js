const config = require('../config');
const logger = require('../lib/logging').getLogger('routers/merchant');

const fs = require('fs');

const express = require('express');

const mdb = require('../mongoose');

const router = express.Router();

router.get('/funcs', (req, res) => res.json({
  success: true,
  nav: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
    },
    {
      title: true,
      name: 'UI elements',
      wrapper: {
        element: '',
        attributes: {},
      },
      class: '',
    },
    {
      name: '媒体库',
      url: '/medias',
      icon: 'icon-pie-chart',
    },
    {
      name: '商品',
      url: '/products',
      icon: 'icon-pie-chart',
    },
    {
      name: '订单',
      url: '/orders',
      icon: 'icon-pie-chart',
    },
    {
      name: '用户支付',
      url: '/userpays',
      icon: 'icon-pie-chart',
    },
  ],
}));

router.get('/myimages', (req, res, next) => {
  const list = fs.readdirSync(config.images_outputs);
  res.json({
    success: true,
    list,
  });
});


router.get('/myproducts', async (req, res, next) => {
  const products = await mdb.Product.find({
    user: req.$userInfo._id
  });
  res.json({
    success: true,
    list: products,
  });
});

router.get('/product/:_id', async (req, res, next) => {
  const product = await mdb.Product.findById(req.params._id);
  res.json({
    success: true,
    data: product,
  });
});

router.post('/product', async (req, res, next) => {
  let product;
  if(req.body.update){
    product = await mdb.Product.findByIdAndUpdate(req.body._id, {
      ...req.body,
    }, {
      new: true,
    });
  } else {
    product = new mdb.Product({
      ...req.body, 
      user: req.$userInfo._id
    });
    await product.save();
}
  res.json({
    success: true,
    data: product,
  });
});


router.get('/myorders', (req, res, next) => {
  const list = [];
  res.json({
    success: true,
    list,
  });
});


module.exports = router;
