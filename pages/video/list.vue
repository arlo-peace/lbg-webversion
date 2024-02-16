<template>

	<view class="content">
		<css-loading ref="cssLoading"></css-loading>
		<view class="head-top" :style="{'padding-top':top+'px'}">
			<!-- <view class="top-one" style="width:93%;">
				<top-menu :nowUrl="'/pages/video/list'"></top-menu>
			</view> -->
			<view class="top-two" :style="{'padding-top':headTop+'px'}">
				<view @click="setTabId(1)">
					<text :class="tabId==1?'sel':''">推荐</text>
				</view>
				<view @click="setTabId(2)">
					<text :class="tabId==2?'sel':''">最新</text>
					<image src="/static/plaza/new.png" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<view class="center-content" :style="{'margin-top':contentTop+'px'}">
			<view>
				<view class="center-content-item" v-for="(m, i) in dataList" :key="i" @click="goInfo(m)">
					<easy-loadimage mode="aspectFill" :scroll-top="scrollTop" :image-src="m.img" :open-transition="true"
						class="thumbnail">
					</easy-loadimage>
					<view class="username">
						<image style="width:30upx;height:30upx;margin-right:4px;" :style="{'margin-top':topPx+'px'}"
							class="left" src="/static/live/_my.png" mode="aspectFill"></image>
						<text style="color:#FF8F00;">{{m.username}}</text>
						<text class="right" style="font-size:12px;">{{m.english_name}}</text>
					</view>
				</view>
				<view class="moreTig" v-if="isMoreTig">——— 我是有底线的 ———</view>
			</view>
			<view style="width:100%;text-align:center;" :style="{'margin-top':(phone.windowHeight/2) - 100 +'px'}"
				v-if="isShowTig">
				<image src="/static/empty.png" style="width:100px;height:100px;"></image>
				<view style="width:100%;font-size:25upx;color:#666;margin-top:30upx;">本页面暂无内容</view>
			</view>
		</view>
	</view>
</template>
<script>
	import api from "@/common/api.js";
	import utils from '@/components/shoyu-date/utils.filter.js';
	import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue';
	var _self;
	export default {
		onPageScroll({
			scrollTop
		}) {
			_self.scrollTop = scrollTop;
		},
		components: {
			easyLoadimage
		},
		data() {
			return {
				utils: utils,
				loading: true,
				isLogin: false,
				userId: 0,
				top: 0,
				phone: {},
				tabId: 2,
				contentTop: 35,
				isShowTig: false,

				dataList: [],
				page: 1,
				isMoreTig: false,

				loadingHieght: 100,

				scrollTop: 1,

				topPx: 2.5,
				headTop: 0,
				h5Top: 0,
			}
		},
		onLoad(e) {
			_self = this;
			_self._showLoading()
			_self.isLogin = api.getLogins();
			if (_self.isLogin) _self.userId = _self.isLogin.userId;
			_self.phone = uni.getSystemInfoSync();
			_self.top = 5;
			_self.contentTop = _self.top + 50;
			_self.loadingHieght = _self.phone.windowHeight - _self.top;
			// #ifdef APP-PLUS
			_self.topPx = _self.phone.platform == 'ios' ? 1 : 2.5;
			// #endif
			// #ifdef H5
			_self.headTop = 44;
			_self.h5Top = 30;
			// #endif
			_self.getData();
		},
		methods: {
			goInfo(e) {
				var param = {
					url: '/pages/video/list',
					type: 'new'
				};
				api.jumpUrl('/pages/video/album?aid=' + e.id + '&param=' + JSON.stringify(param), 'new');
			},
			setTabId(t) {
				_self.tabId = t;
				_self.page = 1;
				_self.loading = true;
				_self._showLoading()
				_self.dataList = [];
				_self.getData();
			},
			getData() {
				if (_self.page > 1) _self._showLoading('正在加载...');
				uni.request({
					url: api.apiData.getAlbumList,
					method: 'POST',
					data: {
						page: _self.page,
						order: _self.tabId,
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						//console.log(e);
						var r = e.data;
						if (r.Code == 200) {
							var dataList = r.Data.list;
							if (_self.page > 1) {
								if (dataList.length > 0) {
									_self.isMoreTig = false;
									_self.dataList = _self.dataList.concat(dataList);
								} else {
									_self.isMoreTig = true;
								}
							} else {
								_self.isMoreTig = false;
								_self.dataList = dataList;
								_self.isShowTig = dataList.length == 0 ? true : false;
							}
						} else {
							api.showToast(r.Msg, 2000);
						}
					},
					fail: () => {
						// 加载失败提示
						api.showToast("服务器连接失败，请检查网络是否正常", 3000);
					},
					complete: () => {
						setTimeout(() => {
							_self.loading = false;
							_self._hideLoading();
						}, 500);
					}
				});
			},
		},
		onReachBottom() {
			_self.page++;
			_self.getData();
		},
		onBackPress(e) {
			api.jumpUrl('/pages/video/class', 'tab');
			return true;
		}
	};
</script>

<style>
	@import url('@/components/loading/loading.css');

	.username {
		font-size: 13px;
		color: #999999;
		margin-top: 12upx;
	}

	.thumbnail {
		width: 100%;
		height: 300upx;
		//border-radius: 0 10upx 10upx 0;
	}

	.thumbnail>>>.origin-img {
		//border-radius: 0 10upx 10upx 0;
	}

	.moreTig {
		text-align: center;
		color: #999;
		font-size: 25upx;
		margin-top: 26upx;
		padding-bottom: 30upx;
	}

	.center-content-item {
		background-color: rgba(255, 255, 255, 0.06);
		margin: 0 4% 30upx;
		border-radius: 15upx;
		padding: 25upx 3% 18upx;
		//box-shadow: inset 0px 1px rgba(255, 255, 255, 0.4), 0 3px 8px #666666;
	}

	.center-content {
		margin-bottom: 60upx;
	}

	.head-top .top-two image {
		width: 72upx;
		height: 30upx;
		margin-left: 10upx;
	}

	.head-top .top-two .sel {
		border-bottom: 3px solid #FFFFFF;
		color: #FFFFFF;
		//font-weight: bold;
	}

	.head-top .top-two view {
		display: inline-block;
		text-align: center;
		color: #999999;
		font-size: 30upx;
		border-bottom: 3px solid #20202C;
		margin-right: 40upx;
		//font-weight: bold;
	}

	.head-top {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9;
		width: 100%;
		padding: 0 28upx 20upx;
		//height: 35px;
		background-color: #20202C;
		box-shadow: 4px 4px 6px 0px rgba(103, 103, 103, 0.1);
	}

	.content {
		width: 100%;
	}

	.left {
		float: left;
	}

	.right {
		float: right;
	}
</style>