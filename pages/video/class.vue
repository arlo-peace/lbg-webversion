<template>
	<view class="content">
		<css-loading ref="cssLoading"></css-loading>
		<!-- 头部 -->
		<view class="center-content">
			<view class="head" :style="'padding-top:'+(phone.statusBarHeight+10)+'px'">
				<!--<view class="download_tip" v-if="show_web">
					<image src="/static/img/h5-download.png"></image>
					<text @click="gotoDownload">点击下APP</text>
					<uni-icons type="close" color="#ff8f00" size="22" class="icon" @click="show_web = false"></uni-icons>
				</view>-->
				<view class="head-item">
					<scroll-view :scroll-x="true" :show-scrollbar="false" style="white-space: nowrap;height:34px">
						<text class="class" v-for="(m, i) in homeData.classList" :key="i" @click="setTabId(m.id)"
							:class="(tabId==m.id)||(tabId==0&&i==0)?'sel':''">{{m.name}}</text>
						<text class="class" @click="api.jumpUrl('/pages/class/index', 'old')">分类</text>
						<text class="class" @click="api.jumpUrl('/pages/svod/class', 'old')">精选</text>
						<text class="class" @click="api.jumpUrl(api.apiData.apiUrl+'/redirtype/appdown')">下载APP</text>
					</scroll-view>
				</view>
				<view class="head-item">
					<view class="head-search" @click="api.jumpUrl('/pages/video/search', 'new')">
						<image style="width:15px;height:15px;" src="/static/imgs/search.png"></image>
						<text style="font-size:12px;margin-left:5px;color:#777;">输入关键字</text>
					</view>
					<view class="head-right">
						<image src="/static/play/history.png" @click="watchLog"></image>
						<image src="/static/play/download.png" @click="goDownLog"></image>
					</view>
				</view>
			</view>
			<view :style="'height:'+(phone.statusBarHeight+95)+'px'"></view>
			<!--轮播图-->
			<view class="head-banner" v-if="isBanner">
				<swiper class="swiper" circular :interval="homeData.bannerInterval" :autoplay="true" :indicator-dots="true"
					indicator-color="rgba(255,255,255,0.4)" indicator-active-color="rgba(255,255,255,0.8)">
					<swiper-item class="item" v-for="(b, i) in homeData.banner" :key="i"
						@click="linkTo(b.url)">
						<image :src="b.images_url" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
			</view>
			<!-- 导航 -->
			<view class="menu-list" v-if="isMenu">
				<view class="menu-item" v-for="(m, i) in homeData.menu" :key="i" @click="api.jumpUrl(m.url, m.type)">
					<image :src="m.icon"></image>
					<text>{{m.name}}</text>
				</view>
			</view>
			<!-- 小广告列表 -->
			<view v-if="isMiniAD && homeData.miniAdShowWeb" class="mini-ad-list">
				<view class="mini-ad-item" v-for="(m, i) in homeData.miniads" :key="i"
					@click="api.jumpUrl(m.url, 'web')">
					<view class="mini-ad-icon-box">
						<view class="mini-ad-icon">
							<image :src="m.images_url"></image>
						</view>
						<text>{{m.titles}}</text>
					</view>
				</view>
			</view>
			<!-- 游戏列表 -->
			<view class="game-list" v-if="isGame">
				<scroll-view :scroll-x="true" :show-scrollbar="false" style="white-space: nowrap;">
					<view class="game-item" :style="{width:parseInt((width - 20) * 0.25) + 'px'}"
						v-for="(m, i) in homeData.games" :key="i"
						@click="api.jumpUrl('/pages/dggame/game?id='+m.tableId, 'old')">
						<view class="showIcon">
							<image :src="m.cover"></image>
						</view>
						<text>{{m.name}}</text>
					</view>
				</scroll-view>
			</view>
			<!-- 分类 -->
			<view class="video-class">
			
				<scroll-view class="class-scroll" scroll-x="true">
					<template v-for="(c, cindex) in homeData.classes">
					<view v-if="(typeof c.id != 'undefined')" :key="cindex"  @click="api.jumpUrl('/pages/class/index?classId='+c.id, 'new')">
						{{c.name}}
					</view>
					</template>
				</scroll-view>
			</view>
			<!-- 标签 -->
			<block v-if="isTag">
				<view class="tag-list">
					<view class="tag-item" v-for="(t, i) in homeData.tag" :key="i" @click="urlPlayer(t)">
						<image class="tag-cover" :src="t.cover" mode="aspectFill"></image>
						<text>{{t.name}}</text>
					</view>
					<view class="tag-item" @click="api.jumpUrl('/pages/video/tag_list', 'new')">
						<text style="margin-left:0;">更多标签</text>
					</view>
				</view>
				<view class="svod-list" v-if="homeData.svodTagList && homeData.svodTagList.length > 0">
					<view class="svod-class-item">
						<view class="svod-class-name">
							<image src="/static/imgs/hot.png"></image>
							<text class="main-title">短视频标签</text>
						</view>
						<view class="svod-tag-list">
							<view class="svod-tag-item" v-for="(t, i) in homeData.svodTagList" :key="i"
								@click="urlSvodPlayer(t)">
								<image class="svod-tag-cover" :src="t.cover" mode="aspectFill"></image>
								<text>{{t.name}}</text>
							</view>
						</view>
					</view>
				</view>
			</block>
			<view class="svod-list" v-if="tabId == 0">
				<view class="svod-class-item" v-if="homeData.svodList && homeData.svodList.length > 0">
					<view class="svod-class-name">
						<image src="/static/imgs/hot.png"></image>
						<text class="main-title">短视频热门</text>
						<text class="r" style="color:#777;" @click="api.jumpUrl('/pages/svod/hot', 'new')">更多</text>
					</view>
					<view class="svod-video-list">
						<scroll-view :scroll-x="true" :show-scrollbar="false" style="white-space: nowrap;">
							<view class="svod-video-item" v-for="(item,index) in homeData.svodList" :key="index"
								@click="api.jumpUrl('/pages/svod/player?info='+JSON.stringify(item), 'new')">
								<image class="is-vip" src="/static/play/ico_vip.png" v-if="true"></image>
								<image class="is-vip" src="/static/play/ico_free.png" v-else></image>
								<!-- <image class="cover" :src="b.cover" mode="aspectFill"></image> -->
								<easy-loadimage mode="aspectFill" :scroll-top="scrollTop" :image-src="item.cover"
									:open-transition="true" class="cover">
								</easy-loadimage>
								<text class="video-title video-item-video-title">{{item.title}}</text>
							</view>
						</scroll-view>
					</view>
				</view>
			</view>
			<!-- 分类视频 -->
			<view class="class-list">
				<block v-for="(v, k) in homeData.videoList" :key="k">
					<view style="width:100%;background-color:#1D1D28;padding:10upx 0 20upx 0;" v-if="adList[k]">
						<div class="ad-list">
							<image class="ad-img" :style="{ height: adList[k].height+'px' }" :src="adList[k].content" mode="aspectFill"
								@click="api.jumpUrl(adList[k].url, 'web')"></image>
						</div>
					</view>
					<view class="class-item" v-if="v.c_list.length">
						<view class="class-name">
							<text>{{v.c_name}}</text>
							<text class="r" style="color:#777;"
								@click="api.jumpUrl('/pages/class/index?isTrue=1&classId='+v.c_id.id, 'new')">更多</text>
							<!--<text class="r" style="color:#777;" @click="api.jumpUrl('/pages/video/class_video?info='+JSON.stringify(v), 'new')">更多</text>-->
						</view>
						<view class="video-list">
							<view class="video-item" v-for="(b, i) in v.c_list" :key="i" @click="playVideo(b.id)">
								<image class="is-vip" src="/static/play/ico_vip.png" v-if="true>0"></image>
								<image class="is-vip" src="/static/play/ico_free.png" v-else></image>
								<!-- <image class="cover" :src="b.cover" mode="aspectFill"></image> -->
								<easy-loadimage mode="scaleToFill" :scroll-top="scrollTop" :image-src="b.cover"
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
				<view style="width:100%;margin:100px 0;text-align:center;" v-if="isNotData">
					<image src="/static/empty.png" style="width:100px;height:100px;"></image>
					<view style="width:100%;font-size:25upx;color:#666;margin-top:30upx;">本页面暂无内容</view>
				</view>
				<view class="empty-line"></view>
				<!-- #ifdef APP -->
				<view style="width:100%;text-align:center;">
					<image src="/static/empty.png" style="width:20rpx;height:10rpx;opacity: 0;"></image>
				</view>
				<!-- #endif -->
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
				isMenu: false,
				isGame: false,
				isMiniAD: false,
				isTag: false,
				tabId: 0,
				isNotData: false,
				noticeContent: '', // 公告内容
				loadHeight: 0,
				show_web: false,
				download_url: '',
				apiIdKey: '1111',
				width: 750,
				notices: [],
				adList: [
					{
						content: "https://jk.lubugou.xyz/XResource/images/20240202/cYThMaAiiTKXinfd3JxSzYwc5rC5i3Mh.gif",
						height: 60,
						id: 5,
						titles: "约炮",
						url: "https://lubugou1.net/"
					}
				]
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
			_self.width = _self.phone.windowWidth;
			// #ifdef APP-PLUS
			_self.system = _self.phone.platform;
			_self.loadHeight = _self.phone.screenHeight;
			// #endif
			// #ifdef H5 || MP-WEIXIN
			_self.loadHeight = _self.phone.windowHeight;
			// #endif
			// #ifdef H5
			_self.show_web = true
			// #endif
			// 加载首页全局数据
			_self.getHomeData();
		},
		methods: {
			gotoDownload() {
				api.jumpUrl(api.apiData.apiUrl+'/redirtype/appdown')
			},
			notice() {
				let notice = uni.getStorageSync('notice_content_' + api.appkey);
				let readNotice = uni.getStorageSync('notice_already_content_' + api.appkey)
				let noticeMini = uni.getStorageSync('notice_mini_already_alert_' + api.appkey);
				let noticeKeys = readNotice ? readNotice.split(',') : [];
				_self.notices = []
				if (notice && notice.length > 0) {
					notice.forEach((n, i) => {
						if (noticeKeys.indexOf(n.id + '') === -1 || n.dialog_type != 0) {
							_self.notices.push(n)
							setTimeout(() => {
								_self.$refs[`popupNotice${n.id}`][0].open();
							}, 1000 + (i * 100));
						}
					})
				}
				if(_self.homeData.promptMinis.length > 0){
					if(noticeMini!='popupNoticeMiniApp'){
						setTimeout(() => {
							_self.$refs.popupNoticeMiniApp.open();
						}, 1000 + (3 * 100));
					}
				}
			},
			closeNotice(notice) {
				let readNotice = uni.getStorageSync('notice_already_content_' + api.appkey);
				let noticeKeys = readNotice ? readNotice.split(',') : [];
				if (noticeKeys.indexOf(notice.id + '') === -1 && notice.dialog_type == 0) {
					noticeKeys.push(notice.id)
				}
				uni.setStorageSync('notice_already_content_' + api.appkey, noticeKeys.join(','))
			},
			closeMiniChange(val) {
				let readMiniNotice = uni.getStorageSync('notice_mini_already_alert_' + api.appkey);
				uni.setStorageSync('notice_mini_already_alert_' + api.appkey, val)
			},
			closePopMini() {
				_self.$refs.popupNoticeMiniApp.close();
			},
			closePop(notice) {
				_self.$refs[`popupNotice${notice.id}`][0].close();
			},
			clickNotice(notice) {
				_self.$refs[`popupNotice${notice.id}`][0].close();
				if (notice.url && notice.url.length > 0) {
					if (notice.url.indexOf('http') > -1) {
						api.jumpUrl(notice.url, 'outer')
					} else {
						api.jumpUrl(notice.url, 'new')
					}
				}
			},
			miniAdGoLink(obj){
				if (obj.url.indexOf('http') > -1) {
					api.jumpUrl(obj.url, 'outer')
				} else {
					api.jumpUrl(obj.url, 'new')
				}
			},
			// 首页数据
			getHomeData(t = 0) {
				if (t == 1) _self._showLoading('加载中...');
				// 发起请求
				uni.request({
					url: api.apiData.getClassData,
					method: 'POST',
					data: {
						class_id: _self.tabId,
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						let d = e.data;
						if (d.Code == 201) return api.showToast(d.Msg, 2000);
						// 首页数据
						_self.homeData = e.data.Data;
						_self.isNotData = _self.homeData.videoList.length ? false : true;
						// 轮播图start
						var banner = _self.homeData.banner;
						_self.download_url = _self.homeData.download_url || ''
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
						_self.isMenu = _self.homeData.menu.length ? true : false;
						_self.isGame = _self.homeData.games.length ? true : false;
						_self.isMiniAD = _self.homeData.miniads.length ? true : false;
						_self.isMiniAD = _self.homeData.miniAdShowWeb;
						_self.isTag = _self.homeData.tag.length ? true : false;
						_self.adList = d.Data.adList
						var timer = setTimeout(() => {
							_self.loading = false;
							_self._hideLoading();
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
						api.showToast('服务器连接失败，请检查网络是否正常');
					},
					complete: () => {
						_self.scrollTop = 2;
						_self.notice();
					}
				});
			},
			// 切换大分类
			setTabId(e) {
				_self.tabId = e;
				_self.getHomeData(1);
			},
			// 换一批
			nextData(e) {
				_self._showLoading('加载中...');
				_self.homeData.videoList[e]['c_page']++;
				let v = _self.homeData.videoList[e];
				uni.request({
					url: api.apiData.getClassVideo + '/cid/' + (typeof v.c_id == 'object' ? v.c_id.id : v.c_id) +
						'/type/1/page/' + v['c_page'],
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: r => {
						let d = r.data;
						if (d.length) {
							_self.homeData.videoList[e]['c_list'] = d;
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
			// 观看历史记录
			watchLog() {
				var isLogin = api.getLogins();
				if (isLogin) {
					var p = {
						url: '/pages/video/class',
						type: 'tab'
					};
					api.jumpUrl('/pages/member/watch_log?path=' + JSON.stringify(p), 'new');
				} else {
					api.showToast('请先登录');
					let timer = setTimeout(() => {
						api.jumpUrl('/pages/login/login', 'new');
						clearTimeout(timer);
					}, 1000);
				}
			},
			// 下载记录
			goDownLog() {
				// #ifdef H5
				api.showToast('轻量版暂不支持下载', 2000);
				// #endif
				// #ifdef APP-PLUS
				var isLogin = api.getLogins();
				if (isLogin) {
					api.jumpUrl('/pages/down/down', 'new');
				} else {
					api.showToast('请先登录', 1500);
					let timer = setTimeout(() => {
						api.jumpUrl('/pages/login/login', 'new');
						clearTimeout(timer);
					}, 1000);
				}
				// #endif
			},
			urlPlayer(t) {
				uni.setStorageSync('url_' + api.appkey, {
					url: '/pages/video/class',
					t: 'tab'
				});
				api.jumpUrl('/pages/video/tag_video?info=' + JSON.stringify(t), 'new')
			},
			urlSvodPlayer(t) {
				uni.setStorageSync('url_' + api.appkey, {
					url: '/pages/video/class',
					t: 'tab'
				});
				api.jumpUrl('/pages/svod/tag_list?info=' + JSON.stringify(t), 'new')
			},
			// 跳转播放页
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
			linkTo(url){
				const type = ['old:', 'new:', 'tab:','newx:','app:'];
				if(this.checkIfStringStartsWith(url, type)){
					const urlType = url.substr(0, url.indexOf(':'))
					const urlString = url.substr(parseFloat(url.indexOf(':'))+1, url.length)
					if(urlString){
						api.jumpUrl(urlString, urlType)
					}
				} else {
					api.jumpUrl(url, 'web')
				}
			},
			checkIfStringStartsWith(str, substrs) {
				return substrs.some(substr => str.startsWith(substr));
			}
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

	.download_tip {
		position: relative;
		height: 60upx;
		text-align: left;
		padding: 5px 10px;
		background-color: #31313c;
		border-radius: 8px;
		border: 1px solid #ff8f00;
		box-shadow: 1px 7px 14px -5px rgba(0, 0, 0, 0.5);
		margin-bottom: 12upx;
	}

	.download_tip image {
		width: 50upx;
		height: 50upx;
		vertical-align: middle;
		margin: 0px 10px 0px 3px;
	}

	.download_tip text {
		font-size: 16px;
		line-height: 60upx;
	}

	.download_tip .icon {
		position: absolute;
		right: 16rpx;
		top: 10rpx;
	}

	.notice_content {
		width: 100%;
		height: 360upx;
		padding: 15upx 5%;
		color: #A5A5A5;
		box-sizing: border-box;
		margin-top: -150upx;
	}

	.notice_title {
		width: 100%;
		height: 246upx;
		overflow: hidden;
		border-top-left-radius: 60upx;
		border-top-right-radius: 60upx;
		top: -180upx;
	}

	.notice-bg {
		width: 600upx;
		border-radius: 60upx;
		background-color: #20013a;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.notice-image-img {
		width: 600upx;
		height: 640upx;
		border-radius: 0upx;
		overflow: hidden;
	}

	.notice-image-btn {
		position: absolute;
		//bottom: -80upx;
		top:20upx;
		margin-left:-30upx;
		width: 100%;
		display: flex;
		//align-items: center;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.notice-image-btn-item-image {
		width: 70upx;
		height: 70upx;
	}

	.tag-item text {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 100px;
		line-height: 100px;
		border-radius: 8px;
		margin-left: -100%;
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
		width: 22%;
		height: 100px;
		margin-bottom: 8px;
	}

	.tag-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		padding: 0 30rpx;
		margin: 10px 0;
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
		content: "暂无图片";
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
		margin: 13px auto 23px;
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
		height: 230upx;
		border-radius: 8px;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.cover>>>.origin-img {
		border-radius: 8px;
	}

	.video-list .video-item {
		display: inline-block;
		width: 49%;
		position: relative;
		margin-bottom: 7px;
	}

	.video-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-top: 15px;
	}

	.class-name {
		height: 20px;
		line-height: 20px;
		border-left: 6px solid #FF8F00;
		border-radius: 3px;
		font-size: 14px;
		color: #FFFFFF;
		padding-left: 10px;
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

	.empty-line {
		width: 100%;
		margin-bottom: 35px;
	}

	.class-list {
		padding: 0 15rpx;
		margin-top: 15px;
	}


	.svod-class-item {
		margin-bottom: 5px;
	}

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

	.svod-video-item {
		display: inline-block;
		width: 210upx;
		position: relative;
		margin-bottom: 10upx;
		margin-right: 15upx;
	}

	.svod-video-item .video-title {
		width: 100%;
		text-align: center;
	}

	.svod-video-item .cover {
		width: 100%;
		height: 300upx;
		border-radius: 8px;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.menu-item image {
		width: 50px;
		height: 50px;
	}

	.menu-item text {
		color: rgba(255, 255, 255, 0.8);
		font-size: 14px;
		margin-top: 10px;
		// #ifdef APP
		font-size: 13px;
		// #endif
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
		// #ifdef APP
		padding: 0 15rpx;
		// #endif
	}


	.game-item .showIcon {
		width: 100%;
		padding: 10px;
		box-sizing: border-box;
		margin-top: -10px;
		height: 0;
		padding-bottom: calc(100% - 20px);
		position: relative;
	}

	.game-item image {
		width: calc(100% - 20px);
		height: calc(100% - 15px);
		position: absolute;
		left: 10px;
		top: 15px;
		display: inline-block;
	}

	.game-item text {
		color: rgba(255, 255, 255, 0.8);
		font-size: 14px;
		margin-top: 0;
		display: inline-block;
		width: 100%;
	}

	.game-item {
		display: inline-block;
		text-align: center;
		width: 25%;
	}


	.game-list {
		margin: 10px 30upx 20upx;
		border-radius: 20upx;
		/* background-image: linear-gradient(to right, rgba(255, 217, 115, 0.1), rgba(255, 255, 255, 0.1)); */
		/* //background-image: url(/static/member/bg.png); */
		/* //background-size: 100% 100%; */
		/* padding: 8upx 8upx; */
		display: flex;
		flex-direction: row;
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
		width: 100%;
		box-sizing: border-box;
	}

	.r {
		float: right;
	}

	.l {
		float: left;
	}

	.center-content {}

	.video-class view {
		display: inline-block;
		font-size: 25upx;
		background-color: #272733;
		color: #F8F8F8 !important;
		height: 50upx;
		line-height: 50upx;
	}

	.video-class {
		width: 100%;
		height: 54upx;
		line-height: 54upx;
		padding: 5upx 0 15upx 0;
		color: #666;
	}

	.class-scroll {
		white-space: nowrap;
		display: inline-block;
		width: calc(100% - 30px);
		float: right;
		margin-right: 15px;
		box-sizing: border-box;
		margin-left: 15px;
	}

	.class-scroll view {
		padding: 0 20upx;
		margin-right: 20upx;
		text-align: center;
		border-radius: 50upx;
		color: #999999;
		background-color: rgba(255, 255, 255, 0.1);
	}

	.mini-ad-list {
		width: 100%;
		height: auto;
		padding: 20upx;
		box-sizing: border-box;
	}

	.mini-ad-list .mini-ad-item {
		width: 20%;
		padding-bottom: 30%;
		height: 0;
		display: inline-block;
		margin: 0;
		position: relative;
	}
	.mini-ad-list .mini-ad-item .mini-ad-icon-box{
		display: flex;
		flex-direction: column;
	}
	.mini-ad-list .mini-ad-item .mini-ad-icon-box text{
		color: #ffffff;
		z-index: 1;
		font-size: .9rem;
		width: 70px;
		text-align: center;
		overflow: hidden;
		white-space: nowrap;
	}
	.mini-ad-list .mini-ad-item .mini-ad-icon {
		/* position: absolute; */
		flex: 1;
		padding: 10upx;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		text-align: center;
	}

	.mini-ad-list .mini-ad-item .mini-ad-icon image {
		/* width: 100%;
		height: 100%; */
		width: 50px;
		height: 50px;
		border-radius: 20upx;
	}
	.mini-ad-list .mini-ad-item text {
		font-size: 14px !important;
		color: rgba(255, 255, 255, 0.8) !important;
	}

	.notice-btn {
		bottom: -40upx;
		position: absolute;
		width: 100%;
		text-align: center;
		;
	}

	.notice-btn-item {
		height: 28px;
		padding: 10upx 50upx;
		border-radius: 30px;
		background: #FF8F00;
		background-image: linear-gradient(to right top, #9e35f8, #953bfa, #8b41fc, #8146fe, #764aff);
		color: #FFF;
		width: auto;
		line-height: 26px;
		display: inline-block;
		cursor: pointer;
	}
	.mini-adapp.notice-bg{
		border-radius: 8px;
	}
	.notice-bg .mini-ap-main {
		display: grid;
		grid-template-columns: auto auto auto;
		padding: 10px 0px;
	}
	.notice-bg .mini-ap-box{
		width: 100%;
		text-align: center;
	}
	.notice-bg .mini-ap-box .mini-ap-item{
		padding: 10px 10px 5px 10px;
		width: 60px;
		height: 60px;
		position: relative;
		margin: auto;
	}
	.notice-bg .mini-ap-box .mini-ap-down{
		display: flex;
		position: relative;
		justify-items: center;
		align-items: center;
		justify-content: center;
	}
	.notice-bg .mini-ap-box .mini-ap-down image{
		width: 20px;
		height: 20px;
		margin-left: 5px;
	}
	.notice-bg .mini-ap-box .mini-ap-item image {
		width: 100%;
		height: 100%;
		border-radius: 10upx;
	}
	.mini-adapp .mini-ap-box text{
		color: #FFFFFF;
		font-size: 13px;
	}
	.ad-list {
		width: 100%;
		text-align: center;
	}

	.ad-img {
		width: 95%;
		height: 100upx;
		border-radius: 5px;
		margin-top: 5upx;
	}

	/* #ifdef APP */
	.video-item-video-title {
		height: 36upx !important;
		lines: 1 !important;
		text-overflow: ellipsis !important;
		overflow: hidden !important;
	}

	.video-info-video-title {
		height: 36upx !important;
		lines: 1 !important;
	}

	/* #endif */
</style>