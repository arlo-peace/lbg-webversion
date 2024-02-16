<template>
	<view class="content">
		<css-loading ref="cssLoading"></css-loading>
		<!-- 头部 -->
		<view class="center-content">
			<view class="head" :style="'padding-top:'+(phone.statusBarHeight+10)+'px'">
				<view class="head-item">
					<view class="head-back" @click="api.jumpUrl('/pages/video/class', 'tab')">
						<image src="/static/imgs/back.png" mode="aspectFill" style="width:25px;height:25px;"></image>
					</view>
					<text class="class" v-for="(m, i) in homeData.classList" :key="i" @click="setTabId(m.id)"
						:class="(tabId==m.id)||(tabId==0&&i==0)?'sel':''">{{m.name}}</text>
				</view>
			</view>
			<view :style="'height:'+(phone.statusBarHeight+45)+'px'"></view>
			<!--轮播图-->
			<view class="head-banner" v-if="isBanner">
				<swiper class="swiper" circular interval="3000" :autoplay="true" :indicator-dots="true"
					indicator-color="rgba(255,255,255,0.4)" indicator-active-color="rgba(255,255,255,0.8)">
					<swiper-item class="item" v-for="(b, i) in homeData.banner" :key="i"
						@click="api.jumpUrl(b.url, 'web')">
						<image :src="b.images_url" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
			</view>
			<block v-if="isTag">
				<view class="svod-list">
					<view class="svod-class-item" v-if="homeData.svodTagList && homeData.svodTagList.length > 0">
						<view class="svod-class-name">
							<image src="/static/imgs/hot.png"></image>
							<text class="main-title">短视频标签</text>
						</view>
						<view class="svod-tag-list">
							<view class="svod-tag-item" v-for="(t, i) in homeData.svodTagList" :key="i"
								@click="urlPlayer(t)">
								<image class="svod-tag-cover" :src="t.cover" mode="aspectFill"></image>
								<text>{{t.name}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="svod-list">
					<view class="svod-class-item">
						<view class="svod-class-name">
							<image src="/static/imgs/hot.png"></image>
							<text class="main-title">火爆专区</text>
						</view>
						<view class="svod-tag-list">
							<view class="svod-hot-item" @click="urlHotPlayer('gold')">
								<image class="svod-hot-cover" src="/static/svod/10031.jpg" mode="aspectFill"></image>
								<text>金币专区</text>
							</view>
							<view class="svod-hot-item" @click="urlHotPlayer('good')">
								<image class="svod-hot-cover" src="/static/svod/10032.jpg" mode="aspectFill"></image>
								<text>点赞最多</text>
							</view>
							<view class="svod-hot-item" @click="urlHotPlayer('click')">
								<image class="svod-hot-cover" src="/static/svod/10033.jpg" mode="aspectFill"></image>
								<text>播放最多</text>
							</view>
							<view class="svod-hot-item" @click="urlHotPlayer('new')">
								<image class="svod-hot-cover" src="/static/svod/10034.jpg" mode="aspectFill"></image>
								<text>最新上传</text>
							</view>
							<view class="svod-hot-item" @click="urlHotPlayer('tag')">
								<image class="svod-hot-cover" src="/static/svod/10035.jpg" mode="aspectFill"></image>
								<text>标签最多</text>
							</view>
							<view class="svod-hot-item" @click="urlHotPlayer('free')">
								<image class="svod-hot-cover" src="/static/svod/10036.jpg" mode="aspectFill"></image>
								<text>免费专区</text>
							</view>
						</view>
					</view>
				</view>
				<view class="svod-list">
					<view class="svod-class-item" v-if="homeData.topList">
						<view class="svod-class-name">
							<image src="/static/imgs/hot.png"></image>
							<text class="main-title">大神专区</text>
						</view>
						<view class="svod-tag-list">
							<scroll-view :scroll-x="true" :show-scrollbar="false" style="white-space: nowrap;">
								<view class="svod-top-item svod-top-bg-1" @click="urlTopPlayer('good')">
									<view class="svod-top-item-content">
										<view class="svod-top-title">
											<text>点赞大神</text>
											<text>&gt;</text>
										</view>
										<view class="svod-top-content">
											<image :src="homeData.topList.good.cover" class="svod-top-image"></image>
											<view class="svod-top-text">
												<text>Top.1<br>{{homeData.topList.good.name}}</text>
											</view>
										</view>
									</view>
								</view>
								<view class="svod-top-item svod-top-bg-2" @click="urlTopPlayer('click')">
									<view class="svod-top-item-content">
										<view class="svod-top-title">
											<text>热播大神</text>
											<text>&gt;</text>
										</view>
										<view class="svod-top-content">
											<image :src="homeData.topList.hot.cover" class="svod-top-image"></image>
											<view class="svod-top-text">
												<text>Top.1<br>{{homeData.topList.hot.name}}</text>
											</view>
										</view>
									</view>
								</view>
								<view class="svod-top-item svod-top-bg-3" @click="urlTopPlayer('rich')">
									<view class="svod-top-item-content">
										<view class="svod-top-title">
											<text>创收大神</text>
											<text>&gt;</text>
										</view>
										<view class="svod-top-content">
											<image :src="homeData.topList.rich.cover" class="svod-top-image"></image>
											<view class="svod-top-text">
												<text>Top.1<br>{{homeData.topList.rich.name}}</text>
											</view>
										</view>
									</view>
								</view>
							</scroll-view>
						</view>
					</view>
				</view>
			</block>
			<!-- 分类视频 -->
			<view class="class-list">
				<block v-for="(v, k) in homeData.clist" :key="k">
					<view class="class-item" v-if="v.c_list.length">
						<view class="class-name">
							<text>{{v.c_name}}</text>
							<text class="r" style="color:#777;"
								@click="api.jumpUrl('/pages/svod/class_video?info='+JSON.stringify(v), 'new')">更多</text>
						</view>

						<view class="video-list" style="justify-content:flex-start;">
							<view class="video-item" v-for="(b, i) in v.c_list" :key="i"
								@click="api.jumpUrl('/pages/svod/player?info='+JSON.stringify(b), 'new')"
								:style="(i+1)%3==0?'':'margin-right:2%'">
								<image class="is-vip" src="/static/play/ico_vip.png" v-if="b.gold>0"></image>
								<image class="is-vip" src="/static/play/ico_free.png" v-else></image>
								<!-- <image class="cover" :src="b.cover" mode="aspectFill"></image> -->
								<easy-loadimage mode="aspectFill" :scroll-top="scrollTop" :image-src="b.cover"
									:open-transition="true" class="cover">
								</easy-loadimage>
								<text class="video-title video-item-video-title">{{b.title}}</text>
							</view>
						</view>
						<view class="video-bottom" @click="nextData(k)">
							<image style="width:20px;height:20px;" src="/static/play/next_page.png"></image>
							<text style="color:#FFFFFF;font-size:14px;margin-left:5px;">换一批</text>
						</view>
					</view>
				</block>
				<view class="video-list" style="margin-top:-10px;">
					<view class="video-item" style="width:48.5%;margin-bottom:8.5px;" v-for="(b, i) in homeData.vlist"
						:key="i" @click="api.jumpUrl('/pages/svod/player?info='+JSON.stringify(b), 'new')">
						<image class="is-vip" src="/static/play/ico_vip.png" v-if="b.gold>0"></image>
						<image class="is-vip" src="/static/play/ico_free.png" v-else></image>
						<!-- <image class="cover" :src="b.cover" mode="aspectFill"></image> -->
						<easy-loadimage mode="aspectFill" :scroll-top="scrollTop" :image-src="b.cover"
							:open-transition="true" class="cover" style="height: 240px;">
						</easy-loadimage>
						<text class="v-list-title video-item-video-title">{{b.title}}</text>
					</view>
				</view>
				<view style="width:100%;margin:150px 0;text-align:center;" v-if="isClistNotData && pageType==1">
					<image src="/static/empty.png" style="width:100px;height:100px;"></image>
					<view style="width:100%;font-size:25upx;color:#999;margin-top:30upx;">本页面暂无内容</view>
				</view>
				<view style="width:100%;margin:150px 0;text-align:center;" v-if="isVlistNotData && pageType==2">
					<image src="/static/empty.png" style="width:100px;height:100px;"></image>
					<view style="width:100%;font-size:25upx;color:#999;margin-top:30upx;">本页面暂无内容</view>
				</view>
				<view class="more" v-if="notData">
					<text>——— 我是有底线的 ———</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue'
	import utils from '@/components/shoyu-date/utils.filter.js';
	var _self;
	export default {
		components: {
			easyLoadimage
		},
		data() {
			return {
				scrollTop: 0,
				loading: true,
				system: 'web',
				phone: {},
				one: false,
				api: api,
				homeData: {},
				isBanner: false,
				tabId: 0,
				isClistNotData: false,
				isVlistNotData: false,
				pageType: 1,
				isTag: true,
				notData: false,
				page: 1,
				firstTabId: 0
			}
		},
		onHide() {
			_self.one = true;
		},
		onShow() {
			if (_self.one) _self.getHomeData();
		},
		onLoad() {
			_self = this;
			_self._showLoading()
			_self.phone = uni.getSystemInfoSync();
			// #ifdef APP-PLUS
			_self.system = _self.phone.platform;
			_self.loadHeight = _self.phone.screenHeight;
			// #endif
			// #ifdef H5 || MP-WEIXIN
			_self.loadHeight = _self.phone.windowHeight;
			// #endif
			// 加载首页全局数据
			_self.getHomeData();
		},
		methods: {
			urlPlayer(t) {
				uni.setStorageSync('url_' + api.appkey, {
					url: '/pages/video/class',
					t: 'tab'
				});
				api.jumpUrl('/pages/svod/tag_list?info=' + JSON.stringify(t), 'new')
			},
			urlHotPlayer(t) {
				uni.setStorageSync('url_' + api.appkey, {
					url: '/pages/svod/class',
					t: 'tab'
				});
				api.jumpUrl('/pages/svod/hot?type=' + t, 'new')
			},
			urlTopPlayer(t) {
				uni.setStorageSync('url_' + api.appkey, {
					url: '/pages/svod/class',
					t: 'tab'
				});
				api.jumpUrl('/pages/svod/top?type=' + t, 'new')
			},
			// 首页数据
			getHomeData(t = 0) {
				if (t == 1) _self._showLoading('加载中...');
				// 发起请求
				uni.request({
					url: api.apiData.getSvodClass,
					method: 'POST',
					data: {
						class_id: _self.tabId
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						let d = e.data;
						if (d.Code == 201) return api.showToast(d.Msg, 2000);
						// 首页数据
						_self.homeData = e.data.Data;
						_self.pageType = _self.homeData.type;
						_self.isClistNotData = _self.homeData.clist.length ? false : true;
						_self.isVlistNotData = _self.homeData.vlist.length ? false : true;
						// 轮播图start
						var banner = _self.homeData.banner;
						if (banner.length) {
							_self.isBanner = true;
							if (banner[0]['images_url'].length) {
								for (var i = 0; i < banner.length; i++) {
									api.imgCache(banner[i]['images_url'], (img) => {
										banner[i]['images_url'] = img;
									});
								}
							}
							_self.homeData['banner'] = banner;
						} else {
							_self.isBanner = false;
						}
						if (_self.homeData.classList) {
							_self.firstTabId = _self.homeData.classList[0].id
						}
						let timer = setTimeout(() => {
							_self.loading = false;
							_self._hideLoading()
							if (t == 1) {
								uni.pageScrollTo({
									scrollTop: 0,
									duration: 300
								});
							}
							clearTimeout(timer);
						}, 500);
					},
					fail: () => {
						// 加载失败提示
						api.showToast('服务器连接失败，请检查网络是否正常', 5000);
					},
					complete: () => {
						_self.scrollTop = 2;
					}
				});
			},
			// 切换大分类
			setTabId(e) {
				_self.page = 1;
				_self.tabId = e;
				_self.isTag = e == _self.firstTabId
				_self.notData = false;
				_self.getHomeData(1);
			},
			// 换一批
			nextData(e) {
				_self._showLoading('加载中...');
				_self.homeData.clist[e]['c_page']++;
				let v = _self.homeData.clist[e];
				uni.request({
					url: api.apiData.getSvodData + '/cid/' + v['c_id'] + '/type/1/page/' + v['c_page'],
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (r) => {
						let d = r.data;
						if (d.length) {
							_self.homeData.clist[e]['c_list'] = d;
						} else {
							api.showToast("哦豁，没有找到数据")
						}
						let timer = setTimeout(() => {
							_self._hideLoading();
							clearTimeout(timer);
						}, 500);
					},
					fail: () => {
						// 加载失败提示
						api.showToast("服务器连接失败，请检查网络是否正常", 5000);
					}
				});
			},
			getVideo() {
				_self._showLoading('加载中...');
				uni.request({
					url: api.apiData.getSvodData + '/cid/' + _self.tabId + '/type/' + _self.pageType + '/page/' +
						_self.page + '/count/12',
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (r) => {
						let d = r.data;
						if (d.length) {
							_self.homeData.vlist = _self.homeData.vlist.concat(d);
							_self.notData = false;
						} else {
							_self.notData = true;
						}
						let timer = setTimeout(() => {
							_self._hideLoading();
							clearTimeout(timer);
						}, 500);
					},
					fail: () => {
						// 加载失败提示
						api.showToast('服务器连接失败，请检查网络是否正常');
					}
				});
			},
		},
		onReachBottom() {
			if (_self.notData || _self.pageType == 1) return;
			_self.page++;
			_self.getVideo();
		},
		// 滚动监听事件
		onPageScroll({
			scrollTop
		}) {
			_self.scrollTop = scrollTop;
		}
	}
</script>
<style lang="scss" scoped>
	/deep/.uni-scroll-view::-webkit-scrollbar {
		display: none
	}
</style>
<style>
	@import url('@/components/loading/loading.css');

	.head-back {
		height: 26px;
		margin: 0 20upx 0 -5px;
	}

	.more {
		text-align: center;
		width: 100%;
		color: #999;
		font-size: 12px;
		margin: 10px 0 15px;
	}

	.v-list-title {
		position: absolute;
		margin-top: -30px;
		background-color: rgba(0, 0, 0, 0.2);
		color: #fff;
		font-size: 12px;
		width: 98%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		padding: 2px 1%;
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
		margin: 12px auto 23px;
	}

	.video-title {
		font-size: 12px;
		line-height: 16px;
		padding: 5px 0 2px 0;
		width: 100%;
		color: rgba(255, 255, 255, 0.7);
		display: -webkit-box;
		text-overflow: ellipsis;
		overflow: hidden;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.video-item .cover {
		width: 100%;
		height: 165px;
		border-radius: 8px;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.cover>>>.origin-img {
		border-radius: 8px;
	}

	.video-list .video-item {
		display: inline-block;
		width: 32%;
		position: relative;
		margin-bottom: 7px;
	}

	.video-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.class-name {
		height: 20px;
		line-height: 20px;
		border-left: 6px solid #FF8F00;
		border-radius: 3px;
		font-size: 14px;
		color: #FFFFFF;
		padding-left: 10px;
		margin-bottom: 17px;
		;
		position: relative;
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
		margin-bottom: 5px;
	}

	.class-list {
		padding: 0 30rpx;
		margin-top: 15px;
	}

	.menu-item image {
		width: 50px;
		height: 50px;
	}

	.menu-item text {
		color: rgba(255, 255, 255, 0.8);
		font-size: 14px;
		margin-top: 10px;
	}

	.menu-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 25%;
	}

	.menu-list {
		padding: 0 30rpx;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		margin: 20px 0;
	}

	.head-banner image {
		width: 100%;
		height: 100%;
	}

	.head-banner .swiper {
		width: 100%;
		height: 160px;
		overflow: hidden;
		border-radius: 10px;
		/* #ifdef H5 */
		position: relative;
		transform: rotate(0deg);
		/* #endif */
	}

	.head-banner {
		margin: 5px 0 10px;
		padding: 0 30rpx;
	}

	.head-right image {
		height: 26px;
		width: 26px;
		margin-left: 14px;
		margin-top: 4px;
	}

	.head-search {
		display: flex;
		flex-direction: row;
		background-color: #31313C;
		border-radius: 34px;
		height: 34px;
		line-height: 34px;
		align-items: center;
		padding: 0 10px;
		flex: 1;
	}

	.head-item .sel {
		font-size: 17px !important;
		color: #FFFFFF;
		border-bottom: 2px solid #FF8F00 !important;
	}

	.head-item .class {
		font-size: 16px;
		height: 26px;
		margin-right: 15px;
		border-bottom: 2px solid #1D1D28;
	}

	.head-item {
		display: flex;
		flex-direction: row;
		margin-bottom: 10px;
		width: 694rpx;
	}

	.head {
		position: fixed;
		color: #999999;
		background-color: #1D1D28;
		z-index: 99;
		padding: 0 30rpx;
	}

	.r {
		float: right;
	}

	.l {
		float: left;
	}

	.center-content {}







	.svod-list {
		padding: 0 30rpx;
		margin-top: 15px;
	}

	.svod-class-name {
		height: 30px;
		line-height: 30px;
		border-radius: 3px;
		font-size: 14px;
		color: #FFFFFF;
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		margin-bottom: 20upx;
	}

	.svod-class-name image {
		width: 30px;
		height: 30px;
		margin-right: 10upx;
	}

	.svod-class-name .main-title {
		flex: 1;
	}

	.svod-tag-item text {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 50upx;
		line-height: 50upx;
		border-radius: 8px;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
		margin-left: -100%;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		text-align: center;
		color: #FFFFFF;
		font-size: 14px;
		font-weight: bold;
	}

	.svod-tag-item .svod-tag-cover {
		width: 100%;
		height: 100%;
	}

	.svod-tag-item {
		position: relative;
		width: 49%;
		height: 100px;
		margin-bottom: 8px;
		border-radius: 8px;
		overflow: hidden;
		background-color: #31313c;
	}

	.svod-tag-item:before {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 80%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #444;
	}

	.svod-tag-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 10px 0;
		width: 100%;
	}


	.svod-top-item {
		position: relative;
		width: 38%;
		height: 160upx;
		margin-bottom: 8px;
		border-radius: 8px;
		overflow: hidden;
		//background-color: #31313c;
		box-sizing: border-box;
		padding: 8upx 16upx;
		display: inline-block;
		margin-right: 16upx;
	}

	.svod-top-item-content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}
	.svod-top-bg-1{
	background-image: url(/static/svod/bg-1.jpg);
	background-size: 100% 100%;
	}
	.svod-top-bg-2{
	background-image: url(/static/svod/bg-2.jpg);
	background-size: 100% 100%;
	}
	.svod-top-bg-3{
	background-image: url(/static/svod/bg-3.jpg);
	background-size: 100% 100%;
	}
	.svod-top-title {
		width: 100%;
		height: 50upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		color: #FFF;
		font-weight: bold;
	}

	.svod-top-content {
		width: 100%;
		height: 106upx;
		padding: 6upx 0 10upx 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.svod-top-image {
		width: 60upx;
		height: 60upx;
		border: #eee 2upx solid;
		margin-right: 14upx;
		border-radius: 34upx;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.svod-top-text {
		width: calc(100% - 80upx);
		height: 80upx;
		line-height: 26upx;
		font-size: 12px;
		color: #ddd;
		overflow: hidden;
	}
	.svod-top-text text{
		width: 100%;
		height: 100%;
		text-overflow: ellipsis;
		word-wrap: break-word;
		word-break: break-all;
		display: inline-block;
		white-space: normal;
	}

	.svod-top-image:before {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 80%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #444;
	}


	.svod-hot-item text {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 50upx;
		line-height: 50upx;
		border-radius: 8px;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
		margin-left: -100%;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		text-align: center;
		color: #FFFFFF;
		font-size: 14px;
		font-weight: bold;
	}

	.svod-hot-item {
		position: relative;
		width: 31.5%;
		height: 100px;
		margin-bottom: 8px;
		border-radius: 8px;
		overflow: hidden;
		background-color: #31313c;
	}

	.svod-hot-item .svod-hot-cover {
		width: 100%;
		height: 100%;
	}
</style>