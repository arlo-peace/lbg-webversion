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
		</view><!-- 公告弹窗 -->
		<uni-popup v-for="(notice,index) in notices" :key="index" :ref="`popupNotice${notice.id}`"
			@change="closeNotice(notice)" type="center">
			<view class="notice-bg" v-if="notice.type == 1">
				<image class="notice_title" src="/static/svod/notice.png" mode="aspectFill"></image>
				<scroll-view :scroll-y="true" :show-scrollbar="false" class="notice_content">
					<view v-html="notice.content"></view>
				</scroll-view>
				<view style="height:50upx;"></view>
				<view class="notice-btn">
					<!--<view @click="closePop(notice)" class="notice-btn-item">
						<text>立刻观影</text>
					</view>-->
					<view @click="api.jumpUrl('/pages/setting/mini', 'new')" class="notice-btn-item">
						<text>应用中心</text>
					</view>
				</view>
			</view>
			<view v-else class="notice-bg">
				<image @click="clickNotice(notice)" :src="notice.image" class="notice-image-img"></image>
				<view class="notice-image-btn">
					<view @click="closePop(notice)" class="notice-image-btn-item">
						<image src="/static/imgs/x-1.png" class="notice-image-btn-item-image"></image>
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- 迷你应用列表 -->
		<uni-popup 
			@change="closeMiniChange('popupNoticeMiniApp')"
			ref="popupNoticeMiniApp" 
			type="center">
			<view class="mini-adapp notice-bg">
				<view class="mini-ap-main">
					<view @click="miniAdGoLink(ma)" class="mini-ap-box" v-for="(ma, index) in homeData.promptMinis" :key="index">
						<view class="mini-ap-item">
							<image :src="ma.images_url" mode="scaleToFill"></image>
						</view>
						<view class="mini-ap-down">
							<text>{{ ma.titles}}</text>
							<image src="../../static/imgs/down_index.png" mode=""></image>
						</view>
					</view>
				</view>
				<view class="notice-image-btn">
					<view @click="closePopMini()" class="notice-image-btn-item">
						<image src="/static/imgs/x-1.png" class="notice-image-btn-item-image"></image>
					</view>
				</view>
			</view>
		</uni-popup>
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
				api: api,
				width: 750,
				notices: [],
				homeData: {},
			}
		},
		onLoad() {
			_self = this;
			_self._showLoading('加载中...')
			this.getHomeData();
			this.$nextTick(() => {
				_self.getData()
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
			},
			gotoDownload() {
				api.jumpUrl(_self.download_url);
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
			getHomeData(t = 0) {
				if (t == 1) _self._showLoading('加载中...');
				// 发起请求
				uni.request({
					url: api.apiData.getClassData,
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
						_self.isTag = _self.homeData.tag.length ? true : false;
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
	}

	.mini-ad-list .mini-ad-item .mini-ad-icon image {
		/* width: 100%;
		height: 100%; */
		width: 60px;
		height: 60px;
		border-radius: 10upx;
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
</style>