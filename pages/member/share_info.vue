<template>
	<view class="content">
		<view class="head">
			<image class="img" :src="data.user.headimgurl" mode="aspectFill"></image>
			<view class="username">
				<text>{{data.user.username}}</text>
			</view>
			<view class="info">
				<view class="item">
					<view class="text">今日收益</view>
					<view class="number">{{data.today}}</view>
				</view>
				<image class="line" src="/static/member/line.png" mode="aspectFill"></image>
				<view class="item">
					<view class="text">累计收益</view>
					<view class="number">{{data.all}}</view>
				</view>
				<image class="line" src="/static/member/line.png" mode="aspectFill"></image>
				<view class="item">
					<view class="text">账户余额</view>
					<view class="number">{{data.user.k_money}}</view>
				</view>
			</view>
		</view>

		<view class="center" @click="skipUrl('/pages/member/share_log', 'new')">
			<view class="item" :style="{'margin-top':topUpx+'upx'}">
				<image class="img" src="/static/member/install.png" mode="aspectFill"></image>
				<text>直推安装记录</text>
				<view class="r">
					<text>{{data.install}}人</text>
					<image class="more r" :style="{'margin-top':moreUpx+'upx'}" src="/static/imgs/more1.png"
						mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<!-- 层级 -->
		<view class="bottom" :style="{'top':menuToTop+'px','padding-top':pTop+'px'}">
			<view class="item radius-top-l" :class="level==1?'set':''" @click="setLevel(1)">
				<text>一级会员</text>
			</view>
			<view class="item" :class="level==2?'set':''" @click="setLevel(2)">
				<text>二级会员</text>
			</view>
			<view class="item radius-top-r" :class="level==3?'set':''" @click="setLevel(3)">
				<text>三级会员</text>
			</view>
		</view>
		<!-- 总人数：100 今日收益：10.00 总收益：100.00 -->
		<view class="statistics" :style="{'top':sTop+'px'}">
			<view class="title">
				<text>总数:{{team.count}}人</text>
			</view>
			<view class="title">
				<text>今日:{{team.today}}余额</text>
			</view>
			<view class="title">
				<text>累计:{{team.all}}余额</text>
			</view>
		</view>

		<view class="list">
			<view class="item" v-for="(l, i) in list" :key="i">
				<image :src="l.headimgurl" mode="aspectFill"></image>
				<view class="left">
					<text>{{l.username}}</text>
					<text class="r">{{utils.timeTodate('Y年m月d日', l.add_time)}}</text>
				</view>
			</view>
			<view class="moreTig" v-if="isMoreTig">——— 我是有底线的 ———</view>
			<view style="width:100%;margin:80px 0;text-align:center;" v-if="isShowTig">
				<image src="/static/empty.png" style="width:100px;height:100px;"></image>
				<view style="width:100%;font-size:25upx;color:#666;margin-top:30upx;">暂无推广记录，加油吧骚年</view>
			</view>
		</view>
		<css-loading ref="cssLoading"></css-loading>
	</view>
</template>
<script>
	import api from "@/common/api.js";
	import utils from '@/components/shoyu-date/utils.filter.js';
	var _self;
	export default {
		data() {
			return {
				utils: utils,
				userId: 0,
				one: false,
				phone: {},
				moreUpx: 4,
				topUpx: 2,
				level: 1,
				menuToTop: 44,
				pTop: 10,
				sTop: 0,

				data: {
					user: {
						username: 'loading...',
						headimgurl: '/static/langman.png',
						k_money: 0
					},
					today: 0,
					all: 0,
					install: 0
				},
				team: {
					count: 0, //注册人数（已注册的用户）
					today: 0, //今日收益
					all: 0, //
				},
				list: [],
				page: 1,
				isShowTig: false,
				isMoreTig: false,
			}
		},
		onLoad(e) {
			_self = this;
			_self._showLoading('加载中...');
			_self.phone = uni.getSystemInfoSync();
			// #ifdef APP-PLUS
			if (_self.phone.platform == 'ios') {
				_self.moreUpx = 0;
				_self.topUpx = 10;
				_self.menuToTop = plus.navigator.hasNotchInScreen() ? 85 : 64;
			} else {
				_self.moreUpx = 10;
				_self.topUpx = 0;
				_self.menuToTop = 68;
			}
			// #endif
			var info = api.getLogins();
			if (info == false) {
				_self.skipUrl();
			} else {
				_self.userId = info.userId;
				_self.getData();
			}
		},
		onShow() {
			if (_self.one) {
				var info = api.getLogins();
				if (info == false) {
					_self.skipUrl();
				} else {
					_self.userId = info.userId;
					_self.getData();
				}
			}
		},
		onHide() {
			_self.one = true;
		},
		mounted: function() {
			const query = uni.createSelectorQuery().in(this);
			setTimeout(() => {
				query.select('.bottom').boundingClientRect(t => {
					_self.sTop = t.height + _self.menuToTop;
				}).exec();
			}, 800);
		},
		methods: {
			getData() {
				uni.request({
					url: api.apiData.getUserTeam,
					method: 'POST',
					data: {
						uid: _self.userId,
						level: _self.level,
						page: _self.page
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var r = e.data;
						//console.log(_self.level)
						if (r.Code == 200) {
							_self.team = r.Data.level;
							var dataList = _self.team.list;
							if (_self.page == 1) {
								_self.data = r.Data.team;
								_self.isMoreTig = false;
								if (dataList.length > 0) {
									_self.list = dataList;
									_self.isShowTig = false;
								} else {
									_self.isShowTig = true;
								}
							} else {
								_self.isShowTig = false;
								if (dataList.length > 0) {
									_self.list = _self.list.concat(dataList);
									_self.isMoreTig = false;
								} else {
									_self.isMoreTig = true;
								}
							}
							setTimeout(() => {
								_self._hideLoading();
							}, 500)
						} else {
							_self.back(r.Msg);
						}
					},
					fail: () => {
						_self.back('服务器连接失败，请检查网络是否正常');
					}
				});
			},
			back(msg) {
				api.showToast(msg + '', 1500);
				setTimeout(() => {
					api.jumpUrl('/pages/member/poster', 'tab');
				}, 1000);
			},
			setLevel(i) {
				_self.level = i;
				_self.list = [];
				_self.page = 1;
				_self.getMyData();
			},
			getMyData() {
				_self._showLoading('加载中...');
				_self.getData();
			},
			// 跳转登录
			skipUrl(u = '/pages/login/login', t = 'new') {
				api.jumpUrl(u, t);
			},
		},
		// 上拉加载数据
		onReachBottom() {
			if (_self.isShowTig || _self.isMoreTig) return false;
			_self.page++;
			_self.getMyData();
		},
	};
</script>

<style lang="scss">
	.moreTig {
		text-align: center;
		color: #999999;
		font-size: 12px;
		margin-top: 30upx;
		padding-bottom: 50upx;
	}

	.list {
		margin: 20upx 40upx;

		.item {
			display: flex;
			flex-direction: row;
			background-color: #FFFFFF;
			border-radius: 12upx;
			margin-top: 15upx;
			padding: 20upx;

			image {
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
			}

			.left {
				width: 89%;
				margin-left: 2%;
				font-size: 13px;
				color: #666666;
				height: 50upx;
				line-height: 50upx;
				//background-color: #007AFF;
			}
		}
	}

	.statistics {
		position: sticky;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: row;
		text-align: center;
		padding: 20upx 0;
		box-shadow: inset 0px 1px rgba(255, 255, 255, 0.4), 0 3px 8px rgba(0, 0, 0, 0.1);
		z-index: 2;

		.title {
			width: 33%;
			color: #666666;
			font-size: 13px;
		}
	}

	.bottom {
		position: sticky;
		padding: 0 40upx;
		display: flex;
		flex-direction: row;
		text-align: center;
		border-bottom: 1px solid rgba(254, 67, 101, 0.8);
		background-color: #F5F5F5;
		z-index: 2;

		.radius-top-l {
			border-radius: 12upx 0 0 0;
		}

		.radius-top-r {
			border-radius: 0 12upx 0 0;
		}

		.set {
			background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8)) !important;
			color: #FFFFFF !important;
		}

		.item {
			width: 33.2%;
			height: 80upx;
			line-height: 80upx;
			background-color: #FFFFFF;
			font-size: 28upx;
			color: #666666;
			//margin-bottom: -1px;
		}
	}

	.center {
		background-color: #FFFFFF;
		margin: -40upx 40upx 0;
		border-radius: 12upx;
		padding: 15upx 20upx 22upx;

		//box-shadow: inset 0px 1px rgba(255, 255, 255, 0.4), 0 3px 8px rgba(0, 0, 0, 0.5);
		.item {
			//background-color: #007AFF;
			margin-top: 10upx;

			.img {
				width: 40upx;
				height: 40upx;
				margin: 0 10upx -10upx 0;
			}

			text {
				color: #666666;
				font-size: 30upx;
			}

			.more {
				width: 40upx;
				height: 40upx;
				margin-top: 4upx;
			}
		}
	}

	.head {
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		text-align: center;
		padding-bottom: 60upx;

		.img {
			width: 150upx;
			height: 150upx;
			margin-top: 120upx;
			border-radius: 50%;
			border: 1px solid #F5F5F5;
			box-shadow: inset 0px 1px rgba(255, 255, 255, 0.4), 0 3px 8px #F5F5F5;
		}

		.username {
			margin-top: 10upx;
			font-size: 36upx;
			color: #FFFFFF;

			text {
				border-bottom: 1px solid #FFFFFF;
				padding: 5upx 10upx;
			}
		}

		.info {
			margin-top: 40upx;
			color: #FFFFFF;
			height: 120upx;

			.item {
				width: 30%;
				height: 100upx;
				display: inline-block;
				font-size: 33upx;

				.number {
					font-size: 38upx;
				}
			}
		}
	}

	.line {
		width: 10upx;
		height: 100upx;
		margin-bottom: -13upx;
	}

	.l {
		float: left;
	}

	.r {
		float: right;
	}

	page {
		background-color: #f0f0f0;
	}
</style>