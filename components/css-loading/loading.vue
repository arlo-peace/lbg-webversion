<template>
	<view class="load-img" v-if="show" :style="mainStyle">
		<view class="loading-wrapper" :style="itemStyle">
			<image src="/static/loading/loading_back.png" style="width:400rpx;height:400rpx;" mode="scaleToFill"></image>
		</view>
		<view class="loading-item" :style="itemStyle">
			<image src="/static/loading/loading_front.png" style="width:400rpx;height:400rpx;" mode="scaleToFill"></image>
		</view>
		<view class="loading-circle" :style="itemStyle">
			<image src="/static/loading/loading_circle.png" :style="circleStyle" mode="scaleToFill"></image>
		</view>
		<view class="loading-text" v-if="textWord && textWord.length > 0">
			<text class="loading-text-text">{{textWord}}</text>
		</view>
	</view>
</template>

<script>
	let timer;
	export default {
		name: "css-loading",
		data() {
			return {
				SystemInfo: {},
				textWord: null,
				show: false,
				time: 400,
				mode: 'sub'
			};
		},
		computed: {
			itemStyle(){
				return  {
					height:this.SystemInfo.windowHeight + 'px',
					width:this.SystemInfo.windowWidth + 'px',
				}
			},
			mainStyle(){
				return  {
					height:this.SystemInfo.windowHeight + 'px',
					width:this.SystemInfo.windowWidth + 'px',
					backgroundColor: this.textWord ? 'rgba(0,0,0,.5)' : 'rgb(29,29,40)'
				}
			},
			circleStyle(){
				return {
					width: this.time + 'rpx',
					height: this.time + 'rpx'
				}
			}
		},
		created() {
			this.SystemInfo = uni.getSystemInfoSync()
			uni.$on('_hideLoading',()=>{
				this.close()
			})
		},
		watch:{
			show:{
				handler(val,old){
					if(val != old)
					{
						if(val)
						{
							timer = setInterval(()=>{
								this.animationCircle()
							},3)
						}else{
							timer && clearInterval(timer)
						}
					}
				}
			}
		},
		destroyed() {
			uni.$off('_hideLoading')
			timer && clearInterval(timer)
		},
		methods:{
			animationCircle(){
				if(this.mode == 'sub' && this.time > 100)
				{
					this.time--
					if(this.time == 100)
					{
						this.mode = 'add'
					}
				}
				if(this.mode == 'add' && this.time < 400)
				{
					this.time++
					if(this.time == 400)
					{
						this.mode = 'sub'
					}
				}
			},
			open(text = null)
			{
				this.textWord = text
				this.show = true
			},
			close(){
				this.textWord = null
				this.show = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	$bg-color: #1D1D28;

	.load-img {
		z-index: 9999;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: $bg-color;
	}

	.loading-wrapper {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.loading-text {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.loading-text-text{
		margin-top: 320rpx;
		color: #FFF;
		font-size: 14px;
		font-weight: bold;
		background-color: rgba(0,0,0,.75);
		width: 300rpx;
		height: 60rpx;
		border-radius: 30rpx;
		line-height: 60rpx;
		text-align: center;
	}

	.loading-item {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.loading-circle {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>