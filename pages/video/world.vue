<template>
	<view class="video-list">
		<css-loading ref="cssLoading"></css-loading>
		<view class="banner">
			<image src="/static/imgs/world_banner.jpg"></image>
		</view>
		<view class="datetime">
			<text>更新于:{{datetime}}</text>
		</view>
		<view class="world-list">
			<view class="world-item" v-for="(e, h) in list" :key="h" @click="playVideo(e.id)">
				<view class="world-item-index" :class="{top:h<3}">
					<text>{{h+1}}.</text>
				</view>
				<view class="world-item-title">
					<text>{{e.title}}</text>
				</view>
				<view class="world-item-hot">
					<uni-icons type="fire" color="#aba9cb" size="16"></uni-icons>
					<text class="num">{{convertNumer(e.search_num)}}</text>
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
				datetime: '....',
				list: [],
				loading: true
			}
		},
		onLoad() {
			_self = this;
			_self._showLoading()
			uni.getStorage({
				key: 'mobileDid_' + api.appkey,
				success: res => {
					// 从缓存中拉取
					_self.did = res.data;
					//console.log(_self.did)
				},
				complete: () => {
					_self.getWorld();
				}
			});
		},
		methods: {
			convertNumer(str) {
				let num = parseFloat(str)
				if (num > 10000) return (num / 10000).toFixed(2) + '万'
				return num
			},
			playVideo(vid) {
				uni.setStorage({
					key: 'vid',
					data: vid,
					success: () => {
						var param = {
							url: '/pages/video/class',
							t: 'tab'
						}
						api.jumpUrl('/pages/video/play?type=' + JSON.stringify(param), 'new');
					},
					fail: () => {
						api.showToast('播放失败，请检查网络是否正常');
					}
				});
			},
			getWorld() {
				uni.request({
					url: api.apiData.getWorldSearch,
					method: 'POST',
					data: {
						did: _self.did
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (r) => {
						_self.list = r.data.Data.list;
						_self.datetime = r.data.Data.time;
						let timer = setTimeout(() => {
							_self.loading = false;
							_self._hideLoading()
							clearTimeout(timer);
						}, 500);
					},
					fail: () => {
						_self._hideLoading()
						_self.showTip('服务器连接失败，请检查网络是否正常');
					}
				});
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
	.video-list {
		background-color: #0f011b;
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

	.datetime {
		width: 100%;
		height: 60upx;
		box-sizing: border-box;
		padding: 0 35upx;
		font-size: 12px;
		color: #444;
	}

	.world-list {
		padding: 0 35upx;
		font-size: 16px;
		box-sizing: border-box;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.world-item {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-bottom: 10upx;
	}

	.world-item-index {
		width: 40upx;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		color: #aba9cb;
		font-weight: bold;
	}

	.world-item-hot {
		font-size: 13px;
		color: #909090;
	}

	.world-item-hot>.num {
		margin-left: 10upx;
	}

	.world-item-title {
		font-size: 14px;
		line-height: 36upx;
		height: 80upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		color: #909090;
		margin: 0 20upx;
		flex: 1;
		font-weight: bold;
	}
	.world-item-title text{
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		max-height: 72upx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.top {
		color: #be975f !important;
	}
</style>