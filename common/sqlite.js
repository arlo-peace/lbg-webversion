/* 数据库管理类 */
class Sqlite {
	
	constructor(arg) {
		// 数据库名
		this.dbName = arg.dbName;
		// 数据库路经
		this.dbPath = arg.dbPath;
		// 打开数据库
		this.openSql();
	}
	
	// 数据库打开状态
	isOpen() {
		let open = plus.sqlite.isOpenDatabase({
			name: this.dbName,
			path: this.dbPath
		});
		return open;
	}
	
	// 如果数据库存在则打开，不存在则创建。
	openSql() {
		if (!this.isOpen()) {
			plus.sqlite.openDatabase({
				name: this.dbName,
				path: this.dbPath,
				success: e => { 
					console.log('open DB successed');
				},
				fail: e => {
					console.log(JSON.stringify(e));
				}
			});
		}
	}
	
	// 执行查询SQL
	selectSQL(sql = null) {
		return new Promise((resolve, reject) => {
			if (!this.isOpen() || sql==null) return reject('sql执行失败');
			plus.sqlite.selectSql({
				name: this.dbName,
				sql,
				success: (e) => {
					resolve(e);
				},
				fail: (e) => {
					reject(JSON.stringify(e));
				}
			});
		})
	}
	
	// 执行增，删，改SQL 
	execSQL(sql = null) {
		return new Promise((resolve, reject) => {
			if (!this.isOpen() || sql==null) return reject('sql执行失败');
			plus.sqlite.executeSql({
				name: this.dbName,
				sql,
				success: (e) => {
					resolve(e);
				},
				fail: (e) => {
					reject(JSON.stringify(e));
				}
			});
		})
	}
	
	delData(sql = null, dirPath = null) {
		if (!this.isOpen() || sql==null || dirPath == null) return false;
		this.execSQL(sql).then(res => {
			plus.io.resolveLocalFileSystemURL(dirPath, entry => {
				entry.remove(r => {
					console.log("删除成功");
				}, e => {
					console.log('删除失败');
				});
			});
		}).catch(err => {
			console.log(err);
		});
	}
	
	// 关闭已打开的数据库
	closeDb() {
		plus.sqlite.closeDatabase({
			name: this.dbName,
			success: e => { 
				//console.log('数据库关闭成功')
			}
		});
	}
}

module.exports = Sqlite