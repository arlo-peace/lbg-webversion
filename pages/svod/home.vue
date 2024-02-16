<template>
	<view class="content">
		<view class="head-top" :style="{'top':(top - h5H)+'px'}">
			<view class="head-left" @click="backUrl">
				<image src="/static/imgs/back.png" mode="aspectFill"></image>
			</view>
			<text style="flex: 1;">短视频作者主页</text>
			<view class="head-left"></view>
		</view>
		<view class="shortVideo" :style="{marginTop:top+'px'}">
			<view class="shortVideo-avatar">
				<image :src="shortVideo.headimgurl" class="img"></image>
				<image @click="focusSvod"
					:src="`/static/production/${shortVideo.fans ? 'guanzhu002' : 'guanzhu001'}.png`"
					class="shortVideo-focus"></image>
			</view>
			<view class="shortVideo-nickname">
				<text>{{shortVideo.nickname}}</text>
			</view>
		</view>
		<view style="width:100%;margin-top:500upx;text-align:center;" v-if="isShowTig">
			<image src="/static/empty.png" style="width:100px;height:100px;"></image>
			<view style="width:100%;font-size:25upx;color:#999;margin-top:30upx;">当前页面暂无内容</view>
		</view>
		<view class="list" v-else>
			<view class="list-item" v-for="(s, i) in list" :key="i">
				<view class="list-item-box" @click="api.jumpUrl('/pages/svod/player?info='+JSON.stringify(s), 'new')">
					<image class="list-item-cover" :src="s.cover" mode="aspectFill"></image>
					<view class="list-item-title">
						<text>{{s.title}}</text>
					</view>
					<view class="list-item-tag">
						<image class="is-vip" src="/static/play/ico_vip.png" v-if="s.gold>0"></image>
						<image class="is-vip" src="/static/play/ico_free.png" v-else></image>
					</view>
				</view>
			</view>
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
				bg: '',
				top: 27,
				userId: 0,
				shortVideo: {
					nickname: '加载中',
					headimgurl: '',
					fans: false,
					fansSum: 0
				},
				api: api,
				list: [],
				isShowTig: false,
				h5H: 43,
				uri: {
					url: '/pages/index/index',
					t: 'tab'
				},
				uid: 0
			}
		},
		onLoad(e) {
			_self = this;
			_self.uri = JSON.parse(e.type);
			_self.uid = e.uid;
			var mobile = uni.getSystemInfoSync();
			_self.top = mobile.statusBarHeight + 53;
			//console.log(mobile)
			// 是否登录
			var info = api.getLogins();
			if (info === false) {
				_self._showLoading('加载中...');
				_self.skipUrl();
			} else {
				_self.userId = info.userId;
				_self.getSvod();
			}
		},
		methods: {
			focusSvod() {
				uni.request({
					url: api.apiData.shortVideoFocus,
					method: 'POST',
					data: {
						userId: _self.userId,
						shortId: _self.uid
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					success: (res) => {
						if (res.data.Code == 200) {
							_self.shortVideo.fans = !_self.shortVideo.fans
						} else {
							api.showToast(res.data.Msg);
						}
					},
					fail: (err) => {
						api.showToast('关注失败');
					}
				});
			},
			backUrl() {
				uni.navigateBack()
			},
			// 收藏列表 
			getSvod() {
				_self._showLoading('加载中...');
				uni.request({
					url: api.apiData.shortVideoDetail,
					method: 'POST',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						shortId: _self.uid,
						userId: _self.userId,
					},
					success: (e) => {
						_self.shortVideo = e.data.Data.shortVideo;
						_self.list = e.data.Data.list;
						if (_self.list.length) {
							_self.isShowTig = false;
						} else {
							_self.isShowTig = true;
						}
					},
					fail: () => {
						_self.back('服务器连接失败，请检查网络是否正常');
					},
					complete: () => {
						_self._hideLoading();
					}
				});
			},
			// 跳转登录
			skipUrl(url = '/pages/login/login', type = 'newx') {
				api.jumpUrl(url, type);
			},
			back(msg = '') {
				if (msg.length == 0) return;
				api.showToast(msg);
				let timer = setTimeout(() => {
					uni.navigateBack();
					clearTimeout(timer);
				}, 1500);
			}
		}
	}
</script>

<style scoped>
	.head-top {
		width: 100%;
		text-align: center;
		position: fixed;
		color: #FFF;
		z-index: 21;
		display: flex;
		flex-direction: row;
		padding: 0 10upx;
		background-color: #1D1D28;
	}

	.head-left image {
		width: 30px;
		height: 30px;
		margin-top: 1px;
		border-radius: 50%;
		opacity: 0.6;
		filter: alpha(opacity=60);
	}

	.head-left {
		width: 30px;
	}

	.shortVideo {
		height: 300upx;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 20rpx;
	}

	.shortVideo-avatar {
		width: 160upx;
		height: 160upx;
		margin-bottom: 30rpx;
		position: relative;
	}

	.shortVideo-avatar image.img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 2px solid rgba(255, 255, 255, 0.4);
	}

	.shortVideo-focus {

		width: 40upx;
		height: 40upx;
		position: absolute;
		bottom: 0;
		right: 0;
		z-index: 1;
	}

	.shortVideo-nickname {
		color: #FFF;
		font-size: 13px;
		background-color: rgba(255, 255, 255, 0.4);
		padding: 12rpx 24rpx;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
	}

	.list {
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0 2%;
	}

	.list-item {
		width: 49%;
		height: 0;
		padding-bottom: 72%;
		position: relative;
		border-radius: 10px;
		overflow: hidden;
		margin-bottom: 12rpx;
	}

	.list-item-box {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}

	.list-item-cover {
		width: 100%;
		height: 100%;
	}

	.list-item-title {
		width: 100%;
		height: 52rpx;
		position: absolute;
		bottom: 38rpx;
		left: 0;
		background-color: rgba(0, 0, 0, 0.4);
		color: #fff;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		padding: 6rpx 12rpx;
		font-size: 13px;
		line-height: 40rpx;
	}

	.list-item-title text {
		max-width: 100%;
		max-height: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.list-item-tag {
		position: absolute;
		left: 0;
		top: 0;
		width: 32px;
		height: 16px;
		margin-top: -1px;
		z-index: 1;
	}

	.list-item-tag image {
		width: 100%;
		height: 100%;
	}
</style>