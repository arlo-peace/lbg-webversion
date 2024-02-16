<template>
	<view class="bg">
		<view class="content-head" :style="{ 'padding-top': (top+7) + 'px' }">
			<view class="notice">
				<view class="notice-icon">
					<image class="notice-icon-image" src="../../static/imgs/home_notice_icon.png"></image>
				</view>
				<view class="notice-content">
					<swiper class="swiper" style="height:100%;width:100%;" circular autoplay vertical>
						<swiper-item v-for="n,i in notice" :key="i">
							<view class="notice-content-text">{{n}}</view>
						</swiper-item>
					</swiper>
				</view>
				<view @click="uni.reLaunch({url:'/pages/dggame/dggame'})" class="notice-btn">
					<text>刷新</text>
				</view>
			</view>
			<view class="navigation-buttons">
				<view class="navigation-buttons-item">
					<view class="navigation-image-box" @click="skipUrl('/pages/recharge/recharge',0)">
						<image class="navigation-image" src="../../static/game/recharge.png"></image>
					</view>
				</view>
				<view class="navigation-buttons-item">
					<view class="navigation-image-box" @click="skipUrl('/pages/member/deposit',0)">
						<image class="navigation-image" src="../../static/game/withdrew.png"></image>
					</view>
				</view>
				<view class="navigation-buttons-item">
					<view class="navigation-image-box" @click="skipUrl('/pages/dggame/wallet',0)">
						<image class="navigation-image" src="../../static/game/transfer.png"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="game-box">
			<view class="game-content">
				<view class="game-content-left">
					<view class="game-content-position">
						<view v-for="tab,i in games" :key="i" @click="setTabbar(i)" class="game-tabbar-item"
							:class="{'game-tabbar-item-active':currentIndex == i}">
							<image :src="'../../static/game/' + tab.code + '/logo.gif'" mode=""></image>
							<text>{{tab.name}}</text>
						</view>
					</view>
				</view>
				<view class="game-content-right">
					<template v-for="tab,i in games">
						<view class="game-content-position" :key="i" v-if="currentIndex == i">
							<template v-for="group,iii in tab.group">
								<view :key="iii" class="game-content-right-list" v-if="group.games.length > 0">
									<view class="game-content-right-title">
										<text>{{group.title}}</text>
									</view>
									<view class="game-content-right-box">
										<view class="game-content-right-item" @click="startGame(game.id)"
											v-for="game,iiii in group.games">
											<image :src="'../../static/game/' + tab.code + '/' + game.icon_id + '.gif'"
												mode=""></image>
											<text>{{game.name}}</text>
										</view>
										<view class="game-content-right-title-dixian">
											<text>--没有更多游戏了，我是底线--</text>
										</view>
									</view>

								</view>
							</template>
						</view>
					</template>
				</view>
			</view>
		</view>
		<css-loading ref="cssLoading"></css-loading>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	var _self;
	export default {
		data() {
			return {
				uni: uni,
				headHeight: 160,
				top: 27,
				userId: 0,
				games: [],
				notice: '',
				currentIndex: 0
			}
		},
		onShow() {
			_self.getUserInfo()
		},
		onLoad(e) {
			_self = this;
			_self._showLoading('加载中...');
			var mobile = uni.getSystemInfoSync();
			_self.winHeight = mobile.windowHeight
			_self.top = mobile.statusBarHeight;
		},
		methods: {
			showGroup(k) {
				_self.choose_index = k
				this.$nextTick(() => {
					query.select('#group_' + k).boundingClientRect(data => {
						//#ifdef APP
						uni.pageScrollTo({
							scrollTop: Math.ceil(data.top) - right_box - 40,
							selector: '#right_box',
							duration: 100
						})
						//#endif
						//#ifndef APP
						uni.pageScrollTo({
							scrollTop: Math.ceil(data.top) - right_box - 20,
							selector: '#right_box',
							duration: 100
						})
						//#endif
					}).exec();
				})
			},
			startGame(id) {
				_self.skipUrl('/pages/dggame/game?id=' + id, 0)
			},
			setTabbar(i) {
				_self.currentIndex = i
			},
			getUserInfo() {
				const info = api.getLogins();
				if (info === false) {
					_self.skipUrl();
				} else {
					_self.userId = info.userId;
					_self.initLoad()
				}
			},
			initLoad() {
				uni.request({
					url: api.apiData.gameInit,
					data: {
						userId: _self.userId
					},
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						_self._hideLoading();
						if (e.data.Code != 200) {
							_self.msgData(e.data.Msg, 5000);
						} else {
							_self.notice = _self.chineseSplitFunction(e.data.Data.notice, 30)
							_self.games = e.data.Data.games
						}
					},
					fail: () => {
						// 加载失败提示
						_self.msgData('服务器连接失败，请检查网络是否正常', 5000);
					}
				});
			},
			chineseSplitFunction(src, bytes) {
				let that = this;
				if (src == null) {
					return null;
				}
				let splitList = [];
				let startIndex = 0;
				let endIndex = bytes > src.length ? src.length : bytes;
				while (startIndex < src.length) {
					let subString = src.substring(startIndex, endIndex);
					while (that.stringlenFunction(subString) > bytes) {
						--endIndex;
						subString = src.substring(startIndex, endIndex);
					}
					splitList.push(src.substring(startIndex, endIndex));
					startIndex = endIndex;
					endIndex = (startIndex + bytes) > src.length ? src.length : startIndex + bytes;
				}
				return splitList;
			},
			stringlenFunction: function(str) {
				var len = 0;
				for (var i = 0; i < str.length; i++) {
					var c = str.charCodeAt(i);
					//单字节加1   
					if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
						len++;
					} else {
						len += 2;
					}
				}
				return len;
			},
			// 跳转
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
					});
				}, 200)
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			_self.getUserInfo()
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
	.bg {
		background: #222222;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		width: 100%;
		box-sizing: border-box;
		height: calc(100vh - var(--window-top) - var(--window-bottom))
	}

	.content-head {
		background: #222222;
		width: 100%;
		height: 130px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 99;
	}

	.notice {
		width: 100%;
		height: 30px;
		margin-bottom: 15px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.notice-icon {
		width: 60px;
		height: 22px;
		padding-left: 20px;
		box-sizing: border-box;
	}

	.notice-icon-image {
		width: 22px;
		height: 22px;
	}

	.notice-content {
		flex: 1;
		height: 22px;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		padding-right: 20px;
		box-sizing: border-box;
	}

	.notice-content-text {
		color: #FFFFFF;
		font-size: 12px;
		line-height: 22px;
	}

	.notice-btn {
		width: 100rpx;
		height: 22px;
	}

	.notice-btn text {
		background-color: #f0f0f0;
		border: #e0e0e0 1px solid;
		border-radius: 10rpx;
		font-size: 12px;
		padding: 0 10rpx;
		box-shadow: 0 1px 1px rgba(250, 50, 50, .5);
	}

	.navigation-buttons {
		width: 100%;
		height: 50px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.navigation-buttons-item {
		width: 30%;
		max-width: 220px;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		margin: 0 5px;
	}

	.navigation-image-box {
		width: 100%;
		height: 0;
		padding-bottom: 39%;
		position: relative;
	}

	.navigation-image {
		height: 100%;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	.game-box {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.game-content {
		flex: 1;
		display: flex;
		flex-direction: row;
		width: 100%;
		padding: 0;
	}

	.game-content-left {
		width: 180rpx;
		height: 100%;
		box-sizing: border-box;
		padding: 0 10rpx;
		position: relative;
		background-color: #f7f9f8;
		border-top-left-radius: 20rpx;
	}

	.game-content-position {
		position: absolute;
		top: 20rpx;
		left: 10rpx;
		width: calc(100% - 20rpx);
		height: 100%;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.game-tabbar-item {
		width: calc(100% - 10rpx);
		height: 200rpx;
		text-align: center;
		padding: 10rpx;
		background: #f4f4f4;
		border: #e0e0e0 1px solid;
		box-sizing: border-box;
		border-radius: 10rpx;
		box-shadow: 0 1px 2px rgba(0, 0, 0, .5);
	}

	.game-tabbar-item+.game-tabbar-item {
		margin-top: 20rpx;
	}

	.game-tabbar-item image {
		width: 100%;
		height: 120rpx;
	}

	.game-tabbar-item text {
		line-height: 60rpx;
		font-size: 14px;
	}

	.game-content-right {
		flex: 1;
		height: 100%;
		padding: 0 10rpx;
		position: relative;
		background-color: #f0f0f0;
		border-top-right-radius: 20rpx;
	}

	.game-content-right-list {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.game-content-right-title-dixian {
		width: 100%;
		height: auto;
		/* #ifdef APP-PLUS */
		height: 100rpx;
		/* #endif */
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
		text-indent: 20rpx;
		margin-bottom: 20rpx;
	}

	.game-content-right-title {
		width: 100%;
		height: auto;
		/* #ifdef APP-PLUS */
		height: 140rpx;
		/* #endif */
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
		text-indent: 20rpx;
		margin-bottom: 20rpx;
	}

	.game-content-right-title text {
		font-weight: 600;
		padding: 0 70rpx;
		position: relative;
		text-indent: 0;
	}

	.game-content-right-title text:before {
		width: 52rpx;
		height: 100%;
		content: "";
		background: url(@/static/game/arrow_left.png) left center no-repeat;
		background-size: 52rpx auto;
		position: absolute;
		left: 4rpx;
		top: 0;
	}

	.game-content-right-title text:after {
		width: 52rpx;
		height: 100%;
		content: "";
		background: url(@/static/game/arrow_right.png) right center no-repeat;
		background-size: 52rpx auto;
		position: absolute;
		right: 4rpx;
		top: 0;
	}

	.game-content-right-box {
		flex: 1;
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 40rpx;
	}

	.game-content-right-item {
		width: 48%;
		height: 220rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: #f4f4f4;
		border: #e0e0e0 1px solid;
		box-sizing: border-box;
		border-radius: 10rpx;
		box-shadow: 0 1px 2px rgba(0, 0, 0, .5);
		margin-bottom: 20rpx;
	}


	.game-content-right-item image {
		width: 240rpx;
		height: 160rpx;
	}

	.game-content-right-item text {
		line-height: 40rpx;
		font-size: 12px;
	}
</style>
