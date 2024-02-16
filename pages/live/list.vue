<template>
	<view class="content">
		<css-loading ref="cssLoading"></css-loading>
		<view class="head-top" :style="{'padding-top':top+'px'}">
			<!-- <view class="top-one" style="width:93%;">
				<top-menu :nowUrl="'/pages/live/list'"></top-menu>
			</view> -->
			<view class="top-two" :style="{'padding-top':headTop+'px'}">
				<view @click="setTabId(0)">
					<text :class="tabId==0?'sel':''">关注</text>
				</view>
				<view @click="setTabId(1)">
					<text :class="tabId==1?'sel':''">推荐</text>
				</view>
				<view @click="setTabId(2)">
					<text :class="tabId==2?'sel':''">最新</text>
				</view>
				<view @click="setTabId(3)">
					<text :class="tabId==3?'sel':''">人气</text>
					<image src="/static/live/hot.png" mode="aspectFill"></image>
				</view>
				<view class="right" style="padding-right:15upx;margin-top:5upx;" @click="goSend">
					<!-- #ifndef H5 -->
					<text class="send-content">+ 直播</text>
					<!-- #endif -->
				</view>
			</view>
		</view>

		<view class="center-content" :style="{'margin-top':contentTop+'px'}">
			<view style="padding-top:10upx;">
				<view class="center-content-item" v-for="(m, i) in msgList" :key="i">
					<view class="center-top" @click="player(m)">
						<!-- <view class="live-gold">
							<text class="gold" style="color:#009688;">免费房</text>
						</view> -->
						<view class="live-gold" v-if="m.gold>0">
							<text class="gold" v-if="m.isBuy">已付费</text>
							<view class="gold" v-else>
								<view v-if="m.trySee">
									<text v-if="m.isTry>0 && m.isTry<m.tryTime">{{m.gold}}金币，已试看{{m.isTry}}分钟</text>
									<text v-else-if="m.isTry >= m.tryTime">{{m.gold}}金币，已试看结束</text>
									<text v-else>{{m.gold}}金币，可试看{{m.tryTime}}分钟</text>
								</view>
								<view v-else>
									<text>{{m.gold}}金币</text>
								</view>
							</view>
						</view>
						<!-- <image :src="m.cover" mode="aspectFill" class="live-cover"></image> -->
						<easy-loadimage mode="aspectFill" :scroll-top="scrollTop" :image-src="m.cover"
							:open-transition="true" class="live-cover">
						</easy-loadimage>
						<view class="live-info my-info">
							<view class="title">{{m.title}}</view>
							<view class="username">
								<image :src="m.head" mode="aspectFill" class="tx left"
									:style="{'margin-top':mTo+'upx'}"></image>
								<text>{{m.anchor}}</text>
								<text class="right">在线{{m.number}}人</text>
							</view>
						</view>
					</view>
				</view>

				<view class="moreTig" v-if="isMoreTig">——— 我是有底线的 ———</view>
			</view>
			<!-- #ifndef H5 -->
			<view style="width:100%;text-align:center;" :style="{'margin-top':(phone.windowHeight/2) - 200 +'px'}"
				v-if="isShowTig" @click="goSend">
				<image src="/static/live/player.png" style="width:180upx;height:170upx;"></image>
				<view class="im-player">我要开直播</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view style="width:100%;text-align:center;" :style="{'margin-top':(phone.windowHeight/2) - 200 +'px'}"
				v-if="isShowTig">
				<image src="/static/live/player.png" style="width:180upx;height:170upx;"></image>
				<view class="im-player">暂无直播数据</view>
			</view>
			<!-- #endif -->
		</view>

		<!-- <view class="bottom-my-bg" @click="skipUrl('/pages/member/member', 'tab')">
			<image src="/static/imgs/user_ok.png" mode="aspectFill"></image>
		</view> -->

		<uni-popup ref="popupBuy" type="center">
			<view class="popup-buy">
				<image src="/static/imgs/nt.png" class="popup-bg-xx"></image>
				<view class="buy-title">主播提示您</view>
				<view class="buy-content">需要支付{{buyInfo.gold}}金币方可观看直播</view>
				<view class="buy-btn">
					<text class="btn" @click="buyGoldRoom(buyInfo)">扣币进入</text>
					<view class="btn right" v-if="buyInfo.trySee">
						<text v-if="buyInfo.isTry>0 && buyInfo.isTry<buyInfo.tryTime"
							@click="goRoom(buyInfo.id, 500)">继续试看{{buyInfo.tryTime - buyInfo.isTry}}分钟</text>
						<text v-else-if="buyInfo.isTry >= buyInfo.tryTime">已试看结束</text>
						<text v-else @click="goRoom(buyInfo.id, 500)">试看{{buyInfo.tryTime}}分钟</text>
					</view>
					<view class="btn right" v-else @click="noBuy">取消</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import api from "@/common/api.js";
	import utils from '@/components/shoyu-date/utils.filter.js';
	import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue';
	import cssLoading from '@/components/css-loading/loading.vue'
	var _self;
	export default {
		components: {
			easyLoadimage,
			cssLoading
		},
		// 滚动监听事件
		onPageScroll({
			scrollTop
		}) {
			_self.scrollTop = scrollTop;
		},
		data() {
			return {
				scrollTop: 1,
				utils: utils,
				loading: true,
				isLogin: false,
				userId: 0,
				top: 0,
				phone: {},
				tabId: 2,
				contentTop: 35,
				isShowTig: false,
				one: false,

				msgList: [],
				page: 1,
				isMoreTig: false,
				loadingHieght: 100,
				isAnchor: false,

				vipFree: false, //VIP进收费房是否收费
				isVip: false, //是否为VIP

				buyInfo: {}, //收费金币数

				mTo: 12,
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
			_self.mTo = _self.phone.platform == 'ios' ? '8' : '12';
			_self.top = 5;
			_self.contentTop = _self.top + 50;
			_self.loadingHieght = _self.phone.windowHeight - _self.top;
			// #ifdef H5
			_self.headTop = 44;
			_self.h5Top = 30;
			// #endif
			_self.getData();
		},
		onHide() {
			let timer = setTimeout(() => {
				_self.one = _self.loading = true;
				clearTimeout(timer);
			}, 500);
		},
		onShow() {
			_self.isLogin = api.getLogins();
			if (_self.one) {
				_self._showLoading()
				if (_self.isLogin) _self.userId = _self.isLogin.userId;
				_self.setTabId(_self.tabId);
			}
		},
		methods: {
			_showLoading(text = null) {
				this.$nextTick(() => {
					this.$refs.cssLoading.open(text)
				})
			},
			_hideLoading() {
				this.$nextTick(() => {
					this.$refs.cssLoading.close()
				})
			},
			noBuy() {
				_self.$refs.popupBuy.close();
			},
			player(i) {
				//console.log(i)
				if (!_self.isLogin) {
					api.showToast('登录已超时或未登录');
					let timer = setTimeout(() => {
						_self.skipUrl('/pages/login/login', 'new');
						clearTimeout(timer);
					}, 500);
					return
				}
				if (i.disable) {
					api.showToast('您已被主播拉入黑名单', 2000);
					return
				}
				if (!i.status) {
					api.showToast('直播间暂未开启', 2000);
					return
				}
				if (!_self.vipFree && _self.isVip) {
					_self.goRoom(i.id, 0);
					return;
				}
				if (i.gold > 0 && !i.isBuy) {
					_self.buyInfo = i;
					_self.$refs.popupBuy.open();
				} else {
					_self.goRoom(i.id, 0);
				}
			},
			buyGoldRoom(i) {
				_self._showLoading('付费中...');
				uni.request({
					url: api.apiData.buyGoldRoom,
					method: 'POST',
					data: {
						anchorId: i.id,
						userId: _self.userId
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						//console.log(i.id); 
						var r = e.data;
						api.showToast(r.Msg, 2000);
						if (r.Code == 200) {
							_self.noBuy();
							setTimeout(() => {
								_self.goRoom(i.id, 0);
							}, 1000);
						}
					},
					fail: () => {
						api.showToast("服务器连接失败，请检查网络是否正常", 3000);
					}
				});
			},
			goRoom(id, t) {
				if (t != 0) _self.noBuy();
				setTimeout(() => {
					_self.skipUrl('/pages/live/player?t=0&aid=' + id, 'new');
				}, t)
			},
			goSend() {
				// #ifdef APP-PLUS
				if (!_self.isLogin) {
					api.showToast('请先登录');
					setTimeout(() => {
						_self.skipUrl('/pages/login/login', 'new');
					}, 500);
				} else {
					if (_self.isAnchor) {
						_self.skipUrl('/pages/live/player?t=1', 'new');
					} else {
						_self.skipUrl('/pages/live/reg_anchor', 'new');
					}
				}
				// #endif
			},
			setTabId(t) {
				if (t == 0 && _self.isLogin == false) {
					api.showToast('请先登录');
					setTimeout(() => {
						_self.skipUrl('/pages/login/login', 'new');
					}, 500);
					return;
				}
				_self.tabId = t;
				_self.page = 1;
				_self.loading = true;
				_self._showLoading()
				_self.msgList = [];
				_self.getData();
			},
			getData() {
				if (_self.page > 1) _self._showLoading('正在加载...');
				uni.request({
					url: api.apiData.getAnchorList,
					method: 'POST',
					data: {
						page: _self.page,
						type: _self.tabId,
						userId: _self.userId
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var r = e.data;
						if (r.Code == 200) {
							_self.isAnchor = r.Data.isAnchor;
							var msgList = r.Data.list;
							_self.vipFree = r.Data.vipFree;
							_self.isVip = r.Data.isVip;
							//uni.setStorageSync('server_ipUrl_'+api.appkey, r.Data.server);
							if (_self.page > 1) {
								if (msgList.length > 0) {
									_self.isMoreTig = false;
									_self.msgList = _self.msgList.concat(msgList);
								} else {
									_self.isMoreTig = true;
								}
							} else {
								_self.isMoreTig = false;
								_self.msgList = msgList;
								_self.isShowTig = msgList.length == 0 ? true : false;
								//_self.isShowTig = true;
								//console.log(msgList.length)
							}
							//console.log(msgList.length);
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
			// 跳转登录
			skipUrl(uri = '/pages/login/login', type = 'new') {
				api.jumpUrl(uri, type)
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

	.popup-bg-xx {
		width: 230upx;
		height: 200upx;
		position: absolute;
		right: 0upx;
		top: -80upx
	}

	.buy-btn .btn {
		display: inline-block;
		padding: 0 30upx;
		height: 70upx;
		line-height: 70upx;
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		border-radius: 13upx;
		color: #FFFFFF;
		text-align: center;
		font-size: 12px;
		box-shadow: inset 0px 1px rgba(255, 255, 255, 0.4), 0 3px 8px rgba(0, 0, 0, 0.5);
	}

	.buy-content {
		margin: 30upx 0 40upx;
	}

	.buy-title {
		font-size: 33upx;
		font-weight: bold;
	}

	.popup-buy {
		font-size: 30upx;
		width: 500upx;
		color: #666;
		padding: 30upx 30upx;
		border-radius: 15upx;
		background-color: #FFFFFF;
		box-shadow: inset 0px 1px rgba(255, 255, 255, 0.4), 0 3px 8px rgba(0, 0, 0, 0.5);
	}

	.my-info {
		color: #fff;
		border-radius: 0 0 15upx 15upx;
		font: 16px;
		line-height: 25px;
		font-weight: 300;
		text-shadow: #000 0 1px 0;
		background-color: rgba(0, 0, 0, 0.25);
	}

	.im-player {
		width: 30%;
		font-size: 25upx;
		height: 70upx;
		line-height: 70upx;
		color: #FFFFFF;
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		margin: 30upx auto;
		border-radius: 50upx;
	}

	.live-gold .gold {
		display: inline-block;
		padding: 0upx 20upx;
		height: 50upx;
		line-height: 50upx;
		background-color: rgba(255, 12, 208, 0.7);
		border-radius: 15upx 0 0 15upx;
	}

	.live-gold {
		float: right;
		font-size: 24upx;
		color: #FFFFFF;
		margin-bottom: -70upx;
		margin-top: 20upx;
		position: relative;
		z-index: 2;
	}

	.live-info .tx {
		width: 30upx;
		height: 30upx;
		border-radius: 50%;
		border: 1px solid #B01A1C;
		//margin-top: 12upx;
		margin-right: 8upx;
	}

	.live-info .title {
		font-size: 28upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin: 0 15upx;
	}

	.live-info .username {
		font-size: 24upx;
		margin: -10upx 15upx 0;
		//background-color: #009688;
	}

	.live-info {
		position: relative;
		background-color: rgba(0, 0, 0, 0.25);
		margin-top: -45px;
		//bottom: 0;
		color: #FFFFFF;
	}

	.live-cover {
		width: 100%;
		height: 430upx;
		border-radius: 15upx;
		background-color: #444;
	}

	.live-cover>>>.origin-img {
		border-radius: 15upx;
	}

	.plaza-ad image {
		margin: -20upx 0 -25upx 0 !important;
		width: 100%;
		border-radius: 15upx;
	}

	.moreTig {
		text-align: center;
		color: #ccc;
		font-size: 25upx;
		margin-top: 26upx;
		padding-bottom: 30upx;
		//background: #007AFF;
		//padding-bottom: 30px;
	}

	.send-content {
		color: #FFFFFF;
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		border-radius: 10upx;
		padding: 6upx 16upx;
		font-size: 12px;
	}

	.content-bottom .msg {
		width: 35upx;
		height: 30upx;
		margin-bottom: -5upx;
		margin-left: 5upx;
		//display: inline-block;
	}

	.content-bottom {
		margin: 20upx 3% 5upx;
		background-color: #F5F5F5;
		border-radius: 10upx;
		font-size: 26upx;
		text-align: center;
		color: #666666;
		height: 60upx;
		line-height: 60upx;
	}

	.center-content-text .more {
		display: inline-block;
		width: 80upx;
		height: 40upx;
		line-height: 40upx;
		border-radius: 10upx;
		color: #FFFFFF;
		text-align: center;
		font-size: 24upx;
		margin-right: 10upx;
		background-color: #007AFF;
	}

	.center-content-text {
		font-size: 28upx;
		margin-bottom: 20upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		//background-color: #009688;
	}

	.center-top-img {
		width: 110upx;
		height: 110upx;
		position: absolute;
		left: 3%;
		margin-top: -22upx;
		z-index: 3;
	}

	.center-content-center {
		margin: 20upx 3% 0;
		font-size: 26upx;
		//height: 100upx;
		//background-color: #007AFF;
	}

	.center-top .go-home image {
		width: 40upx;
		height: 40upx;
		margin: 15upx 5upx;
	}

	.center-top .go-home {
		height: 70upx;
		line-height: 70upx;
		padding: 0 20upx;
		font-size: 26upx;
		border-radius: 10upx;
		margin-top: 14upx;
		color: #FFFFFF;
		background-image: linear-gradient(to right, rgba(255, 12, 208, 0.8), rgba(254, 67, 101, 0.8));
	}

	.center-top {
		//background-color: #007AFF;
	}

	.center-content-item {
		width: 46%;
		display: inline-block;
		margin-left: 2.5%;
		margin-bottom: 20upx;
		border-radius: 15upx;
		border: 1px solid rgba(255, 255, 255, 0.06);
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
		color: #999;
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
		//height: 85px;
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

	page {
		//background-color: #F5F5F5;
	}
</style>