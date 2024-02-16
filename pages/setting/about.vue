<template>
	<view>
		<view class="about-head">
			<view class="about-logo">
				<image :src="logoImage" mode="aspectFit"></image>
			</view>
			<view class="about-name">{{appName}}</view>
			<view class="about-vers">{{appVersion}}</view>
			<view class="about-info">{{appInfo.appInfo}}</view>
		</view>
		<view class="about-content" v-if="appInfo.videoEmail">
			<view class="about-content-left">
				<view>视频合作邮箱</view>
				<view class="about-email">{{appInfo.videoEmail}}</view>
			</view>
			<view class="about-content-right" @click="setCopy(appInfo.videoEmail)">复制</view>
		</view>
		<view class="about-content" v-if="appInfo.adEmail">
			<view class="about-content-left">
				<view>广告投放邮箱</view>
				<view class="about-email">{{appInfo.adEmail}}</view>
			</view>
			<view class="about-content-right" @click="setCopy(appInfo.adEmail)">复制</view>
		</view>
		<view class="about-content" v-if="appInfo.qq">
			<view class="about-content-left">
				<view>商务合作Telegram</view>
				<view class="about-email">{{appInfo.qq}}</view>
			</view>
			<view class="about-content-right" @click="setCopy(appInfo.qq)">复制</view>
		</view>
		<view class="about-content" v-if="appInfo.wx">
			<view class="about-content-left">
				<view>官方开车群</view>
				<view class="about-email">{{appInfo.wx}}</view>
			</view>
			<view class="about-content-right" @click="setCopy(appInfo.wx)">复制</view>
		</view>
		<view style="height:70upx;"></view>
		<css-loading ref="cssLoading"></css-loading>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	var _self;
	export default {
		data() {
			return {
				appName: '已是最新版',
				appInfo: {},
				appVersion: '3.0.202011',
				logoImage: '../../static/logo.png',
			}
		},
		onLoad() {
			_self = this;
			_self._showLoading('加载中...');
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, (e) => {
				//console.log(e)
				_self.appName = e.name;
				_self.appVersion = e.version;
			});
			// #endif
			var imgUrl = uni.getStorageSync('app_logo_' + api.appkey);
			if (imgUrl) _self.logoImage = imgUrl;
			_self.getAbout();
		},
		methods: {
			getAbout() {
				uni.request({
					url: api.apiData.getAbout,
					method: 'GET',
					success: (e) => {
						_self.appInfo = e.data.Data;
						_self._hideLoading();
					},
					fail: () => {
						// 加载失败提示
						_self.msgData('服务器连接失败，请检查网络是否正常', 5000);
					}
				});
			},
			setCopy(str) {
				api.copy(str);
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
		// 下拉刷新
		onPullDownRefresh() {
			_self.getAbout();
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
	.about-head {
		width: 100%;
		//background-image: linear-gradient(to right, #FF8F00, #da871d);
		background-color: #1D1D28;
		padding: 20% 0 20px;
		margin-bottom: 30px;
		box-shadow: 0px 4px 6px 0px rgba(103, 103, 103, 0.1);
	}

	.about-content {
		width: 90%;
		margin: 20px 5%;
	}

	.about-content-left {
		display: inline-block;
		font-size: 15px;
		color: #AFAFB4;
	}

	.about-email {
		color: #777;
		font-size: 12px;
	}

	.about-content-right {
		display: inline-block;
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		font-size: 13px;
		float: right;
		height: 30px;
		line-height: 30px;
		width: 60px;
		text-align: center;
		margin-top: 3px;
		border-radius: 3px;
		color: #fff;
	}

	.about-logo {
		text-align: center;
	}

	.about-logo image {
		height: 70px;
		border-radius: 20upx;
	}

	.about-name {
		width: 100%;
		height: 30px;
		line-height: 40px;
		text-align: center;
		color: #FFFFFF;
		font-size: 18px;
	}

	.about-vers {
		width: 100%;
		font-size: 12px;
		text-align: center;
		height: 30px;
		color: #F9F9F9;
	}

	.about-info {
		width: 80%;
		padding: 0 10%;
		color: #F9F9F9;
		font-size: 13px;
		line-height: 45upx;
	}
</style>