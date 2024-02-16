<template>
	<view class="bg">
		<view class="head-bg"></view>
		<view class="head-cono">
			<view class="head-cont">
				<view class="head-cont-wz">当前游戏余额</view>
				<view class="head-cont-money">{{userInfo.money}}</view>
				<view class="head-cont-desc">
					温馨提示：
					<view class="toTopPad">1、游戏1元余额=金币1元。</view>
					<view>2、提现数量必须是正整数。</view>
				</view>
			</view>
		</view>
		<image class="content-img" src="../../static/imgs/ti.png" mode="aspectFill"></image>
		<view class="content" id="toTop" :style="{ height: contentHeight + 'px' }">
			<input @input="onKeyInput" type="number" class="money" placeholder="请输入提现游戏余额数"
				placeholder-style="color:#ffffff;">
			<view @click="submitMoy">提 现</view>
		</view>
		<css-loading ref="cssLoading"></css-loading>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	var _self;
	export default {
		data() {
			return {
				contentHeight: 250,
				userInfo: {
					money: 0,
					corn: 0
				},
				userId: 0,
				money: 0,
			}
		},
		onLoad() {
			_self = this;
			_self._showLoading('加载中...');
			// 是否登录
			const info = api.getLogins();
			if (info === false) {
				_self.skipUrl();
			} else {
				_self.userId = info.userId;
				_self.getUserInfo();
			}
		},
		mounted: function() {
			var mobile = uni.getSystemInfoSync();
			const query = uni.createSelectorQuery().in(this);
			query.select('#toTop').boundingClientRect(data => {
				_self.contentHeight = mobile.windowHeight - data.top;
				//console.log(data)
			}).exec();
		},
		methods: {
			// 获取可提现余额
			getUserInfo() {
				uni.request({
					url: api.apiData.myDgBalance + '/userId/' + _self.userId,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						_self.userInfo = e.data.Data;
						_self._hideLoading();
					},
					fail: () => {
						// 加载失败提示
						_self.msgData('服务器连接失败，请检查网络是否正常', 5000);
					}
				});
			},
			// 点击提现
			submitMoy() {
				if (_self.money == 0) {
					_self.msgData('请输入充值金额', 2000);
					return false;
				}
				if (_self.money <= 0) {
					_self.msgData('充值金额必须是正整数', 2000);
					return false;
				}
				_self._showLoading('处理中...');
				uni.request({
					url: api.apiData.withdrewDgGame,
					method: 'POST',
					data: {
						userId: _self.userId,
						money: _self.money
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var res = e.data;
						_self.msgData(res.Msg, 2000);
						_self._hideLoading();
						_self.getUserInfo()
					},
					fail: () => {
						// 加载失败提示
						_self.msgData('服务器连接失败，请检查网络是否正常', 5000);
					}
				});
			},
			// 提现数量
			onKeyInput(e) {
				var number = e.detail.value;
				_self.money = number;
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
				_self._hideLoading()
				setTimeout(() => {
					uni.showToast({
						icon: style,
						title: title,
						mask: true,
						duration: times
					})
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
		background: #e14351;
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