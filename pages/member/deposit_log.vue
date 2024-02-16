<template>
	<view class="bg">
		<!-- <view class="content-head" :style="{ top: (top+7) + 'px' }">提现记录</view> -->
		<view class="bank-list" :style="{'margin-top': (top+13) + 'px'}">
			<view :class="l.status>0?'bank-info ok':'bank-info no'" v-for="(l, i) in logList" :key="i">
				<view class="img">
					<image :src="l.banklogo" mode="aspectFill"></image>
				</view>
				<view class="bank-content">
					<view>{{l.bankName}} (**** {{l.bankSn}})</view>
					<view class="bank-name">{{l.bankUsername}}</view>
					<view style="font-size:13px;">{{l.addTime}}</view>
					<view class="money">
						<view style="font-weight:bold;">{{l.money}}元</view>
						<view style="font-size:13px;">{{l.msg}}</view>
					</view>
				</view>
			</view>
		</view>

		<view style="width:100%;height:500upx;margin-top:100px;text-align:center;" v-if="isShowTig">
			<image src="/static/empty.png" style="width:100px;height:100px;"></image>
			<view style="width:100%;font-size:25upx;color:#666;margin-top:30upx;">暂无提现记录</view>
		</view>
		<view class="moreTig" v-if="isMoreTig">——— 我是有底线的 ———</view>

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
				userId: 0,
				page: 1,
				logList: [],
				isShowTig: false,
				isMoreTig: false,
				more: false,
			}
		},
		onLoad() {
			//#ifdef APP
			plus.screen.lockOrientation('portrait-primary');
			//#endif
			_self = this;
			_self._showLoading('加载中...');
			var mobile = uni.getSystemInfoSync();
			_self.top = mobile.statusBarHeight;
			// 是否登录
			const info = api.getLogins();
			if (info === false) {
				_self.skipUrl();
			} else {
				_self.userId = info.userId;
				_self.getDeposit();
			}
		},
		methods: {
			// 获取提现记录
			getDeposit() {
				uni.request({
					url: api.apiData.getDeposit + '/userId/' + _self.userId + '/page/' + _self.page,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var logList = e.data.Data;
						if (!_self.more) _self.logList = [];
						if (logList != null && logList.length > 0) {
							_self.logList = _self.logList.concat(logList);
						} else {
							_self.page--;
							// 加载更多状态
							if (_self.more) {
								_self.isMoreTig = true;
							} else {
								_self.isShowTig = true;
							}
						}
						_self._hideLoading();
					},
					fail: () => {
						// 加载失败提示
						_self.msgData('服务器连接失败，请检查网络是否正常', 5000);
					}
				});
			},
			// 初始化参数
			startOpt() {
				_self.page = 1;
				_self.isShowTig = false;
				_self.isMoreTig = false;
				_self.more = false;
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
				}, 200)
			}
		},
		// 上拉加载数据
		onReachBottom() {
			if (!_self.isMoreTig) {
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				_self.more = true;
				_self.isShowTig = false;
				_self.page++;
				_self.getDeposit();
			}
			//console.log(_self.page);
		},
		// 下拉刷新
		onPullDownRefresh() {
			_self.startOpt();
			_self.getDeposit();
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
	.moreTig {
		text-align: center;
		color: #ccc;
		font-size: 25upx;
		margin: 30upx 0 50upx 0;
	}

	.money {
		float: right;
		margin-top: -45px;
		font-size: 15px;
		text-align: right;
	}

	.content-head {
		position: fixed;
		width: 100%;
		height: 30px;
		line-height: 30px;
		top: 27px;
		text-align: center;
		color: #666666;
	}

	.bank-list {
		margin-top: 70px;
		padding-bottom: 15px;
	}

	.bank-info view {
		display: inline-block;
	}

	.bank-info .img {
		width: 20%;
	}

	.bank-info .img image {
		width: 56px;
		height: 56px;
		border-radius: 50%;
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
		padding: 15px 15px 13px;
		width: 86%;
		background: #ff5e63;
		margin: 0 auto 10px;
		border-radius: 5px;
		box-shadow: 0px 4px 6px 0px rgba(103, 103, 103, 0.8);
		font-size: 17px;
		color: #FFFFFF;
		background: -webkit-gradient(linear, left top, right top, from(rgba(0, 0, 0, 0.6)), to(#70d6ef));
	}

	.ok {
		//background: -webkit-gradient(linear, left top, right top, from(rgba(0,0,0,0.6)), to(#56e7a4));
		border: 1px solid #E5E5E5;
	}

	.no {
		//background: -webkit-gradient(linear, left top, right top, from(rgba(0,0,0,0.6)), to(#ff5e63)); 
		border: 1px solid rgba(255, 94, 99, 0.5);
	}
</style>