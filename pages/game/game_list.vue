<template>
	<view class="bg">
		<!-- <view class="content-head" :style="{ top: top + 'px' }">活动专区</view> -->
		<view class="list">
			<view class="info" v-for="(d, i) in gameList" :key="i" @click="getGame(d)">
				<image class="info-img" :src="d.img" mode="aspectFill"></image>
				<view class="list-content">
					<view class="list-title">{{d.title}}</view>
					<view class="list-time" v-if="d.status==1">{{utils.timeTodate('Y-m-d',d.start_time)}} 至
						{{utils.timeTodate('Y-m-d',d.end_time)}}
					</view>
					<view class="list-time" style="color:#DD524D;" v-else>{{utils.timeTodate('Y-m-d',d.start_time)}} 至
						{{utils.timeTodate('Y-m-d',d.end_time)}}
					</view>
				</view>
			</view>
		</view>
		<view style="width:100%;height:500upx;margin-top:100px;text-align:center;" v-if="isShowTig">
			<image src="/static/empty.png" style="width:100px;height:100px;"></image>
			<view style="width:100%;font-size:25upx;color:#666;margin-top:30upx;">活动正在筹备中，请稍后再试</view>
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
				top: 27,
				userId: 0,
				gameList: [],
				isShowTig: false,
				utils: utils,

				one: false,
			}
		},
		onLoad() {
			_self = this;
			_self._showLoading('加载中...')
			var mobile = uni.getSystemInfoSync();
			_self.top = mobile.safeArea.top + 7;
			// 是否登录
			const info = api.getLogins();
			if (info === false) {
				_self.skipUrl();
			} else {
				_self.userId = info.userId;
				_self.getGameList();
			}
		},
		onShow() {
			if (_self.one) _self.getGameList();
			//plus.screen.lockOrientation('landscape-primary'); //强制横屏
		},
		onHide() {
			_self.one = true;
		},
		/* onUnload() {
			plus.screen.lockOrientation('portrait-primary'); //恢复竖屏
		}, */
		methods: {
			// 获取活动列表
			getGameList() {
				uni.request({
					url: api.apiData.getGameList,
					method: 'GET',
					success: (e) => {
						var gameList = e.data.Data;
						if (gameList.length > 0) {
							for (var i = 0; i < gameList.length; i++) {
								api.imgCache(gameList[i].img, (img) => {
									gameList[i].img = img;
								});
							}
							_self.gameList = gameList;
							_self.isShowTig = false;
						} else {
							_self.gameList = [];
							_self.isShowTig = true;
						}
						_self._hideLoading()
					},
					fail: () => {
						// 加载失败提示
						_self.msgData('服务器连接失败，请检查网络是否正常', 5000);
					}
				});
			},
			// 进入活动专题
			getGame(e) {
				//console.log(url);return;
				if (e.status == 0) {
					_self.msgData('该活动已结束，开放时间请留意APP公告', 3000);
					return false;
				}
				if (e.target == 1) {
					_self.skipUrl(e.is_word == 0 ? e.url + '?gid=' + e.id : '/pages/game/detail?id=' + e.id, 2);
				} else
				if (e.target == 2) {
					plus.runtime.openURL(e.url);
				} else {
					_self.skipUrl('/pages/member/activity?type=' + encodeURI(e.url + '?gid=' + e.id), 2)
				}
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
					});
				},200)
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			_self.getGameList();
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
	.info {
		width: 90%;
		background: #393D49;
		border-radius: 10px;
		margin: 0 5% 15px;
		height: 185px;
	}

	.list-content {
		padding: 0 3%;
		font-size: 14px;
		color: #FFFFFF;
		background: rgba(57, 61, 73, 0.8);
		width: 94%;
		height: 30px;
		line-height: 30px;
		float: left;
		margin-top: -30px;
		z-index: 10;
		position: relative;
		font-size: 13px;
		border-radius: 0 0 10px 10px;
	}

	.list-content view {
		display: inline-block;
	}

	.list-time {
		float: right;
	}

	.info-img {
		width: 100%;
		height: 185px;
		border-radius: 10px;
		float: left;
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

	.list {
		margin-top: 33upx;
		padding-bottom: 15px;
	}
</style>
