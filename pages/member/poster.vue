<template>
	<view class="bg">
		<css-loading ref="cssLoading"></css-loading>
		<!-- <view class="content-head" :style="{ top: top + 'px' }" @click="skipUrl('/pages/member/member', 3)">
			<image src="/static/imgs/back.png" mode="aspectFill" style="width:20px;height:20px;margin:5px 0 0 -3px;"></image>
		</view> -->
		<view class="poster-bg" :style="{ height: bgHeight + 'px' }">
			<image class="poster" :style="{ height: bgHeight + 'px' }" :src="bg" mode="aspectFill"></image>
			<view class="showBtns">
				<view class="showBtns-list">
					<view class="showBtns-item">
						<button type="primary" @click="saveShareImg" size="medium">保存二维码</button>
					</view>
					<view class="showBtns-item">
						<button type="primary" @click="copyShareUrl" size="medium">复制链接</button>
					</view>
					<!--<view class="showBtns-item">
						<button type="primary" @click="shareLog" size="medium">我的团队</button>
					</view>
					-->
				</view>
			</view>
		</view>
		<view class="explain-tig" v-if="close">
			<view class="explain-content">
				<view class="explain-title">
					规则说明
					<image src="/static/imgs/delx.png" class="close" @click="closeTig"></image>
				</view>
				<view class="explain-center">
					<jyf-parser :html="rule" ref="article"></jyf-parser>
				</view>
			</view>
		</view>
		<uni-fab ref="menu" :content="menuList" horizontal="right" vertical="bottom" direction="horizontal"
			@trigger="trigger"></uni-fab>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	var _self;
	var wv; //计划创建的webview
	export default {
		data() {
			return {
				top: 27,
				explain: 47,
				bgHeight: 695,
				close: false,
				userId: 0,
				bg: '',
				rule: '规则说明',
				pName: '',
				btnBottom: 40,
				isApp: true,

				one: false,
				loading: true,
				loadHeight: 600,
				url: '',
				menuList: [{
					iconPath: '/static/member/exp.png',
					//selectedIconPath:	'选中后图片路径',
					text: '规则',
					method: 'closeTig'
				}, {
					iconPath: '/static/member/team.png',
					//selectedIconPath:	'选中后图片路径',
					text: '团队',
					method: 'shareLog'
				}, {
					iconPath: '/static/member/save.png',
					//selectedIconPath:	'选中后图片路径',
					text: '保存',
					method: 'saveShareImg'
				}],
			}
		},
		onLoad() {
			_self = this;
			_self._showLoading('加载中...');
			var mobile = uni.getSystemInfoSync();
			_self.top = mobile.safeArea.top + 7;
			_self.bgHeight = mobile.windowHeight;
			_self.loadHeight = _self.bgHeight;
			// #ifdef H5
			_self.btnBottom = 15;
			// #endif
			//_self.explain = _self.top+40;
			// 是否登录
			var info = api.getLogins();
			if (info == false) {
				_self.skipUrl();
			} else {
				_self.userId = info.userId;
				_self.getShare();
			}
		},
		onHide() {
			_self.one = true;
		},
		onShow() {
			if (_self.one) {
				var info = api.getLogins();
				if (info == false) {
					_self.skipUrl();
				} else {
					_self.userId = info.userId;
					_self.getShare();
				}
			}
		},
		methods: {
			trigger(e) {
				var funStr = '_self.' + e.item.method + '()'
				eval(funStr);
				_self.$nextTick(() => {
					_self.$refs['menu'].close()
				});
			},
			// 获取宣传规则信息
			getShare() {
				uni.request({
					url: api.apiData.myShare + '/userId/' + _self.userId,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var res = e.data.Data;
						//_self.pName = res.posterName;
						// 设置背景图片
						api.imgCache(res.poster, (img) => {
							_self.bg = img + '?token=' + api.randomWord(false, false, 10, 10);
							//console.log(_self.bg)
						});
						// 规则说明
						_self.rule = res.rule;
						//推广地址
						_self.url = res.url;
						setTimeout(() => {
							_self.loading = false;
							_self._hideLoading()
						}, 500)
					},
					fail: () => {
						// 加载失败提示
						api.showToast('服务器连接失败，请检查网络是否正常');
						uni.navigateBack();
					}
				});
			},
			// 团队
			shareLog() {
				api.jumpUrl('/pages/member/share_info', 'new');
			},
			// 规则说明
			closeTig() {
				_self.close = !_self.close;
			},
			copyShareUrl() {
				// #ifdef H5
				api.showToast('请用手机截图或面对面扫码', 2000);
				// #endif
				// #ifdef APP-PLUS
				uni.setClipboardData({
					data: _self.url,
					success: function() {
						api.showToast("分享链接已复制到剪贴板", 2000);
					}
				});
				// #endif
			},
			// 保存海报至相册
			saveShareImg() {
				// #ifdef H5
				api.showToast('请用手机截图或面对面扫码', 2000);
				// #endif
				// #ifdef APP-PLUS
				_self._showLoading('正在保存海报...');
				var bgName = api.splitUrl(_self.bg);
				// 是否已下载
				var imgUrl = uni.getStorageSync(bgName);
				if (imgUrl) {
					_self.savePoto(imgUrl);
				} else {
					if (_self.bg.indexOf("_doc/") != -1) {
						_self.savePoto(_self.bg);
					} else {
						// 下载背景图
						uni.downloadFile({
							url: _self.bg,
							success: (res) => {
								if (res.statusCode == 200) _self.savePoto(res.tempFilePath);
							}
						})
					}
				}
				// #endif
			},
			// 保存图片至相册
			savePoto(tempFilePath) {
				uni.saveImageToPhotosAlbum({
					filePath: tempFilePath,
					success: () => {
						api.showToast("海报已保存至手机相册", 2000);
					},
					fail: () => {
						api.showToast("保存失败，请检查APP是否有权限", 5000);
					}
				});
			},
			// 跳转页面
			skipUrl(url = '/pages/login/login', type = 1) {
				if (type == 1) {
					var type = 'old';
				} else if (type == 2) {
					var type = 'new';
				} else {
					var type = 'tab';
				}
				api.jumpUrl(url, type);
			}
		}
	}
</script>

<style>
	@import url('@/components/loading/loading.css');

	.explain-center {
		width: 96%;
		height: 270px;
		border-top: 1px solid #E5E5E5;
		//border-radius: 5px;
		overflow-y: scroll;
		padding: 2%;
		font-size: 13px;
		color: #666666;
		//box-shadow: 0px 4px 6px 0px rgba(103, 103, 103, 0.2);
	}

	.explain-title {
		width: 100%;
		height: 50px;
		line-height: 50px;
		font-size: 18px;
		text-align: left;
		color: #666666;
		font-weight: bold;
	}

	.close {
		width: 30px;
		height: 30px;
		float: right;
		margin: 5px -3% 0 0;
	}

	.explain-content {
		padding: 0 5%;
		width: 70%;
		height: 350px;
		border-radius: 10px;
		background: #FFFFFF;
		margin-top: 35%;
		margin-left: 10%;
	}

	.explain-tig {
		position: fixed;
		z-index: 98;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		top: 0;
	}

	.explain {
		position: absolute;
		width: 50px;
		height: 30px;
		line-height: 30px;
		background: #2C405A;
		right: 13px;
		color: #FFFFFF;
		text-align: center;
		border-radius: 3px;
		font-size: 15px;
	}

	.p-left {
		left: 30px;
	}

	.p-right {
		right: 30px;
	}

	.poster-save {
		width: 270upx;
		height: 85upx;
		line-height: 85upx;
		text-align: center;
		border-radius: 10px;
		position: absolute;
		bottom: 60upx;
		color: #FFFFFF;
		font-size: 35upx;
		box-shadow: 0px 4px 6px 0px rgba(103, 103, 103, 0.2);
		background-image: linear-gradient(to right, rgba(255, 12, 208, 0.7), rgba(254, 67, 101, 0.7));
	}

	.content-head {
		position: fixed;
		width: 30px;
		height: 30px;
		line-height: 30px;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.5);
		top: 27px;
		left: 10px;
		text-align: center;
		font-size: 15px;
		color: #cccccc;
		z-index: 10;
		font-weight: bold;
	}

	.poster {
		width: 100%;
		padding: 0;
		margin: 0;
		position: fixed;
		top: 0;
	}

	.poster-bg {
		background: #FFFFFF;
		position: relative;
	}

	.showBtns {
		position: absolute;
		width: 90%;
		left: 5%;
		bottom: 150px;
	}

	.showBtns .showBtns-list {
		width: 100%;
		display: flex;
	}

	.showBtns .showBtns-item {
		flex: 1;
		box-sizing: border-box;
		padding: 0 5px !important;
	}

	/deep/.showBtns button[size="medium"] {
		width: 80%;
		font-size: 30upx;
		background-image: linear-gradient(135deg, #79F1A4 10%, #0E5CAD 100%);
		border-radius: 50px;
		padding: 0 !important;
		padding: 0 !important;
	}
</style>
