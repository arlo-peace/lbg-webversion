<template>
	<view class="bg" :style="{ height: bgHeight + 'px' }">
		<view class="wallet-card">
			<view class="wallet-card-title">
				<text class="wallet-card-title-text">金币余额</text>
			</view>
			<view class="wallet-card-amount">
				<text class="wallet-card-amount-text">{{parseInt(userInfo.corn)}}</text>
			</view>
			<view class="wallet-card-buttons">
				<view @click="skipUrl('/pages/recharge/recharge',0)" class="wallet-card-button">
					<text class="wallet-card-button-text">立即充值</text>
				</view>
				<view @click="skipUrl('/pages/member/transfer?type=corn',0)"
					class="wallet-card-button wallet-card-button-light">
					<text class="wallet-card-button-text">金币提现</text>
				</view>
			</view>
		</view>
		<view class="wali-card" v-for="game,i in userInfo.games" :key="i">
			<view class="wali-card-title">
				<text class="wali-card-title-text">{{game.name}}-余额</text>
			</view>
			<view class="wali-card-amount">
				<text class="wali-card-amount-text">{{parseInt(game.gold)}}</text>
			</view>
			<view class="wali-card-buttons">
				<view class="wali-card-button" @click="recharge(game.id)">
					<text class="wali-card-button-text">转入</text>
				</view>
				<view class="wali-card-button" @click="withdrew(game.id,game.gold,game.can,game.rate)">
					<text class="wali-card-button-text">转出</text>
				</view>
			</view>
		</view>
		<view class="wallet-desc">
			<text>温馨提示：</text>
			<view>1、“金币”用于APP内消费。</view>
			<view>2、“游戏币”用于游戏消费。</view>
			<view>3、“余额”可进行提现。</view>
			<view>注：三个币种可以相互转换。特别提醒：游戏币转换余额时，需符合打码率要求。举例：充值100游戏币，打码率为1.2的情况下，需完成120游戏币的投注额，方可进行提现。</view>
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
				bgHeight: '/static/imgs/bggold.png',
				userId: 0,
				userInfo: {
					corn: 0,
					games: []
				},
				toHeight: 250,
				type: 0,
				one: false
			}
		},
		onShow() {
			if (_self.one) {
				_self.one = false
				_self.getUserInfo();
			}
		},
		onHide() {
			_self.one = true
		},
		onLoad(e) {
			//#ifdef APP
			plus.screen.lockOrientation('portrait-primary');
			//#endif
			_self = this;
			_self.type = e.type
			_self._showLoading('加载中...');
			var mobile = uni.getSystemInfoSync();
			_self.bgHeight = mobile.windowHeight;
			// 是否登录
			const info = api.getLogins();
			if (info === false) {
				_self.skipUrl();
			} else {
				_self.userId = info.userId;
				_self.getUserInfo();
			}
		},
		methods: {
			recharge(gameId) {
				uni.showModal({
					editable: true,
					title: '金币转入到游戏余额',
					content: parseInt(_self.userInfo.corn) + '',
					success: (e) => {
						if (e.confirm) {
							let content = parseInt(e.content)
							if (content == 0) {
								_self.msgData('请输入待转入金额', 2000);
								return false;
							}
							if (content <= 0) {
								_self.msgData('转入金额必须是正整数', 2000);
								return false;
							}
							_self._showLoading('处理中...');
							uni.request({
								url: api.apiData.rechargeDgGame,
								method: 'POST',
								data: {
									userId: _self.userId,
									money: content,
									gameId: gameId
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
						}
					}
				})
			},
			withdrew(gameId, gold, canWithdrew, rate) {
				if (!canWithdrew) {
					_self.msgData('打码率不足' + rate + '倍,无法转出', 5000);
				} else {
					uni.showModal({
						editable: true,
						title: '游戏余额转出到金币',
						content: parseInt(gold) + '',
						success: (e) => {
							if (e.confirm) {
								let content = parseInt(e.content)
								if (content == 0) {
									_self.msgData('请输入待转出余额', 2000);
									return false;
								}
								if (content <= 0) {
									_self.msgData('转出余额必须是正整数', 2000);
									return false;
								}
								_self._showLoading({
									title: '处理中...',
									mask: true
								});
								uni.request({
									url: api.apiData.withdrewDgGame,
									method: 'POST',
									data: {
										userId: _self.userId,
										money: content,
										gameId: gameId
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
							}
						}
					})
				}
			},
			// 读取个人信息
			getUserInfo() {
				uni.request({
					url: api.apiData.myDgBalance,
					data: {
						userId: _self.userId
					},
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
			// 跳转登录
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
					});
				}, 200)
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
	.bg {
		width: 100%;
		height: 690px;
		overflow-y: auto;
	}

	.wallet-card {
		width: 82%;
		height: 170px;
		text-align: left;
		padding: 10px 4%;
		border-radius: 5px;
		margin: 20px auto;
		background: #f48721;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.wallet-card-title {
		height: 30px;
		width: 100%;
	}

	.wallet-card-title-text {
		font-size: 16px;
		color: #FFFFFF;
	}

	.wallet-card-amount {
		height: 40px;
		width: 100%;
	}

	.wallet-card-amount-text {
		font-size: 24px;
		color: #FFFFFF;
		font-weight: bold;
	}

	.wallet-card-buttons {
		height: 30px;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: flex-end;
	}

	.wallet-card-button {
		height: 30px;
		padding: 0 30rpx;
		border-radius: 15px;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-left: 10px;
		border: #f48721 1px solid;
	}

	.wallet-card-button-text {
		color: #f48721;
		font-size: 12px;
		letter-spacing: 2px;
	}

	.wallet-card-button-light {
		background: none;
		border: #FFFFFF 1px solid;
	}

	.wallet-card-button-light .wallet-card-button-text {
		color: #FFFFFF;
	}

	.wali-card {
		width: 82%;
		height: 170px;
		text-align: left;
		padding: 10px 4%;
		border-radius: 5px;
		margin: 20px auto;
		background: #4b6ec8;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.wali-card-title {
		height: 30px;
		width: 100%;
	}

	.wali-card-title-text {
		font-size: 16px;
		color: #FFFFFF;
	}

	.wali-card-amount {
		height: 40px;
		width: 100%;
	}

	.wali-card-amount-text {
		font-size: 24px;
		color: #FFFFFF;
		font-weight: bold;
	}

	.wali-card-buttons {
		height: 30px;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: flex-end;
	}

	.wali-card-button {
		height: 30px;
		padding: 0 30rpx;
		border-radius: 15px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-left: 10px;
		border: #FFFFFF 1px solid;
	}

	.wali-card-button-text {
		color: #FFFFFF;
		font-size: 12px;
		letter-spacing: 2px;
	}

	.wallet-desc {
		width: 82%;
		text-align: left;
		padding: 5px 4%;
		border: 1px solid #f48721;
		margin: 20px auto 0;
		border-radius: 5px;
		font-size: 12px;
		color: #f48721;
	}
</style>
