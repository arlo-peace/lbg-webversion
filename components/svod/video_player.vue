<template>
	<view class="video-box" :style="style">
		<!-- #ifdef APP-PLUS -->
		<image :src="cover" mode="aspectFill" style="position: absolute;z-index: -1;"></image>
		<!-- #endif -->
		<video ref="myVideo" id="myVideo" :src="src" :muted="muted" :controls="true"
			:enable-progress-gesture="false" :show-center-play-btn="false" :show-fullscreen-btn="false"
			:enable-play-gesture="false" :show-play-btn="false" :loop="true" :autoplay="true" :object-fit="objectFit"
			@play="onplay" @error="onerror" @timeupdate="timeupdate"
			style="width:750rpx;" :style="{'height': windowHeight +'px'}">
		</video>
	</view>
</template>

<script>
	export default {
		name: "video_player",
		props: {
			windowHeight: {
				default: 0
			},
			src: {
				default: false
			},
			playStatus: {
				default: false
			},
			muted: {
				default: false
			},
			cover: {
				type: String,
			}
		},
		data() {
			return {
				percent: 0,
				videoObj: {},
				objectFit: 'fill',
				coverMode: 'aspectFit', // aspectFill  aspectFit
				isPay: false,
				style: {
					width: '500rpx',
					height: '500rpx'
				},
			}
		},
		created() {
			this.videoObj = uni.createVideoContext('myVideo');
			const systemInfo = uni.getSystemInfoSync()
			this.style = {
				width: systemInfo.windowWidth + 'px',
				height: systemInfo.windowHeight + 'px'
			}
		},
		watch: {
			playStatus(val) {
				if (!val) {
					this.videoObj.pause();
				} else {
					this.videoObj.play();
				}
			}
		},
		methods: {
			onplay(e) {
				this.$nextTick(()=>{
					this.$emit("play", true);
				})
			},
			onerror(err) {
				this.$emit("error", err);
			},
			timeupdate(e) {
				let d = e.detail;
				this.$emit("playTime", d);
			}
		}
	}
</script>

<style scoped>
	.video-box {
		position: relative;
	}

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