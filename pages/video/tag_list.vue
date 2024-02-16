<template>
	<view class="video-list">
		<css-loading ref="cssLoading"></css-loading>
		<view class="tag-list">
			<view class="tag-item" v-for="(t, i) in list" :key="i" @click="urlPlayer(t)">
				<easy-loadimage mode="aspectFill" :scroll-top="scrollTop" :image-src="t.cover" :open-transition="true"
					class="tag-cover">
				</easy-loadimage>
				<text>{{t.name}}</text>
			</view>
		</view>
		<view style="width:100%;margin-top:180px;text-align:center;" v-if="isShowTig">
			<image src="/static/empty.png" style="width:100px;height:100px;"></image>
			<view style="width:100%;font-size:25upx;color:#999;margin-top:30upx;">当前页面暂无内容</view>
		</view>
	</view>
</template>
<script>
	import api from "@/common/api.js";
	var _self;
	export default {
		data() {
			return {
				list: [],
				scrollTop: 0,
				loading: true,
				isShowTig: false,
				api: api,
			}
		},
		onLoad() {
			_self = this;
			_self._showLoading()
			_self.getTag();
		},
		methods: {
			getTag() {
				uni.request({
					url: api.apiData.getTagData + '/tid/0',
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (r) => {
						//console.log(r);
						let d = r.data;
						if (d.Code == 201) return _self.showTip(d.Msg);
						_self.list = d.Data.list;
						_self.isShowTig = _self.list != null && _self.list.length ? false : true;
						let timer = setTimeout(() => {
							_self.loading = false;
							_self._hideLoading()
							clearTimeout(timer);
						}, 500);
					},
					fail: () => {
						_self.showTip('服务器连接失败，请检查网络是否正常')
					}
				});
			},
			urlPlayer(t) {
				uni.setStorageSync('url_' + api.appkey, {
					url: '/pages/video/tag_list',
					t: 'new'
				});
				api.jumpUrl('/pages/video/tag_video?info=' + JSON.stringify(t), 'new');
			},
			showTip(m) {
				api.showToast(m);
				let timer = setTimeout(() => {
					uni.navigateBack();
					clearTimeout(timer);
				}, 1000);
			}
		},
		onBackPress() {
			api.jumpUrl('/pages/video/class', 'tab');
			return true;
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

	.tag-item text {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 140px;
		line-height: 140px;
		border-radius: 8px;
		margin-top: -140px;
		background-color: rgba(0, 0, 0, 0.5);
		text-align: center;
		color: #FFFFFF;
		font-size: 12px;
		font-weight: bold;
	}

	.tag-item .tag-cover {
		width: 100%;
		height: 100%;
		border-radius: 8px;
	}

	.tag-item {
		position: relative;
		width: 30%;
		height: 140px;
		margin-bottom: 9px;
		margin-left: 2.5%;
	}

	.tag-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		padding: 0 10rpx;
		margin: 10px 0;
	}

	.tag-list>>>.origin-img {
		border-radius: 8px;
	}
</style>