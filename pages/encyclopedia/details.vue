<template>
	<div class="ency-details">
		<css-loading ref="cssLoading"></css-loading>
		<view class="ency-details-cont">
			<view class="edtitle">
				{{ item.title }}
			</view>
			<view class="edprofile">
				<view class="edprofile_left" @click="goHome(item.user_id)">
					<image class="edprofile_img" :src="item.headimgurl" style="width: 40px; height: 40px;" mode="aspectFill"></image>
					<view class="edprofile_left_text">
						<text>{{ item.nickname }}</text>
						<view class="">
							<text>{{ item.tags }}</text>
							<text style="margin-left: 6px;">{{ item.click }}</text>
						</view>
					</view>
				</view>
				<view class="edcontent_right" @click="focusOnThis(item.user_id)">
					<view class="edcontent_btn" :class="fans?'edcontent_btn_active':''">
						<image style="width: 23px; height: 23px;" :src="`/static/svod/${fans?'follow_1.png':'follow_0.png'}`" mode=""></image>
						<text style="margin-left: 6px;margin-right: 6px">{{fans?'下列':'关注' }}</text>
					</view>
				</view>
			</view>
			<view class="edcontent">
				<text class="edctext">{{ item.info }}</text>
				<!-- <image v-for="(img, idx) of getImages(item.images)" :key="idx" class="edcontent_img" :src="img" mode="aspectFill"></image> -->
				<img v-for="(img, idx) of getImages(item.images)" :key="idx" class="edcontent_img" :src="img"></img>
				<video class="edcontent_img" 
					:style="vshow?{display: 'none'}:''"
					:poster="item.thumbnil?item.thumbnil:getImages(item.images)[0]" 
					:src="item.url" 
					:autoplay="false" 
					object-fit="contain"></video>
			</view>	
		</view>
		<view class="bottom-bar">
			<view class="bb-item" @click="handleAction('collect')">
				<image v-if="!collect" style="width: 23px;height: 23px;" src="/static/svod/btn_collection_0.png" mode=""></image>
				<image v-if="collect" style="width: 23px;height: 23px;" src="/static/svod/btn_collection_1.png" mode=""></image>
				<text class="bb-item-text">{{ collectNum }}</text>
			</view>
			<view class="bb-item" @click="handleAction('like')">
				<image v-if="!like" style="width: 23px;height: 23px;" src="/static/svod/btn_like_0.png" mode=""></image>
				<image v-if="like" style="width: 23px;height: 23px;" src="/static/svod/btn_like_1.png" mode=""></image>
				<text class="bb-item-text">{{ likeNum }}</text>
			</view>
			<view class="bb-item" @click="handleAction('share')">
				<image style="width: 23px;height: 23px;" src="/static/svod/btn_share.png" mode=""></image>
				<text class="bb-item-text">分享</text>
			</view>
		</view>
		<uni-popup ref="popupComment" type="center" @change="handleModalChange">
			<view class="poster-bg" :style="{ width: bgWidth + 'px' }">
				<image class="poster" :style="{ width: bgWidth + 'px'}" :src="bg" mode="widthFix"></image>
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
		</uni-popup>
	</div>
</template>

<script>
	import api from "@/common/api.js";
	export default {
		data() {
			return {
				collect: false,
				like: false,
				share: false,
				itemId: 0,
				item: {},
				bg: '',
				bgHeight:'',
				bgWidth:'',
				api: api,
				userId: 0,
				collectNum: 0,
				likeNum: 0,
				rule: '',
				shareUrl: '',
				fans: 0,
				vshow: false
			}
		},
		onLoad() {
			this._showLoading('加载中...');
			var mobile = uni.getSystemInfoSync();
			this.top = mobile.safeArea.top + 7;
			this.bgHeight = mobile.windowHeight - this.top - 110;
			this.bgWidth = mobile.windowWidth - 100;
			this.userId = this.getUserId();
			// const params = this.$route.query;
			const did = uni.getStorageSync('encdetail_id'); // Detail id
			if(did < 0){
				uni.navigateBack()
			}
			this.itemId = did
			this.onLoadData()
			this.getShare();
		},
		methods: {
			handleModalChange(e){
				// #ifdef APP
				this.vshow = e.show
				// #endif
			},
			getUserId() {
				var isLogin = api.getLogins();
				return isLogin ? isLogin.userId : 0
			},
			handleAction(e){
				const _self = this
				if(e=='share'){
					this.$refs['popupComment'].open();
					return;
				}
				uni.request({
					url: api.apiData.encAction,
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						type: e,
						uid: _self.userId,
						id: this.itemId
					},
					success(d) {
						if(e=='collect'){
							_self.collect = !_self.collect
							if(_self.collect){
								_self.collectNum = Number(_self.collectNum) + 1
							} else {
								_self.collectNum = Number(_self.collectNum) - 1
							}
						}else if(e=='like'){
							_self.like = !_self.like
							if(_self.like){
								_self.likeNum = Number(_self.likeNum) + 1
							} else {
								_self.likeNum = Number(_self.likeNum) - 1
							}
						}
					},
					fail(e) {
						console.log(e)
					}
				})
			},
			getImages(img){
				if(!img) return[];
				const images = img.split(',')
				return images;
			},
			onLoadData(){
				const _self = this;
				uni.request({
					method: "GET",
					url: api.apiData.encDetail,
					data: { id: _self.itemId, uid: _self.userId },
					success(d) {
						const data = d.data
						if(data.Code == 200){
							_self.item = data.Data
							_self.collectNum = _self.item.collect
							_self.likeNum = _self.item.like
							_self.like = _self.item.ulike
							_self.collect = _self.item.ucoll
							_self.fans = _self.item.ufan
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
			getShare() {
				const _self = this
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
						_self.shareUrl = res.url;
						setTimeout(() => {
							_self.loading = false;
							_self._hideLoading()
						}, 500)
					},
					fail: () => {
						// 加载失败提示
						api.showToast('服务器连接失败，请检查网络是否正常');
						// uni.navigateBack();
					}
				});
			},
			copyShareUrl() {
				const _self = this
				// #ifdef H5
				api.showToast('请用手机截图或面对面扫码', 2000);
				navigator.clipboard.writeText(_self.shareUrl)
				// #endif
				// #ifdef APP-PLUS
				uni.setClipboardData({
					data: _self.shareUrl,
					success: function() {
						api.showToast("分享链接已复制到剪贴板", 2000);
					}
				});
				// #endif
			},
			// 保存海报至相册
			saveShareImg() {
				const _self = this
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
			goHome(uid) {
				if (uid == 0) {
					api.showToast('模拟数据，请重启APP', 2000);
					return
				}
				var param = {
					url: '/pages/index/index',
					t: 'new'
				}
				api.jumpUrl('/pages/svod/home?type=' + JSON.stringify(param) + '&uid=' + uid, 'new');
			},
			focusOnThis() {
				const _self = this
				uni.request({
					url: api.apiData.postFocus,
					method: 'POST',
					data: {
						userId: _self.userId,
						postId: _self.itemId
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					success: (res) => {
						if (res.data.Code == 200) {
							_self.fans = !_self.fans
						} else {
							api.showToast(res.data.Msg);
						}
					},
					fail: (err) => {
						api.showToast('关注失败');
					}
				});
			},
		}
	}
</script>

<style>
.ency-details-cont{
	padding: 0 16px;
	height: calc(100vh - 90px);
}
.edprofile{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.edtitle{
	font-size: 20px;
	color: #FFFFFF;
	margin-bottom: 10px;
}
.edprofile_img{
	border-radius: 50%;
}
.edprofile_left{
	display: flex;
	flex-direction: row;
	align-items: center;
	flex: 1;
	color: #c9c9c9;
	font-size: 13px;
}
.edprofile_left_text{
	margin-left: 15px;
}
.edcontent_btn{
	padding: 5px 5px;
	display: flex;
	flex-direction: row;
	align-items: center;
	background-color: #ff8328;
	border-radius: 20px;
	color: #FFFFFF;
}
.edcontent_btn_active{
	background-color: #717171;
}
.edcontent{
	margin-top: 15px;
	display: flex;
	flex-direction: column;
	position: relative;
	padding-bottom: 60px;
}
.edctext{
	font-size: 14px;
	color: #cccccc;
}
.edcontent_img{
	width: 100%;
	margin-top: 6px;
}
.bottom-bar{
	display: flex;
	position: fixed;
	z-index: 1;
	bottom: 0;
	width: 100%;
	background-color: #1d1d28;
	color: #FFFFFF;
	justify-content: space-between;
	align-items: center;
}
.bb-item{
	display: flex;
	align-items: center;
	justify-content: center;
	flex: auto;
	padding: 13px 6px;
}
.bb-item-text{
	margin-left: 3px;
	font-size: 13px;
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
		top: 0;
	}
	
	.poster-bg {
		/* background: #FFFFFF; */
		position: relative;
	}
	
	.showBtns {
		position: absolute;
		width: 90%;
		left: 5%;
		bottom: 100px;
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
