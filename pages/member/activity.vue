<template>
	<view>
        <web-view :src="getUrl" :webview-styles="webviewStyles"></web-view>
		<css-loading ref="cssLoading"></css-loading>
    </view>
</template>
<script>
import api from "@/common/api.js";
var _self;
var wv;//计划创建的webview
export default {
	data() {
		return {
			getUrl: '',
			userId: 0,
			webviewStyles: {
				progress: {
					color: '#009688'
				}
			},
		}
	},
	onLoad(e) {
		_self = this;
		_self._showLoading('加载中...')
		// 是否登录
		var info = api.getLogins();
		_self.userId = info.userId;
		var mobile = uni.getSystemInfoSync();
		var top = 0;
		// 适配流海屏
		//if(plus.navigator.hasNotchInScreen()){
			// 只适配安卓
			//if(mobile.platform=='android') top = mobile.statusBarHeight;
			//console.log(mobile)
		//}
		if(mobile.platform=='android') top = mobile.statusBarHeight;
		//console.log(top);
		switch(e.type) {
			case 'agreement':
				var url = api.apiData.agreement+'/top/'+top+'/sys/'+mobile.platform;
				break;
			case 'privacy':
				var url = api.apiData.privacy+'/top/'+top+'/sys/'+mobile.platform;
				break;
			case 'act':
			    var url = api.apiData.activity+'/userId/'+_self.userId;
			    break;
		    default:
		        var url = e.type+'&userId='+_self.userId;
				//console.log(e.type)
		} 
		_self.getUrl = url;
		setTimeout(()=>{
			_self._hideLoading();
		}, 800);
	},
    onReady() {
        // #ifdef APP-PLUS
		// 获取当前页面的webview对象
        var currentWebview = this.$mp.page.$getAppWebview();
		// 如果是页面初始化调用时，需要延时一下
        setTimeout(function() {
            wv = currentWebview.children()[0];
            wv.setStyle({ 
				top: 0,
				left: 0
			});
        }, 1000);
        // #endif
    },
};
</script>

<style>

</style>
