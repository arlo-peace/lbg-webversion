<template>
	<view class="video-list">
		<css-loading ref="cssLoading"></css-loading>
		<view class="banner">
			<image src="/static/imgs/world_banner.jpg"></image>
		</view>
		<view class="tabs" :class="{tabRight:type == 'good',tabMiddle:type == 'click'}">
			<view class="tabs-item" @click="changeType('good')" :class="{active:type == 'good'}">
				<text>点赞大神</text>
			</view>
			<view class="tabs-item" @click="changeType('click')" :class="{active:type == 'click'}">
				<text>热播大神</text>
			</view>
			<view class="tabs-item" @click="changeType('rich')" :class="{active:type == 'rich'}">
				<text>创收大神</text>
			</view>
		</view>
		<view class="topList">
			<view class="top-item" v-for="(item,index) in list" :key="index">
				<view class="top-item-index">
					<text>{{index + 1}}</text>
				</view>
				<view class="top-item-content">
					<view @click="goHome(item.id)" class="top-item-content-avatar">
						<image :src="item.cover"></image>
					</view>
					<view class="top-item-content-text">
						<text class="title">{{item.nickname}}</text>
						<text v-if="type == 'good'">收获点赞数量: {{(item.good / 10000).toFixed(2)}}万</text>
						<text v-if="type == 'click'">视频播放次数: {{(item.click / 10000).toFixed(2)}}万</text>
						<text v-if="type == 'rich'">付费播放销量: {{(item.buy_num / 10000).toFixed(2)}}万</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import api from "@/common/api.js";
	var _self;
	export default {
		data() {
			return {
				page: 1,
				list: [],
				loading: true,
				api: api,
				type: 'good',
				typeList: [
					'good',
					'click',
					'rich'
				]
			}
		},
		onLoad(e) {
			_self = this;
			_self._showLoading()
			if (e.type && _self.typeList.indexOf(e.type) > -1) {
				_self.type = e.type
			}
			_self.getVideo();
		},
		methods: {
			changeType(type) {
				_self.type = type
				_self.list = []
				_self._showLoading("加载中....")
				_self.getVideo()
			},
			getVideo() {
				uni.request({
					url: api.apiData.getSvodTopData + '/type/' + _self.type,
					method: 'GET',
					success: (r) => {
						_self.list = r.data;
						let timer = setTimeout(() => {
							_self.loading = false;
							_self._hideLoading()
							clearTimeout(timer);
						}, 500);
					},
					fail: () => {
						// 加载失败提示
						_self.showTip('服务器连接失败，请检查网络是否正常');
					}
				});
			},
			goHome(uid) {
				if (uid == 0) {
					api.showToast('模拟数据，请重启APP', 2000);
					return
				}
				var param = {
					url: '/pages/svod/class',
					t: 'new'
				}
				api.jumpUrl('/pages/svod/home?type=' + JSON.stringify(param) + '&uid=' + uid, 'new');
			},
			showTip(m) {
				api.showToast(m);
				let timer = setTimeout(() => {
					uni.navigateBack();
					clearTimeout(timer);
				}, 1000);
			}
		}
	};
</script>

<style scoped>
	@import url('@/components/loading/loading.css');
	.video-list{
		background-image: linear-gradient(to right top, #0d0627, #0e0524, #0f0322, #0f021f, #0f011d, #10011d, #12011c, #13011c, #16021e, #19021f, #1b0321, #1e0322);
	}
	.more .load-img {
		width: 80rpx;
		height: 80rpx;
	}

	.more {
		display: flex;
		justify-content: center;
		width: 100%;
		color: #999;
		font-size: 12px;
		margin: 10px 0;
	}

	.banner {
		width: 100%;
		height: 0;
		padding-bottom: 50%;
		position: relative;
		margin-bottom: 40upx;
	}

	.banner image {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

	.tabs {
		width: calc(100% - 60upx);
		height: 64upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-top: -10upx;
		margin-bottom: 30upx;
		margin-left: 30upx;
		padding: 2upx;
		background-color: #1a0839;
		border-radius: 32upx;
		box-sizing: border-box;
		background-image: linear-gradient(to left, #a00f78, #1a0839 35%, #1a0839);
	}

	.tabs.tabRight {
		background-image: linear-gradient(to right, #a00f78, #1a0839 35%, #1a0839);
	}

	.tabs.tabMiddle {
		background-image: linear-gradient(to left, #1a0839, #1a0839 35%, #a00f78, #1a0839 65%, #1a0839);
	}

	.tabs-item {
		width: 33.3%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: #1a0839;
		color: #76748a;
		font-size: 14px;
		border-radius: 30upx;
	}

	.tabs-item:first-child {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.tabs-item:last-child {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	.tabs-item:nth-child(2) {
		border-radius: 0;
	}

	.tabs-item.active {
		background: #40007a;
		color: #FFFFFF;
		font-weight: 600;
	}
	.topList{
		width: 100%;
		padding: 10upx 20upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		padding-left: 50upx;
	}
	.top-item{
		width: 100%;
		height: 100upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-bottom: 20upx;
	}
	.top-item-index{
		width: 60upx;
		height: 60upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-right: 20upx;
		color: #73728a;
		font-weight: bold;
		font-style: italic;
	}
	.top-item:nth-child(1) .top-item-index,
	.top-item:nth-child(2) .top-item-index,
	.top-item:nth-child(3) .top-item-index{
		font-style: normal;
		color: #c04c19;
		background: url(@/static/member/user_svip.png) center center no-repeat;
		background-size: 100% 100%;
	}
	.top-item:nth-child(1) .top-item-index text,
	.top-item:nth-child(2) .top-item-index text,
	.top-item:nth-child(3) .top-item-index text{
		margin-top: 16upx;
		font-size: 14px;
	}
	.top-item-content{
		flex: 1;
		height: 80upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.top-item-content-avatar{
		width: 90upx;
		height: 90upx;
		border-radius: 45upx;
		overflow: hidden;
	}
	.top-item-content-avatar image{
		width: 100%;
		height: 100%;
	}
	
	.top-item-content-text{
		flex: 1;
		box-sizing: border-box;
		padding: 4upx 20upx;
		font-size: 13px;
		color: #FFFFFF;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
	}
	.top-item-content-text .title{
		font-size: 15px;
		font-weight: bold;
		margin-bottom: 5upx;
		margin-top: -5upx;
	}
</style>