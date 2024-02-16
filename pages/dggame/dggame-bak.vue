<template>
	<view class="bg">
		<view class="content-head" :style="{ 'padding-top': (top+7) + 'px' }">
			<view class="notice">
				<view class="notice-icon">
					<image class="notice-icon-image" src="../../static/imgs/home_notice_icon.png"></image>
				</view>
				<view class="notice-content">
					<text class="notice-content-text">{{notice}}</text>
				</view>
			</view>
			<div class="navigation-buttons">
				<view class="navigation-buttons-item">
					<view class="navigation-image-box" @click="skipUrl('/pages/recharge/recharge',0)">
						<image class="navigation-image" src="../../static/wali/recharge.png"></image>
					</view>
				</view>
				<view class="navigation-buttons-item">
					<view class="navigation-image-box" @click="skipUrl('/pages/member/deposit',0)">
						<image class="navigation-image" src="../../static/wali/withdrew.png"></image>
					</view>
				</view>
				<view class="navigation-buttons-item">
					<view class="navigation-image-box" @click="skipUrl('/pages/dggame/wallet',0)">
						<image class="navigation-image" src="../../static/wali/transfer.png"></image>
					</view>
				</view>
			</div>
		</view>
		<view class="content-box">
			<view class="content-box-left">
				<view class="content-box-left-item" :class="{'content-box-left-item-active':choose_index == 'h'}"
					@click="showGroup('h')" v-if="histories && histories.length > 0">
					<view class="content-box-left-item-image-box">
						<image class="content-box-left-item-image" src="../../static/wali/history.png"></image>
					</view>
					<text class="content-box-left-item-text">历史记录</text>
				</view>
				<template v-if="navigations && navigations.length > 0">
					<view class="content-box-left-item"
						:class="{'content-box-left-item-active':choose_index == navigation.id}"
						@click="showGroup(navigation.id)" v-for="navigation in navigations" :key="navigation.id">
						<view class="content-box-left-item-image-box">
							<image class="content-box-left-item-image"
								:src="require('../../static/wali/group/' + navigation.id + '.png')"></image>
						</view>
						<text class="content-box-left-item-text">{{navigation.label}}</text>
					</view>
				</template>
			</view>
			<view class="content-box-right" id="right_box">
				<view class="group" v-if="histories && histories.length > 0">
					<view class="group-title" id="group_h">
						<view class="group-arrow-left"></view>
						<text class="group-text">历史记录</text>
						<view class="group-arrow-right"></view>
					</view>
					<view class="group-items">
						<view class="group-item" v-for="history in histories" :key="'h_'+history.id">
							<view class="group-item-game" @click="startGame(history.id)">
								<view class="group-item-game-image-box">
									<image class="group-item-game-image"
										:src="require('../../static/wali/game/' + history.id + '.png')"></image>
								</view>
								<text class="group-item-game-text">{{history.label}}</text>
							</view>
						</view>
					</view>
				</view>
				<template v-if="navigations && navigations.length > 0">

					<view class="group" v-for="navigation in navigations" :key="navigation.id">
						<view class="group-title" :id="'group_'+navigation.id">
							<view class="group-arrow-left"></view>
							<text class="group-text">{{navigation.label}}</text>
							<view class="group-arrow-right"></view>
						</view>
						<view class="group-items">
							<template v-for="item in list">
								<view class="group-item" v-if="navigation.id == item.group" :key="'g' + item.id">
									<view class="group-item-game" @click="startGame(item.id)">
										<view class="group-item-game-image-box">
											<image class="group-item-game-image"
												:src="require('../../static/wali/game/' + item.id + '.png')"></image>
										</view>
										<text class="group-item-game-text">{{item.label}}</text>
									</view>
								</view>
							</template>
						</view>
					</view>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	var _self, query, right_box;
	export default {
		data() {
			return {
				headHeight: 160,
				top: 27,
				userInfo: {
					token: '',
					random: '',
					url: null,
					flash: '',
					sdk: '',
					money: '',
					dg_username: '',
					dg_money: '',
					dg_datetime: '',
				},
				navigations: [],
				histories: [],
				list: [],
				notice: '',
				choose_index: 0,
				winHeight: 200,
			}
		},
		onShow(){
			_self.getUserInfo()
		},
		onLoad(e) {
			_self = this;
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			query = uni.createSelectorQuery().in(this);
			var mobile = uni.getSystemInfoSync();
			_self.winHeight = mobile.windowHeight
			_self.top = mobile.statusBarHeight;
			_self.headHeight = 160
			_self.getUserInfo()
			_self.$nextTick(() => {
				query.select('#right_box').boundingClientRect(data => {
					right_box = Math.ceil(data.top)
				}).exec();
			})
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
					url: api.apiData.gameInit + '/userId/' + _self.userId,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						uni.hideLoading();
						if (e.data.Code != 200) {
							_self.msgData(e.data.Msg, 5000);
						} else {
							let data = e.data.Data;
							_self.histories = data.histories
							if (_self.histories && _self.histories.length > 0) {
								_self.choose_index = 'h'
							}
							_self.notice = data.notice
							_self.navigations = data.navigations
							_self.list = data.list
						}
					},
					fail: () => {
						// 加载失败提示
						_self.msgData('服务器连接失败，请检查网络是否正常', 5000);
					}
				});
			},
			makeUrl() {
				_self.showUrl = _self.userInfo.url + (_self.tableId ? '&game=' + _self.tableId :
					'')
				_self.isChoose = true
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
				// 加载失败提示
				uni.showToast({
					icon: style,
					title: title,
					mask: true,
					duration: times
				});
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
		width: 100%;
		padding-top: 130px;
		box-sizing: border-box;
	}

	.content-head {
		background: #222222;
		width: 100%;
		height: 130px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
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

	.content-box {
		flex: 1;
		width: 100%;
		background: #f7f9f8;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		padding-left: 100px;
		position: relative;
		box-sizing: border-box;
		border-radius: 15px;
		top:43px;
	}

	.content-box-left {
		width: 100px;
		height: 100%;
		position: fixed;
		left: 0;
		top: 320rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		box-sizing: border-box;
		padding: 15px;
		overflow: hidden;
		overflow-y: auto;
	}

	.content-box-left-item {
		width: 70px;
		height: 100px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 10px;
		border-radius: 15px;
		background-color: #FFFFFF;
	}

	.content-box-left-item-active {
		box-shadow: 1px 1px 1px rgba(0, 0, 0, .7);
	}

	.content-box-left-item-image-box {
		width: 100%;
		height: 0;
		padding-bottom: 100%;
		position: relative;
	}

	.content-box-left-item-image {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

	.content-box-left-item-text {
		font-size: 14px;
		font-weight: 600;
		width: 100%;
		line-height: 18px;
		text-align: center;
	}

	.content-box-right {
		flex: 1;
		background: #FFFFFF;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		padding: 25px 15px;
		padding-top: 50px;
		box-sizing: border-box;
		overflow: hidden;
		overflow-y: auto;
		border-radius: 15px;
	}

	.group {
		width: 100%;
		height: auto;
		float: left;
		margin-bottom: 15px;
	}

	.group-title {
		width: 100%;
		height: 40px;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.group-arrow-left {
		width: 30px;
		height: 25px;
		background-image: url(../../static/wali/arrow_left.png);
		background-position: center center;
		background-size: 100% auto;
		background-repeat: no-repeat;
	}

	.group-text {
		text-align: center;
		height: 100%;
		font-size: 16px;
		font-weight: bold;
		margin: 0 10px;
	}

	.group-arrow-right {
		width: 30px;
		height: 25px;
		background-image: url(../../static/wali/arrow_right.png);
		background-position: center center;
		background-size: 100% auto;
		background-repeat: no-repeat;
	}

	.group-items {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
		flex-wrap: wrap;
	}

	.group-item {
		width: 50%;
		height: auto;
		padding: 5px 10px;
		box-sizing: border-box;
		flex-shrink: 0;
	}

	.group-item-game {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
	}

	.group-item-game-image-box {
		width: 100%;
		height: 0;
		padding-bottom: 66%;
		position: relative;
	}

	.group-item-game-image {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		border-radius: 10px;
		background-color: #FFFFFF;
		box-shadow: 1px 1px 1px rgba(0, 0, 0, .7);
	}

	.group-item-game-text {
		line-height: 30px;
		font-size: 13px;
	}
</style>
