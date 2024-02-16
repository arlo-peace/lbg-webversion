<template>
	<view class="player-content" :style="{'height':phone.windowHeight+'px'}"  @click="setChatOpacity">
		<video 
			id="myVideo"
			class="player-video"
			:object-fit="objectFit"
			:src="playerUrl"
		    :autoplay="true"
			:controls="false"
			:loop="true" 
			:muted="muted"
			:show-center-play-btn="false"
			:enable-progress-gesture="false"
			:poster="anchor.headimgurl"
			@play="playLoad"
			@loadedmetadata="loadedmetadata">
		</video>
		<view style="height:100%;position: fixed;z-index: 9;" v-if="isAnchorCover">
			<image :src="anchorCover" mode="aspectFill" style="width:750upx;height:100%;"></image> 
			<!-- 本次直播已结束 -->
		</view>
		<view class="player-top" id="playerTop">
			<view class="player-top-left">
				<image :src="anchor.headimgurl" mode="aspectFill" class="live-top-tx" @click="goHome"></image>
				<view class="player-top-left-name">
					<view style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">{{anchor.nikcname}}</view>
					<view style="font-size:12px;" v-if="playerTime>0">{{anchor.playerTime}}</view>
					<view style="font-size:12px;" v-else>暂未开播</view>
				</view>
				<view class="player-top-left-focus">
					<image class="live-top-add" src="@/static/live/y.png" mode="aspectFill" @click="setFocus(1)" v-if="isFocus"></image>
					<image class="live-top-add" src="@/static/live/focus.png" mode="aspectFill" @click="setFocus(2)" v-else></image>
				</view>
			</view>
			<view class="player-top-right">
				<text class="player-top-right-num">{{onlineNum}}</text>
			</view>
			<view class="player-top-center">
				<scroll-view :scroll-x="true" :show-scrollbar="false">
					<view class="player-top-item" @click="openUser(g)" v-for="(g, i) in giftOrder" :key="i">
						<image class="live-top-add tx" :src="g.headImg" mode="aspectFill"></image>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="give-sort" :style="{'top':topHeight + 25 +'px'}">
			<text :class="backColor?'give-sort-left-b':'give-sort-left-a'" class="give-sort-left" v-if="isTry">试看倒计时 {{tryTimem}}</text>
		</view>
		<view class="player-center" :style="{'bottom':bottomHeight+12+'px','height':playerCenterHeight+'px'}">
			<view class="player-gift-list">
				
				<view class="player-gift-item" v-for="(g, i) in giveGift" :key="i" v-if="isGiftShow > 0">
					<image class="is-vip" src="@/static/imgs/vips.png" mode="aspectFit" v-if="g.isVip"></image>
					<text style="color:rgba(245,160,1,0.8);">{{g.username}}</text>
					<text style="margin:0 10upx;">赠送主播 {{g.giftName}}</text>
					<image style="width:50upx;height:50upx;margin-bottom:-15upx;" :src="g.giftImg" mode="aspectFit"></image>
					<text style="margin-left:10upx;">x {{g.num}}</text>
				</view>
				
			</view>
			<view style="height:70upx;line-height:70upx;margin-top:30upx;margin-left:13upx;position:absolute;bottom:470upx;">
				<view class="live-user-go" v-if="inUser.time > 0">
					<image class="is-vip" v-if="inUser.isVip" src="@/static/imgs/vips.png" mode="aspectFit"></image>
					<image class="is-vip" style="border-radius:50%;" :src="inUser.headImg" mode="aspectFill"></image>
					<text style="color:#FFFFFF;font-size:28upx;">{{inUser.username}}，闪亮登场...</text>
				</view>
			</view>
			<view class="player-msg-list">
				<scroll-view :style="{'opacity':opacity}" :scroll-y="true" :show-scrollbar="false" class="player-msg-scroll" :scroll-top="scrollTop">
					<view class="player-msg-item" v-for="(v, i) in msgList" :key="i">
						<view v-if="v.type == 1">
							<image src="/static/live/sys.png" class="msg-info-img" mode="aspectFill"></image>
							<text style="color:rgba(245,160,1,0.8);margin-left:10upx;">系统：</text>
							<text style="color:#FFFFFF;">{{v.content}}</text>
						</view>
						<view v-else>
							<image :src="v.headImg" class="msg-info-img" mode="aspectFill"></image>
							<text style="color:red;margin-left:10upx;" v-if="v.isVip">VIP</text>
							<text style="color:rgba(245,160,1,0.8);margin-left:10upx;">{{v.username}}：</text>
							<text style="color:#FFFFFF;">{{v.content}}</text>
						</view>
					</view>	
				</scroll-view>
			</view>
		</view>
		<view class="player-bottom" id="playerBottom">
			<input type="text" :value="content" :placeholder="sendText" placeholder-style="color:#ccc" class="live-send-msg"  @input="msgContent"/>
			<view class="live-send-text" @click="sendMsg">
				<!-- <text class="send-text">发送</text> -->
				<image class="live-gift-img" src="@/static/live/send.png" mode="aspectFill"></image>
			</view>
			<view class="live-send-text" @click="showGift" style="background-color:rgba(0,0,0,0.4);">
				<image class="live-gift-img" src="@/static/live/gift.png" mode="aspectFill"></image>
			</view>
			<view class="live-send-text" @click="setMuted" style="background-color:rgba(0,0,0,0.4);">
				<image class="live-gift-img" :src="mutedImg" mode="aspectFill"></image>
			</view>
			<view class="live-send-text" @click="closePlayer" style="background-color:rgba(0,0,0,0.4);">
				<image class="live-gift-img" src="@/static/live/close2.png" mode="aspectFill"></image>
			</view>
		</view>
		
		<uni-popup ref="showintroduction" type="bottom" :mask-click="true" :backColor="'rgba(0,0,0,0.01)'">
			<view class="gift-list-bg">
				<view class="gift-top-title">
					<text class="gift-top-title-left">账户金币：{{userInfo.gold}}</text>
					<text class="gift-top-title-right" @click="recUser('showintroduction')">充值</text>
				</view>
				<swiper class="gift-list" circular indicator-dots indicator-color="rgba(255,255,255,0.4)" indicator-active-color="rgba(255,12,208,0.8)">
					<swiper-item v-for="(a, ai) in giftList" :key="ai">
						<uni-grid :column="4" :show-border="false" :square="true" :highlight="false" @change="changeGift">
						    <uni-grid-item v-for="(b, bi) in a" :key="bi" :index="b">
								<view class="gift-list-item">
									<image class="gift-item-img" :src="b.img" mode="aspectFill"></image>
									<view class="text">{{b.name}}</view>
									<view class="text">{{b.gold}}</view>
								</view>
						    </uni-grid-item>
						</uni-grid>
					</swiper-item>
				</swiper>
			</view>
		</uni-popup>
		
		<uni-popup ref="userPopup" type="top">
			<view class="user-popup">
				<image class="user-popup-tx" :src="giveUser.headImg" mode="aspectFill"></image>
				<view class="user-popup-username">
					<text style="font-size:16px;color:#fff;">{{giveUser.username}}</text> <image class="vip" src="@/static/imgs/vips.png" mode="aspectFit" v-if="giveUser.isVip"></image>
				</view>
				<text class="give-gold">已打赏{{giveUser.giveGold}}金币</text>
			</view>
		</uni-popup>
		
		<uni-popup ref="tryLiveEnd" :maskClick="false" type="center">
			<view class="try-live-end">
				<image src="/static/imgs/nt.png" class="popup-bg-xx"></image>
				<view class="try-live-end-title"><text class="try-live-end-title-font">主播提醒您</text></view>
				<view class="try-live-end-content">
					<image class="try-live-end-img" src="/static/stop.png" mode="aspectFill"></image>
					<text class="try-live-end-content-font">{{_self.anchor.tryTime / 60}}分钟试看已结束。</text>
				</view>
				<view class="try-live-end-btn">
					<text class="try-live-end-btn-buy" @click="buyGoldRoom">购买</text>
					<text class="line"></text>
					<text class="try-live-end-btn-rec" @click="recUser('tryLiveEnd')">充值</text>
					<text class="line"></text>
					<text class="try-live-end-btn-back" @click="skipUrl(backUrl.url, backUrl.type);">返回</text>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="userTopGift" type="top" :mask-click="true" :backColor="'rgba(0,0,0,0.01)'">
			<view class="user-top-gift">
				<view class="user-top-content">
					<image class="user-top-userimg" :src="userToGift.headimgurl" mode="aspectFill"></image>
					<text class="user-top-text">[{{userToGift.username}}] 赠送 {{userToGift.giftName}}</text>
					<image class="user-top-giftimg" :src="userToGift.giftImg" mode="aspectFit"></image>
					<text class="user-top-text">x 1</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	var _self,socketTask,pingTime,playerStatus,setBeatTime,showGiftDjsTimer,showInUserTimer,isOpenSocketTimer,hideChatListTimer;
	var is_open_socket = false;
	export default {
		data() {
			return {
				one: false,
				phone: {},
				isLogin: false,
				userId: 0,
				aid: 0,
				playerUrl: '', //流地址
				isFocus: false, //是否已关注主播
				topHeight: 43,
				bottomHeight: 58,
				playerCenterHeight: 0,
				muted: true,
				mutedImg: '/static/live/voice_no.png',
				videoContext: {},
				userInfo: {
					id: 0,
					isVip: false,
					username: 'loading...',
					gold: 0,
					isDisable: false,
					headImg: ''
				}, //用户信息
				anchor: {
					id: 1,
					nikcname: "载入中...",
					headimgurl: "/static/live/langman.png",
					playerTime: "00:00:00"
				},//主播信息
				giftOrder: [] ,//打赏排行
				playerTime: 0, //开播时间
				giveUser: {},
				giftList: [], //礼物
				
				giveGift: [],//赠送礼物列表
				isGiftShow: 0, //是否显示礼物特效
	
				scrollTop: 9999,
				
				msgList: [], //消息列表
				
				content: '',
				sendText: '撩一撩？',
				
				opacityTime: 10,
				opacity: 1,//聊天框透明度
				opacityDjs: 1000,
				
				//进来用户提示
				inUser: {
					time: 0,
					isVip: false,
					username: "",
					headImg: ""
				},
				//消息服务器
				server: {
					ipUrl: ''
				},
				did: '',
				onlineNum: 0,
				isShowPlaer: true, //用户端是否显示播放器
				
				isTry: false,
				tryTimes: 0, //计数器
				tryTimem: '00:00:00'  ,//正常时间
				
				backColor: false, //变化背景色
				
				backUrl: {
					url: '/pages/live/list',
					type: 'newx'
				},
				
				anchorCover: '', //用户端主播封面
				isAnchorCover: true, //是否显示封面
				
				objectFit: 'cover', // cover  contain
				userToGift: {}, //礼物特效
			}
		},
		onLoad(e) {
			_self = this;
			_self.aid = e.aid;
			if(e.url != undefined) _self.backUrl = JSON.parse(e.url);
			_self.isLogin = api.getLogins();
			if(_self.isLogin) _self.userId = _self.isLogin.userId;
			_self.phone = uni.getSystemInfoSync();
			//console.log(_self.phone);
			api.getMobileDid((e)=>{
				_self.did = e;
				_self.getClientData();
			});
		},
		onShow() {
			_self.setLiveStatus(true);
			_self.isLogin = api.getLogins();
			if(_self.one){
				_self.tryTimeDsq(1);
				if(_self.isLogin) _self.userId = _self.isLogin.userId;
			} 
		},
		onHide() {
			clearInterval(playerStatus);
			setTimeout(()=>{
				_self.one = true;
				_self.setLiveStatus(false);
				_self.tryTimeDsq(0);
			}, 300);
		},
		onUnload() {
			//console.log('onUnload');
			_self.userOut();
		},
		mounted: function() {
			const query = uni.createSelectorQuery().in(this);
			query.select('#playerTop').boundingClientRect(top=> {
				_self.topHeight = top.height;
			}).exec();
			query.select('#playerBottom').boundingClientRect(bottom=> {
				var bottomHeight = bottom.height;
				_self.playerCenterHeight = _self.phone.windowHeight - (_self.topHeight + bottomHeight + 27);
			}).exec();
		},
		methods: {
			loadedmetadata(e) {
				_self.objectFit = e.detail.width > e.detail.height?'contain':'cover';
			},
			playLoad() {
				setTimeout(()=>{
					_self.isAnchorCover = false;
				}, 300);
				//console.log('play')
			},
			getClientData() {
				const server_ipUrl = uni.getStorageSync('server_ipUrl_'+api.appkey);
				if (server_ipUrl) {
					_self.server.ipUrl = server_ipUrl;
				}
				uni.request({
					url: api.apiData.playerConfig,
					method: 'POST',
					data: {
						uid: _self.userId,
						aid: _self.aid,
						sys: 'web'
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e)=> {
						var r = e.data;
						//console.log(r)
						if(r.Code == 200){
							var d = r.Data;
							_self.playerUrl = d.anchorInfo.h5_server;
							_self.anchorCover= d.anchorInfo.anchorCover;
							_self.userInfo =  d.userInfo;
							_self.onlineNum = d.onlineNum.length;
							var a = d.anchorInfo;
							// 直播时间
							_self.playerTime = a.playerTime;
							a.playerTime = api.formatSeconds(a.playerTime);
							_self.anchor = a;
							_self.tryTimes = a.userTry
							_self.isFocus  = d.isFocus;
							_self.giftOrder= d.giftOrder;
							_self.giftList = d.giftList;
							//
							_self.initData();
							_self.addNotice({'content':d.sysNotice, 'type':1});
							// 连接通讯服务器
							_self.connectToServer();
						}else{
							_self.backList(r.Msg, 3000);
						}
					},
					fail: ()=> {
						// 加载失败提示
						_self.backList("服务器连接失败，请检查网络是否正常");
					}
				});
			},
			initData() {
				_self.playerTimeAdd();
				_self.showGiftDjs();
				_self.hideChatList();
				_self.tryTimeFun();
			},
			tryTimeFun() {
				//console.log(_self.anchor.gold)
				var r = _self.anchor;
				// 收费房，开启了试看，剩余时间大于0
				if(r.gold>0 && r.isTry && r.tryTime>0 && r.userTry>0){
					_self.isTry = true;
					_self.tryTimeJs();
					//console.log(0)
				}else{
					_self.isTry = false;
					//console.log(1)
				}
			},
			tryTimeJs() {
				setBeatTime = setInterval(() => {
					if(_self.tryTimes > 0){
						// 开始试看
						_self.tryTimes --;
						_self.tryTimem = api.formatSeconds(_self.tryTimes);
						_self.backColor = !_self.backColor;
					}else{
						// 试看结束
						_self.tryTimeDsq(0);
						_self.$refs['tryLiveEnd'].open();
						_self.setLiveStatus(false);
					}
					//console.log(_self.tryTimes)
				}, 1000);
			},
			tryTimeDsq(t) {
				// t 1开始计时，0暂停显示
				if(t == 1) {
					_self.tryTimeFun();
				}else{
					clearInterval(setBeatTime);
					_self.updateTryTime();
				}
			},
			setLiveStatus(s) {
				var context = uni.createVideoContext("myVideo", this);
				_self.isShowPlaer = s;
				if (!s) {
					context.pause();
					_self.isAnchorCover = true;
				} else {
					context.play();
				}
				//console.log(_self.isShowPlaer)
			},
			updateTryTime() {
				var r = _self.anchor;
				// 收费房，开启了试看，剩余时间大于0
				if(r.gold>0 && r.isTry && r.tryTime>0){
					uni.request({
						url: api.apiData.updateTryTime,
						method: 'POST',
						data: {
							uid:_self.userId,
							aid: _self.aid,
							time: _self.tryTimes
						},
						header: {
							'Content-type': 'application/x-www-form-urlencoded'
						},
						success: (r)=> {
							//console.log(r)
						}
					});
				}
			},
			connectToServer() {
				if(_self.server.ipUrl.length == 0) {
					_self.backList('连接消息服务器失败1');
					return;
				}
				//console.log(_self.server.ipUrl)
				socketTask = uni.connectSocket({
				    url: _self.server.ipUrl,
				    fail: ()=> {
				    	_self.backList('连接消息服务器失败2');
				    }
				});
				// 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
				socketTask.onOpen((row)=> {
					//console.log("WebSocket连接正常打开中...！");
					is_open_socket = true;
					// 注：只有连接正常打开中 ，才能正常收到消息
					socketTask.onMessage((res)=> {
						var data = JSON.parse(res.data);
						//console.log(data);
						switch(data.type) {
							// 初始化
							case 'init':
								var d = {
									type: 'bid',
									data: {
										did: _self.did,
										time: 5,
										id: _self.userInfo.id,
										isVip: _self.userInfo.isVip,
										username: _self.userInfo.username,
										headImg: _self.userInfo.headImg,
										isDisable: _self.userInfo.isDisable
									},
									web: _self.aid==0 ? api.apiData.endLivePlayer : api.apiData.logoutRoom,
									anchorId: _self.aid
								};
								_self.sendSocketTask(d);
								break;
							case 'msg':
								if(data.anchorId == _self.aid){
									_self.addNotice(data.data);
									_self.setChatOpacity();
								}
								break;
							case 'userLogout':
								if(data.anchorId == _self.aid && data.data.id != _self.userInfo.id){
									_self.onlineNum = _self.onlineNum - 1;
								}
								break;
							case 'giveGift':
								//console.log(data.anchorId+'/'+_self.aid);
								//console.log(data);
								if(data.anchorId == _self.aid){
									_self.giftOrder = data.data.orderList;
									_self.userGiveGift(data.data.item);
								}
								break;
							case 'endLive':
								if(data.anchorId == _self.aid){
									_self.setLiveStatus(false);
									uni.showModal({
									    content: "本次直播已结束，下期不见不散",
										showCancel: false,
										confirmText: "确定返回",
									    success: (row)=> {
									        if (row.confirm) {
												_self.skipUrl('/pages/live/list', 'newx');
									        }
									    }
									});
								}
								break;
							case 'login':
								if(data.anchorId == _self.aid){
									_self.inUser = data.data;
									_self.showInUser();
								}
								break;
							case 'onlineList':
								//console.log(data.data);
								if(data.anchorId == _self.aid){
									_self.onlineNum = data.data; //.length
								}
								break;
							case 'kickedOut':
								uni.showToast({
								    title: '您已被踢出房间',
								    duration: 1500,
									mask: true,
									image: '/static/stop.png'
								});
								if(data.anchorId == _self.aid && _self.userInfo.id == data.uid){
									_self.outRoom();
								}
								break;
							case 'updateSendMsg':
								var d = data.data;
								if(data.anchorId == _self.aid && _self.userInfo.id == data.uid){
									var d = data.data;
									if (d.type == 1){
										var text = '您已被主播禁言';
										_self.userInfo.isDisable = true;
										_self.sendText = text;
									}else{
										var text = '主播已解除禁言';
										_self.userInfo.isDisable = false;
										_self.sendText = '撩一撩？';
									}
									api.showToast(text, 2000);
								}
								// api.showToast(text, 2000);
								break;
							default:
								eval(data.data);
						}
					});
				})
				// 心跳
				pingTime = setInterval(()=>{
					if (!is_open_socket) _self.backList('连接消息服务器失败3');
					_self.pongToServer();
				}, 10 * 1000);
			},
			pongToServer() {
				_self.sendSocketTask({type:'pong'});
			},
			sendSocketTask(data) {
				if(is_open_socket){
					// 注：只有连接正常打开中 ，发送设备ID
					socketTask.send({
						data: JSON.stringify(data),
						async success() { 
							console.log("心跳");
						},
					});
				}
			},
			closeConnectToServer() {
				socketTask.close({
					success(res) {
						is_open_socket = false;
						clearInterval(pingTime); //结束心跳
						//console.log("关闭成功", res)
					}
				})
			},
			showInUser() {
				if(0 != _self.inUser.id){
					if(_self.inUser.time > 0){
						_self.inUser.time --;
					} 
					showInUserTimer = setTimeout(()=>{
						_self.showInUser();
					}, 1000)
				}else{
					_self.inUser.time = 0;
				}
			},
			setFocus(e) {
				_self.isFocus = e==1?false:true;
				if(_self.isFocus){
					uni.showToast({
					    title: '关注成功',
						icon: 'success',
					    duration: 2000
					});
					//console.log(_self.userInfo)
				}
				uni.request({
					url: api.apiData.focusAnchor,
					method: 'POST',
					data: {
						uid:_self.userId,
						aid: _self.aid,
						type: e
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e)=> {
						var r = e.data;
						//console.log(r)
						if(r.Code == 201){
							api.showToast(r.Msg, 3000);
						}
						var data = { type:'userFocus', data:_self.userInfo, 'anchorId':_self.aid };
						_self.sendSever(data);
					},
					fail: ()=> {
						// 加载失败提示
						api.showToast("服务器连接失败，请检查网络是否正常", 3000);
					}
				});
			},
			addNotice(e) {
				_self.msgList.push(e);
				setTimeout(()=>{
					_self.scrollTop = _self.scrollTop + 1;
				}, 300)
			},
			msgContent(e) {
				_self.content = e.detail.value;
			},
			hideChatList() {
				hideChatListTimer = setTimeout(()=>{
					if(_self.opacityTime > 0){
						_self.opacityTime --;
					}else{
						if(_self.opacity > 0.0){
							_self.opacityDjs = 100;
							_self.opacity = _self.opacity - 0.1;
						}else{
							_self.opacityDjs = 5000;
						}
					}
					_self.hideChatList();
					//console.log(_self.opacityTime +'/'+ _self.opacity);
				}, _self.opacityDjs);
			},
			sendMsg() {
				if(_self.userInfo.isDisable){
					api.showToast("发送失败，您已被主播禁言", 2000);
					return;
				}
				if(_self.content.length == 0){
					api.showToast("请输入内容", 1500);
					return;
				}
				var arr = {
					isVip: _self.userInfo.isVip,
					content: _self.content,
					username: _self.userInfo.username,
					headImg: _self.userInfo.headImg,
					type: 0,
					id: _self.userInfo.id
				};
				//_self.addNotice(arr);
				//console.log(_self.userInfo.id)
				//给所有人发消息
				var data = { type:'msg', data:arr, 'anchorId':_self.aid };
				_self.sendSever(data);
				_self.content = '';
				_self.setChatOpacity();
				uni.hideKeyboard();
				setTimeout(()=>{
					_self.scrollTop = _self.scrollTop + 1;
				}, 300)
			},
			sendSever(data) {
				_self.sendSocketTask(data)
			},
			setChatOpacity() {
				_self.opacityTime = 10;
				_self.opacity = 1;
				_self.opacityDjs = 1000;
			},
			playerTimeAdd() {
				playerStatus = setInterval(() => {
					_self.playerTime ++;
					_self.anchor.playerTime = api.formatSeconds(_self.playerTime);
				}, 1000);
			},
			showGift() {
				_self.$nextTick(()=> {
					_self.$refs['showintroduction'].open()
				});
			},
			changeGift(e) {
				var item = e.detail.index;
				item.isVip = _self.userInfo.isVip;
				item.username = _self.userInfo.username;
				item.headimgurl = _self.userInfo.headImg;
				_self.addGift(item);
			},
			addGift(i) {
				var myGold = _self.userInfo.gold;
				if(myGold < i.gold){
					api.showToast('账户金币不足，请充值', 2000);
					return
				}
				var item = {
					id: _self.userId,
					isVip: i.isVip,
					username: i.username,
					giftImg: i.img,
					num: 1,
					giftName: i.name,
					headimgurl: i.headimgurl,
					gold: i.gold,
					nickname: _self.isLogin.account
				}
				uni.showLoading({ title:'打赏中...',mask:true });
				uni.request({
					url: api.apiData.giveAnchor,
					method: 'POST',
					data: {
						uid: _self.userId,
						aid: _self.aid,
						gid: i.id
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e)=> {
						var r = e.data;
						//console.log(r)
						if(r.Code == 200){
							var d = r.Data;
							_self.userInfo.gold = parseInt(_self.userInfo.gold - i.gold);
							var arr = {
								item: item,
								orderList: d.giveOrderList
							};
							//直播间通知
							var data = { type:'giveGift', data:arr, 'anchorId':_self.aid };
							_self.sendSever(data);
						}else{
							api.showToast(r.Msg, 3000);
						}
					},
					fail: ()=> {
						// 加载失败提示
						api.showToast("赠送失败，请重试", 3000);
					},
					complete: ()=> {
						uni.hideLoading()
					}
				});
			},
			userGiveGift(e) {
				if(_self.giveGift.length >= 5){
					_self.giveGift = [];
				}
				_self.giveGift.push(e);
				_self.isGiftShow = 8;
				_self.userToGift = e;
				_self.$nextTick(()=> {
					_self.$refs['userTopGift'].open()
				});
			},
			showGiftDjs() {
				showGiftDjsTimer = setTimeout(()=>{
					if(_self.isGiftShow > 0){
						_self.isGiftShow --;
						if (_self.isGiftShow == 5) _self.$refs['userTopGift'].close();
					}else{
						_self.giveGift = [];
					}
					_self.showGiftDjs();
				}, 1000);
			},
			goHome() {
				var param = {
					url: '/pages/live/player?aid='+_self.aid,
					t: 'new'
				}
				_self.skipUrl('/pages/member/home_page?type='+JSON.stringify(param)+'&uid='+_self.aid, 'newx');
			},
			closePlayer() {
				uni.showModal({
				    content: '是否退出直播间？',
				    success: (res)=> {
				        if (res.confirm) {
							_self.outRoom();
				        }
				    }
				});
			},
			outRoom() {
				//console.log('用户退出直播间');
				uni.request({
					url: api.apiData.logoutRoom,
					method: 'POST',
					data: {
						uid: _self.userId,
						aid: _self.aid
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e)=> {
						var r = e.data;
						if(r.Code == 200){
							_self.skipUrl(_self.backUrl.url, _self.backUrl.type);
						}else{
							api.showToast(r.Msg, 3000);
						}
					}
				});
			},
			userOut() {
				if(_self.aid != 0) _self.tryTimeDsq(0);
				clearTimeout(showGiftDjsTimer);
				clearTimeout(showInUserTimer);
				clearTimeout(hideChatListTimer);
				clearInterval(playerStatus);
				clearInterval(setBeatTime);
				_self.closeConnectToServer();
				var data = { type:'userLogout', data:_self.userInfo, 'anchorId':_self.aid };
				//_self.sendSever(data);
			},
			recUser(tid = 'showintroduction') {
				uni.showLoading({ title:'正在跳转...',mask:true });
				_self.$nextTick(()=> {
					_self.$refs[tid].close();
					setTimeout(()=>{
						uni.hideLoading()
						_self.skipUrl('/pages/recharge/recharge', 'newx');
					}, 500)
				});
			},
			buyGoldRoom(i) {
				uni.showLoading({ title:'付费中...',mask:true });
				uni.request({
					url: api.apiData.buyGoldRoom,
					method: 'POST',
					data: {
						anchorId: _self.userId,
						userId: _self.aid,
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e)=> {
						var r = e.data;
						api.showToast(r.Msg, 2000);
						if(r.Code == 200){
							_self.$refs['tryLiveEnd'].close();
							_self.isTry = false;
							_self.setLiveStatus(true);
						}
					},
					fail: ()=> {
						// 加载失败提示
						api.showToast("支付失败，请重试", 3000);
					}
				});
			},
			setMuted() {
				_self.muted = !_self.muted;
				_self.mutedImg = _self.muted?'/static/live/voice_no.png':'/static/live/voice.png';
			},
			openUser(i) {
				_self.giveUser = i;
				_self.$refs.userPopup.open()
			},
			backList(msg) {
				api.showToast(msg+'', 1500);
				setTimeout(()=>{
					_self.skipUrl(_self.backUrl.url, _self.backUrl.type);
				}, 1500);
			},
			// 跳转登录
			skipUrl(uri = '/pages/login/login', type = 'newx') {
				api.jumpUrl(uri, type);
			},
		},
	};
</script>
<style>
	.user-top-userimg{
		width: 50rpx;
		height: 50rpx;
		border-radius: 50rpx;
		margin-right: 10rpx;
	}
	.user-top-giftimg{
		width: 80rpx;
		height: 80rpx;
		margin: 0 15rpx;
	}
	.user-top-text{
		color: #D89720;
		font-size: 13px;
	}
	.user-top-content{
		border-radius: 20rpx;
		background-color: rgba(0,0,0,0.5);
		padding: 15rpx 30rpx;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		display: flex;
	}
	.user-top-gift{
		padding-top: 250rpx;
		justify-content: center;
		display: flex;
	}
	/* 试看结束弹出窗 */
	.popup-bg-xx{
		width: 230upx;
		height: 200upx;
		position: absolute;
		right: -20upx;
		top: -70upx;
	}
	.line{
		width: 20upx;
		display: inline-block;
	}
	.try-live-end-btn-buy{
		background-color: #FF5722;
	}
	.try-live-end-btn-rec{
		background-color: #FFB800;
	}
	.try-live-end-btn-back{
		background-color: #01AAED;
	}
	.try-live-end-btn-buy, .try-live-end-btn-rec, .try-live-end-btn-back{
		display: inline-block;
		width: 150upx;
		height: 70upx;
		line-height: 70upx;
		text-align: center;
		font-size: 14px;
		color: #FFFFFF;
		border-radius: 10upx;
	}
	.try-live-end-btn{
		text-align: center;
	}
	.try-live-end-img{
		float: left;
		width: 80upx;
		height: 80upx;
		margin-right: 20upx;
		margin-top: -18upx;
	}
	.try-live-end-content-font{
		font-size: 30upx;
		color: #666666;
	}
	.try-live-end-content{
		padding: 30upx;
		margin: 30upx 0;
	}
	.try-live-end-title{
		height: 90upx;
		line-height: 90upx;
		background-color: #01AAED;
		border-radius: 30upx 30upx 0 0;
		padding: 0 30upx;
	}
	.try-live-end-title-font{
		font-size: 36upx;
		color: #FFFFFF;
	}
	.try-live-end{
		width: 550upx;
		background-color: #FFFFFF;
		border-radius: 30upx;
		padding-bottom: 30upx;
	}
	/* 试看倒计时 */
	.give-sort-left{
		border-radius: 30upx;
		font-size: 12px;
		color: #FFFFFF;
		display: inline-block;
		height: 60upx;
		line-height: 60upx;
		padding: 0 25upx;
	}
	.give-sort-left-a{
		background-color: #FFB800!important;
	}
	.give-sort-left-b{
		background-color: #FF5722!important;
	}
	.give-sort{
		position: fixed;
		z-index: 9;
		//top: 130upx;
		left: 25upx;
	}
	/* 礼物s */
	.gift-top-title-right{
		color: #FFFFFF;
		font-size: 30upx;
		background-color: rgba(255,12,208,0.8);
		padding: 0 20upx;
		height: 60upx;
		line-height: 60upx;
		border-radius: 10upx;
		position: absolute;
		right: 30upx;
		top: 20upx;
	}
	.gift-top-title-left{
		color: #FFFFFF;
		font-size: 30upx;
	}
	.gift-top-title{
		flex-direction: row;
		border-bottom: 1px solid #333;
		height: 100upx;
		line-height: 100upx;
		padding: 0 30upx;
		margin-bottom: 40upx;
	}
	.gift-list-bg{
		height: 560upx;
		background-color: rgba(0,0,0,0.85);
		border-top-left-radius: 30upx;
		border-top-right-radius: 30upx;
	}
	.gift-list{
		height: 410upx;
		
	}
	.gift-item-img{
		width: 80upx;
		height: 80upx;
	}
	.text{
		color: #FFFFFF;
		font-size: 13px;
	}
	.gift-list-item{
		text-align: center;
	}
	/* 礼物e */
	.player-msg-scroll{
		height: 100%;
	}
	.player-msg-item{
		background-color: rgba(0,0,0,0.5);
		border-radius: 20upx;
		margin-bottom: 15upx;
		padding: 10upx 2%;
		font-size: 13px;
		line-height: 35upx;
	}
	.msg-info-content-isvip{
		width: 38upx;
		height: 38upx;
		float: left;
		margin-top: -6upx;
		margin-right: 10upx;
	}
	.msg-info-img{
		display: inline-block;
		width: 30upx;
		height: 30upx;
		border-radius: 50%;
		float: left;
		margin-top: 3upx;
	}
	.player-msg-list{
		margin-top: 20upx;
		margin-left: 0upx;
		padding: 0 20upx;
		width: 520upx;
		height: 430upx;
		border-radius: 20upx;
		//background-color: #009688;
		position: absolute;
		bottom: 20upx;
	}
	.live-user-go{
		height: 70upx; 
		background-color: rgba(245,160,1,0.8);
		border-radius: 70upx;
		padding: 0 30upx 0 15upx;
		display: flex;
		align-items: center;
	}
	.live-user-go .is-vip{
		margin-top: 0!important;
	}
	.is-vip{
		width: 40upx;
		height: 40upx;
		margin-right: 10upx;
		float: left;
		margin-top: 15upx;
	}
	.player-gift-item{
		height: 60upx;
		line-height: 60upx;
		//background-color: #009688;
		font-size: 14px;
		color:#FFFFFF;
	}
	.player-gift-list{
		//margin-top: 100upx;
		margin-left: 30upx;
		position: absolute;
		bottom: 570upx;
	}
	.player-center{
		position: fixed;
		z-index: 8;
		width: 100%;
		//background-color: #007AFF;
	}
	.live-gift-img{
		width: 60upx;
		height: 60upx;
		margin-top: 10upx;
	}
	.live-send-text{
		display: inline-block;
		height: 80upx;
		line-height: 80upx;
		width: 80upx;
		border-radius: 50%;
		//background-color: rgba(245,209,1,0.8);
		background-color: rgba(0, 0, 0, 0.4);
		margin-left: 18upx;
		text-align: center;
		color: #FFFFFF;
		font-size: 25upx;
		float: left;
	}
	.live-send-msg{
		display: inline-block;
		height: 80upx;
		width: 35%;
		background-color: rgba(0,0,0,0.3);
		border-radius: 50upx;
		font-size: 30upx;
		padding: 0 30upx;
		color: #FFFFFF;
		float: left;
	}
	.player-bottom{
		position: fixed;
		z-index: 9;
		bottom: 0;
		width: 100%;
		padding: 10upx 20upx 26upx;
		//background-color: #007AFF;
	}
	.give-gold{
		font-size: 30upx;
		color: rgba(254,67,101,0.8);
	}
	.vip{
		width: 50upx;
		height: 20upx;
		margin-left: 10upx;
		background-color: #FFFFFF;
		border-radius: 10upx;
		padding: 2upx 15upx;
	}
	.user-popup-username{
		margin: 20upx 0;
	}
	.user-popup-tx{
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
		margin-top: 50upx;
		border: 1px solid rgba(245,160,1,0.8);
	}
	.user-popup{
		width: 100%;
		border-radius: 0 0 50upx 50upx;
		background-color: rgba(0,0,0,0.65);
		text-align: center;
		padding: 50upx 0;
	}
	.tx{
		margin-top: 15upx;
	}
	.player-top-item{
		display: inline-block;
		width: 80upx;
		//background-color: #2C405A;
		height: 100upx;
	}
	.player-top-right-num{
		display: inline-block;
		width: 83%;
		height: 70upx;
		line-height: 70upx;
		background-color: rgba(0,0,0,0.5);
		color: #FFFFFF;
		text-align: center;
		border-radius: 50upx;
		font-size: 13px;
		margin-top: 8upx;
		margin-left: 5%;
	}
	.player-top-right{
		display: inline-block;
		width: 20%;
		height: 86upx;
		float: right;
	}
	.player-top-center{
		display: inline-block;
		width: 30%;
		height: 86upx;
		line-height: 86upx;
		//background-color: #009688;
		float: right;
		white-space: nowrap;
		overflow: hidden;
	}
	.live-top-add{
		width: 60upx;
		height: 60upx;
		border-radius: 50%;
	}
	.player-top-left-focus{
		display: inline-block;
		float: right;
		margin-top: 13upx;
	}
	.player-top-left-name{
		display: inline-block;
		color: #FFFFFF;
		font-size: 13px;
		margin: 0 15upx;
		margin-top: 10upx;
		width: 45%;
	}
	.live-top-tx{
		width: 66upx;
		height: 66upx;
		border-radius: 50%;
		margin-top: 10upx;
		float: left;
	}
	.player-top-left{
		display: inline-block;
		background-color: rgba(0,0,0,0.5);
		border-radius: 50upx;
		height: 86upx;
		width: 40%;
		padding: 0 15upx 0 10upx;
		margin-left: 20upx;
	}
	.player-top{
		position: fixed;
		z-index: 9;
		width: 100%;
		top: 26upx;
		//background-color: #007AFF;
	}
	.player-video{
		position: fixed;
		z-index: 1;
		width: 100%;
		height: 100%;
	}
</style>
