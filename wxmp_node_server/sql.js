// sql语句
const sql = {
	//用户
	user: {
		//login: 'select a.id as userId,a.isAdmin,b.id as customerId,b.name as customerName from users a left join customer b on a.customerId = b.id where a.openid=? and a.delFlag=0',
		login: 'SELECT a.customerId,b.name AS customerName,b.address AS customerAddress,b.contact,b.phone,b.idSrc,b.licenseSrc,a.id AS userId,a.isAdmin FROM users a LEFT JOIN customer b ON a.customerId = b.id AND b.delFlag=0 WHERE a.openid=? AND a.delFlag=0'
	},
	//公共
	public: {
		dictionary: 'select * from dictionary where delFlag=0 and typeName=?',
		getOrderInfo: 'SELECT a.sex,a.age,a.experience,b.name AS coachMajor,a.province,a.city,a.district,a.num,a.height,a.weight,a.workDate,a.createDate,a.isCheck,IFNULL(a.checkDate,"") AS checkDate,c.name AS customerName FROM bookingorder a INNER JOIN dictionary b ON a.coachMajor = b.id INNER JOIN customer c ON a.customerId = c.id WHERE a.id=?'
	},
	//商家
	customer: {
		bookingOrder: 'insert into bookingOrder (sex,age,experience,coachMajor,province,city,district,num,height,weight,workDate,createDate,isCheck,delFlag,customerId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,0,0,?)',
		settled: 'call customerSettledIn(?,?,?,?,?,?,?,?)',
		settledIn: 'insert into customer (openid,name,address,contact,phone,idSrc,licenseSrc,createDate,isCheck,delFlag) values (?,?,?,?,?,?,?,?,0,0)',
		getCustomerId: 'select id from customer where openid=? and delFlag=0',
		addUser: 'insert into users (customerId,openid,isAdmin,delFlag) values (?,?,0,1)',
		getOrders: 'SELECT c.id,d.name,c.num,c.isCheck FROM customer b INNER JOIN bookingorder c ON b.id = c.customerId INNER JOIN dictionary d ON c.coachMajor = d.id WHERE b.id=? AND (?=0 OR c.num=?) order by c.createDate desc'
	},
	//管理员
	admin: {
		checkCustomer: 'update customer a inner join users b on a.id = b.customerId set a.isCheck=1,a.checkDate=NOW(),b.delFlag=0 where a.id=?',
		getAllOrders: 'SELECT a.id,b.name,a.num,a.isCheck FROM bookingorder a INNER JOIN dictionary b ON a.coachMajor = b.id where ?=0 OR a.num=? ORDER BY a.isCheck asc,a.createDate desc',
		checkOrder: 'update bookingorder set isCheck=1,checkDate=NOW() WHERE id=?',
		getAllCustomers: 'SELECT id,name,isCheck FROM customer WHERE delFlag=0 ORDER BY isCheck asc,createDate desc',
		getCustomerInfo: 'SELECT name,address,contact,phone,idSrc,licenseSrc,createDate,IFNULL(checkDate,"") AS checkDate,isCheck FROM customer WHERE id=?'
	}
	
}

module.exports = sql