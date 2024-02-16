<template>
	<view class="content">
		<css-loading ref="cssLoading"></css-loading>
		<view class="head-top" :style="{'padding-top':(top - h5H)+'px'}">
			<view class="head-left" @click="backUrl">
				<image src="/static/imgs/back.png" mode="aspectFill"></image>
			</view>
			<text style="flex: 1;line-height:30px;">{{title}}</text>
			<view class="head-left"></view>
		</view>
		<view class="center-content" :style="'padding-top:'+(top)+'px;padding-bottom:55px;'">
			<jyf-parser use-cache :html="content" ref="article" v-if="content && content.length>0"></jyf-parser>
			<view style="width:100%;margin:100px 0;text-align:center;" v-else-if="needBuy">
				<image src="/static/empty.png" style="width:100px;height:100px;"></image>
				<view style="width:100%;font-size:30upx;color:#fff;margin-top:30upx;">您尚未购买
					&laquo;{{parentTitle}}&raquo;专辑</view>
				<view class="buy_btn" @click="openPop">
					<text>￥{{parentGold || 0}}元购买{{parentCount || 0}}部</text>
				</view>
			</view>
			<view style="width:100%;margin:100px 0;text-align:center;" v-else>
				<image src="/static/empty.png" style="width:100px;height:100px;"></image>
				<view style="width:100%;font-size:25upx;color:#666;margin-top:30upx;">暂无内容</view>
			</view>
			<view class="content-body">
				<div class="content-body-after">{{dcount}}人已看</div>
				<view class="content-body-title">大家都在看</view>
				<view style="display: flex;flex-wrap: wrap;">
					<block v-for="(v, k) in list" :key="k">
						<view class="audio-item" @click="openPop(v)">
							<view class="audio-item-image">
								<image :src="v.cover" mode="aspectFill"></image>
							</view>
							<view class="audio-item-content">
								<rich-text class="audio-item-title" :nodes="parseTitle(v)">...</rich-text>
								<view class="audio-item-description">{{v.subtitle}}</view>
								<view class="audio-item-price">
									<view class="buy_btn1" v-if="v.alreadyBuy == 0 && v.gold > 0">￥{{v.gold}}</view>
									<view class="buy_btn1" v-else-if="v.is_vip == 1 && v.alreadyBuy == 0">VIP</view>
									<view class="buy_btn1" v-else-if="v.gold == 0 ">免费</view>
									<view class="buy_btn1" v-else>{{userInfo.isVip ? 'VIP免费' : '已购买'}}</view>
								</view>
							</view>
							<view class="audio-item-bottom" v-if="v.list & v.list.length > 0">
								<scroll-view class="center-scroll" scroll-x="true">
									<view v-for="(m, i) in v.list" class="center-scroll-item" @click="openPop(v,m)"
										:key="i">
										<view class="center-scroll-title">{{m.title}}</view>
										<view class="center-scroll-desc">{{m.description}}</view>
									</view>
								</scroll-view>
							</view>
						</view>
					</block>
				</view>
				</block>
			</view>
		</view>

		<view class="bottom-bar">
			<view class="bottom-bar-item" :class="{half:is_free == 0}" @click="doLike">
				<image src="/static/imgs/icon_like.png" mode="aspectFill"></image>
				<text>{{like}}</text>
			</view>
			<view class="bottom-bar-item" :class="{half:is_free == 0}"
				@click="api.jumpUrl('/pages/member/poster','new')">
				<image src="/static/imgs/icon_share.png" mode="aspectFill"></image>
				<text>分享</text>
			</view>
			<view class="bottom-bar-button" v-if="is_free == 1">
				<text class="color-buy" v-if="parentIsVip == 1 && !userInfo.isVip"
					@click="api.jumpUrl('/pages/recharge/recharge?type=2&book_album_id=' + parentId, 'new')">
					VIP专属,立即开通
				</text>
				<text class="color-buy" v-else-if="needBuy" @click="openPop(null)">
					限时￥<text class="nob">{{parentGold}}</text> 购入 <text class="nob">{{parentCount}}</text>部
				</text>
				<text class="color-albuy" v-else @click="api.jumpUrl('/pages/book/book_album?id=' + parentId, 'new')">
					{{parentGold == 0 ? '免费' : (userInfo.isVip ? 'VIP免费' : '已购买')}} <text
						class="nob">查看更多{{parentCount}}部</text>
				</text>
			</view>
		</view>
		<uni-popup ref="popupNotice" type="center" backColor="rgba(0,0,0,0.8)">
			<view class="notice-bg">
				<image class="notice_title" src="/static/img/buy_head.png" mode="aspectFill" />
				<view class="notice_title_text" :class="{moreTitle:popData.title.length > 10}">
					<text>购买专辑: <br v-if="popData.title.length > 10" /><text
							class="title">{{popData.title}}</text></text>
				</view>
				<view class="notice_content">
					<view class="notice_content_line_1">
						<text>实付<text class="redprice">{{popData.gold}}</text>金币</text>
					</view>
					<view class="notice_content_line_2">
						<text><text class="maintext">￥{{popData.gold}}</text>购买<text
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
				is_free: false,
				api: api,
				title: '小说详情',
				id: 0,
				content: '',
				parentId: 0,
				parentTitle: null,
				parentGold: null,
				parentCount: null,
				parentIsVip: null,
				userId: 0,
				dcount: 0,
				like: 0,
				phone: {},
				loadHeight: 28,
				top: 27,
				h5H: 43,
				did: 0,
				isLogin: false,
				userInfo: {
					nickname: '无名',
					is_vip: 0,
					money: 0,
				},
				needBuy: false,
				popData: {
					title: '',
					gold: 0.00,
					id: 0,
					count: 0,
					type: 'album'
				},
				list: []
			}
		},
		onLoad(e) {
			_self = this
			_self.id = e.id
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
				_self.getData()
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

			parseTitle(v) {
				return v.title.subCHStr(0,26) + '<span style="margin-left: 5px;font-size: 12px;color: #777;">' + v.count + '部小说</span>'
			},
			doLike() {
				uni.request({
					url: api.apiData.bookLike,
					method: 'POST',
					data: {
						userId: _self.userId,
						bookId: _self.id,
						type: 1
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						if (e.data.Code == 200) {
							_self.like = e.data.Data;
						}
						api.showToast(e.data.Msg, 3000);
					},
					fail: () => {
						api.showToast('服务器连接失败，请检查网络是否正常', 3000);
					}
				});
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
				api.jumpUrl('/pages/recharge/recharge?type=1&book_album_id=' + _self.popData.id, 'new');
			},
			openPop(b, m) {
				const v = b ? b : {
					title: _self.parentTitle,
					gold: _self.parentGold,
					count: _self.parentCount,
					id: _self.parentId,
					is_vip: _self.parentIsVip,
					alreadyBuy: !_self.needBuy
				};
				if (v.is_vip == 1 && !_self.userInfo.isVip) {
					uni.showModal({
						title: '温馨提示',
						content: '您需要开通VIP才能查看该内容',
						confirmText: '立即开通VIP',
						cancelText: '再考虑一下',
						success: function(res) {
							if (res.confirm) {
								api.jumpUrl('/pages/recharge/recharge?type=2&book_album_id=' + v.id,'new');
							}
						}
					});
				} else {
					if (v.alreadyBuy == 0 && v.gold > 0) {
						_self.popData.title = v.title
						_self.popData.gold = v.gold
						_self.popData.count = v.count
						_self.popData.id = v.id
						_self.$refs['popupNotice'].open();
					} else {
						if (m) {
							api.jumpUrl('/pages/book/book_album_detail?id=' + m.id, 'new')
						} else {
							api.jumpUrl("/pages/book/book_album?id=" + v.id, 'new')
						}
					}
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
						type: 'album',
						did: _self.did,
					},
					success: (res) => {
						if (res.data.Code != 200) {
							api.showToast(res.data.Msg, 2000);
							if (res.data.Code == 203) {
								_self.getData()
							}
						} else {
 							api.showToast(res.data.Msg, 2000);
							_self.$refs['popupNotice'].close();
							if(_self.popData.id != _self.parentId)
							{
									api.jumpUrl("/pages/book/book_album?id=" + _self.parentId, 'new')
							}
							_self.getData()
						}
					},
					fail: () => {
						api.showToast('网络连接失败，请检查网络是否正常', 2000);
					}
				});
			},
			backUrl() {
				api.jumpUrl('/pages/book/book_album?id=' + _self.parentId, 'old');
			},
			getData() {
				uni.request({
					url: api.apiData.getBookAlbumDetail + '/userId/' + _self.userId + '/id/' + _self.id,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var r = e.data;
						if (r.Code == 200) {
							_self.title = r.Data.title
							_self.dcount = r.Data.click
							_self.is_free = r.Data.is_free
							_self.content = r.Data.content
							_self.parentId = r.Data.parentId
							_self.parentTitle = r.Data.parentTitle
							_self.parentGold = r.Data.parentGold
							_self.parentCount = r.Data.parentCount
							_self.parentIsVip = r.Data.parentIsVip
							_self.like = r.Data.like_num
							_self.list = r.Data.list
							_self.needBuy = r.Data.alreadyBuy == 0 && r.Data.parentGold > 0
						} else {
							api.showToast(r.Msg, 2000);
							if (r.Code == 203) {
								_self.title = r.Data.title
								_self.dcount = r.Data.click
								_self.is_free = r.Data.is_free
								_self.content = r.Data.content
								_self.parentId = r.Data.parentId
								_self.parentTitle = r.Data.parentTitle
								_self.parentGold = r.Data.parentGold
								_self.parentCount = r.Data.parentCount
								_self.parentIsVip = r.Data.parentIsVip
								_self.like = r.Data.like_num
								_self.list = r.Data.list
								_self.needBuy = true
								_self.openPop()
							}
							if (r.Code == 204) {
								uni.showModal({
									title: '温馨提示',
									content: '您需要开通VIP才能查看该内容',
									confirmText: '立即开通VIP',
									cancelText: '再考虑一下',
									success: function(res) {
										if (res.confirm) {
											api.jumpUrl(
												'/pages/recharge/recharge?type=2&book_album_id=' +
												r.Data.parentId, 'new');
										}
										if (res.cancel) {
											uni.navigateBack()
										}
									}
								});
							}
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

	.moreTig {
		text-align: center;
		color: #999;
		font-size: 25upx;
		margin-top: 26upx;
		padding-bottom: 30upx;
	}

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
		background: #20202C;
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


	.center-content {
		background: #20202C;
		color: rgb(121, 120, 145);
		font-size: 28upx;
		line-height: 26px;
		padding: 10upx 20upx;
		box-sizing: border-box;
	}

	.buy_btn {
		width: 100%;
		height: 50px;
		color: #fffac3;
		background: url(../../static/book/gobug.png) center no-repeat;
		background-size: 100% auto;
		font-size: 16px;
		margin-top: 10px;
		padding-right: 30%;
		box-sizing: border-box;
		line-height: 48px;
		text-align: center;
	}

	.content-body {
		width: 100%;
		margin-top: 15px;
		position: relative;
		padding: 10px 5px;
		box-sizing: border-box;
	}

	.content-body:before {
		width: 100%;
		height: 1px;
		top: -5px;
		border-top: #999 1px dashed;
		position: absolute;
		left: 0;
		content: '';
	}

	.content-body-after {
		width: 120px;
		height: 20px;
		top: -15px;
		background: #20202C;
		position: absolute;
		left: 50%;
		margin-left: -60px;
		line-height: 20px;
		font-size: 24upx;
		color: #999;
		padding: 0 5px;
		box-sizing: border-box;
		text-align: center;
	}

	.content-body-title {
		width: 100%;
		margin-bottom: 10px;
		line-height: 40upx;
		font-size: 26upx;
		color: #D89720;
	}

	.audio-item {
		width: 100%;
		border-radius: 10px;
		color: #fff;
		font-size: 14px;
		display: inline-block;
		margin-bottom: 10px;
		box-sizing: border-box;
		padding: 10px 5px;
		background-color: #20202C;
		box-shadow: 4px 4px 6px 0px rgba(103, 103, 103, 0.1);
	}

	.audio-item-image {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		overflow: hidden;
		display: inline-block;
		vertical-align: top;
	}

	.audio-item-content {
		width: calc(100% - 60px);
		margin-left: 10px;
		height: 50px;
		display: inline-block;
		vertical-align: top;
		position: relative;
	}

	.audio-item-title {
		width: calc(100% - 70px);
		height: 28px;
		display: inline-block;
		line-height: 28px;
		font-size: 26upx;
		overflow: hidden;
		text-overflow: ellipsis;
		justify-content: left;
		white-space: nowrap;
	}

	.audio-item-description {

		width: calc(100% - 70px);
		height: 22px;
		display: inline-block;
		line-height: 22px;
		color: #999;
		font-size: 22upx;
		overflow: hidden;
		text-overflow: ellipsis;
		justify-content: left;
		white-space: nowrap;
		margin-top: -10px;
		vertical-align: top;
	}

	.audio-item-price {
		width: 70px;
		position: absolute;
		right: 0;
		top: -5px;
		height: 50px;
		vertical-align: top;
		padding: 5px;
		box-sizing: border-box;
	}

	.buy_btn1 {
		width: 100%;
		line-height: 40px;
		border-radius: 10px;
		font-size: 24upx;
		color: #fff;
		text-align: center;
		background: linear-gradient(to left, #ff6034, #ee0a24);
	}

	.audio-item-bottom {
		width: 100%;
		height: 60px;
		text-align: left;
		background-color: #20202C;
		margin: 0 auto;
		clear: both;
	}

	.center-scroll {
		white-space: nowrap;
	}

	.center-scroll-item {
		margin: 10upx;
		width: 29%;
		height: 60px;
		padding: 5upx;
		display: inline-block;
		box-sizing: border-box;
		_display: inline;
		*display: inline;
		zoom: 1;
		text-align: center;
		border-radius: 5px;
		background: rgba(255, 255, 255, 0.03);
		white-space: normal;
	}

	.center-scroll-title {
		color: #fff;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		justify-content: left;
		white-space: nowrap;
		height: 28px;
		line-height: 28px;
		width: 100%;
		display: inline-block;
		padding: 5upx;
		box-sizing: border-box;
		text-align: left;
		vertical-align: bottom;
	}

	.center-scroll-desc {
		color: #777;
		font-size: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: left;
		justify-content: left;
		white-space: nowrap;
		height: 20px;
		line-height: 20px;
		margin-top: -5px;
		vertical-align: top;
		width: 100%;
		display: inline-block;
		padding: 5upx;
		box-sizing: border-box;
	}

	.bottom-bar {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		background: #20202C;
		color: #777;
		display: flex;
		flex-direction: row;
		padding: 0 10upx;
		box-sizing: border-box;
	}

	.bottom-bar-item {
		width: 22%;
		height: 50px;
		text-align: center;
	}

	.bottom-bar-item.half {
		width: 50%;
	}

	.bottom-bar-item image {
		width: 26px;
		height: 26px;
		overflow: hidden;
		margin-top: 4px;
	}

	.bottom-bar-item text {
		width: 100%;
		margin-top: -5px;
		line-height: 26upx;
		font-size: 22upx;
		display: inline-block;
		vertical-align: top;
	}

	.bottom-bar-button {
		flex: 1;
		padding: 10upx;
		padding-top: 8upx;
		box-sizing: border-box;
	}

	.bottom-bar-button>text {
		font-style: italic;
		width: 100%;
		text-align: center;
		border-radius: 5px;
		height: calc(100% - 10upx);
		display: inline-block;
		font-size: 22upx;
		line-height: 2;
		box-sizing: border-box;
	}

	.bottom-bar-button>text .nob {
		font-size: 34upx !important;
		font-weight: bold;
		font-style: normal !important;
		margin: 0 5upx;
	}

	.color-buy {
		background: #ff4747;
		color: #fff;
	}

	.color-albuy {
		background: #eca730;
		color: #20202C;
		text-align: left !important;
		padding: 0 20upx;
		font-size: 34upx !important;
		font-weight: 400;
		font-style: normal !important;
	}

	.bottom-bar-button>text.color-albuy .nob {
		font-size: 22upx !important;
		float: right;
		color: #555;
		line-height: 3 !important;
		position: relative;
		padding-right: 15px;
	}

	.bottom-bar-button>text.color-albuy .nob:after {
		content: '►';
		position: absolute;
		right: 0;
	}
</style>
