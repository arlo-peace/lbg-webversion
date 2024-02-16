<template>
	<view class="bg" :style="{height:winHeight + 'px'}">
		<view class="showChoose" v-if="!isChoose">
			<view class="choosebox">
				<view class="button-game-1" @click="loginDg('play')"><image src="/static/imgs/game-1.png"></image></view>
				<!--<view class="button-game-2" @click="loginDg('trial')"><image src="/static/imgs/game-2.png"></image></view>-->
			</view>
		</view>
		<web-view v-if="isChoose && userInfo.url.length > 0" :key="showUrl" ref="webview" :webview-styles="webviewStyles" :style="{height:winHeight+'px'}" :src="showUrl">
		</web-view>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	var _self;
	export default {
		data() {
			return {
				userInfo: {
					token: '',
					random: '',
					url: null,
					flash: '',
					sdk: '',
					money: '',
					dg_username: '',
					dg_money: '',
					dg_datetime: '',
				},
				showUrl: '',
				winHeight: 200,
				userId: 0,
				is_trial: null,
				tableId: null,
				isChoose: false,
				webviewStyles: {
					progress: false
				}
			}
		},
		onHide() {
			_self.isChoose = false
			_self.showUrl = ''
		},
		onLoad(e) {
			_self = this;
			_self.tableId = e.tableId
			_self.is_trial = 0//e.is_trial
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			var mobile = uni.getSystemInfoSync();
			_self.winHeight = mobile.windowHeight
			// 是否登录
			const info = api.getLogins();
			if (info === false) {
				_self.skipUrl();
			} else {
				_self.userId = info.userId;
			}
			if(_self.tableId)
			{
				_self.loginDg(_self.is_trial ? 'trial' : 'play')
			}
			uni.hideLoading();
		},
		onNavigationBarButtonTap(e) {
			if (e.index == 0) {
				_self.skipUrl('/pages/member/dgwallet?type=1', 0)
			}
			if (e.index == 1) {
				_self.loginDg();
			}
		},
		methods: {
			loginDg(t = 'play'){
				uni.request({
					url: (t == 'play' ? api.apiData.loginDG : api.apiData.loginTrialDG) + '/userId/' + _self.userId,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						uni.hideLoading();
						if (e.data.Code != 200) {
							_self.msgData(e.data.Msg, 5000);
						} else {
							_self.userInfo = e.data.Data;
							if (_self.userInfo.is_first) {
								uni.showLoading({
									title: '正在登录账号...',
									mask: true
								});
								setTimeout(() => {
									_self.makeUrl()
									uni.hideLoading();
								}, 20000)
							} else {
								_self.makeUrl()
							}
						}
					},
					fail: () => {
						// 加载失败提示
						_self.msgData('服务器连接失败，请检查网络是否正常', 5000);
					}
				});
			},
			makeUrl() {
				_self.showUrl = _self.userInfo.url + (_self.tableId ? '&game=' + _self.tableId :
					'')
				_self.isChoose = true
			},
			// 跳转
			skipUrl(url = '/pages/login/login', type = 1) {
				if (type == 1) {
					uni.reLaunch({
						url: url
					});
				} else {
					uni.navigateTo({
						url: url
					});
				}
			},
			// 提示
			msgData(title = '', times = 1000, style = 'none') {
				// 加载失败提示
				uni.showToast({
					icon: style,
					title: title,
					mask: true,
					duration: times
				});
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			_self.getUserInfo();
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
	.showChoose{
		width: 100%;
		height: 100%;
		background: #051937 url(../../static/imgs/game.jpg) center center no-repeat;
		background-size: auto 100%;
		text-align: center;
		position: relative;
	}
	.choosebox{
		position: absolute;
		width: 200px;
		height: 200px;
		left: 50%;
		margin-left: -100px;
		bottom: 100px;
	}
	.choosebox .button-game-1{
		position: absolute;
		width: 260px;
		height: 133px;
		left: 50px;
		bottom: 200px;
	}
	.choosebox .button-game-1 image{
		width: 260px;
		height: 133px;
	}
	.choosebox .button-game-2{
		position: absolute;
		width: 260px;
		height: 138px;
		left: 40px;
		margin-top:10px;
	}
	.choosebox .button-game-2 image{
		width: 260px;
		height: 133px;
	}
	/deep/uni-button[type="warn"][plain]{
		background: rgba(0,0,0,.5) !important;
		color: white !important;
	}
	.color {
		color: #E14351;
	}

	.toTopPad {
		margin-top: 5px;
	}

	.head-cont-desc {
		width: 82%;
		text-align: left;
		padding: 5px 4%;
		border: 1px solid #E2E2E2;
		margin: 20px auto 0;
		border-radius: 5px;
		font-size: 13px;
	}

	.head-cont-desc view {
		font-size: 12px;
	}

	.money {
		height: 30px;
		line-height: 30px;
		margin: 0 auto 15px;
		display: inline-block;
		width: 50%;
		border-bottom: 1px solid #CCCCCC;
	}

	.head-cont-wz {
		padding: 30px 0 10px;
	}

	.head-cont-money {
		font-size: 50px;
		color: #ff5e63;
		font-weight: bold;
	}

	.head-cont-bank {
		padding: 10px 0;
	}

	.head-cont-bankList {
		border-radius: 5px;
		border: 1px solid #E2E2E2;
		width: 90%;
		margin: auto;
		font-size: 15px;
		line-height: 30px;
	}

	.bg {
		background: #000;
	}

	.head-bg {
		background: -webkit-gradient(linear, left top, right top, from(rgba(255, 255, 255, 0.3)), to(#ff6f33));
		height: 300px;
		clip-path: polygon(0% 0%, 0% 100%, 1% 99%, 3% 98%, 5% 97%, 7% 96%, 9% 95%, 91% 95%, 93% 96%, 95% 97%, 97% 98%, 99% 99%, 100% 100%, 100% 0%);
		z-index: 9;
		position: relative;
	}

	.head-cono {
		margin: -230px auto;
		width: 70%;
		height: 350px;
		background: #FFFFFF;
		z-index: 10;
		position: relative;
		border-radius: 10px;
		box-shadow: 0px 4px 6px 0px rgba(103, 103, 103, 0.2);
		padding: 5%;
	}

	.head-cont {
		width: 100%;
		height: 100%;
		z-index: 10;
		position: relative;
		border-radius: 10px;
		border: 1px solid #CCCCCC;
		text-align: center;
		color: #555555;
		font-size: 20px;
	}

	.content-img {
		position: relative;
		width: 100%;
		z-index: 11;
		height: 160px;
		top: 80px;
	}

	.content {
		width: 100%;
		height: 233px;
		background: #ff5e63;
		position: relative;
		z-index: 11;
		top: 70px;
		text-align: center;
		color: #FFFFFF;
		//clip-path: polygon(0% 0%,0% 100%,100% 100%,100% 0%,99% 1%,98.5% 1.5%,98% 2%,97.5% 2.5%);
	}

	.content view {
		width: 70%;
		background: #eeff37;
		margin: 0 auto 15px;
		color: #666666;
		padding: 10px 0;
		border-radius: 5px;
		box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.5);
		background: -webkit-gradient(linear, left top, right top, from(#ffffff), to(#eeff88));
	}
</style>
