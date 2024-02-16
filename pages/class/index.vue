<template>
    <view>
		<css-loading ref="cssLoading"></css-loading>
		<view class="class-list">
			<view class="head-placeholder"></view>
			<view class="head-center">
				<view class="head-left" @click="backUrl">
					<image src="/static/imgs/back.png" mode="aspectFill"></image>
				</view>
				<view style="flex: 1;text-align: center;line-height: 30px;">
					<template v-if="isTrue">
						<template  v-for="(item, index) in classData">
							<template v-if="item.name == '分类'">
								<template v-for="(c, cindex) in item.items">
									<text v-if="classId==c.id">{{c.name}}</text>
								</template>
							</template>
						</template>
					</template>
					<template v-else>
						<text @click="api.jumpUrl('/pages/video/search', 'new')">搜索</text>
						<text class="sel">分类</text>
					</template>
				</view>
				<view class="head-left"></view>
			</view>
			<template  v-for="(item, index) in classData">
			<view class="video-class" v-if="!isTrue || (isTrue && item.name != '分类') " :key="index">
				<view class="class-type">|-{{item.name}}</view>
				<scroll-view class="class-scroll" scroll-x="true">
					<view :class="(classId==c.id&&className==item.type)||(tagId==c.id&&tagName==item.type)||(areaId==c.id&&areaName==item.type)?'class-sel':''" 
						v-for="(c, cindex) in item.items" :key="cindex" 
						@click="classSel(item.type, c.id)">
						{{c.name}}
					</view>
				</scroll-view>
			</view>
			</template>
			<view class="video-class">
				<view class="class-type">|-排序</view>
				<scroll-view class="class-scroll" scroll-x="true">
					<view :class="orderCode == 'lastTime'?'class-sel':''" 
						@click="classSel('orderCode', 'lastTime')">最新</view>
					<view :class="orderCode == 'hot'?'class-sel':''" 
						@click="classSel('orderCode', 'hot')">热门</view>
					<view :class="orderCode == 'reco'?'class-sel':''" 
						@click="classSel('orderCode', 'reco')">推荐</view>
					<view :class="orderCode == 'good'?'class-sel':''" 
						@click="classSel('orderCode', 'good')">点赞</view>
				</scroll-view>
			</view>	
		</view>
		<view class="video-list" :style="'margin-top:'+headHeight+'px'">
			<view class="video-info" v-for="(i, k) in videoData" :key="k" @click="playVideo(i.id)">
				<image class="is-vip" src="/static/play/ico_vip.png" v-if="true"></image>
				<image class="is-vip" src="/static/play/ico_free.png" v-else></image>
				<easy-loadimage
					mode="aspectFill"
					:scroll-top="scrollTop"
					:image-src="i.thumbnail"
					:open-transition="true"
					class="cover">
				</easy-loadimage>
				<view class="video-time" v-if="i.play_time">{{i.play_time}}</view>
				<view class="video-title video-info-video-title">{{i.title}}</view>
			</view>
		</view>
		<view style="width:100%;text-align:center;" :style="'margin-top:'+(headHeight+100)+'px'" v-if="isShowTig">
			<image src="/static/empty.png" style="width:100px;height:100px;"></image>
			<view style="width:100%;font-size:25upx;color:#999999;">当前页面暂无内容</view>
		</view>
		<view class="moreTig" v-if="isMoreTig">——— 我是有底线的 ———</view>
    </view>
</template>

<script>
import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue'
import api from "@/common/api.js";
var _self;
export default {
	components: {
		easyLoadimage
	},
    data() {
        return {
			loading: true,
            classData: [],
            videoData: [],
			classId: 0,
			className: 'class',
			tagId: 0,
			tagName: 'tag',
			areaId: 0,
			areaName: 'area',
			orderCode: 'lastTime',
			countArr: 0,
			where: '?page=1&cid=0&tag_id=0&area_id=0&orderCode=lastTime',
			isSel: 0,
			isShowTig: false,
			page: 1,
			more: false,
			isMoreTig: false,
			isTrue: false,
			headHeight: 55,
			phone: {},
			h5: 0,
			scrollTop: 0,
			api: api,
        }
    },
	onLoad(e) {
		_self = this;
		if(e.isTrue)
		{
			_self.isTrue = e.isTrue == 1
		}
		if(e.classId)
		{
			_self.classId = e.classId
			_self.className = 'class'
		}
		if(e.tagId)
		{
			_self.tagId = e.tagId
			_self.tagName = 'tag'
		}
		_self._showLoading()
		_self.where = '?page='+_self.page+'&cid='+_self.classId+'&tag_id='+_self.tagId+'&area_id='+_self.areaId+'&orderCode='+_self.orderCode;
		_self.phone = uni.getSystemInfoSync();
		// #ifdef H5
		_self.h5 = 44;
		// #endif
		// 加载分类数据
		_self.getClassData();
		// 加载分类视频
		_self.getVideoData();
	},
	mounted() {
		const query = uni.createSelectorQuery().in(this);
		let timer = setTimeout(() => {
			query.select('.class-list').boundingClientRect(d => {
				_self.headHeight = d.height + 10;
			}).exec();
			clearTimeout(timer);
		}, 800)
	},
    methods: {
		moveHandle() {},
		// 跳转播放页
		playVideo(vid) {
			uni.setStorage({
				key: 'vid',
				data: vid,
				success: () => {
					var param = {
						url: '/pages/class/index',
						t: 'newx'
					}
					api.jumpUrl('/pages/video/play?type='+JSON.stringify(param), 'new');
				},
				fail: ()=> {
					api.showToast('播放失败，请检查网络是否正常');
				}
			});
		},
		// 分类数据
		getClassData(){
			uni.request({
				url: api.apiData.getFilterData,
				method: 'GET', 
				success: e => {
					// 分类数据
					_self.classData = e.data.Data;
				},
				fail: () => {
					_self.notData("服务器连接失败，请检查网络是否正常");
				}
			});
		},
		// 分类视频
		getVideoData() {
			uni.request({
				url: api.apiData.getFilters+_self.where,
				method: 'GET',
				success: e => {
					let d = e.data.Data;
					// 非加载更多状态,清空数组
					if (!_self.more) _self.videoData = [];
					// 我是有底线的
					if (d.videolist.length) {
						_self.isMoreTig = false;
						// 分类视频
						_self.videoData = _self.videoData.concat(d.videolist);
					} else {
						_self.isMoreTig = true;
						_self.page = _self.page-1;
					}
					// 无数据
					if (_self.videoData.length) {
						_self.isShowTig = false;
					} else {
						_self.isMoreTig = false;
						_self.isShowTig = true;
					}
				},
				fail: () => {
					// 加载失败提示
					_self.notData("服务器连接失败，请检查网络是否正常");
				},
				complete: () => {
					let timer = setTimeout(() => {
						_self.loading = false;
						_self._hideLoading()
						clearTimeout(timer);
					}, 800);
				}
			});
		},
		// 点击分类
		classSel(type, selId, more = 0) {
			uni.startPullDownRefresh();
			if (more) {
				_self.more = true;
			} else {
				_self.more = false;
				_self.page = 1;
			}
			switch(type) {
			    case 'class':
			        _self.classId = selId;
			        break;
			    case 'tag':
			        _self.tagId = selId;
			        break;	
				case 'area':
				    _self.areaId = selId;
				   break;
			    default:
					_self.orderCode = selId;
			} 
			_self.where = '?page='+_self.page+'&cid='+_self.classId+'&tag_id='+_self.tagId+'&area_id='+_self.areaId+'&orderCode='+_self.orderCode;
			_self.getVideoData();
		},
		// 提示
		notData(msg = '') {
			if (msg.length) return;
			api.showToast(msg);
			let timer = setTimeout(() => {
				uni.navigateBack();
				clearTimeout(timer);
			}, 1500);
		},
		backUrl() {
			api.jumpUrl('/pages/video/class', 'tab');
		},
    },
	// 上拉加载数据
	onReachBottom(){
		if (_self.isMoreTig||_self.isShowTig) return false;
		_self.page++;
		_self.classSel('orderCode', _self.orderCode, 1);
	},
	onPageScroll({scrollTop}) {
	    _self.scrollTop = scrollTop;
	}
}
</script>

<style>
	@import url('@/components/loading/loading.css');
	.head-left image{
		width: 30px;
		height: 30px;
		margin-top: 1px;
		border-radius: 50%;
		opacity: 0.6;
		filter: alpha(opacity=60);
	}
	.head-left{
		width: 30px;
	}
	.head-center .sel{
		font-weight: bold;
		border-bottom: 2px solid #F2692F;
	}
	.head-center text{
		color: #FFFFFF;
		font-size: 16px;
		margin: 0 30upx;
		border-bottom: 2px solid #20202C;
	}
	.head-center{
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-bottom: 5px;
		padding: 0 13upx;
	}
	.head-placeholder{
		height: var(--status-bar-height);
		padding-top: 16upx;
		box-sizing: content-box;
	}
	.moreTig{
		text-align: center;
		color: #ccc;
		font-size: 25upx;
		margin-bottom: 100upx;
	}
	.class-list{
		position: fixed;
		top: 0upx;
		z-index: 9;
		width: 100%;
		padding: 10upx 0;
		background-color: #20202C;
	}
	.is-vip{
		width: 32px;
		height: 16px;
		position: absolute;
		margin-bottom: -16px;
		z-index: 1;
	}
	.video-time{
		position: absolute;
		font-size: 12px;
		background-color: rgba(0,0,0,0.5);
		height: 40upx;
		line-height: 40upx;
		margin-top: -60upx;
		padding: 0 16upx 0 10upx;
		border-radius: 0 10upx 10upx 0;
		color: #FFFFFF;
	}
	.video-title{
		font-size: 13px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: #FFFFFF;
		padding-top: 10upx;
	}
	.video-info .cover{
		width: 100%;
		height: 230upx;
		border-radius: 8px;
		background: #333333;
	}
	.cover >>> .origin-img{
		border-radius: 8px;
	}
	.video-info{
		padding: 0 0 0 2%;
		display: inline-block;
		width: 47%;
		margin-bottom: 25upx;
		position: relative;
	}
	.video-list{
		text-align: left;
	}
	.class-sel{
		background-image: linear-gradient(to right,#FF8F00, rgba(254,67,101,0.8));
		color: #F8F8F8!important;
		height: 50upx;
		line-height: 50upx;
	}
	.class-scroll{
		white-space: nowrap;
		display: inline-block;
		width: 80%;
		float: right;
		margin-right: 10px;
	}
	.class-scroll view{
		padding: 0 15upx;
		margin-right: 20upx;
		text-align: center;
		border-radius: 20upx;
		color: #999999;
		background-color: rgba(255,255,255,0.1);
	}
	.video-class view{
		display: inline-block;
		font-size: 25upx;
	}
	.class-type{
		width: 15%;
		text-align: center;
		color: #F0AD4E;
	}
	.video-class{
		width: 100%;
		height: 54upx;
		line-height: 54upx;
		padding: 5upx 0 15upx 0;
		color: #666;
	}
</style>
