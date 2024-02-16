<template>
	<view class="bg">
		<css-loading ref="cssLoading"></css-loading>
		<view class="watch-list">
			<view class="watch-content" v-if="!isShowTig"></view>
			<view class="watch-content" v-for="(v, i) in logList" :key="i" @click="playVideo(v)">
				<view class="watch-radius"></view>
				<view class="video-img">
					<easy-loadimage mode="aspectFill" :scroll-top="scrollTop" :image-src="v.thumbnail"
						:open-transition="true" class="cover">
					</easy-loadimage>
				</view>
				<view class="video-info">
					<view class="video-title video-info-video-title">{{v.title}}</view>
					<view class="video-class">
						<text style="color:rgba(26,173,16,0.7);">{{v.gold}} 金币</text>
					</view>
					<view class="video-time">
						<view style="margin-top:4px;font-size:12px;">
							<text>购买时间</text>
							<text style="float:right;">{{utils.timeTodate('Y-m-d H:i',v.add_time)}}</text>
						</view>
					</view>
				</view>
			</view>

			<view style="width:100%;margin-top:200px;text-align:center;" v-if="isShowTig">
				<image src="/static/empty.png" style="width:100px;height:100px;"></image>
				<view style="width:100%;font-size:25upx;color:#999;margin-top:30upx;">暂无热点购买记录</view>
			</view>
			<view class="moreTig" v-if="isMoreTig">——— 我是有底线的 ———</view>
		</view>

	</view>
</template>

<script>
	import api from "@/common/api.js";
	import utils from '@/components/shoyu-date/utils.filter.js';
	import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue'
	var _self;
	export default {
		components: {
			easyLoadimage
		},
		data() {
			return {
				bgHeight: 111,
				userId: 0,
				page: 1,
				logList: [],
				isShowTig: false,
				isMoreTig: false,
				more: false,
				tab: 1,
				utils: utils,
				isShowDel: true,
				scrollTop: 0,
			}
		},
		onLoad() {
			_self = this;
			_self._showLoading('加载中...');
			var mobile = uni.getSystemInfoSync();
			// 是否登录
			const info = api.getLogins();
			if (info === false) {
				return api.jumpUrl('/pages/login/login', 'newx');
			} else {
				_self.userId = info.userId;
				_self.getWatch();
			}
		},
		methods: {
			// 跳转播放页
			playVideo(e) {
				return api.jumpUrl('/pages/svod/player?info=' + JSON.stringify(e), 'new');
			},
			// 获取我的足迹
			getWatch() {
				uni.request({
					url: api.apiData.getSvodBuyLog,
					method: 'POST',
					data: {
						uid: _self.userId,
						page: _self.page,
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var d = e.data;
						if (d.Code == 201) return _self.back(d.Msg);
						var logList = d.Data.list;
						if (!_self.more) _self.logList = [];
						if (logList.length) {
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
			back(m) {
				api.showToast(m);
				return api.jumpUrl('/pages/member/member', 'tab');
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
		// 滚动监听事件
		onPageScroll({
			scrollTop
		}) {
			_self.scrollTop = scrollTop;
		},
		onBackPress(e) {
			api.jumpUrl('/pages/member/member', 'tab');
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
		height: 33px;
		line-height: 33px;
	}

	.video-info view {
		width: 100%;
		float: left;
		color: #999;
	}

	.cover {
		width: 100%;
		height: 100%;
		border-radius: 10px;
		box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.5);
	}

	.cover>>>.origin-img {
		border-radius: 10px;
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