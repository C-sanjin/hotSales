# 跨境电商热卖商品数据服务

## 项目结构
```
backend/
├── src/
│   ├── config/            # 配置文件
│   ├── controllers/       # API控制器
│   ├── models/            # 数据库模型
│   ├── services/          # 业务逻辑
│   │   ├── crawler/       # 爬虫服务
│   │   ├── data/          # 数据处理
│   │   └── scheduler/     # 定时任务
│   ├── routes/            # 路由
│   ├── utils/             # 工具函数
│   └── app.js             # 应用入口
├── package.json           # 项目配置
├── .env.example           # 环境变量示例
└── README.md              # 项目说明
```

## 技术栈
- Node.js + Express
- MongoDB (数据存储)
- Puppeteer (爬虫)
- node-cron (定时任务)
- dotenv (环境变量)
- axios (HTTP请求)
- morgan (日志)
- cors (跨域)

## 功能特性
1. **定时爬虫**：每天23:59爬取各平台热卖数据
2. **数据存储**：存储当天数据到MongoDB
3. **API接口**：提供商品数据查询接口
4. **历史数据**：支持近一周、近一个月数据查询
5. **爬虫合规**：遵守robots.txt协议
6. **错误处理**：完善的错误处理机制

## 环境变量
```
# MongoDB连接字符串
MONGODB_URI=mongodb://localhost:27017/hot-sales

# 爬虫配置
CRAWLER_INTERVAL=24h
CRAWLER_TIMEOUT=30000

# 服务器配置
PORT=3001
NODE_ENV=development

# 日志配置
LOG_LEVEL=info
```

## API接口

### GET /api/products
获取商品数据

**参数：**
- platform: 平台名称 (amazon, tiktok, shopee, lazada)
- timeRange: 时间范围 (today, week, month)
- page: 页码 (默认1)
- limit: 每页数量 (默认20)

**响应：**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "string",
        "title": "string",
        "image": "string",
        "price": 0,
        "originalPrice": 0,
        "currency": "string",
        "rating": 0,
        "reviewCount": 0,
        "salesCount": 0,
        "shopName": "string",
        "platform": "string",
        "productUrl": "string",
        "isNew": false,
        "salesTrend": "string",
        "category": "string",
        "listedDate": "string",
        "updatedAt": "string"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20
  },
  "lastUpdateTime": "2026-03-18 23:59:00"
}
```

### GET /api/products/:id
获取单个商品详情

**响应：**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "image": "string",
    "price": 0,
    "originalPrice": 0,
    "currency": "string",
    "rating": 0,
    "reviewCount": 0,
    "salesCount": 0,
    "shopName": "string",
    "platform": "string",
    "productUrl": "string",
    "isNew": false,
    "salesTrend": "string",
    "category": "string",
    "listedDate": "string",
    "updatedAt": "string"
  }
}
```

### POST /api/crawler/run
手动触发爬虫

**响应：**
```json
{
  "success": true,
  "message": "Crawler started",
  "jobId": "string"
}
```

### GET /api/crawler/status
获取爬虫状态

**响应：**
```json
{
  "success": true,
  "data": {
    "lastRun": "2026-03-18 23:59:00",
    "nextRun": "2026-03-19 23:59:00",
    "status": "idle",
    "stats": {
      "totalProducts": 400,
      "successfulPlatforms": 4,
      "failedPlatforms": 0
    }
  }
}
```

## 部署说明
1. 安装依赖：`npm install`
2. 配置环境变量：复制 `.env.example` 为 `.env` 并填写配置
3. 启动服务：`npm start`
4. 开发模式：`npm run dev`

## 爬虫策略
1. **遵守robots.txt**：在爬取前检查并遵守目标网站的robots.txt协议
2. **合理爬取间隔**：每个请求之间设置15-30秒的间隔
3. **用户代理**：使用真实的浏览器用户代理
4. **错误重试**：失败时最多重试3次
5. **数据验证**：爬取后验证数据完整性

## 数据存储策略
1. **每日数据**：每天存储一份完整的热卖商品数据
2. **历史数据**：保留30天的历史数据
3. **索引优化**：为常用查询字段创建索引
4. **数据清洗**：定期清理无效数据

## 监控与告警
1. **爬虫监控**：监控爬虫运行状态
2. **数据监控**：监控数据完整性和更新频率
3. **系统监控**：监控服务器资源使用情况
4. **告警机制**：爬虫失败或数据异常时发送告警
