<template>
	<view class="content">
		<css-loading ref="cssLoading"></css-loading>
		<view class="head-top" :style="{'padding-top':top+'px'}">
			<!-- <view class="top-one" style="width:93%;">
				<top-menu :nowUrl="'/pages/image/list'"></top-menu>
			</view> -->
			<view class="top-two" :style="{'padding-top':headTop+'px'}">
				<!-- <view @click="setTabId(1)">
					<text :class="tabId==1?'sel':''">我的</text>
				</view> -->
				<view @click="setTabId(2)">
					<text :class="tabId==2?'sel':''">最新</text>
				</view>
				<view @click="setTabId(3)">
					<text :class="tabId==3?'sel':''">热门</text>
					<image src="/static/plaza/hot.png" mode="aspectFill"></image>
				</view>
				<view @click="setTabId(4)">
					<text :class="tabId==4?'sel':''">同城</text>
				</view>
				<!-- <view class="right" style="padding-right:15upx;margin-top:5upx;" @click="goSend">
					<text class="send-content">+ 发布</text>
				</view> -->
			</view>
		</view>
		<view class="center-content" :style="{'margin-top':contentTop+'px'}">
			<view class="center-content-bg">
				<view class="center-content-item" v-for="(m, i) in leftData" :key="i" @click="userWatch(i, 'leftData')">
					<easy-loadimage mode="aspectFill" :scroll-top="scrollTop" :image-src="m.cover"
						:open-transition="true" class="content-cover">
					</easy-loadimage>
					<view class="content-gold" v-if="m.gold>0 && m.isBuy">已购买</view>
					<view class="content-gold" v-if="m.gold>0 && !m.isBuy">{{m.gold}}金币</view>
					<view class="content-gold" v-if="m.gold == 0 && m.is_vip != 1">免费</view>
					<view class="content-title">{{m.title}}</view>
				</view>
			</view>
			<view class="center-content-bg">
				<view class="center-content-item" v-for="(m, i) in rightData" :key="i"
					@click="userWatch(i, 'rightData')">
					<easy-loadimage mode="aspectFill" :scroll-top="scrollTop" :image-src="m.cover"
						:open-transition="true" class="content-cover">
					</easy-loadimage>
					<view class="content-vip" v-if="m.is_vip == 1">VIP专属</view>
					<view class="content-gold" v-if="m.gold>0 && m.isBuy">已购买</view>
					<view class="content-gold" v-if="m.gold>0 && !m.isBuy">{{m.gold}}金币</view>
					<view class="content-gold" v-if="m.gold == 0 && m.is_vip != 1">免费</view>
					<view class="content-title">{{m.title}}</view>
				</view>
			</view>
			<view class="moreTig" v-if="isMoreTig">——— 我是有底线的 ———</view>
			<view style="width:100%;text-align:center;" :style="{'margin-top':(phone.windowHeight/2) - 100 +'px'}"
				v-if="isShowTig">
				<image src="/static/empty.png" style="width:100px;height:100px;"></image>
				<view style="width:100%;font-size:25upx;color:#666;margin-top:30upx;">本页面暂无内容</view>
			</view>
		</view>

		<uni-popup ref="showintroduction" type="center">
			<view class="tc_cz_btn_bg">
				<image src="../../static/img/transfer_cz.png" style="top: -60px;width: 200px;height: 106px;">
				</image>
				<view class="tc_cz_btn">开通VIP</view>
				<view class="tc_cz_btn_2">只有VIP用户才可以看哦！</view>
				<view style="width: 100%;height: 30px;text-align: center;font-size: 14px;">
					<view class="chongzhi_btn_kt" @click="gotoVIP">我要开通</view>
				</view>
				<view @click="cancel" class="tc_cz_btn_3">下次,再说!</view>
			</view>
		</uni-popup>
		<uni-popup ref="popupBuy" type="center">
			<view class="popup-buy">
				<image src="/static/imgs/nt.png" class="popup-bg-xx"></image>
				<view class="buy-title">温馨提示</view>
				<view class="buy-content">需要支付{{buyInfo.gold}}金币，您的支持我的动力</view>
				<view class="buy-btn">
					<text class="btn" @click="buyPicture(buyInfo)">扣币进入</text>
					<view class="btn right" @click="noBuy">取消</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import api from "@/common/api.js";
	import utils from '@/components/shoyu-date/utils.filter.js';
	import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue';
	var _self;
	export default {
		components: {
			easyLoadimage
		},
		// 滚动监听事件
		onPageScroll({
			scrollTop
		}) {
			_self.scrollTop = scrollTop;
		},
		data() {
			return {
				utils: utils,
				loading: true,
				isLogin: false,
				userId: 0,
				top: 0,
				phone: {},
				tabId: 3,
				contentTop: 35,
				isShowTig: false,
				one: false,
				userInfo: {},
				dataList: [],
				page: 1,
				isMoreTig: false,
				did: 0,
				loadingHieght: 100,

				buyInfo: {}, //收费金币数

				leftData: [],
				rightData: [],

				scrollTop: 1,
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
			// #ifdef H5
			_self.headTop = 44;
			_self.h5Top = 30;
			// #endif
			_self.getData();
			_self.getUserInofo()
			uni.getStorage({
				key: 'mobileDid_' + api.appkey,
				success: (res) => {
					_self.did = res.data.data;
					if (!_self.did) _self.did = res.data;
				}
			});
		},
		onHide() {
			_self.one = true;
		},
		onShow() {
			_self.isLogin = api.getLogins();
			if (_self.one) {
				if (_self.isLogin) _self.userId = _self.isLogin.userId;
				_self.getData();
			}
		},
		methods: {
			getUserInofo() {
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
			buyPicture(i) {
				if (!_self.isLogin) {
					api.showToast('登录已超时或未登录');
					let timer = setTimeout(() => {
						_self.skipUrl('/pages/login/login', 'new');
						clearTimeout(timer);
					}, 500);
					return
				}
				_self._showLoading('付费中...');
				uni.request({
					url: api.apiData.buyPicture,
					method: 'POST',
					data: {
						zid: i.id,
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
							_self.buyInfo.isBuy = true;
							_self.noBuy();
							let timer = setTimeout(() => {
								_self.goInfo(i.id, 0);
								clearTimeout(timer);
							}, 1000);
						}
					},
					fail: () => {
						// 加载失败提示
						api.showToast("服务器连接失败，请检查网络是否正常", 3000);
					}
				});
			},
			goInfo(id, t) {
				if (t != 0) _self.noBuy();
				let timer = setTimeout(() => {
					_self.skipUrl('/pages/image/info?zid=' + id, 'new');
					clearTimeout(timer);
				}, t)
			},
			userWatch(i, d) {
				_self.buyInfo = _self[d][i];
				if (!_self.userInfo.isVip && _self.buyInfo.is_vip == 1) {
					_self.$refs.showintroduction.open();
				} else
				if (_self.buyInfo.gold > 0 && !_self.buyInfo.isBuy) {
					_self.$refs.popupBuy.open();
				} else {
					_self.goInfo(_self.buyInfo.id, 0);
				}
			},
			noBuy() {
				_self.$refs.popupBuy.close();
			},
			editContent(e) {
				uni.setStorage({
					key: 'edit_content_' + api.appkey,
					data: e,
					success: () => {
						_self.skipUrl('/pages/plaza/send?t=1', 'new');
					},
					fail: () => {
						api.showToast('数据加载失败，请退出重试', 2000);
					}
				});
			},
			goSend() {
				if (!_self.isLogin) {
					api.showToast('请登录后再发来帖');
					let timer = setTimeout(() => {
						_self.skipUrl('/pages/login/login', 'new');
						clearTimeout(timer);
					}, 500);
				} else {
					_self.skipUrl('/pages/plaza/send?t=0', 'new');
				}
			},
			setTabId(t) {
				if (t == 1) {
					if (!_self.isLogin) {
						api.showToast('请登录后再发来帖');
						let timer = setTimeout(() => {
							_self.skipUrl('/pages/login/login', 'new');
							clearTimeout(timer);
						}, 500);
						return;
					}
				}
				_self.tabId = t;
				_self.page = 1;
				_self.loading = true;
				_self._showLoading()
				_self.dataList = [];
				_self.leftData = [];
				_self.rightData = [];
				_self.getData();
			},
			getData() {
				if (_self.page > 1) _self._showLoading('正在加载...');
				uni.request({
					url: api.apiData.getPicture,
					method: 'POST',
					data: {
						order: _self.tabId,
						page: _self.page,
						uid: _self.userId
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var r = e.data;
						if (r.Code == 200) {
							var dataList = r.Data;
							if (_self.page > 1) {
								if (dataList.length > 0) {
									_self.isMoreTig = false;
									_self.dataList = _self.dataList.concat(dataList);
									_self.sortData(_self.dataList);
								} else {
									_self.isMoreTig = true;
								}
							} else {
								_self.isMoreTig = false;
								_self.dataList = dataList;
								_self.sortData(dataList);
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
						let timer = setTimeout(() => {
							_self.loading = false;
							_self._hideLoading();
							clearTimeout(timer);
						}, 500);
					}
				});
			},
			sortData(arr) {
				_self.leftData = [];
				_self.rightData = [];
				for (var i = 0; i < arr.length; i++) {
					if (i % 2 == 0) {
						_self.leftData.push(arr[i]);
					} else {
						_self.rightData.push(arr[i]);
					}
				}
			},
			/* 交叉合并 */
			aryJoinAry(ary, ary2) {
				var itemAry = [];
				var minLength;
				//先拿到两个数组中长度较短的那个数组的长度
				if (ary.length > ary2.length) {
					minLength = ary2.length;
				} else {
					minLength = ary.length;
				}
				//将两个数组中较长的数组记录下来
				var longAry = arguments[0].length > arguments[1].length ? arguments[0] : arguments[1];
				//循环范围为较短的那个数组的长度
				for (var i = 0; i < minLength; i++) {
					//将数组放入临时数组中
					itemAry.push(ary[i]);
					itemAry.push(ary2[i])
				}
				//itemAry和多余的新数组拼接起来并返回。
				return itemAry.concat(longAry.slice(minLength));
			},
			// 跳转登录
			skipUrl(uri = '/pages/login/login', type = 'new') {
				api.jumpUrl(uri, type)
			},
			gotoVIP() {
				_self.skipUrl('/pages/recharge/recharge?type=2', 'new');
			},
			cancel() {
				this.$refs['showintroduction'].close()
			},
		},
		onReachBottom() {
			_self.page++;
			_self.getData();
		},
		onBackPress(e) {
			api.jumpUrl('/pages/video/class', 'tab');
			return true;
		},
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

	.content-gold {
		position: absolute;
		margin-top: -70upx;
		background-color: rgba(0, 0, 0, 0.3);
		font-size: 12px;
		color: #FFFFFF;
		padding: 5upx 15upx;
		border-radius: 0 10upx 10upx 0;
	}

	.content-vip {
		position: absolute;
		margin-top: -130upx;
		background-color: rgba(0, 0, 0, 0.3);
		font-size: 12px;
		color: #FFFFFF;
		padding: 5upx 15upx;
		border-radius: 0 10upx 10upx 0;
	}

	.content-title {
		font-size: 12px;
		color: #CCCCCC;
		line-height: 120%;
		padding: 0 10upx;
		margin-top: 12upx;
		//text-shadow: #999 0 0 1px;
	}

	.content-cover {
		width: 100%;
		height: 450upx;
		//max-height: 400upx;
		border-radius: 15upx 15upx 0 0;
		//border: 1px solid #F5F5F5;
	}

	.content-cover>>>.origin-img {
		border-radius: 15upx 15upx 0 0;
	}

	.center-content-item {
		margin-bottom: 15upx;
		-moz-page-break-inside: avoid;
		-webkit-column-break-inside: avoid;
		break-inside: avoid;
		background: rgba(255, 255, 255, 0.06);
		border-radius: 10upx;
		padding: 10upx 10upx 15upx;
	}

	.center-content-bg {
		-moz-column-count: 1;
		-webkit-column-count: 1;
		column-count: 1;
		/* -moz-column-gap: 15upx;
		-webkit-column-gap: 15upx;
		column-gap: 15upx; */
		//column-span: all;
		padding-left: 2%;
		width: 47%;
		display: inline-block;
		float: left;
		//background-color: #007AFF;
	}

	.moreTig {
		text-align: center;
		color: #ccc;
		font-size: 25upx;
		margin-top: 26upx;
		padding-bottom: 30upx;
		width: 100%;
		float: left;
	}

	.send-content {
		color: #FFFFFF;
		background-image: linear-gradient(to right, rgba(255, 12, 208, 0.8), rgba(254, 67, 101, 0.8));
		border-radius: 10upx;
		padding: 6upx 16upx;
		font-size: 12px;
	}

	.center-top {
		width: 94%;
		margin: 0 3%;
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
	}

	.head-top .top-two view {
		display: inline-block;
		text-align: center;
		color: #999999;
		font-size: 30upx;
		border-bottom: 3px solid #20202C;
		margin-right: 40upx;
	}

	.head-top {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9;
		width: 100%;
		padding: 0 28upx 20upx;
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

	.ds_btn {
		display: inline-block;
		color: #FFFFFF;
		font-size: 26upx;
		height: 30px;
		width: 60%;
		line-height: 30px;
		border-radius: 30px;
		text-align: center;
		background-image: linear-gradient(to right top, #ffe62b, #f8d520, #f0c415, #e7b40a, #dea400);
	}

	.cz_ds_btn {
		width: 100%;
		height: 30px;
		text-align: center;
		font-size: 14px;
	}

	.ye_ds_text {
		margin-top: 10px;
		padding-top: 10px;
		width: 100%;
		height: 30px;
		text-align: center;
		font-size: 14px;
		color: #FFFFFF;
	}

	.tc_ds_btn {
		padding-top: 90px;
		width: 100%;
		height: 30px;
		text-align: center;
		font-size: 14px;
	}

	.tc_ds_btn_2 {
		padding-top: 15px;
		width: 100%;
		height: 30px;
		text-align: center;
		font-size: 14px;
	}

	.tc_ds_btn_3 {
		width: 100%;
		height: 30px;
		text-align: center;
		font-size: 14px;
	}

	.tc_ds_btn_bg {
		background: #e8370c;
		width: 230px;
		height: 300px;
		border-radius: 5px;
	}

	.tc_cz_btn_bg {
		background-image: linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1);
		width: 200px;
		height: 200px;
		border-radius: 5px;
	}

	.tc_cz_btn {
		position: absolute;
		top: 50px;
		width: 100%;
		height: 30px;
		text-align: center;
		font-size: 14px;
	}

	.tc_cz_btn_2 {
		position: absolute;
		top: 70px;
		width: 100%;
		height: 20px;
		text-align: center;
		font-size: 14px;
	}

	.tc_cz_btn_3 {
		position: absolute;
		top: 160px;
		width: 100%;
		height: 20px;
		text-align: center;
		font-size: 14px;
	}

	.chongzhi_btn_kt {
		display: inline-block;
		color: #FFFFFF;
		font-size: 26upx;
		height: 30px;
		width: 40%;
		line-height: 30px;
		border-radius: 30px;
		text-align: center;
		background-image: linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12);
	}

	.uni-popup {
		z-index: 999;
	}

	.chongzhi_btn {
		display: inline-block;
		color: #FFFFFF;
		font-size: 26upx;
		height: 30px;
		width: 40%;
		line-height: 30px;
		border-radius: 30px;
		text-align: center;
		background-image: linear-gradient(to right top, #ffe62b, #f8d520, #f0c415, #e7b40a, #dea400);
	}


	.input-tx {
		background: #CCCCCC;
		height: 35px;
		width: 80%;
		margin: 0 auto;
		border-radius: 7px;
		margin-bottom: 5px;
	}
</style>