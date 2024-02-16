import api from './api.js';
import dbs from './sqlite.js';

/* 视频下载类 */
class DownNative {
	// 构造方法
	constructor() {
		// 数据库名
		this.dbName = 'ms_video_app';
		// 数据库路经
		this.dbPath = '_doc/'+ api.appkey +'.db';
		// 下载表名
		this.tables = 'down_video';
		// 实例数据库
		this.dbs = new dbs({
			dbPath: this.dbPath,
			dbName: this.dbName,
			tables: this.tables
		});
		// 登录用户信息
		this.login = api.getLogins();
	}
	// 下载任务
	addTask(data) {
		return new Promise((resolve, reject) => {
			if (!this.login) reject(this.error);
			var type = (data.url.indexOf('.m3u8') != -1) ? 'm3u8' : 'mp4';
			var sql = "insert into "+this.tables+" values('"+this.login.userId+"','"+data.videoId+"','"+type+"','"+data.title+"','"+data.url+"','"+data.poster+"','"+data.videoSize+"','0','准备就绪','0','1','0','1')";
			this.dbs.execSQL(sql).then(res => {
				// console.log('res', res);
				resolve('success');
			}).catch(err => {
				console.log(err);
				reject(JSON.stringify(err));
			});
		})
	}
}
/* 运行 */
function run() {
	return new DownNative();
}
/* 注册 */
module.exports = run()