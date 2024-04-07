<template>
	<view class="encylop">
		<css-loading ref="cssLoading"></css-loading>
		<view class="flex-container">
			<view :style="{'margin-top': notbar+'px'}">
				<view class="topBar">
					<image src="@/static/loading/loading_circle.png" mode="aspectFill" style="width: 35px; height: 35px;margin-left: -16px;"></image>
					<view class="topBar-search">
						<view class="head-search" @click="api.jumpUrl('/pages/video/search', 'new')">
							<image style="width:15px;height:15px;" src="/static/imgs/search.png"></image>
							<text style="font-size:12px;margin-left:5px;color:#777;">输入关键字</text>
						</view>
					</view>
				</view>
				<view class="tabbar">
					<view class="tabbar-main">
						<text
							class="tabbar-item" 
							:class="active==cat.id?'tabbar-item-active':''" 
							@click="handleTabClick(cat.id)"
							v-for="(cat, idx) of categories"
							:key="idx"
						>{{ cat.name }}</text>
					</view>
				</view>
			</view>
			<scroll-view 
				class="smain"
				scroll-y="true"
				:refresher-enabled="true"
				:enable-back-to-top="true"
				:scroll-with-animation="true"
				:refresher-threshold="threshold"
				refresher-background="transparant"
				@refresherrefresh="handleRefresh"
				@scrolltolower="handleLoadmore"
			>
				<view v-if="dataList.length > 0" v-for="(item, index) in dataList" :key="index">
					<template v-if="active==1">
						<vcard v-if="item.bgl" :item="item" />
						<vcardSmall v-if="!item.bgl" :item="item"/>
					</template>
					<template v-else>
						<vcard :item="item" />
					</template>
					<view class="divider"></view>
				</view>
				<view class="empty" v-if="dataList.length <= 0">
					<text>没有数据。</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	import vcard from "@/components/vcard/vcard.vue";
	import vcardSmall from "@/components/vcard/vcardSmall.vue";
	import NavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	
	export default {
		components:{
			vcard,
			vcardSmall,
			NavBar
		},
		data() {
			return {
				api: api,
				active: 1,
				notbar: null,
				threshold: 40,
				windowWidth: 200,
				pages: 1,
				dataList: [],
				categories: [],
				nodata: false,
				userId: 0
			}
		},
		onInit() {
		},
		onLoad() {
			let login = api.getLogins();
			if (login) this.userId = login.userId;
			var sys = uni.getSystemInfoSync()
			this.notbar = sys.statusBarHeight;
			this.windowWidth = sys.screenWidth
			this._showLoading('加载中...');
			this.getCategory()
			this.onDataLoad();
		},
		methods: {
			handleTabClick(e){
				if(this.active == e){
					return;
				}
				this._showLoading('加载中...');
				this.active = e;
				this.pages = 1;
				this.onDataLoad();
			},
			handleRefresh(e){
				this.pages = 1;
				this.onDataLoad();
			},
			getCategory(){
				const _self = this;
				uni.request({
					method: "GET",
					url: api.apiData.encCate,
					data: {},
					success(d) {
						const data = d.data
						if(data.Code == 200){
							_self.categories = data.Data
						} else {
							uni.showToast({
								icon: 'error',
								title: d.data.Msg,
							})
						}
					},
					complete() {
						_self._hideLoading()
					}
				})
			},
			handleLoadmore(e){
				if(!this.nodata) {
					this.pages = this.pages + 1;
					this.onDataLoad()
				}
			},
			onDataLoad(){
				const page = this.pages;
				const _self = this
				this.threshold = 40
				uni.request({
					method: "GET",
					url: api.apiData.encyclopedias,
					data: {
						page: page,
						cat: this.active,
						uid: this.userId
					},
					success(e) {
						if(e.data.Code == 200){
							const datad = e.data.Data.list
							if(_self.pages == 1){
								_self.dataList = datad
							} else if(_self.pages > 1) {
								_self.dataList = _self.dataList.concat(datad)
							}
							if(datad.length <= 0){
								_self.nodata = true
							}
						} else {
							uni.showToast({
								icon: 'error',
								title: e.data.Msg,
							})
						}
					},
					complete() {
						_self._hideLoading()
						uni.stopPullDownRefresh()
						setTimeout(function() {
							_self.threshold = 0
						}, 300);
					},
					fail(e) {
						console.log(e)
					}
				})
			}
		}
	}
</script>

<style scoped>
uni-page-wrapper{
	overflow: hidden;
}
.encylop{
	flex: 1;
	flex-direction: column;
	display: flex;
	overflow: hidden;
}
.flex-container{
	display: flex;
	height: 100%;
	flex-direction: column;
}
.topBar{
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 10px 16px;
}
.topBar-search{
	flex: 1;
}
.head-search {
	display: flex;
	flex-direction: row;
	background-color: #31313C;
	border-radius: 34px;
	height: 34px;
	line-height: 34px;
	align-items: center;
	padding: 0 10px;
	flex: 1;
}
.tabbar{
	padding: 0 16px;
	flex: 1;
}
.tabbar-main{
	position: relative;
	display: flex;
	flex: 1;
	justify-content: space-between;
}
.tabbar-item{
	flex: 1 0 auto;
	padding: 0 12px;
	color: #fff;
	font-size: 17px;
	text-align: center;
	border-bottom: 2px solid;
	border-color: transparent;
	padding-bottom: 6px;
}
.tabbar-item-active{
	color: #ff9000;
	font-weight: 600;
	border-color: #ff9000;
}
.smain{
	padding: 0px 16px;
	width: initial;
	height: calc(100vh - 150px);
}
.divider{
	border-top:1px solid #31313C;
}
.empty{
	display: flex;
	height: calc(100vh - 200px);
	justify-content: center;
	align-items: center;
	color: #9c9c9c;
	font-size: 20px;
}
</style>
