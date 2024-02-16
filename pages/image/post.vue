<template>

	<view class="class-list">

		<view class="class-item">
			<view class="class-name">
				<text>发布条件</text>
			</view>
			<view class="class-content">
				<text>{{config.svod_post_need}}</text>
			</view>
		</view>
		<view class="class-item">
			<view class="class-name">
				<text>发布方式</text>
			</view>
			<view class="class-content">
				<text>{{config.svod_post_method}}</text>
			</view>
		</view>
		<view class="btn-list">
			<view class="btn-item" @click="api.jumpUrl(config.svod_post_email,'outer')">
				<image src="/static/imgs/email.png"></image>
				<text>客服邮箱</text>
			</view>
			<view class="btn-item" @click="api.jumpUrl(config.svod_post_wechat,'outer')">
				<image src="/static/imgs/wechat.png"></image>
				<text>客服TG号</text>
			</view>
			<view class="btn-item" @click="api.jumpUrl(config.svod_post_qq,'outer')">
				<image src="/static/imgs/qq.png"></image>
				<text>客服土豆号</text>
			</view>
		</view>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	export default {
		data() {
			return {
				api: api,
				config: {
					svod_post_email: '',
					svod_post_wechat: '',
					svod_post_qq: '',
					svod_post_need: '',
					svod_post_method: '',
				}
			}
		},
		onLoad() {
			this.getConfig();
		},
		methods: {
			getConfig() {
				uni.request({
					url: api.apiData.getPictureConfig,
					method: 'GET',
					success: (e) => {
						var r = e.data;
						if (r.Code == 200) {
							this.config = r.Data;
						} else {
							api.showToast(r.Msg, 2000);
						}
					},
					fail: () => {
						api.showToast("服务器连接失败，请检查网络是否正常", 3000);
					}
				});
			}
		}
	}
</script>

<style scoped>
	.class-name {
		height: 20px;
		line-height: 20px;
		border-left: 6px solid #FF8F00;
		border-radius: 3px;
		font-size: 15px;
		color: #FFFFFF;
		padding-left: 10px;
		position: relative;
		font-weight: bold;
	}

	.class-name:before {
		background-color: #ff533c;
		background-image: linear-gradient(to bottom, #ff533c, #FF8F00);
		width: 6px;
		border-top-left-radius: 3px;
		position: absolute;
		content: "";
		left: -6px;
		top: 0;
		height: 12px;
	}

	.class-item {
		margin-bottom: 40upx;
		margin-top: 20upx;
	}

	.class-list {
		padding: 10upx 40upx;
		margin-top: 15px;
		width: 100%;
		box-sizing: border-box;
	}

	.class-content {
		background: #404040;
		padding: 20upx 30upx;
		font-size: 16px;
		color: #FFF;
		line-height: 40upx;
		border-radius: 20upx;
		width: 100%;
		box-sizing: border-box;
		height: 160upx;
		margin: 20upx 0;
	}

	.btn-list {
		width: 100%;
		margin-top: 30upx 0 20upx;
		padding: 0 20upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.btn-item {
		width: 30%;
		margin-right: 5%;
		height: 200upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.btn-item:last-child {
		margin-right: 0;
	}

	.btn-item image {
		width: 100upx;
		height: 100upx;
		margin-bottom: 20upx;
	}

	.btn-item text {
		font-size: 16px;
		color: #FFF;
		font-weight: bold;
	}
</style>