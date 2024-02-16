<template>
    <view id="guide" style="background:rgba(0,0,0,0.9);">

        <swiper class="swiper" 
			:circular="true" 
			:disable-touch="isTouch"
			:indicator-dots="true" 
			:current="tabIndex" 
			@change="changeTab" 
			:style="{ height : windowHeight + 'px'}">
            <swiper-item class="item" v-for="(item, index) in initlList" :key="index">
                <image :src="item.src" mode="aspectFill" @click="jumpAdUrl(item.url)"></image>
				<view class="buttons">
					<view class="button-item" v-if="contact.visit && showTime > 0"
						@click="jumpAdUrl(contact.url,contact.url.indexOf('http') > -1 ? 1 : 0)">
						<image class="button-item-icon" src="/static/other/contact.png"></image>
						<text>商务合作</text>
					</view>
					<view class="button-item" :class="{white:initTime>0}" v-if="index==endId && showTime"
						@click="jumpUrl('/pages/video/class', 1)">
						进入APP
						<text class="button-item-time" v-if="initTime>0">{{initTime}}s</text>
					</view>
				</view>
            </swiper-item>
        </swiper>
		<!-- <view class="bg">
			<view class="agreement">
				<view class="title">服务协议和隐私政策</view>
				<view class="content">请你务必审慎阅读、充分理解“服务协议”和“隐私政策”各条款，包括但不限于：为了向你提供限时通讯、内容分享等服务，我们需要收集你的设备信息、操作日志等个人信息。你可以在设置中查看并管理你的授权。</view>
				<view class="content">你可以阅读
					<text style="color:#007AFF;" @click="jumpAdUrl('/pages/member/activity?type=agreement', 2)">《服务协议》</text>和
					<text style="color:#007AFF;" @click="jumpAdUrl('/pages/member/activity?type=privacy', 2)">《隐私政策》</text>了解详细信息。如你同意，请点击“同意”开始接受我们的服务。
				</view>
				<view class="myagree">
					<view @click="myBotton(1)">暂不使用</view>
					<view style="color:#007AFF;" @click="myBotton(2)">同意</view>
				</view>
			</view>
		</view> -->
		<view class="ladding" v-if="isLadding">
			<view v-if="isDown">
				<text>{{msg}}</text>
				<!-- #ifdef APP-PLUS -->
				<view class="lxvideo" @click="getDown">
					查看离线视频
				</view>
				<view class="lxvideo" @click="getRefresh">
					重新加载
				</view>
				<!-- #endif -->
			</view>
		</view>
		<image class="ladding_img" :src="loading" mode="aspectFill" v-if="isLadding"></image>
		<text class="app-close-msg" v-if="isCloseApp">{{appCloseMsg}}</text>
		
    </view>
</template>

<script>
import api from "@/common/api.js";
var _self, adTimes;
export default{
	data() {
		return {
			isCloseApp: false,
			appCloseMsg: "系统维护中，请稍后再试...",
			initlList: [],
			endId: 0,
			initTime: 0,
			windowHeight: "800",
			isAgree: true,
			isLadding: true,
			agreement: api.apiData.agreement,
			privacy: api.apiData.privacy,
			imgCount: 0,
			pid: 0,
			did: 0,
			msg: '正在加载中，请稍后...',
			isDown: false,
				showTime: false,
			mobileSystem: 'web',
			tabIndex: 0,
			indicatorDots: [],
			isTouch: false,
			phone: {},
				contact: {
					visit: false,
					url: null
				},
			loading: '/static/imgs/loading.jpg',
		}
	},
	onLoad() {
		_self = this;
		_self.phone = uni.getSystemInfoSync();
		_self.windowHeight = _self.phone.windowHeight;
		// #ifdef APP-PLUS
		// 隐私政策
		/* uni.getStorage({
		    key: 'isAgree',
		    success: (res)=> {
				_self.isAgree = res.data;
		    },
			fail: ()=> {
				_self.isAgree = false;
			}
		}); */
		// 获取手机系统 ios/android
		_self.mobileSystem = _self.phone.platform;
		// #endif
		var loadingImg = uni.getStorageSync('loading_img_'+api.appkey);
		if (loadingImg) _self.loading = loadingImg;
		// 加载设备ID
		uni.getStorage({
		    key: 'mobileDid_'+api.appkey,
		    success: (res)=> {
				// 从缓存中拉取
				_self.did = res.data;
		    },
			fail: ()=> {
				// 读取设备DID
				_self.getMobileDid();
			},
			complete: ()=> {
				// 获取分享者ID
				_self.getSharePid();
			}
		});
	},
	methods: {
		// 读取设备ID
		getMobileDid() {
			// 获取手机信息
			api.getMobileDid((did)=>{
				_self.did = did;
				uni.setStorage({
				    key: 'mobileDid_'+api.appkey,
				    data: did,
				    success: ()=>{
				        //console.log(_self.did);
				    }
				});
			})
		},
		getRefresh(){
			api.jumpUrl('/pages/video/class', 'new');
		},
		// 分享者ID
		getSharePid() {
			// #ifdef H5 || MP-WEIXIN
			uni.request({
				url: api.apiData.getSharePid,
				method: 'GET',
				header: {
					'content-type': 'application/x-www-form-urlencoded',
				},
				success: (e)=> {
					if (e.data.Code == 200) {
						_self.pid = e.data.Data.pid;
						uni.setStorage({
							key: 'sharePid_'+api.appkey,
							data: _self.pid,
							success: () => {
								//console.log('success');
							}
						});
					}
				},
				complete: ()=>{
					//console.log(_self.pid)
					_self.getHomeData();
				}
			});
			// #endif
			// 读取分享者ID
			// #ifdef APP-PLUS
			uni.getClipboardData({
				success: (res)=> {
					// 有推荐人
					if (res.data) {
						_self.pid = res.data;
						uni.setStorage({
							key: 'sharePid_'+api.appkey,
							data: res.data,
							success: ()=> {
								//console.log('success');
							}
						});
					}
				},
				complete: ()=> {
					//console.log(_self.pid)
					_self.getHomeData();
				}
			});
			// #endif
		},
		// 引导页数据
		getHomeData(isUrl = 0) {
			//api.showToast('推荐人：'+_self.pid+'设置ID：'+_self.did, 3000);
			uni.request({
				url: api.apiData.appInits,
				method: 'POST', 
				header: {
					'Content-type': 'application/x-www-form-urlencoded'
				},				data: {
					pid: _self.pid,
					did: _self.did,
					sys: _self.mobileSystem,
					url: api.apiUrl
				},
				success: (e)=> {
					//console.log(e);
					if (e.data.Code == 201) return api.showToast(e.data.Msg, 5*60*1000);
					var data = e.data.Data;
						_self.contact = {
							visit: data.ad_switch == '1',
							url: data.ad_url
						}
					if (data.domain.length) {
							uni.setStorage({
								key: 'webDomain_' + api.appkey,
								data: data.domain
							});
					}
					uni.setStorageSync('head_menu_'+api.appkey, data.menu);
					if (data.server.length)	uni.setStorageSync('server_ipUrl_'+api.appkey, data.server);
					// 公告
					var notice = data.notice;
					uni.setStorageSync('notice_content_'+api.appkey, notice);
					uni.removeStorageSync('notice_already_content_'+api.appkey);
					uni.removeStorageSync('notice_mini_already_alert_'+api.appkey);
					// 加载等待图
					var loading = data.loading;
					var l_w_img = uni.getStorageSync('loading_img_web_'+api.appkey);
					if (loading.length && loading!=l_w_img) {
						api.getWebFileSize(loading, (r)=> {
							if (r > 0) {
								api.imgCache(loading, (loadingImg)=> {
									if (loadingImg.indexOf("http") == -1) {
										// 不包含http则替换赋值
										_self.loading = loadingImg;
										uni.setStorageSync('loading_img_'+ api.appkey, loadingImg);
										uni.setStorageSync('loading_img_web_'+ api.appkey, loading);
									}
								});
							}
						})
					}
					var appLogo = data.appLogo;
					if (appLogo.length) uni.setStorageSync('app_logo_'+ api.appkey, appLogo);
					// 检查网站状态
					if (!data.site_status) {
						_self.appCloseMsg= data.site_msg;
						_self.isCloseApp = true;
						return false;
					}
					// 自动生成帐号
					if (data.auto) {
						var acc = {
							'userId' : data.user_id,
							'account': data.username,
							'times'  : data.cactime
						};
						// 是否已生成
						uni.getStorage({
						    key: 'isAuto_'+api.appkey,
						    success: (res)=> {
								//console.log('多次以后')
								if (!res.data) api.setLogins(acc);
						    },
							fail: ()=> {
								//console.log('第一次')
								uni.setStorage({ key: 'isAuto_'+ api.appkey, data: false });
								api.setLogins(acc);
							}
						});
					} else {
						// 移除
						uni.removeStorage({
						    key: 'isAuto_'+api.appkey,
						    success: (res)=> {
						        //console.log('success');
						    }
						});
					}
					// 首页数据
					var initList = data.init;
					if (initList.length==1) _self.isTouch = true;
					if (initList.length && initList[0].src.length) {
						_self.imgCount = initList.length-1;
						// 是否有缓存
						for (var i = 0; i < initList.length; i++) {
							if (initList[i].src.length>0) {
								api.imgCache(initList[i].src, (isImg)=> {
									initList[i].src = isImg;
								});
							}
						}
						_self.initlList = initList;
						_self.endId = initList.length-1;
							_self.showTime = data.time > 0
						_self.initTime = data.time;
						_self.isLadding = false;
							if (!_self.showTime) {

								let timer = setTimeout(() => {
									_self.jumpUrl('/pages/video/class');
									clearTimeout(timer);
								}, 3000);
							}
					} else {
						_self.isLadding = true;
						if (_self.isAgree) {
							let timer = setTimeout(()=> {
								_self.jumpUrl('/pages/video/class');
								clearTimeout(timer);
							}, 500);
						}
					}
					// 倒计时
					if ((_self.imgCount+1)==1) _self.countdown(1);
				},
				fail: ()=> {
					uni.getStorage({
					    key: 'webDomain_'+api.appkey,
					    success: (res)=> {
							var webList = res.data;
							var webSums = res.data.length-1;
							if (webList.length>0) {
								uni.setStorageSync('nowDomain_'+api.appkey, webList[0]);
								//console.log(webList)
								_self.getHomeData(1);
								if (isUrl==1) {
									webList.splice(0, 1);
									uni.setStorage({ key: 'webDomain_'+ api.appkey, data: webList });
								}
							} else {
								uni.removeStorageSync('nowDomain_'+api.appkey);
								_self.msg = '你网络异常，服务器连接失败';
								_self.isDown = _self.isLadding = true;
							}
					    },
						fail: ()=> {
							_self.msg = '你网络异常，服务器连接失败';
							_self.isDown = _self.isLadding = true;
						}
					});
				}
			});
		},
		// 滑动事件
		changeTab(e){
			if (e.detail.current == _self.imgCount) {
				// 开始倒计时
				_self.countdown(1);
			} else {
				// 暂停计数器
				_self.countdown(2);
			}
		},
		// 倒计时 1开始，2暂停
		countdown(e) {
			if (_self.initTime > 0) {
				if (e == 1) {
					adTimes = setInterval(function(){
						_self.initTime--;
						if (_self.initTime < 1) clearInterval(adTimes);
					}, 1000);
				} else {
					clearInterval(adTimes);
						let timer = setTimeout(() => {
							_self.jumpUrl('/pages/video/class');
							clearTimeout(timer);
						}, 3000);
				}
			}
		},
		// 点击事件
		myBotton(type) {
			if (type == 1) {
				// 暂不使用
				api.outApp();
			} else {
				// 同意使用
				_self.isAgree = true;
				uni.setStorage({ key: 'isAgree', data: true });
				if (!_self.initlList.length) _self.jumpUrl('/pages/video/class');
			}
		},
		getDown() {
			api.jumpUrl('/pages/down/down', 'new');
		},
		// 底页导航页 
		jumpUrl(url, type=0) {
			if (type==1&&_self.initTime>0) return false;
			uni.setStorageSync('firstInto_'+ api.appkey, true);
			uni.switchTab({ url: url })
		},
		// 跳转
		jumpAdUrl(url, type = 1) {
			if (type == 1) {
				if (url == '#' || url == '') return false;
				api.jumpUrl(url, 'web');
			} else {
				uni.navigateTo({ url: url });
			}	
		}
	}
}
</script>
<style lang="scss" scoped>
	/deep/ .uni-swiper-dots {
		bottom: 70upx !important;
	}

.app-close-msg{
	position: absolute;
	bottom: 150upx;
	text-align: center;
	z-index: 99999;
	width: 90%;
	margin-left: 4%;
	font-size: 14px;
	background: rgba(0,0,0,0.5);
	color: #FFFFFF;
	line-height: 40upx;
	border-radius: 5px;
	padding: 1%;
}
.ladding{
	position: absolute;
	top: 38%;
	text-align: center;
	width: 100%;
	//height: 100%;
	color: rgba(255,255,255,1);
	font-size: 38upx;
	z-index: 2;
}
.ladding text{
    text-align: center;
    font-size: 16px;
    background-color: #fff;
    background-image: linear-gradient(129deg, #dc79ff, #256bfa);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
.ladding_img{
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 1;
}

.lxvideo {
	width: 130px;
	height: 35px;
	line-height: 35px;
	background: #009688;
	margin: 20px auto;
	border-radius: 5px;
	font-size: 14px;
	color: #FFFFFF;
	}

.myagree{
	border-top: 1px solid #E8E8E8;
	margin: 16px 0;
}

	.myagree view {
		display: inline-block;
		width: 50%;
		text-align: center;
		font-size: 18px;
		color: #333333;
		margin-top: 12px;
	}
.bg{
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.5);
	position: fixed;
	z-index: 9999999;
}
.agreement{
	width: 76%;
	background: #FFFFFF;
	position: absolute;
	top: 50%;
	margin: -175px 12%;
	border-radius: 10px;
}
.title{
	width: 100%;
	height: 50px;
	line-height: 50px;
	text-align: center;
	font-size: 20px;
}
.content{
	width: 86%;
	padding: 0 7%;
	color: #666666;
	font-size: 14px;
	line-height: 44upx;
}

	.buttons {
		position: fixed;
		right: 8%;
		top: 105upx;
		width: 400upx;
		display: flex;
		box-sizing: border-box;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		height: 60upx;
	}

	.button-item {
		width: 190upx;
		height: 58upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: rgba(0, 0, 0, .5);
		color: #FFF;
		font-size: 13px;
		border: 1px solid rgba(0, 0, 0, 0.8);
		border-radius: 30px;
	}

	.button-item-icon {
		width: 42upx !important;
		height: 42upx !important;
		margin-right: 4upx;
		margin-left: -4upx;
	}

	.button-item+.button-item {
		margin-left: 10upx;
	}

	.button-item.white {
		color: #666666;
		background: rgba(255, 255, 255, 0.5);
		border: 1px solid rgba(255, 255, 255, 0.5);
	}

	.button-item-item {
		font-size: 12px;
		margin-left: 3px;
	}

	.swiper {
		width: 100%;
	}

	.swiper image {
		width: 100%;
		height: 100%;
	}
</style>
