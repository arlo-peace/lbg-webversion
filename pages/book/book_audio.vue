<template>
	<view class="content">
		<css-loading ref="cssLoading"></css-loading>
		<view class="head-top">
			<view class="head-left trans-bottom" @click="backUrl">
				<image src="/static/imgs/back.png" mode="aspectFill"></image>
			</view>
			<text class="head-title">{{detail.title}}</text>
			<view class="head-left"></view>
		</view>
		<view class="center-content">
			<view class="content-body">
				<view class="content-body-head">
					<view class="head-item">
						<text class="class" :class="tabId==0?'sel':''" @click="setTabId(0)">最新</text>
						<text class="class" :class="tabId==1?'sel':''" @click="setTabId(1)">最热</text>
					</view>
				</view>
				<view class="content-body-items">
					<block v-for="(v, k) in bookList" :key="k">
						<view class="audio-item" @click="openPop(v)">
							<view class="audio-item-image">
								<image :src="v.url" mode="aspectFill"></image>
							</view>
							<view class="audio-item-content">
								<view class="audio-item-title">{{v.title}}</view>
								<view class="audio-item-description">{{v.description}}</view>
								<view class="audio-item-price">
									<view class="buy_btn" v-if="v.alreadyBuy == 0 && v.price > 0">￥{{v.price}}</view>
									<view class="buy_btn" v-else-if="v.is_vip == 1">VIP</view>
									<view class="buy_btn" v-else-if="v.price == 0">免费</view>
									<view class="buy_btn" v-else>{{userInfo.isVip ? 'VIP免费' : '已购买'}}</view>
								</view>
							</view>
						</view>
					</block>
					<view class="moreTig" v-if="isMoreTig">——— 我是有底线的 ———</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popupNotice" type="center" backColor="rgba(0,0,0,0.8)">
			<view class="notice-bg">
				<image class="notice_title" src="/static/img/buy_head.png" mode="aspectFill" />
				<view class="notice_title_text" :class="{moreTitle:popData.title.length > 10}">
					<text>购买小说: <br v-if="popData.title.length > 10" /><text
							class="title">{{popData.title}}</text></text>
				</view>
				<view class="notice_content">
					<view class="notice_content_line_1">
						<text>实付<text class="redprice">{{popData.gold}}</text>金币</text>
					</view>
					<view class="notice_content_line_2"></view>
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
				api: api,
				detail: {},
				bookList: [],
				total: 0,
				count: 0,
				id: 0,
				userId: 0,
				tabId: 0,
				page: 1,
				row: 20,
				phone: {},
				loadHeight: 28,
				isLogin: false,
				top: 27,
				h5H: 62,
				isMoreTig: false,
				did: 0,
				userInfo: {
					nickname: '无名',
					is_vip: 0,
					money: 0,
				},
				popData: {
					title: '',
					gold: 0.00,
					id: 0,
					count: 0,
					type: 'album'
				}
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
		onPullDownRefresh() {
			_self.page = 1
			_self.bookList = []
			_self.getData()
		},
		onReachBottom() {
			if (_self.count > _self.page) {
				_self.page++;
				_self.getData();
			}
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
				api.jumpUrl('/pages/recharge/recharge?type=1&book_audio_id=' + _self.popData.id, 'new');
			},
			openPop(v) {
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
					return;
				}
				if (v.alreadyBuy == 0) {
					_self.popData.title = v.title
					_self.popData.gold = v.price
					_self.popData.id = v.id
					_self.$refs['popupNotice'].open();
				} else {
					api.jumpUrl("/pages/book/book_audio_detail?id=" + v.id, 'new')
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
						type: 'audio',
						did: _self.did,
					},
					success: (res) => {
						if (res.data.Code != 200 && res.data.Code != 203) {
							api.showToast(res.data.Msg, 2000);
						} else {
							api.showToast(res.data.Code == 200 ? "购买成功" : "您已购买过了", 1000);
							setTimeout(() => {
								api.jumpUrl("/pages/book/book_audio_detail?id=" + _self.popData.id,
									'new')
							}, 1000)
						}
					},
					fail: () => {
						api.showToast('网络连接失败，请检查网络是否正常', 2000);
					}
				});
			},
			setTabId(tabId) {
				_self.tabId = tabId
				_self.bookList = []
				_self.page = 1
				_self.getData()
			},
			backUrl() {
				api.jumpUrl('/pages/book/book', 'old');
			},
			getData() {
				uni.request({
					url: api.apiData.getBookAudio + '/userId/' + _self.userId + '/id/' + _self.id + '/page/' +
						_self.page + '/order/' + _self.tabId + '/row/' + _self.row,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var r = e.data;
						if (r.Code == 200) {
							_self.detail = r.Data.detail
							_self.bookList = _self.bookList.concat(r.Data.list)
							_self.total = r.Data.total
							_self.count = r.Data.count
							_self.isMoreTig = _self.count == _self.page
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

	.moreTig {
		text-align: center;
		color: #999;
		font-size: 25upx;
		margin-top: 26upx;
		padding-bottom: 30upx;
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
		height: calc(var(--status-bar-height) + 45px);
		padding-top: var(--status-bar-height);
	}

	.head-left image {
		width: 30px;
		height: 30px;
		margin-top: 1px;
		border-radius: 50%;
		opacity: 0.6;
		filter: alpha(opacity=60);
	}

	.head-title {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		justify-content: left;
		white-space: nowrap;
		line-height: 30px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.head-left {
		width: 30px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.center-content {
		width: 100%;
		height: auto;
		padding: 5px 10px;
		box-sizing: border-box;
		padding-top: calc(var(--status-bar-height) + 85px);
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

	.content-body-head {
		position: fixed;
		color: #999999;
		background-color: #1D1D28;
		height: 38px;
		z-index: 99;
		padding: 0 30rpx;
		padding-top: 10px;
	}

	.content-body-items {
		width: 100%;
		box-sizing: border-box;
		padding: 10px;
		padding-top: 50px;
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

	.buy_btn {
		width: 100%;
		line-height: 40px;
		border-radius: 10px;
		font-size: 24upx;
		color: #fff;
		text-align: center;
		background: linear-gradient(to left, #ff6034, #ee0a24)
	}
</style>
