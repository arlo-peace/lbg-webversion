<template>

	<view class="content">
		<css-loading ref="cssLoading"></css-loading>
		<view class="center-content">
			<view class="content-item-top">
				<view class="item-left" @click="selectFile(1)">
					<image :src="itemLeft" mode="aspectFill"></image>
				</view>
				<view class="item-right" @click="selectFile(2)">
					<image :src="itemRight" mode="aspectFill"></image>
				</view>
			</view>
			<view class="content-item">
				<view class="item-line">
					<image class="ico left" src="@/static/upload/title.png" mode="aspectFill"></image>
					<input type="text" id="title" @input="setInput" maxlength="30" placeholder="视频标题,最多30个文字" />
				</view>
				<view style="height:40upx;"></view>
				<view class="item-line">
					<image class="ico left" src="@/static/upload/class.png" mode="aspectFill"></image>
					<view class="class-list">
						<view @click="uploadParam.type = 0" class="class-item" :class="{sel:uploadParam.type == 0}">长视频
						</view>
						<view @click="uploadParam.type = 1" class="class-item" :class="{sel:uploadParam.type == 1}">短视频
						</view>
					</view>
				</view>
				<view style="height:20upx;"></view>
				<template v-if="uploadParam.type == 0">
					<view class="item-line" v-if="classList.length">
						<image class="ico left" src="@/static/upload/class.png" mode="aspectFill"></image>
						<scroll-view scroll-x="true" :show-scrollbar="false" class="class-list">
							<view :class="uploadParam.cid==c.id?'class-item sel':'class-item'"
								v-for="(c, i) in classList" :key="i" @click="setCid(c.id)">{{c.name}}</view>
						</scroll-view>
					</view>
					<view style="height:20upx;" v-if="classList.length"></view>
				</template>
				<template v-else>
					<view class="item-line" v-if="subClassList.length">
						<image class="ico left" src="@/static/upload/class.png" mode="aspectFill"></image>
						<scroll-view scroll-x="true" :show-scrollbar="false" class="class-list">
							<view :class="uploadParam.cid==c.id?'class-item sel':'class-item'"
								v-for="(c, i) in subClassList" :key="i" @click="setCid(c.id)">{{c.name}}</view>
						</scroll-view>
					</view>
					<view style="height:20upx;" v-if="subClassList.length"></view>
				</template>
				<view class="item-line">
					<image class="ico left" src="@/static/upload/gold.png" mode="aspectFill"></image>
					<input type="number" id="gold" @input="setInput" maxlength="10" placeholder="金币数,留空或0则免费" />
				</view>
				<view style="height:40upx;"></view>
				<view class="item-line">
					<textarea id="content" @input="setInput" placeholder="视频简介,最多50个字" maxlength="50" />
				</view>
				<view style="height:20upx;"></view>
				<view class="item-line">
					<text class="btn is-uploading" v-if="isUploading">已上传 {{progress}}%</text>
					<text class="btn" v-else @click="uploadSever">提 交</text>
				</view>
			</view>
			<view style="height:20upx;"></view>
			<view class="content-item" v-if="uploadType==1">
				<view class="title">上传规则</view>
				<jyf-parser style="font-size:26upx;color:#666666;" :html="content" ref="article"></jyf-parser>
			</view>
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
				h5Top: 0,

				itemLeft: '../../static/upload/video.png',
				itemRight: '../../static/upload/img.png',

				setClass: {
					id: 0,
					name: ''
				},
				content: '',
				uploadType: 1,
				maxVideoSize: 0,

				uploadParam: {
					title: '',
					gold: 0,
					content: '',
					cid: 0,
					type: 0
				},
				files: ['', ''],
				progress: 0,
				isUploading: false,
				classList: [],
				subClassList: []
			}
		},
		onLoad(e) {
			_self = this;
			_self._showLoading()
			_self.type = e.t;
			_self.isLogin = api.getLogins();
			if (_self.isLogin) _self.userId = _self.isLogin.userId;
			_self.phone = uni.getSystemInfoSync();
			// #ifdef H5
			_self.h5Top = 90;
			// #endif
			//console.log(e.t)
			_self.initData();
		},
		methods: {
			setCid(e) {
				_self.uploadParam.cid = e;
			},
			setInput(e) {
				var value = e.detail.value;
				_self.uploadParam[e.target.id] = value;
			},
			selectFile(t) {
				if (t == 1) {
					uni.chooseVideo({
						count: 1,
						sourceType: ['album', 'camera'],
						success: res => {
							var file = res.tempFilePath;
							//console.log(file);
							if (_self.maxVideoSize > 0) {
								var size = api.getFileSize(res.size);
								if (size > _self.maxVideoSize) return api.showToast('视频大小不得超过' + _self
									.maxVideoSize + 'M', 2000);
							}
							_self.files[1] = file;
							_self.itemLeft = '../../static/upload/video_ok.png';
						},
						fail: () => {
							api.showToast('已取消选择视频');
							_self.files[1] = '';
							_self.itemLeft = '../../static/upload/video.png';
						}
					})
				} else {
					uni.chooseImage({
						count: 1,
						sizeType: ['compressed'],
						success: res => {
							var file = res.tempFilePaths[0]
							//console.log(file);
							_self.files[0] = file;
							_self.itemRight = '../../static/upload/img_ok.png';
						},
						fail: () => {
							api.showToast('已取消选择视频封面');
							_self.files[0] = '';
							_self.itemRight = '../../static/upload/img.png';
						}
					});
				}
			},
			uploadSever() {
				if (!_self.isLogin) return api.showToast('请先登录', 1500);
				if (_self.files[1].length == 0) return api.showToast('请选择需要上传的视频', 1500);
				if (_self.files[0].length == 0) return api.showToast('请选择视频封面', 1500);
				if (_self.uploadParam.title.length == 0) return api.showToast('请输入视频标题', 1500);
				if (_self.classList.length && _self.uploadParam.cid == 0) return api.showToast('请选择视频分类', 1500);
				if (_self.uploadParam.gold.length == 0) _self.uploadParam.gold = 0;
				let arrList = _self.files.map((value, index) => {
					return {
						name: "all[" + index + "]",
						uri: value
					}
				});
				_self._showLoading('上传中,请稍后...');
				_self.isUploading = true;
				var uper = uni.uploadFile({
					// 需要上传的地址
					url: api.apiData.uploadImg,
					files: arrList,
					formData: {
						userId: _self.userId,
						gold: _self.uploadParam.gold,
						title: _self.uploadParam.title,
						info: _self.uploadParam.content,
						cid: _self.uploadParam.cid,
						uploadType: 2,
						isData: 1,
						type: _self.uploadParam.type
					},
					success: e => {
						var r = eval("(" + e.data + ")");
						api.showToast(r.Msg, 1500);
						_self.isUploading = false;
						if (r.Code == 200) {
							let timer = setTimeout(() => {
								_self.skipUrl('/pages/member/member', 'tab');
								clearTimeout(timer);
							}, 1200);
						}
						//console.log(r);
					},
					fail: e => {
						_self.isUploading = false;
						api.showToast("服务器繁忙，请稍后再试", 2000);
					},
					complete: () => {
						_self._hideLoading();
					}
				});
				// 上传对象更新的方法
				uper.onProgressUpdate(res => {
					var progress = res.progress;
					_self.progress = progress;
				});
			},
			initData() {
				uni.request({
					url: api.apiData.uploadConfig,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var r = e.data;
						//console.log(r)
						if (r.Code == 201) return api.showToast(r.Msg, 2000);
						_self.content = r.Data.explain;
						_self.classList = r.Data.classList;
						_self.subClassList = r.Data.subClassList;
						//console.log(_self.content)
						_self.uploadType = r.Data.type; // 1WEB服务器2云转码
						//_self.uploadType = 1; // 1WEB服务器2云转码
						_self.maxVideoSize = r.Data.maxVideoSize;
						if (r.Data.uploadSwitch == 0) {
							api.showToast('上传功能已暂停使用', 2000);
							let timer = setTimeout(() => {
								api.jumpUrl('/pages/member/member', 'tab');
								clearTimeout(timer);
							}, 1500);
							return;
						}
						// 云转码 +++
						if (_self.uploadType == 2 && r.Data.uploadUrl != '') {
							var isMember = false;
							uni.getStorage({
								key: 'upload_' + api.appkey,
								success: (res) => {
									isMember = res.data;
								},
								complete: () => {
									//console.log(isMember)
									if (isMember) {
										api.jumpUrl('/pages/member/member', 'tab');
									} else {
										uni.setStorage({
											key: 'upload_' + api.appkey,
											data: true,
											success: () => {
												api.jumpUrl(
													'/pages/jump/index?t=1&u=' + r
													.Data.uploadUrl, 'new');
											}
										});
									}
								}
							});
						} else {
							let timer = setTimeout(() => {
								_self.loading = false;
								_self._hideLoading()
								clearTimeout(timer);
							}, 300);
						}
					},
					fail: () => {
						api.showToast('连接失败，请检查网络是否正常');
						let timer = setTimeout(() => {
							api.jumpUrl('/pages/member/member', 'tab');
							clearTimeout(timer);
						}, 300);
					},
				});
			},
			// 跳转登录
			skipUrl(uri = '/pages/login/login', type = 'new') {
				api.jumpUrl(uri, type);
			},
		},
		onBackPress(e) {
			/* if(_self.type == 1){
				api.jumpUrl('/pages/plaza/index', 'tab');
				return true;
			} */
		},
	};
</script>

<style>
	@import url('@/components/loading/loading.css');

	.sel {
		background-color: #FF8F00 !important;
		color: #FFFFFF !important;
	}

	.class-item {
		display: inline-block;
		margin-left: 1%;
		width: 120upx;
		font-size: 12px;
		text-align: center;
		height: 50upx;
		line-height: 50upx;
		padding: 0 10upx;
		border-radius: 10upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		border: 1px solid #444;
		color: #999;
	}

	.class-list {
		white-space: nowrap;
		width: 91%;
		display: inline-block;
		//background-color: #007AFF;
	}

	.content-item .title {
		font-size: 30upx;
		margin-bottom: 10upx;
		color: #CCCCCC;
	}

	.is-uploading {
		color: #D89720 !important;
		background-image: linear-gradient(to right, #cccccc, #cccccc) !important;
	}

	.content-item .item-line .btn {
		display: block;
		height: 80upx;
		line-height: 80upx;
		font-size: 30upx;
		color: #FFFFFF;
		text-align: center;
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		border-radius: 15upx;
	}

	.content-item .item-line textarea {
		height: 150upx;
		border: 1px solid #444;
		border-radius: 15upx;
		width: 92%;
		padding: 15upx 4%;
		font-size: 28upx;
	}

	.content-item .item-line input {
		margin-left: 10%;
		border-bottom: 1px solid #444;
		font-size: 30upx;
		padding-bottom: 10upx;
	}

	.content-item .item-line {
		color: #FFFFFF;
	}

	.content-item .ico {
		width: 56upx;
		height: 56upx;
	}

	.content-item-top image {
		width: 150upx;
		height: 150upx;
		margin-top: 25upx;
	}

	.item-right,
	.item-left {
		display: inline-block;
		width: 47%;
		height: 200upx;
		border: 1px dashed #CCCCCC;
		border-radius: 15upx;
		text-align: center;
	}

	.item-right {
		margin-left: 4%;
	}

	.content-item-top {
		margin: 35upx 4% 30upx;
	}

	.content-item {
		margin: 0 4%;
		border-radius: 15upx;
		background-color: rgba(255, 255, 255, 0.06);
		padding: 30upx;
	}

	.left {
		float: left;
	}

	.right {
		float: right;
	}
</style>