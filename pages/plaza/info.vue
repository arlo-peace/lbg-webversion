<template>

	<view class="content">
		<css-loading ref="cssLoading"></css-loading>
		<view class="center-content">
			<view class="content-head">
				<image class="tx left" :src="info.headimgurl" mode="aspectFill" @click="goHome(info.uid)"></image>
				<view class="username" v-if="info.username">{{info.nickname}}</view>
				<view class="username" v-else>* 保密 *</view>
				<view class="is-my right" v-if="info.isMe">我发布的</view>
			</view>
			<view class="content-center">
				<text v-if="info.tag" style="color:rgba(255, 12, 208, 0.8)">#{{info.tag}}#</text>
				<view class="text">{{info.text}}</view>

				<view class="imgs">
					<!-- #ifndef APP-PLUS -->
					<jyf-parser use-cache :html="imgList" ref="article" v-if="imgList.length>0"></jyf-parser>
					<!-- #endif -->
					<!-- #ifdef APP-PLUS -->
					<view class="imgBox" v-for="(mm, ii) in info.allImg"
						:class="{imgBoxA:info.allImg.length == 4 || info.allImg.length == 2,imgBoxB:info.allImg.length == 1}">
						<image :src="mm" @click="showPrev(ii)" :key="ii" class="_imgmore" mode="aspectFill"></image>
					</view>
					<!-- #endif -->
				</view>
			</view>
			<view class="content-bottom">
				<text>{{utils.timeTodate('Y年m月d日',info.add_time+'')}}</text>
			</view>
		</view>

		<view class="ad-list">
			<view class="ad-info" v-for="(a, i) in adList" :key="i" @click="skipUrl(a.url, 'web')">
				<image :src="a.content" mode="aspectFill" :style="{'height':a.height+'px'}"></image>
			</view>
		</view>

		<view class="comment-bottom">
			<view class="comment-bottom-top">
				<text style="border-bottom:1px solid #999;padding-bottom:10upx;color:#FFFFFF;">全部评论
					({{commentCount}})</text>
			</view>
			<view class="comment-bottom-content">
				<view class="comment-bottom-info" v-for="(c, i) in commentList" :key="i">
					<view class="comment">
						<view class="top" @click="goHome(c.member.id)">
							<image class="left" :src="c.member.headimgurl" mode="aspectFill"></image>
							<text style="margin-left:15upx;color:#FFFFFF;">{{c.member.username}}</text>
							<text class="right date">{{c.add_time}}</text>
						</view>
						<view class="comment-info">{{c.content}}</view>
					</view>
				</view>

				<view class="send-comment">
					<input type="text" @input="setContent" :value="content" placeholder="我也来说几句" :maxlength="50"
						:cursor-spacing="10" />
					<text class="btn right" @click="sendPostComment">评论</text>
				</view>
			</view>
			<view style="width:100%;text-align:center;margin:100px 0;" v-if="commentCount==0">
				<image src="/static/empty.png" style="width:100px;height:100px;"></image>
				<view style="width:100%;font-size:25upx;color:#666;margin-top:30upx;">暂无评论，我来发一句试试</view>
			</view>
		</view>
	</view>
</template>
<script>
	import api from "@/common/api.js";
	import utils from '@/components/shoyu-date/utils.filter.js';
	var _self;
	export default {
		data() {
			return {
				utils: utils,
				loading: true,
				isLogin: false,
				userId: 0,
				phone: {},
				h5Top: 0,
				page: 1,
				info: {
					username: 'loading...',
					isMe: false,
				},
				imgList: "",
				adList: [],

				commentList: [],
				commentCount: 0,
				content: '',

				type: 1,
			}
		},
		onLoad(e) {
			_self = this;
			_self._showLoading()
			_self.type = e.t;
			_self.isLogin = api.getLogins();
			if (_self.isLogin) _self.userId = _self.isLogin.userId;
			_self.phone = uni.getSystemInfoSync();
			// #ifdef H5
			_self.h5Top = 90;
			// #endif
			_self.initData();
		},
		methods: {
			showPrev(v) {
				var urls = _self.info.allImg,
					current = urls[v] ? parseInt(v) : 0;
				uni.previewImage({
					current,
					urls
				})
			},
			setContent(e) {
				//console.log(e.detail.value)
				_self.content = e.detail.value;
			},
			sendPostComment() {
				//console.log(_self.content.length)
				if (!_self.isLogin) {
					api.showToast('请登录后再发来帖');
					setTimeout(() => {
						_self.skipUrl('/pages/login/login', 'new');
					}, 500);
					return;
				}
				if (_self.content.length < 1) {
					api.showToast('请输入评论内容', 1500);
					return;
				}
				_self._showLoading('发布中...');
				uni.request({
					url: api.apiData.sendComment,
					method: 'POST',
					data: {
						post_id: _self.info.id,
						userId: _self.userId,
						content: _self.content,
						pid: 0
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var r = e.data;
						api.showToast(r.Msg, 2000);
						if (r.Code == 201) return
						_self.content = '';
						_self.getData();
					},
					fail: () => {
						// 加载失败提示
						api.showToast("服务器连接失败，请检查网络是否正常", 3000);
					},
					complete: () => {
						setTimeout(() => {
							_self.loading = false;
							_self._hideLoading()
						}, 500);
					}
				});
			},
			goHome(uid) {
				if (uid == 0) {
					api.showToast('用户账号异常', 1500);
					return;
				}
				var param = {
					url: '/pages/plaza/info?t=1',
					t: 'new'
				}
				//console.log(uid)
				_self.skipUrl('/pages/member/home_page?type=' + JSON.stringify(param) + '&uid=' + uid, 'new');
			},
			initData() {
				uni.getStorage({
					key: 'info_content_' + api.appkey,
					success: (res) => {
						_self.info = res.data;
						// #ifndef APP-PLUS
						_self.imgList = '<div style="display:flex;flex-wrap: wrap;width:100%;flex-d">'
						// #endif
						var imgList = _self.info.allImg;
						if (imgList.length > 0) {
							for (var i = 0; i < imgList.length; i++) {
								// #ifndef APP-PLUS
								if (imgList.length == 1) {
									_self.imgList +=
										'<div style=" padding:2px 1px;height:auto;display:flex;flex-basis:100%%;box-sizing:border-box;"><img src="' +
										imgList[i] + '" style="width:100%;height:auto" /></div>';

								} else
								if (imgList.length == 2 || imgList.length == 4) {
									_self.imgList +=
										'<div style=" padding:2px 1px;height:auto;display:flex;flex-basis:50%;box-sizing:border-box;"><img src="' +
										imgList[i] + '" style="width:100%;height:auto" /></div>';
								} else {
									_self.imgList +=
										'<div style=" padding:2px 1px;height:auto;display:flex;flex-basis:33.33%;box-sizing:border-box;"><img src="' +
										imgList[i] + '" style="width:100%;height:auto" /></div>';
								}
								// #endif
							}
						}
						// #ifndef APP-PLUS
						_self.imgList += "</div>"
						// #endif
					},
					fail: () => {
						api.showToast('数据异常，请稍后重试', 1000);
						setTimeout(() => {
							_self.skipUrl('/pages/plaza/index', 'new');
						}, 500)
					},
					complete: () => {
						_self.getAd();
						_self.getData();
					}
				});
			},
			getAd() {
				uni.request({
					url: api.apiData.getAdInfo,
					method: 'POST',
					data: {
						position_id: 8,
						limit: 1
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						//console.log(e);
						var r = e.data;
						if (r.Code == 200) {
							_self.adList = r.Data;
						}
					}
				});
			},
			getData() {
				//if(_self.page > 1) uni.showLoading({ title:'正在载加...',mask:true });
				uni.request({
					url: api.apiData.getComment,
					method: 'POST',
					data: {
						post_id: _self.info.id
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						//console.log(e)
						var r = e.data;
						if (r.Code == 201) {
							api.showToast(r.Msg, 2000);
							return
						}
						_self.commentList = r.Data;
						//console.log(_self.commentList)
						_self.commentCount = _self.commentList.length;
					},
					fail: () => {
						// 加载失败提示
						api.showToast("服务器连接失败，请检查网络是否正常", 3000);
					},
					complete: () => {
						setTimeout(() => {
							_self.loading = false;
							_self._hideLoading()
						}, 500);
					}
				});
			},
			// 跳转登录
			skipUrl(uri = '/pages/login/login', type = 'new') {
				api.jumpUrl(uri, type)
			},
		},
		onPullDownRefresh() {
			_self.getAd();
			_self.getData();
			uni.stopPullDownRefresh();
		},
		onBackPress(e) {
			if (_self.type == 1) {
				api.jumpUrl('/pages/plaza/index', 'new');
				return true;
			}
		},
	};
</script>

<style>
	@import url('@/components/loading/loading.css');

	.send-comment .btn {
		display: inline-block;
		color: #FFFFFF;
		font-size: 26upx;
		height: 30px;
		width: 20%;
		line-height: 30px;
		border-radius: 30px;
		text-align: center;
		margin-right: 5%;
		margin-top: 10px;
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
	}

	.send-comment input {
		height: 30px;
		width: 60%;
		border: 1px solid #31313C;
		margin: 9px 0 0 5%;
		border-radius: 36px;
		padding: 0 20upx;
		font-size: 26upx;
		background-color: #20202C;
		display: inline-block;
		color: #FFFFFF;
	}

	.send-comment {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
		background-color: #20202C;
	}

	.comment-bottom-info .comment-info {
		font-size: 26upx;
		margin: 30upx 0 20upx;
		color: #999999;
		//background-color: #007AFF;
	}

	.comment-bottom-info .comment .top .date {
		font-size: 26upx;
		color: #999999;
	}

	.comment-bottom-info .comment .top {
		font-size: 28upx;
	}

	.comment-bottom-info .comment image {
		width: 45upx;
		height: 45upx;
		border-radius: 50%;
	}

	.comment-bottom-info {
		border-bottom: 1px solid #20202C;
		padding-bottom: 10upx;
		margin-bottom: 20upx;
	}

	.comment-bottom-content {
		//height: 100upx;
		margin-top: 15upx;
		margin-bottom: 50px;
		//background-color: #007AFF;
	}

	.comment-bottom-top {
		font-size: 30upx;
		margin: 10upx 0 50upx;
	}

	.comment-bottom {
		margin-top: 12upx;
		padding: 15upx 22upx;
	}

	.ad-list image {
		width: 100%;
		border-radius: 10upx;
		margin-bottom: -10upx;
	}

	.ad-list {
		margin-top: 15upx;
		margin-bottom: 0;
		padding: 0 20upx;
		//background-color: #FFFFFF;
	}

	.content-bottom {
		margin: 15upx 0 0;
		font-size: 24upx;
		color: #999999;
		text-align: right;
	}

	.content-center .imgs {
		margin-top: 15upx;
	}

	.content-center .text {
		font-size: 28upx;
		color: #FFFFFF;
	}

	.content-center {
		margin-top: 15upx;
	}

	.content-head .is-my {
		display: inline-block;
		color: #FF8F00;
		font-size: 24upx;
		height: 60upx;
		line-height: 60upx;
		width: 120upx;
		border-radius: 60upx;
		text-align: center;
		border: 1px solid #FF8F00;
		margin-top: 10upx;
	}

	.content-head .username {
		display: inline-block;
		height: 80upx;
		line-height: 80upx;
		width: 50%;
		margin-left: 15upx;
		font-size: 30upx;
		font-weight: bold;
		color: #FFFFFF;
	}

	.content-head .tx {
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
	}

	.center-content {
		//height: 300upx;
		background-color: #20202C;
		margin-top: 15upx;
		padding: 20upx 25upx;
	}

	.left {
		float: left;
	}

	.right {
		float: right;
	}

	.imgBox {
		display: inline-block;
		text-indent: 0;
		width: 31% !important;
		margin-right: 1%;
		margin-left: 1%;
		padding-top: 31% !important;
		margin-bottom: 1%;
		overflow: hidden;
		border-radius: 5px;
		height: 0;
		position: relative;
		//background-color: #007AFF;
	}

	.imgBoxA {
		width: 48% !important;
		margin-right: 1%;
		margin-left: 1%;
		padding-top: 48% !important;
	}

	.imgBoxB {
		width: 100% !important;
		margin-right: 0;
		margin-left: 0;
		padding-top: 100% !important;
	}

	._imgmore {
		position: absolute;
		left: 0;
		top: 0;
		text-indent: 0;
		width: 100% !important;
		height: 100% !important;
		overflow: hidden;
		border-radius: 5px;
		//background-color: #007AFF;
	}
</style>
