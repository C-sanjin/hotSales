const express = require('express');
const ProductController = require('../controllers/ProductController');

const router = express.Router();

// 商品相关路由
router.get('/products', ProductController.getProducts);
router.get('/products/:id', ProductController.getProductById);

// 爬虫相关路由
router.post('/crawler/run', ProductController.runCrawler);
router.get('/crawler/status', ProductController.getCrawlerStatus);

module.exports = router;
