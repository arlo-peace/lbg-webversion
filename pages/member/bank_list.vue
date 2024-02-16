<template>
	<view class="bg">
		<view class="content-head" :style="{ 'padding-top': top + 'px' }">银行卡</view>
		<view class="content-head-top" :style="{ height: (top+145) +'px'}"></view>
		<view class="bank-list">
			<view class="bank-info" v-for="(b, i) in userBank" :key="i">
				<view class="img">
					<image :src="b.icon" mode="aspectFill"></image>
				</view>
				<view class="bank-content">
					<image class="bgx" src="@/static/imgs/delx.png" mode="aspectFill" @click="delBank(b.carId)"></image>
					<view @click="setBank(b.carId)">{{b.bankName}}</view>
					<view class="bank-name" @click="setBank(b.carId)">{{b.username}}</view>
					<view style="margin-top:10px;font-size:28upx;" @click="setBank(b.carId)">**** **** ****
						{{b.cardNum}}</view>
					<image class="bgimg" :src="b.icon" mode="aspectFill" @click="setBank(b.carId)"></image>
				</view>
			</view>
			<view class="bank-info" style="text-align:center;font-size:30upx;" v-if="userBank.length==0">
				暂无提现银行卡
			</view>
		</view>
		<view class="add-bank" @click="skipUrl('/pages/member/add_bank', 2)">+ 添加银行卡</view>
		<css-loading ref="cssLoading"></css-loading>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	var _self;
	export default {
		data() {
			return {
				top: 27,
				contentHeight: 0,
				userBank: {},
				userId: 0,
			}
		},
		onLoad() {
			_self = this;
			_self._showLoading('加载中...');
			var mobile = uni.getSystemInfoSync();
			_self.top = mobile.safeArea.top + 7;
			// 是否登录
			const info = api.getLogins();
			if (info === false) {
				_self.skipUrl();
			} else {
				_self.userId = info.userId;
				_self.getUserBank();
			}
		},
		methods: {
			// 银行卡列表
			getUserBank() {
				uni.request({
					url: api.apiData.getUserBank + '/type/2/userId/' + _self.userId,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						_self.userBank = e.data.Data;
						_self._hideLoading();
					},
					fail: () => {
						// 加载失败提示
						_self.msgData('服务器连接失败，请检查网络是否正常', 5000);
					}
				});
			},
			// 切换提现银行卡
			setBank(e) {
				_self._showLoading('加载中...');
				uni.request({
					url: api.apiData.setBank,
					method: 'POST',
					data: {
						userId: _self.userId,
						cardId: e
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var res = e.data;
						if (res.Code == 200) {
							_self.skipUrl('/pages/member/deposit', 2);
						} else {
							_self.msgData(res.Msg, 2000);
						}
						_self._hideLoading();
					},
					fail: () => {
						// 加载失败提示
						_self.msgData('服务器连接失败，请检查网络是否正常', 5000);
					}
				});
			},
			// 删除银行卡
			delBank(bid) {
				uni.showModal({
					title: '提示',
					content: '确认要删除吗？',
					cancelText: '点错了',
					confirmText: '确定删除',
					success: (res) => {
						if (res.confirm) {
							_self._showLoading('加载中...');
							uni.request({
								url: api.apiData.delBank,
								method: 'POST',
								data: {
									userId: _self.userId,
									cardId: bid
								},
								header: {
									'Content-type': 'application/x-www-form-urlencoded'
								},
								success: (e) => {
									var res = e.data;
									if (res.Code == 200) {
										_self.getUserBank();
									} else {
										_self.msgData(res.Msg, 2000);
									}
								},
								fail: () => {
									_self.msgData('服务器连接失败，请检查网络是否正常', 5000);
								}
							});
						} else if (res.cancel) {
							//console.log('用户点击取消');
						}
					}
				});
			},
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
				})
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			_self.getUserBank();
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
	.content-head-top {
		background-color: rgba(255, 12, 208, 1);
		border-bottom-left-radius: 10%;
		border-bottom-right-radius: 10%;
	}

	.add-bank {
		width: 90%;
		text-align: center;
		border-bottom: 1px solid #e8e8e8;
		padding: 30px 0 10px;
		color: #666666;
		font-size: 16px;
		margin: auto;
	}

	.bgx {
		width: 20px;
		height: 20px;
		float: right;
		margin-top: -10px;
		margin-right: -7px;
	}

	.bgimg {
		height: 50px;
		width: 50px;
		float: right;
		margin-top: -20px;
		opacity: 0.1;
		filter: alpha(opacity=10);
	}

	.content-head {
		position: fixed;
		width: 100%;
		height: 30px;
		line-height: 30px;
		top: 0;
		text-align: center;
		color: #FFFFFF;
		background: rgba(255, 12, 208, 1);
	}

	.bank-list {
		margin: -100px 4% 0;
		padding: 40upx 4% 15upx;
		border-radius: 15upx;
		background-color: #FFFFFF;
	}

	.bank-info view {
		display: inline-block;
		//background-color: #009688;
	}

	.bank-info .img {
		width: 20%;
		float: left;
	}

	.bank-info .img image {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		opacity: 0.8;
		filter: alpha(opacity=80);
	}

	.bank-content {
		width: 80%;
	}

	.bank-content view {
		display: block;
	}

	.bank-name {
		font-size: 15px;
	}

	.bank-info {
		padding: 15px;
		//background: #ff5e63;
		margin-bottom: 26upx;
		border-radius: 5px;
		//box-shadow: 0px 4px 6px 0px rgba(103, 103, 103, 0.8);
		font-size: 17px;
		color: #FFFFFF;
		background: -webkit-gradient(linear, left top, right top, from(rgba(218, 171, 57, 0.6)), to(#ff5e63));
	}

	page {
		background-color: #E5E5E5;
	}
</style>