<template>
	<view>
		<view class="common-head-top" v-if="menuList.length>1">
			<!-- <view @click="headTop('/pages/index/index', 'tab')">首页</view>
			<view @click="headTop('/pages/svod/index', 'new')">短视频</view>
			<view @click="headTop('/pages/live/list', 'new')">直播</view>
			<view @click="headTop('/pages/news/list', 'new')">资讯</view>
			<view @click="headTop('/pages/image/list', 'new')">图片</view>
			<view @click="headTop('/pages/plaza/index', 'new')">广场</view> -->
			<view :class="nowUrl==m.url?'common-sel-top':''" :style="{'width':width+'%'}" v-for="(m, i) in menuList" :key="i" @click="headTop(m.url, m.type)">
				<!-- <image class="menu-ico" src="/static/imgs/home_.png" mode="aspectFill"></image> -->
				<text>{{m.name}}</text>
			</view>
			<view class="common-head-top-right" v-if="menuList.length < 4">
				<image class="common-logo" :src="webLogo" mode="aspectFill" v-if="nowUrl=='/pages/index/index'"></image>
				<image class="common-logo" src="/static/member.png" mode="aspectFill" @click="headTop('/pages/member/member', 'tab')" v-else></image>
			</view>
		</view>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	export default {
		name: "topMenu",
		data() {
			return {
				menuList: [
					{
						name: '首页',
						url: '/pages/index/index',
						type: 'tab'
					},
					/* {
						name: '直播',
						url: '/pages/live/list',
						type: 'new'
					},
					{
						name: '广场',
						url: '/pages/plaza/index',
						type: 'new'
					},
					{
						name: '专题',
						url: '/pages/video/list',
						type: 'new'
					},
					{
						name: '图片',
						url: '/pages/image/list',
						type: 'new'
					} */
				],
				width: 20,
			}
		},
		props: {
			nowUrl: {
				type: String,
				default: '/pages/index/index'
			},
			webLogo: {
				type: String,
				default: ''
			},
		},
		created() {
			const menuList = uni.getStorageSync('head_menu_'+api.appkey);
			if (menuList) {
				this.menuList = menuList;
				if (this.menuList.length > 3) this.width = parseInt(100 / this.menuList.length);
				this.$emit('menuList', this.menuList);
			}
			//this.getTopMenu();
		},
		methods: {
			headTop(u, t) {
				if(u == this.nowUrl) return;
				api.jumpUrl(u, t);
			},
			getTopMenu() {
				var _self = this;
				uni.request({
					url: api.apiData.getTopMenu,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e)=> {
						var d = e.data;
						if(d.Code == 200) {
							_self.menuList = d.Data.list;
							//console.log(d.Data.list);
							_self.$emit('menuList', _self.menuList);
						}else{
							_self.error();
						}
					},
					fail: ()=> {
						_self.error();
					}
				});
			},
			error() {
				api.showToast("服务器连接失败，请检查网络是否正常", 3000);
				setTimeout(()=>{
					api.jumpUrl('/pages/index/init', 'new');
				}, 2000);
			}
		}
	}
</script>

<style>
	.common-logo{
		width: 50upx;
		height: 50upx;
	}
	.common-head-top-right{
		//background-color: rgb(0, 191, 255);
		float: right;
		padding: 0!important;
	}
	.menu-ico{
		width: 40upx;
		height: 40upx;
		margin-bottom: -8upx;
		margin-right: 2px;
	}
	.common-head-top{
		text-align: left;
		margin: 10upx 0 24upx;
		height: 50upx;
		line-height: 60upx;
		font-size: 30upx;
		border-bottom: 2px solid rgba(255,12,208,0.8);
		padding-bottom: 10upx;
	}
	.common-sel-top{
		border-radius: 10upx 10upx 0 0;
		//padding-bottom: 10upx;
		color: #FFFFFF!important;
		background-color: rgba(255,12,208,0.8);
	}
	.common-head-top view{
		display: inline-block;
		color: #666;
		text-align: center;
		font-weight: bold;
		//padding: 0 30upx;
		//border-bottom: 2px solid rgba(255,12,208,0.8);
	}
</style>
