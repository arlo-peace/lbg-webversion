<template>
	<view>
		<css-loading ref="cssLoading"></css-loading>
		<view class="list">
			<view class="item" v-for="(p, i) in list" :key="i">
				<view class="top">
					<image class="cover" :src="p.cover" mode="aspectFill"></image>
					<text class="title">{{p.title}}</text>
				</view>
				<view class="center" @click="openInfo(p.info)">
					<text class="title">直播总收益</text>
					<view class="money">
						<text class="dw">余额</text>
						<text class="je">{{p.total}}</text>
						<text class="dw">明细</text>
					</view>
				</view>
				<view class="bottom">
					<view class="info">
						<text class="left">房间类型</text>
						<text class="right r" v-if="p.gold > 0">金币房({{p.gold}}金币)</text>
						<text class="right r" v-else>免费房</text>
					</view>
					<view class="info top-border">
						<text class="left">直播时长</text>
						<text class="right r">{{formatSeconds(p.playerTime)}}</text>
					</view>
					<view class="info top-border">
						<text class="left">开播时间</text>
						<text class="right r">{{utils.timeTodate('Y年m月d日', p.startTime)}}</text>
					</view>
					<view class="info top-border"
						@click="jumpUrl('/pages/live/player_gift_log?url='+p.live_stream_address+'&aid='+p.anchor_id, 'new')">
						<text class="left">礼物明细</text>
						<view class="right r">
							<image src="/static/imgs/r.png" style="width:12px;height:10px;"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="moreTig" v-if="isMoreTig">——— 我是有底线的 ———</view>
			<view style="width:100%;margin-top:300upx;text-align:center;" v-if="isShowTig">
				<image src="/static/empty.png" style="width:100px;height:100px;"></image>
				<view style="width:100%;font-size:25upx;color:#999;margin-top:30upx;">暂无直播记录</view>
			</view>
		</view>
		<uni-popup ref="info" type="center" :backColor="'rgba(0,0,0,0.1)'">
			<view class="popup" :style="'margin-top:'+ infoTop +'px'">
				<view class="item margin-bottom15">
					<text>房间收益</text>
					<text class="r">{{info.roomGold}}金币</text>
				</view>
				<view class="item margin-bottom15">
					<text>礼物打赏</text>
					<text class="r">{{info.giftGold}}金币</text>
				</view>
				<view class="item margin-bottom15">
					<text>总收益数</text>
					<text class="r">{{info.countGold}}金币</text>
				</view>
				<view class="item">
					<text>结算余额</text>
					<text class="r">(比例{{info.bl}}%){{info.money}}余额</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	import utils from '@/components/shoyu-date/utils.filter.js';
	import cssLoading from '@/components/css-loading/loading.vue'
	var _self;
	export default {
		components: {
			cssLoading
		},
		data() {
			return {
				utils: utils,
				loading: true,
				top: 0,
				info: {
					roomGold: 0,
					giftGold: 0,
					countGold: 0,
					money: 0,
					bl: 1,
				},
				infoTop: -50,
				list: [],
				page: 1,
				userId: 0,
				one: false,
				isShowTig: false,
				isMoreTig: false,
			}
		},
		onLoad() {
			_self = this;
			_self._showLoading()
			// #ifdef H5
			_self.top = 44;
			_self.infoTop = 10;
			//#endif
			const info = api.getLogins();
			if (info === false) {
				api.jumpUrl('/pages/login/login', 'new');
			} else {
				_self.userId = info.userId;
				_self.getData();
			}
		},
		onHide() {
			_self.one = true;
		},
		onShow() {
			if (_self.one) {
				const info = api.getLogins();
				if (info === false) {
					api.jumpUrl('/pages/login/login', 'new');
				} else {
					_self.userId = info.userId;
				}
			}
		},
		methods: {
			_showLoading(text = null) {
				this.$nextTick(() => {
					this.$refs.cssLoading.open(text)
				})
			},
			_hideLoading() {
				this.$nextTick(() => {
					this.$refs.cssLoading.close()
				})
			},
			formatSeconds(t) {
				return api.formatSeconds(Math.abs(t), 2);
			},
			openInfo(i) {
				_self.info = i;
				setTimeout(() => {
					_self.$refs.info.open();
				}, 50)
			},
			getData(t = 1) {
				uni.request({
					url: api.apiData.getPlayerLog,
					method: 'POST',
					data: {
						uid: _self.userId,
						page: _self.page
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						//console.log(e)
						var d = e.data;
						if (d.Code == 201) {
							api.showToast(d.msg);
							setTimeout(() => {
								api.jumpUrl('/pages/member/mymoney', 'new');
							}, 1000);
							return
						}
						var data = e.data.Data;
						if (_self.page == 1) {
							_self.isMoreTig = false;
							if (data.length > 0) {
								_self.list = data;
								_self.isShowTig = false;
							} else {
								_self.isShowTig = true;
							}
						} else {
							_self.isShowTig = false;
							if (data.length > 0) {
								_self.list = _self.list.concat(data);
								_self.isMoreTig = false;
							} else {
								_self.isMoreTig = true;
							}
						}
						_self.loading = false;
						_self._hideLoading()
					},
					fail: () => {
						// 加载失败提示
						_self.msgData('服务器连接失败，请检查网络是否正常', 5000);
					},
					complete: () => {
						if (t == 2) _self._hideLoading();
					}
				});
			},
			jumpUrl(u, t) {
				api.jumpUrl(u, t);
			}
		},
		// 上拉加载数据
		onReachBottom() {
			if (_self.isShowTig || _self.isMoreTig) return false;
			_self._showLoading('加载中...');
			_self.page++;
			_self.getData(2);
		},
	}
</script>

<style lang="scss">
	@import url('@/components/loading/loading.css');

	.moreTig {
		text-align: center;
		color: #999999;
		font-size: 12px;
		margin-top: 30upx;
		padding-bottom: 30upx;
	}

	.popup {
		width: 500upx;
		border-radius: 20upx;
		padding: 40upx;
		background-color: #FFFFFF;

		.margin-bottom15 {
			margin-bottom: 15upx;
		}

		.item {
			font-size: 13px;
			color: #666666;
		}
	}

	.list {
		padding: 30upx;

		.top-border {
			border-top: 1px solid #F3F3f3;
		}

		.item {
			background-color: #FFFFFF;
			border-radius: 12upx;
			padding: 30upx 30upx 20upx 30upx;
			margin-bottom: 30upx;

			.bottom {
				font-size: 13px;

				.info {
					padding: 18upx 0;

					.right {
						color: #666666;
					}
				}
			}

			.center {
				text-align: center;
				margin: 20upx 0;

				.title {
					color: #666666;
					font-size: 12px;
				}

				.money {
					color: #FF5722;
					font-weight: bold;

					.je {
						font-size: 20px;
					}

					.dw {
						font-size: 12px;
						margin: 0 10upx;
					}
				}
			}

			.top {
				display: flex;
				flex-direction: row;
				border-bottom: 1px solid #F3F3f3;
				padding-bottom: 23upx;

				.cover {
					width: 50upx;
					height: 50upx;
					border-radius: 12upx;
					margin-right: 15upx;
				}

				.title {
					flex: 1;
					font-size: 14px;
					color: #444444;
					height: 50upx;
					line-height: 50upx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					//background-color: #007AFF;
				}
			}
		}
	}

	.l {
		float: left;
	}

	.r {
		float: right;
	}
</style>