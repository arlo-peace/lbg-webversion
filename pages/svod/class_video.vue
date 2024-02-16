<template>
	<view class="video-list">
		<css-loading ref="cssLoading"></css-loading>
		<view class="tabs" :class="{tabRight:sort == 'new'}">
			<view class="tabs-item" @click="changeSort('hot')" :class="{active:sort == 'hot'}">
				<text>热度排序</text>
			</view>
			<view class="tabs-item" @click="changeSort('new')" :class="{active:sort == 'new'}">
				<text>最新排序</text>
			</view>
		</view>
		<view class="video-item" v-for="(b, i) in list" :key="i" @click="api.jumpUrl('/pages/svod/player?info='+JSON.stringify(b), 'new')">
			<image class="is-vip" src="/static/play/ico_vip.png" v-if="b.gold>0"></image>
			<image class="is-vip" src="/static/play/ico_free.png" v-else></image>
			<easy-loadimage
				mode="aspectFill"
				:scroll-top="scrollTop"
				:image-src="b.cover"
				:open-transition="true"
				class="cover">
			</easy-loadimage>
			<text class="video-title video-item-video-title">{{b.title}}</text>
		</view>
		<view class="more">
			<image v-if="more" class="load-img" src="/static/loading/load0.gif" mode="aspectFill"></image>
			<text v-if="notData">——— 我是有底线的 ———</text>
		</view>
	</view>
</template>
<script>
import api from "@/common/api.js";
var _self;
export default {
	data() {
		return {
			info: {
				c_name: '分类视频',
				c_id: 0
			},
			page: 1,
			list: [],
			scrollTop: 0,
			notData: false,
			more: false,
			loading: true,
			api: api,
			sort: 'hot'
		}
	},
	onLoad(e) {
		_self = this;
		_self._showLoading()
		_self.info = JSON.parse(e.info);
		let timer = setTimeout(() => {
			uni.setNavigationBarTitle({ title: _self.info.c_name });
			clearTimeout(timer);
		}, 100);
		_self.getVideo();
	},
	methods: {
		changeSort(sort)
		{
			_self.sort = sort 
			_self.page = 1;
			_self.list = []
			_self._showLoading("加载中....")
			_self.getVideo()
		},
		getVideo() {
			uni.request({
				url: api.apiData.getSvodData +'/cid/'+ _self.info.c_id +'/type/1/page/'+ _self.page +'/count/12/sort/' + _self.sort,
				method: 'GET',
				header: {
					'Content-type': 'application/x-www-form-urlencoded'
				},
				success: (r) => {
					let d = r.data;
					if (d.length) {
						_self.list = _self.list.concat(d);
						_self.notData = false;
					} else {
						_self.notData = true;
					}
					let timer = setTimeout(()=> {
						_self.loading = false;
						_self._hideLoading()
						clearTimeout(timer);
					}, 500);
				},
				fail: () => {
					// 加载失败提示
					_self.showTip('服务器连接失败，请检查网络是否正常');
				},
				complete: () => {
					_self.more = false;
				}
			});
		},
		showTip(m) {
			api.showToast(m);
			let timer = setTimeout(()=> {
				uni.navigateBack();
				clearTimeout(timer);
			}, 1000);
		}
	},
	onReachBottom(){
		if (_self.notData) return;
		_self.page++;
		_self.more = true;
		_self.getVideo();
	},
	onPageScroll({scrollTop}) {
		_self.scrollTop = scrollTop;
	}
};
</script>

<style>
	@import url('@/components/loading/loading.css');
	.more .load-img{
		width: 80rpx;
		height: 80rpx;
	}
	.more{
		display: flex;
		justify-content: center;
		width: 100%;
		color: #999;
		font-size: 12px;
		margin: 10px 0;
	}
	.tabs{
		width: calc(100% - 60upx);
		height: 64upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-top: -10upx;
		margin-bottom: 30upx;
		margin-left: 30upx;
		padding: 2upx;
		background-color: #1a0839;
		border-radius: 32upx;
		box-sizing: border-box;
		background-image: linear-gradient(to right,#a00f78,#1a0839 50%,#1a0839);
	}
	.tabs.tabRight{
		background-image: linear-gradient(to left,#a00f78,#1a0839 50%,#1a0839);
	}
	.tabs-item{
		width: 50%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: #1a0839;
		color: #76748a;
		font-size: 14px;
		border-radius: 30upx;
	}
	.tabs-item:first-child{
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
	.tabs-item:last-child{
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}
	.tabs-item.active{
		background: #40007a;
		color: #FFFFFF;
		font-weight: 600;
	}
	
	.is-vip{
		width: 32px;
		height: 16px;
		position: absolute;
		margin-bottom: -16px;
		z-index: 1;
	}
	.video-bottom{
		width: 50%;
		height: 30px;
		background-color: #272733;
		border-radius: 30px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin: 15px auto 20px;
	}
	.video-title{
		position: absolute;
		margin-top: -30px;
		background-color: rgba(0,0,0,0.2);
		color: #fff;
		font-size: 12px;
		width: 98%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		padding: 2px 1%;
	}
	.video-item .cover{
		width: 100%;
		height: 210px;
		border-radius: 8px;
	}
	.cover >>> .origin-img{
		border-radius: 8px;
	}
	.video-list .video-item{
		display: inline-block;
		width: 48%;
		position: relative;
		margin-bottom: 12px;
		border-radius: 8px;
		background-color: rgba(0,0,0,0.3);
	}
	.video-list{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 15px 30rpx;
	}
</style>
