<template>
	<view class="upload-box">
		<view class="input-box">
			<view class="icon">
				<image src="../../static/homePage/msg.png" mode=""></image>
			</view>
			<input class="input-box-input" v-model="content" type="text" placeholder="申请备注" />
		</view>
		<view class="btn">
			<text @click="submit">提交申请</text>
		</view>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	import utils from '@/components/shoyu-date/utils.filter.js';
	var _self;
	export default {
		data() {
			return {
				isLogin: false,
				isSuccess: false,
				userId: 0,
				content: ''
			}
		},
		onLoad() {
			_self = this;
			_self.isLogin = api.getLogins();
			if (_self.isLogin) _self.userId = _self.isLogin.userId;
			_self.initData();
		},
		methods: {
			submit() {
				if (_self.isSuccess) {
					uni.request({
						url: api.apiData.goApply,
						method: 'POST',
						data: {
							uid: _self.userId,
							content: _self.content
						},
						header: {
							'Content-type': 'application/x-www-form-urlencoded'
						},
						success: (e) => {
							var r = e.data;
							if (r.Code == 201) {
								api.showToast(r.Msg, 2000);
								return
							}
							api.showToast(r.Msg, 2000);
							_self.isSuccess = false
							setTimeout(() => {
								uni.navigateBack()
							}, 2500)
						},
						fail: () => {
							api.showToast("服务器连接失败，请检查网络是否正常", 3000);
						}
					});
				}
			},
			initData() {

				uni.request({
					url: api.apiData.getApply,
					method: 'POST',
					data: {
						uid: _self.userId
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var r = e.data;
						if (r.Code == 201) {
							api.showToast(r.Msg, 2000);
							setTimeout(() => {
								uni.navigateBack()
							}, 2500)
							return
						}
						_self.isSuccess = true
					},
					fail: () => {
						api.showToast("服务器连接失败，请检查网络是否正常", 3000);
					}
				});
			}
		}
	}
</script>

<style>
	.upload-box {
		padding: 30upx 100upx;
		display: flex;
		flex-direction: column;
	}

	.input-box {
		width: 90%;
		height: 80upx;
		background-color: white;
		border-radius: 10upx;
		margin: 30upx auto;
		padding: 10upx 20upx;
		display: flex;
		flex-direction: row;
	}

	.icon {
		width: 102upx;
		height: 80upx;
		margin-right: 20upx;
	}

	.icon image {
		width: 102upx;
		height: 80upx;
	}

	.input-box-input {
		flex: 1;
		height: 80upx;
		line-height: 80upx;
		font-size: 30upx;
	}

	.btn {
		width: 90%;
		height: 80upx;
		line-height: 80upx;
		text-align: center;
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		margin: 30upx auto;
		font-size: 30upx;
		color: #FFFFFF;
	}
</style>