<template>
	<view class="bg" :style="{ height: bgHeight + 'px' }">
		<view class="head">
			<view class="head-money">
				<view>
					<image src="/static/imgs/today.png" mode="aspectFill"></image>
				</view>
				<view>今日安装</view>
				<view class="head-wz">{{info.today}}人</view>
			</view>
			<view class="head-money">
				<view>
					<image src="/static/imgs/all.png" mode="aspectFill"></image>
				</view>
				<view>累计安装</view>
				<view class="head-wz">{{info.total}}人</view>
			</view>
		</view>
		<view class="content">
			<view class="content-list" v-for="(s, i) in info.list" :key="i">
				<image class="content-tx" :src="(i%2)?'../../static/imgs/tx1.png':'../../static/imgs/tx0.png'"
					mode="aspectFill"></image>
				<view class="content-time">{{s.addTime}}({{s.isReg}})</view>
				<view class="content-point">{{s.type}} +{{s.point}}</view>
			</view>
			<view style="width:100%;margin-top:100px;text-align:center;" v-if="isShowTig">
				<image src="/static/empty.png" style="width:100px;height:100px;"></image>
				<view style="width:100%;font-size:25upx;color:#666;margin-top:30upx;">暂无推广记录，加油吧骚年</view>
			</view>
		</view>
		<view class="footer">邀请好友，海量奖品等你拿</view>
		<css-loading ref="cssLoading"></css-loading>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	var _self;
	export default {
		data() {
			return {
				bgHeight: 690,
				userId: 0,
				info: {
					today: 0,
					total: 0
				},
				isShowTig: false,
			}
		},
		onLoad() {
			_self = this;
			_self._showLoading('加载中...');
			var mobile = uni.getSystemInfoSync();
			_self.bgHeight = mobile.windowHeight;
			// 是否登录
			const info = api.getLogins();
			if (info === false) {
				_self.skipUrl();
			} else {
				_self.userId = info.userId;
				_self.getShareLog();
			}
		},
		methods: {
			// 分享记录
			getShareLog() {
				uni.request({
					url: api.apiData.getShareLog + '/userId/' + _self.userId,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var res = e.data.Data;
						_self.info = res;
						if (res.list.length < 1) {
							_self.isShowTig = true;
						}
						_self._hideLoading();
					},
					fail: () => {
						// 加载失败提示
						_self.msgData('服务器连接失败，请检查网络是否正常', 5000);
					}
				});
			},
			// 跳转登录
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
				}, 200);
			}
		}
	}
</script>
<style>
	.content-list {
		width: 90%;
		;
		height: 40px;
		margin: 0 5%;
		margin-top: 10px;
		font-size: 14px;
		color: #666666;
		line-height: 40px;
		border-bottom: 1px dashed #E2E2E2;
	}

	.content-tx {
		width: 26px;
		height: 26px;
		float: left;
		margin-top: 7px;
	}

	.content-time {
		margin-left: 15px;
	}

	.content-point {
		float: right;
		color: #009688;
		font-size: 12px;
	}

	.footer {
		width: 100%;
		font-size: 16px;
		text-align: center;
		margin-top: 6%;
		color: #666666;
	}

	.bg {
		width: 100%;
		height: 690px;
		background: #ffffff;
		//background-size: cover;
		//overflow: auto;
		//filter: blur(3px);
	}

	.head {
		width: 100%;
		height: 250px;
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		text-align: center;
	}

	.head view {
		display: inline-block;
		width: 50%;
		color: #FFFFFF;
	}

	.head-money {
		height: 250px;
	}

	.head-money view {
		display: block;
		width: 100%;
		font-size: 18px;
	}

	.head-money image {
		width: 50px;
		height: 50px;
		margin-top: 70px;
	}

	.head-money .head-wz {
		color: rgba(255, 255, 255, 0.7);
		font-size: 15px;
	}

	.content {
		width: 90%;
		border-radius: 10px;
		background: #FFFFFF;
		margin: -50px auto 0;
		box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.5);
		padding: 0 0 25px;
		height: 58%;
		overflow-y: scroll;
	}

	.content view {
		display: inline-block;
	}

	.content-gt {
		width: 35%;
		margin: 20px 0 0 10%;
		text-align: center;
		padding: 10px 0;
		border-radius: 10px;
		color: #666666;
	}

	.content-gt image {
		width: 40px;
		height: 40px;
	}

	.content-gt view {
		display: block;
		font-size: 15px;
	}
</style>