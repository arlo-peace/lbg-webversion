<template>
	<view>
		<web-view @message="onMessage" :src="getUrl" :webview-styles="webviewStyles"></web-view>
		<css-loading ref="cssLoading"></css-loading>
	</view>
</template>
<script>
	import api from "@/common/api.js";
	var _self;
	var wv;
	var tt;
	export default {
		data() {
			return {
				getUrl: '',
				webviewStyles: {
					progress: {
						color: '#009688'
					}
				},
				title: '',
				phone: {},
				type: 0, //1上传
				isLogin: false,
				area: {},
				loadText: '',
				loading: false
			}
		},
		onLoad(e) {
			_self = this;
			_self._showLoading('加载中...')
			_self.type = e.t;
			_self.phone = uni.getSystemInfoSync();
			_self.isLogin = api.getLogins();
			if (_self.isLogin == false) api.jumpUrl('/pages/login/login', 'new');
			if (_self.type == 1) {
				uni.setNavigationBarTitle({
					title: '上传作品'
				});
				var sfot_type = 1;
				// type 1 APP 2web
				// #ifdef H5
				sfot_type = 2;
				// #endif
				_self.getUrl = e.u + '/type/' + sfot_type + '/uid/' + _self.isLogin.userId;
				//console.log(_self.getUrl)
			} else {
				_self.getUrl = e.u;
				if (typeof e.title == 'string') {
					_self.title = e.title
					uni.setNavigationBarTitle({
						title: e.title
					});
					tt = setInterval(() => {
						uni.setNavigationBarTitle({
							title: e.title
						});
					}, 500)
				}
			}
			//console.log(_self.phone)
			let timer = setTimeout(() => {
				_self._hideLoading()
				clearTimeout(timer);
			}, 2000);
		},
		onUnload() {
			if (tt) {
				clearInterval(tt)
			}
		},
		onReady() {
			// #ifdef APP-PLUS
			// 获取当前页面的webview对象
			var currentWebview = this.$mp.page.$getAppWebview();
			// 如果是页面初始化调用时，需要延时一下
			setTimeout(() => {
				wv = currentWebview.children()[0];
				wv.setStyle({
					top: _self.phone.statusBarHeight,
					left: 0
				});
			}, 2000);
			// #endif
		},
		onBackPress(e) {
			if (tt) {
				clearInterval(tt)
			}
			if (_self.type == 1) {
				api.jumpUrl('/pages/member/member', 'tab');
				return true;
			}
		},
		methods: {
			onMessage(event) {
				console.log(event)
			}
		}
	};
</script>

<style>

</style>