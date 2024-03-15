<script>
	import api, { randomWord } from "@/common/api.js";
	import idfa from "@/js_sdk/dc-idfa/idfa.js"
	// import devtools from 'devtools-detect';
	var setBeatTime, menuTime, mobileSystem, vCode, openinstall;
	
	// function detectDevTool(){
	// 	if(devtools.isOpen){
	// 		location.replace('https://'+randomWord(true, true, 3, 6)+'.lubugou1.net')
	// 	}
	// }
	
	// if (window.attachEvent) {
	//     if (document.readyState === 'complete' || document.readyState === 'interactive') {
	//         detectDevTool();
	//         window.attachEvent('onresize', detectDevTool);
	//         window.attachEvent('onmousemove', detectDevTool);
	//         window.attachEvent('onfocus', detectDevTool);
	//         window.attachEvent('onblur', detectDevTool);
	//     } else {
	//         setTimeout(arguments.callee, 0);
	//     }
	// } else {
	//     window.addEventListener('load', detectDevTool);
	//     window.addEventListener('resize', detectDevTool);
	//     window.addEventListener('mousemove', detectDevTool);
	//     window.addEventListener('focus', detectDevTool);
	//     window.addEventListener('blur', detectDevTool);
	// }

	export default {
		globalData: {
			task: {}
		},
		created() {
			// #ifdef APP-PLUS
			plus.navigator.closeSplashscreen();
			// #endif 
		},
		onLaunch() {
			//console.log('onLaunch');
			mobileSystem = 'web';
			// #ifdef H5
			api.printLog()
			// #endif
			/* 版本检测s */
/* 			setTimeout(()=>{
				uni.request({
					url: api.apiData.getDgGameSet,
					method: 'GET',
					success: (o) => {
						var res = o.data.Data;
						uni.setStorageSync('dggame_' + api.appkey, res ? 1 : 0)
						if (res) {
							uni.setTabBarItem({
								index: 3,
								text: '游戏',
								pagePath: '/pages/dggame/dggame'
							})
						}
					}
				});
			},2000) */
			// #ifdef APP-PLUS
			openinstall = uni.requireNativePlugin('openinstall-plugin');
			if ('iOS' == plus.os.name) {
				var fid = "";
				fid = idfa.value(); //如果需要idfa则开启
				openinstall.init(fid);
				openinstall.getInstall(
				    8,
				    function(result) {
						// console.log('getInstall : channel=' + result.channelCode + ', data=' + result.bindData 
				  //       + ', shouldRetry=' + result.shouldRetry);
						uni.request({
							url: api.apiData.initialInstall,
							method: 'POST',
							data: {
								device: 'Android',
								type: 'wakeup',
								channelCode: result.channelCode,
								bindData: result.bindData,
								shouldRetry: result.shouldRetry
							}
						})
				    }
				);
				openinstall.reportRegister();
			};
			if (plus.os.name == "Android") {
				plus.android.requestPermissions(["android.permission.READ_PHONE_STATE"], function(event) {
					var options = {
						adEnabled: true,
						oaid: null,
						gaid: null,
					}
					openinstall.configAndroid(options);
					openinstall.init();
					openinstall.registerWakeUp(function(result) {
						// console.log('wakeup : channel=' + result.channelCode + ', data=' + result
						// 	.bindData);
						uni.request({
							url: api.apiData.initialInstall,
							method: 'POST',
							data: {
								device: 'Android',
								type: 'wakeup',
								channelCode: result.channelCode,
								bindData: result.bindData
							}
						})
					});
					openinstall.getInstall(
					    8,
					    function(result) {
							// console.log('getInstall : channel=' + result.channelCode + ', data=' + result.bindData 
					  //       + ', shouldRetry=' + result.shouldRetry);
							uni.request({
								url: api.apiData.initialInstall,
								method: 'POST',
								data: {
									device: 'Android',
									type: 'wakeup',
									channelCode: result.channelCode,
									bindData: result.bindData,
									shouldRetry: result.shouldRetry
								}
							})
					    }
					);
					openinstall.reportRegister();
				}, function(event) {
					// 权限申请错误
				})
			}
			// this.$down.init();
			this.globalData.task = this.$down;
			
			uni.getSystemInfo({
				success: (e) => {
					mobileSystem = e.platform;
					plus.runtime.getProperty(plus.runtime.appid, (i) => {
						vCode = i.versionCode;
						// 读取API版本号
						uni.request({
							url: api.apiData.getVersion,
							method: 'GET',
							success: (o) => {
								var res = o.data.Data;
								uni.setStorageSync('dggame_' + api.appkey, res.dggame ? 1 :
									0)
/* 								if (res.dggame) {
									uni.setTabBarItem({
										index: 3,
										text: '游戏',
										pagePath: '/pages/dggame/dggame'
									})
								} */
								if (mobileSystem == 'ios') {
									// 苹果
									var myCode = res.apple.versionCode;
									var verName = res.apple.version;
								} else {
									// 安卓
									var myCode = res.android.versionCode;
									var verName = res.android.version;
								}
								if (myCode > vCode) {
									// 圆点 
									uni.showTabBarRedDot({
										index: 4
									});
									var isNewVersion = true;
									uni.showModal({
										title: '发现新版本啦',
										content: '版本号：' + verName +
											'\n新版本功能更强大，体验更流畅',
										confirmText: '更新',
										showCancel: !res.is_force_update,
										success: res => {
											if (res.confirm) {
												api.jumpUrl(
													'/pages/setting/setting',
													'newx');
											}
										}
									});
								} else {
									var isNewVersion = false;
								}
								uni.setStorage({
									key: 'isNewVersion',
									data: isNewVersion
								});
							}
						});
					});
				}
			});
			// #endif 
		},
		onShow() {
			//console.log('App Show')
			// 中间按钮点击事件
			uni.onTabBarMidButtonTap(() => {
				this.goToRec();
			});
			// 是否登录
			var info = api.getLogins();
			var userId = (info == false) ? 0 : info.userId;
			// #ifdef APP-PLUS
			// schemes
			var param = plus.runtime.arguments;
			// close-recharge: v-506; Info: that cause automaticalluy open to recharge page on start page
			// if (param) api.jumpUrl('/pages/recharge/recharge', 'new');
			// #endif
			/* 心跳start */
			if (info != false) {
				if (mobileSystem == 'android') {
					var sys = 2;
				} else if (mobileSystem == 'ios') {
					var sys = 3;
				} else {
					var sys = 1;
				}
				// 进入后先执行一次
				let timer = setTimeout(() => {
					this.getServer(sys, userId, info.token);
					clearTimeout(timer);
				}, 1);
				setBeatTime = setInterval(() => {
					this.getServer(sys, userId, info.token);
				}, 1 * 60 * 1000); // 1m一跳
			} else {
				//console.log('未登录状态下不发送心跳数据');
			}
			/* 心跳end */
		},
		onHide() {
			//console.log('App Hide');
			// #ifdef APP-PLUS
			clearInterval(menuTime);
			// #endif
			clearInterval(setBeatTime);
		},
		methods: {
			isWeb() {
				// #ifdef H5
				var isH5 = api.isH5();
				if (isH5.type != 'safari') {
					api.showToast('请在safari打开');
					setTimeout(() => {
						api.outApp();
					}, 2000);
				}
				// #endif
			},
			goToRec() {
				if (!api.getLogins()) {
					api.showToast('请先登录', 1500);
					setTimeout(() => {
						api.jumpUrl('/pages/login/login', 'new');
					}, 500);
				} else {
					api.jumpUrl('/pages/recharge/recharge?type=2', 'new');
				}
			},
			getServer(sys, userId, token) {
				uni.request({
					url: api.apiData.heartBeat + '/sys/' + sys + '/userId/' + userId + '/token/' + token,
					success: (e) => {
						var d = e.data.Data;
						if (d.status == 0) {
							var closeAppTime = 11;
							setInterval(() => {
								if (closeAppTime <= 0) {
									//console.log('closeApp');
									api.outApp();
								}
								closeAppTime--;
								uni.showToast({
									title: 'App即将关闭' + closeAppTime + 's',
									duration: 50000,
									mask: true,
									image: '/static/stop.png'
								});
							}, 1000);
						}
						if (d.status == 3) {
							api.delLogins()
							let timer = setTimeout(() => {
								api.jumpUrl('/pages/login/login', 'new');
								clearTimeout(timer);
							}, 500);
						}
						if (d.safari == 1) {
							this.isWeb();
						}
					},
					fail: () => {
						clearInterval(setBeatTime);
					}
				});
			}
		}
	}
</script>
<style>
	/* #ifndef APP-PLUS-NVUE */
	page {
		background-color: #1D1D28;
	}

	uni-swiper .uni-swiper-dot {
		width: 5px !important;
		height: 5px !important;
	}

	uni-swiper .uni-swiper-dot-active {
		width: 12px !important;
		border-radius: 8upx !important;
	}

	.video-item-video-title {
		line-height: 26upx !important;
		height: 63upx !important;
		box-sizing: border-box !important;
		lines: 2 !important;
		text-overflow: ellipsis !important;
		overflow: hidden !important;
	}

	.video-info-video-title {
		line-height: 26upx !important;
		height: 63upx !important;
		box-sizing: border-box !important;
		lines: 2 !important;
		text-overflow: ellipsis !important;
		overflow: hidden !important;
	}

	/* #endif */
	/* #ifdef H5 */
	uni-app{
		width: 400px;
		margin: auto;
	}
	uni-tabbar.uni-tabbar-bottom .uni-tabbar{
		width: 400px;
		margin: auto;
	}
	@media screen and (max-width: 450px) {
		uni-app{
			width: 100%;
			margin: auto;
		}
		uni-tabbar.uni-tabbar-bottom .uni-tabbar{
			width: 100%;
			margin: auto;
		}
		.head-top{
			width: 100%;
		}
	}
	.head-top{
		width: 400px;
	}
	::-webkit-scrollbar {
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none
	}

	.video-item .video-title,
	.video-info .video-title {
		line-height: 16px !important;
		height: 22px !important;
		box-sizing: border-box !important;
		display: -webkit-box;
		/* 将容器以弹性盒子形式布局 */
		-webkit-line-clamp: 2;
		/* 限制文本显示为两行 */
		-webkit-box-orient: vertical;
		/* 将弹性盒子的主轴方向设置为垂直方向 */
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* #endif */
</style>
