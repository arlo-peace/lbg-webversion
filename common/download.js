import api from './api.js';
import dbs from './sqlite.js';
import downm3u8 from '@/utils/downm3u8.js';
/* 视频下载类 */
class Download {
	// 构造方法
	constructor() {
		// 数据库名
		this.dbName = 'ms_video_app';
		// 数据库路经
		this.dbPath = '_doc/'+ api.appkey +'.db';
		// 下载表名
		this.tables = 'down_video';
		// 下载列表
		this.vlists = [];
		// videoOption
		this.option = {};
		this.downlo;
		// 未登录提示
		this.error = '权限不足,请先登录';
		// 轮循时间
		this.times = 3 * 1000;
		// 计数器
		this.complete = this.percentage = this.count = 0;
		// 实例数据库
		this.dbs = new dbs({
			dbPath: this.dbPath,
			dbName: this.dbName,
			tables: this.tables
		});
		// 下载对象
		this.downloadTask = {};
		// 登录用户信息
		this.login = api.getLogins();
		// 初始化
		this.init();
	}
	// 初始化
 	async init() {
		if (this.dbs.isOpen()) {
			// 如果数据表不存在则创建
			let sql = 'create table if not exists '+this.tables+'("userid" INT(11),"videoid" INT(11),"type" CHAR(10),"title" CHAR(100),"url" CHAR(250),"poster" CHAR(250),"videosize" CHAR(50),"downsize" CHAR(50),"downkb" CHAR(50),"videoing" INT(11),"starttostop" INT(1),"downstatus" INT(1),"delstatus" INT(1))';
			await this.dbs.execSQL(sql).then(r => {
				//console.log(r);
			}).catch(err => console.log(err));
			// 执行下载任务
			this.downTask();
		} else {
			// 数据库未打开，1秒后重试
			let timer = setTimeout(() => {
				this.init();
				clearTimeout(timer);
			}, 1000);
		}
	}
	// 下载任务
	async downTask() {
		// console.log(this.login)
		var sql = 'select * from '+this.tables+' where downstatus=0 and delstatus=1 and userid='+this.login.userId;
		// console.log(sql)
		await this.dbs.selectSQL(sql).then(res => {
			this.vlists = res;
		}).catch(err => {
			console.log('vlists-----err', err);
		});
		// console.log(this.vlists)
		if (this.vlists.length > 0) {
			var data = this.vlists[0];
			console.log(data)
			// 下载封面图
			uni.downloadFile({
				url: data.poster,
				success: (res)=> {
					//console.log(res.tempFilePath);
					if (res.statusCode == 200) {
						uni.saveFile({
							tempFilePath: res.tempFilePath,
							success: (e) => {
								data.poster = e.savedFilePath;
							},
							fail: (e) => {
								console.log('封面保存失败:', e);
							}
						});
					}
				},
				fail: (e) => {
					console.log(e)
				}
			});
			// 下载视频 MP4或m3u8
			var videoUrl = data.url;
			if (videoUrl.indexOf('.m3u8') != -1) {
				// m3u8
				var that = this;
				this.option = {
					id: 'id_'+ data.videoid, //下载标识，用于断线续传：开始任务时存在即续传，不存在新建
				    url: videoUrl, //m3u8地址
					dirpath: 'uniapp_save/m3u8', //保存到目录
					timeout: 30, //超时时间
				    tryTepeat: 3, //下载失败重试次数
				    meanwhile: 1, //并发下载数
					retryInterval: 30,   //重试等待时间
				    initcallback(res) {
				        //m3u8解析的回调，解析成功返回片段列表并开始下载，解析失败message
				        // console.log(res)
				        that.complete = 0;
				        var length = res.obj.tslist.length;
				        for (let i in res.obj.streamlist) {
				            length += res.obj.streamlist[i].tslist.length;
				        }
				        that.count = length;
				        that.percentage = 0;
				    },
				    tsloadcallback(res) {
				        //片段下载回调，成功返回片段信息，失败返回respose，
				        // console.log('tsloadcallback', res); 
				        that.complete++;
				        that.percentage = Math.floor((that.complete / that.count) * 100);
						res.progress = that.percentage;
						res.videosize= that.count;
						res.downsize = that.complete;
						uni.$emit('download_event', {type:'progress',data:res});
						uni.$emit('downloaing', data.videoid);
				    },
				    finishcallback(res) {
				        //文件保存为 app缓存 / 保存目录 / 下载标识.m3u8
						// console.log(res)
				        data.url = res.obj.path;
						data.videosize = that.count;
						that.updateDown(data);
						uni.$emit('downloaing', 0);
				    }
				}
				downm3u8(this.option);
			} else {
				// mp4 或 其它 
				this.downloadTask = uni.downloadFile({
				    url: videoUrl,
				    success: (res) => {
						//console.log(res);
				        if (res.statusCode === 200) {
							// 保存至本地
							uni.saveFile({
								tempFilePath: res.tempFilePath,
								success: red => {
									data.url = red.savedFilePath;
									this.updateDown(data);
								}
							});
				        } else {
							api.showToast('下载超时，尝试重新下载01', 2000);
							this.reconnct(this.times);
						}
				    },
					fail: (e) => {
						api.showToast('下载超时或手动取消', 2000);
						this.reconnct(this.times);
					}
				});
				this.downloadTask.onProgressUpdate(res => {
					//console.log(res.progress);
					var videoSize = res.totalBytesExpectedToWrite/1024/1024;
					data['videosize'] = videoSize.toFixed(2);
					var downSize = res.totalBytesWritten/1024/1024;
					res.videosize = videoSize.toFixed(2);
					res.downsize = downSize.toFixed(2);
					uni.$emit('download_event', {type:'progress',data:res});
				});
			}
		} else {
			this.reconnct(this.times);
		}
		//console.log('run：任务('+ this.vlists.length +')');
	}
	reconnct(time = 0) {
		let timer = setTimeout(() => {
			this.login = api.getLogins();
			this.downTask();
			uni.$emit('download_event', {type:'connct',data:''});
			clearTimeout(timer);
		}, time);
	}
	// 更新下载数据
	updateDown(d) {
		let where = "userid="+this.login.userId+" and videoid="+d.videoid;
		let sql = "update "+this.tables+" set downstatus=1,starttostop=0,downkb='下载完成',poster='"+d.poster+"',videosize='"+d.videosize+"',url='"+d.url+"' where "+where;
		this.dbs.execSQL(sql).then(r => {
			this.reconnct(0);
			console.log('down success');
		}).catch(err => {
			console.log('downErr:', JSON.stringify(err));
		});
	}
	// 停止当前任务
	stopDownTask() {
		this.downloadTask.abort();
		console.log('stopDownTask');
	}
	callback(callback, result) {
	    if (typeof callback == 'function') {
	        callback(result);
	    }
	}
	// 添加下载任务
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
	// 删除下载
	delTask(vid, filePath = '') {
		return new Promise((resolve, reject) => {
			if (!this.login) reject(this.error);
			if (this.vlists.length && vid == this.vlists[0].videoid) {
				var type = (this.vlists[0].url.indexOf('.m3u8') != -1) ? 'm3u8' : 'mp4';
				if (type != 'm3u8') this.stopDownTask();
				// if (type == 'm3u8') downm3u8(this.option, true)
			}
			var sql = 'delete from '+this.tables+' where userid='+this.login.userId+' and videoId='+ vid;
			this.dbs.execSQL(sql).then(res => {
				if (filePath.length) {
					uni.removeSavedFile({filePath: filePath});
				} 
				resolve(res);
			}).catch(err => {
				console.log(err);
				reject(JSON.stringify(err));
			});
		})
	}
	// 任务是否已添加
	isDown(vid) {
		return new Promise((resolve, reject) => {
			if (!this.login) reject(this.error);
			var sql = 'select * from '+this.tables+' where userid='+this.login.userId+' and videoId ='+ vid;
			this.dbs.selectSQL(sql).then(res => {
				resolve(res);
			}).catch(err => {
				reject(JSON.stringify(err));
			});
		})
	}
	// 所有任务
	allTask() {
		return new Promise((resolve, reject) => {
			if (!this.login) reject(this.error);
			var sql = 'select * from '+this.tables+' where userid='+this.login.userId;
			this.dbs.selectSQL(sql).then(res => {
				resolve(res);
			}).catch(err => { 
				reject(JSON.stringify(err));
			});
		});
	}
	// 关闭
	closeDb() {
		this.dbs.closeDb();
	}
}
/* 运行 */
function run() {
	return new Download();
}
/* 注册 */
module.exports = run()