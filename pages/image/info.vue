<template>
	<view class="content">
		<css-loading ref="cssLoading"></css-loading>
		<view class="info-head">
			<view class="info-title">{{info.title}}</view>
			<view class="info-title-bottom">
				<text>点击量：{{info.watch}}</text>
				<view style="display:inline-block;margin-left:10upx;">
					<text v-if="info.gold > 0">[{{info.gold}} 金币]</text>
					<text v-else>[免费]</text>
					<text style="color:#009688;" v-if="info.gold > 0 && info.isBuy">[已购买]</text>
				</view>
				<text class="right">发布：{{info.date}}</text>
			</view>
		</view>
		<view class="info-content">

			<view class="head-banner">
				<swiper class="swiper" :style="{ height: swiperheight + 'px' }" circular interval="2000"
					:autoplay="true" :indicator-dots="true" indicator-color="rgba(255,255,255,0.4)"
					indicator-active-color="rgba(255,255,255,0.8)">
					<swiper-item class="img-item" v-for="(p, i) in info.list" :key="i" @click="bigImg(p)">
						<image :src="p" mode="aspectFill"></image>
					</swiper-item>
				</swiper>


			</view>

			<view class="image-info">
				<block v-if="userInfo.isVip">
					<view class="bottom-content-title">基本信息</view>
					<view class="bottom-content-line" v-if="info.download">
						<image class="left-img left" src="@/static/image/vip-link2.png"></image>
						<text>联系方式:</text>
						<text @click="openLink(info.link)" id="click-link" > {{info.txt}} </text>
					</view>
				</block>
				<block v-else>
					<view class="only_vip" @click="openVip">
						<image src="/static/image/vip-link.png" mode="aspectFill"></image>
					</view>
					<view class="bottom-content-title">基本信息</view>
				</block>
				<view class="bottom-content-line" v-if="info.tag_a">
					<image class="left-img left" src="@/static/image/changsuo.png"></image>
					<text>见面场所:</text>
					<text>{{info.tag_a}}</text>
				</view>
				<view class="bottom-content-line">
					<image class="left-img left" src="@/static/image/nianling.png"></image>
					<text>妹子年龄:</text>
					<text>{{info.price}}岁</text>
				</view>
				<view class="bottom-content-line">
					<image class="left-img left" src="@/static/image/shuliang.png"></image>
					<text>妹子数量:</text>
					<text>{{info.num}}个</text>
				</view>
				<view class="bottom-content-line">
					<image class="left-img left" src="@/static/image/xiangmu.png"></image>
					<text>服务项目:</text>
					<text>{{info.size}}</text>
				</view>
				<view class="bottom-content-line" v-if="info.tag_b">
					<image class="left-img left" src="@/static/image/shijian.png"></image>
					<text>营业时间 :</text>
					<text>{{info.tag_b}}</text>
				</view>
				<view class="bottom-content-line">
					<image class="left-img left" src="@/static/image/shengao.png"></image>
					<text>身高三围:</text>
					<text>{{info.hours == 0 ? '未知' : info.hours + '-胸.腰.臀(cm)'}}</text>
				</view>
				<view class="bottom-content-line" v-if="info.tag_c">
					<image class="left-img left" src="@/static/image/jiage.png"></image>
					<text>价格区间:</text>
					<text>{{info.tag_c}}元(视项目多少定)</text>
				</view>
				<view class="bottom-content-line">
					<image class="left-img left" src="@/static/image/jieshao.png"></image>
					<text>妹子介绍:</text>
					<text>{{info.content}}</text>
				</view>
			</view>
		</view>

		<uni-popup ref="showintroduction" type="center">
			<view class="tc_cz_btn_bg">
				<image src="../../static/img/transfer_cz.png" style="top: -60px;width: 200px;height: 106px;">
				</image>
				<view class="tc_cz_btn">开通VIP</view>
				<view class="tc_cz_btn_2">只有VIP用户才可以看哦！</view>
				<view style="width: 100%;height: 30px;text-align: center;font-size: 14px;">
					<view class="chongzhi_btn_kt" @click="gotoVIP">我要开通</view>
				</view>
				<view @click="cancel" class="tc_cz_btn_3">下次,再说!</view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import api from "@/common/api.js";
	import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue'
	var _self;
	export default {

		onPageScroll({
			scrollTop
		}) {
			_self.scrollTop = scrollTop;
		},
		components: {
			easyLoadimage
		},
		data() {
			return {
				loading: true,
				isLogin: false,
				userId: 0,
				phone: {},
				userInfo: {},
				style: [],
				zid: 0,
				did: 0,
				info: {},
				scrollTop: 1,
				swiperheight: 500
			}
		},
		onLoad(e) {
			_self = this;
			_self._showLoading()
			_self.zid = e.zid;
			_self.isLogin = api.getLogins();
			if (_self.isLogin) _self.userId = _self.isLogin.userId;
			_self.phone = uni.getSystemInfoSync();
			_self.getUserInofo();
			_self.getData();
			uni.getStorage({
				key: 'mobileDid_' + api.appkey,
				success: (res) => {
					_self.did = res.data.data;
					if (!_self.did) _self.did = res.data;
				}
			});
			// 加载出来的图片高的问题
			uni.getSystemInfo({
				success: (res) => {
					let height = res.windowHeight - uni.upx2px(230);
					this.swiperheight = height;
				},
			});

		},
		methods: {
			openVip() {
				this.$refs['showintroduction'].open()
			},
			gotoVIP() {
				_self.skipUrl('/pages/recharge/recharge?type=2', 'new');
			},
			openLink(link) {
				if(window?.location){
					window.open(link, '_blank');
					return;
				}
				uni.navigateTo({
				        url: `/pages/webview/webview?url=${encodeURIComponent(link)}`,
				        fail(err) {
				            console.error(err);
				        }
				    });
			},
			cancel() {
				this.$refs['showintroduction'].close()
			},
			getUserInofo() {
				uni.request({
					url: api.apiData.getInfo,
					method: 'POST',
					data: {
						userId: _self.userId
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						if (e.data.Code == 200) {
							_self.userInfo = e.data.Data;
						} else {
							api.delLogins();
							_self.isLogin = false;
						}
						var timer = setTimeout(() => {
							_self.loading = false;
							_self._hideLoading()
							clearTimeout(timer);
						}, 300)
					},
					fail: () => {
						api.showToast('服务器连接失败，请检查网络是否正常', 3000);
					}
				});
			},
			bigImg(i) {
				uni.previewImage({
					urls: _self.info.list,
					current: i,
					longPressActions: {
						itemList: ['保存至手机相册'],
						success: (data) => {
							_self.downImg(_self.info.list[data.index]);
						}
					}
				});
			},
			downImg(img) {
				_self._showLoading('正在保存...');
				uni.downloadFile({
					url: img,
					success: (res) => {
						if (res.statusCode == 200) {
							_self.savePoto(res.tempFilePath);
						} else {
							api.showToast('保存失败，请确定是否给于APP权限');
						}
					},
					complete() {
						_self._hideLoading();
					}
				})
			},
			savePoto(tempFilePath) {
				uni.saveImageToPhotosAlbum({
					filePath: tempFilePath,
					success: () => {
						api.showToast("已保存至手机相册", 2000);
					},
					fail: () => {
						api.showToast("保存失败，请检查APP是否有权限", 5000);
					}
				});
			},
			getData() {
				uni.request({
					url: api.apiData.pictureInfo,
					method: 'POST',
					data: {
						zid: _self.zid,
						uid: _self.userId
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var r = e.data;
						if (r.Code == 200) {
							var d = r.Data;
							_self.info = d.info;
							//console.log(_self.info)
							_self.info.list.unshift(d.info.cover);
							// _external_link = d.info['link'];
						} else {
							_self.back(r.Msg);
						}
					},
					fail: () => {
						// 加载失败提示
						_self.back("服务器连接失败，请检查网络是否正常");
					},
					complete: () => {
						let timer = setTimeout(() => {
							_self.loading = false;
							_self._hideLoading()
							clearTimeout(timer);
						}, 500);
					}
				});
			},
			back(msg) {
				api.showToast(msg, 2000);
				setTimeout(() => {
					uni.navigateBack();
				}, 1000);
			},
			// 跳转登录
			skipUrl(uri = '/pages/login/login', type = 'new') {
				api.jumpUrl(uri, type)
			}
		}
	};
</script>

<style>
	@import url('@/components/loading/loading.css');

	.swiper {
		height: 100%;

	}

	.swiper image {
		width: 100%;
		min-height: 800px;
	}

	.only_vip {
		width: 100%;
		height: 100upx;
		text-align: center;
	}

	.only_vip image {
		width: 520upx;
		height: 100upx;
	}

	.info-content {
		padding-top: 30upx;
	}

	.img-item {
		width: 100%;
		border-radius: 10upx;
		margin-bottom: 10upx;
	}

	.img-item image {
		width: 100%;
	}

	.img-item>>>.origin-img {
		border-radius: 10upx;
	}

	.info-title-bottom text {
		display: inline-block;
	}

	.info-title-bottom {
		font-size: 12px;
		color: #999;
		text-align: left;
	}

	.info-title {
		color: #FFFFFF;
		font-size: 20px;
		font-weight: bold;
		margin: 10upx 0 20upx;
	}

	.info-head {
		text-align: center;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		padding-bottom: 20upx;
	}

	.content {
		margin: 20upx 25upx;
		padding: 20upx;
		border-radius: 15upx;
		background-color: #31313C;
	}

	.left {
		float: left;
	}

	.right {
		float: right;
	}

	.image-info {
		margin-top: 10px;
		box-sizing: border-box;
	}

	.bottom-content-line text {
		margin-left: 20upx;
		font-size: 15px;
		color: #AFAFB4;
	}

	.bottom-content-line .left-img {
		width: 50upx;
		height: 50upx;
		margin-top: 10upx;
	}

	.bottom-content-line {
		width: 100%;
		display: inline-block;
		height: 68upx;

		box-sizing: border-box;
		line-height: 70upx;
		//background-color: #007AFF;
	}

	.bottom-content {
		padding: 5upx 0;
		margin-top: 30upx;
		box-sizing: border-box;
	}

	.bottom-content-title {
		width: 100%;
		padding: 5upx 10upx;
		color: rgb(255, 158, 53);
		font-size: 14px;
		font-weight: 600;
		display: inline-block;
		margin: 10upx 0;
		border-left: rgb(255, 158, 53) 5px solid;
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
		overflow: hidden;
		box-sizing: border-box;
	}

	.ds_btn {
		display: inline-block;
		color: #FFFFFF;
		font-size: 26upx;
		height: 30px;
		width: 60%;
		line-height: 30px;
		border-radius: 30px;
		text-align: center;
		background-image: linear-gradient(to right top, #ffe62b, #f8d520, #f0c415, #e7b40a, #dea400);
	}

	.cz_ds_btn {
		width: 100%;
		height: 30px;
		text-align: center;
		font-size: 14px;
	}

	.ye_ds_text {
		margin-top: 10px;
		padding-top: 10px;
		width: 100%;
		height: 30px;
		text-align: center;
		font-size: 14px;
		color: #FFFFFF;
	}

	.tc_ds_btn {
		padding-top: 90px;
		width: 100%;
		height: 30px;
		text-align: center;
		font-size: 14px;
	}

	.tc_ds_btn_2 {
		padding-top: 15px;
		width: 100%;
		height: 30px;
		text-align: center;
		font-size: 14px;
	}

	.tc_ds_btn_3 {
		width: 100%;
		height: 30px;
		text-align: center;
		font-size: 14px;
	}

	.tc_ds_btn_bg {
		background: #e8370c;
		width: 230px;
		height: 300px;
		border-radius: 5px;
	}

	.tc_cz_btn_bg {
		background-image: linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1);
		width: 200px;
		height: 200px;
		border-radius: 5px;
	}

	.tc_cz_btn {
		position: absolute;
		top: 50px;
		width: 100%;
		height: 30px;
		text-align: center;
		font-size: 14px;
	}

	.tc_cz_btn_2 {
		position: absolute;
		top: 70px;
		width: 100%;
		height: 20px;
		text-align: center;
		font-size: 14px;
	}

	.tc_cz_btn_3 {
		position: absolute;
		top: 160px;
		width: 100%;
		height: 20px;
		text-align: center;
		font-size: 14px;
	}

	.chongzhi_btn_kt {
		display: inline-block;
		color: #FFFFFF;
		font-size: 26upx;
		height: 30px;
		width: 40%;
		line-height: 30px;
		border-radius: 30px;
		text-align: center;
		background-image: linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12);
	}

	.uni-popup {
		z-index: 999;
	}

	.chongzhi_btn {
		display: inline-block;
		color: #FFFFFF;
		font-size: 26upx;
		height: 30px;
		width: 40%;
		line-height: 30px;
		border-radius: 30px;
		text-align: center;
		background-image: linear-gradient(to right top, #ffe62b, #f8d520, #f0c415, #e7b40a, #dea400);
	}


	.input-tx {
		background: #CCCCCC;
		height: 35px;
		width: 80%;
		margin: 0 auto;
		border-radius: 7px;
		margin-bottom: 5px;
	}
	
	#click-link {
		cursor: pointer;
		color: orange;
		text-decoration: underline;
	}
</style>
