const express = require('express')
const path = require('path');   // 引入处理路径的模块
const app = express()
const api = require('./api')

// 引入处理post数据的模块
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// 访问静态资源文件，这里是访问所有uploads目录下的静态资源文件
app.use(express.static(path.resolve(__dirname, './uploads')))

// 后端api路由
app.use('/api',api)
const port = process.env.PORT || 4000

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})