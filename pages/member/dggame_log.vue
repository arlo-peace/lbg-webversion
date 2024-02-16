<template>
	<view class="bg">
		<view class="content-head" :style="{ 'padding-top': (top+7) + 'px' }">
			<view class="content-head-back" @click="skipUrl('member/mymoney', 'new')">
				<image src="/static/imgs/back.png" mode="aspectFill"
					style="width:20px;height:20px;margin:5px 0 0 -3px;"></image>
			</view>
			<view style="text-align:center;width:89%;">游戏记录</view>
			<view style="margin-top:30px;font-size:50upx;">
				{{point}}
			</view>
		</view>

		<view class="bank-list" :style="{'margin-top': (top+173) + 'px'}">
			<view class="bank-info" v-for="(d, i) in logList" :key="i">
				<view class="bank-content">
					<view class="info-title">{{d.gameName}}</view>
					<view class="bank-name">{{d.betTime}}</view>
					<view class="money">
						<view style="color:#ff5e63;">{{d.bet}}</view>
						<!-- <view v-if="d.type==1" style="color:#ff5e63;font-size:12px;">金币</view>
						<view style="color:#ff5e63;font-size:12px;" v-else>余额</view> -->
					</view>
				</view>
			</view>
		</view>

		<view style="width:100%;margin-top:100px;text-align:center;" v-if="isShowTig">
			<image src="/static/empty.png" style="width:100px;height:100px;"></image>
			<view style="width:100%;font-size:25upx;color:#666;margin-top:30upx;">暂无交易记录</view>
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
				point: 0,
			}
		},
		onLoad() {
			_self = this;
			var mobile = uni.getSystemInfoSync();
			_self.top = mobile.statusBarHeight;
			//console.log(mobile)
			// 是否登录
			const info = api.getLogins();
			if (info === false) {
				_self.skipUrl('login/login', 'new');
			} else {
				_self.userId = info.userId;
				_self.getDeposit();
			}
		},
		methods: {
			setTabId(t) {
				_self.tabId = t;
				_self.startOpt();
				_self.getDeposit();
			},
			// 获取账户明细
			getDeposit() {
				_self._showLoading('加载中...');
				uni.request({
					url: api.apiData.getDgDetailed,
					method: 'POST',
					data: {
						userId: _self.userId,
						page: _self.page,
						type: _self.tabId
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var data = e.data.Data;
						var logList = data.list;
						_self.point = data.point;
						if (!_self.more) _self.logList = [];
						if (logList.length > 0) {
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
						api.showToast('服务器连接失败，请检查网络是否正常', 3000);
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
			skipUrl(uri = 'login/login', type = 'new') {
				api.jumpUrl('/pages/' + uri, type);
			},
		},
		// 上拉加载数据
		onReachBottom() {
			if (!_self.isMoreTig) {
				_self._showLoading('加载中...');
				_self.more = true;
				_self.isShowTig = false;
				_self.page++;
				_self.getDeposit();
			}
		},
	}
</script>

<style>
	.content-head-back {
		width: 30px;
		height: 30px;
		line-height: 30px;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.5);
		float: left;
		margin-left: 10px;
	}

	.head-title .sel {
		background-color: #FF8F00;
		color: #FFFFFF;
	}

	.head-title text {
		display: inline-block;
		text-align: center;
		background-color: rgba(255, 255, 255, 0.1);
		width: 45%;
		height: 40px;
		line-height: 40px;
		color: #999;
	}

	.head-title {
		text-align: center;
		font-size: 33upx;
		width: 100%;
		//background-color: #24292E;
		margin-top: 30px;
	}

	.moreTig {
		text-align: center;
		color: #ccc;
		font-size: 25upx;
		margin: 30upx 0 50upx 0;
	}

	.info-title {
		font-size: 30upx;
		width: 80%;
		color: #FFFFFF;
	}

	.money {
		float: right;
		margin-top: -33px;
		font-size: 16px;
		text-align: right;
	}

	.content-head {
		position: fixed;
		width: 100%;
		top: 0;
		z-index: 9;
		text-align: center;
		color: #FFFFFF;
		//background-color: #24292E;
		//background-image: url(../../static/member/bg.png);
		background-size: 100% 100%;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.bank-list {
		margin-top: 70px;
		padding-bottom: 15px;
	}

	.bank-info view {
		display: inline-block;
	}

	.bank-content {
		width: 100%;
		font-size: 30upx;
	}

	.bank-content view {
		display: block;
	}

	.bank-name {
		font-size: 26upx;
	}

	.bank-info {
		padding: 6px 15px;
		width: 86%;
		margin: 0 auto 10upx;
		font-size: 17px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		color: #999;
	}
</style>