<template>
	<view class="content">
		<view class="head-top" :style="{'padding-top':top+'px'}">
			<view class="top-one" style="width:93%;">
				<top-menu :nowUrl="'/pages/app/list'"></top-menu>
			</view>
			<view class="top-two">
				<view @click="setTabId(1)">
					<text :class="tabId==1?'sel':''">我的</text>
				</view>
				<view @click="setTabId(2)">
					<text :class="tabId==2?'sel':''">最新</text>
				</view>
				<view @click="setTabId(3)">
					<text :class="tabId==3?'sel':''">热门</text>
					<image src="/static/plaza/hot.png" mode="aspectFill"></image>
				</view>
				<!-- <view class="right" style="padding-right:35upx;height:55upx;" @click="goSend">
					<image class="send-content" src="@/static/plaza/send.png" mode="aspectFill"></image>
				</view> -->
			</view>
		</view>
		<view class="center-content">
			<web-view :src="getUrl" :webview-styles="webviewStyles" :style="{'margin-top':contentTop+'px'}"></web-view>
		</view>
		<css-loading ref="cssLoading"></css-loading>
	</view>
</template>
<script>
import api from "@/common/api.js";
import utils from '@/components/shoyu-date/utils.filter.js';
var _self, wv;
export default {
	data() {
		return {
			isLogin: false,
			userId: 0,
			top: 0,
			phone: {},
			contentTop: 35,
			one: false,
			tabId: 2,
			loadingHieght: 100,
			
			getUrl: '',
			webviewStyles: {
				progress: {
					color: '#009688'
				}
			},
		}
	},
	onLoad(e) {
		_self = this;
		_self._showLoading('加载中,请稍后...');
		_self.isLogin = api.getLogins();
		if(_self.isLogin) _self.userId = _self.isLogin.userId;
		_self.phone = uni.getSystemInfoSync();
		_self.top = _self.phone.statusBarHeight;
		//console.log(_self.phone)
		// #ifdef H5
		_self.top = 5;
		// #endif
		_self.contentTop = _self.top + 80;
		_self.loadingHieght = _self.phone.windowHeight - (_self.top + 73);
		_self.setWebUrl();
	},
	onReady() {
	    // #ifdef APP-PLUS
		// 获取当前页面的webview对象
	    var currentWebview = this.$mp.page.$getAppWebview();
		// 如果是页面初始化调用时，需要延时一下
	    setTimeout(function() {
	        wv = currentWebview.children()[0];
	        wv.setStyle({ 
				top: _self.contentTop,
				left: 0
			});
			_self._hideLoading();
	    }, 1000);
	    // #endif
		// #ifdef H5
		_self._hideLoading();
		// #endif
	},
	methods: {
		setTabId(t) {
			if(t == 1){
				if(!_self.isLogin) {
					api.showToast('请先登录');
					setTimeout(()=>{
						_self.skipUrl('/pages/login/login', 'new');
					}, 500);
					return;
				}
			}
			_self.tabId = t;
			_self.setWebUrl(t);
		},
		setWebUrl(o = 2) {
			_self.getUrl = api.apiData.h5ImgagesUrl +'/uid/'+ _self.userId +'/order/'+ o;
			//console.log(_self.contentTop)
		},
		goSend() {
			if(!_self.isLogin) {
				api.showToast('请先登录再发布');
				setTimeout(()=>{
					_self.skipUrl('/pages/login/login', 'new');
				}, 500);
			}else{
				_self.getUrl = api.apiData.h5PutImgages;
			}
		},
		// 跳转登录
		skipUrl(uri = '/pages/login/login', type = 'new') {
			api.jumpUrl(uri, type)
		}
	}
};
</script>

<style>
	.send-content{
		width: 55upx!important;
		height: 55upx!important;
	}
	.center-content{
		margin-bottom: 60upx;
	}
	.head-top .top-two image{
		width: 72upx;
		height: 30upx;
		margin-left: 10upx;
	}
	.head-top .top-two .sel{
		border-bottom: 3px solid rgba(255,12,208,0.8);
		color: #000000;
		//font-weight: bold;
	}
	.head-top .top-two view{
		display: inline-block;
		text-align: center;
		color: #777777;
		font-size: 30upx;
		border-bottom: 3px solid #FFFFFF;
		margin-right: 40upx;
		//font-weight: bold;
	}
	.head-top{
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9;
		width: 100%;
		padding: 0 40upx 15upx;
		//height: 35px;
		background-color: #FFFFFF;
		box-shadow: 4px 4px 6px 0px rgba(103, 103, 103, 0.1);
	}
	.content{
		width: 100%;
	}
	.left{
		float: left;
	}
	.right{
		float: right;
	}
	page{
		background-color: #F5F5F5;
	}
</style>
