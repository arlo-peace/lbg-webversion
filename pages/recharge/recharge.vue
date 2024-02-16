<template>
	<view class="content">
		<view class="mask" v-if="loading" style="background-color:#1D1D28;margin-top:0!important;z-index:9!important;">
			<view class="loading13" style="position:absolute;margin-top:-25px;">
				<view></view>
				<view></view>
				<view></view>
				<view></view>
				<view></view>
			</view>
		</view>
		<view class="head-content" :style="{ padding: toTop+'px 0 0 0' }">
			<view class="head">
				<view :class="payType == 1 ? 'ok' : ''" @click="selectType(1)">金币套餐</view>
				<view :class="payType == 2 ? 'ok' : ''" @click="selectType(2)">VIP套餐</view>
			</view>
		</view>
		<view class="head-top">
			<view class="username">{{userInfo.nickname}}</view>
			<view class="vipTime">{{vipmsg}}</view>
			<view class="myGold">账户金币：{{userInfo.corn}}</view>
		</view>
		<view class="center-title"></view>
		<view class="center-content">
			<swiper circular class="package-swiper" previous-margin="30px" next-margin="30px"
				:current="current[payType]" @change="changePackage" v-show="payType==1">
				<swiper-item class="package-item" v-for="(item, index) in goldPackage" :key="index">
					<view class="package-box">
						<view class="package-box-content">
							<view class="package-bg" style="background-image: url(/static/vip/gold_bg.png)">
								<view class="package-text">
									<view class="package-title" style="color:#b15a00">{{item.title}}</view>
									<view class="package-info">{{item.tips}}</view>
								</view>
								<view class="package-gift">
									<view class="package-day-box" v-if="item.is_gift > 0">
										<text>加赠:</text>
										<text v-if="item.is_gift == 1 || item.is_gift == 3">金币{{item.gift_gold}}个</text>
										<text
											v-if="item.is_gift == 2 || item.is_gift == 3">VIP{{item.gift_days}}天</text>
									</view>
								</view>
								<view class="package-money"><text style="font-size:21upx;color:#b15a00;">￥</text><text
										style="font-size:31upx;color:#b15a00;">{{item.money}} 元</text><text
										style="margin-left:10px;color:#b15a00;">( {{item.corn}} 个金币 )</text></view>
							</view>
						</view>
					</view>

				</swiper-item>
			</swiper>
			<swiper circular class="package-swiper" previous-margin="30px" next-margin="30px"
				:current="current[payType]" @change="changePackage" v-show="payType==2">
				<swiper-item class="package-item" v-for="(item, index) in vipPackage" :key="index">
					<view class="package-box">
						<view class="package-box-content">
							<view class="package-bg"
								:style="'background-image: url(/static/vip/vip'+makeVipIcon(index,item)+'.png)'">
								<view class="package-text">
									<view class="package-title">{{item.title}}</view>
									<view class="package-info">{{item.tips}}</view>
								</view>
								<view class="package-day">
									<view class="package-day-box" v-if="item.is_gift > 0">
										<text>加赠:</text>
										<text v-if="item.is_gift == 1 || item.is_gift == 3">金币{{item.gift_gold}}个</text>
										<text
											v-if="item.is_gift == 2 || item.is_gift == 3">VIP{{item.gift_days}}天</text>
									</view>
								</view>
								<view class="package-money">￥<text style="font-size:31upx;">{{item.money}} 元</text><text
										style="margin-left:10upx;">( {{item.time}} 天 )</text> </view>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<view style="width:100%;margin-top:50px;text-align:center;" v-if="isShow">
				<image src="/static/empty.png" style="width:100px;height:100px;"></image>
				<view style="width:100%;font-size:25upx;color:#666;margin-top:30upx;">暂无套餐数据，请联系客服</view>
			</view>
			<view class="vip-content-box" v-if="payType==2">
				<view class="vip-content-box-item">
					<view class="vip_content">VIP特权内容</view>
					<view class="vip_box">
						<block v-for="(v, vi) in imgList">
							<view class="vip_img" v-if="checkTag(v.id)" :key="vi">
								<view class="vip_img_box">
									<view class="image">
										<image :src="v.icon"></image>
									</view>
									<view class="text">
										<text>{{v.name}}</text>
									</view>
								</view>
							</view>
						</block>
					</view>
				</view>
				<view class="vip-content-box-item">
					<view class="vip_content">VIP特权说明</view>
					<view class="vip_title_box">
						<block v-for="(v, vi) in imgList">
						<view class="vip_img" v-if="checkTag(v.id)" :key="vi">
							<view class="vip_title">{{v.name}}</view>
							<view class="vip_description">{{v.description}}</view>
						</view>
						</block>
					</view>
				</view>
				<!--<view class="vip_content">VIP特权内容</view>
				<view class="vip_box">
					<view class="vip_img" v-if="checkTag(v.id)" v-for="(v, vi) in imgList" :key="vi">
						<image :src="v.icon"></image>
						<view style="margin-top: -10px;">{{v.name}}</view>
					</view>
				</view> -->
			</view>
			<view class="custom" v-if="payType==1&&custom">
				<input class="input" type="number" maxlength="6" :cursor-spacing="10"
					:placeholder="'自定义充值金币，1元＝'+cornCal+'金币'" @input="customPay" />
			</view>
			<view style="height:25px;"></view>
		</view>
		<view class="bottom-pay">
			<!--<view class="kefu" @click="skipUrlKF">联系客服</view>-->
			<view class="money">{{moneyTig}}</view>
			<view class="pay" @click="pay">立即付款</view>
		</view>

		<uni-popup ref="popupPay" type="bottom">
			<view class="pay-content">
				<image src="/static/imgs/delx.png" class="close" @click="closePay"></image>
				<view class="pay-title">请选择支付方式</view>
				<view class="pay-code-list" v-for="(p, i) in payList" :key="i"
					v-if="p.config == 0 || checkMoney(p.config)" @click="createOrder(p.id, p.payCode, p.type)">
					<image class="pay-img" :src="p.payIcon"></image>
					<view class="pay-name">{{p.payName}}</view>
					<image class="pay-botton" src="/static/imgs/no.png"></image>
				</view>
				<view class="pay-code-list" v-if="isHave == 0">
					<template v-if="isPerson == 1">
						<view class="pay-name">暂无在线支付方式，请选择人工充值</view>
						<view class="pay-person">
							<view v-for="p,i in person" :key="i" class="pay-person-item">
								<view class="pay-person-item-title">{{p.title}}</view>
								<view class="pay-person-item-content">
									<view v-for="n,d in p.list" :key="d" class="pay-person-item-li">
										<text class="strongb">{{n.title}}</text>
										<text class="strongc">{{n.value}}</text>
										<text class="strongd" @click="copyValue(n.value)">复制</text>
									</view>
								</view>
							</view>
						</view>
					</template>
					<view class="pay-name" v-else>暂无支付方式，请联系客服</view>
				</view>
			</view>
		</uni-popup>

		<view style="height:100%;width:100%;background:rgba(0,0,0,0.3);position:fixed;top:0;left:0;z-index:999;"
			v-if="isPayStatus">
			<view
				style="width:65%;position:absolute;top:30%;left:16.3%;text-align:center;font-size:15px;background:#FFFFFF;padding:30px 5px;border-radius:10px;">
				<image src="/static/imgs/msg.png" style="width:200upx;height:200upx;"></image>
				<view style="color:#666666;font-size:13px;height:25px;line-height:25px;">如付款成功未到账，请联系平台客服</view>
				<view
					style="background:#D89720;color:#FFFFFF;width:200upx;height:35px;line-height:35px;margin:10px auto 0;border-radius:5px;"
					@click="closePayStatus">
					我知道了
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	var _self;
	export default {
		data() {
			return {
				toTop: 27,
				phone: {},
				userId: 0,
				userInfo: {},
				vipmsg: '',
				goldPackage: [],
				vipPackage: [],
				packId: 0,
				payType: 1,
				payMoney: 0,
				moneyTig: '支付金额：0元',
				cornCal: 1,
				payStatus: false,
				isHave: 0,
				payList: [],
				gold: 0,
				isPayStatus: false,
				custom: false,
				imgList: [],
				loading: true,
				vid: 0,
				book_album_id: 0,
				book_audio_id: 0,
				isPerson: 0,
				person: [],
				url: {
					type: 'tab',
					url: ''
				},
				isShow: false,
				current: [0, 0, 0],
			}
		},
		onLoad(e) {
			//console.log(e)
			_self = this;
			_self.phone = uni.getSystemInfoSync();
			_self.toTop = _self.phone.statusBarHeight + 45;
			// 是否登录
			var info = api.getLogins();
			if (info === false) {
				return api.jumpUrl('/pages/login/login', 'old');
			} else {
				_self.userId = info.userId;
				_self.getUserInfo();
			}
			if (e.type < 3) _self.payType = e.type;
			if (e.type == 3) _self.url = JSON.parse(e.url);
			if (e.vid != undefined) _self.vid = e.vid;
			if (e.book_album_id != undefined) _self.book_album_id = e.book_album_id;
			if (e.book_audio_id != undefined) _self.book_audio_id = e.book_audio_id;
			_self.getRecPackage();
		},
		methods: {
			makeVipIcon(index, item) {
				if (item.type != 0) {
					return '_per'
				}
				return index + 1 > 10 ? index + 1 : (index + 101 + '').substring(1)
			},
			checkTag(id) {
				var i = false
				if (_self.vipPackage[_self.current[_self.payType]].tags) {
					for (var x in _self.vipPackage[_self.current[_self.payType]].tags) {
						if (_self.vipPackage[_self.current[_self.payType]].tags[x] == id.toString()) {

							i = true
						}
					}
				}
				return i;
			},
			checkMoney(ar) {
				if (typeof ar == 'object') {
					var res = false
					for (var i = 0; i < ar.length; i++) {
						if ((parseInt(ar[i][0] * 100) <= parseInt(_self.payMoney * 100) && parseInt(ar[i][0]) != 0) && (
								parseInt(ar[i][1] * 100) >= parseInt(_self.payMoney * 100) && parseInt(ar[i][1]) != 0)) {
							res = true
							_self.isHave = 1
							continue;
						}
					}
					return res
				}
				_self.isHave = 1
				return true
			},
			// 提交充值
			pay() {
				if (_self.payMoney == 0 || _self.payMoney < 0) {
					api.showToast('支付金额必须大于0元', 2000);
					return false;
				}
				if (_self.payType == 2) {
					if (_self.userInfo.is_permanent == 1) {
						api.showToast('您已是尊贵的永久VIP，无须升级', 2000);
						return false;
					}
				}
				uni.showLoading({
					title: '读取中...',
					mask: true
				});
				_self.getPayList();
			},
			// 读取支付列表
			getPayList() {
				uni.request({
					url: api.apiData.getPayList,
					data: {
						userId: _self.userId
					},
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var data = e.data;
						if (data.Code == 200) {
							var payList = data.Data.list;
							_self.isPerson = data.Data.person || 0
							_self.person = data.Data.personList || []
							if (payList.length > 0) {
								_self.isHave = 0;
								_self.payStatus = true;
								_self.payList = payList;
								for (var i = 0; i < payList.length; i++) {
									if (payList[i].config == 0) {
										_self.isHave = 1;
									}
								}
								_self.$refs['popupPay'].open();
								uni.hideLoading();
							} else {
								api.showToast('暂无可用支付接口，请联系平台客服', 2000);
							}
						} else {
							api.showToast(data.Msg, 2000);
						}
					},
					fail: () => {
						// 加载失败提示
						api.showToast('读取失败，请稍后重试', 5000);
					}
				});
			},
			closePay() {
				_self.payStatus = !_self.payStatus;
				_self.$refs['popupPay'].close();
			},
			closePayStatus() {
				_self.getUserInfo();
				_self.isPayStatus = !_self.isPayStatus;
			},
			// 创建订单
			createOrder(pid, payCode, type) {
				if (!pid) return api.showToast('付款失败，请退出后重试', 2000);
				// if (!type) return api.showToast('原生支付正在，开发中', 2000);
				uni.showLoading({
					title: '正在创建订单...',
					mask: true
				});
				
				// 发起请求
				uni.request({
					url: api.apiData.createOrder,
					method: 'POST',
					data: {
						userId: _self.userId, // 用户ID
						payId: pid, // 支付方式ID
						buyType: _self.payType, // 1金币套餐2VIP套餐
						payCode: payCode, // 方式渠道标识
						price: _self.payMoney, // 支付金额
						gold: _self.gold, // 金币数
						packId: _self.packId || 0 // 套餐ID
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var data = e.data;
						_self.closePay();
						if (data.Code == 200) {
							var orderSn = data.Data.order_sn;
							if (!orderSn) return api.showToast('订单创建失败，请检查网络是否正常', 2000);
							// 第三方 
							if (type) {
								uni.hideLoading();
								//api.jumpUrl(api.apiData.getPay+'/orderSn/'+orderSn, 'web');
								api.jumpUrl(data.Data.webUrl + '/appapi/pay/orderSn/' + orderSn, 'web');
								setTimeout(() => {
									_self.closePayStatus();
								}, 3000);
							} else {
								uni.showLoading({
									title: '正在支付...',
									mask: true
								});
								//var orderInfo = JSON.stringify(data.Data.alipayStrSign);
								var orderInfo = data.Data.alipayStrSign;
								// alipay支付宝 wxpay微信
								uni.requestPayment({
									provider: data.Data.pay_channel,
									orderInfo: orderInfo, //微信、支付宝订单数据
									success: (res) => {
										_self.getUserInfo();
										api.showToast("订单已付款成功", 2000);
										//console.log('success:' + JSON.stringify(res));
										let timer = setTimeout(() => {
											_self.closePayStatus();
											clearTimeout(timer);
										}, 3000);
									},
									fail: (err) => {
										console.log('fail:' + JSON.stringify(err));
										api.showToast("付款失败，支付已取消", 2000);
										//api.showToast(JSON.stringify(err), 2000);
									}
								});
								//console.log(orderInfo);
							}
						} else {
							api.showToast(data.Msg, 2000);
						}
					},
					fail: () => {
						_self.closePay();
						api.showToast("服务器连接失败，请检测网格是否正常");
					}
				});
			},
			// 自定义充值
			customPay(e) {
				var point = e.target.value;
				var money = point / _self.cornCal;
				_self.cut(0, money, point, 1);
			},
			// 跳转KeFu
			skipUrlKF() {
				api.jumpUrl('../kefu/kefu', 'new')
			},
			// 切换vip或金币
			selectType(type) {
				_self.payType = type;
				_self.changePackage();
			},
			setShow() {
				if (_self.payType == 1) {
					_self.isShow = _self.goldPackage.length ? false : true;
				} else {
					_self.isShow = _self.vipPackage.length ? false : true;
				}
			},
			changePackage(e = 0) {
				if (e != 0) _self.current[_self.payType] = e.detail.current;
				_self.cut();
				_self.setShow();
			},
			// 选择套餐
			cut() {
				var d = [];
				if (_self.payType == 1) {
					d = _self.goldPackage[_self.current[_self.payType]];
					_self.gold = d.corn; // 金币数
				} else {
					d = _self.vipPackage[_self.current[_self.payType]];
				}
				_self.packId = _self.payType == 1 ? d.cornId : d.vipId; // 套餐ID
				_self.payMoney = d.money; // 支付金额
				_self.moneyTig = '支付金额：' + d.money + '元';
			},
			copyValue(v) {
				uni.setClipboardData({
					data: v,
					success() {
						uni.showToast({
							title: "已复制到剪贴板"
						})
					}
				})
			},
			// 读取套餐
			getRecPackage() {
				uni.request({
					url: api.apiData.getCharge,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var data = e.data.Data;
						_self.goldPackage = data.corn;
						_self.vipPackage = data.vip;
						_self.imgList = data.imgs;
						_self.cornCal = data.cornCal;
						_self.custom = data.custom;
						_self.cut();
						_self.setShow();
						if (!data.is_recharge) {
							api.showToast(data.recharge_text, 2000);
							let timer = setTimeout(() => {
								api.jumpUrl('/pages/member/member', 'tab');
								clearTimeout(timer);
							}, 1500);
						} else {
							let timer = setTimeout(() => {
								_self.loading = false;
								clearTimeout(timer);
							}, 500);
						}
						//console.log(e); 
					},
					fail: () => {
						// 加载失败提示
						_self.back('服务器连接失败，请检查网络是否正常');
					},
					complete() {
						uni.hideLoading()
					}
				});
			},
			// 读取个人信息
			getUserInfo() {
				uni.request({
					url: api.apiData.getInfo + '/userId/' + _self.userId,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						_self.userInfo = e.data.Data;
						_self.userInfo.nickname = (_self.userInfo.nickname == '') ? _self.userInfo.username :
							_self.userInfo.nickname;
						if (_self.userInfo.is_permanent == 1) {
							_self.vipmsg = "永久VIP";
						} else if (_self.userInfo.isVip) {
							_self.vipmsg = "VIP将在 " + _self.userInfo.vipEndTime + " 到期";
						} else {
							_self.vipmsg = "普通会员，可升级为尊贵的VIP";
						}
					},
					fail: () => {
						_self.back('服务器连接失败，请检查网络是否正常');
					}
				});
			},
			back(msg) {
				api.showToast(msg);
				let timer = setTimeout(() => {
					uni.navigateBack();
					clearTimeout(timer);
				}, 1000)
			}
		}
	};
</script>
<style lang="scss" scoped>
	/deep/.uni-scroll-view::-webkit-scrollbar {
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none
	}
</style>
<style>
	@import url('@/components/loading/loading.css');

	.vip_content {
		width: 100%;
		margin-top: 20px;
		margin-bottom: 20px;
		text-align: center;
		font-size: 18px;
		padding-bottom: 10px;
		//border-bottom:2px dashed #F0F8FF;
		color: #fff;
	}

	.vip_box {
		width: 100%;
		height: 100%;
		color: #fff;
	}

	.vip_img {
		width: 90px;
		height: 100px;
		text-align: center;
		float: left;
		font-size: 14px;
		margin-top: 5px;
	}

	.vip_img image {
		width: 70px;
		height: 70px;
	}

	.close {
		width: 30px;
		height: 30px;
		float: right;
		right: 4%;
		top: 8px;
	}

	.pay-content {
		width: 100%;
		background: #FFFFFF;
		padding: 0 0 10px;
	}

	.pay-title {
		width: 100%;
		height: 50px;
		line-height: 50px;
		font-size: 18px;
		padding: 0 5%;
		color: #666666;
		border-bottom: 1px solid #E8E8E8;
	}

	.pay-code-list {
		width: 90%;
		margin: 20px 5% 10px;
		min-height: 30px;
		height: auto;
		border-bottom: 1px dashed #E2E2E2;
		padding: 0 0 15px;
	}

	.pay-code-list view {
		display: inline-block;
	}

	.pay-img {
		width: 30px;
		height: 30px;
		float: left;
		margin-right: 8px;
	}

	.pay-name {
		height: 30px;
		float: left;
		font-size: 16px;
		line-height: 30px;
		color: #666666;
	}

	.pay-botton {
		width: 24px;
		height: 24px;
		float: right;
		margin-top: 3px;
	}

	.select {
		border: 1px solid #ff0cd0;
		background: #1E1E2B;
	}

	.custom {
		height: 40px;
		line-height: 40px;
		margin-top: 20px;
		color: #666666;
		border: 1px solid #ff0cd0;
		border-radius: 3px;
		padding: 0 2%;
	}

	.custom input {
		font-size: 13px;
	}

	.input {
		height: 40px;
		line-height: 40px;
		padding: 0 10px;
	}

	.money {
		color: #FFFFFF;
		padding: 0 15px;
	}

	.pay {
		color: #FFFFFF;
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		float: right;
		padding: 0 15px;
	}

	.bottom-pay {
		width: 100%;
		background: #20202C;
		margin-top: 10px;
		position: fixed;
		bottom: 0;
		font-size: 15px;
		height: 50px;
		line-height: 50px;
	}

	.bottom-pay view {
		display: inline-block;
	}

	.package-money {
		height: 19.83471074380165%;
		text-align: right;
		width: 100%;
		display: flex;
		justify-content: left;
		align-items: center;
	}

	.package-day {
		height: 28.00829875518672%;
		width: 100%;
		text-align: left;
		box-sizing: border-box;
		display: flex;
		justify-content: left;
		align-items: center;
	}

	.package-info {
		width: 65%;
		opacity: .9;
		font-size: 24rpx;
	}

	.package-title {
		font-weight: bold;
		font-size: 40rpx;
		margin-top: 10%;
		width: 100%;
	}

	.package-gift {
		height: 28.00829875518672%;
		width: 100%;
		text-align: left;
		box-sizing: border-box;
		display: flex;
		justify-content: left;
		align-items: center;
	}

	.package-day-box {
		background-color: #F9221D;
		border-radius: 30rpx;
		padding: 5rpx 15rpx;
		margin-top: 45rpx;
		box-shadow: 0 3rpx 5rpx rgba(0, 0, 0, .75);
	}

	.package-gift text {
		margin-left: 2px;
	}

	.package-gift text+text:before {
		content: '+';
		margin-right: 2px;
	}

	.package-swiper {
		height: 380rpx;
		position: relative;
	}

	.package-item {
		display: flex;
		justify-content: center;
		//background-color: #009688;
	}

	.package-box {
		width: 550rpx;
		box-sizing: border-box;
	}

	.package-box-content {
		width: 100%;
		height: 0;
		padding-bottom: calc(100% / 1.55601659751037325);
		position: relative;
	}

	.package-text {
		flex: 1;
		height: auto;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.package-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-size: 100% 100%;
		padding: 0 6%;
		box-sizing: border-box;
		color: #FFFFFF;
		font-size: 10px;
		//background-color: #007AFF;
		display: flex;
		flex-direction: column;
	}

	.center-content {
		//background-image: url(/static/member/vip_bg.png);
		background-size: 100% 100%;
	}

	.center-title {
		padding: 15px 5%;
		color: #FFFFFF;
		font-size: 16px;
		margin: 10px 0;
	}

	.center-scroll {
		height: 100px;
		background-color: #007AFF;
	}

	.center-info {
		display: inline-block;
		margin: 0 30upx 0 0;
		width: 43%;
		height: 145px;
		border-radius: 8px;
		//border: 2px solid #3F536E;
		//box-shadow: 0px 6px 6px 0px rgba(103, 103, 103, 0.5);
		text-align: center;
		padding: 20px 0 0 0;
		//background: #3F536E;
	}

	.default {
		border: 1px solid #E8E8E8;
	}

	.center-info view {
		padding: 5px 1%;
		font-size: 16px;
	}

	.center-name {
		color: #E8E8E8;
		border-bottom: 1px solid #E8E8E8;
		width: 80%;
		margin: 0 auto;
		height: 20px;
		line-height: 20px;
	}

	.center-number {
		color: #666666;
		width: 98%;
		height: 50px;
		line-height: 50px;
	}

	.center-money {
		color: #FF8F00;
		font-weight: bold;
		width: 80%;
		margin: auto;
		border: 1px solid #E8E8E8;
		border-radius: 50px;
	}

	.myGold {
		margin-top: 15px;
		background: rgba(103, 103, 103, 0.8);
		padding: 8px 0;
		font-size: 15px;
	}

	.gold {
		width: 30px;
		height: 30px;
	}

	.head-content {
		width: 100%;
		height: 166px;
		//background-image: linear-gradient(to right, rgba(255,12,208,0.8), rgba(254,67,101,0.8));
		background-color: #000000;
		clip-path: polygon(0% 0%, 0% 100%, 100% 65%, 100% 0%);
	}

	.username {
		font-size: 17px;
	}

	.vipTime {
		font-size: 12px;
		margin-top: 10px;
		background: rgba(255, 94, 99, 0.8);
		display: inline-block;
		padding: 5px 10px;
		border-radius: 5px;
	}

	.svip {
		background: url(/static/vip/vip07.png) !important;
		background-size: cover !important;
		text-align: left !important;

	}

	.head-top {
		width: 70%;
		background: rgba(239, 187, 52, 0.9);
		margin: -100px auto 0;
		border-radius: 10px;
		z-index: 3;
		position: relative;
		color: #FFFFFF;
		padding: 20px 0;
		height: 120px;
		text-align: center;
		box-shadow: 0px 0px 10px 10px rgba(239, 187, 52, 0.2);
	}

	.content {
		width: 100%;
		padding-bottom: 55px;
	}

	.head {
		background: rgba(218, 171, 57, 0.6);
		text-align: center;
		padding: 7px 0;
		color: #FFFFFF;
		box-shadow: 0px 4px 4px 0px rgba(103, 103, 103, 0.3);
		border-radius: 50px;
		width: 80%;
		margin: auto;
		font-size: 14px;
	}

	.head view {
		display: inline-block;
		width: 100px;
		height: 35px;
		line-height: 35px;
	}

	.ok {
		background-color: rgba(0, 0, 0, 0.4);
		color: #FFFFFF;
		border-radius: 35px;
	}

	.page {
		background-color: #000000;
	}

	.kefu {
		color: #ffffff;
		background: #333300;
		float: left;
		padding: 0 5px;
		margin-left: 0px;
		width: 60px;
	}

	.vip-content-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 40upx;
		padding: 40upx;
		box-sizing: border-box;
	}

	.vip-content-box .vip-content-box-item {
		width: 100%;
		border: #e5ba7a 2px solid;
		border-radius: 20upx;
		box-sizing: border-box;
		padding: 20upx;
	}

	.vip-content-box .vip-content-box-item .vip_content {
		margin-top: 5px;
		border-bottom: 1px dashed #e5ba7a;
	}

	.vip-content-box .vip-content-box-item+.vip-content-box-item {
		margin-top: 40upx;
	}

	.vip-content-box .vip-content-box-item .vip_box {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	}

	.vip-content-box .vip-content-box-item .vip_box .vip_img {
		width: 23%;
		height: 0;
		padding-bottom: calc(23% + 30px);
		margin-top: 0;
		margin-bottom: 0;
		position: relative;
	}

	.vip-content-box .vip-content-box-item .vip_box .vip_img .vip_img_box {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.vip-content-box .vip-content-box-item .vip_box .vip_img .image {
		width: 100%;
		height: 0;
		padding-bottom: 100%;
		position: relative;
	}

	.vip-content-box .vip-content-box-item .vip_box .vip_img .image image {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	.vip-content-box .vip-content-box-item .vip_box .vip_img .text {
		width: 100%;
		text-align: center;
		height: 30px;
		font-size: 12px;
		line-height: 24px;
	}

	.vip-content-box .vip-content-box-item .vip_box .vip_img+.vip_img {
		margin-left: 2%;
	}

	.vip-content-box .vip-content-box-item .vip_box .vip_img:nth-child(4n+1) {
		margin-left: 0;
	}

	.vip-content-box .vip-content-box-item .vip_title_box {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		background: transparent;
	}

	.vip-content-box .vip-content-box-item .vip_title_box .vip_img {
		width: calc(50% - 10px);
		height: 71px;
		margin: 5px;
		padding-bottom: 0;
		box-sizing: border-box;
		position: relative;
		margin-top: 10px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		text-align: left;
		//background-color: rgba(0,0,0,.25);
		//box-shadow: 0 1px 2px rgba(0,0,0,.5);
	}

	.vip-content-box .vip-content-box-item .vip_title_box .vip_img:nth-child(2n+1) {
		width: calc(50% - 15px);
		margin-right: 10px;
	}

	.vip-content-box .vip-content-box-item .vip_title_box .vip_img:after {
		height: 1px;
		background: #e5ba7a;
		width: calc(100% - 10px);
		position: absolute;
		bottom: 0;
		content: ''
	}

	.vip-content-box .vip-content-box-item .vip_title_box .vip_img .vip_title {
		font-size: 16px;
		line-height: 20px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		height: 22px;
		color: #ffffff;
		text-indent: 10px;
	}

	.vip-content-box .vip-content-box-item .vip_title_box .vip_img .vip_description {
		font-size: 14px;
		line-height: 20px;
		height: 40px;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 90%;
		color: #FFFAC3;
	}

	.pay-person {
		padding: 5px;
		background-color: #fCfCfC;
		margin-bottom: 10px;
	}

	.pay-person-item+.pay-person-item {
		margin-top: 10px;
	}

	.pay-person-item-title {
		font-size: 16px;
	}

	.pay-person-item-content {
		font-size: 14px;
		color: #212121;
		width: 100%;
	}

	.pay-person-item-li {
		width: 100%;
		line-height: 26px;
		display: flex !important;
		flex-direction: row;
		justify-content: space-between;
	}

	.strongb {
		font-weight: bold;
		margin-right: 10px;
	}

	.strongc {
		color: #313131;
		margin-right: 5px;
		flex: 1;
	}

	.strongd {
		border: #e5ba7a 1px solid;
		border-radius: 5px;
		padding: 0 5px;
		font-size: 12px;
		height: 18px;
		line-height: 16px;
		box-shadow: 0 2px 1px rgba(0, 0, 0, .5);
		color: #555;
	}
</style>
