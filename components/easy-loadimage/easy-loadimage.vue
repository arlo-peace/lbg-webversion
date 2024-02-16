<template>
    <view class="easy-loadimage" id="img">
        <image 
			class="origin-img" 
			:src="imageSrc" 
			:mode="mode"
            :class="{'no-transition':!openTransition,'show-transition':showTransition&&openTransition}"
            @load="handleImgLoad" 
            @error="handleImgError"
			v-show="showImg"
			v-if="loadImg&&!isLoadError">
        </image>
        <view class="loadfail-img" v-else-if="isLoadError"></view>
        <view class="loading-img" v-show="!showImg&&!isLoadError"></view>
    </view>
</template>
<script>
export default{
    props: {
        imageSrc: {
            type: String,
        },
        mode: {
            type: String,
        },
        scrollTop: {
            type: Number,
        },
        openTransition: {
            type: Boolean,
            default: false
        },
        viewHeight: {
            type: Number,
            default() {
                return uni.getSystemInfoSync().windowHeight;
            }
        }
    },
    watch: {
        scrollTop(val) {
			this.onScroll(val);
        }
    },
    data() {
        return {
            loadImg: false,
            showImg: false,
            isLoadError: false,
            showTransition: false,
			query: {},
        }
    },
	created() {
		this.query = uni.createSelectorQuery().in(this);
	},
	mounted() {
	    this.init();
	},
    methods: {
        init() {
            this.$nextTick(() => {
				this.onScroll(0);
			});
        },
        handleImgLoad(e) {
            this.showImg = true;
            let timer = setTimeout(() => {
                this.showTransition = true
				clearTimeout(timer);
            }, 20);
        },
        handleImgError(e) {
            this.isLoadError = true;
        },
        onScroll(scrollTop) {
            // 加载ing时才执行滚动监听判断是否可加载
            if (this.loadImg || this.isLoadError) return;
			this.$nextTick(() => {
				this.query.select('#img').boundingClientRect(d => {
					if (d) {
						if ((d.top - this.viewHeight) < 0) this.loadImg = true;
					}
				}).exec();
			});
        }
    }
}
</script>

<style scoped>
    /* 官方优化图片tips */
    image{
        will-change: transform
    } 
    /* 渐变过渡效果处理 */
    image.origin-img{
        width: 100%;
        height: 100%;
        opacity: 0.3;
    }
    image.origin-img.show-transition{
        transition: opacity 1.2s;
        opacity: 1;
    }
    image.origin-img.no-transition{
        opacity: 1;
    }
    /* 加载失败、加载中的占位图样式控制 */
    .loadfail-img{
        height: 100%;
        background: url('./loadfail.png') no-repeat center;
        background-size: 50%;
    }
    .loading-img{
        height: 100%;
        background: url('./loading.gif') no-repeat center;
        background-size: 100rpx;
    }
</style>

