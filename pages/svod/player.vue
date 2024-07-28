<template>
	<view class="page">
		<css-loading ref="cssLoading"></css-loading>
		<swiper class="video-list" :vertical="true" :current="playerId" :circular="false" :duration="duration"
			@change="onchange" :style="'height:'+phone.windowHeight+'px'">
			<swiper-item class="video-list-item" v-for="(item, index) in playerList" :key="index">
				<view class="item-content" v-if="item.type > 0">
					<uniVideo :src="item.content" :playStatus="playStatus" :muted="item.muted"
						:windowHeight="phone.windowHeight" @play="onplay" @playTime="playTime" @error="error"
						v-if="item.type == 2 && playerCur===index && item.isPlay">
					</uniVideo>
					<image @click="item.url != '#' && jumpUrl(item.url,'new')" mode="aspectFill" :src="item.content"
						:style="{height: phone.windowHeight+ 'px',width: phone.windowWidth+ 'px'}"
						v-if="item.type == 1 && playerCur===index && item.isPlay">
					</image>
				</view>
				<view class="item-content" v-else>
					<view class="ad-time" v-if="trySeconds != 0">{{ trySeconds }} S 后试看结束 </view>
					<uniVideo :src="item.url" :playStatus="playStatus" :muted="item.muted"
						:windowHeight="phone.windowHeight" @play="onplay" @playTime="playTime" @error="error"
						v-if="index==playerCur && item.isPlay">
					</uniVideo>
					<!-- pause -->
					<view class="pause-img" @click="playVideoStatus(!playStatus)">
						<image src="/static/svod/btn_player.png" style="width:150upx;height:150upx;margin-top:100px;"
							v-if="!playStatus"></image>
					</view>
					<!-- cover -->
					<image class="video-cover" mode="aspectFill" :lazy-load="true" :fade-show="false" :src="item.cover"
						:style="{height: phone.windowHeight+ 'px'}" v-if="item.showCover">
					</image>
					<!-- right -->
					<view class="svod-right">
						<view class="svod-right-cover" @tap="goHome(item.uid)">
							<image :src="getHeadImg(item.cover, item.headimgurl)" mode="aspectFill"
								style="width: 90rpx;height: 90rpx;border-radius: 90rpx;">
							</image>
						</view>
						<view class="svod-right-item act" v-if="userInfo.isVip">
							<text class="is-buy">尊贵VIP</text>
						</view>
						<view class="svod-right-item act" v-else-if="item.isBuy">
							<text class="is-buy">已购买</text>
						</view>
						<view class="svod-right-item act" v-else-if="item.gold==0">
							<text class="is-buy">限 免</text>
						</view>
						<view class="svod-right-item" @click="videoLike">
							<image class="icon" :src="'/static/svod/btn_like_'+item.like+'.png'" mode="aspectFill">
							</image>
							<text
								style="font-size:24rpx;font-weight: 500;text-align: center;color: #FFFFFF;">{{item.likeSum}}</text>
						</view>
						<view class="svod-right-item" @click="videoCollect">
							<image class="icon" :src="'/static/svod/btn_collection_'+(item.collect ? 1 : 0)+'.png'"></image>
							<text
								style="font-size:24rpx;font-weight: 500;text-align: center;color: #FFFFFF;">{{item.collectSum}}</text>
						</view>
						<view class="svod-right-item" @click="videoFollow">
							<image class="icon" :src="'/static/svod/follow_'+(item.fans ? 1 : 0)+'.png'"
								mode="aspectFill"></image>
						</view>
						<view class="svod-right-item" @click="comment(0)">
							<image class="icon" src="/static/svod/btn_comment.png" mode="aspectFill"></image>
							<text
								style="font-size:24rpx;font-weight: 500;text-align: center;color: #FFFFFF;">{{item.comment}}</text>
						</view>
						<view class="svod-right-item" @click="jumpUrl('/pages/member/poster', 'new')">
							<image class="icon" src="/static/svod/btn_share.png" mode="aspectFill"></image>
							<text style="font-size:24rpx;font-weight: 500;text-align: center;color: #FFFFFF;">分享</text>
						</view>
						<view class="svod-right-item" style="margin-top:65upx;" @click="setMuted">
							<image class="icon" :src="getMutedIcon()" mode="aspectFill"></image>
						</view>
					</view>
					<!-- bottom -->
					<view class="svod-bottom">
						<view class="svod-bottom-item">
							
							<text
								style="color:#FFFFFF;font-size:32rpx;font-weight:600;padding:10rpx 0;margin-bottom:10upx;">@{{item.nickname}}</text>
							<view class="item-tag-list" v-if="item.tagList && item.tagList.length">
								<text class="item-tag" v-for="(t, i) in item.tagList" :key="i"
									@click="jumpUrl('/pages/svod/tag_list?info='+JSON.stringify(t), 'new')">{{t.name}}</text>
							</view>
							<text
								style="color:#FFFFFF;font-size:28rpx;padding:10rpx;lines:1;width:590rpx;text-overflow:ellipsis;">{{item.title}}</text>
						</view>
					</view>
					<!-- Login Box -->
					<view class="buy-pop"
						v-if="userId==0">  <!-- && !item.isPlay -->
						<view class="buy-content">
							<image style="width:150rpx;height:150rpx;border-radius:150rpx;border:2px solid #F5F5F5;"
								mode="aspectFill" :src="getHeadImg(item.cover, item.headimgurl)">
							</image>
							<text class="video-title">{{item.title}}</text>
							<text style="font-size:12px;color:#CCCCCC;">登录并继续观看</text>
							<view class="buy-btn">
								<text class="btn-right" @click="linkTo('login/login')">前往登录</text>
							</view>
						</view>
					</view>
					<!-- 收费弹窗 -->
					<!-- <view class="buy-pop"
						v-if="showPopous && !item.isPlay">
						<view class="buy-content">
							<image style="width:150rpx;height:150rpx;border-radius:150rpx;border:2px solid #F5F5F5;"
								mode="aspectFill" :src="getHeadImg(item.cover, item.headimgurl)">
							</image>
							<text class="video-title">{{item.title}}</text>
							<text style="font-size:12px;color:#CCCCCC;">下载APP观看完整版视频</text>
							<view class="buy-btn">
								<text class="btn-right" @click="gotoDownload">立即下载</text>
							</view>
						</view>
					</view> -->
					<view class="buy-pop"
						v-if="userId && !item.isBuy && item.gold>0 && !userInfo.isVip && userInfo.free==0 && !item.isPlay">
						<view class="buy-content">
							<image style="width:150rpx;height:150rpx;border-radius:150rpx;border:2px solid #F5F5F5;"
								mode="aspectFill" :src="getHeadImg(item.cover, item.headimgurl)">
							</image>
							<text class="video-title">{{item.title}}</text>
							<text style="font-size:12px;color:#CCCCCC;">观看本影片需要支付{{item.gold}}金币</text>
							<view class="buy-btn">
								<text class="btn-right" @click="buyVideo">支付金币</text>
							</view>
						</view>
					</view>
				</view>
			</swiper-item>

		</swiper>
		<!-- 公告弹窗 -->
		<uni-popup ref="popupNotice" type="center" backColor="rgba(0,0,0,0.8)">
			<view class="notice-bg" :style="'height:'+(phone.windowHeight/2)+'px'">
				<image class="notice_title" src="/static/svod/notice.png" mode="aspectFill"></image>
				<scroll-view :scroll-y="true" :show-scrollbar="false" class="notice_content">
					<text style="font-size:14px;font-weight:bold;color:#222222;">{{noticeContent}}</text>
				</scroll-view>
				<text style="height:50rpx;"></text>
			</view>
		</uni-popup>
		<!-- 评论列表 -->
		<uni-popup ref="popupComment" type="bottom" @change="commentChange">
			<view class="comment-content" :style="'height:'+(phone.windowHeight/2+150)+'px'">
				<view class="comment-head">
					<text class="comment-title">评论 ({{commentListTot}}条)</text>
				</view>
				<scroll-view :scroll-y="true" :show-scrollbar="false" @scrolltolower="moreComment" class="comment-list">
					<template v-if="commentList && commentList.length && commentListTot">
						<view class="comment-list-item" v-for="(c, i) in commentList" :key="i">
							<image class="user-cover" :src="c.cover" mode="aspectFill"></image>
							<view class="user-info">
								<view style="flex-direction: row;">
									<text class="user-nickname">{{c.nickname}}</text>
									<text class="user-nickname" style="color:#FF8F00;margin-left:10rpx;"
										v-if="c.uid==userId">(我)</text>
								</view>
								<text class="user-date">{{utils.timeTodate('m-d H:i', c.add_time)}}</text>
								<text class="user-content">{{c.content}}</text>
							</view>
						</view>
					</template>
					<view style="margin:30px 0;align-items:center;display: flex;flex-direction: column;"
						v-if="!commentListTot">
						<image src="/static/empty.png" style="width:100px;height:100px;"></image>
						<text style="font-size:13px;color:#666;margin-top:10px;">当前还没有评论</text>
					</view>
				</scroll-view>
				<view class="comment-bottom">
					<input class="comment-input" type="text" placeholder="我来说几句 ~" v-model="commentContent"
						:cursor-spacing="4" />
					<text class="comment-send" @click="sendCommentContent">发送</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	import utils from '@/components/shoyu-date/utils.filter.js';
	import uniVideo from '@/components/svod/video_player';
	var _self;
	export default {
		components: {
			uniVideo
		},
		data() {
			return {
				showLoading: true,
				api: api,
				phone: {},
				utils: utils,
				userId: 0,
				fireTime: 5,
				userInfo: {
					free_look: 0,
					isVip: false,
					freeTot: 0,
					free: 0
				},
				mainPage: 1,
				playerList: [],
				item: {},
				playerCur: 0,
				playStatus: true,
				commentList: [],
				commentListTot: 0,
				commentContent: '',
				likeTime: 0,
				followTime: 0,
				collectTime: 0,
				noticeContent: '',
				duration: 300,
				did: 0,
				one: false,
				playerId: 0,
				showPopous: false,
				freeLook: 0,
				trySeconds: 0
			}
		},
		onLoad(e) {
			_self = this;
			this.item = JSON.parse(e.info);
			_self._showLoading()
			_self.phone = uni.getSystemInfoSync();
			let login = api.getLogins();
			if (login) _self.userId = login.userId;
			api.getMobileDid(r => {
				_self.did = r;
				_self.getInitData();
			});
		},
		onShow() {
			if (_self.one) {
				let login = api.getLogins();
				if (login) _self.userId = login.userId;
				_self.refreshSvod();
			}
			if(this.userId > 0){
				_self.playVideoStatus(true);
			}
		},
		onHide() {
			_self.one = true;
			_self.playVideoStatus(false);
		},
		created() {
			// uni.getStorage({
			// 	key: 'isAuto_' + api.appkey,
			// 	success: (res) => {
			// 		//console.log('生成账号', res)
			// 		if (!res.data) {
			// 			var row = api.getLogins();
			// 			var username = row.account;
			// 			if (username != undefined && username.length) {
			// 				uni.showModal({
			// 					title: '账号已生成，请牢记或截图保存',
			// 					content: '账号：' + username + '\n密码：123456',
			// 					showCancel: false,
			// 					success: (res) => {
			// 						if (res.confirm) {
			// 							uni.setStorage({
			// 								key: 'isAuto_' + api.appkey,
			// 								data: true
			// 							});
			// 						}
			// 					}
			// 				});
			// 			}
			// 		}
			// 	}
			// });
		},
		methods: {
			videoCollect() {
				if (!this.userId) return api.showToast('请先登录');
				// 限制连续点赞时间
				if (this.collectTime < 1) {
					let collect = this.playerList[this.playerCur]['collect'] == 1 ? 0 : 1;
					this.playerList[this.playerCur]['collect'] = collect;
					if (collect == 1) {
						this.playerList[this.playerCur]['collectSum']++;
					} else {
						this.playerList[this.playerCur]['collectSum']--;
					}
					this.collectTime = 3;
					uni.request({
						url: api.apiData.collectSvodVideo,
						method: 'POST',
						data: {
							userId: this.userId,
							shortId: this.playerList[this.playerCur].id
						},
						header: {
							'Content-type': 'application/x-www-form-urlencoded'
						},
						success: (e) => {
							console.log('收藏成功');
						},
						complete: () => {
							this.videoCollectTime();
						}
					});
				} else {
					api.showToast('操作太快，' + this.collectTime + '秒后再试');
				}
			},
			countTime(e) {
				let feeLook = this.freeLook
				if (_self.trySeconds != 0) {
					_self.trySeconds = feeLook - _self.formatSeconds(e.currentTime);
				}
				if(_self.trySeconds <= 0){
					_self.trySeconds = 0;
					this.showPopous = true
					this.onplay(false)
				}
			},
			formatSeconds(a) {
				var hh = parseInt(a / 3600);
				var ss = parseInt((a - hh * 3600));
				if (ss < 10) ss = "0" + ss;
				if (a >= 0) {
					return ss;
				} else {
					return "00";
				}
			},
			linkTo(param){
				api.jumpUrl(`/pages/${param}`, 'new');
			},
			gotoDownload(){
				api.jumpUrl(api.apiData.apiUrl+'/redirtype/appdownshort')
			},
			videoCollectTime() {
				if (this.collectTime > 0) {
					var timer1 = setTimeout(() => {
						this.collectTime--;
						this.videoCollectTime();
						clearTimeout(timer1);
					}, 1000);
				}
			},
			refreshSvod() {
				let idList = []
				this.playerList.forEach(n => {
					idList.push(n.id)
				})
				uni.request({
					url: api.apiData.refreshSvod,
					method: 'POST',
					data: {
						uid: this.userId,
						id: idList.join(',')
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						if (e.statusCode == 200) {
							var r = e.data;
							if (r.Code == 200) {
								var d = r.Data;
								d.forEach(n => {
									this.playerList.forEach((x, index) => {
										if (x.id == n.id) {
											this.playerList[index] = n
										}
									})
								})
								return
							}
						}
					}
				});
			},
			notice() {
				let notice = uni.getStorageSync('notice_content_' + api.appkey);
				if (notice) {
					if (notice.type == 1) {
						_self.noticeContent = notice.content;
						var timer = setTimeout(() => {
							_self.$refs['popupNotice'].open();
							clearTimeout(timer);
						}, 1000);
					} else {
						var timer = setTimeout(() => {
							if (notice.url != null) api.jumpUrl(notice.url, 'web');
							clearTimeout(timer);
						}, 1000);
					}
				}
			},
			getInitData() {
				uni.request({
					url: api.apiData.playSvodVideo,
					method: 'POST',
					data: {
						uid: _self.userId,
						did: _self.did,
						isH5: 1,
						vid: this.item.id
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						if (e.statusCode == 200) {
							var r = e.data;
							if (r.Code == 200) {
								var d = r.Data;
								_self.userInfo = d.user;
								_self.freeLook = d.user.free_look;
								if (_self.mainPage > 1) {
									_self.playerList = _self.playerList.concat(d.list);
								} else {
									_self.playerList = d.list;
									_self.onchange(0);
								}
								return
							}
						}
						_self.pageError();
					},
					fail: () => {
						_self.pageError();
					}
				});
			},
			pageError() {
				api.showToast('数据加载失败...', 2000);
			},
			getMutedIcon() {
				var muted = _self.playerList[_self.playerCur].muted;
				return muted ? '/static/svod/close.png' : '/static/svod/open.png';
			},
			setMuted() {
				_self.playerList[_self.playerCur].muted = !_self.playerList[_self.playerCur].muted;
				if (_self.playerList[_self.playerCur].muted) {
					api.showToast('静音模式');
				} else {
					api.showToast('声音已打开');
				}
			},
			getHeadImg(cover, head) {
				return head && head.length > 10 ? head : cover;
			},
			videoLike() {
				if (!_self.userId) return api.showToast('请先登录');
				// 限制连续点赞时间
				if (_self.likeTime < 1) {
					let like = _self.playerList[_self.playerCur]['like'] == 1 ? 0 : 1;
					_self.playerList[_self.playerCur]['like'] = like;
					if (like == 1) {
						_self.playerList[_self.playerCur]['likeSum']++;
					} else {
						_self.playerList[_self.playerCur]['likeSum']--;
					}
					_self.likeTime = 3;
					uni.request({
						url: api.apiData.likeSvodVideo,
						method: 'POST',
						data: {
							uid: _self.userId,
							vid: _self.playerList[_self.playerCur].id
						},
						header: {
							'Content-type': 'application/x-www-form-urlencoded'
						},
						complete: () => {
							_self.videoLikeTime();
						}
					});
				} else {
					api.showToast('操作太快，' + _self.likeTime + '秒后再试');
				}
			},
			videoLikeTime() {
				if (_self.likeTime > 0) {
					var timer = setTimeout(() => {
						_self.likeTime--;
						_self.videoLikeTime();
						clearTimeout(timer);
					}, 1000);
				}
			},
			videoFollow() {
				if (!this.userId) return api.showToast('请先登录');
				// 限制连续点赞时间
				if (this.followTime < 1) {
					let follow = !this.playerList[this.playerCur]['fans'];
					this.playerList[this.playerCur]['fans'] = follow;
					if (follow) {
						this.playerList[this.playerCur]['fansSum']++;
					} else {
						this.playerList[this.playerCur]['fansSum']--;
					}
					this.followTime = 3;
					uni.request({
						url: api.apiData.shortVideoFocus,
						method: 'POST',
						data: {
							userId: this.userId,
							shortId: this.playerList[this.playerCur].uid
						},
						header: {
							'Content-type': 'application/x-www-form-urlencoded'
						},
						complete: () => {
							this.videoFollowTime();
						}
					});
				} else {
					api.showToast('操作太快，' + this.followTime + '秒后再试');
				}
			},
			videoFollowTime() {
				if (this.followTime > 0) {
					var timer = setTimeout(() => {
						this.followTime--;
						this.videoFollowTime();
						clearTimeout(timer);
					}, 1000);
				}
			},
			comment(isOpen) {
				_self._showLoading('加载中...');
				uni.request({
					url: api.apiData.svodVideoComm,
					method: 'POST',
					data: {
						uid: _self.userId,
						vid: _self.playerList[_self.playerCur].id,
						page: _self.playerList[_self.playerCur].commentPage
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var d = e.data;
						if (d.Code != 200) return api.showToast(d.Msg, 1500);
						if (_self.playerList[_self.playerCur].commentPage > 1) {
							if (d.Data.list.length) {
								_self.commentList = _self.commentList.concat(d.Data.list);
							} else {
								_self.playerList[_self.playerCur].commentPage--;
							}
						} else {
							_self.commentList = d.Data.list;
						}
						if (!isOpen) _self.$refs['popupComment'].open();
						_self._hideLoading();
					},
					fail: () => {
						api.showToast('当前暂无评论', 1500);
					}
				});
			},
			goHome(uid) {
				if (uid == 0) {
					api.showToast('模拟数据，请重启APP', 2000);
					return
				}
				var param = {
					url: '/pages/index/index',
					t: 'new'
				}
				api.jumpUrl('/pages/svod/home?type=' + JSON.stringify(param) + '&uid=' + uid, 'new');
			},
			moreComment() {
				_self.playerList[_self.playerCur].commentPage++;
				_self.comment(1);
			},
			commentChange(e) {
				if (!e.show) _self.initCommentData();
			},
			initCommentData() {
				_self.playerList[_self.playerCur].commentPage = 1;
				_self.commentContent = '';
				_self.commentList = [];
			},
			sendCommentContent() {
				if (!_self.commentContent.length) return;
				if (!_self.userId) return api.showToast('请先登录');
				_self._showLoading('提交中...');
				uni.request({
					url: api.apiData.sendVideoComm,
					method: 'POST',
					data: {
						uid: _self.userId,
						vid: _self.playerList[_self.playerCur].id,
						content: _self.commentContent
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var d = e.data;
						api.showToast(d.Msg);
						if (d.Code != 200) return;
						_self.commentContent = '';
						if (d.Data) {
							_self.commentList.unshift(d.Data);
							_self.playerList[_self.playerCur].comment++;
							_self.commentListTot++;
						}
					}
				});
			},
			playVideoStatus(t) {
				_self.playStatus = t;
				if(t){
					_self.trySeconds = this.freeLook;
					if(this.userInfo.free_look > 0){
						this.countTime(this.freeLook)
					}
				}
			},
			onplay(d) {
				_self.playerList[_self.playerCur].isPlay = _self.playStatus = d;
				if (_self.playerList[_self.playerCur].muted) {
					let timer = setTimeout(() => {
						api.showToast('静音模式');
						clearTimeout(timer);
					}, 500);
				}
			},
			error(e) {
				api.showToast('视频加载失败自动跳过');
				let timer = setTimeout(() => {
					_self.playerList.splice(_self.playerCur, 1);
					_self.onchange({
						detail: {
							current: _self.playerCur
						}
					})
					clearTimeout(timer);
				}, 200);
			},
			playTime(e) {
				if (e.currentTime > 0.1 && e.currentTime < 1) {
					_self.showLoading = false;
					_self.playerList[_self.playerCur].showCover = false;
				}
				if(this.userInfo.free_look > 0){
					this.countTime(e)
				}
			},
			// 金币购买视频
			buyVideo() {
				if (!_self.userId) return api.showToast('请先登录');
				_self._showLoading('正在支付...');
				uni.request({
					url: api.apiData.goldBuyVideo,
					method: 'POST',
					data: {
						uid: _self.userId,
						vid: _self.playerList[_self.playerCur].id
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var d = e.data;
						api.showToast(d.Msg, 1500);
						if (d.Code == 201) {
							if ('金币不足，请先充值' == res.data.Msg) {
								_self.showFire()
							}
							return;
						}
						_self.playerList[_self.playerCur].isBuy = true;
						_self.onplay(true);
					}
				});
			},
			showFire() {
				if (_self.fireTime > 0) {
					api.showToast(_self.fireTime + "秒后自动进入充值页面", 900)
					_self.fireTime--
					setTimeout(() => {
						_self.showFire()
					}, 1000)
				} else {
					_self.fireTime = 5
					_self.gotoRecharge()
				}
			},
			gotoRecharge() {
				api.jumpUrl('/pages/recharge/recharge?type=2&vid=' + videoId, 'new');
			},
			// 扣除免费观看次数
			freeWatch(vid) {
				if (_self.userId == 0) return _self.userInfo.free = 0;
				uni.request({
					url: api.apiData.updateFree,
					method: 'POST',
					data: {
						uid: _self.userId,
						vid: vid
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					}
				});
			},
			isPlay() {
				var v = _self.playerList[_self.playerCur];
				//console.log(_self.userInfo.free);
				// 非VIP，收费视频，未购买
				// if (!_self.userInfo.isVip && parseInt(v.gold) > 0 && !v.isBuy) {
				// 	if (parseInt(_self.userInfo.free) > 0) {
				// 		// 扣除免费次数
				// 		_self.userInfo.free--;
				// 		_self.freeWatch(v.id);
				// 	} else {
				// 		_self.showLoading = false;
				// 		_self._hideLoading()
				// 		return;
				// 	}
				// }
				_self.onplay(true);
			},
			onchange(e) {
				var index = e == 0 ? 0 : e.detail.current;
				var timer = setTimeout(() => {
					if (index != _self.playerCur) {
						_self.playerList[_self.playerCur].isPlay = false;
						_self.playerList[_self.playerCur].muted = true;
						_self.playerList[_self.playerCur].showCover = true;
						_self.playerCur = index;
					}
					_self.commentListTot = _self.playerList[_self.playerCur].comment;
					_self.isPlay(); // 播放状态逻辑
					_self.getMoreData() // 加载视频
					clearTimeout(timer);
				}, _self.duration);
				if(!_self.userInfo.isVip){
					_self.showPopous = false
					_self.trySeconds = _self.freeLook
				console.log(_self.freeLook)
				}
			},
			getMoreData() {
				let tot = _self.playerList.length;
				let num = (tot - 1) - _self.playerCur;
				//console.log(_self.playerCur, tot);
				if (num < 2) {
					_self.mainPage++;
					_self.getInitData();
				}

			},
			jumpUrl(u, t) {
				api.jumpUrl(u, t);
			}

		}
	}
</script>
<style lang="scss" scoped>
	/deep/.uni-scroll-view::-webkit-scrollbar {
		display: none
	}
</style>
<style>
	@import url('@/components/loading/loading.css');

	.act {
		margin-top: -18rpx !important;
		position: relative;
	}

	.is-buy {
		font-size: 10px;
		color: #FFFFFF;
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		height: 36rpx;
		line-height: 36rpx;
		padding: 0 10rpx;
		border-radius: 10rpx;
	}

	.buy-content {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.btn-right {
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		font-size: 13px;
		color: #FFFFFF;
		padding: 20rpx 50rpx;
		border-radius: 20rpx;
		//margin-left: 30rpx;
	}

	.btn-left {
		background-color: rgba(255, 255, 255, 0.3);
		font-size: 13px;
		color: #FFFFFF;
		padding: 20rpx 50rpx;
		border-radius: 20rpx;
	}

	.buy-btn {
		display: flex;
		flex-direction: row;
		margin-top: 30rpx;
	}

	.video-title {
		color: #FFFFFF;
		font-size: 15px;
		margin: 50rpx 50rpx 30rpx 50rpx;
	}

	.buy-pop {
		position: absolute;
		background-color: rgba(0, 0, 0, 0.8);
		justify-content: center;
		align-items: center;
		z-index: 5;
		display: flex;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}

	.notice_content {
		flex: 1;
		padding: 0 30rpx;
		margin-top: 60rpx;
		height: 100px;
		width: 540rpx;
	}

	.notice_title {
		width: 600rpx;
		height: 146rpx;
	}

	.notice-bg {
		height: 600rpx;
		width: 600rpx;
		border-radius: 60rpx;
		background-color: #FFFFFF;
		flex-direction: column;
		display: flex;
	}

	.user-content {
		margin: 20rpx 0 30rpx 0;
		font-size: 14px;
		color: #666666;
	}

	.user-date {
		font-size: 12px;
		color: #888888;
		margin-top: 10rpx;
	}

	.user-nickname {
		font-size: 15px;
		font-weight: 600;
		color: #555555;
		margin-top: 5rpx;
	}

	.user-info {
		display: flex;
		flex: 1;
		border-bottom: 1px solid #F5F5F5;
		flex-direction: column;
	}

	.user-cover {
		width: 90rpx;
		height: 90rpx;
		border-radius: 90rpx;
		border: 1px solid #F5F5F5;
		margin-right: 25rpx;
		background-color: rgba(0, 0, 0, 0.1);
	}

	.comment-send {
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		height: 35px;
		line-height: 35px;
		width: 130rpx;
		margin: 0 20rpx;
		border-radius: 35px;
		color: #FFFFFF;
		text-align: center;
		font-size: 14px;
	}

	.comment-input {
		border: 1px solid #F5F5F5;
		font-size: 12px;
		height: 35px;
		border-radius: 35px;
		margin-left: 20rpx;
		padding: 0 30rpx;
		flex: 1;
	}

	.comment-bottom {
		display: flex;
		height: 50px;
		line-height: 50px;
		align-items: center;
		flex-direction: row;
		border-top: 1px solid #F5F5F5;
		background-color: #FFFFFF;
		width: 100%;
		position: fixed;
		bottom: 50px;
		left: 0;
	}

	.comment-list-item {
		display: flex;
		flex-direction: row;
		margin-bottom: 30rpx;
	}

	.comment-list {
		flex: 1;
		height: 100px;
		margin-bottom: 100px;
	}

	.comment-title {
		font-size: 16px;
		font-weight: bold;
		color: #000000;
	}

	.comment-head {
		display: flex;
		flex-direction: row;
		height: 45px;
		line-height: 45px;
		align-items: center;
		justify-content: center;
		//background-color: #007AFF;
	}

	.comment-content {
		display: flex;
		flex-direction: column;
		border-radius: 40rpx 40rpx 0 0;
		background-color: #FFFFFF;
		padding: 0 40rpx;
	}

	.item-tag {
		background-color: rgba(0, 0, 0, 0.5);
		font-size: 12px;
		color: #FFFFFF;
		margin-right: 10rpx;
		padding: 10rpx 20rpx;
		border-radius: 15rpx;
	}

	.item-tag-list {
		flex-direction: row;
		margin: 15rpx 0;
	}

	.watch-free {
		color: #FF8F00;
		font-size: 12px;
		padding: 20rpx 10rpx;
	}

	.svod-bottom-item {
		display: flex;
		flex-direction: column;
	}

	.svod-bottom {
		position: absolute;
		bottom: 50px;
		left: 0;
		right: 150rpx;
		padding-left: 20rpx;
		padding-right: 30rpx;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		display: flex;
	}

	.svod-right-cover {
		width: 90rpx;
		height: 90rpx;
		border-radius: 90rpx;
		border: 5px solid rgba(255, 255, 255, 0.5);
	}

	.svod-right-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 40rpx;
	}

	.svod-right {
		position: absolute;
		bottom: 70px;
		right: 30rpx;
		align-items: center;
		justify-content: center;
	}

	.video-cover {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 0;
	}

	.pause-img {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 100px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.bg-video {
		width: 100%;
	}

	.video-list-item {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.video-list {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.icon {
		width: 66rpx;
		height: 66rpx;
	}
	.ad-time {
		position: absolute;
		right: 10px;
		color: #FFFFFF;
		background-color: #333333;
		border-radius: 8px;
		font-size: 12px;
		top: 10px;
		padding: 10px;
		text-align: center;
		z-index: 999;
	}
</style>
