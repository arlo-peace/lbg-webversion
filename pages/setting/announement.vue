<template>
	<view>
		<view class="announement-head">
			<view class="announement-logo">
				<image :src="logoImage" mode="aspectFit"></image>
			</view>
			<view class="announement-name" v-if="download_url">
				<text @click="goWeb">进入官网</text>
			</view>
		</view>
		<view class="announement-content" v-if="announement.id > 0">
			<u-parse class="announement-text" :content="announement.content" @navigate="navigate"></u-parse>
			<text>更新日期: {{announement.add_time}}</text>
		</view>
		<view style="height:70upx;"></view>
		<css-loading ref="cssLoading"></css-loading>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	import uParse from '@/components/u-parse/u-parse.vue'
	var _self;
	export default {
		components: {
			uParse
		},
		data() {
			return {
				download_url: null,
				announement: {
					id: 0,
					content: '',
					add_time: ''
				},
				logoImage: '../../static/logo.png',
			}
		},
		onLoad() {
			_self = this;
			_self._showLoading('加载中...');
			var imgUrl = uni.getStorageSync('app_logo_' + api.appkey);
			if (imgUrl) _self.logoImage = imgUrl;
			_self.getAnnounement();
		},
		methods: {
			goWeb() {
				api.jumpUrl(_self.download_url, 'outer')
			},
			getAnnounement() {
				uni.request({
					url: api.apiData.getAnnounement,
					method: 'GET',
					success: (e) => {
						_self.download_url = e.data.Data.url;
						_self.announement = e.data.Data.announement;
						_self._hideLoading();
					},
					fail: () => {
						// 加载失败提示
						_self.msgData('服务器连接失败，请检查网络是否正常', 5000);
					}
				});
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
			},

			navigate(href) {
				api.jumpUrl(href, 'outer')
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			_self.getAnnounement();
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
	.announement-head {
		width: 100%;
		padding: 20% 0 20px;
		margin-bottom: 30px;
	}

	.announement-content {
		width: 90%;
		margin: 20px 5%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #FFF;
		font-size: 14px;
	}

	.announement-text {
		box-sizing: border-box;
		width: 100%;
		background-color: #34333b;
		padding: 30upx;
		border-radius: 30upx;
		margin-bottom: 20upx;
	}
	
	/deep/.announement-text .a{
		color: #aa55ff;
	}


	.announement-logo {
		text-align: center;
	}

	.announement-logo image {
		height: 70px;
		border-radius: 70upx;
		background-color: #34333b;
		width: 70px;
	}

	.announement-name {
		width: 100%;
		height: 30px;
		line-height: 40px;
		text-align: center;
		color: #fd6f6f;
		font-size: 13px;
	}
</style>