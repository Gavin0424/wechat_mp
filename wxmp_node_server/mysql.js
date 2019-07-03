const mysql = require('mysql')

// mysql配置
const db = {
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'test',
        port: 3306,
        connectionLimit : 50,
        multipleStatements : true
    }

// 使用连建池
const pool = mysql.createPool(db)

const execute = (sql, ...params ) => { //...数组(ES6扩展运算符)
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if(err) {
				reject(err);
                return;
			}
			connection.query(sql, params, (err,results) => {
				connection.release();
				if(err) {
					reject(err)
					return;
				}
				resolve(results)
			})
		})
	})
}

module.exports = {
	execute : execute 
}