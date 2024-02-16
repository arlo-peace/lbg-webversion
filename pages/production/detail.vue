<template>
	<view class="bg">
		<view class="head">
			<image :src="productionInfo.img" mode="aspectFill" class="head-bg"></image>
			<view class="head-content">
				<view class="head-tx">
					<image :src="productionInfo.thumbnail" mode="aspectFill"></image>
				</view>
				<image @click="focusProduction" :src="`/static/production/${focus ? 'guanzhu002' : 'guanzhu001'}.png`"
					class="production-focus"></image>
				<view class="head-title">
					<view class="head-name">{{productionInfo.name}}</view>
					<view class="head-desc">{{productionInfo.english_name}}</view>
				</view>
				<view class="head-list">
					<view class="head-list-item">
						<image src="/static/production/zzgz.png" mode=""></image>
						<text>关注{{productionInfo.follow_count}}人</text>
					</view>
					<view class="head-list-item">
						<image src="/static/production/zzplay.png" mode=""></image>
						<text>{{productionInfo.playCount}}播放</text>
					</view>
					<view class="head-list-item">
						<image src="/static/production/zzvod.png" mode=""></image>
						<text>作品{{list.length}}部</text>
					</view>
				</view>
			</view>
		</view>
		<view style="padding:15px 5% 10px;width:90%;">
			<view style="font-weight:bold;font-size:20px;color:#FFFFFF;padding-left:5px;line-height:20px;">简介
				<!-- <image src="/static/imgs/_d.png" style="width:22px;height:18px;float:right;"></image> -->
			</view>
			<view
				style="padding:5px;margin-top:14upx;border-radius:5px;font-size:28upx;color:#CCCCCC;line-height:40upx;">

				<!-- #ifndef MP-WEIXIN -->
				<jyf-parser :html="productionInfo.info" ref="article"></jyf-parser>
				<!-- #endif -->

				<!-- #ifdef MP-WEIXIN -->
				<rich-text :nodes="productionInfo.info"></rich-text>
				<!-- #endif -->
			</view>
		</view>
		<view style="height:10px;background:#20202C;"></view>
		<view style="padding:10px 5% 5px;width:90%;">
			<view style="font-weight:bold;font-size:20px;color:#FFFFFF;padding-left:5px;">作品</view>
		</view>
		<view class="video-list" v-for="(v, i) in list" :key="i" @click="playVideo(v.id)">
			<view class="video-img">
				<image :src="v.img" mode="aspectFill"></image>
			</view>
			<view class="video-info">
				<view class="video-title video-info-video-title">{{v.title}}</view>
				<view class="video-time">{{v.playTime}}
					<text style="float:right;color:#D89720;" v-if="v.gold>0">{{v.gold}} 金币</text>
					<text style="float:right;color:#ff6f33;" v-else>免费</text>
				</view>
				<view class="video-play" style="line-height:40upx;">
					<text>{{v.palyCount}} 次播放</text>
					<text style="float:right;">{{utils.timeTodate('Y/m/d',v.addTime)}}</text>
				</view>
			</view>
		</view>
		<!--无内容-->
		<view style="width:100%;text-align:center;margin:60px 0;" v-if="isShowTig">
			<image src="/static/empty.png" style="width:100px;height:100px;"></image>
			<view style="width:100%;font-size:25upx;color:#666;margin-top:30upx;">暂时没有作品，请稍后再试</view>
		</view>
		<css-loading ref="cssLoading"></css-loading>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	import utils from '@/components/shoyu-date/utils.filter.js';
	var _self;
	export default {
		data() {
			return {
				userId: 0,
				productionInfo: {
					name: '加载中...',
					english_name: '正在加载中，请稍后...',
					info: '暂无介绍',
					thumbnail: '',
					img: '',
					reco: 0,
					click: 0,
					add_time: 0
				},
				list: [],
				productionId: 0,
				utils: utils,
				isLogin: {},
				isShowTig: false,
				focus: false,
				backUrl: {
					url: '/pages/video/class',
					type: 'tab'
				}
			}
		},
		onLoad(e) {
			_self = this;
			_self._showLoading('加载中...');
			_self.productionId = e.id;
			if (e.param != undefined) {
				_self.backUrl = JSON.parse(e.param);
			} else {
				_self.backUrl = {
					url: '/pages/video/play?type=' + JSON.stringify({
						url: '/pages/video/class',
						t: 'tab'
					}),
					type: 'new'
				}
			}
			_self.isLogin = api.getLogins();
			if (_self.isLogin) _self.userId = _self.isLogin.userId;
			_self.getProduction();
		},
		methods: {
			focusProduction() {
				if (_self.userId) {
					uni.request({
						url: api.apiData.productionFocus,
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded',
						},
						data: {
							productionId: _self.productionId,
							userId: _self.userId,
						},
						success: (res) => {
							_self._hideLoading()
							if (res.data.Code == 200) {
								if (_self.focus) {
									api.showToast('取消关注成功');
								} else {
									api.showToast('关注成功');
								}
								_self.focus = !_self.focus
							} else {
								api.showToast(res.data.Msg);
							}
						},
						fail: (err) => {
							api.showToast('关注失败');
						},
						complete: () => {
							_self.loading = false;
							_self._hideLoading()
						}
					});
				} else {
					_self.showLogin();
				}
			},
			showLogin(e) {
				uni.showModal({
					content: '您还没有登录，请先登录后再操作！',
					cancelText: '取消',
					confirmText: '登录',
					success: (res) => {
						if (res.confirm) {
							_self.gotoLogin();
						} else if (res.cancel) {

						}
					}
				});
			},
			gotoLogin() {
				uni.setStorage({
					key: 'sourceUrl',
					data: '/pages/production/detail?id=' + _self.productionId,
					success: () => {
						api.jumpUrl('/pages/login/login', 'new');
					},
					fail: () => {
						api.showToast('网络连接失败，请检查网络是否正常', 2000);
					}
				});
			},
			// 跳转播放页
			playVideo(vid) {
				//console.log(vid);
				uni.setStorage({
					key: 'vid',
					data: vid,
					fail: () => {
						_self.msgData('服务器连接失败，请检查网络是否正常', 5000);
						return false;
					},
					complete: () => {
						api.jumpUrl('/pages/video/play', 'new');
						/*var param = {
							url: '/pages/production/detail?id=' + _self.productionId,
							t: 'new'
						}
						api.jumpUrl('/pages/video/play?type=' + JSON.stringify(param), 'new');*/
					}
				});
			},
			// 读取信息
			getProduction() {
				uni.request({
					url: api.apiData.productionDetail,
					method: 'POST',
					data: {
						productionId: _self.productionId,
						userId: _self.userId
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						setTimeout(() => {
							_self._hideLoading();
						}, 1000);
						_self.productionInfo = e.data.Data.production;
						_self.list = e.data.Data.list
						_self.focus = e.data.Data.focus
						// 顶部背景
						if (_self.productionInfo.img.length > 0) {
							api.imgCache(_self.productionInfo.img, (bgCache) => {
								_self.productionInfo.img = bgCache;
							});
						}
						if (_self.productionInfo.info.length < 1) _self.productionInfo.info = '暂无简介。';
						if (_self.list.length > 0) {
							_self.isShowTig = false;
						} else {
							_self.isShowTig = true;
						}
						// 原生顶部标题
						uni.setNavigationBarTitle({
							title: _self.productionInfo.name
						});
					},
					fail: () => {
							_self._hideLoading()
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
				}, 200)
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			_self.getAlbum();
			uni.stopPullDownRefresh();
		}
		/*,
				onBackPress(e) {
					api.jumpUrl(_self.backUrl.url, _self.backUrl.type);
					return true;
				}*/
	}
</script>
<style>
	.basicInfo-block {
		//background: #007AFF;
	}

	.video-time {
		//background: #007AFF;
		margin-top: 10px;
		//font-weight: bold;
	}

	.one {
		color: rgba(255, 144, 0, 1) !important;
		border: 1px dashed rgba(255, 144, 0, 0.9) !important;
	}

	.video-number {
		float: left;
		margin-top: -40px;
		margin-left: -9px;
		font-size: 12px;
		color: #FFFFFF;
		//line-height: 34px;
		padding: 2px 10px;
		border-radius: 0 8px 3px 8px;
		background: rgba(0, 0, 0, 0.6);
		z-index: 2;
		position: relative;
		border: 1px solid rgba(255, 255, 255, 0.8);
		//border-left: none;
	}

	.video-list {
		padding: 0 4% 0 6%;
		width: 90%;
		margin: 10px 0;
	}

	.video-img {
		width: 45%;
		//background: #1AAD19;
		display: inline-block;
	}

	.video-img image {
		height: 95px;
		width: 90%;
		border-radius: 5px;
		background: #CCCCCC;
		box-shadow: 4px 4px 6px 0px rgba(103, 103, 103, 0.8);
		z-index: 1;
		position: relative;
	}

	.video-info {
		width: 55%;
		display: inline-block;
		float: right;
		font-size: 13px;
		color: #999999;
	}

	.video-title {
		font-size: 15px;
		color: #FFFFFF;
		font-weight: bold;
		height: 40px;
		line-height: 20px;
		overflow: hidden;
		text-overflow: ellipsis;
		padding-top: 5px;
	}

	.bg {
		width: 100%;
	}

	.head-bg {
		//background: #007AFF;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 260px;
		z-index: 0;
		filter: blur(3px);
	}

	.head {
		width: 100%;
		height: 262px;
		box-sizing: border-box;
		background-image: linear-gradient(to right, rgba(255, 12, 208, 0.8), rgba(254, 67, 101, 0.8));
		padding: calc(44px + var(--window-top)) 5% 0;
	}

	.head-content {
		width: 100%;
		//background: #007AFF;
		height: 200px;
		position: relative;
		z-index: 7;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.head-tx {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 110px;
	}

	.head-tx image {
		width: 100px;
		height: 100px;
		background: #CCCCCC;
		border-radius: 50%;
		border: 3px solid rgba(239, 187, 52, 1);
		z-index: 9;
		position: relative;
	}

	.head-conut {
		width: 110px;
		height: 30px;
		line-height: 30px;
		background: rgba(239, 187, 52, 1);
		font-size: 14px;
		text-align: center;
		border-radius: 30px;
		margin-top: -15px;
		z-index: 10;
		position: relative;
		color: #FFFFFF;
	}

	.head-title {
		width: 100%;
		text-align: center;
		padding: 10px 0 0;
		color: #FFFFFF;
	}

	.head-title view {
		//background: #007AFF;
	}

	.head-name {
		display: inline-block;
		width: auto;
		height: 30px;
		line-height: 30px;
		font-size: 20px;
		//border-bottom: 2px solid #FFFFFF;
		padding-bottom: 5px;
		background: rgba(103, 103, 103, 0.5);
		padding: 2px 10px;
		border-radius: 3px;
	}

	.head-desc {
		font-size: 13px;
		//background: rgba(103,103,103,0.5);
		padding: 3px 5px;
		border-radius: 3px;
	}

	.head-list {
		width: 100%;
		height: 40px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		margin-top: 10px;
	}

	.head-list-item {
		width: auto;
		margin-right: 12rpx;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		color: #fff;
		font-size: 13px;
	}

	.head-list-item image {
		width: 32rpx;
		height: 32rpx;
		margin-right: 8rpx;
	}

	.production-focus {
		width: 32px;
		height: 32px;
		position: absolute;
		top: 70px;
		left: 50%;
		margin-left: 20px;
		z-index: 9;
	}
</style>