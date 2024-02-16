<template>
	<view class="page-box" :style="{height:phone.windowHeight+'px'}">
		<css-loading ref="cssLoading"></css-loading>
		<view class="detail">
			<image src="/static/other/bg.png" class="detail-bg"></image>
			<view class="content">
				<view class="top">
					<view @click="goBack">
						<uni-icons type="back" size="16" color="#FFF"></uni-icons>
					</view>
					<view class="title">
						<text>会员权益详情</text>
					</view>
					<view></view>
				</view>
				<view class="header">
					<view class="header-title">
						<image src="/static/other/svip.png"></image>
					</view>
					<view class="header-subtitle">
						<image src="/static/other/diamond.png"></image>
						<text>承包你一年的权益</text>
						<image src="/static/other/diamond.png"></image>
					</view>
				</view>
				<view class="footer">
					<view class="footer-title">
						<image src="/static/other/line.png"></image>
						<text>超级会员权益</text>
						<image src="/static/other/line.png"></image>
					</view>
					<view class="footer-subtitle">
						<text>权益价值翻倍</text>
					</view>
					<view class="footer-list">
						<view class="footer-list-item" v-for="(item,index) in list" :key="index">
							<image :src="item.icon"></image>
							<text>{{item.name}}</text>
						</view>
					</view>
					<view class="footer-bottom">
						<view class="footer-button" @click="toRecharge">
							<text>优惠开通</text>
							<text>超多赠送</text>
							<text class="tag">限时</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	let _self;
	export default {
		data() {
			return {
				phone: {},
				list: []
			}
		},
		onLoad() {
			_self = this;
			_self._showLoading()
			_self.phone = uni.getSystemInfoSync();
			_self.$nextTick(()=>{
				_self.getData()
			})
		},
		onShow() {
			// #ifdef APP-PLUS
			plus.navigator.setFullscreen(true);
			// #endif
		},
		methods: {
			getData(){
				uni.request({
					url: api.apiData.getCharge,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var data = e.data.Data;
						_self.list = data.imgs;
					},
					fail: () => {
						// #ifdef APP-PLUS
						plus.navigator.setFullscreen(false);
						// #endif
						_self.back('服务器连接失败，请检查网络是否正常');
					},
					complete() {
						_self._hideLoading()
					}
				});
			},
			toRecharge() {
				// #ifdef APP-PLUS
				plus.navigator.setFullscreen(false);
				// #endif
				uni.navigateTo({
					url: "/pages/recharge/recharge?type=2"
				})
			},
			goBack() {
				// #ifdef APP-PLUS
				plus.navigator.setFullscreen(false);
				// #endif
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped>
	/deep/.status-bar {
		background-color: #000 !important;
	}

	.page-box {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		background-color: #282828;
		padding: 40upx 30upx;
		box-sizing: border-box;
	}

	.detail {
		background-color: #32303a;
		position: relative;
		width: 100%;
		padding-bottom: 178%;
		height: 0;
	}

	.detail-bg {
		width: 100%;
		height: 700px;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
	}

	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		position: absolute;
		z-index: 2;
		top: 0;
		left: 0;
	}

	.top {
		width: 100%;
		height: 90upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.top>view {
		width: 100upx;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		color: #FFF;
		font-size: 16px;
		font-weight: bold;
	}

	.top>view.title {
		flex: 1;
	}

	.header {
		width: 100%;
		height: 280upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		padding: 30upx 60upx;
	}

	.header-title {
		margin-bottom: 30upx;
	}

	.header-title image {
		width: 604upx;
		height: 97upx;
	}

	.header-subtitle {
		background-image: linear-gradient(to right, rgba(231, 179, 148, .01), rgba(231, 179, 148, .15), rgba(231, 179, 148, .01));
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 0 20upx;
	}

	.header-subtitle image {
		width: 32upx;
		height: 32upx;
	}

	.header-subtitle text {
		margin: 0 20upx;
		font-size: 14px;
		color: #f4d8c5;
		letter-spacing: 10upx;
	}

	.footer {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		padding: 30upx 60upx;
		margin-top: 50upx;
	}

	.footer-title {
		font-size: 16px;
		font-weight: bold;
		color: #eab28f;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
		letter-spacing: 10upx;
		margin-bottom: 10upx;
	}

	.footer-title text {
		margin: 0 20upx;
	}

	.footer-title image {
		width: 66upx;
		height: 4upx;
	}

	.footer-subtitle {
		background-color: #eab28f;
		height: 32upx;
		border-radius: 20upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 0 20upx;
		font-size: 11px;
		margin-bottom: 10upx;
	}

	.footer-list {
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: flex-start;
		box-sizing: border-box;
		padding: 30upx;
		margin-top: 40upx;
		max-height: 800upx;
		overflow: hidden;
		overflow-y: auto;
	}

	.footer-list-item {
		width: 25%;
		margin-bottom: 35upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.footer-list-item image {
		width: 120upx;
		height: 120upx;
		box-sizing: border-box;
		border-radius: 50%;
	}

	.footer-list-item text {
		color: #a29996;
		margin-top: -10upx;
		height: 30upx;
		line-height: 30upx;
		font-size: 10px;
		letter-spacing: 2upx;
	}

	.footer-bottom {
		padding: 10upx 20upx;
		box-sizing: border-box;
	}

	.footer-button {
		background-image: linear-gradient(to right, #faeadd, #f5dcca, #f0cfb7, #ecc1a5, #e7b394);
		height: 60upx;
		padding: 0 40upx;
		border-radius: 30upx;
		font-size: 14px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		box-shadow: 0 1upx 2upx rgba(0, 0, 0, .5);
	}

	.footer-button text {
		margin: 0 2upx;
	}

	.footer-button text.tag {
		background-color: #f00;
		color: #FFF;
		font-size: 8px;
		padding: 2upx 10upx;
		height: 24upx;
		line-height: 20upx;
		border-radius: 12upx;
		box-sizing: border-box;
	}
</style>