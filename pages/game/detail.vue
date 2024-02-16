<template>
	<view class="bg" v-if="item" :style="'width:'+width+'px;height:'+height+'px;box-sizing:border-box;'">
		<image :src="item.content_thumbnail" :style="'width:'+width+'px;height:'+height+'px;box-sizing:border-box;'"
			mode=""></image>
		<view class="showChoose" v-if="_self.item.status != 0">
			<view class="choosebox">
				<button type="warn" @click="join">立即参与本活动</button>
				<view @click="close = true"
					style="margin-top:10px;width: 100%;text-align: center;text-shadow: 0 0 1px rgba(0,0,0,.75);color:#F9221D;font-size: 14px;">
					<text> >>>点击了解活动详情<<< </text>
				</view>
			</view>
		</view>
		<view class="explain-tig" v-if="close">
			<view class="explain-content">
				<view class="explain-title">
					活动说明
					<image src="/static/imgs/delx.png" class="close" @click="closeTig"></image>
				</view>
				<view class="explain-center">
					<jyf-parser :html="item.content" ref="article"></jyf-parser>
				</view>
			</view>
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
				top: 27,
				userId: 0,
				id: 0,
				item: null,
				width: 0,
				height: 0,
				close: false
			}
		},
		onLoad(e) {
			_self = this;
			if (!e.id) {
				_self.skipUrl();
			}
			_self.id = e.id
			_self._showLoading('加载中...');
			var mobile = uni.getSystemInfoSync();
			_self.width = mobile.windowWidth
			_self.height = mobile.windowHeight
			_self.top = mobile.safeArea.top + 7;
			// 是否登录
			const info = api.getLogins();
			if (info === false) {
				_self.skipUrl();
			} else {
				_self.userId = info.userId;
				_self.getGameDetail();
			}
		},
		methods: {
			closeTig() {
				_self.close = false
			},
			join() {
				if (_self.item.target == 1) {
					_self.skipUrl(_self.item.url, 2);
				} else
				if (_self.item.target == 2) {
					plus.runtime.openURL(e.url);
				} else {
					_self.skipUrl('/pages/member/activity?type=' + encodeURI(_self.item.url + '?gid=' + _self.item.id), 2)
				}
			},
			// 获取活动列表
			getGameDetail() {
				uni.request({
					url: api.apiData.getGameDetail + '?id=' + _self.id,
					method: 'GET',
					success: (e) => {
						_self.item = e.data.Data;
						uni.setNavigationBarTitle({
							title: _self.item.title
						})
						_self._hideLoading();
						if (_self.item.status == 0) {
							_self.msgData('该活动已结束，开放时间请留意APP公告', 3000);
						}
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
				setTimeout(()=>{
					uni.showToast({
						icon: style,
						title: title,
						mask: true,
						duration: times
					});
				}, 200)
			}
		}
	}
</script>

<style>
	@import url('@/components/loading/loading.css');

	.bg {
		box-sizing: border-box;
		position: relative;
		overflow: hidden;
	}

	.explain-center {
		width: 96%;
		height: 270px;
		border-top: 1px solid #E5E5E5;
		//border-radius: 5px;
		overflow-y: scroll;
		padding: 2%;
		font-size: 13px;
		color: #666666;
		//box-shadow: 0px 4px 6px 0px rgba(103, 103, 103, 0.2);
	}

	.explain-title {
		width: 100%;
		height: 50px;
		line-height: 50px;
		font-size: 18px;
		text-align: left;
		color: #666666;
		font-weight: bold;
	}

	.close {
		width: 30px;
		height: 30px;
		float: right;
		margin: 5px -3% 0 0;
	}

	.explain-content {
		padding: 0 5%;
		width: 70%;
		height: 350px;
		border-radius: 10px;
		background: #FFFFFF;
		margin-top: 35%;
		margin-left: 10%;
	}

	.explain-tig {
		position: fixed;
		z-index: 98;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		left: 0;
		top: 0;
	}

	.explain {
		position: absolute;
		width: 50px;
		height: 30px;
		line-height: 30px;
		background: #2C405A;
		right: 13px;
		color: #FFFFFF;
		text-align: center;
		border-radius: 3px;
		font-size: 15px;
	}

	.showChoose {
		position: relative;
		bottom: 300upx;
		left: -5%;
		width: 110%;
		text-align: center;
		box-sizing: border-box;
		padding: 30px 200upx;
		padding-top: 90upx;
		background: rgba(0, 0, 0, .15);
		border-top-left-radius: 50%;
		border-top-right-radius: 50%;
	}
</style>
