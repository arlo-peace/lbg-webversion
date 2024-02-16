<template>
	<view class="content" :style="{'padding-top':phone.safeArea.top+'px'}">
		<css-loading ref="cssLoading"></css-loading>
		<view class="head-content" v-if="!isLogin">
			<view class="head-content-top nologin">
				<image src="/static/imgs/tx0.png" mode="aspectFill"
					style="width:130upx;height:130upx;border-radius:50%;margin-top:15upx;"></image>
				<view style="flex:1;margin-left:30upx;">
					<text class="head-content-login" @click="jumpUrl('login/login', 'new')">登录 / 注册</text>
					<view style="font-size:26upx;color:#999;height:40upx;line-height:40upx;">登录后可获得更多精彩内容哦~</view>
				</view>
			</view>
		</view>

		<view class="head-content" v-else>
			<view class="head-content-top" @click="jumpUrl('member/setting', 'new')">
				<image class="tx" :src="userImg" mode="aspectFill"></image>
				<view style="display: flex;flex-direction: column;flex: 1;padding: 0 20upx;">
					<text style="font-size:18px;color:#FFF;height:50upx;line-height:60upx;">{{userInfo.nickname}}</text>
					<!-- <text style="font-size:12px;color:#999;height:50upx;line-height:45upx;" v-if="userInfo.isVip">
						今日观影不限　本周下载：{{userInfo.down.sum}}/{{userInfo.down.tot}}
					</text>
					<text style="font-size:12px;color:#999;height:50upx;line-height:45upx;" v-else>
						观看次数：{{userInfo.watch}}/{{userInfo.watch_count}}　本周下载：{{userInfo.down.sum}}/{{userInfo.down.tot}}
					</text> -->
					<text style="font-size:11px;color:#999;height:50upx;line-height:45upx;letter-spacing:5upx;"
						v-if="userInfo.isVip">
						VIP剩余：{{userInfo.vipValid}}天 账户金币数：{{userInfo.corn}}枚
					</text>
					<text style="font-size:11px;color:#999;height:50upx;line-height:45upx;letter-spacing:4upx;" v-else>
						免费观看次数：{{userInfo.watch}}/{{userInfo.watch_count}} 账户金币数：{{userInfo.corn}}枚
					</text>
					<text
						style="font-size:11px;color:#999;height:50upx;line-height:45upx;margin-top:-10upx;letter-spacing:4upx;">
						分享{{userInfo.share_reward_text}}，首次注册送{{userInfo.regPint}}{{userInfo.regUnit}}{{userInfo.regType}}
					</text>
				</view>
				<image class="right-img" src="@/static/imgs/r.png"></image>
			</view>
			<view class="head-content-bottom">
				<image :src="user_level" class="user-level-img" mode="aspectFill"></image>
				<view style="display:flex;flex-direction:column;flex:1;"
					@click="jumpUrl('recharge/recharge?type=2', 'new')" v-if="userInfo.isVip">
					<text class="user-vip">尊贵的VIP会员</text>
					<text class="vip-date">{{exp_time}}</text>
				</view>
				<view style="display:flex;flex-direction:column;flex:1;"
					@click="jumpUrl('recharge/recharge?type=2', 'new')" v-else>
					<text class="user-level">普通用户 [开通会员]</text>
					<text class="vip-date">{{_self.exp_time}}</text>
				</view>
				<view style="font-size:13px;">
					<text class="y-sign" v-if="userInfo.sign">已签到</text>
					<image class="n-sign" @click="userSign" v-else src="@/static/member/sign-in.png" mode="aspectFill">
					</image>
				</view>
			</view>
		</view>

		<view class="recharge-banner">
			<view class="recharge-content">
				<image class="recharge-bg" src="@/static/member/banner.png" mode=""></image>
				<view class="recharge-text">
					<!--<text>VIP会员权限</text>-->
					<view class="recharge-button" @click="jumpUrl('recharge/detail', 'new')">VIP会员权限详情</view>
				</view>
			</view>
		</view>

		<view class="center-content">
			<view class="kuai-3">
				<view class="item-left" @click="jumpUrl('member/poster', 'new')">
					<text style="line-height:40px;font-size:12px;">分享好友</text>
					<text style="font-size: 11px;">{{userInfo.share_reward_text}}</text>
				</view>
				<view class="item-center-kefu" @click="jumpUrl('game/game_list', 'new')">
					<text style="line-height:40px;font-size:12px;">活动抽奖</text>
					<text style="font-size:11px;">超高中奖率</text>
				</view>
				<view class="item-right" @click="jumpUrl('recharge/recharge?type=2', 'new')">
					<text style="line-height:40px;font-size:12px;">充值金币</text>
					<text style="font-size: 11px;">{{userInfo.rec_text}}</text>
				</view>
			</view>
		</view>

		<view class="line"></view>

		<view class="bottom-content">
			<view class="bottom-content-line" @click="jumpUrl('upload/index', 'new')">
				<image src="@/static/member/upload_1.png"></image>
				<text>上传视频</text>
			</view>
			<view class="bottom-content-line" @click="jumpUrl('member/mymoney', 'new')">
				<image src="@/static/member/account_1.png"></image>
				<text>账户钱包</text>
			</view>
			<view class="bottom-content-line" @click="goHome(userId)">
				<image src="@/static/member/home_1.png"></image>
				<text>个人主页</text>
			</view>
			<view class="bottom-content-line" @click="jumpUrl('member/collect', 'new')">
				<image src="@/static/member/collection_1.png"></image>
				<text>视频收藏</text>
			</view>
			<view class="bottom-content-line" @click="openFollow">
				<image src="@/static/member/collection_1.png"></image>
				<text>视频关注</text>
			</view>
			<view class="bottom-content-line" @click="jumpUrl('member/watch_log', 'new')">
				<image src="@/static/member/history_1.png"></image>
				<text>我的足迹</text>
			</view>
			<view class="bottom-content-line" @click="jumpUrl('member/message', 'new')">
				<image src="@/static/member/ico_video_1.png"></image>
				<text>我的消息</text>
			</view>
			<view class="bottom-content-line" @click="jumpUrl('setting/setting', 'new')">
				<image src="@/static/member/seting_1.png"></image>
				<text>系统设置</text>
				<!--<view class="tag"></view>-->
			</view>
		</view>

		<view class="line"></view>
		
		<view class="bottom-content">
			<view class="bottom-content-line" @click="jumpUrl('setting/announement', 'new')">
				<image class="bottom-content-line-icon" src="@/static/member/home-more-1.png"></image>
				<text>官网公告</text>
			</view>
		<!-- #ifdef APP-PLUS -->
			<view class="bottom-content-line" @click="clearCache">
				<image class="bottom-content-line-icon" src="@/static/member/home-more-2.png"></image>
				<text>清理缓存</text>
			</view>
		<!-- #endif -->

			<view class="bottom-content-line" @click="jumpUrl('member/setting', 'new')">
				<image class="bottom-content-line-icon" src="@/static/member/home-more-3.png"></image>
				<text>编辑资料</text>
			</view>
			<view class="bottom-content-line" @click="goPublic">
				<image class="bottom-content-line-icon" src="@/static/member/home-more-4.png"></image>
				<text>官方开车</text>
			</view>
			<view v-if="isDg == 1" class="bottom-content-line" @click="jumpUrl('member/dgwallet', 'new')">
				<image class="bottom-content-line-icon" src="@/static/member/home-more-5.png"></image>
				<text>游戏钱包</text>
			</view>
			<view class="bottom-content-line" @click="jumpUrl('setting/mini', 'new')">
				<image class="bottom-content-line-icon" src="@/static/member/home-more-5.png"></image>
				<text>应用中心</text>
			</view>
			<view class="bottom-content-line" @click="jumpUrl('member/share_info', 'new')">
				<image class="bottom-content-line-icon" src="@/static/member/home-more-6.png"></image>
				<text>推广团队</text>
			</view>
			<view class="bottom-content-line" @click="jumpUrl('setting/center', 'new')">
				<image class="bottom-content-line-icon" src="@/static/member/home-more-7.png"></image>
				<text>创作中心</text>
			</view>
			<view class="bottom-content-line" @click="jumpUrl('member/money_log', 'new')">
				<image class="bottom-content-line-icon" src="@/static/member/home-more-8.png"></image>
				<text>消费明细</text>
			</view>
			<view class="bottom-content-line" @click="jumpUrl('setting/about', 'new')">
				<image class="bottom-content-line-icon" src="@/static/member/home-more-9.png"></image>
				<text>关于我们</text>
			</view>
			<view class="bottom-content-line" @click="jumpUrl('setting/feedback', 'new')">
				<image class="bottom-content-line-icon" src="@/static/member/home-fb.png"></image>
				<text>反馈</text>
			</view>
		</view>

		<view class="line"></view>

		<view class="content-out" v-if="isLogin" @click="logout">注销登录</view>

		<view class="line"></view>

		<uni-popup ref="popupWatch" type="center" backColor="rgba(0,0,0,0.1)">
			<view class="watch-bg">
				<view class="watch-item" @click="watch_log(1)">
					<image class="watch-item-ico" src="/static/member/ico_video0.png" mode="aspectFill"></image>
					<text>短视频</text>
				</view>
				<view class="watch-item" @click="watch_log(2)">
					<image class="watch-item-ico" src="/static/member/ico_video1.png" mode="aspectFill"></image>
					<text>长视频</text>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popupFollow" type="center" backColor="rgba(0,0,0,0.1)">
			<view class="watch-bg">
				<view class="watch-item" @click="jumpFollow('svod')">
					<image class="watch-item-ico" src="/static/member/ico_video0.png" mode="aspectFill"></image>
					<text>短视频</text>
				</view>
				<view class="watch-item" @click="jumpFollow('production')">
					<image class="watch-item-ico" src="/static/member/ico_video1.png" mode="aspectFill"></image>
					<text>长视频</text>
				</view>
			</view>
		</uni-popup>
		<view class="login-modal" v-if="showLogin">
			<view class="login-modal-shadow"></view>
			<view class="login-modal-body">
				<view class="login-modal-bg">
					<image src="../../static/login/bg.png"></image>
				</view>
				<view class="login-modal-content">
					<view class="login-modal-text">
						<text>账号: {{showUsername}}</text>
						<text>密码: 123456</text>
					</view>
					<view class="login-modal-btn" @click="confirmLogin">
						<image src="../../static/login/btn.png" mode=""></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	import db from '@/common/sqlite.js';
	var _self;
	export default {
		data() {
			return {
				phone: {},
				one: false,
				isLogin: false,
				showLogin: false,
				showUsername: '123456',
				userId: 0,
				userInfo: {
					nickname: '无名',
					username: '',
					server_url: '',
					corn: 0,
					money: 0,
					watch: 0,
					watch_count: 0,
					down: {
						sum: 0,
						tot: 0
					},
					rec_text: '你也可以很土豪',
					share_reward_text: '分享朋友得好礼'
				},
				isDg: false,
				vipText: '普通用户',
				userImg: '/static/imgs/head.png',
				exp_time: '...',
				isNewApp: false,
				loading: true,
				loadHeight: 600,
				user_level: '/static/member/user_free.png'
			}
		},
		onLoad() {
			_self = this;
			_self._showLoading()
			_self.phone = uni.getSystemInfoSync();
			// #ifdef H5
			_self.loadHeight = _self.phone.screenHeight;
			// #endif
			// #ifdef APP-PLUS
			_self.loadHeight = _self.phone.windowHeight;
			// #endif
			_self.isLogin = api.getLogins();
			if (_self.isLogin) {
				_self.userId = _self.isLogin.userId;
				_self.getUserInfo();
			} else {
				_self._hideLoading()
			}
			_self.isDg = uni.getStorageSync('dggame_' + api.appkey)
			uni.getStorage({
				key: 'isNewVersion',
				success: (res) => {
					_self.isNewApp = res.data;
				}
			});
		},
		onHide() {
			this.userId = 0;
			this.one = true;
		},
		onShow() {
			this.isLogin = api.getLogins();
			if (this.isLogin && this.one) {
				this.userId = this.isLogin.userId;
				this.getUserInfo();
			}
			uni.setStorage({
				key: 'upload_' + api.appkey,
				data: false,
				success: () => {
					//console.log('success');
				}
			});
		},
		mounted() {
			uni.getStorage({
				key: 'isAuto_' + api.appkey,
				success: (res) => {
					if (!res.data) {
						var row = api.getLogins();
						var username = row.account;
						if (username != undefined && username.length) {
							_self.showUsername = username
							_self.showLogin = true
						}
					}
				}
			});
		},
		methods: {
			clearCache() {
				//可以询问用户是否删除
				uni.showModal({
					title: '提示',
					content: '确定清除缓存吗?',
					success(res) {
						// 用户确定要删除
						if (res.confirm) {
							plus.cache.clear(function() {
								uni.showToast({
									title: '清除成功',
									icon: 'none'
								})
							});
						}
					}
				})
			},
			confirmLogin() {
				uni.setStorage({
					key: 'isAuto_' + api.appkey,
					data: true
				});
				_self.showLogin = false
			},
			goHome(uid) {
				if (uid == 0) {
					api.showToast('请先登录账号');
					let timer = setTimeout(() => {
						_self.jumpUrl('login/login', 'new');
						clearTimeout(timer);
					}, 500);
					return
				}
				var param = {
					url: '/pages/member/member',
					t: 'tab'
				}
				api.jumpUrl('/pages/member/home_page?type=' + JSON.stringify(param) + '&uid=' + uid, 'new');
			},
			goPublic()
			{
				api.jumpUrl(_self.userInfo.public_url, _self.userInfo.public_url.indexOf('http') > -1 ? 'outer' : 'new')
			},
			getUserInfo() {
				uni.request({
					url: api.apiData.getInfo,
					method: 'POST',
					data: {
						userId: _self.userId
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						//console.log(e)
						if (e.data.Code == 200) {
							_self.userInfo = e.data.Data;
							if (_self.userInfo.down.tot == 0) _self.userInfo.down.sum = 0;
							//console.log(_self.userInfo);
							_self.userImg = (_self.userInfo.avatar == '') ? '/static/imgs/head.png' : _self
								.userInfo.avatar;
							_self.userInfo.nickname = (_self.userInfo.nickname == '') ? _self.userInfo
								.username : _self.userInfo.nickname;
							_self.userInfo.username = _self.userInfo.username
							_self.userInfo.server_url = _self.userInfo.server_url
							_self.userInfo.public_url = _self.userInfo.public_url
							if (_self.userInfo.is_permanent == 1) {
								_self.user_level = '/static/member/user_vip_1.png';
								_self.exp_time = "欢迎回来，尊贵的永久VIP";
								_self.vipText = "永久VIP"
							} else if (_self.userInfo.isVip) {
								_self.user_level = '/static/member/user_vip_1.png';
								_self.exp_time = '到期时间：' + _self.userInfo.vipEndTime;
								_self.vipText = "VIP到期" + _self.userInfo.vipEndTime;
							} else {
								_self.user_level = '/static/member/user_free_1.png';
								_self.exp_time = '升级VIP，全站视频任意看';
							}
							uni.request({
								url: api.apiData.checkNewMessage,
								method: 'POST',
								data: {
									userId: _self.userId
								},
								header: {
									'Content-type': 'application/x-www-form-urlencoded'
								},
								success: (c) => {
									if (c.data.Code == 200) {
										if (c.data.Data) {
											const innerAudioContext = uni
												.createInnerAudioContext();
											innerAudioContext.autoplay = true;
											innerAudioContext.src = '../../static/audio/msg.mp3';
											innerAudioContext.play();
										}
									}
								},
							})
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
			userSign() {
				_self._showLoading('签到中...')
				uni.request({
					url: api.apiData.userSign + '/userId/' + _self.userId,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: e => {
						var res = e.data;
						_self._hideLoading()
						api.showToast(res.Msg, 3000);
						if (res.Code == 200) _self.userInfo.sign = true;
					},
					fail: () => {
						_self._hideLoading()
						// 加载失败提示
						api.showToast('服务器连接失败，请检查网络是否正常', 3000);
					}
				});
			},
			logout() {
				uni.showModal({
					confirmText: '退出登录',
					cancelText: '点错了',
					content: '确定退出登录吗？',
					success: res => {
						if (res.confirm) {
							if (api.delLogins()) {
								api.showToast('退出成功');
								let timer = setTimeout(() => {
									_self.jumpUrl('login/login', 'new');
									clearTimeout(timer);
								}, 500);
							} else {
								api.showToast('操作失败，请稍后再试', 2000);
							}
						}
					}
				});
			},
			openFollow() {
				_self.$refs['popupFollow'].open('center')
			},
			jumpFollow(t) {
				_self.$refs['popupFollow'].close();
				let timer = setTimeout(() => {
					api.jumpUrl('/pages/member/' + t, 'new');
					clearTimeout(timer);
				}, 300)
			},
			watch_log(t) {
				_self.$refs['popupWatch'].close();
				let timer = setTimeout(() => {
					if (t == 1) {
						api.jumpUrl('/pages/member/watch_log_svod', 'new');
					} else {
						var p = {
							url: '/pages/member/member',
							type: 'tab'
						};
						api.jumpUrl('/pages/member/watch_log?path=' + JSON.stringify(p), 'new');
					}
					clearTimeout(timer);
				}, 300)
			},
			contactServer() {
				var usr = {
					name: _self.userInfo.username,
					address: '【' + _self.vipText + '】余额:' + _self.userInfo.corn + '金币' + _self.userInfo.money
				}
				var server_url = _self.userInfo.server_url.indexOf('?') != -1 ? _self.userInfo.server_url + '&metadata=' +
					JSON.stringify(usr) : _self.userInfo.server_url + '?metadata=' + JSON.stringify(usr)
				api.jumpUrl(encodeURIComponent(server_url), 'app', '客服中心');
			},
			jumpUrl(uri = 'login/login', type = 'new') {
				if (_self.isLogin || uri == 'login/login' || uri == 'login/register' || uri == 'setting/about' || uri ==
					'setting/setting') {
					if (uri == 'member/watch_log') {
						_self.$refs['popupWatch'].open();
					} else {
						api.jumpUrl('/pages/' + uri, type);
					}
				} else {
					api.showToast('请先登录账号');
					let timer = setTimeout(() => {
						_self.jumpUrl('login/login', 'new');
						clearTimeout(timer);
					}, 500);
				}
			},
		},
		onPullDownRefresh() {
			if (_self.isLogin) _self.getUserInfo();
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
	@import url('@/components/loading/loading.css');

	.watch-item text {
		color: #CCCCCC;
		font-size: 13px;
		font-weight: bold;
		margin-top: 20upx;
	}

	.watch-item-ico {
		width: 100upx;
		height: 100upx;
	}

	.watch-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0 40upx;
	}

	.watch-bg {
		background-color: rgba(255, 255, 255, 0.1);
		padding: 40upx 30upx;
		border-radius: 30upx;
		display: flex;
		flex-direction: row;
	}

	.user-level-img {
		width: 56px;
		height: 56px;
		margin-right: 20upx;
	}

	.center-content text {
		display: block;
		font-size: 12px;
		color: #FFFFFF;
		padding: 0 20upx;
		height: 30px;
	}

	.kuai-3 {
		display: flex;
		/*设置显示样式**/
		align-items: center;
		/**子view垂直居中*/
		vertical-align: center;
		/**垂直居中*/
		justify-content: center;
		/**内容居中*/
		flex-direction: row;
		/**子view排列方式row--水平 column--垂直*/
		box-shadow: 0px 6px 6px 0px rgba(103, 103, 103, 0.2);
		padding-bottom: 40upx;
		border-radius: 0 0 40upx 40upx;
	}


	.center-content {
		border-radius: 40upx 40upx 0 0;
		box-shadow: 0px -6px 6px 0px rgba(103, 103, 103, 0.2);
		padding-top: 40upx;
		margin: 0 30upx;
	}

	.recharge-banner {
		width: 100%;
		padding: 10upx 30upx 20upx;
		box-sizing: border-box;
		margin-top: -10upx;
	}

	.recharge-banner .recharge-content {
		width: 100%;
		padding-bottom: 19.12%;
		height: 0;
		position: relative;
	}

	.recharge-banner .recharge-content .recharge-bg {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}

	.recharge-banner .recharge-content .recharge-text {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		font-size: 17px;
		font-weight: bold;
		color: #86372e;
		box-sizing: border-box;
		padding-top: 20upx;
	}

	.recharge-banner .recharge-content .recharge-text .recharge-button {
		background-image: linear-gradient(to right, #faeadd, #f5dcca, #f0cfb7, #ecc1a5, #e7b394);
		padding: 10upx 30upx;
		height: 40upx;
		line-height: 38upx;
		border-radius: 30upx;
		margin: 0 20upx;
		color: #4f3129;
		font-size: 14px;
		font-weight: 100;
	}

	.item-left {
		height: 60px;
		width: 32%;
		background-image: url(/static/member/img_left_share.png);
		background-size: cover;
		border-radius: 15px;
		display: inline-block;
		text-align: right;
		position: relative;
	}

	.item-center-kefu {
		height: 60px;
		width: 30%;
		background-image: url(/static/member/img_center_share.png);
		background-size: cover;
		border-radius: 15px;
		margin: 0 5px;
		display: inline-block;
		text-align: right;
		position: relative;
	}

	.item-right {
		height: 60px;
		width: 32%;
		background-image: url(/static/member/img_right_lottery.png);
		background-size: cover;
		border-radius: 15px;
		display: inline-block;
		text-align: right;
		position: relative;
	}

	.item-left::before,
	.item-center-kefu::before,
	.item-right::before {
		width: 100%;
		border-radius: 15px;
		height: 60px;
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		background: rgba(0, 0, 0, .2);
		//z-index: 1;
	}

	.item-left text,
	.item-center-kefu text,
	.item-right text {
		position: relative;
		//z-index: 2;
		text-shadow: 0 1px 1px rgba(0, 0, 0, .3)
	}

	.y-sign {
		color: #FF8F00;
		text-align: right;
		height: 40upx;
		line-height: 40upx;
		width: 100upx;
		display: inline-block;
	}

	.n-sign {
		//background: #FF8F00;
		height: 43upx;
		//line-height: 40upx;
		//border-radius: 10upx;
		text-align: center;
		width: 100upx;
		display: inline-block;
		//color: #FFFFFF;
		//font-size: 12px;
	}

	.sign {
		font-size: 24upx;
		display: inline-block;
		margin-top: -35upx;
		//background-color: #007AFF;
		text-align: right;
	}

	.nologin .head-content-login {
		display: inline-block;
		width: 200upx;
		height: 60upx;
		line-height: 60upx;
		background-color: none;
		color: #FF8F00 !important;
		border-radius: 60upx;
		font-size: 30upx !important;
		text-align: center;
		border: 1px solid #FF8F00;
	}

	.nologin {
		margin: 30upx 30upx 130upx;
	}

	.vip-date {
		color: #FFEEDF;
		font-size: 12px;
		margin-left: 1px;
	}

	.user-vip {
		font-size: 15px;
		color: rgba(255, 12, 208, 0.8);
	}

	.user-level {
		font-size: 15px;
		color: #FFB800;
	}

	.content-out {
		width: 90%;
		height: 80upx;
		line-height: 80upx;
		text-align: center;
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		margin: 30upx auto;
		font-size: 30upx;
		color: #FFFFFF;
		border-radius: 20upx;
	}



	.bottom-content-line text {
		font-size: 13px;
		color: #AFAFB4;
		height: 30upx;
		line-height: 30upx;
	}

	.bottom-content-line image {
		width: 80upx;
		height: 60upx;
		margin-bottom: 10upx;
	}
	
	image.bottom-content-line-icon{
		width: 80upx;
		height: 80upx;
	}

	.bottom-content-line {
		height: 120upx;
		padding: 3upx 30upx;
		width: 25%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		margin: 5upx 0;
	}
	
	.bottom-content-line .tag{
		width:10px;
		height:10px;
		border-radius:50%;
		background:#F9221D;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: 25upx;
		margin-top: -50upx;
	}

	.bottom-content {
		padding: 20upx 0;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		margin: 10upx 30upx;
		background-color: rgba(255, 255, 255, .15);
		border-radius: 30upx;
	}




	.center-content-item image {
		width: 70upx;
		height: 70upx;
	}

	.center-content-item {
		width: 25%;
		font-size: 25upx;
		text-align: center;
		display: inline-block;
		margin-bottom: 20upx;
		color: #666666;
	}

	.head-content-bottom {
		margin: 30px 30upx 20upx;
		border-radius: 20upx;
		background-image: linear-gradient(to right, rgba(255, 217, 115, 0.1), rgba(255, 255, 255, 0.1));
		//background-image: url(/static/member/bg.png);
		//background-size: 100% 100%;
		padding: 10upx 20upx;
		display: flex;
		flex-direction: row;
	}

	.head-content-center-left {
		margin-right: 6%;
		background-image: linear-gradient(to right, rgba(255, 12, 208, 0.8), rgba(254, 67, 101, 0.8));
	}

	.head-content-center-right {
		background-image: linear-gradient(to right, rgba(255, 12, 208, 0.8), #dd0aeb);
	}

	.head-content-center view {
		width: 47%;
		height: 90upx;
		display: inline-block;
		border-radius: 20upx;
	}

	.head-content-center image {
		width: 80upx;
		height: 80upx;
		margin: 5upx 0 0 10upx;
	}

	.head-content-center text {
		font-size: 30upx;
		color: #FFFFFF;
		display: block;
	}

	.head-content-center {
		margin-top: 50upx;
	}

	.head-content-top .right-img {
		width: 40upx;
		height: 40upx;
		margin-top: 30upx;
		margin-right: 30upx;
	}

	.head-content-top .tx {
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
		box-shadow: 0px 0px 8px 5px rgba(255, 143, 0, 0.1);
		border: 1px solid rgba(255, 143, 0, 0.3);
		margin-left: 30upx;
	}

	.head-content-top {
		height: 100upx;
		line-height: 100upx;
		display: flex;
		flex-direction: row;
	}

	.head-content {
		//background-color: #ffffff;
	}

	.right {
		float: right;
	}

	.left {
		float: left;
	}

	.line {
		height: 20upx;
		background-color: #1D1D28;
	}

	.login-modal {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.login-modal-shadow {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .7);
		position: absolute;
		top: 0;
		left: 0;
	}

	.login-modal-body {
		width: 507upx;
		height: 602upx;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.login-modal-bg {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	.login-modal-bg image {
		width: 100%;
		height: 100%;
	}

	.login-modal-content {
		box-sizing: border-box;
		width: 420upx;
		height: 440upx;
		font-size: 42upx;
		color: #ffffff;
		font-weight: 600;
		position: relative;
		z-index: 99;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-left: 30upx;
		margin-top: 240upx;
	}

	.login-modal-text {
		height: 240upx;
		display: flex;
		flex-direction: column;
		line-height: 2;
		justify-content: left;
		align-items: left;
	}

	.login-modal-text text {
		font-weight: 600;
		font-size: 40upx;
	}

	.login-modal-btn {
		margin-top: 80upx;
		width: 320upx;
		height: 87upx;
	}

	.login-modal-btn image {
		width: 100%;
		height: 100%;
	}
</style>