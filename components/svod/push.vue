<template>
	<view style="flex: 1;" :style="'padding-top:'+statusBarHeight+'px'">
		<!-- 加载层 -->
		<!-- <view class="load-img" :style="{'height':(windowHeight+statusBarHeight)+'px'}"
			@touchmove.stop.prevent="moveHandle" v-if="showLoading">
			<image :src="loadingImg" mode="aspectFit" style="width:500rpx;height:400rpx;"></image>
			<text class="reload" v-if="showError" @click="reloadVideo">载入失败，重新加载</text>
		</view> -->
		 <!-- 视频层 -->
		<uni-list @change="onchange" v-if="playerList" :num="playerList.length">
			<cell :recycle="false" v-for="(item, index) in playerList" :key="index" :data-index="index"
				:style="{'height': windowHeight + 'px'}">
				<view v-if="item.type > 0">
					<uni-video @click="item.url != '#' && jumpUrl(item.url,'new')"
						v-if="item.type == 2 && playerCur===index && item.isPlay" :src="item.content"
						:playStatus="playStatus" :muted="item.muted" :windowHeight="windowHeight" @play="onplay"
						@playTime="playTime" @error="error">
					</uni-video>
					<image @click="item.url != '#' && jumpUrl(item.url,'new')" mode="aspectFill" :src="item.content"
						:style="{height: windowHeight+ 'px',width: windowWidth+ 'px'}"
						v-if="item.type == 1 && playerCur===index && item.isPlay">
					</image>
				</view>
				<view v-else>
					<uni-video :src="item.url" :playStatus="playStatus" :windowHeight="windowHeight" :cover="item.cover"
						@play="onplay" @playTime="playTime" @error="error" :controll="false"
						v-if="playerCur==index && item.isPlay">
					</uni-video>
					<image :lazy-load="true" :fade-show="false" mode="aspectFill" :src="item.cover"
						style="width: 750rpx; filter: blur(10px);" :style="{height: windowHeight + 'px'}"
						v-if="!item.isPlay">
					</image>
					<!--pause-->
					<view class="pause-img" @click="playVideoStatus(!playStatus)">
						<image src="/static/svod/btn_player.png"
							style="width:150rpx;height:150rpx;margin-bottom:-150px;" v-if="!playStatus"></image>
					</view>

					<template
						v-if="!(!item.isBuy && item.gold>0 && !userInfo.isVip && userInfo.free==0 && !item.isPlay)">
						<!--right-->
						<view class="svod-right" :style="os==='ios'?'bottom: '+bottom+'px;':''">
							<view class="svod-right-cover" @tap="goHome(item.uid)">
								<image :src="getHeadImg(item.cover, item.headimgurl)" mode="aspectFill"
									style="width: 90rpx;height: 90rpx;border-radius: 90rpx;">
								</image>
							</view>
							<text class="is-buy" v-if="userInfo.isVip">尊贵VIP</text>
							<text class="is-buy" v-else-if="item.isBuy">已购买</text>
							<text class="is-buy" v-else-if="item.gold==0">限 免</text>
							<view class="svod-right-item" @click="videoLike">
								<image class="icon" :src="'/static/svod/btn_like_'+item.like+'.png'" mode="aspectFill">
								</image>
								<text
									style="font-size:24rpx;font-weight: 500;text-align: center;color: #FFFFFF;">{{item.likeSum}}</text>
							</view>
							<view class="svod-right-item" @click="videoCollect">
								<image class="icon" :src="'/static/svod/btn_collection_'+item.collect+'.png'"></image>
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
								<text
									style="font-size:24rpx;font-weight: 500;text-align: center;color: #FFFFFF;">分享</text>
							</view>
						</view>
						<!--bottom-->
						<view class="svod-bottom" :style="os==='ios'?'bottom: '+bottom+'px;':''">
							<view class="svod-bottom-item">
								<text class="watch-free"
									v-if="!item.isBuy && item.gold>0 && !userInfo.isVip">免费观看次数：{{userInfo.free + ' / '+ userInfo.freeTot}}</text>
							</view>
							<view class="svod-bottom-title" v-if="item.nickname">
								<text style="color:#FFFFFF;font-size:32rpx;font-weight:600;width:550upx;">@{{item.nickname}}</text>
							</view>
							<view class="svod-bottom-tag"  v-if="item.tagList && item.tagList.length > 0">
								<view class="item-tag-list" v-if="item.tagList && item.tagList.length">
									<text class="item-tag" v-for="(t, i) in item.tagList" :key="i"
										@click="jumpUrl('/pages/svod/tag_list?info='+JSON.stringify(t), 'new')">#{{t.name}}</text>
								</view>
							</view>
							<view class="svod-bottom-item" v-if="item.title">
								<text style="color:#FFFFFF;font-size:28rpx;lines:1;text-overflow:ellipsis;width:550upx;">{{item.title}}</text>
							</view>
							<view class="svod-bottom-item" v-if="announcement.title">
								<view class="svod-bottom-item-text" v-if="announcement.title">
									<image class="svod-bottom-item-text-image" src="/static/svod/open.png"></image>
									<text class="svod-bottom-item-text-1" @click="jumpAnnouncement">{{announcement.title}}</text>
								</view>
							</view>
						</view>
					</template>
					<!-- 收费弹窗 -->
					<view class="buy-pop"
						v-if="!item.isBuy && item.gold>0 && !userInfo.isVip && userInfo.free==0 && !item.isPlay"
						@touchmove.stop.prevent="moveHandle">
						<view class="buy-content" :style="'margin-top:'+(-statusBarHeight)+'px'">
							<image style="width:150rpx;height:150rpx;border-radius:150rpx;border:2px solid #F5F5F5;"
								mode="aspectFill" :src="getHeadImg(item.cover, item.headimgurl)">
							</image>
							<text class="video-title">{{item.title}}</text>
							<text style="font-size:12px;color:#CCCCCC;">观看本影片需要支付{{item.gold}}金币</text>
							<view class="buy-btn">
								<!-- <text class="btn-left" @click="closeBuy">忍住不看</text> -->
								<text class="btn-right" @click="buyVideo">支付金币</text>
							</view>
						</view>
					</view>
				</view>
			</cell>
		</uni-list>
		<!-- 评论列表 -->
		<uni-popup ref="popupComment" type="bottom" @change="commentChange">
			<view class="comment-content" :style="'height:'+(windowHeight/2+80)+'px'">
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
					<view style="margin:50px 0;align-items:center;" v-if="!commentListTot">
						<image src="/static/empty.png" style="width:100px;height:100px;"></image>
						<text style="font-size:13px;color:#666;margin-top:10px;">当前还没有评论</text>
					</view>
				</scroll-view>
				<view class="comment-bottom" :style="{ bottom: keyheight+'px' }">
					<input class="comment-input" type="text" placeholder="我来说几句 ~" v-model="commentContent"
						:adjust-position="false" :cursor-spacing="4" />
					<text class="comment-send" @click="sendCommentContent">发送</text>
				</view>
			</view>
		</uni-popup>
		<css-loading ref="cssLoading"></css-loading>
	</view>
</template>

<script>
	import uniList from './list';
	import uniVideo from './video_player';
	import utils from '@/components/shoyu-date/utils.filter.js';
	import api from '@/common/api.js';
	import cssLoading from '@/components/css-loading/loading.vue'
	export default {
		components: {
			uniList,
			uniVideo,
			cssLoading
		},
		props: {
			windowHeight: {
				default: 0
			},
			windowWidth: {
				default: 0
			},
			statusBarHeight: {
				default: 0
			},
			playStatus: {
				default: false
			},
			userId: {
				default: 0
			},
			videoId: {
				default: 0
			},
			details: {
				default: false
			}
		},
		watch: {
			playStatus(v) {
				if (!v) { // 播放
					this.$refs['popupComment'].close();
				}
			}
		},
		data() {
			return {
				utils: utils,
				showLoading: true,
				loadingImg: '/static/load.gif',
				showError: false,
				loading: false,
				playerCur: 0,
				playerList: [],
				likeTime: 0,
				followTime: 0,
				collectTime: 0,
				bottom: 0,
				// 用户信息
				userInfo: {
					isVip: false,
					freeTot: 0,
					free: 0
				},
				mainPage: 1,
				commentList: [],
				commentListTot: 0,
				commentContent: '',
				did: 0,
				keyheight: 0,
				announcement: {
					title: null,
					url: null
				},
				os: 'android'
			}
		},
		created() {
			this._showLoading()
			const systemInfo = uni.getSystemInfoSync()
			this.bottom = systemInfo.statusBarHeight + 35
			this.os = systemInfo.osName
			api.getMobileDid(r => {
				this.did = r;
				// console.log(r)
				this.getInitData();
				uni.onKeyboardHeightChange(res => {
					this.keyheight = res.height == 0 ? 0 : res.height - 51;
				})
			});
		},
		methods: {
			jumpAnnouncement() {
				if (this.announcement.url) {
					api.jumpUrl(this.announcement.url, 'outer')
				}
			},
			_showLoading(text = null) {
				this.$nextTick(() => {
					this.$refs['cssLoading'].open(text)
				})
			},
			_hideLoading() {
				this.$nextTick(() => {
					this.$refs['cssLoading'].close()
				})
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
			loadedmetadata(e) {
				e = e.detail.height - e.detail.width;
				if (e > 50) {
					var coverMode = 'aspectFill';
				} else {
					var coverMode = 'aspectFit';
				}
				let timer = setTimeout(() => {
					this.playerList[this.playerCur]['mode'] = coverMode;
					clearTimeout(timer);
				}, 500);
			},
			reloadVideo() {
				var timer = setTimeout(() => {
					this.getInitData();
					clearTimeout(timer);
				}, 1000);
			},
			getHeadImg(cover, head) {
				return head && head.length > 10 ? head : cover;
			},
			closeBuy() {
				//this.$refs['popupBuy'].close();
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
			getInitData() {
				
				const initURL = this.details ? api.apiData.playSvodVideo : api.apiData.getSvodMain;
				uni.request({
					url: initURL,
					method: 'POST',
					data: {
						uid: this.userId,
						did: this.did,
						vid: this.videoId
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						if (e.statusCode == 200) {
							var r = e.data;
							if (r.Code == 200) {
								var d = r.Data;
								this.userInfo = d.user;
								if (this.mainPage > 1) {
									this.playerList = this.playerList.concat(d.list)
								} else {
									this.playerList = d.list;
									this.onchange(0);
								}
								this.getConfig()
								return
							}
							if(r.Code == 201) {
								this.reloadVideo()
								return
							}
						}
						this.pageError();
					},
					fail: () => {
						this.pageError();
					},
					complete: () => {
						this._hideLoading()
					}
				});
			},
			getConfig() {
				uni.request({
					url: api.apiData.svodConfig,
					method: 'POST',
					data: {
						uid: this.userId,
						did: this.did
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						if (e.statusCode == 200) {
							var r = e.data;
							if (r.Code == 200) {
								var d = r.Data;
								this.announcement = {
									title: d.announcement,
									url: d.announcement_url == '#' ? null : d.announcement_url
								}
							}
						}
					}
				});
			},
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
			videoLike() {
				if (!this.userId) return api.showToast('请先登录');
				// 限制连续点赞时间
				if (this.likeTime < 1) {
					let like = this.playerList[this.playerCur]['like'] == 1 ? 0 : 1;
					this.playerList[this.playerCur]['like'] = like;
					if (like == 1) {
						this.playerList[this.playerCur]['likeSum']++;
					} else {
						this.playerList[this.playerCur]['likeSum']--;
					}
					this.likeTime = 3;
					uni.request({
						url: api.apiData.likeSvodVideo,
						method: 'POST',
						data: {
							uid: this.userId,
							vid: this.playerList[this.playerCur].id
						},
						header: {
							'Content-type': 'application/x-www-form-urlencoded'
						},
						success: (e) => {
							console.log('点赞成功');
						},
						complete: () => {
							this.videoLikeTime();
						}
					});
				} else {
					api.showToast('操作太快，' + this.likeTime + '秒后再试');
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
						success: () => {

						},
						complete: () => {
							this.videoFollowTime();
						}
					});
				} else {
					api.showToast('操作太快，' + this.followTime + '秒后再试');
				}
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
			videoFollowTime() {
				if (this.followTime > 0) {
					var timer = setTimeout(() => {
						this.followTime--;
						this.videoFollowTime();
						clearTimeout(timer);
					}, 1000);
				}
			},
			videoLikeTime() {
				if (this.likeTime > 0) {
					var timer = setTimeout(() => {
						this.likeTime--;
						this.videoLikeTime();
						clearTimeout(timer);
					}, 1000);
				}
			},
			comment(isOpen) {
				this._showLoading('加载中...');
				uni.request({
					url: api.apiData.svodVideoComm,
					method: 'POST',
					data: {
						uid: this.userId,
						vid: this.playerList[this.playerCur].id,
						page: this.playerList[this.playerCur].commentPage
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var d = e.data;
						if (d.Code != 200) return api.showToast(d.Msg, 1500);
						if (this.playerList[this.playerCur].commentPage > 1) {
							if (d.Data.list.length) {
								this.commentList = this.commentList.concat(d.Data.list);
							} else {
								this.playerList[this.playerCur].commentPage--;
							}
						} else {
							this.commentList = d.Data.list;
						}
						if (!isOpen) this.$refs['popupComment'].open();
						this._hideLoading();
					}
				});
			},
			moreComment() {
				this.playerList[this.playerCur].commentPage++;
				this.comment(1);
			},
			commentChange(e) {
				if (!e.show) this.initCommentData();
			},
			initCommentData() {
				this.playerList[this.playerCur].commentPage = 1;
				this.commentContent = '';
				this.commentList = [];
			},
			sendCommentContent() {
				if (!this.commentContent.length) return;
				if (!this.userId) return api.showToast('请先登录');
				this._showLoading('提交中...');
				uni.request({
					url: api.apiData.sendVideoComm,
					method: 'POST',
					data: {
						uid: this.userId,
						vid: this.playerList[this.playerCur].id,
						content: this.commentContent
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var d = e.data;
						api.showToast(d.Msg);
						if (d.Code != 200) return;
						this.commentContent = '';
						if (d.Data) {
							this.commentList.unshift(d.Data);
							this.playerList[this.playerCur].comment++;
							this.commentListTot++;
						}
					}
				});
			},
			playVideoStatus(playStatus) {
				this.playStatus = playStatus;
				//this.playerList[this.playerCur]['isPlay'] = this.playStatus;
			},
			playTime(e) {
				//console.log(e); 
				if (e.currentTime > 0.1) this.showLoading = false;
				this._hideLoading()
			},
			onplay(d) {
				this.playerList[this.playerCur].isPlay = true;
				this.playStatus = true;
			},
			error(e) {
				api.showToast('视频加载失败或已删除');
				let timer = setTimeout(() => {
					this.playerList.splice(this.playerCur, 1);
					this.refreshSvod()
					clearTimeout(timer);
				}, 1000);
			},
			// 金币购买视频
			buyVideo() {
				if (!this.userId) return api.showToast('请先登录');
				this._showLoading('正在支付...');
				uni.request({
					url: api.apiData.goldBuyVideo,
					method: 'POST',
					data: {
						uid: this.userId,
						vid: this.playerList[this.playerCur].id
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var d = e.data;
						api.showToast(d.Msg, 1500)
						if (d.Code == 201) return;
						this.playerList[this.playerCur].isBuy = true;
						this.onplay(true);
					},
					complete: () => {
						this._hideLoading();
					}
				});
			},
			// 扣除免费观看次数
			freeWatch(vid) {
				if (this.userId == 0) return this.userInfo.free = 0;
				uni.request({
					url: api.apiData.updateFree,
					method: 'POST',
					data: {
						uid: this.userId,
						vid: vid
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						//console.log(e.data);
					}
				});
			},
			isPlay() {
				var v = this.playerList[this.playerCur];
				// 非VIP，收费视频，未购买
				if (!this.userInfo.isVip && parseInt(v.gold) > 0 && !v.isBuy) {
					if (parseInt(this.userInfo.free) > 0) {
						// 扣除免费次数
						this.userInfo.free--;
						this.freeWatch(v.id);
					} else {
						this.showLoading = false;
						this._hideLoading()
						return;
					}
				}
				this.onplay(true);
			},
			// 加载视频数据
			onchange(index) {
				if (index != this.playerCur) {
					this.playerList[this.playerCur].isPlay = false;
					this.playerCur = index;
				}
				// 初始数据
				this.commentListTot = this.playerList[this.playerCur].comment;
				// 播放状态逻辑
				this.isPlay();
				// 加载视频
				let num = (this.playerList.length - 1) - index;
				//console.log(this.playerList.length);
				if (num < 3) {
					this.mainPage++;
					this.getInitData();
				}
			},
			pageError() {
				this.loadingImg = "/static/empty.png";
				this.showError = this.showLoading = true;
			},
			jumpUrl(u, t) {
				api.jumpUrl(u, t);
			},
			moveHandle() {}
		}
	}
</script>

<style>
	.is-buy {
		font-size: 10px;
		color: #FFFFFF;
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		margin-top: -18rpx;
		height: 36rpx;
		line-height: 36rpx;
		padding: 0 10rpx;
		border-radius: 10rpx;
	}

	.buy-pop {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.8);
		justify-content: center;
		align-items: center;
	}

	.watch-free {
		color: #FF8F00;
		font-size: 12px;
		padding: 20rpx 10rpx;
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
		flex-direction: row;
		margin-top: 30rpx;
	}

	.video-title {
		color: #FFFFFF;
		font-size: 15px;
		margin: 50rpx 50rpx 30rpx 50rpx;
	}

	.video-cover {
		width: 150rpx;
		height: 150rpx;
		border-radius: 150rpx;
		border: 2px solid #F5F5F5;
	}

	.buy-content {
		align-items: center;
		flex-direction: column;
	}

	.reload {
		color: #FFFFFF;
		font-size: 14px;
		padding: 20rpx;
		background-color: #FF8F00;
		border-radius: 15rpx;
		margin-top: 50rpx;
	}

	.load-img {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 1;
		justify-content: center;
		align-items: center;
		background-color: #1D1D28;
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
		height: 50px;
		align-items: center;
		flex-direction: row;
		border-top: 1px solid #F5F5F5;
		background-color: #FFFFFF;
	}

	.comment-list-item {
		flex-direction: row;
		margin-bottom: 30rpx;
	}

	.comment-list {
		padding: 0 40rpx;
		flex: 1;
	}

	.comment-title {
		font-size: 16px;
		font-weight: 600;
		color: #000000;
	}

	.comment-head {
		flex-direction: row;
		height: 45px;
		align-items: center;
		justify-content: center;
	}

	.comment-content {
		width: 750rpx;
		border-radius: 40rpx 40rpx 0 0;
		background-color: #FFFFFF;
	}

	.pause-img {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 150px;
		width: 750rpx;
		align-items: center;
		justify-content: center;
		//background-color: #007AFF;
	}

	.item-tag {
		background-color: rgba(111, 111, 111, .5);
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

	.svod-right-cover {
		border-radius: 90rpx;
		border-color: rgba(255, 255, 255, 0.5);
		border-width: 5rpx;
	}

	.svod-right-item {
		flex-direction: column;
		align-items: center;
		margin-top: 40rpx;
	}

	.svod-right {
		position: absolute;
		bottom: 150upx;
		right: 30rpx;
		height: 800upx;
		align-items: center;
		justify-content: flex-end;
		padding-bottom: 24upx;
		z-index: 2;
	}

	.svod-bottom {
		position: absolute;
		bottom: 150upx;
		left: 0;
		height: 360upx;
		padding-left: 20rpx;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-end;
		overflow: hidden;
		z-index: 2;
	}

	.svod-bottom-title {
		height: 50upx;
		width: 550upx;
	}

	.svod-bottom-tag {
		height: 80upx;
		width: 550upx;
	}

	.svod-bottom-item {
		height: 60upx;
		width: 550upx;
	}

	.icon {
		width: 66rpx;
		height: 66rpx;
	}

	.svod-bottom-item-text {
		flex-direction: row;
		font-size: 12px;
		background-color: rgba(111, 111, 111, .5);
		border-radius: 10px;
		color: #FFF;
		overflow: hidden;
		align-items: center;
		justify-content: flex-start;
		padding: 0 10upx;
		width: 540upx;
		height: 60upx;
	}

	.svod-bottom-item-text-1 {
		color: #FF8F00;
		font-size: 26upx;
		lines: 1;
		text-overflow: ellipsis;
	}

	.svod-bottom-item-text-image {
		width: 18px;
		height: 15px;
		margin-right: 8upx;
	}
</style>