const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number
  },
  currency: {
    type: String,
    default: 'USD'
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  },
  shopName: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['amazon', 'tiktok', 'shopee', 'lazada']
  },
  productUrl: {
    type: String,
    required: true
  },
  isNew: {
    type: Boolean,
    default: false
  },
  salesTrend: {
    type: String,
    enum: ['up', 'down', 'stable'],
    default: 'stable'
  },
  category: {
    type: String
  },
  listedDate: {
    type: Date
  },
  crawlDate: {
    type: Date,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// 创建索引
productSchema.index({ platform: 1, crawlDate: 1, salesCount: -1 });
productSchema.index({ platform: 1, crawlDate: 1, rating: -1 });
productSchema.index({ platform: 1, crawlDate: 1, price: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
