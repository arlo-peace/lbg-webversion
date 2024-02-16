<template>
	<view class="content">
		<css-loading ref="cssLoading"></css-loading>
		<view class="head">
			<view class="head-item">
				<view class="head-left" @click="api.jumpUrl('/pages/image/city?city=' + city, 'new')">
					<image src="/static/img/dingwei1.png"></image>
					<text>{{city}}</text>
				</view>
				<view class="head-search" @click="api.jumpUrl('/pages/video/search', 'new')">
					<image style="width:15px;height:15px;" src="/static/imgs/search.png"></image>
					<text
						style="font-size:14px;margin-left:5px;color:#777;">已有{{userInfo.image_down_count ? userInfo.image_down_count : '100000'  }}人下载资源</text>
				</view>
				<view class="head-right">
					<view class="head-right-text" @click="api.jumpUrl('/pages/image/post', 'new')">
						<text>+ 发布</text>
					</view>
				</view>
			</view>
			<view class="banner">
				<image src="/static/image/svod-logo.png"></image>
				<text>SM调教特色服务，官方担保包赔付</text>
			</view>
		</view>
		<view style="height:180upx"></view>
		<view class="image-list">
			<view class="image-item" v-for="(item,index) in dataList" @click="userWatch(index)" :key="index">
				<view class="image-item-cover">
					<easy-loadimage mode="aspectFill" :scroll-top="scrollTop" :image-src="item.cover"
						:open-transition="true" class="content-cover">
					</easy-loadimage>
					<view class="image-item-cover-tags">
						<text v-if="item.gold == 0">免费</text>
						<text v-else>{{item.gold}}金币</text>
						<text v-if="item.is_vip == 1">VIP专项</text>
					</view>
					<view class="image-item-cover-num">
						<text>{{item.buy_num}}人已约</text>
					</view>
				</view>
				<view class="image-content">
					<view class="image-content-text">
						<text class="title">{{item.title}}</text>
						<text class="sub">{{item.content}}</text>
					</view>
					<view class="image-content-bottom">
						<view class="image-contnet-bottom-data">
							<text>年龄:{{item.price?item.price: '0'}}/三围:{{item.hours?item.hours:'0'}}/服务:{{item.size?item.size:'0'}}</text>
						</view>
						<view class="image-contnet-bottom-date">
							<view class="image-content-bottom-date-text">
								<uni-icons type="location" color="#999999" size="16"></uni-icons>
								<text>{{item.city}}</text>
							</view>
							<view class="image-content-bottom-date-text">
								<uni-icons type="eye" color="#999999" size="16"></uni-icons>
								<text>{{item.click}}</text>
							</view>
						</view>
					</view>
					<view v-if="item.tag_name" class="image-content-tag">
						<text>{{item.tag_name}}</text>
					</view>
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
				city: '全国',
				scrollTop: 1,
				headTop: 0,
				h5Top: 0,
				api: api
			}
		},
		onLoad(e) {
			_self = this;
			_self._showLoading()
			_self.city = e.city && e.city.length > 0 ? e.city : '全国'
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
				const newCity = uni.getStorageSync("image_city_" + api.appkey)
				console.log(newCity)
				if (newCity) {
					_self.city = newCity
					uni.removeStorageSync("image_city_" + api.appkey)
				}
				_self.getData();
			}
		},
		methods: {
			getUserInofo() {
				uni.request({
					url: api.apiData.getInfo,
					method: 'POST',
					data: {
						userId: _self.userId,
						hasImageDown: 1
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
			userWatch(i) {
				_self.buyInfo = _self.dataList[i];
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
			getData() {
				if (_self.page > 1) _self._showLoading('正在加载...');

				let timer = setTimeout(() => {
					_self.loading = false;
					_self._hideLoading();
					clearTimeout(timer);
				}, 500);
				uni.request({
					url: api.apiData.getPicture,
					method: 'POST',
					data: {
						order: _self.tabId,
						page: _self.page,
						uid: _self.userId,
						city: _self.city
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
						let timer = setTimeout(() => {
							_self.loading = false;
							_self._hideLoading();
							clearTimeout(timer);
						}, 500);
					}
				});
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
			if(!_self.isMoreTig)
			{
				_self.page++;
				_self.getData();
			}
		},
		onBackPress(e) {
			api.jumpUrl('/pages/video/class', 'tab');
			return true;
		},
	};
</script>

<style>
	@import url('@/components/loading/loading.css');


	.head-left {
		font-size: 14px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		color: #FFF;
	}

	.head-right {
		font-size: 14px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		color: #FFF;
	}

	.head-left image {
		height: 30upx;
		width: 30upx;
		margin-right: 4upx;
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
		margin: 0 20upx;
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
		z-index: 99;
		color: #999999;
		background-color: #1D1D28;
		width: 100%;
		padding: 10upx 30upx 20upx 30upx;
		box-sizing: border-box;
	}

	.r {
		float: right;
	}

	.l {
		float: left;
	}

	.banner {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		font-size: 14px;
		color: #999;
		padding: 10upx 0;
		box-sizing: border-box;
	}

	.banner image {
		width: 180upx;
		height: 50upx;
		margin-right: 10upx;
	}

	.image-list {
		padding: 10upx 30upx;
		width: 100%;
		height: auto;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	.image-item {
		width: 100%;
		border-radius: 20upx;
		background-color: #3b3b3b;
		color: #8b8b8b;
		display: flex;
		flex-direction: row;
		padding: 20upx;
		box-sizing: border-box;
		height: 300upx;
		margin-bottom: 20upx;
	}

	.image-item-cover {
		width: 200upx;
		height: 260upx;
		border-radius: 15upx;
		overflow: hidden;
		position: relative;
		background-color: #8b8b8b;
		margin-right: 20upx;
	}

	.image-item-cover .content-cover {
		width: 100%;
		height: 100%;
	}

	.image-content {
		flex: 1;
		font-size: 14px;
		line-height: 30upx;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.image-content-text {
		flex: 1;
		width: 100%;
		display: flex;
		flex-direction: column;
		height: 160upx;
	}

	.image-content-text .sub {
		width: 100%;
		overflow: hidden;
		height: calc(100% - 76upx);
	}

	.title {
		width: calc(100% - 160upx);
		height: 60upx !important;
		line-height: 60upx;
		font-size: 15px;
		font-weight: bold;
		color: #FFF;
		margin-bottom: 10upx;
		overflow: hidden;
	}

	.image-content-bottom {
		width: 100%;
		height: 100upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}

	.image-contnet-bottom-data {
		width: 100%;
		height: 60upx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.image-contnet-bottom-date {
		width: 100%;
		height: 40upx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.image-content-bottom-date-text {
		margin-right: 20upx;
		font-size: 14px;
	}

	.image-content-bottom-date-text text {
		margin-left: 10upx;
	}

	.image-item-cover-tags {
		position: absolute;
		right: 0;
		bottom: 0;
		font-size: 11px;
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: flex-start;
	}

	.image-item-cover-tags text {
		margin-bottom: 20upx;
		padding: 4upx 10upx;
		background: #aaa;
		border-radius: 10upx;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.image-item-cover-num {
		position: absolute;
		top: 0;
		right: 0;
		font-size: 12px;
		color: #FFF;
		border-bottom-left-radius: 15upx;
		background-color: #eb6532;
		padding: 6upx 12upx;
	}

	.image-content-tag {
		width: 180upx;
		height: 50upx;
		position: absolute;
		right: -10upx;
		top: -20upx;
		color: #FFF;
		background: url(@/static/image/right-vod-tip-1.png) center center no-repeat;
		background-size: 100% 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 600;
	}

	.image-content-tag text {
		margin-top: -6upx;
		text-shadow: 0 1upx 2upx rgba(0, 0, 0, .35);
	}

	.image-item:nth-child(2n) .image-content-tag {
		background-image: url(@/static/image/right-vod-tip-2.png);
	}

	.image-item:nth-child(3n) .image-content-tag {
		background-image: url(@/static/image/right-vod-tip-3.png);
	}

	.image-item:nth-child(4n) .image-content-tag {
		background-image: url(@/static/image/right-vod-tip-4.png);
	}

	.image-item:nth-child(5n) .image-content-tag {
		background-image: url(@/static/image/right-vod-tip-5.png);
	}

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

	.moreTig {
		text-align: center;
		color: #ccc;
		font-size: 25upx;
		margin-top: 26upx;
		padding-bottom: 30upx;
		width: 100%;
		float: left;
	}



	.left {
		float: left;
	}

	.right {
		float: right;
	}



	.content {
		width: 100%;
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