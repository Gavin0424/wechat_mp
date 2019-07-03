const express = require('express')
const router = express.Router()
const logger = require('./log4').logger('api')
const axios = require('axios')
const multer = require('multer')
const path = require('path')
const mysql = require('./mysql')
const sqlMap = require('./sql')
const wx = require('./wx')
// 登录
const loginsql = sqlMap.user.login
//获取字典
const dictionarysql = sqlMap.public.dictionary
//商户下单
const bookingOrdersql = sqlMap.customer.bookingOrder
//商户入驻存储过程
const settledsql = sqlMap.customer.settled
//商户入驻新增customer信息
const settledInsql = sqlMap.customer.settledIn
//获取客户id
const getCustomerIdSql = sqlMap.customer.getCustomerId
//商户入驻新增用户信息
const addUsersql = sqlMap.customer.addUser
//商户获取订单
const getOrdersSql = sqlMap.customer.getOrders
//订单详情
const getOrderInfoSql = sqlMap.public.getOrderInfo
//管理员获取订单
const getAllOrdersSql = sqlMap.admin.getAllOrders
//管理员审核订单
const checkOrderSql = sqlMap.admin.checkOrder
//管理员查询入驻数据
const getCustomersSql = sqlMap.admin.getAllCustomers
//管理员查看商户入驻详情
const getCustomerInfoSql = sqlMap.admin.getCustomerInfo
//管理员审核商户入驻
const checkCustomersql = sqlMap.admin.checkCustomer
const loginurl = 'https://api.weixin.qq.com/sns/jscode2session?'
const appid = wx.appid
const secret = wx.secret
// const appid = 'wx20774a4c1c32ffe9'
// const secret = 'cd74427cbacdf6d7c75d36ebd5cf630f'

//const upload = multer({ dest: './tmp/'})
//上传文件配置  
const storage = multer.diskStorage({  
  //文件存储位置  
  destination: (req, file, cb) => {  
    cb(null, path.resolve(__dirname, './uploads/tmp/'));  
  },  
  //文件名  
  filename: (req, file, cb) => {  
    cb(null, `${Date.now()}_${Math.ceil(Math.random() * 1000)}_multer.${file.originalname.split('.').pop()}`);  
  }  
})
const uploadCfg = {  
  storage: storage,  
  limits: {  
    //上传文件的大小限制,单位bytes  
    fileSize: 1024 * 1024 * 20  
  }  
}


//测试数据库连接
// let sql = 'select * from user where username = ?'
// let params = ['张三']
// mysql.execute(sql, params).then(res => {
//  	console.log('The result is: ', res)
// })

/**
 * 用户登录
 * @params:code
 */  
router.get('/login', (req,res) => {
	logger.info('login start...')
	let code = req.query.code
	// 先通过code换取openid
	let params = {
		appid: appid,
		secret: secret,
		js_code: code,
		grant_type: 'authorization_code'
	}
	axios.get(loginurl, {params: params})
	.then(val => {
		if(val.data != undefined && val.data.errcode == undefined)
		{
			console.log(val.data)
			mysql.execute(loginsql, val.data.openid)
			.then(result => {
				if(result.length>0) {
					console.log('login success')
					res.send({
						'code': 0,
						'userId': result[0].userId,
						'isAdmin': result[0].isAdmin,
						'customerId': result[0].customerId == null ? '' : result[0].customerId,
						'customerName': result[0].customerName == null ? '' : result[0].customerName,
						'customerAddress': result[0].customerAddress == null ? '' : result[0].customerAddress,
						'contact': result[0].contact == null ? '' : result[0].contact,
						'phone': result[0].phone == null ? '' : result[0].phone,
						'idSrc': result[0].idSrc == null ? '' : result[0].idSrc,
						'licenseSrc': result[0].licenseSrc == null ? '' : result[0].licenseSrc
					})
				} else {
					console.log('user not exist')
					res.send({
						'code': 1,
						'message': 'user not exist'
					})
				}
				logger.info('login end...')
		    }).catch(err => {
		       console.log(err)
		    })
		}
	}).catch(err => {
		logger.err('code change openid error: ' + err)
	})
})


/**
 * 加载数据字典
 */  
router.get('/loadDictionary', (req,res) => {
	logger.info('loadDictionary start...')
	let typeName = req.query.typeName
	mysql.execute(dictionarysql, typeName)
	.then(result => {
		if(result.length>0) {
			console.log(result)
			res.send({
				'code': 0,
				'message': '',
				'list': result
			})
		} else {
			console.log('loadDictionary fail')
			res.send({
				'code': 1,
				'message': 'loadCoachMajor fail'
			})
		}
		logger.info('loadDictionary end...')
    }).catch(err => {
       logger.info('loadDictionary error: ' + err)
    })
})

/**
*上传图片方法一
*/
router.post('/upload', async (req, res) => {
	logger.info('upload start...')
	let upload = multer(uploadCfg).any()
	upload(req, res, async (err) => {  
	    if (err) {  
	      res.json({ code: 1 }) 
	      console.log(err) 
	      return;  
	    } 
	    let uploadFile = req.files[0]
	    res.json({ code:0, path: `/tmp/${uploadFile.filename}` })
  	})
 	logger.info('upload end...')
})
/**
*上传图片方法二
*/
// router.post('/upload', upload.single('file'), (req, res) => {
// 	console.log('上传开始。。。。')
// 	var file = req.file
//     console.log('文件类型：%s', file.mimetype);
//     console.log('原始文件名：%s', file.originalname);
//     console.log('文件大小：%s', file.size);
//     console.log('文件保存路径：%s', file.path)
//     res.json({
// 				code: 0,
// 				path: file.path
// 			})
//     console.log('上传完成。。。。')
// })

/**
*商家入驻
*/
router.post('/settledIn', (req, res) => {
	logger.info('settledIn start...')
	console.log(req.body)
	let params = req.body
	let code = params.code
	let customerName = params.customerName
	let customerAddress = params.customerAddress
	let customerContact = params.customerContact
	let customerPhone = params.customerPhone
	let idImage = params.idImage
	let licenseImage = params.licenseImage
	let createDate = params.createDate
	let param = {
		appid: appid,
		secret: secret,
		js_code: code,
		grant_type: 'authorization_code'
	}
	//通过code获取openid
	axios.get(loginurl, {params: param}).then(val => {
		if(val.data != undefined && val.data.errcode == undefined)
		{
			//调用存储过程
			mysql.execute(settledsql,val.data.openid, customerName, customerAddress, customerContact, customerPhone, idImage, licenseImage, createDate)
			.then(result => {
				console.log(result)
				if(result.message == '') {
					logger.info('settledIn success')
					res.send({
						'code': 0,
						'message': ''
					})
				} else {
					logger.info('settledIn fail')
				}
			})
			
			/**
			//新增商户信息
			mysql.execute(settledInsql, val.data.openid, customerName, customerAddress, customerContact, customerPhone, idImage, licenseImage, createDate)
			.then(result => {
				if(result.affectedRows > 0) {
					console.log('add customer success')
					mysql.execute(getCustomerIdSql,val.data.openid)
					.then(result1 => {
						if(result1.length>0) {
							console.log('getCustomerId succcess')
							console.log('customerId: '+result1[0].id)
							//新增用户信息
							mysql.execute(addUsersql, result1[0].id,val.data.openid)
							.then(resultt => {
								if(resultt.affectedRows > 0) {
									console.log('add user success')
									res.send({
										'code': 0,
										'message': ''
									})
								} else {
									console.log('add user fail')
									res.send({
										'code': 1,
										'message': 'add user fail'
									})
								}
								logger.info('checkCustomer end...')
							}).catch(err => {
								logger.info('add user error: ' + err)
							})
						} else {
							console.log('getCustomerId fail')
							res.send({
								'code': 1,
								'message': 'getCustomerId fail'
							})
						}
					}).catch(err => {
							logger.info('getCustomerId error: ' + err)
						})
					logger.info('settledIn end...')
				} else {
					console.log('add customer fail')
					res.send({
						'code': 1,
						'message': 'add customer fail'
					})
				}
				
			}).catch(err => {
		       logger.info('settledIn error: ' + err)
		    })
		    */
		}
		else {
			logger.info('settledIn code change openid fail')
		}
	}).catch(err => {
		logger.info('settledIn code change openid error: ' + err)
	})
})


/**
*商家下单
*/
router.post('/bookingOrder', (req, res) => {
	logger.info('bookingOrder start...')
	console.log(req.body)
	let params = req.body
	let sexIndex = params.sexIndex
	let ageIndex = params.ageIndex
	let exIndex = params.exIndex
	let coachMajorId = params.coachMajorId
	let region = params.region
	let inputNum = params.inputNum
	let inputHeight = params.inputHeight
	let inputWeight = params.inputWeight
	let startDate = params.startDate 
	let createDate = params.createDate
	let customerId = params.customerId
	mysql.execute(bookingOrdersql, sexIndex, ageIndex, exIndex, coachMajorId, region[0], region[1], region[2], inputNum, 
		inputHeight, inputWeight, startDate, createDate,customerId)
	.then(result => {
		if(result.affectedRows > 0) {
			console.log('add bookingOrder success')
			res.send({
				'code': 0,
				'message': ''
			})
		} else {
			console.log('add bookingOrder fail')
			res.send({
				'code': 1,
				'message': 'add bookingOrder fail'
			})
		}
		logger.info('bookingOrder end...')
	}).catch(err => {
       logger.info('bookingOrder error: ' + err)
    })
})

/**
* 查询订单
*/
router.get('/getOrders', (req,res) => {
	logger.info('getOrders start...')
	let num = req.query.num
	let customerId = req.query.customerId
	let isAdmin = req.query.isAdmin
	if(isAdmin == 1) {
		mysql.execute(getAllOrdersSql, num,num)
		.then(result => {
			res.send({
				'code': 0,
				'message': '',
				'list': result
			})
		}).catch(err => {
       		logger.info('getAllOrders error: ' + err)
    	})
	} else {
		mysql.execute(getOrdersSql, customerId,num,num)
		.then(result => {
			res.send({
				'code': 0,
				'message': '',
				'list': result
			})
		}).catch(err => {
       		logger.info('getOrders error: ' + err)
    	})
	}
})

/**
* 订单详情
*/
router.get('/getOrderInfo', (req,res) => {
	logger.info('getOrderInfo start...')
	let id = req.query.id
	console.log('id: ' + id)
	mysql.execute(getOrderInfoSql, id)
	.then(result => {
		res.send({
			'code': 0,
			'message': '',
			'list': result
		})
	}).catch(err => {
   		logger.info('getOrderInfo error: ' + err)
	})
})

/**
* 管理员订单审核
*/
router.get('/checkOrder', (req,res) => {
	logger.info('checkOrder start...')
	let id = req.query.id
	console.log('id: ' + id)
	mysql.execute(checkOrderSql, id)
	.then(result => {
		if(result.affectedRows > 0) {
			res.send({
				'code': 0,
				'message': ''
			})
		} else {
			console.log('checkOrder fail')
			res.send({
				'code': 1,
				'message': 'checkOrder fail'
			})
		}
	}).catch(err => {
   		logger.info('checkOrder error: ' + err)
	})
})

/**
*管理员查询商户入驻数据
*/
router.get('/getCustomers', (req,res) => {
	logger.info('getCustomers start...')
	mysql.execute(getCustomersSql)
	.then(result => {
		res.send({
			'code': 0,
			'message': '',
			'list': result
		})
	}).catch(err => {
   		logger.info('getCustomers error: ' + err)
	})
})

/**
*管理员查询商户入驻详情
*/
router.get('/getCustomerInfo', (req,res) => {
	logger.info('getCustomerInfo start...')
	let id = req.query.id
	console.log('id: ' + id)
	mysql.execute(getCustomerInfoSql, id)
	.then(result => {
		res.send({
			'code': 0,
			'message': '',
			'list': result
		})
	}).catch(err => {
   		logger.info('getCustomerInfo error: ' + err)
	})
})

/**
*管理员入驻审核
*/
router.get('/checkCustomer', (req,res) => {
	logger.info('checkCustomer start...')
	let id = req.query.id
	//更新商户审核状态及审核时间
	mysql.execute(checkCustomersql, id)
	.then(result => {
		if(result.affectedRows > 0) {
			console.log('checkCustomer success')
			res.send({
				'code': 0,
				'message': ''
			})
		} else {
			logger.info('checkCustomer fail')
			res.send({
				'code': 1,
				'message': 'checkCustomer fail'
			})
		}
    }).catch(err => {
       logger.info('checkCustomer error: ' + err)
    })
})

module.exports = router;