<template>
	<view class="content">
		<view class="head-top" :style="{'top':(top - h5H)+'px'}">
			<view class="head-left" @click="backUrl">
				<image src="/static/imgs/back.png" mode="aspectFill"></image>
			</view>
			<text style="flex: 1;">短视频关注</text>
			<view class="head-left"></view>
		</view>
		<view style="width:100%;margin-top:500upx;text-align:center;" v-if="isShowTig">
			<image src="/static/empty.png" style="width:100px;height:100px;"></image>
			<view style="width:100%;font-size:25upx;color:#999;margin-top:30upx;">当前页面暂无内容</view>
		</view>
		<view class="svod-list" v-else :style="{'margin-top':top+'px'}">
			<div class="svod-info" v-for="(s, i) in svodList" :key="i">
				<image @click="goSvod(s.uid)" class="svod-img" :src="s.headimgurl" mode="aspectFill"></image>
				<div @click="goSvod(s.uid)" class="svod-title">
					{{s.nickname}}
				</div>
				<image @click="focusSvod(s.uid)" :src="`/static/production/guanzhu002.png`" class="svod-focus"></image>
			</div>
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
				svodList: [],
				isShowTig: false,
				h5H: 43,
				hasLoad: false
			}
		},
		onLoad() {
			_self = this;
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
				_self.hasLoad = true
			}
		},
		onShow() {
			if (this.hasLoad) {
				_self.getSvod()
			}
		},
		methods: {
			backUrl() {
				api.jumpUrl('/pages/member/member', 'tab');
			},
			// 收藏列表 
			getSvod() {
				_self._showLoading('加载中...');
				uni.request({
					url: api.apiData.shortVideo,
					method: 'POST',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						userId: _self.userId,
					},
					success: (e) => {
						_self.svodList = e.data.Data;
						if (_self.svodList.length) {
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
			focusSvod(svodId) {
				uni.request({
					url: api.apiData.shortVideoFocus,
					method: 'POST',
					data: {
						userId: _self.userId,
						shortId: svodId
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					success: (res) => {
						if (res.data.Code == 200) {
							api.showToast('取消关注成功');
							_self.getSvod()
						} else {
							api.showToast(res.data.Msg);
						}
					},
					fail: (err) => {
						api.showToast('关注失败');
					}
				});
			},
			goSvod(svodId) {
				var param = {
					url: '/pages/member/svod',
					t: 'new'
				}
				api.jumpUrl('/pages/svod/home?uid=' + svodId + '&type=' + JSON.stringify(param), 'new');
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
		},
		onBackPress(e) {
			api.jumpUrl('/pages/member/member', 'tab');
			return true;
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

	.svod-list {
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.svod-info {
		width: 33.333%;
		height: 220upx;
		margin-bottom: 25upx;
		padding: 0 20upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.svod-img {
		border-radius: 70px;
		height: 160upx;
		width: 160upx;
		border: #999 2px solid;
		margin-bottom: 10upx;
	}

	.svod-title {
		font-size: 13px;
		color: #999999;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 150upx;
		text-align: center;
	}

	.svod-focus {
		width: 40upx;
		height: 40upx;
		position: absolute;
		top: 130upx;
		right: 40upx;
		z-index: 1;
	}
</style>