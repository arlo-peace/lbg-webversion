<template>
	<view class="login" :style="{'padding-top':top+'px'}">
		<!-- <view class="content-head" @click="jumpIndex">
			<image src="/static/imgs/back.png" mode="aspectFill" style="width:20px;height:20px;margin:5px 0 0 -3px;"></image>
		</view> -->
		<image class="bg" :src="bgUrl" :style="{'height':mobile.screenHeight+'px'}" mode="aspectFill"></image>
		<!-- <video 
			class="bg" 
			:autoplay="true"
			:loop="true"
			:controls="false" 
			:show-center-play-btn="false" 
			:src="bgMp4" 
			@error="videoErrorCallback" 
			:style="{'height':mobile.screenHeight+'px'}">
		</video> -->
		<!-- 头部logo -->
		<view class="header">
			<image :src="logoImage" mode="aspectFit"></image>
		</view>
		<view v-if="isLoginStatus==1">
			<view class="login-content-left">
				<view style="text-align:center;color:#FFFFFF;font-size:33upx;margin:15upx 0 50upx;">欢迎登录</view>
				<!-- 主体表单 -->
				<view class="main">
					<wInput v-model="phoneData" type="text" maxlength="40" placeholder="登录用户名/注册手机号"></wInput>
					<wInput v-model="passData" type="password" maxlength="15" placeholder="登录密码"></wInput>
				</view>
				<wButton text="登 录" :rotate="isRotate" @click.native="startLogin()"></wButton>

				<!-- 其他登录 -->
				<view class="other_login cuIcon" v-if="otherLogin">
					<view class="login_icon">
						<view class="cuIcon-weixin" @tap="login_weixin"></view>
					</view>
					<view class="login_icon">
						<view class="cuIcon-weibo" @tap="login_weibo"></view>
					</view>
					<view class="login_icon">
						<view class="cuIcon-github" @tap="login_github"></view>
					</view>
				</view>

				<!-- 底部信息 -->
				<view class="footer">
					<!-- <navigator url="forget" open-type="navigate">找回密码</navigator> -->
					<view @click="jumpIndex">先去逛逛</view>
					<!-- <text>|</text>
					<navigator url="register" open-type="navigate">注册账号</navigator> -->
				</view>
			</view>
			<view class="btn-right" @click="setLoingStatus(2)">
				<uni-icons type="contact-filled" color="#ffffff" size="28"
					style="margin-top:150upx;display:block;"></uni-icons>
				<text class="wz-text">注</text>
				<text class="wz-text">册</text>
				<text class="wz-text">新</text>
				<text class="wz-text">账</text>
				<text class="wz-text">户</text>
			</view>
		</view>

		<view v-if="isLoginStatus==2">
			<view class="login-content-right" :style="{'height':hMobileCode+'upx'}">
				<view style="text-align:center;color:#FFFFFF;font-size:33upx;margin:15upx 0 50upx;">欢迎注册</view>
				<!-- 主体表单 -->
				<view class="main">
					<wInput v-model="phoneData" :type="isNumber" maxlength="30" :placeholder="userTypeTip"></wInput>
					<wInput v-model="verCode" type="number" maxlength="6" placeholder="手机验证码" isShowCode ref="runCode"
						@setCode="getVerCode()" v-if="regType==2"></wInput>
					<wInput v-model="passData" type="password" maxlength="15" placeholder="登录密码/6~15位之间" isShowPass>
					</wInput>
				</view>
				<wButton text="注册" :rotate="isRotate" @click.native="startReg()"></wButton>

				<!-- 其他登录 -->
				<view class="other_login cuIcon" v-if="otherLogin">
					<view class="login_icon">
						<view class="cuIcon-weixin" @tap="login_weixin"></view>
					</view>
					<view class="login_icon">
						<view class="cuIcon-weibo" @tap="login_weibo"></view>
					</view>
					<view class="login_icon">
						<view class="cuIcon-github" @tap="login_github"></view>
					</view>
				</view>

				<!-- 底部信息 -->
				<view class="footer">
					<text @tap="isShowAgree" class="cuIcon" :class="showAgree?'cuIcon-radiobox':'cuIcon-round'">
						已阅读</text>
					<!-- 协议地址 -->
					<view>
						<text style="color:#ccc;"
							@click="skipUrl('/pages/member/activity?type=agreement')">《服务协议》</text>和
						<text style="color:#ccc;" @click="skipUrl('/pages/member/activity?type=privacy')">《隐私政策》</text>
					</view>
				</view>
			</view>
			<view class="btn-left" @click="setLoingStatus(1)" :style="{'height':(hMobileCode+60)+'upx'}">
				<uni-icons type="contact" color="#ffffff" size="28" style="margin-top:150upx;display:block;"
					:style="{'margin-top':backTop+'upx'}"></uni-icons>
				<text class="wz-text">返</text>
				<text class="wz-text">回</text>
				<text class="wz-text">去</text>
				<text class="wz-text">登</text>
				<text class="wz-text">录</text>
			</view>
		</view>

	</view>
</template>

<script>
	var _this;
	import wInput from '@/components/watch-login/watch-input.vue'
	import wButton from '@/components/watch-login/watch-button.vue'
	import api from "@/common/api.js";
	export default {
		data() {
			return {
				//logo图片 base64
				logoImage: '../../static/logo.png',
				phoneData: '', //用户/电话
				passData: '', //密码
				isRotate: false, //是否加载旋转
				top: 0,
				otherLogin: false, // 是否开启第三方登录 
				bgUrl: '../../static/init.jpg',
				bgMp4: '../../static/bg.mp4',
				mobile: {},
				isLoginStatus: 1,

				// 注册相关
				verCode: '', //验证码
				showAgree: true, //协议是否选择
				pid: 0, // 分享者ID、 0为无
				did: '', // 设备ID
				agreement: api.apiData.agreement,
				privacy: api.apiData.privacy,
				userTypeTip: '用户名(4~15位)/手机号',
				regType: 1, // 1为普通注册，2为手机注册
				isNumber: 'text',
				mobileCode: 0,
				codeNum: 6,
				timeLag: 30000,
				mobileSystem: 'web',

				hMobileCode: 520,
				backTop: 150,
				vid: 0,
			};
		},
		components: {
			wInput,
			wButton
		},
		onLoad(e) {
			_this = this;
			_this._hideLoading()
			_this.mobile = uni.getSystemInfoSync();
			_this.top = _this.mobile.statusBarHeight;
			// #ifdef APP-PLUS
			// ios/android
			_this.mobileSystem = _this.mobile.platform;
			// #endif
			_this.getConfig();
			// #ifdef H5
			_this.top = 20;
			// #endif
			var imgUrl = uni.getStorageSync('appLogo');
			if (imgUrl) _this.logoImage = imgUrl;
			_this.getRegConfig();
			//console.log(imgUrl)
			if (e.vid) {
				_this.vid = e.vid;
			}
		},
		onBackPress(e) {
			//console.log(e)
			if (_this.vid > 0) {
				uni.setStorage({
					key: 'vid',
					data: _this.vid,
					success: () => {
						var param = {
							url: '/pages/index/index',
							t: 'tab'
						}
						api.jumpUrl('/pages/video/play?type=' + JSON.stringify(param), 'new');
					},
					fail: () => {
						api.showToast('服务器连接失败，请检查网络是否正常', 3000);
					}
				});
				return true;
			}
		},
		methods: {
			videoErrorCallback() {
				console.log('出错了')
			},
			getConfig() {
				// 设备ID
				uni.getStorage({
					key: 'mobileDid_' + api.appkey,
					success: (res) => {
						//console.log(res.data);
						_this.did = res.data;
					}
				});
				// 读取分享者ID
				uni.getStorage({
					key: 'sharePid_' + api.appkey,
					success: (res) => {
						//console.log(res.data);
						_this.pid = res.data;
					}
				});
			},
			setLoingStatus(e) {
				//console.log(e)
				_this.isLoginStatus = e;
			},
			/***************注册相关****************/
			getRegConfig() {
				uni.request({
					url: api.apiData.getConfig + '/type/1',
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var res = e.data;
						if (res.Code == 201) {
							_this.msgData(res.Msg, 2000);
							return false;
						}
						_this.regType = res.Data.regType;
						_this.codeNum = res.Data.codeNum;
						_this.timeLag = res.Data.timeLag;
						if (_this.regType == 2) {
							_this.userTypeTip = '注册手机号';
							_this.isNumber = 'number';
							_this.hMobileCode = 620;
							_this.backTop = 200;
						}
						//console.log(res);
					},
					fail: () => {
						// 加载失败提示
						_this.msgData('服务器连接失败，请检查网络是否正常', 3000);
					}
				});
			},
			// 是否选择协议
			isShowAgree() {
				_this.showAgree = !_this.showAgree;
			},
			// 获取验证码
			getVerCode() {
				if (!(/^1[345789]\d{9}$/.test(_this.phoneData))) {
					_this.msgData('手机号有误，请输入有效的手机号');
					return false;
				}
				_this._showLoading('正在发送...');
				// 发起API请求
				uni.request({
					url: api.apiData.getMobileCode + '/mobile/' + _this.phoneData,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var res = e.data;
						if (res.Code == 201) {
							_this.msgData(res.Msg, 2000);
							return false;
						}
						_this.mobileCode = res.Data;
						// 触发倒计时（一般用于请求成功验证码后调用）
						this.$refs.runCode.$emit('runCode');
						// 终止倒计时
						_this.stopCountdown(_this.timeLag);
						_this.msgData('验证码已发送，请注意查收', 2000);
						//console.log(res);
					},
					fail: () => {
						// 失败提示
						_this.msgData('服务器连接失败，请检查网络是否正常', 3000);
					}
				});
			},
			// 60秒后终止倒计时
			stopCountdown(t) {
				setTimeout(function() {
					_this.$refs.runCode.$emit('runCode', 0);
				}, t);
			},
			// 发起注册请求
			startReg() {
				// 判断是否加载中，避免重复点击请求
				if (_this.isRotate) return false;
				if (_this.showAgree == false) {
					_this.msgData('请先同意《服务协议》和《隐私政策》');
					return false;
				}
				if (_this.regType == 1) {
					// 普通注册
					if (_this.phoneData.length < 4) {
						_this.msgData('请输入登录账号，在4~15位之间');
						return false;
					}
				} else {
					// 手机号注册
					if (!(/^1[345789]\d{9}$/.test(_this.phoneData))) {
						_this.msgData('手机号格式有误，请输入有效的手机号');
						return false;
					}
					if (_this.verCode.length != _this.codeNum) {
						_this.msgData('请输入' + _this.codeNum + '位数的手机验证码');
						return false;
					}
					if (_this.mobileCode.length < 1) {
						_this.msgData('手机验证码有误，请检查后重新输入');
						return false;
					}
				}
				if (_this.passData.length < 6) {
					_this.msgData('请输入登录密码，在6至15位之间');
					return false;
				}
				_this.isRotate = true;
				// 发起注册请求
				uni.request({
					url: api.apiData.userReg,
					method: 'POST',
					data: {
						account: _this.phoneData,
						mobileCode: _this.verCode,
						pwd: _this.passData,
						pid: _this.pid,
						did: _this.did,
						cid: _this.mobileCode,
						sys: _this.mobileSystem
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						if (e.data.Code == 201) {
							_this.msgData(e.data.Msg, 3000);
						} else {
							_this.msgData('注册成功');
							var data = {
								'userId': e.data.Data.member_id,
								'account': _this.phoneData,
								'times': e.data.Data.time
							};
							var res = api.setLogins(data);
							if (res) {
								uni.switchTab({
									url: "/pages/member/member"
								});
							} else {
								_this.msgData('未知错误，请关闭APP重新打开再试', 3000);
							}
						}
						_this.isRotate = false
					},
					fail: () => {
						_this.isRotate = false
						_this.msgData("服务器连接失败，请检测网格是否正常", 3000);
					}
				});
			},
			// 跳转登录
			skipUrl(url = '/pages/login/login', type = 'new') {
				api.jumpUrl(url, type)
			},
			/***************登录相关****************/
			isLogin() {
				//判断缓存中是否登录过，直接登录
			},
			jumpIndex() {
				uni.switchTab({
					url: "/pages/index/index"
				});
			},
			startLogin() {
				//uni.hideLoading();
				//判断是否加载中，避免重复点击请求
				if (this.isRotate) return false;
				if (this.phoneData.length == "") {
					_this.msgData('请输入登录账号');
					return;
				}
				if (this.passData.length < 5) {
					_this.msgData('请输入登录密码');
					return;
				}
				_this.isRotate = true
				//console.log('account:', _this.phoneData)
				//console.log('passData:', _this.passData)
				// 发起登录请求
				uni.request({
					url: api.apiData.userLogin,
					method: 'POST',
					data: {
						account: _this.phoneData,
						pwd: _this.passData
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						uni.hideLoading();
						if (e.data.Code == 201) {
							_this.msgData(e.data.Msg, 2000);
						} else if (e.data.Code == 200) {
							_this.msgData('登录成功');
							var data = {
								'userId': e.data.Data.member_id,
								'account': _this.phoneData,
								'times': e.data.Data.time
							};
							var res = api.setLogins(data);
							if (res) {
								if (uni.getStorageSync("sourceUrl")) {
									var sourceUrl = uni.getStorageSync("sourceUrl");
									uni.setStorage({
										key: 'sourceUrl',
										data: '',
									});
									//console.log(sourceUrl);
									if (_this.vid > 0) {
										uni.setStorage({
											key: 'vid',
											data: _this.vid,
											success: () => {
												var param = {
													url: '/pages/index/index',
													t: 'tab'
												}
												api.jumpUrl('/pages/video/play?type=' + JSON
													.stringify(param), 'new');
											},
											fail: () => {
												api.showToast('服务器连接失败，请检查网络是否正常', 3000);
											}
										});
									} else {
										uni.navigateTo({
											url: sourceUrl
										});
									}
								} else {
									uni.switchTab({
										url: "/pages/member/member"
									});
								}
							} else {
								_this.msgData('未知错误，请关闭APP重新打开再试', 2000);
							}
						} else {
							_this.msgData('未知错误，请关闭APP重新打开再试', 2000);
						}
						_this.isRotate = false
					},
					fail: () => {
						_this.msgData("服务器连接失败，请检测网格是否正常", 3000);
						_this.isRotate = false
					}
				});
			},
			login_weixin() {
				//微信登录
				_this.msgData('微信登录');
			},
			login_weibo() {
				//微博登录
				_this.msgData('微博登录');
			},
			login_github() {
				//github登录
				_this.msgData('github登录');
			},
			// 提示
			msgData(title = '', times = 1000) {
				_this._hideLoading()
				setTimeout(() => {
					uni.showToast({
						icon: "none",
						title: title,
						mask: true,
						duration: times,
						position: 'bottom'
					})
				}, 200)
			}
		}
	}
</script>
<style>
	@import url("../../components/watch-login/css/icon.css");
	@import url("./css/main.css");

	.btn-left {
		display: inline-block;
		width: 10%;
		background-color: rgba(255, 255, 255, 0.3);
		height: 580upx;
		float: left;
		margin-left: 5%;
		border-radius: 30upx 0 0 30upx;
		text-align: center;
		color: #FFFFFF;
	}

	.wz-text {
		display: block;
		font-size: 30upx;
	}

	.btn-right {
		display: inline-block;
		width: 10%;
		background-color: rgba(0, 0, 0, 0.3);
		height: 580upx;
		float: right;
		margin-right: 5%;
		border-radius: 0 30upx 30upx 0;
		text-align: center;
		color: #FFFFFF;
	}

	.login-content-right {
		margin-right: 5%;
		padding: 30upx 5% !important;
		border-radius: 0 30upx 30upx 0;
		background-color: rgba(0, 0, 0, 0.3);
		display: inline-block;
		width: 70%;
		height: 520upx;
	}

	.login-content-left {
		margin-left: 5%;
		padding: 30upx 5% !important;
		border-radius: 30upx 0 0 30upx;
		background-color: rgba(255, 255, 255, 0.3);
		display: inline-block;
		width: 70%;
		height: 520upx;
	}

	.bg {
		position: fixed;
		left: 0;
		top: 0;
		z-index: -1;
		width: 100%;
	}

	.content-head {
		width: 30px;
		height: 30px;
		line-height: 30px;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.5);
		text-align: center;
		font-size: 15px;
		color: #cccccc;
		z-index: 2;
		margin-left: 10px;
	}

	page {
		background-color: rgba(0, 0, 0, 0);
	}
</style>