<template>
	<view class="bg">
		<view class="content-head" :style="{ top: top + 'px' }">长视频记录</view>
		<view class="watch-head" :style="{ padding: (top+45) + 'px 0 5px 0' }">
			<view :class="tab==1?'select':''" @click="toggle(1)">看过</view>
			<view :class="tab==2?'select':''" @click="toggle(2)">赞过</view>
			<view :class="tab==3?'select':''" @click="toggle(3)">买过</view>
			<view class="del-log" style="font-size:12px;" @click="delWatch" v-if="isShowDel">清除足迹</view>
		</view>
		<view class="watch-list" :style="{ padding: (bgHeight+0) +'px 0 0 0' }">
			<view class="watch-content" v-if="!isShowTig"></view>

			<view class="watch-content" v-for="(v, i) in logList" :key="i" @click="playVideo(v.videoId)">
				<view class="watch-radius"></view>
				<view class="video-img">
					<image :src="v.thumbnail" mode="aspectFill"></image>
				</view>
				<view class="video-info">
					<view class="video-title video-info-video-title">{{v.videoTitle}}</view>
					<view class="video-class">
						<text style="background:#D89720;padding:0 5px;color:#FFFFFF;font-size:11px;border-radius:3px;"
							v-if="tab!=1">{{v.playTime}}</text>
						<text style="float:right;color:rgba(255,154,53,1);" v-if="v.gold>0">{{v.gold}} 金币</text>
						<text style="float:right;color:#1AAD19;" v-else>免费</text>
					</view>
					<view class="video-time">
						<view v-if="tab==1">
							<text
								style="background:#D89720;padding:0 5px;color:#FFFFFF;font-size:11px;border-radius:3px;">{{v.playTime}}</text>
							<text style="float:right;">{{utils.friendlyDate(v.addTime)}}</text>
						</view>
						<view v-else-if="tab==2">
							<view style="color:#ff962f;width:40%;margin-top:2px;">
								<image src="/static/imgs/like.png"
									style="width:13px;height:13px;float:left;margin:3px 3px 0 0;"></image>
								{{v.likes}}
							</view>
							<text style="float:right;">{{utils.timeTodate('Y/m/d',v.addTime)}}</text>
						</view>
						<view style="margin-top:4px;font-size:12px;" v-else>
							<text>{{v.endMsg}}</text>
							<text style="float:right;">{{v.addTime}}</text>
						</view>
					</view>
				</view>
			</view>

			<view style="width:100%;height:500upx;margin-top:100px;text-align:center;" v-if="isShowTig">
				<image src="/static/empty.png" style="width:100px;height:100px;"></image>
				<view style="width:100%;font-size:25upx;color:#999;margin-top:30upx;">{{noData}}</view>
			</view>
			<view class="moreTig" v-if="isMoreTig">——— 我是有底线的 ———</view>
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
				bgHeight: 111,
				userId: 0,
				page: 1,
				logList: [],
				isShowTig: false,
				isMoreTig: false,
				more: false,
				tab: 1,
				utils: utils,
				noData: '暂无足迹，去看部视频试试吧',
				isShowDel: true,
				path: {
					url: '/pages/member/member',
					type: 'tab'
				}
			}
		},
		onLoad(e) {
			_self = this;
			_self._showLoading('加载中...');
			var mobile = uni.getSystemInfoSync();
			_self.top = mobile.safeArea.top + 7;
			if (e.path != undefined) _self.path = JSON.parse(e.path);
			// 是否登录
			const info = api.getLogins();
			if (info === false) {
				_self.skipUrl();
			} else {
				_self.userId = info.userId;
				_self.getWatch();
			}
		},
		mounted: function() {
			const query = uni.createSelectorQuery().in(this);
			query.select('.watch-head').boundingClientRect(data => {
				_self.bgHeight = data.bottom;
			}).exec();
		},
		methods: {
			// 跳转播放页
			playVideo(vid) {
				uni.setStorage({
					key: 'vid',
					data: vid,
					success: () => {
						var param = {
							url: '/pages/member/watch_log',
							t: 'new'
						}
						api.jumpUrl('/pages/video/play?type=' + JSON.stringify(param), 'new');
					},
					fail: () => {
						api.showToast('服务器连接失败，请检查网络是否正常');
					}
				});
			},
			// 获取我的足迹
			getWatch() {
				uni.request({
					url: api.apiData.getWatchLog,
					method: 'POST',
					data: {
						userId: _self.userId,
						page: _self.page,
						type: _self.tab
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var logList = e.data.Data.list;
						//console.log(e)
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
						api.showToast('服务器连接失败，请检查网络是否正常');
					}
				});
			},
			// 切换
			toggle(e) {
				_self._showLoading('加载中...');
				_self.logList = [];
				_self.startOpt();
				_self.tab = e;
				if (e == 1) {
					_self.isShowDel = true;
					_self.noData = '挥一挥手机，不带走一部视频';
				} else if (e == 2) {
					_self.isShowDel = false;
					_self.noData = '万水千山总是情，赞部视频行不行';
				} else {
					_self.isShowDel = false;
					_self.noData = '等有钱了我要买两部，看一部，扔一部';
				}
				_self.getWatch();
			},
			// 初始化参数
			startOpt() {
				_self.page = 1;
				_self.isShowTig = false;
				_self.isMoreTig = false;
				_self.more = false;
			},
			delWatch() {
				uni.showModal({
					title: '提示',
					content: '确认要清除所有足迹吗？',
					cancelText: '点错了',
					confirmText: '一键清除',
					success: function(res) {
						_self._showLoading('处理中...');
						if (res.confirm) {
							uni.request({
								url: api.apiData.delWatchLog + '/type/1/userId/' + _self.userId,
								method: 'GET',
								header: {
									'Content-type': 'application/x-www-form-urlencoded'
								},
								success: (e) => {
									var res = e.data;
									api.showToast(res.Msg, 2000);
									if (res.Code == 200) {
										_self.logList = [];
										_self.tab = 1;
										_self.page = 1;
										_self.isShowTig = true;
										_self.isMoreTig = false;
										_self.more = false;
										_self.noData = '挥一挥手机，不带走一部视频';
										//_self.getWatch();
									}
								},
								fail: () => {
									// 加载失败提示
									api.showToast('服务器连接失败，请检查网络是否正常');
								}
							});
						} else if (res.cancel) {
							_self._hideLoading();
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
			}
		},
		// 上拉加载数据
		onReachBottom() {
			if (!_self.isMoreTig) {
				_self._showLoading('加载中...');
				_self.page++;
				_self.more = true;
				_self.isShowTig = false;
				_self.getWatch();
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			_self.startOpt();
			_self.getWatch();
			uni.stopPullDownRefresh();
		},
		onBackPress(e) {
			api.jumpUrl(_self.path.url, _self.path.type);
			return true;
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

	.watch-radius {
		width: 18px;
		height: 18px;
		background: #FF8F00;
		float: left;
		border-radius: 50%;
		margin-left: -11px;
		margin-top: 30px;
	}

	.video-class {
		font-size: 13px;
	}

	.video-time {
		font-size: 13px;
	}

	.video-title {
		font-size: 16px;
		color: #CCCCCC !important;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		//background: #1AAD19;
		height: 33px;
		line-height: 33px;
	}

	.video-info view {
		width: 100%;
		float: left;
		color: #999;
	}

	.video-img image {
		width: 100%;
		height: 100%;
		border-radius: 10px;
		box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.5);
	}

	.video-img {
		width: 35%;
		padding: 0 0 0 2%;
		height: 80px;
	}

	.video-info {
		width: 58%;
		float: right;
	}

	.watch-content view {
		display: inline-block;
	}

	.watch-content {
		width: 90%;
		margin: 0 5%;
		border-left: 4px solid #FF8F00;
		padding: 5px 0 0 0;
	}

	.watch-list {
		width: 100%;
		padding-bottom: 15px;
	}

	.select {
		border-bottom: 2px solid #FFFFFF;
		padding-bottom: 5px;
	}

	.content-head {
		position: fixed;
		width: 100%;
		height: 30px;
		line-height: 30px;
		top: 27px;
		text-align: center;
		color: #FFFFFF;
		z-index: 10;
	}

	.watch-head {
		width: 100%;
		text-align: center;
		background-color: #20202C;
		position: fixed;
		z-index: 5;
	}

	.watch-head view {
		display: inline-block;
		width: 60px;
		font-size: 16px;
		color: #FFFFFF;
	}

	.del-log {
		background: rgba(0, 0, 0, 0.5);
		padding: 5px 2px 5px 8px;
		border-radius: 50px 0 0 50px;
		position: absolute;
		right: 0;
	}
</style>