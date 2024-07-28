<template>
	<view class="video-box" :style="style">
		<!-- #ifdef APP-PLUS -->
		<image :src="cover" mode="aspectFill" style="position: absolute;z-index: -1;"></image>
		<video ref="myVideo" id="myVideo" :src="src" :muted="muted" :controls="true"
			:enable-progress-gesture="false" :show-center-play-btn="false" :show-fullscreen-btn="false"
			:enable-play-gesture="false" :show-play-btn="false" :loop="true" :autoplay="true" :object-fit="objectFit"
			@play="onplay" @error="onerror" @timeupdate="timeupdate"
			@progress="progressTime"
			@ended="ended"
			style="width:750rpx;" :style="{'height': windowHeight +'px'}"></video>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<div :id="playerID"></div>
		<!-- #endif -->
	</view>
</template>

<script>
	// #ifdef H5
	import Player, {Events} from 'xgplayer';
	import HlsPlayer from 'xgplayer-hls.js'
	import 'xgplayer/dist/index.min.css';
	// #endif

	export default {
		name: 'video_player',
		props: {
			windowHeight: {
				type: Number,
				default: 0
			},
			playerID: {
				type: String,
				default: "mse"
			},
			src: {
				type: String,
				default: ''
			},
			playStatus: {
				type: String|Boolean,
				default: null
			},
			currentPid: {
				type: String|Object,
				default: ''
			},
			muted: {
				type: Boolean,
				default: false
			},
			cover: {
				type: String,
				default: ''
			},
			playBackRate: {
				type: Object|Number,
				default: null
			}
		},
		data() {
			return {
				percent: 0,
				videoObj: null,
				objectFit: 'fill',
				coverMode: 'aspectFit',
				isPay: false,
				orientation:'',
				style: {
					width: '500rpx',
					height: '500rpx'
				}
			};
		},
		mounted() {
			// #ifdef H5
			this.videoObj=[];
			// #endif
			this.initializePlayer();
		},
		created() {
			const systemInfo = uni.getSystemInfoSync();
			var plusp = 0;
			// #ifdef H5
			if(window.navigator.standalone){
				plusp = 14;
			}
			// #endif
			this.style = {
				width: systemInfo.windowWidth + 'px',
				height: (parseFloat(systemInfo.windowHeight) + plusp) + 'px'
			};
		},
		watch: {
			playStatus(val) {
				console.log(val)
				// #ifdef APP
				if (this.videoObj) {
					val ? this.videoObj.play() : this.videoObj.pause();
				}
				// #endif
				// #ifdef H5
				if (this.videoObj[val]) {
					val ? this.videoObj[val].play() : this.videoObj[val].pause();
				}
				// #endif
			},
			currentPid(val){
				// #ifdef H5
				this.videoObj[this.playerID].pause();
				if (this.videoObj[val.idx]) {
					val.status ? this.videoObj[val.idx].play() : this.videoObj[val.idx].pause();
				}
				// #endif
			},
			playBackRate(val) {
				// #ifdef APP
				if (this.videoObj) {
					this.videoObj.playbackRate(parseFloat(val));
					this.videoObj.play()
				}
				// #endif
				// #ifdef H5
				if (this.videoObj[val.idx]) {
					this.videoObj[val.idx].playbackRate = parseFloat(val.rate);
					this.videoObj[val.idx].play()
				}
				// #endif
			},
			muted(val){
				// #ifdef APP
				this.videoObj.muted = val
				// #endif
				// #ifdef H5
				this.videoObj[this.playerID].muted = val
				// #endif
			},
			src(newSrc) {
				// #ifdef APP
				if (this.videoObj) {
					this.videoObj.src = newSrc;
				}
				// #endif
				// #ifdef H5
				if (this.videoObj[this.playerID]) {
					this.videoObj[this.playerID].src = newSrc;
				}
				// #endif
			},
			orientation(e){
				console.log('fasdfdsa', e)
			}
		},
		methods: {
			initializePlayer() {
				// #ifdef APP 
				this.videoObj = uni.createVideoContext('myVideo');
				// #endif
				// #ifdef H5
				this.videoObj[this.playerID] = new Player({
					id: this.playerID,
					url: this.src,
					height: '100%',
					width: '100%',
					poster: this.cover,
					autoplayMuted: true,
					muted: this.muted,
					playsinline: true,
					preloadTime: 10,
					bufferBehind: 30,
					autoplay: this.playStatus,
					plugins: [HlsPlayer],
					loop: true,
					miniprogress: true,
					controls: {
						mode: "bottom"
					},
					ignores: ['fullscreen', 'play', 'time', 'playbackrate', 'volume']
				});
				
				this.videoObj[this.playerID].on('play', this.onplay);
				this.videoObj[this.playerID].on(Events.ERROR, this.onerror);
				this.videoObj[this.playerID].on(Events.TIME_UPDATE, this.timeupdate);
				this.videoObj[this.playerID].on(Events.ENDED, this.ended);
				// #endif
				// const systemInfo = uni.getSystemInfoSync()
				// console.log(systemInfo)
				// this.style = {
				// 	width: systemInfo.windowWidth + 'px',
				// 	height: systemInfo.windowHeight + 'px'
				// }
			},
			onplay(e) {
				this.$nextTick(() => {
					this.$emit('play', true);
				});
			},
			onerror(err) {
				this.$emit('error', err);
			},
			timeupdate(e) {
				this.$emit('playTime', e);
			},
			ended(e){
				this.$emit("ended", e)
			},
			progressTime(e){
				this.$emit('progressTime', e);
			},
			updateOrientation(e) {
				console.log("safdfsadf", e);
				this.orientation = screen.orientation.type;
			}
		}
	};
</script>

<style scoped>
	.video-box {
		position: relative;
	}
	/* #ifdef H5 */
	/deep/.xgplayer .xg-pos{
		left: 0px;
		right: 0px;
	}
	/deep/.xgplayer .xgplayer-controls{
		margin-bottom: 3px;
		height: 30px;
	}
	/deep/.xgplayer .xg-inner-controls{
		height: 30px;
	}
	/deep/.xgplayer .bottom-controls .xg-center-grid{
		top: 10px;
	}
	/deep/.xgplayer.xgplayer-mobile .xgplayer-progress-bottom .xgplayer-progress-outer{
		height: 8px;
	}
	/deep/.xgplayer video{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		outline: none;
		object-fit: cover;
	}
	/deep/.xg-mini-progress{
		height: 3px;
		background-color: rgba(255,255,255,.3);
	}
	/deep/.xgplayer .xgplayer-progress-btn{
		width: 15px;
		height: 15px;
	}
	/* #endif */
	.video-controll {
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.15);
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.video-controll-text {
		width: 120upx;
		font-size: 11px;
		color: #FFF;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
</style>