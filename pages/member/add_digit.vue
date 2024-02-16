<template>
	<view class="bg" :style="{ height: bgHeight + 'px'}">
		<view class="content-head" :style="{ top: top + 'px' }">添加数字钱包</view>
		<view style="height:85px;width:100%;"></view>
		<view class="bank-top">
			<image class="bank-img" :src="bankLogo" mode="aspectFill"></image>
			<view class="bank-name">{{pickerText}}</view>
			<view class="bank-sn">{{bankSn}}</view>
		</view>
		<view class="bank-list">
			<view class="bank-info">
				<button type="default" @click="showSinglePicker"
					style="width:90%;background:#FFFFFF;">{{pickerText}}</button>
			</view>
			<view class="bank-info">
				<input type="text" name="bankSn" @input="onKeyInput" placeholder="请输入钱包地址" />
			</view>
			<view class="bank-add" @click="addBank">确认添加</view>
		</view>
		<view class="mpvue-picker">
			<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength"
				:pickerValueDefault="pickerValueDefault" @onConfirm="onConfirm" @onCancel="onCancel"
				:pickerValueArray="pickerValueArray">
			</mpvue-picker>
		</view>
		<css-loading ref="cssLoading"></css-loading>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	var _self;
	export default {
		components: {
			mpvuePicker
		},
		data() {
			return {
				top: 27,
				bgHeight: 650,
				bankSn: '0000 0000 0000 0000 000',
				title: "",
				pickerSingleArray: [],
				themeColor: '#007AFF',
				pickerText: '请选择钱包类型',
				mode: '',
				deepLength: 1,
				pickerValueDefault: [0],
				pickerValueArray: [],
				bankUsername: '',
				bankId: 0,
				userId: 0,
				cardNum: 0,
				bankLogo: '../../static/imgs/addbank.png',
			}
		},
		onLoad() {
			_self = this;
			_self._showLoading('加载中...');
			// 是否登录
			const info = api.getLogins();
			if (info === false) {
				_self.skipUrl();
			} else {
				_self.userId = info.userId;
				_self.getBank();
			}
		},
		mounted: function() {
			var mobile = uni.getSystemInfoSync();
			_self.top = mobile.safeArea.top + 7;
			_self.bgHeight = mobile.windowHeight;
			//console.log(mobile);	
		},
		methods: {
			// 银行卡列表
			getBank() {
				uni.request({
					url: api.apiData.getDigit,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						_self.pickerSingleArray = e.data.Data;
						_self._hideLoading();
					},
					fail: () => {
						// 加载失败提示
						_self.msgData('服务器连接失败，请检查网络是否正常', 5000);
					}
				});
			},
			// 获取卡号
			onKeyInput(e) {
				var number = e.detail.value;
				if (!number) {
					_self.bankSn = '0000 0000 0000 0000 000';
					return false;
				}
				_self.bankSn = number.replace(/(\d{4})(?=\d)/g, "$1 ");
				_self.cardNum = number;
				//console.log(number);
			},
			// 获取姓名
			onKeyInputNname(e) {
				var val = e.detail.value;
				_self.bankUsername = val;
				//console.log(val)
			},
			// 取消选择
			onCancel(e) {
				_self.pickerText = '请选择钱包类型';
				_self.bankSn = '0000 0000 0000 0000 000';
				_self.bankId = 0;
				_self.bankLogo = '../../static/imgs/addbank.png';
				_self.cardNum = 0;
				//console.log(e);
			},
			// 请选择银行卡
			showSinglePicker() {
				_self.pickerValueArray = _self.pickerSingleArray
				_self.mode = 'selector'
				_self.deepLength = 1
				_self.pickerValueDefault = [0]
				_self.$refs.mpvuePicker.show()
			},
			onConfirm(e) {
				_self.pickerText = e.label;
				_self.bankId = e.value;
				_self.bankLogo = _self.pickerSingleArray[e.index]['logo'];
				//console.log(e);
			},
			// 提交银行卡信息
			addBank() {
				if (_self.bankId == 0) {
					_self.msgData('请选择钱包类型', 2000);
					return false;
				}
				if (_self.cardNum == 0) {
					_self.msgData('请输入钱包地址', 2000);
					return false;
				}
				_self._showLoading('加载中...');
				uni.request({
					url: api.apiData.addDigit,
					method: 'POST',
					data: {
						userId: _self.userId,
						bankName: _self.pickerText,
						cardUser: _self.bankUsername,
						cardNum: _self.cardNum,
						banklogo: _self.bankLogo,
						bankId: _self.bankId
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var res = e.data;
						if (res.Code == 200) {
							_self.skipUrl('/pages/member/digit_list', 2);
						} else {
							_self.msgData(res.Msg, 2000);
						}
						_self._hideLoading();
					},
					fail: () => {
						// 加载失败提示
						_self.msgData('服务器连接失败，请检查网络是否正常', 5000);
					}
				});
			},
			skipUrl(url = '/pages/login/login', type = 1) {
				if (type == 1) {
					uni.reLaunch({
						url: url
					});
				} else {
					uni.navigateTo({
						url: url
					});
				}
			},
			// 提示
			msgData(title = '', times = 1000, style = 'none') {
				_self._hideLoading()
				setTimeout(() => {
					uni.showToast({
						icon: style,
						title: title,
						mask: true,
						duration: times
					})
				}, 200)
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			_self.getBank();
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
	.bg {
		background: #FFFFFF;
		width: 100%;
	}

	.bank-add {
		width: 100%;
		text-align: center;
		height: 50px;
		line-height: 50px;
		background: -webkit-gradient(linear, left top, right top, from(rgba(218, 171, 57, 0.6)), to(#FF5E63));
		margin-top: 15px;
		border-radius: 8px;
		color: #FFFFFF;
	}

	.bank-name {
		width: 90%;
		padding: 60px 5% 0;
		font-size: 22px;
	}

	.bank-sn {
		width: 90%;
		padding: 20px 5% 0;
	}

	.bank-top {
		width: 90%;
		height: 180px;
		margin: 0 auto;
		border-radius: 20px;
		background: -webkit-gradient(linear, left top, right top, from(rgba(218, 171, 57, 0.6)), to(#FF5E63));
		font-size: 18px;
		color: #FFFFFF;
		box-shadow: 0px 4px 6px 0px rgba(103, 103, 103, 0.8);
	}

	.bank-img {
		width: 80px;
		height: 80px;
		float: right;
		top: 20px;
		right: 10px;
		opacity: 0.5;
		filter: alpha(opacity=50);
	}

	.bank-list {
		width: 68%;
		font-size: 16px;
		margin: 0 auto;
		border-radius: 10px;
		padding: 25px 5% 30px;
		border: 1px solid #E2E2E2;
		border-top: none;
		box-shadow: 0px 4px 6px 0px rgba(103, 103, 103, 0.8);
		background: #FFFFFF;
		margin-top: -20px;
	}

	.bank-list view {
		display: inline-block;
	}

	.bank-info {
		width: 100%;
	}

	.bank-info input {
		border-bottom: 1px solid #E2E2E2;
		padding: 15px 5px;
	}

	.content-head {
		position: fixed;
		width: 100%;
		height: 30px;
		line-height: 30px;
		top: 27px;
		text-align: center;
		color: #666;
		background: #FFFFFF;
	}
</style>