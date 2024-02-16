<template>
	<view class="bg">
		<view class="video-list">
			<view :class="v.downstatus?'video-info ok':'video-info no'" v-for="(v, i) in downList" :key="i"
				v-if="v.delstatus">
				<view class="img" @click="playVideo(v.downstatus, v.title, v.url, v.poster)">
					<image class="pic" :src="v.poster" mode="aspectFill"></image>
					<image class="play" :style="{'margin-top':topUpx+'upx'}" src="@/static/imgs/play.png"
						mode="aspectFill" v-if="v.downstatus"></image>
				</view>
				<view class="video-content">
					<image class="bgx" src="@/static/imgs/delx.png" mode="aspectFill"
						@click="delVideo(v.videoid,i,v.url,v.downstatus)"></image>
					<view class="video-title video-info-video-title">{{v.title}}</view>
					<view v-if="v.downstatus">
						<view class="video-kb">
							<view style="margin-left:2px;">已下载</view>
							<view style="float:right;margin-right:1px;">{{v.videosize}}<text
									v-if="v.type!='m3u8'">M</text></view>
						</view>
						<view class="video-lenght">
							<view class="video-lenght-ing" style="width:100%"></view>
						</view>
					</view>
					<view v-else>
						<view class="video-kb">
							<view style="margin-left:2px;">{{v.downkb}}</view>
							<view style="float:right;margin-right:2px;">
								{{v.downsize}}<text v-if="v.type!='m3u8'">M</text>/{{v.videosize}}<text
									v-if="v.type!='m3u8'">M</text>
							</view>
						</view>
						<view class="video-lenght">
							<view class="video-lenght-ing" :style="{ width: v.videoing +'%' }"></view>
						</view>
						<!-- <image class="start-down" 
							src="@/static/imgs/download_sel.png"
							:style="{'right':rightPx+'px'}" 
							@click="startDown(v.videourl, i)" 
							v-if="v.starttostop">
						</image> -->
					</view>
				</view>
			</view>
			<!--暂无数据-->
			<view style="width:100%;height:500upx;margin-top:45%;text-align:center;" v-if="isShowTig">
				<image src="/static/empty.png" style="width:100px;height:100px;"></image>
				<view style="width:100%;font-size:12px;color:#CCCCCC;margin-top:30upx;">当前页面暂无内容</view>
			</view>
			<!-- <view @click="downVideo('mp4')" style="margin-top:20px;text-align:center;color:#FFFFFF;">添加MP4</view>
			<view @click="downVideo('m3u8')" style="margin-top:20px;text-align:center;color:#FFFFFF;">添加M3U8</view> -->
		</view>
		<!--弹出播放器start-->
		<view class="video" v-if="isPlay">
			<view class="play-title">{{video.title}}</view>
			<video :src="video.url" :poster="video.poster" :autoplay="true" :title="video.title" @error="videoError">
			</video>
			<view class="play-close" @click="playClose">
				<image src="/static/imgs/delx.png"></image>
			</view>
		</view>
		<!--弹出播放器end-->
		<css-loading ref="cssLoading"></css-loading>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	var _self;
	export default {
		data() {
			return {
				isPlay: false,
				video: {
					title: '加载中...',
					url: '',
					poster: ''
				},
				// 下载列表
				downList: [],
				downloadingID: null,
				// 会员ID
				userId: 0,
				isShowTig: false,
				dbName: 'video',
				videoNum: 0,
				downNum: 5,
				downBigNum: 5,

				one: false,
				phone: {},
				rightPx: 20,
				topUpx: -100,
				key_val: [],
			}
		},
		onLoad(e) {
			// _self.$down.reconnct(0);
			_self = this;
			_self.phone = uni.getSystemInfoSync();
			// #ifdef APP-PLUS
			_self.topUpx = _self.phone.platform == 'ios' ? -90 : -100;
			_self.rightPx = _self.phone.platform == 'ios' ? 24 : 20;
			// #endif
			// 是否登录
			var info = api.getLogins();
			if (info === false) {
				_self.skipUrl();
			} else {
				_self.userId = info.userId;
			}
			_self.getDownList();
			// console.log("down", e)
			// 监听下载进度
			uni.$on('downloaing', r => {
				this.downloadingID = r
			})
			uni.$on('download_event', r => {
				// console.log('download_event', r);
				if (r.type == 'connct') {
					_self.getDownList();
				} else if (r.type == 'progress') {
					_self.getDownTaskProgress(r.data);
				}
			});
		},
		onHide() {
			_self.one = true;
		},
		onShow() {
			if (_self.one) _self.getDownList();
		},
		onUnload() {
			uni.$off('download_event');
		},
		methods: {
			downVideo(t) {
				var rand = api.randomWord(true, true, 1, 5);
				var data = {
					userId: _self.userId,
					videoId: rand,
					title: '测试视频' + rand,
					url: t == 'mp4' ? 'http://ms.cqpig.cn/24.mp4' :
						'https://vip4.ddyunbo.com/20210607/wY6rIqTw/index.m3u8',
					poster: 'http://v3.cqpig.cn/XResource/video_pic/132401-1521091441cda2.jpg',
					videoSize: 0,
				};
				_self.$down.addTask(data);
				//api.showToast('OK', 1000);
				/* ======添加视频下载任务示例=====e */
			},
			// 下载列表
			getDownList() {
				_self.$down.allTask().then(res => {
					_self.downList = res;
					_self.videoNum = _self.downList.length;
					_self.isShowTig = _self.videoNum ? false : true;
					if (_self.videoNum) {
						_self.downList.forEach((item, index) => {
							_self.key_val[item.videoid] = index;
						})
					}
					// console.log(res)
				}).catch(() => {
					api.showToast('读取数据出错，请关闭APP重试');
				});
			},
			getDownTaskProgress(res) {
				let item = _self.$down.vlists[0];
				if (item == undefined && !res) return;
				if (_self.downList.length && _self.key_val.length) {
					let i = Number(_self.key_val[item.videoid]);
					_self.downList[i]['videosize'] = res.videosize;
					_self.downList[i]['videoing'] = res.progress;
					_self.downList[i]['downsize'] = res.downsize;
					_self.downList[i]['downkb'] = '已下载 ' + res.progress + '%';
					_self.downList[i]['starttostop'] = 0;
				}
			},
			// 离线播放视频
			playVideo(type, title, url, poster) {
				_self._showLoading('加载中...');
				if (type) {
					_self.video.url = url;
					_self.video.title = title;
					_self.video.poster = poster;
					_self.isPlay = true;
					console.log(_self.video.url);
				}
				_self._hideLoading();
			},
			playClose() {
				_self.video.url = '';
				_self.video.poster = '';
				_self.isPlay = false;
			},
			videoError(e) {
				console.log(this.video.url)
				api.showToast('加载失败，视频暂未下载完成或已删除', 3000);
			},
			// 删除视频
			delVideo(vid, i, dirPath, downstatus) {
				console.log(vid)
				console.log(this.downloadingID)
				if(this.downloadingID === vid){
					api.showToast('视频正在下载，请稍候。', 2000)
					return;
				}
				uni.showModal({
					content: '确认要删除吗？',
					confirmText: '确定',
					success: (res) => {
						if (res.confirm) {
							api.showToast('删除成功');
							_self.$down.delTask(vid, dirPath);
							_self.downList[i]['delstatus'] = 0;
							_self.videoNum--;
							if (_self.videoNum < 1) _self.isShowTig = true;
							//console.log(_self.videoNum); 
							// if(this.downloadingID === vid){
							// 	_self.$down.reconnct(0);
							// }
						}
					}
				});
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
		}
	}
</script>

<style>
	.video {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		position: fixed;
		top: 0;
		padding: 0 4%;
	}

	.video video {
		width: 92%;
	}

	.play-title {
		width: 90%;
		margin-top: 25%;
		font-size: 14px;
		background: rgba(0, 0, 0, 0.8);
		text-align: left;
		color: #FFFFFF;
		padding: 5px 1%;
		border-radius: 5px 5px 0 0;
	}

	.play-close {
		width: 92%;
		text-align: center;
		margin-top: 5px;
	}

	.play-close image {
		width: 30px;
		height: 30px;
		border: 3px solid rgba(239, 187, 52, 0.9);
		border-radius: 50%;
	}

	.bgx {
		width: 20px;
		height: 20px;
		float: right;
		margin-top: 4px;
		margin-right: -5px;
		//background-color: #009688;
	}

	.start-down {
		position: absolute;
		width: 20px;
		height: 20px;
		margin-top: -20px;
		right: 24px;
		//background-color: #007AFF;
	}

	.content-head {
		position: fixed;
		width: 100%;
		height: 30px;
		line-height: 30px;
		top: 27px;
		text-align: center;
		color: #666666;
	}

	.video-list {
		margin-top: 40upx;
		//background-color: #007AFF;
	}

	.no {
		//border: 1px solid #E5E5E5; 
	}

	.ok {
		//border: 1px solid rgba(51,172,85,0.5); 
	}

	.video-info {
		padding: 10upx 15px;
		width: 86%;
		margin: 0 auto 10px;
		border-radius: 5px;
		//box-shadow: 0px 4px 6px 0px rgba(103, 103, 103, 0.2);
		font-size: 17px;
		color: #666666;
	}

	.video-info view {
		display: inline-block;
	}

	.video-info .img {
		width: 20%;
		height: 60px;
	}

	.video-info .img .pic {
		width: 200upx;
		height: 100%;
		border-radius: 10upx;
		background: #CCCCCC;
		margin-bottom: -4px;
	}

	.video-info .img .play {
		position: absolute;
		width: 35px;
		height: 35px;
		margin-left: 70upx;
		margin-top: -100upx;
	}

	.video-content {
		// 78%
		width: 65%;
		float: right;
	}

	.video-content view {
		display: block;
	}

	.video-title {
		width: 85%;
		font-size: 28upx;
		height: 25px;
		line-height: 25px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: #FFFFFF !important;
	}

	.video-lenght {
		width: 85%;
		font-size: 3px;
		height: 3px;
		line-height: 3px;
		text-align: center;
		border-radius: 3px;
		border: 1px solid #999999;
	}

	.video-lenght-ing {
		border-radius: 5px;
		height: 3px;
		background: #FF8F00;
		color: #FFFFFF;
	}

	.video-kb {
		width: 85%;
		font-size: 12px;
		height: 50upx;
		line-height: 60upx;
		color: #999999 !important;
	}

	.video-kb view {
		display: inline-block;
	}
</style>