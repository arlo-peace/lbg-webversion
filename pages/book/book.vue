<template>
	<view class="content">
		<css-loading ref="cssLoading"></css-loading>

		<view class="head-top" :style="{'top':(top - h5H)+'px'}">
			<view class="head-left" @click="backUrl">
				<image src="/static/imgs/back.png" mode="aspectFill"></image>
			</view>
			<text style="flex: 1;">小说</text>
			<view class="head-left"></view>
		</view>
		<view class="center-content">
			<view class="head" :style="'padding-top:'+(top - 10)+'px'">
				<view class="head-item">
					<text class="class" :class="tabId==0?'sel':''" @click="setTabId(0)">文字小说</text>
					<text class="class" :class="tabId==1?'sel':''" @click="setTabId(1)">有声小说</text>
					<text class="class" :class="tabId==2?'sel':''" @click="setTabId(2)">VIP专区</text>
				</view>
			</view>
			<!--轮播图-->
			<view :style="'padding-top:'+(top + 30)+'px'">
				<view class="head-item">
					<view class="head-search" @click="api.jumpUrl('/pages/book/search?type=' + tabId, 'new')">
						<image style="width:15px;height:15px;" src="/static/imgs/search.png"></image>
						<text style="font-size:12px;margin-left:5px;color:#777;">输入关键字</text>
					</view>
				</view>
				<view class="head-banner" v-if="isBanner">
					<swiper class="swiper" circular interval="3000" :autoplay="true" :indicator-dots="true"
						indicator-color="rgba(255,255,255,0.4)" indicator-active-color="rgba(255,255,255,0.8)">
						<swiper-item class="item" v-for="(b, i) in banner" :key="i" @click="api.jumpUrl(b.url, 'web')">
							<image :src="b.images_url" mode="aspectFill"></image>
						</swiper-item>
					</swiper>
				</view>
				<view class="menu-list" v-if="tabId == 2">
					<view class="menu-item" @click="setMtype(0)">
						<image src="/static/img/book_audio.png"></image>
					</view>
					<view class="menu-item" @click="setMtype(1)">
						<image src="/static/img/book_album.png"></image>
					</view>
				</view>

				<view class="class-list">
					<block v-if="mtype == 0">
						<block v-for="(v, k) in bookList" :key="k">
							<view class="class-item" v-if="v.list.length > 0">
								<view class="class-name">
									<text>{{v.title}}</text>
									<text style="font-size:12px;margin-left:5px;color:#777">{{v.subtitle}}</text>
									<text class="r" style="color:#777;"
										@click="v.alreadyBuy == 0 && v.gold > 0 ? openPop(v) : clickVip(v)">更多</text>
								</view>
								<view class="book-list">
									<view class="book-item" v-for="(b, i) in v.list" :key="i"
										@click="showBook('album',b,v)">
										<text class="book-title">{{b.title}}</text>
										<text class="book-read">{{b.click}}次阅读</text>
										<text class="book-description"
											v-if="b.description.length > 0">{{b.description}}</text>
									</view>
								</view>
								<view class="buy_btn" @click="openPop(v)" v-if="v.alreadyBuy == 0 && v.gold > 0 ">
									<text>￥{{v.gold || 0}}元购买{{v.count || 0}}部</text>
								</view>
								<view class="tip_btn" v-else @click="clickVip(v)">
									<text>观看“{{v.title}}”类全部内容</text>
								</view>
							</view>
						</block>
					</block>
					<block v-if="mtype == 1">
						<block v-for="(v, k) in bookList" :key="k">
							<view class="class-item" v-if="v.list.length > 0">
								<view class="class-name">
									<text>{{v.name}}</text>
									<text class="r" style="color:#777;"
										@click="api.jumpUrl('/pages/book/book_audio?id='+v.id, 'new')">更多</text>
								</view>
								<view class="book-list">
									<view class="book-item" v-for="(b, i) in v.list" :key="i"
										@click="showBook('audio',b,v)">
										<text class="book-title">{{b.title}}</text>
										<text class="book-read">{{b.click}}次阅读</text>
										<text class="book-description"
											v-if="b.description.length > 0">{{b.description}}</text>
									</view>
								</view>
							</view>
						</block>
					</block>
					<view style="width:100%;margin:100px 0;text-align:center;" v-if="isNotData">
						<image src="/static/empty.png" style="width:100px;height:100px;"></image>
						<view style="width:100%;font-size:25upx;color:#666;margin-top:30upx;">本页面暂无内容</view>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popupNotice" type="center" backColor="rgba(0,0,0,0.8)">
			<view class="notice-bg">
				<image class="notice_title" src="/static/img/buy_head.png" mode="aspectFill" />
				<view class="notice_title_text" :class="{moreTitle:popData.title.length > 10}">
					<text>购买{{popData.type == 'album' ? '专辑' : '小说'}}: <br v-if="popData.title.length > 10" /><text
							class="title">{{popData.title}}</text></text>
				</view>
				<view class="notice_content">
					<view class="notice_content_line_1">
						<text>实付<text class="redprice">{{popData.gold}}</text>金币</text>
					</view>
					<view class="notice_content_line_2">
						<text v-if="popData.type == 'album'"><text class="maintext">￥{{popData.gold}}</text>购买<text
								class="maintext">{{popData.count}}</text>部</text>
					</view>
					<view class="notice_content_line_3">
						<text class="buy_btn_small" @click="buyBook">立即支付</text>
					</view>
					<view class="notice_content_line_4">
						<text>可用金币： {{userInfo.corn}}</text>
						<text @click="gotoRecharge" class="link">去充值 &gt;</text>
					</view>
					<view class="notice_content_line_5">
						<text>价格随作品数量逐步递增,越早买越省钱</text>
					</view>
				</view>
				<view style="height:50upx;"></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import api from "@/common/api.js"
	var _self;
	export default {
		data() {
			return {
				loading: true,
				isBanner: false,
				phone: {},
				banner: [],
				tabId: 0,
				did: 0,
				userId: 0,
				api: api,
				bookList: [],
				isNotData: false,
				loadHeight: 28,
				userInfo: {
					nickname: '无名',
					is_vip: 0,
					money: 0,
				},
				top: 27,
				h5H: 43,
				mtype: 0,
				popData: {
					title: '',
					gold: 0.00,
					id: 0,
					count: 0,
					type: 'album'
				}
			}
		},
		onLoad() {
			_self = this;
			_self.phone = uni.getSystemInfoSync();
			_self.top = _self.phone.statusBarHeight + 53;
			_self._showLoading()
			// 是否登录
			var info = api.getLogins();
			if (info === false) {
				_self._showLoading('加载中...');
				_self.skipUrl();
			} else {
				_self.userId = info.userId;
				_self.getUserInfo();
				_self.getHomeData();
				uni.getStorage({
					key: 'mobileDid_' + api.appkey,
					success: (res) => {
						_self.did = res.data.data;
						if (!_self.did) _self.did = res.data;
					}
				});
			}
			// #ifdef APP-PLUS
			_self.loadHeight = _self.phone.screenHeight;
			// #endif
			// #ifdef H5 || MP-WEIXIN
			_self.loadHeight = _self.phone.windowHeight;
			// #endif
		},
		methods: {
			skipUrl(uri = '/pages/login/login', type = 'new') {
				api.jumpUrl(uri, type);
			},
			getUserInfo() {
				uni.request({
					url: api.apiData.getInfo,
					method: 'POST',
					data: {
						userId: _self.userId
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						//console.log(e)
						if (e.data.Code == 200) {
							_self.userInfo = e.data.Data;
						} else {
							api.delLogins();
							_self.isLogin = false;
						}
						var timer = setTimeout(() => {
							_self.loading = false;
							_self._hideLoading()
							clearTimeout(timer);
						}, 300)
					},
					fail: () => {
						api.showToast('服务器连接失败，请检查网络是否正常', 3000);
					}
				});
			},
			gotoRecharge() {
				api.jumpUrl('/pages/recharge/recharge?type=1&book_' + _self.popData.type + '_id=' + _self.popData.id,
					'new');
			},
			clickVip(v, t = 'album') {
				if (v.is_vip == 1 && !_self.userInfo.isVip) {
					uni.showModal({
						title: '温馨提示',
						content: '您需要开通VIP才能查看该内容',
						confirmText: '立即开通VIP',
						cancelText: '再考虑一下',
						success: function(res) {
							if (res.confirm) {
								api.jumpUrl('/pages/recharge/recharge?type=2&book_' + t +
									'_id=' + v.id, 'new');
							}
						}
					});
				} else {
					api.jumpUrl('/pages/book/book_' + t + '?id=' + v.id, 'new')
				}
			},
			openPop(v, t = 'album') {
				if (v.alreadyBuy == 0) {
					if (v.is_vip == 1 && !_self.userInfo.isVip) {
						uni.showModal({
							title: '温馨提示',
							content: '您需要开通VIP才能查看该内容',
							confirmText: '立即开通VIP',
							cancelText: '再考虑一下',
							success: function(res) {
								if (res.confirm) {
									api.jumpUrl('/pages/recharge/recharge?type=2&book_' + _self.popData.type +
										'_id=' + _self.popData.id, 'new');
								}
							}
						});
					} else {
						_self.popData.type = t
						_self.popData.title = v.title
						_self.popData.gold = v.gold
						_self.popData.count = v.count
						_self.popData.id = v.id
						_self.$refs['popupNotice'].open();
					}
				} else {
					api.showToast("您已经购买了该小说", 1000)
				}
			},
			buyBook() {
				uni.request({
					url: api.apiData.buyBook,
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						bookId: _self.popData.id,
						userId: _self.userId,
						type: _self.popData.type,
						did: _self.did,
					},
					success: (res) => {
						if (res.data.Code != 200) {
							api.showToast(res.data.Msg, 2000);
							if (res.data.Code == 203) {
								if (_self.popData.type == 'audio') {
									api.jumpUrl("/pages/book/book_audio_detail?id=" + _self.popData.id, 'new')
								} else {
									api.jumpUrl("/pages/book/book_album?id=" + _self.popData.id, 'new')
								}
							}
						} else {
							api.showToast("购买成功", 1000);
							setTimeout(() => {
								if (_self.popData.type == 'audio') {
									api.jumpUrl("/pages/book/book_audio_detail?id=" + _self.popData.id,
										'new')
								} else {
									api.jumpUrl("/pages/book/book_album?id=" + _self.popData.id, 'new')
								}
							}, 1000)
						}
					},
					fail: () => {
						api.showToast('网络连接失败，请检查网络是否正常', 2000);
					}
				});
			},
			showBook(type, b, v) {
				if (type == 'audio') {
					if (b.gold > 0 && b.alreadyBuy == 0) {
						_self.openPop(b, 'audio')
					} else {
						if (b.is_vip == 1 && !_self.userInfo.isVip) {
							uni.showModal({
								title: '温馨提示',
								content: '您需要开通VIP才能查看该内容',
								confirmText: '立即开通VIP',
								cancelText: '再考虑一下',
								success: function(res) {
									if (res.confirm) {
										api.jumpUrl('/pages/recharge/recharge?type=2&book_audio_id=' + b.id,
											'new');
									}
								}
							});
						} else {
							api.jumpUrl("/pages/book/book_audio_detail?id=" + b.id, 'new')
						}
					}
				} else {
					if (v.gold > 0 && v.alreadyBuy == 0 && b.is_free == 0) {
						_self.openPop(v)
					} else {
						if (v.is_vip == 1 && !_self.userInfo.isVip) {
							uni.showModal({
								title: '温馨提示',
								content: '您需要开通VIP才能查看该内容',
								confirmText: '立即开通VIP',
								cancelText: '再考虑一下',
								success: function(res) {
									if (res.confirm) {
										api.jumpUrl('/pages/recharge/recharge?type=2&book_album_id=' + v.id,
											'new');
									}
								}
							});
						} else {
							api.jumpUrl("/pages/book/book_album_detail?id=" + b.id, 'new')
						}
					}
				}
			},
			setTabId(tabId) {
				_self.tabId = tabId
				if (_self.tabId < 2) {
					_self.mtype = tabId
				} else {
					_self.mtype = 0
				}
				_self.bookList = []
				_self.getHomeData()
			},
			setMtype(mtype) {
				_self.mtype = mtype
				_self.bookList = []
				_self.getHomeData()
			},
			backUrl() {
				api.jumpUrl('/pages/video/class', 'tab');
			},
			getHomeData() {
				var url = api.apiData.getBook + '/userId/' + _self.userId
				if (_self.tabId != 2) {
					url += "/order/0/mtype/" + _self.mtype
				} else {
					url += "/order/2/mtype/" + _self.mtype
				}
				uni.request({
					url: url,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var r = e.data;
						if (r.Code == 200) {
							_self.banner = r.Data.banner
							_self.isBanner = _self.banner && _self.banner.length > 0
							_self.bookList = r.Data.list
							_self.isNotData = !_self.bookList || _self.bookList.length == 0
						} else {
							api.showToast(r.Msg, 2000);
						}

					},
					fail: () => {
						api.showToast("服务器连接失败，请检查网络是否正常", 3000);
					},
					complete: () => {
						setTimeout(() => {
							_self.loading = false;
							_self._hideLoading()
						}, 500);
					}
				});

			}
		}
	}
</script>

<style>
	@import url('@/components/loading/loading.css');

	.notice_content {
		width: 90%;
		height: 500upx;
		padding: 0 5%;
		margin-top: 25upx;
		position: relative;
	}

	.notice_title {
		width: 100%;
		height: 146upx;
	}

	.notice_title_text {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 146upx;
		line-height: 138upx;
		font-size: 36upx;
		text-align: center;
		color: #fff;
	}

	.notice_title_text.moreTitle {
		line-height: 48upx;
	}

	.notice_title_text .title {
		font-size: 34upx;
		font-weight: bold;
		margin-left: 10upx;
	}

	.notice-bg {
		width: 600upx;
		border-radius: 60upx;
		background-color: #FFFFFF;
	}

	.notice_content_line_1 {
		width: 100%;
		text-align: center;
		font-size: 40upx;
		height: 40px;
		line-height: 30px;
		font-weight: 500;
	}

	.notice_content_line_1 .redprice {
		font-size: 56upx;
		color: #F9221D;
		margin: 0 5px;
	}

	.notice_content_line_2 {
		width: 100%;
		text-align: center;
		font-size: 32upx;
		height: 90px;
		line-height: 40upx;
		font-weight: 500;
	}

	.notice_content_line_2 .maintext {
		font-size: 28upx;
		margin: 0 3px;
	}

	.notice_content_line_3 {
		width: 100%;
		height: 46px;
		padding: 3px 10px;
		box-sizing: border-box;
	}

	.notice_content_line_3 .buy_btn_small {

		width: 100%;
		height: 100%;
		line-height: 40px;
		border-radius: 20px;
		font-size: 26upx;
		color: #fff;
		text-align: center;
		display: inline-block;
		background: linear-gradient(to left, #ff6034, #ee0a24)
	}

	.notice_content_line_4 {
		width: 100%;
		height: 40px;
		line-height: 40px;
		font-size: 32upx;
		font-weight: 400;
		text-align: center;
	}

	.notice_content_line_4 .link {
		color: #F9221D;
		margin-left: 10px;
	}

	.notice_content_line_5 {
		width: 100%;
		height: 30px;
		line-height: 30px;
		font-size: 24upx;
		font-weight: 400;
		text-align: center;
		color: #999;
	}

	.head-top {
		width: 100%;
		text-align: center;
		position: fixed;
		color: #FFF;
		z-index: 991;
		display: flex;
		flex-direction: row;
		padding: 0 10upx;
	}

	.head-left image {
		width: 30px;
		height: 30px;
		margin-top: 1px;
		border-radius: 50%;
		opacity: 0.6;
		filter: alpha(opacity=60);
	}

	.head-left {
		width: 30px;
	}

	.book-item {
		width: calc(100% - 10px);
		border-radius: 10px;
		background: #000;
		color: #fff;
		margin-top: 15px;
		box-sizing: border;
		padding: 5px;
	}

	.book-title {
		width: calc(100% - 100px);
		height: 30px;
		line-height: 28px;
		font-weight: 500;
		display: inline-block;
		font-size: 16px;
		overflow: hidden;
		text-overflow: ellipsis;
		justify-content: left;
		white-space: nowrap;
	}

	.book-read {
		width: 100px;
		display: inline-block;
		font-size: 12px;
		color: #777;
		text-align: right;
		height: 30px;
		line-height: 28px;
		vertical-align: top;
	}

	.book-title:before {
		width: 12px;
		height: 12px;
		border: #F9221D 4px solid;
		border-radius: 50%;
		content: '';
		display: inline-block;
		margin: 0 5px;
		vertical-align: middle;
	}

	.book-description {
		text-indent: 20px;
		width: 100%;
		display: inline-block;
		font-size: 14px;
		color: #C8C7CC;
		height: 30px;
		line-height: 28px;
		overflow: hidden;
		text-overflow: ellipsis;
		justify-content: left;
		white-space: nowrap;
	}




	.class-name {
		height: 20px;
		line-height: 20px;
		border-left: 6px solid #F9221D;
		border-radius: 3px;
		font-size: 14px;
		color: #FFFFFF;
		padding-left: 10px;
	}

	.class-item {
		margin-bottom: 15px;
	}

	.class-list {
		padding: 0 30rpx;
		margin-top: 15px;
	}

	.menu-item image {
		width: 150px;
		height: 50px;
	}


	.menu-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 50%;
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
		margin-right: 15px;
		border-bottom: 2px solid #1D1D28;
	}

	.head-item {
		display: flex;
		flex-direction: row;
		margin-bottom: 10px;
		width: 694rpx;
		margin-left: 30rpx;
	}

	.head .head-item {
		margin-left: 0;
	}

	.head {
		position: fixed;
		color: #999999;
		background-color: #1D1D28;
		height: 28px;
		z-index: 99;
		padding: 0 30rpx;
	}

	.r {
		float: right;
	}

	.l {
		float: left;
	}

	.buy_btn {
		width: 100%;
		height: 70px;
		color: #fffac3;
		background: url(../../static/book/gobug.png) right no-repeat;
		background-size: auto 70px;
		font-size: 21px;
		margin-top: 10px;
		padding-left: 10%;
		box-sizing: border-box;
		line-height: 70px;
		text-align: left;
		border-radius: 100px;
		background-color: #262626;

	}

	.tip_btn {
		width: 100%;
		height: 40px;
		color: rgb(250, 160, 5);
		background: rgb(117, 117, 117);
		background-size: 100% auto;
		font-size: 16px;
		margin-top: 10px;
		box-sizing: border-box;
		line-height: 38px;
		text-align: center;
		border-radius: 20px;
		font-weight: 600;
	}
</style>
