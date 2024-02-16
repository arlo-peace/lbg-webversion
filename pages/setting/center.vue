<template>
	<view class="center" :style="{height:(phone.windowHeight + 50) + 'px'}">
		<view class="header">
			<text>享用官方创作者特权</text>
		</view>
		<view class="cards">
			<view class="card-item">
				<image src="/static/other/chuangz-1.png"></image>
				<text class="title">千万平台网红</text>
				<text class="description">视频你来发，平台帮你赚钱，月薪平均1W+</text>
			</view>
			<view class="card-item">
				<image src="/static/other/chuangz-2.png"></image>
				<text class="title">全链路流量池</text>
				<text class="description">平台旗下多款主流产品曝光机会，收益翻倍涨</text>
			</view>
			<view class="card-item">
				<image src="/static/other/chuangz-3.png"></image>
				<text class="title">{{config.site_title}}创作班</text>
				<text class="description">一部手机即可开始创作{{config.site_title}}全程辅导</text>
			</view>
			<view class="card-item">
				<image src="/static/other/chuangz-4.png"></image>
				<text class="title">无限盈利空间</text>
				<text class="description">平均一部剪辑过几分钟的短视频，就可以变现几百元</text>
			</view>
		</view>
		<view class="header-up">
			<text class="title">UP主收入排行</text>
			<view class="description">
				<text>上周打赏收入</text>
				<text style="color:#ff6f00">10万+</text>
				<text>提现排行榜</text>
			</view>
		</view>
		<view class="items">
			<view class="item" v-for="(item,index) in list" :key="index">
				<view class="avatar">
					<image :src="item.cover"></image>
					<image class="icon" src="/static/other/tag.png"></image>
				</view>
				<text class="title">{{item.nickname.substring(0,4)}}</text>
			</view>
		</view>
		<view class="display">
			<text class="title">马上成为{{config.site_title}}创作者</text>
			<text class="description">比小视频更高的曝光量和更丰厚的红利，我们期待您的加入。</text>
		</view>
		<view class="button">
			<text @click="apply">申请成为创作者</text>
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
				list: [],
				config: {}

			}
		},
		onLoad() {
			_self = this;
			_self.phone = uni.getSystemInfoSync();
			this.$nextTick(() => {
				this.getData()
			})
		},
		methods: {
			apply() {
				uni.navigateTo({
					url: "/pages/member/apply"
				})
			},
			getData() {
				uni.request({
					url: api.apiData.getUPtop,
					success: (e) => {
						let d = e.data;
						if (d.Code == 201) return api.showToast(d.Msg, 2000);
						// 首页数据
						_self.list = e.data.Data;
						_self.config = e.data.Config
					},
					fail: () => {
						api.showToast('服务器连接失败，请检查网络是否正常');
					}
				});
			}
		}
	}
</script>

<style scoped>
	.center {
		padding: 20upx 30upx;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.header {
		width: 100%;
		height: 100upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		font-weight: bold;
		color: #FFF;
	}

	.cards {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20upx;
	}

	.card-item {
		width: 47%;
		margin-bottom: 30upx;
		background-color: #404040;
		border-radius: 20upx;
		padding: 30upx 15upx 60upx 15upx;
		box-sizing: border-box;
		color: #FFF;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.card-item image {
		width: 100upx;
		height: 100upx;
		margin-bottom: 10upx;
	}

	.card-item .title {
		font-size: 16px;
		height: 60upx;
		margin-bottom: 20upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.card-item .description {
		font-size: 12px;
		height: 70upx;
		line-height: 38upx;
		overflow: hidden;
		color:#999999;
	}

	.header-up {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		color: #FFF;
	}

	.header-up .title {
		font-size: 16px;
		height: 60upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.header-up .description {
		font-size: 13px;
		height: 60upx;
		line-height: 56upx;
	}

	.items {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-direction: row;
	}

	.items .item {
		width: 19%;
		margin-right: 1%;
		height: 100%;
	}

	.items .item .avatar {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.items .item .avatar image {
		width: 100upx;
		height: 100upx;
		background: #EEE;
		border-radius: 50%;
	}

	.items .item .avatar .icon {
		position: absolute;
		width: 40upx;
		height: 40upx;
		margin-left: 75upx;
		margin-top: 50upx;
	}

	.items .item .title {
		height: 40upx;
		color: #FFF;
		font-size: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	.display {
		width: 100%;
		height: 240upx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.display .title {
		width: 100%;
		height: 60upx;
		font-size: 16px;
		color: #FFF;
	}

	.display .description {
		height: 40upx;
		width: 100%;
		font-size: 12px;
		color: #999999;
	}

	.button {
		width: 100%;
		height: 80upx;
	}

	.button text {
		background-image: linear-gradient(to right, #f99a46, #fa8d38, #fb7e2c, #fc6e21, #fd5c18);
		color: #FFF;
		font-size: 15px;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: row;
		border-radius: 40upx;
	}
</style>