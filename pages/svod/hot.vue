<template>
	<view class="video-list">
		<css-loading ref="cssLoading"></css-loading>
		<view class="video-item" v-for="(b, i) in list" :key="i"
			@click="api.jumpUrl('/pages/svod/player?info='+JSON.stringify(b), 'new')">
			<image class="is-vip" src="/static/play/ico_vip.png" v-if="b.gold>0"></image>
			<image class="is-vip" src="/static/play/ico_free.png" v-else></image>
			<easy-loadimage mode="aspectFill" :scroll-top="scrollTop" :image-src="b.cover" :open-transition="true"
				class="cover">
			</easy-loadimage>
			<view class="video-extra">
				<text class="title">{{b.title}}</text>
				<view class="icos">
					<view class="ico-item">
						<image src="/static/imgs/ico_collect.png"></image>
						<text>{{convertNumer(b.good)}}</text>
					</view>
					<view class="ico-item">
						<image src="/static/imgs/ico_play.png"></image>
						<text>{{convertNumer(b.click)}}</text>
					</view>
					<view class="ico-item" v-if="b.gold>0">
						<image src="/static/imgs/ico_gold.png"></image>
						<text>{{b.gold}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="more">
			<image v-if="more" class="load-img" src="/static/loading/load0.gif" mode="aspectFill"></image>
			<text v-if="notData">——— 我是有底线的 ———</text>
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
				scrollTop: 0,
				notData: false,
				more: false,
				loading: true,
				api: api,
				type: 'hot',
				typeList: {
					gold: '金币专区',
					good: '点赞最多',
					click: '播放最多',
					"new": '最新上传',
					tag: '标签最多',
					free: '免费专区',
					hot: '短视频热门'
				}
			}
		},
		onLoad(e) {
			_self = this;
			_self._showLoading()
			if (e && e.type && _self.typeList[e.type]) {
				_self.type = e.type
			}
			uni.setNavigationBarTitle({
				title: _self.typeList[_self.type]
			})
			_self.$nextTick(() => {
				_self.getVideo();
			})
		},
		methods: {
			convertNumer(str)
			{
				let num = parseFloat(str)
				if(num > 10000) return (num/10000).toFixed(2) + '万'
				return num
			},
			getVideo() {
				uni.request({
					url: api.apiData.getSvodHotData + '/page/' + _self.page + '/count/12/sort/' + _self.type,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (r) => {
						let d = r.data;
						if (d.length) {
							_self.list = _self.list.concat(d);
							_self.notData = false;
						} else {
							_self.notData = true;
						}
						let timer = setTimeout(() => {
							_self.loading = false;
							_self._hideLoading()
							clearTimeout(timer);
						}, 500);
					},
					fail: () => {
						// 加载失败提示
						_self.showTip('服务器连接失败，请检查网络是否正常');
					},
					complete: () => {
						_self.more = false;
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
		},
		onReachBottom() {
			if (_self.notData) return;
			_self.page++;
			_self.more = true;
			_self.getVideo();
		},
		onPageScroll({
			scrollTop
		}) {
			_self.scrollTop = scrollTop;
		}
	};
</script>

<style>
	@import url('@/components/loading/loading.css');

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

	.is-vip {
		width: 32px;
		height: 16px;
		position: absolute;
		margin-bottom: -16px;
		z-index: 1;
	}

	.video-bottom {
		width: 50%;
		height: 30px;
		background-color: #272733;
		border-radius: 30px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin: 15px auto 20px;
	}

	.video-extra {
		position: absolute;
		background-color: rgba(0, 0, 0, 0.2);
		color: #fff;
		font-size: 12px;
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		padding: 3upx 10upx;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}
	.video-extra .title{
		height: 32upx;
		line-height: 28upx;
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.video-extra .icos{
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.video-extra .ico-item{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.video-extra .ico-item image{
		height: 20upx;
		width: 22upx;
		margin-right: 4upx;
	}
	.video-extra .ico-item:nth-child(2){
		flex: 1;
		justify-content: flex-start;
		margin: 0 16upx;
	}

	.video-item .cover {
		width: 100%;
		height: 210px;
		border-radius: 8px;
	}

	.cover>>>.origin-img {
		border-radius: 8px;
	}

	.video-list .video-item {
		display: inline-block;
		width: 48%;
		position: relative;
		margin-bottom: 12px;
		border-radius: 8px;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.video-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 15px 30rpx;
	}
</style>