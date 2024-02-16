<template>
	<view>
		<css-loading ref="cssLoading"></css-loading>
		<view style="text-align:center;padding-top:100upx;" v-if="isCheck">
			<image src="/static/live/check.png" mode="aspectFill" style="width:200upx;height:200upx;"></image>
			<view style="font-size:28upx;color:#777;">{{text}}</view>
		</view>
		<view class="reg-anchor" v-else>
			<!-- <view class="anchor-item">
				<image src="/static/live/nikcname.png" class="ico left"></image>
				<input type="text" placeholder="主播昵称" @input="setParam" id="nikcname"/>
			</view> -->
			<view class="anchor-item">
				<image src="/static/live/test.png" class="ico left"></image>
				<input type="text" placeholder="申请备注" @input="setParam" id="regDesc" />
			</view>
			<view class="n-btn" v-if="!isBtn" @click="regAnchor">提交申请</view>
			<view class="y-btn" v-else>提交中...</view>
		</view>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	var _self;
	export default {
		data() {
			return {
				loading: true,
				isLogin: false,
				userId: 0,
				phone: {},
				loadingHieght: 100,

				isCheck: false,
				text: '提交成功，1至3个工作日审核完成',
				isBtn: false,

				param: {
					nikcname: '',
					regDesc: ''
				}
			}
		},
		onLoad(e) {
			_self = this;
			_self._showLoading()
			_self.isLogin = api.getLogins();
			if (_self.isLogin) _self.userId = _self.isLogin.userId;
			_self.phone = uni.getSystemInfoSync();
			_self.loadingHieght = _self.phone.windowHeight + 20;

			_self.getData();
		},
		methods: {
			setParam(e) {
				//console.log(e)
				_self.param[e.target.id] = e.detail.value;
			},
			regAnchor() {
				/* if(_self.param.nikcname.length==0){
					api.showToast('请填写主播昵称', 1500);
					return
				} */
				if (_self.param.regDesc.length == 0) {
					api.showToast('请填写申请备注', 1500);
					return
				}
				_self._showLoading('提交中...');
				uni.request({
					url: api.apiData.regAnchor,
					method: 'POST',
					data: {
						userId: _self.userId,
						nikcname: _self.param.nikcname,
						regDesc: _self.param.regDesc
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var r = e.data;
						api.showToast(r.Msg, 2000);
						if (r.Code == 200) {
							_self.isCheck = true;
						} else {
							api.jumpUrl('back');
						}
					},
					fail: () => {
						// 加载失败提示
						api.showToast("服务器连接失败，请检查网络是否正常", 3000);
					},
					complete: () => {
						setTimeout(() => {
							_self._hideLoading();
						}, 500);
					}
				});
			},
			getData() {
				uni.request({
					url: api.apiData.getUserAnchor,
					method: 'POST',
					data: {
						userId: _self.userId
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						//console.log(e)
						var r = e.data;
						if (r.Code == 200) {
							_self.isCheck = r.Data.isCheck;
							_self.text = r.Data.text;
						}
					},
					fail: () => {
						// 加载失败提示
						api.showToast("服务器连接失败，请检查网络是否正常", 3000);
					},
					complete: () => {
						setTimeout(() => {
							_self.loading = false;
							_self._hideLoading()
						}, 500);
					}
				});
			},
			// 跳转登录
			skipUrl(uri = '/pages/login/login', type = 'new') {
				api.jumpUrl(uri, type)
			},
		},
	};
</script>

<style>
	@import url('@/components/loading/loading.css');

	.y-btn {
		display: block;
		background-color: #CCCCCC;
		height: 100upx;
		line-height: 100upx;
		border-radius: 10upx;
		text-align: center;
		color: #888;
		font-size: 30upx;
	}

	.n-btn {
		display: block;
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		height: 100upx;
		line-height: 100upx;
		border-radius: 10upx;
		text-align: center;
		color: #FFFFFF;
		font-size: 30upx;
	}

	.anchor-item input {
		//background-color: #009688;
		height: 100upx;
		font-size: 28upx;
	}

	.anchor-item .ico {
		width: 40upx;
		height: 40upx;
		margin-top: 30upx;
		margin-right: 25upx;
	}

	.anchor-item {
		height: 100upx;
		line-height: 100upx;
		background-color: #F8F8F8;
		padding: 0 15upx;
		border-radius: 15upx;
		color: #666;
		margin-bottom: 30upx;
	}

	.reg-anchor {
		//background-color: #007AFF;
		padding: 20upx 4%;
		margin-top: 20upx;
	}

	.left {
		float: left;
	}

	.right {
		float: right;
	}
</style>
