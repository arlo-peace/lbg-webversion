<template>
	<view>
		<view class="content-head" :style="{ padding: top + 'px 0 10px 0' }">系统设置</view>

		<!-- #ifdef APP-PLUS -->
		<view class="head-tx">
			<view>当前版本</view>
			<view class="head-acc">{{version}} #</view>
		</view>
		<!-- #endif -->

		<view class="head-tx" @click="detectionApp">
			<view>检测更新 <view class="newTig" v-if="isNew"></view>
			</view>
			<view class="head-acc"> {{newVersion}}
				<image src="/static/imgs/r.png" style="width:12px;height:10px;"></image>
			</view>
		</view>

		<!-- #ifdef APP-PLUS -->
		<view class="head-tx" @click="clearCache">
			<view>清理缓存</view>
			<view class="head-acc">{{cacheSize}}
				<image src="/static/imgs/r.png" style="width:12px;height:10px;"></image>
			</view>
		</view>
		<!-- #endif -->

		<view class="head-tx" @click="skipUrl('/pages/member/activity?type=agreement', 2)">
			<view>服务协议</view>
			<view class="head-acc">
				<image src="/static/imgs/r.png" style="width:12px;height:10px;"></image>
			</view>
		</view>
		<view class="head-tx" @click="skipUrl('/pages/member/activity?type=privacy', 2)">
			<view>隐私政策</view>
			<view class="head-acc">
				<image src="/static/imgs/r.png" style="width:12px;height:10px;"></image>
			</view>
		</view>
		<view class="head-tx" @click="skipUrl('/pages/setting/about', 2)">
			<view>商务合作</view>
			<view class="head-acc">
				<image src="/static/imgs/r.png" style="width:12px;height:10px;"></image>
			</view>
		</view>
		<uni-popup ref="popupUpdate" type="center" :maskClick="false">
			<view class="upgrade">
				<image class="update-title" src="/static/svod/upgrade.png" mode="aspectFill"></image>
				<text class="update-msg">新版本（{{newVersion}}）,升级新版本，让你的体验更流畅，功能更强大。</text>
				<view v-if="isUpdate" style="display:flex;flex-direction:row;padding:0 30rpx;">
					<view class="update-botton" @click="updateApp">
						立即更新<text style="font-size:12px;">{{isDown}}</text>
					</view>
					<view class="close-update" @click="colseUpdate">忽略</view>
				</view>
				<view v-else>
					<view class="update-ing">
						<view class="ing" :style="{ width : ingWidth +'%' }">{{ingWidth}}%</view>
					</view>
					<view class="update-wz">{{updateWz}}</view>
				</view>
			</view>
		</uni-popup>
		<css-loading ref="cssLoading"></css-loading>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	var _self;
	export default {
		data() {
			return {
				userId: 0,
				versionCode: '100',
				version: 'v1.0.1',
				cacheSize: '0M',
				newVersion: '已是最新版',
				mobileSystem: 'android',
				isNew: false,
				updateTig: false,
				isUpdate: true,
				downUrl: '',
				ingWidth: 0,
				updateWz: '下载中,请稍后...',
				isDown: '',
				downAppApk: false,
				top: 27,
			}
		},
		onLoad() {
			_self = this;
			// #ifdef APP-PLUS
			_self._showLoading('加载中...');
			// #endif
			var mobile = uni.getSystemInfoSync();
			_self.top = mobile.safeArea.top + 7;
			// 获取手机系统 ios/android
			uni.getSystemInfo({
				success: res => {
					_self.mobileSystem = res.platform;
				}
			});
			// #ifdef APP-PLUS
			_self.getNewApp();
			_self.getAppVersion();
			_self.getCache();
			// #endif
		},
		methods: {
			// 读取是否有新版本
			getNewApp() {
				plus.runtime.getProperty(plus.runtime.appid, (e) => {
					_self.versionCode = e.versionCode;
					_self.version = e.version;
					// 请求服务器版是否有新版本
					uni.request({
						url: api.apiData.getVersion,
						method: 'GET',
						success: (e) => {
							var res = e.data.Data;
							//console.log(res)
							if (_self.mobileSystem == 'ios') {
								// 苹果
								var versionCode = res.apple.versionCode;
								var version = res.apple.version;
								_self.downUrl = res.apple.downUrl;
							} else {
								// 安卓
								var versionCode = res.android.versionCode;
								var version = res.android.version;
								_self.downUrl = res.android.downUrl;
							}
							if (versionCode > _self.versionCode) {
								// 提示有新版本
								_self.newVersion = version;
								_self.isNew = true;
							} else {
								_self.newVersion = '已是最新版';
								_self.isNew = false;
							}
							_self._hideLoading();
						},
						fail: () => {
							// 加载失败提示
							_self.msgData('服务器连接失败，请检查网络是否正常', 5000);
						}
					});
				});
			},
			// 获取APP版本号
			getAppVersion() {
				plus.runtime.getProperty(plus.runtime.appid, (e) => {
					//console.log(JSON.stringify(e));//应用数据
					//console.log('应用版本号:'+e.versionCode);//应用版本号
					//console.log('应用版本名称:'+e.version);//应用版本名称
					_self.versionCode = e.versionCode;
					_self.version = e.version;
				});
			},
			// 检查版本
			detectionApp() {
				if (_self.isNew) {
					uni.getStorage({
						key: 'newAppApk',
						success: function(res) {
							_self.downAppApk = res.data;
							_self.isDown = '(已下载)';
						}
					});
					_self.updateTig = true;
					_self.$refs['popupUpdate'].open();
				} else {
					_self.msgData('当前已是最新版');
				}
			},
			// 在线下载
			updateApp() {
				if (_self.mobileSystem == 'ios') {
					// 苹果跳转
					_self.skipUrl(_self.downUrl, 3);
				} else {
					if (_self.downAppApk) {
						_self.installApk(_self.downAppApk);
						//console.log(_self.downAppApk)
					} else {
						_self.downApp();
						//console.log(2)
					}
				}
			},
			// 下载安卓
			downApp() {
				_self.isUpdate = false;
				const downloadTask = uni.downloadFile({
					url: _self.downUrl,
					success: (res) => {
						if (res.statusCode === 200) {
							// 保存至本地
							uni.saveFile({
								tempFilePath: res.tempFilePath,
								success: function(red) {
									_self.updateWz = "下载完成,正在安装,请稍后...";
									// 打印路经
									//console.log(red.savedFilePath)
									uni.setStorage({
										key: 'newAppApk',
										data: red.savedFilePath
									});
									_self.installApk(red.savedFilePath);
								}
							});
						}
					}
				});
				downloadTask.onProgressUpdate((res) => {
					//console.log('下载进度' + res.progress);
					_self.ingWidth = res.progress;
				});
			},
			// 关闭更新弹窗
			colseUpdate() {
				_self.updateTig = false;
				_self.$refs['popupUpdate'].close();
			},
			// 更新应用资源  
			installApk(path) {
				plus.runtime.install(path, {}, function() {
					//console.log("包装包运行成功！");
					plus.runtime.restart();
				}, function(e) {
					//console.log(JSON.stringify(e));
					uni.setStorage({
						key: 'newAppApk',
						data: false
					});
					_self.msgData('APP更新失败，请检查是否有权限');
				});
			},
			// 获取缓存大小
			getCache() {
				// size是多少个字节单位是b
				plus.cache.calculate(function(size) {
					//你可以做下面相应的处理
					if (size < 1024) {
						_self.cacheSize = size + 'B';
					} else if (size / 1024 >= 1 && size / 1024 / 1024 < 1) {
						_self.cacheSize = Math.floor(size / 1024 * 100) / 100 + 'KB';
					} else if (size / 1024 / 1024 >= 1) {
						_self.cacheSize = Math.floor(size / 1024 / 1024 * 100) / 100 + 'M';
					}
				});
			},
			// 清理缓存
			clearCache() {
				//可以询问用户是否删除
				uni.showModal({
					title: '提示',
					content: '确定清除缓存吗?',
					success(res) {
						// 用户确定要删除
						if (res.confirm) {
							plus.cache.clear(function() {
								uni.showToast({
									title: '清除成功',
									icon: 'none',
									success() {
										// 成功后处理
										_self.getCache();
										_self.getAppVersion();

									}
								})
							});
						}
					}
				})
			},
			// 跳转登录
			skipUrl(url = '/pages/login/login', type = 1) {
				if (type == 1) {
					// 原窗口
					uni.reLaunch({
						url: url
					});
				} else if (type == 2) {
					// 新窗口
					uni.navigateTo({
						url: url
					});
				} else {
					// 其它请求处理
					api.jumpUrl(url, 'web');
				}
			},
			// 提示
			msgData(title = '', times = 1000, style = 'none') {
				_self._hideLoading()
				setTimeout(() => {
					uni.showToast({
						icon: style,
						title: title,
						mask: true,
						duration: times
					})
				}, 200);
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			_self.getNewApp();
			_self.getAppVersion();
			_self.getCache();
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
	.close-update {
		width: 150rpx;
		height: 40px;
		border-radius: 40px;
		background-color: rgba(0, 0, 0, 0.5);
		color: #FFFFFF;
		justify-content: center;
		align-items: center;
		display: flex;
		font-size: 14px;
		margin-left: 15rpx;
	}

	.update-msg {
		display: block;
		font-size: 15px;
		font-weight: 600;
		color: #222222;
		margin: 50rpx 0;
		padding: 0 30rpx;
	}

	.upgrade {
		display: flex;
		width: 600rpx;
		background-color: #FFFFFF;
		flex-direction: column;
		border-radius: 60rpx;
		padding-bottom: 40rpx;
	}

	.update-title {
		height: 315rpx;
		width: 600rpx;
		margin-top: -180rpx;
	}

	.content-head {
		//position: fixed;
		width: 100%;
		height: 30px;
		line-height: 30px;
		//top: 27px;
		text-align: center;
		color: #f7f7f7;
		background: #1D1D28;
		font-size: 17px;
		border-bottom: 1px solid #20202C;
	}

	.update-center {
		margin: 14px 5%;
		font-size: 16px;
		color: #666666;
	}

	.update-botton {
		flex: 1;
		height: 40px;
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		border-radius: 40px;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
	}

	.update-ing {
		height: 14px;
		width: 90%;
		border: 1px solid #E5E5E5;
		margin: auto;
		text-align: center;
		border-radius: 14px;
	}

	.update-ing .ing {
		height: 14px;
		background: #ff6f33;
		border-radius: 14px;
		font-size: 10px;
		color: #FFFFFF;
		line-height: 14px;
	}

	.update-wz {
		width: 100%;
		text-align: center;
		margin-top: 10px;
		font-size: 12px;
		color: #ff6f33;
	}

	.update {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		position: fixed;
		top: 0;
	}

	.update-content {
		width: 70%;
		background: #FFFFFF;
		//height: 225px;
		position: absolute;
		margin: -158px 15%;
		top: 50%;
		border-radius: 5px;
		box-shadow: 0px 4px 6px 0px rgba(103, 103, 103, 0.2);
		padding-bottom: 45upx;
	}

	.update-colse {
		position: absolute;
		right: -10px;
		top: -10px;
		width: 30px;
		height: 30px;
		//background: #F0AD4E;
		border-radius: 50%;
		color: #FFFFFF;
		text-align: center;
		line-height: 25px;
		font-weight: bold;
		box-shadow: 0px 4px 6px 0px rgba(103, 103, 103, 0.2);
	}

	.update-head {
		height: 80px;
		line-height: 80px;
		color: #FFFFFF;
		background: -webkit-gradient(linear, left top, right top, from(#ff6f33), to(#E14351));
		border-radius: 5px 5px 0 0;
		text-align: center;
		font-size: 23px;
	}

	.newTig {
		width: 12px;
		height: 12px;
		background: #F9221D;
		border-radius: 50%;
	}

	.input {
		width: 96%;
		padding: 5px 2%;
		border: 1px solid #E2E2E2;
		border-radius: 5px;
	}

	.head-tx view {
		display: inline-block;
	}

	.head-tx {
		width: 90%;
		height: 60px;
		line-height: 60px;
		color: #FFFFFF;
		margin-top: 15px;
		font-size: 30upx;
		margin: auto;
		border-bottom: 1upx solid #20202C;
	}

	.head-img {
		width: 60px;
		height: 60px;
	}

	.head-acc {
		float: right;
		color: #999999;
	}
</style>