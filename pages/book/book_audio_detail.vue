 <template>
 	<view class="content">
		<css-loading ref="cssLoading"></css-loading>
 		<view class="head-top" :style="{'padding-top':(top - h5H)+'px'}">
 			<view class="head-left trans-bottom" @click="backUrl">
 				<image src="/static/imgs/r.png" mode="aspectFill"></image>
 			</view>
 			<text style="flex: 1;"></text>
 			<view class="head-left"></view>
 		</view>

 		<view class="center-content" :style="'padding-top:'+(top)+'px;padding-bottom:55px;'">
 			<view class="content-head">
 				<view class="content-head-title">{{detail.title}} {{selectItem ? selectItem.title : ''}}</view>
 				<view class="content-head-description">{{detail.title}}</view>
 				<view class="content-head-audiobox">
 					<view class="content-head-audiobox-top">
 						<view class="item item-right" @click="sub">
 							<image src="/static/audio/sub.png" mode="aspectFill"></image>
 						</view>
 						<view class="main">
 							<view class="line">
 								<view class="colorbar" :style="'width:'+sliderTime + '%'"></view>
 								<view class="bar"
 									:style="'right:calc('+ (100 - sliderTime) + '%'+(sliderTime <= 75 ? ' - 64px' : '')+')'">
 									{{audio.currentTime|formatSecond}}/{{audio.maxTime|formatSecond}}
 								</view>
 							</view>
 						</view>
 						<view class="item item-left" @click="add">
 							<image src="/static/audio/add.png" mode="aspectFill"></image>
 						</view>
 					</view>
 					<view class="content-head-audiobox-bottom">
 						<view class="item item-right">
 							<image src="/static/audio/prev.png" mode="aspectFill"></image>
 						</view>
 						<view class="main" @click="startPlayOrPause">
 							<image :src="audio.playing | transPlayPause" mode="aspectFill"></image>
 						</view>
 						<view class="item item-left">
 							<image src="/static/audio/next.png" mode="aspectFill"></image>
 						</view>
 					</view>
 				</view>
 				<view class="content-head-audio-list">
 					<scroll-view class="center-scroll" scroll-y="true">
 						<block v-for="v,i in list" :key="i">
 							<view class="content-head-audio-list-item">
 								<text @click="checkPlay(v.id)">{{v.title}}</text>
 							</view>
 						</block>
 					</scroll-view>
 				</view>
 			</view>
 			<view class="content-body">
 				<view class="content-body-title">大家都在看</view>
 				<view style="display: flex;flex-wrap: wrap;">
 					<block v-for="(v, k) in audioList" :key="k">
 						<view class="audio-item" @click="openPop(v)">
 							<view class="audio-item-image">
 								<image :src="v.cover" mode="aspectFill"></image>
 							</view>
 							<view class="audio-item-content">
 								<rich-text class="audio-item-title" :nodes="parseTitle(v)">...</rich-text>
 								<view class="audio-item-description">{{v.subtitle}}</view>
 								<view class="audio-item-price">
 									<view class="buy_btn1" v-if="v.alreadyBuy == 0 && v.gold > 0">￥{{v.gold}}</view>
 									<view class="buy_btn1" v-else-if="v.is_vip == 1">VIP</view>
 									<view class="buy_btn1" v-else-if="v.gold == 0 ">免费</view>
 									<view class="buy_btn1" v-else>{{userInfo.isVip ? 'VIP免费' : '已购买'}}</view>
 								</view>
 							</view>
 							<view class="audio-item-bottom" v-if="v.list & v.list.length > 0">
 								<scroll-view class="center-scroll1" scroll-x="true">
 									<view v-for="(m, i) in v.list" class="center-scroll-item" @click="openPop(v,m)"
 										:key="i">
 										<view class="center-scroll-title">{{m.title}}</view>
 									</view>
 								</scroll-view>
 							</view>
 						</view>
 					</block>
 				</view>
 				</block>
 			</view>
 		</view>
 		<view class="bottom-bar">
 			<view class="bottom-bar-item" :class="{half:selectItem && selectItem.is_free == 0}" @click="doLike">
 				<image src="/static/imgs/icon_like.png" mode="aspectFill"></image>
 				<text>{{detail.like_num}}</text>
 			</view>
 			<view class="bottom-bar-item" :class="{half:selectItem && selectItem.is_free == 0}"
 				@click="api.jumpUrl('/pages/member/poster','new')">
 				<image src="/static/imgs/icon_share.png" mode="aspectFill"></image>
 				<text>分享</text>
 			</view>
 			<view class="bottom-bar-button" v-if="selectItem && selectItem.is_free == 1">
 				<text class="color-buy" v-if="detail.is_vip == 1 && !userInfo.isVip"
 					@click="api.jumpUrl('/pages/recharge/recharge?type=2&book_audio_id=' + detail.id, 'new')">
 					VIP专属,立即开通
 				</text>
 				<text class="color-buy" v-else-if="needBuy" @click="openPop(null)">
 					限时￥<text class="nob">{{detail.price}}</text> 购入 <text class="nob">{{list.length || '0'}}</text>个章节
 				</text>
 				<text class="color-albuy" v-else>
 					{{detail.price == 0 ? '免费' :  (userInfo.isVip ? 'VIP免费' : '已购买')}}
 				</text>
 			</view>
 		</view>
 		<uni-popup ref="popupNotice" type="center" backColor="rgba(0,0,0,0.8)">
 			<view class="notice-bg">
 				<image class="notice_title" src="/static/img/buy_head.png" mode="aspectFill" />
 				<view class="notice_title_text" :class="{moreTitle:popData.title.length > 10}">
 					<text>购买小说: <br v-if="popData.title.length > 10" /><text
 							class="title">{{popData.title}}</text></text>
 				</view>
 				<view class="notice_content">
 					<view class="notice_content_line_1">
 						<text>实付<text class="redprice">{{popData.gold}}</text>金币</text>
 					</view>
 					<view class="notice_content_line_2">
 					</view>
 					<view class="notice_content_line_3">
 						<text class="buy_btn_small" @click="buyBook">立即支付</text>
 					</view>
 					<view class="notice_content_line_4">
 						<text>可用金币： {{userInfo.corn}}</text>
 						<text @click="gotoRecharge" class="link">去充值 &gt;</text>
 					</view>
 					<view class="notice_content_line_5">
 						<text>价格随作品数量逐步递增,越早买越省钱</text>
 					</view>
 				</view>
 				<view style="height:50upx;"></view>
 			</view>
 		</uni-popup>
 	</view>
 </template>

 <script>
 	import api from "@/common/api.js"
 	var _self, innerAudioContext, nextFunc;

 	function realFormatSecond(second) {
 		var secondType = typeof second

 		if (secondType === 'number' || secondType === 'string') {
 			second = parseInt(second)

 			var hours = Math.floor(second / 3600)
 			second = second - hours * 3600
 			var mimute = Math.floor(second / 60)
 			second = second - mimute * 60
 			return ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
 		} else {
 			return '00:00'
 		}
 	}
 	export default {
 		data() {
 			return {
 				L: 0,
 				loading: true,
 				api: api,
 				detail: {
 					title: '有声小说'
 				},
 				audio: {
 					currentTime: 0,
 					maxTime: 0,
 					playing: false, //是否自动播放
 					muted: false, //是否静音
 					speed: 1,
 					waiting: true,
 					preload: 'auto'
 				},
 				id: 0,
 				vid: 0,
 				userId: 0,
 				phone: {},
 				list: [],
 				audioList: [],
 				playId: 0,
 				playIndex: 0,
 				isPlay: false,
 				t: 5,
 				selectItem: null,
 				loadHeight: 28,
 				top: 27,
 				h5H: 43,
 				sliderTime: 0,
 				volume: 100,
 				did: 0,
 				isLogin: false,
 				userInfo: {
 					nickname: '无名',
 					is_vip: 0,
 					money: 0,
 				},
 				needBuy: false,
 				popData: {
 					title: '',
 					gold: 0.00,
 					id: 0,
 					count: 0,
 					type: 'album'
 				},
 				playIsInit: false
 			}
 		},
 		onLoad(e) {
 			_self = this
 			_self.id = e.id
 			_self.vid = e.vid || 0
 			_self.phone = uni.getSystemInfoSync();
 			_self.top = _self.phone.statusBarHeight + 53;
 			if (innerAudioContext) {
 				innerAudioContext.destroy()
 			}
 			// #ifdef APP-PLUS
 			_self.loadHeight = _self.phone.screenHeight;
 			// #endif
 			// #ifdef H5 || MP-WEIXIN
 			_self.loadHeight = _self.phone.windowHeight;
 			// #endif
			_self._showLoading()
 			// 是否登录
 			var info = api.getLogins();
 			if (info === false) {
 				_self._showLoading('加载中...');
 				_self.skipUrl();
 			} else {
 				_self.userId = info.userId;
 				_self.getUserInfo();
 				_self.getData()
 				uni.getStorage({
 					key: 'mobileDid_' + api.appkey,
 					success: (res) => {
 						_self.did = res.data.data;
 						if (!_self.did) _self.did = res.data;
 					}
 				});
 			}
 		},
 		watch: {
 			sliderTime(val, oldval) {
 				if (val >= 98) {
 					_self.L = 98;
 					return
 				}
 				_self.L = val;

 			}
 		},
 		filters: {
 			formatSecond(second = 0) {
 				return realFormatSecond(second)
 			},
 			transPlayPause(value) {
 				return value ? require("@/static/audio/pause.png") : require("@/static/audio/play.png")
 			}
 		},

 		onUnload() {
 			if (innerAudioContext) {
 				innerAudioContext.destroy()
 			}
 			if (nextFunc) {
 				clearTimeout(nextFunc)
 				nextFunc = null
 			}
 		},
 		onHide() {
 			if (innerAudioContext) {
 				innerAudioContext.destroy()
 			}
 			if (nextFunc) {
 				clearTimeout(nextFunc)
 				nextFunc = null
 			}
 		},
 		methods: {
 			playInit() {
 				_self.playIsInit = true
 				innerAudioContext = uni.createInnerAudioContext();
 				innerAudioContext.autoplay = false;
 				innerAudioContext.onPlay(() => {
 					_self.onPlay()
 				});
 				innerAudioContext.onError(() => {
 					_self.onVideoError()
 				});
 				innerAudioContext.onCanplay(() => {
 					_self.onCanplay()
 				});
 				innerAudioContext.onTimeUpdate(() => {
 					_self.onTimeUpdate()
 				});
 				innerAudioContext.onEnded(() => {
 					_self.onEnded()
 				});
 			},
 			skipUrl(uri = '/pages/login/login', type = 'new') {
 				api.jumpUrl(uri, type);
 			},

 			doLike() {
 				uni.request({
 					url: api.apiData.bookLike,
 					method: 'POST',
 					data: {
 						userId: _self.userId,
 						bookId: _self.detail.id,
 						type: 2
 					},
 					header: {
 						'Content-type': 'application/x-www-form-urlencoded'
 					},
 					success: (e) => {
 						if (e.data.Code == 200) {
 							_self.detail.like_num = e.data.Data;
 						}
 						api.showToast(e.data.Msg, 3000);
 					},
 					fail: () => {
 						api.showToast('服务器连接失败，请检查网络是否正常', 3000);
 					}
 				});
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
 						if (e.data.Code == 200) {
 							_self.userInfo = e.data.Data;
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
 			gotoRecharge() {
 				api.jumpUrl('/pages/recharge/recharge?type=1&book_audio_id=' + _self.popData.id, 'new');
 			},
 			openPop(b, m) {
 				const v = b ? b : _self.detail;
 				if (v.is_vip == 1 && !_self.userInfo.isVip) {
 					uni.showModal({
 						title: '温馨提示',
 						content: '您需要开通VIP才能收听该内容',
 						confirmText: '立即开通VIP',
 						cancelText: '再考虑一下',
 						success: function(res) {
 							if (res.confirm) {
 								api.jumpUrl('/pages/recharge/recharge?type=2&book_audio_id=' + v.id, 'new');
 							}
 						}
 					});
 				} else {
 					if (v.alreadyBuy == 0 && v.gold > 0) {
 						_self.popData.title = v.title
 						_self.popData.gold = v.gold
 						_self.popData.id = v.id
 						_self.$refs['popupNotice'].open();
 					} else {
 						if (m) {
 							api.jumpUrl("/pages/book/book_audio_detail?id=" + v.id + '&vid=' + m.id, 'new')
 						} else {
 							api.jumpUrl("/pages/book/book_audio_detail?id=" + v.id, 'new')
 						}
 					}
 				}
 			},
 			buyBook() {
 				uni.request({
 					url: api.apiData.buyBook,
 					method: 'POST',
 					header: {
 						'content-type': 'application/x-www-form-urlencoded',
 					},
 					data: {
 						bookId: _self.popData.id,
 						userId: _self.userId,
 						type: 'audio',
 						did: _self.did,
 					},
 					success: (res) => {
 						if (res.data.Code != 200) {
 							api.showToast(res.data.Msg, 2000);
 							if (res.data.Code == 203) {
 								_self.getData()
 							}
 						} else {
 							api.showToast(res.data.Msg, 2000);
 							_self.$refs['popupNotice'].close();
 							if (_self.popData.id != _self.detail.id) {
 								api.jumpUrl("/pages/book/book_audio_detail?id=" + _self.popData.id, 'new')
 							}
 							_self.getData()
 						}
 					},
 					fail: () => {
 						api.showToast('网络连接失败，请检查网络是否正常', 2000);
 					}
 				});
 			},
 			parseTitle(v) {
 				return v.title.subCHStr(0, 26) + '<span style="margin-left: 5px;font-size: 12px;color: #777;">' + v
 					.count + '章小说</span>'
 			},
 			backUrl() {
 				if (!_self.detail.tag_id) {
 					uni.navigateBack()
 				} else {
 					api.jumpUrl('/pages/book/book_audio?id=' + _self.detail.tag_id, 'old');
 				}
 			},
 			play() {
 				if (_self.detail.is_vip == 1 && !_self.userInfo.isVip) {
 					uni.showModal({
 						title: '温馨提示',
 						content: '您需要开通VIP才能收听该内容',
 						confirmText: '立即开通VIP',
 						cancelText: '再考虑一下',
 						success: function(res) {
 							if (res.confirm) {
 								api.jumpUrl('/pages/recharge/recharge?type=2&book_audio_id=' + _self.detail
 									.id,
 									'new');
 							}
 							if (res.cancel) {
 								uni.navigateBack()
 							}
 						}
 					});
 				} else {
 					_self.needBuy = _self.detail.alreadyBuy == 0 && _self.detail.price > 0
 					if ((_self.detail.alreadyBuy == 1 || _self.selectItem.is_free == 1) || _self.detail.price == 0) {
 						innerAudioContext.play()
 					} else {
 						_self.openPop()
 					}
 				}
 			},
 			pause() {
 				innerAudioContext.pause()
 			},
 			onPause() {
 				_self.audio.playing = false
 			},
 			onVideoError() {
 				_self.audio.waiting = true
 			},
 			playCount() {
 				nextFunc = setTimeout(() => {
 					_self.t -= 1
 					if (_self.t > 0) {
 						_self.playCount()
 					} else {
 						_self.indexPlay(1)
 					}
 				}, 900);
 			},
 			onEnded() {
 				_self.t = 5
				_self.sliderTime = 100
 				if (_self.playIndex + 1 < _self.list.length) {
 					_self.playCount()
 				}
 			},
 			startPlayOrPause() {
 				_self.audio.playing ? _self.pause() : _self.play()
 			},
 			onCanplay() {
 				_self.audio.maxTime = Math.ceil(innerAudioContext.duration)
 				uni.request({
 					url: api.apiData.bookAudioWatch + '/userId/' + _self.userId + '/id/' + _self.selectItem.id,
 					method: 'GET',
 					header: {
 						'Content-type': 'application/x-www-form-urlencoded'
 					},
 					success: (e) => {
 						var r = e.data;
 						if (r.Code != 200) {
 							api.showToast(r.Msg, 2000);
 						}

 					},
 					fail: () => {
 						api.showToast("服务器连接失败，请检查网络是否正常", 3000);
 					}
 				});
 			},
 			onTimeUpdate() {
 				_self.audio.currentTime = Math.ceil(innerAudioContext.currentTime)
 				_self.sliderTime = parseInt(_self.audio.currentTime / _self.audio.maxTime * 100)
 			},
 			onPlay() {
 				_self.audio.playing = true
 				_self.audio.loading = false
				_self.sliderTime = 0
 			},
 			add() {
 				let current_t = parseInt(innerAudioContext.currentTime);
 				let total_t = parseInt(innerAudioContext.duration);
 				innerAudioContext.seek((current_t + 15) >= total_t ? total_t : (current_t + 15));

 			},
 			sub() {
 				let current_t = parseInt(innerAudioContext.currentTime);

 				innerAudioContext.seek((current_t - 15) <= 0 ? 0 : (current_t - 15));
 			},
 			checkPlay(id) {
 				_self.playId = id
 				_self.selectPlay()
 			},
 			indexPlay(i = 0) {
 				if (i == 0 && _self.playIndex > 0) {
 					_self.playIndex -= 1
 					_self.selectIndex()
 				}
 				if (i == 1 && _self.playIndex + 1 < _self.list.length) {
 					_self.playIndex += 1
 					_self.selectIndex()
 				}
 			},
 			selectIndex() {
 				if (_self.list.length > 0) {
 					_self.selectItem = _self.list[_self.playIndex]
 					innerAudioContext.src = _self.selectItem.play_url
 					_self.play()
 				} else {
 					api.showToast("当前小说暂无章节", 3000);
 					setTimeout(() => {
 						_self.backUrl()
 					}, 500);
 				}
 			},
 			selectPlay() {
 				for (var i = 0; i < _self.list.length; i++) {
 					if (_self.list[i].id == _self.playId) {
 						_self.selectItem = _self.list[i]
 						_self.playIndex = i
 						innerAudioContext.src = _self.selectItem.play_url
 						_self.play()
 					}
 				}
 			},
 			getData() {
 				uni.request({
 					url: api.apiData.getBookAudioDetail + '/userId/' + _self.userId + '/id/' + _self.id +
 						'/vid/' +
 						_self.vid,
 					method: 'GET',
 					header: {
 						'Content-type': 'application/x-www-form-urlencoded'
 					},
 					success: (e) => {
 						var r = e.data;
 						if (r.Code == 200) {
 							_self.detail = r.Data.detail
 							_self.audioList = r.Data.audioList
 							_self.list = _self.list.concat(r.Data.list)
 							_self.playInit()
 							if (r.Data.playId > 0) {
 								setTimeout(() => {
 									_self.checkPlay(r.Data.playId)
 								}, 200)
 							}
 						} else {
 							api.showToast(r.Msg, 2000);
 						}

 					},
 					fail: () => {
 						api.showToast("服务器连接失败，请检查网络是否正常", 3000);
 					},
 					complete: () => {
 						setTimeout(() => {
 							_self.loading = false;
							_self._hideLoading()
 						}, 500);
 					}
 				});
 			}
 		}
 	}
 </script>

 <style>
 	@import url('@/components/loading/loading.css');

 	.head-top {
 		width: 100%;
 		text-align: center;
 		position: fixed;
 		color: #20202C;
 		z-index: 991;
 		display: flex;
 		flex-direction: row;
 		padding: 0 10upx;
 		background: #fff;
 	}

 	.head-left image {
 		width: 20px;
 		height: 20px;
 		margin-top: 1px;
 		border-radius: 50%;
 		transform: rotate(180deg);

 	}

 	.head-left {
 		width: 50px;
 	}

 	.content-head {
 		min-height: 300px;
 		background: #fff;
 		color: #20202C;
 		margin-top: -20px;
 		padding: 10px;
 		box-sizing: border-box;
 	}

 	.content-head-title {
 		text-align: center;
 		font-size: 40upx;
 		font-weight: bold;
 	}

 	.content-head-description {
 		text-align: center;
 		font-size: 26upx;
 		color: #CCC;
 	}

 	.center-content {
 		background: #20202C;
 		color: rgba(195, 195, 195, .85);
 		font-size: 14px;
 		line-height: 26px;
 		box-sizing: border-box;
 	}

 	.content-head-audiobox {
 		width: 100%;
 		padding: 10px;
 		box-sizing: border-box;
 	}

 	.content-head-audiobox-top {
 		height: 40px;
 		width: 100%;
 		display: flex;
 		text-align: center;
 		flex-direction: row;
 	}

 	.content-head-audiobox-top .item {
 		width: 40px;
 	}

 	.content-head-audiobox-top .item.item-left {
 		padding-left: 10px;
 	}

 	.content-head-audiobox-top .item.item-right {
 		padding-right: 10px;
 	}

 	.content-head-audiobox-top .main {
 		flex: 1;
 		height: 30px;
 		padding: 13px 5px;
 		box-sizing: border-box;
 	}

 	.content-head-audiobox-top .main .line {
 		width: 100%;
 		height: 100%;
 		background: #777;
 		position: relative;
 		border-radius: 2px;
 	}

 	.content-head-audiobox-top .main .line .colorbar {
 		position: absolute;
 		left: 0;
 		top: 0;
 		width: 100px;
 		height: 100%;
 		background: #FF584D;
 		border-radius: 2px;
 	}

 	.content-head-audiobox-top .main .line .bar {
 		padding: 2px 3px;
 		border-radius: 5px;
 		background: #fff;
 		border: #ccc 1px solid;
 		position: absolute;
 		left: auto;
 		top: -8px;
 		font-size: 20upx;
 		height: 20px;
 		box-sizing: border-box;
 		line-height: 14px;
 	}

 	.content-head-audiobox-top .item image {
 		width: 20px;
 		height: 20px;
 		vertical-align: middle;
 		opacity: 0.6;
 		filter: alpha(opacity=60);
 	}

 	.item-right {
 		text-align: right;
 	}

 	.item-left {
 		text-align: left;
 	}

 	.content-head-audiobox-bottom {
 		height: 100px;
 		width: 100%;
 		display: flex;
 		text-align: center;
 		flex-direction: row;
 	}

 	.content-head-audio-list {
 		width: 100%;
 		text-align: center;
 		display: inline-block;
 		height: 82px;
 	}

 	.content-head-audio-list-item {
 		width: 25%;
 		display: inline-block;
 		height: 36px;
 		box-sizing: border-box;
 		padding: 3px 7px;
 		float: left;
 	}

 	.content-head-audio-list-item text {
 		width: 100%;
 		text-align: center;
 		font-size: 26upx;
 		line-height: 30px;
 		display: inline-block;
 		background: #555;
 		color: #CCC;
 		border-radius: 15px;
 		overflow: hidden;
 	}

 	.content-head-audio-list-item text.sel {
 		background: #FF584D;
 	}

 	.content-head-audiobox-bottom .item {
 		width: calc(50% - 70px);
 		height: 80px;
 		line-height: 80px;
 	}

 	.content-head-audiobox-bottom .main {
 		flex: 1;
 		height: 80px;
 		box-sizing: border-box;
 		line-height: 80px;
 		text-align: center;
 	}

 	.content-head-audiobox-bottom .item image {
 		width: 40px;
 		height: 40px;
 		vertical-align: middle;
 	}

 	.content-head-audiobox-bottom .main image {
 		width: 80px;
 		height: 80px;
 		vertical-align: middle;
 	}

 	.playbox {
 		position: fixed;
 		top: -9999px;
 	}

 	.center-scroll {
 		white-space: normal;
 		height: 80px;
 	}


 	.content-body-title {
 		width: 100%;
 		margin-bottom: 10px;
 		line-height: 40upx;
 		font-size: 26upx;
 		color: #D89720;
 	}

 	.audio-item {
 		width: 100%;
 		border-radius: 10px;
 		color: #fff;
 		font-size: 14px;
 		display: inline-block;
 		margin-bottom: 10px;
 		box-sizing: border-box;
 		padding: 10px 5px;
 		background-color: #20202C;
 		box-shadow: 4px 4px 6px 0px rgba(103, 103, 103, 0.1);
 	}

 	.audio-item-image {
 		width: 50px;
 		height: 50px;
 		border-radius: 50%;
 		overflow: hidden;
 		display: inline-block;
 		vertical-align: top;
 	}

 	.audio-item-content {
 		width: calc(100% - 60px);
 		margin-left: 10px;
 		height: 50px;
 		display: inline-block;
 		vertical-align: top;
 		position: relative;
 	}

 	.audio-item-title {
 		width: calc(100% - 70px);
 		height: 28px;
 		display: inline-block;
 		line-height: 28px;
 		font-size: 26upx;
 		overflow: hidden;
 		text-overflow: ellipsis;
 		justify-content: left;
 		white-space: nowrap;
 	}

 	.audio-item-description {

 		width: calc(100% - 70px);
 		height: 22px;
 		display: inline-block;
 		line-height: 22px;
 		color: #999;
 		font-size: 22upx;
 		overflow: hidden;
 		text-overflow: ellipsis;
 		justify-content: left;
 		white-space: nowrap;
 		margin-top: -10px;
 		vertical-align: top;
 	}

 	.audio-item-price {
 		width: 70px;
 		position: absolute;
 		right: 0;
 		top: -5px;
 		height: 50px;
 		vertical-align: top;
 		padding: 5px;
 		box-sizing: border-box;
 	}

 	.buy_btn1 {
 		width: 100%;
 		line-height: 40px;
 		border-radius: 10px;
 		font-size: 24upx;
 		color: #fff;
 		text-align: center;
 		background: linear-gradient(to left, #ff6034, #ee0a24);
 	}


 	.content-body {
 		width: 100%;
 		position: relative;
 		padding: 10px 5px;
 		box-sizing: border-box;
 	}

 	.moreTig {
 		text-align: center;
 		color: #999;
 		font-size: 25upx;
 		margin-top: 26upx;
 		padding-bottom: 30upx;
 	}


 	.audio-item-bottom {
 		width: 100%;
 		height: 60px;
 		text-align: left;
 		background-color: #20202C;
 		margin: 0 auto;
 		clear: both;
 	}

 	.center-scroll1 {
 		white-space: nowrap;
 	}

 	.center-scroll-item {
 		margin: 10upx;
 		width: 29%;
 		height: 60px;
 		padding: 5upx;
 		display: inline-block;
 		box-sizing: border-box;
 		_display: inline;
 		*display: inline;
 		zoom: 1;
 		text-align: center;
 		border-radius: 5px;
 		background: rgba(255, 255, 255, 0.03);
 		white-space: normal;
 	}

 	.center-scroll-title {
 		color: #fff;
 		font-size: 14px;
 		overflow: hidden;
 		text-overflow: ellipsis;
 		justify-content: left;
 		white-space: nowrap;
 		height: 28px;
 		line-height: 28px;
 		width: 100%;
 		display: inline-block;
 		padding: 5upx;
 		box-sizing: border-box;
 		text-align: left;
 		vertical-align: bottom;
 	}

 	.center-scroll-desc {
 		color: #777;
 		font-size: 12px;
 		overflow: hidden;
 		text-overflow: ellipsis;
 		text-align: left;
 		justify-content: left;
 		white-space: nowrap;
 		height: 20px;
 		line-height: 20px;
 		margin-top: -5px;
 		vertical-align: top;
 		width: 100%;
 		display: inline-block;
 		padding: 5upx;
 		box-sizing: border-box;
 	}

 	.notice_content {
 		width: 90%;
 		height: 500upx;
 		padding: 0 5%;
 		margin-top: 25upx;
 		position: relative;
 	}

 	.notice_title {
 		width: 100%;
 		height: 146upx;
 	}

 	.notice_title_text {
 		position: absolute;
 		top: 0;
 		left: 0;
 		width: 100%;
 		height: 146upx;
 		line-height: 138upx;
 		font-size: 36upx;
 		text-align: center;
 		color: #fff;
 	}

 	.notice_title_text.moreTitle {
 		line-height: 48upx;
 	}

 	.notice_title_text .title {
 		font-size: 34upx;
 		font-weight: bold;
 		margin-left: 10upx;
 	}

 	.notice-bg {
 		width: 600upx;
 		border-radius: 60upx;
 		background-color: #FFFFFF;
 	}

 	.notice_content_line_1 {
 		width: 100%;
 		text-align: center;
 		font-size: 40upx;
 		height: 40px;
 		line-height: 30px;
 		font-weight: 500;
 	}

 	.notice_content_line_1 .redprice {
 		font-size: 56upx;
 		color: #F9221D;
 		margin: 0 5px;
 	}

 	.notice_content_line_2 {
 		width: 100%;
 		text-align: center;
 		font-size: 32upx;
 		height: 90px;
 		line-height: 40upx;
 		font-weight: 500;
 	}

 	.notice_content_line_2 .maintext {
 		font-size: 28upx;
 		margin: 0 3px;
 	}

 	.notice_content_line_3 {
 		width: 100%;
 		height: 46px;
 		padding: 3px 10px;
 		box-sizing: border-box;
 	}

 	.notice_content_line_3 .buy_btn_small {

 		width: 100%;
 		height: 100%;
 		line-height: 40px;
 		border-radius: 20px;
 		font-size: 26upx;
 		color: #fff;
 		text-align: center;
 		display: inline-block;
 		background: linear-gradient(to left, #ff6034, #ee0a24)
 	}

 	.notice_content_line_4 {
 		width: 100%;
 		height: 40px;
 		line-height: 40px;
 		font-size: 32upx;
 		font-weight: 400;
 		text-align: center;
 	}

 	.notice_content_line_4 .link {
 		color: #F9221D;
 		margin-left: 10px;
 	}

 	.notice_content_line_5 {
 		width: 100%;
 		height: 30px;
 		line-height: 30px;
 		font-size: 24upx;
 		font-weight: 400;
 		text-align: center;
 		color: #999;
 	}

 	.bottom-bar {
 		width: 100%;
 		position: fixed;
 		bottom: 0;
 		left: 0;
 		background: #20202C;
 		color: #777;
 		display: flex;
 		flex-direction: row;
 		padding: 0 10upx;
 		box-sizing: border-box;
 	}

 	.bottom-bar-item {
 		width: 22%;
 		height: 50px;
 		text-align: center;
 	}

 	.bottom-bar-item.half {
 		width: 50%;
 	}

 	.bottom-bar-item image {
 		width: 26px;
 		height: 26px;
 		overflow: hidden;
 		margin-top: 4px;
 	}

 	.bottom-bar-item text {
 		width: 100%;
 		margin-top: -5px;
 		line-height: 26upx;
 		font-size: 22upx;
 		display: inline-block;
 		vertical-align: top;
 	}

 	.bottom-bar-button {
 		flex: 1;
 		padding: 10upx;
 		padding-top: 8upx;
 		box-sizing: border-box;
 	}

 	.bottom-bar-button>text {
 		font-style: italic;
 		width: 100%;
 		text-align: center;
 		border-radius: 5px;
 		height: calc(100% - 10upx);
 		display: inline-block;
 		font-size: 22upx;
 		line-height: 2;
 		box-sizing: border-box;
 	}

 	.bottom-bar-button>text .nob {
 		font-size: 34upx !important;
 		font-weight: bold;
 		font-style: normal !important;
 		margin: 0 5upx;
 	}

 	.color-buy {
 		background: #ff4747;
 		color: #fff;
 	}

 	.color-albuy {
 		background: #eca730;
 		color: #20202C;
 		text-align: left !important;
 		padding: 0 20upx;
 		font-size: 34upx !important;
 		font-weight: 400;
 		font-style: normal !important;
 	}

 	.bottom-bar-button>text.color-albuy .nob {
 		font-size: 22upx !important;
 		float: right;
 		color: #555;
 		line-height: 3 !important;
 		position: relative;
 		padding-right: 15px;
 	}

 	.bottom-bar-button>text.color-albuy .nob:after {
 		content: '►';
 		position: absolute;
 		right: 0;
 	}
 </style>