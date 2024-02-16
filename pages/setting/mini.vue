<template>
	<view class="mini">
		<css-loading ref="cssLoading"></css-loading>
		<view class="head-banner">
			<swiper class="swiper" circular interval="3000" :autoplay="true" :indicator-dots="true"
				indicator-color="rgba(255,255,255,0.4)" indicator-active-color="rgba(255,255,255,0.8)">
				<swiper-item class="item" v-for="(b, i) in banners" :key="i" @click="api.jumpUrl(b.url, 'web')">
					<image :src="b.images_url" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="adList">
			<view class="adList-title">
				<text>APP应用列表</text>
			</view>
			<view class="gridList">
				<view class="gridList-item" v-for="(ad,index) in gridList" :key="index">
					<view class="girdList-item-box">
						<view @click="api.jumpUrl(ad.url, 'web')" class="girdList-item-content">
							<view class="girdList-item-content-image">
								<image :src="ad.content"></image>
							</view>
							<text>{{ad.title}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="adList-item" v-for="(ad,index) in miniList" :key="index">
				<image :src="ad.content"></image>
				<view class="adList-item-content">
					<text class="title">{{ad.title}}</text>
					<text class="look">观看次数: {{ad.times}} </text>
					<text class="description">{{ad.intro}} </text>
				</view>
				<view class="adList-item-extra">
					<text @click="api.jumpUrl(ad.url, 'web')">前往</text>
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
				banners: [],
				miniList: [],
				gridList: [],
				api: api
			}
		},
		onLoad() {
			_self = this;
			_self._showLoading()
			this.$nextTick(() => {
				this.getData()
			})
		},
		methods: {
			getData() {
				uni.request({
					url: api.apiData.getAdMini,
					success: (e) => {
						let d = e.data;
						_self._hideLoading()
						if (d.Code == 201) return api.showToast(d.Msg, 2000);
						// 首页数据
						_self.banners = e.data.Data.banner;
						_self.miniList = e.data.Data.mini;
						_self.gridList = e.data.Data.grid;
					},
					fail: () => {
						_self._hideLoading()
						api.showToast('服务器连接失败，请检查网络是否正常');
					}
				});
			}
		}
	}
</script>

<style scoped>
	.mini {
		width: 100%;
		box-sizing: border-box;
		padding: 20upx 30upx;
		display: flex;
		flex-direction: column;
	}

	.head-banner image {
		width: 100%;
		height: 100%;
	}

	.head-banner .swiper {
		width: 100%;
		height: 180px;
		overflow: hidden;
		border-radius: 10px;
		/* #ifdef H5 */
		position: relative;
		transform: rotate(0deg);
		/* #endif */
	}

	.head-banner {
		padding: 20upx 0;
	}

	.adList {
		margin-top: 40upx;
		color: #FFF;
		display: flex;
		flex-direction: column;
		font-size: 12px;
	}

	.adList-title {
		font-size: 16px;
		width: 100%;
		margin-bottom: 30upx;
	}

	.adList-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 120upx;
		width: 100%;
		margin: 10upx 0;
	}

	.adList-item image {
		width: 120upx;
		height: 120upx;
		margin-right: 20upx;
		border-radius: 10upx;
	}

	.adList-item-content {
		height: 100%;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
	}

	.title {
		font-size: 16px;
		height: 50upx;
		line-height: 40upx;
		font-weight: bolder;
	}

	.look {
		height: 35upx;
	}

	.description {
		height: 35upx;
		overflow: hidden;
	}

	.adList-item-extra {
		width: 100upx;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.adList-item-extra text {
		color: #FFF;
		background-color: #9c00ce;
		height: 40upx;
		font-size: 13px;
		padding: 6upx 24upx;
		display: flex;
		border-radius: 26upx;
	}

	.gridList {
		width: 100%;
		margin-bottom: 20upx;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.gridList-item {
		width: 25%;
		padding: 10upx;
		position: relative;
		box-sizing: border-box;
	}

	.girdList-item-box {
		width: 100%;
		height: 0;
		padding-bottom: calc(100% + 50upx);
		position: relative;
	}

	.girdList-item-content {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.girdList-item-content-image {
		width: 100%;
		height: 0;
		padding-bottom: 100%;
		position: relative;
	}

	.girdList-item-content-image image {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		border-radius: 10upx;
		//background-color: #CCC;
	}

	.girdList-item-content text {
		width: 100%;
		margin-top: 10upx;
		text-align: center;
		font-size: 12px;
		height: 80upx;
		line-height: 40upx;
		overflow: hidden;
	}
</style>