<template>
	<view class="bg">
		<view class="head">
			<image :src="albumInfo.bg" mode="aspectFill" class="head-bg"></image>
			<view class="head-content">
				<view class="head-tx">
					<image :src="albumInfo.userTx" mode="aspectFill"></image>
					<view class="head-conut">共{{works}}{{dw}}</view>
				</view>
				<view class="head-title">
					<view class="head-name">{{albumInfo.username}}</view>
					<view class="head-desc">{{albumInfo.userifno}}</view>
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
				<jyf-parser :html="albumInfo.Introduction" ref="article"></jyf-parser>
				<!-- #endif -->

				<!-- #ifdef MP-WEIXIN -->
				<rich-text :nodes="albumInfo.Introduction"></rich-text>
				<!-- #endif -->
			</view>
		</view>
		<view style="height:10px;background:#20202C;"></view>
		<view style="padding:10px 5% 5px;width:90%;">
			<view style="font-weight:bold;font-size:20px;color:#FFFFFF;padding-left:5px;">作品</view>
		</view>
		<view class="video-list" v-for="(v, i) in albumInfo.list" :key="i" @click="playVideo(v.id)">
			<view class="video-img">
				<image :src="v.img" mode="aspectFill"></image>
				<view v-if="albumInfo.show_type==1">
					<text class="video-number one" v-if="v.vSort==0">花 絮</text>
					<text class="video-number" v-else-if="v.vSort>0&&!v.is_foreshow">第{{v.vSort}}集</text>
					<text class="video-number one" v-else>第{{v.vSort}}集 预告</text>
				</view>
			</view>
			<view class="video-info">
				<view class="video-title">{{v.title}}</view>
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
			<view style="width:100%;font-size:25upx;color:#666;margin-top:30upx;">此人很懒，暂时没有作品，请稍后再试</view>
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
				works: 0,
				albumInfo: {
					username: '加载中...',
					userifno: '正在加载中，请稍后...',
					Introduction: '暂无介绍',
					show_type: 2,
				},
				albumId: 0,
				utils: utils,
				isShowTig: false,
				dw: '部作品',

				backUrl: {
					url: '/pages/video/class',
					type: 'tab'
				}
			}
		},
		onLoad(e) {
			_self = this;
			_self._showLoading('加载中...');
			_self.albumId = e.aid;
			if (e.param != undefined) _self.backUrl = JSON.parse(e.param);
			_self.getAlbum();
		},
		mounted: function() {
			/* const query = uni.createSelectorQuery().in(this);
			query.select('#toTop').boundingClientRect(data => {
				//_self.toHeight = _self.bgHeight-data.top-5
				//console.log(data)
			}).exec();	 */
		},
		methods: {
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
						var param = {
							url: '/pages/video/album?aid=' + _self.albumId,
							t: 'new'
						}
						api.jumpUrl('/pages/video/play?type=' + JSON.stringify(param), 'new');
					}
				});
			},
			// 读取信息
			getAlbum() {
				uni.request({
					url: api.apiData.getAlbum,
					method: 'POST',
					data: {
						albumId: _self.albumId
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						_self.albumInfo = e.data.Data;
						//console.log(_self.albumInfo.Introduction);
						// 顶部背景
						if (_self.albumInfo.bg.length > 0) {
							api.imgCache(_self.albumInfo.bg, (bgCache) => {
								_self.albumInfo.bg = bgCache;
							});
						}
						if (_self.albumInfo.Introduction.length < 1) _self.albumInfo.Introduction =
							'此人很懒，暂无简介。';
						if (_self.albumInfo.list.length > 0) {
							_self.works = _self.albumInfo.list.length;
							_self.isShowTig = false;
						} else {
							_self.isShowTig = true;
						}
						if (_self.albumInfo.show_type == 1) _self.dw = '集';
						// 原生顶部标题
						uni.setNavigationBarTitle({
							title: '[' + _self.albumInfo.username + '] 专栏'
						});
						setTimeout(() => {
							_self._hideLoading();
						}, 1000);
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
				}, 200)
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			_self.getAlbum();
			uni.stopPullDownRefresh();
		},
		onBackPress(e) {
			api.jumpUrl(_self.backUrl.url, _self.backUrl.type);
			return true;
		}
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
		height: 250px;
		z-index: 0;
		filter: blur(3px);
	}

	.head {
		width: 90%;
		height: 150px;
		//background: #ff6f33;
		background-image: linear-gradient(to right, rgba(255, 12, 208, 0.8), rgba(254, 67, 101, 0.8));
		padding: 100px 5% 0;
	}

	.head-content {
		width: 100%;
		//background: #007AFF;
		height: 130px;
		position: relative;
		z-index: 7;
	}

	.head-tx {
		width: 30%;
		display: inline-block;
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
		width: 60%;
		float: right;
		//background: #1AAD19;
		display: inline-block;
		padding: 15px 0 0;
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
		margin-top: 15px;
		padding: 3px 5px;
		border-radius: 3px;
	}
</style>