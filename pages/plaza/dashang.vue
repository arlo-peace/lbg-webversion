<template>
	<view class="content" :style="{'padding-top':phone.safeArea.top+'px'}">
		<css-loading ref="cssLoading"></css-loading>

		<image src="../../static/img/paihang_list_bg_top.jpg" class="paihang_jb_top" v-if="!loading"></image>
		<!--排行列表开始-->
		<view class="paihang_list_bg">
			<view class="paihang_lb" v-for="(m, i) in dashangList" :key="i">
				<view>
					<view class="paihang_lb_number">{{i+1}}</view>
					<image :src="m.headImg" mode="aspectFill"></image>
					<view class="paihang_lb_name">{{m.username}}</view>
					<view class="paihang_lb_rmb">¥{{m.giveGold}}</view>
				</view>

			</view>
		</view>
		<!--排行列表结束-->
	</view>

</template>

<script>
	import api from "@/common/api.js";
	var _self;
	export default {
		data() {
			return {
				phone: {},
				one: false,
				isLogin: false,
				userId: 0,
				post_id: 0,
				userInfo: {
					nickname: '无名',
					corn: 0,
					money: 0,
					watch: 0,
					watch_count: 0,
				},
				userImg: '/static/imgs/head.png',
				exp_time: '...',
				to_uid: 0,
				isNewApp: false,
				dashangList: [],
				loading: true,
				loadHeight: 600,
				myinfo: []
			}
		},
		onLoad(opt) {
			_self = this;
			_self._showLoading();
			_self.phone = uni.getSystemInfoSync();
			_self.loadHeight = _self.phone.windowHeight;
			_self.isLogin = api.getLogins();
			if (_self.isLogin) {
				_self.userId = _self.isLogin.userId;

			} else {
				_self.loading = false;
			}
			if (opt.touid) {
				_self.to_uid = opt.touid;
				_self.post_id = opt.post_id;
				_self.getDashangInfo();
				_self.userId = _self.isLogin.userId;

			}
			uni.getStorage({
				key: 'isNewVersion',
				success: (res) => {
					_self.isNewApp = res.data;
				}
			});
		},
		onHide() {
			//console.log('onHide');
			_self.one = true;
		},
		onShow() {
			_self.isLogin = api.getLogins();
			if (_self.isLogin) {
				_self.userId = _self.isLogin.userId;
				//_self.getUserInfo();
			}
			uni.setStorage({
				key: 'upload_' + api.appkey,
				data: false,
				success: () => {
					//console.log('success');
				}
			});
		},
		methods: {


			getDashangInfo() {
				uni.request({
					url: api.apiData.getDashangList,
					method: 'POST',
					data: {
						to_uid: _self.to_uid,
						post_id: _self.post_id,

					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						if (e.data.Code == 200) {
							_self.dashangList = e.data.Data;
							_self.myinfo = e.data.myinfo
						} else {
							api.delLogins();
							_self.isLogin = false;
						}
						setTimeout(() => {
							_self.loading = false;
							_self._hideLoading()
						}, 300)
					},
					fail: () => {
						// 加载失败提示
						api.showToast('服务器连接失败，请检查网络是否正常', 3000);
					}
				});
			},

			jumpUrl(uri = 'login/login', type = 'new') {
				if (_self.isLogin || uri == 'login/login' || uri == 'login/register' || uri == 'setting/about') {
					api.jumpUrl('/pages/' + uri, type);
				} else {
					api.showToast('请先登录账号');
					setTimeout(() => {
						_self.jumpUrl('login/login', 'new');
					}, 500);
				}
			},
		},
		onPullDownRefresh() {
			if (_self.isLogin) _self.getUserInfo();
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
	@import url('@/components/loading/loading.css');

	.paihang_jb_top {
		//background: #007AFF;
		position: relative;
		//position: absolute;
		top: -30px;
		left: 0;
		width: 100%;
		height: 280px;
		display: block;
		overflow: hidden;
		z-index: 99;
	}

	.paihang_lb {
		width: 85%;
		height: 60px;
		line-height: 60px;
		background-image: url(../../static/img/paihang_list_bg.jpg);
		border-radius: 10px;
		box-shadow: 1px 1px 1px 1px rgba(103, 103, 103, 0.1);
		margin: 15px auto;
	}

	.paihang_lb image {
		width: 40px;
		margin-left: 15px;
		margin-top: 8px;
		height: 40px;
		float: left;
		border-radius: 50%;
	}

	.paihang_lb_number {
		width: 25px;
		height: 25px;
		float: left;
		margin-left: 15px;
		text-align: center;
		//background-image: url(../../static/img/paihang_number_bg.png);
	}

	.paihang_lb_name {
		float: left;
		margin-left: 15px;

		height: 50px;
		line-height: 50px;
	}

	.paihang_lb_rmb {
		float: right;
		margin-right: 15px;
		text-align: center;
		height: 50px;
		line-height: 50px;
	}

	.paihang_list_bg {
		width: 100%;
		height: 600px;
		background: rgb(253, 244, 242);
		background-image: url('../../static/img/paihang_list_bg_number.png');
		position: relative;
		//position: absolute;
		left: 0;
		margin-top: -50px;
		top: 0px;
		background-position: center 0;
		background-repeat: no-repeat;
		background-attachment: fixed;
		background-size: cover;
		-webkit-background-size: cover;
		/* 兼容Webkit内核浏览器如Chrome和Safari */
		-o-background-size: cover;
		/* 兼容Opera */
		zoom: 1;
	}

	.y-sign {
		color: #FFEEDF;
		text-align: right;
		height: 40upx;
		line-height: 40upx;
	}

	.n-sign {
		background-image: linear-gradient(to right, rgba(255, 12, 208, 0.8), #dd0aeb);
		height: 40upx;
		line-height: 40upx;
		border-radius: 10upx;
		text-align: center;
	}

	.sign text {
		display: block;
	}

	.sign {
		font-size: 24upx;
		display: inline-block;
		margin-top: -35upx;
		//background-color: #007AFF;
	}


	.nologin .head-content-login {
		display: inline-block;
		width: 200upx;
		height: 60upx;
		line-height: 60upx;
		background-color: none;
		color: rgba(255, 12, 208, 0.8) !important;
		border-radius: 60upx;
		font-size: 30upx !important;
		text-align: center;
		border: 1px solid rgba(255, 12, 208, 0.8);
	}

	.nologin {
		margin: 30upx 30upx 130upx;
	}

	.vip-date {
		color: #FFEEDF;
		margin-left: 10upx;
	}

	.user-vip {
		background-image: linear-gradient(to right, rgba(255, 12, 208, 0.8), rgba(254, 67, 101, 0.8)) !important;
		color: #FFFFFF;
	}

	.user-leve,
	.user-vip {
		padding: 3upx 20upx;
		background-color: #CCCCCC;
		border-radius: 8upx;
	}

	.bottom-content-line text {
		margin-left: 20upx;
		font-size: 30upx;
		color: #666666;
	}

	.bottom-content-line .left-img {
		width: 50upx;
		height: 50upx;
		margin-top: 25upx;
	}

	.bottom-content-line .right-img {
		width: 30upx;
		height: 30upx;
		margin-top: 35upx;
	}

	.bottom-content-line {
		height: 100upx;
		line-height: 94upx;
		padding: 0 30upx;
		//background-color: #007AFF;
	}

	.bottom-content {
		padding: 20upx 0;
	}

	.center-content-item image {
		width: 70upx;
		height: 70upx;
	}

	.center-content-item {
		width: 25%;
		font-size: 25upx;
		text-align: center;
		display: inline-block;
		margin-bottom: 20upx;
		color: #666666;
	}

	.center-content {
		//height: 300upx;
		border-radius: 40upx 40upx 0 0;
		box-shadow: 0px -6px 6px 0px rgba(103, 103, 103, 0.2);
		padding: 40upx 0 20upx;
	}

	.head-content-bottom {
		//height: 150upx;
		margin: 20upx 0;
		border-radius: 20upx;
		color: #FFFFFF;
		padding: 20upx 20upx 15upx;
		font-size: 30upx;
	}

	.head-content-center-left {
		margin-right: 6%;
		background-image: linear-gradient(to right, rgba(255, 12, 208, 0.8), rgba(254, 67, 101, 0.8));
	}

	.head-content-center-right {
		background-image: linear-gradient(to right, rgba(255, 12, 208, 0.8), #dd0aeb);
	}

	.head-content-center view {
		width: 47%;
		height: 90upx;
		display: inline-block;
		border-radius: 20upx;
	}

	.head-content-center image {
		width: 80upx;
		height: 80upx;
		margin: 5upx 0 0 10upx;
	}

	.head-content-center text {
		font-size: 30upx;
		color: #FFFFFF;
		display: block;
	}

	.head-content-center {
		margin-top: 50upx;
	}

	.right {
		float: right;
	}

	.left {
		float: left;
	}

	.line {
		height: 20upx;
		background-color: #F8F8F8;
		clear: both;
	}
</style>
