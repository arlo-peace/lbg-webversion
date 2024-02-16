<template>

	<view class="content">
		<css-loading ref="cssLoading"></css-loading>

		<view class="center-content">
			<view class="head-top">
				<image class="bg" src="@/static/homePage/bg.jpg" mode="aspectFill"></image>
				<!-- #ifndef MP-WEIXIN -->
				<view class="back" :style="{'margin-top':top+'px'}" @click="goBack">
					<image src="/static/imgs/back.png" mode="aspectFill"></image>
				</view>
				<!-- #endif -->

				<view class="tx">
					<view class="tx-avatar">
						<image class="left left-image" :src="info.headimgurl" mode="aspectFill"></image>
					</view>
					<view class="tx-name">
						<text class="username">{{info.nickname ? info.nickname : info.username}}</text>
						<text class="apply-btn" v-if="uid == userId"
							@click="skipUrl('/pages/member/apply','new')">申请UP主</text>
						<template v-else>
							<text v-if="info.isFollow" class="apply-btn" @click="gotoGuanzhuan">已关注</text>
							<text v-else class="apply-btn" @click="gotoGuanzhuan">关注</text>
						</template>
					</view>
					<view class="tx-level" v-if="info.tag_id > 0">
						<view class="tx-level-name">
							<text style="color:rgba(255,255,255,.7);font-size:26upx">{{info.tag_name}}</text>
							<image style="width: 140upx;height:  32upx" :src="info.tag_url" mode="aspectFill"></image>
						</view>
						<view class="tx-level-desc"
							v-if="(info.tag_s && info.tag_s.length > 0) || (info.tag_d && info.tag_d.length > 0)">
							<text v-if="info.tag_s && info.tag_s.length > 0">{{info.tag_s}}</text>
							<text v-if="info.tag_d && info.tag_d.length > 0">{{info.tag_d}}</text>
						</view>
					</view>
					<view class="tx-data">
						<view class="tx-data-grid">
							<text>{{info.followers}}</text>
							<text class="tx-data-text">关注</text>
						</view>
						<view class="tx-data-grid">
							<text>{{info.fans}}</text>
							<text class="tx-data-text">粉丝</text>
						</view>
						<view class="tx-data-grid">
							<text>{{info.likes}}</text>
							<text class="tx-data-text">获赞</text>
						</view>
					</view>
				</view>
			</view>
			<view style="margin-top:520upx;"></view>
			<view class="content-tab">
				<view style="border-radius:20upx 0 0 20upx;" @click="setTabId(1)">
					<text :class="tabId==1?'sel':''">作品({{info.videoSum}})</text>
				</view>
				<view style="border-radius:0 20upx 20upx 0;" @click="setTabId(2)">
					<text :class="tabId==2?'sel':''">动态({{info.commentSum}})</text>
				</view>
			</view>
			<view class="content-zanshang" v-if="info">
				<view class="content-zanshang-item">
					<image class="zanshang-image" v-for="record in info.records" :key="record.id"
						:src="record.headimgurl" mode="aspectFill"></image>
				</view>
				<view class="content-zanshang-item">
					<text class="zanshang-text">{{info.record_count}}人打赏</text>
					<view class="zanshang-btn" @click="showZanshang">打赏</view>
				</view>
			</view>
			<view class="content-bottom" v-if="!isShowTig && tabId==1">
				<view class="video-info" v-for="(v, i) in list" :key="i" @click="playVideo(v)">
					<easy-loadimage mode="aspectFill" :scroll-top="scrollTop" :image-src="v.cover"
						:open-transition="true" class="cover">
					</easy-loadimage>
					<view class="video-title video-info-video-title">{{v.title}}</view>
					<view class="video-gold">
						<image class="left" :style="{'margin-top':topUpx+'upx'}" src="@/static/homePage/click-1.png"
							mode="aspectFill"></image>
						<text class="gold">{{v.click}}</text>
						<image class="left-icon" :style="{'margin-top':topUpx+'upx',marginLeft:'10upx'}"
							src="@/static/homePage/like.png" mode="aspectFill"></image>
						<text class="gold">{{v.good}}</text>
						<text class="date right">{{utils.timeTodate('Y-m-d',v.add_time+'')}}</text>
					</view>
				</view>
			</view>
			<view class="content-bottom" v-if="!isShowTig && tabId==2">
				<view class="comment-info" v-for="(v, i) in list" :key="i">
					<view class="center-content-center">
						<view class="center-content-text" @click="goInfo(v)">
							<text v-if="v.tag" style="color:rgba(255, 12, 208, 0.8)">#{{v.tag}}#</text>{{v.text}}
						</view>
						<view class="imgBox" v-for="(mm, ii) in v.allImg"
							:class="{imgBoxA:v.allImg.length == 4 || v.allImg.length == 2,imgBoxB:v.allImg.length == 1}">
							<image :src="mm" @click="goInfo(v)" :key="ii" class="_imgmore" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>


			<uni-popup ref="showintroduction" :type="popType">
				<!--打赏弹出层开始-->
				<view v-if="viewType==2" class="tc_ds_btn_bg">
					<view style="position: absolute;width: 100%;height: 50px;">
						<image src="../../static/img/transfer_shang.png"
							style="top: -100px;width: 230px;height: 178px;"></image>
					</view>
					<view class="tc_ds_btn">
						<input class="input-tx" type="number" :value="ds_amount" maxlength="15" @input="set_ds_amount"
							placeholder="请输入打赏金额" />
					</view>
					<view class="tc_ds_btn_2">
						<input class="input-tx" type="text" :value="ds_content" maxlength="15" @input="set_ds_content"
							placeholder="我想撩句话" />
					</view>
					<view class="ye_ds_text">金币:￥{{info.k_money}}</view>
					<view class="tc_ds_btn_3">
						<view class="ds_btn" @click="gochongzhi" v-if="info.k_money ==0">金币不足,立即充值</view>
						<view class="chongzhi_btn" @click="gotopay" v-if="info.k_money >0">我要打赏</view>
					</view>
					<view @click="cancel()" class="tc_ds_btn_2">下次再说吧!</view>
				</view>
				<view v-if="viewType==4" class="tc_cz_btn_bg">
					<image src="../../static/img/transfer_cz.png" style="top: -60px;width: 200px;height: 106px;">
					</image>
					<view class="tc_cz_btn">开通VIP</view>
					<view class="tc_cz_btn_2">只有VIP用户才可以看哦！</view>
					<view style="width: 100%;height: 30px;text-align: center;font-size: 14px;">
						<view class="chongzhi_btn_kt" @click="openVIP()">我要开通</view>
					</view>
					<view @click="cancel('dashang')" class="tc_cz_btn_3">下次,再说!</view>
				</view>
			</uni-popup>
			<view style="width:100%;text-align:center;padding-top:330upx;" v-if="isShowTig">
				<image src="/static/empty.png" style="width:100px;height:100px;"></image>
				<view style="width:100%;font-size:25upx;color:#999;">主人很懒，暂无动态</view>
			</view>

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
				utils: utils,
				loading: true,
				isLogin: false,
				userId: 0,
				phone: {},
				top: 0,
				uid: 0,
				uri: {
					url: '/pages/plaza/index',
					t: 'tab'
				},
				tabId: 2,
				isShowTig: false,

				list: {},
				info: {},
				topUpx: 12,
				scrollTop: 0,
				viewType: 2,
				popType: 'center',
				content: '',
				ds_amount: '10',
				ds_content: '',
			}
		},
		onLoad(e) {
			_self = this;
			_self._showLoading()
			_self.uri = JSON.parse(e.type);
			_self.uid = e.uid;
			_self.isLogin = api.getLogins();
			if (_self.isLogin) _self.userId = _self.isLogin.userId;
			_self.phone = uni.getSystemInfoSync();
			_self.top = _self.phone.statusBarHeight;
			// #ifdef APP-PLUS
			_self.topUpx = _self.phone.platform == 'ios' ? 10 : 12;
			// #endif
			// #ifdef H5
			_self.top = 15;
			// #endif
			//console.log(_self.topUpx)
			_self.initData();
			console.log('HOME')
		},
		onBackPress() {
			_self.goBack()
		},
		methods: {
			gotoGuanzhuan() {
				uni.request({
					url: api.apiData.goToGuanzhu,
					method: 'POST',
					data: {
						to_uid: _self.uid,
						uid: _self.userId,
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var r = e.data;
						api.showToast(r.Msg, 2000);
						_self.setTabId(_self.tabId)
					},
					fail: () => {
						// 加载失败提示
						api.showToast("服务器连接失败，请检查网络是否正常", 3000);
					}
				});
			},
			showZanshang() {
				_self.viewType = 2
				_self.ds_amount = '10'
				_self.ds_content = ''
				_self.showPop()
			},
			showPop() {
				this.$refs['showintroduction'].open()
			},
			cancel() {
				this.$refs['showintroduction'].close()
			},
			setContent(e) {
				//console.log(e.detail.value)
				_self.content = e.detail.value;
			},
			set_ds_amount(e) {
				//console.log(e.detail.value)
				_self.ds_amount = e.detail.value;
			},
			set_ds_content(e) {
				//console.log(e.detail.value)
				_self.ds_content = e.detail.value;
			},
			initData(t = 0) {
				if (t == 1) _self._showLoading('正在加载...');
				uni.request({
					url: api.apiData.homePage,
					method: 'POST',
					data: {
						uid: _self.uid,
						type: _self.tabId,
						userId: _self.userId
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						//console.log(e);
						var r = e.data;
						if (r.Code == 201) {
							api.showToast(r.Msg, 2000);
							return
						}
						_self.list = r.Data.list;
						_self.isShowTig = _self.list.length == 0 ? true : false;
						_self.info = r.Data.info;
					},
					fail: () => {
						api.showToast("服务器连接失败，请检查网络是否正常", 3000);
					},
					complete: () => {
						let timer = setTimeout(() => {
							_self.loading = false;
							_self._hideLoading();
							clearTimeout(timer);
						}, 1500);
					}
				});
			},
			gotopay() {
				if (_self.ds_amount.substring(0, 1) == 0) {
					api.showToast('不能0开头', 1500);
					return;
				}
				if (_self.ds_amount.length < 1) {
					api.showToast('请输入打赏金额', 1500);
					return;
				}
				if (_self.ds_amount < 1) {
					api.showToast('请输入打赏金额不能小于1', 1500);
					return;
				}

				if (_self.ds_amount > _self.info.k_money) {
					api.showToast('打赏金额不足', 1500);
					return;
				}
				if (_self.ds_amount.indexOf('.') != -1) {
					api.showToast('打赏金额只能为整数', 1500);
					return;
				}
				if (_self.ds_content.length < 1) {
					api.showToast('请输入打赏内容', 1500);
					return;
				}
				uni.request({
					url: api.apiData.goToPayDashang,
					method: 'POST',
					data: {
						uid: _self.userId,
						content: _self.ds_content,
						to_uid: _self.uid,
						amount: _self.ds_amount
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var r = e.data;
						api.showToast(r.Msg, 1500);
						_self.content = '';
						setTimeout(() => {
							_self.cancel();
						}, 1000);

					},
					fail: () => {
						// 加载失败提示
						api.showToast("服务器连接失败，请检查网络是否正常", 3000);
					}
				});
			},
			gochongzhi() {
				_self.skipUrl('/pages/recharge/recharge?type=1', 'new');
			},
			// 跳转播放页
			playVideo(item) {
				if (item.play_type == 1) {
					uni.setStorage({
						key: 'vid',
						data: item.id,
						success: () => {
							var param = {
								url: '/pages/member/member',
								t: 'tab'
							}
							api.jumpUrl('/pages/video/play?type=' + JSON.stringify(param), 'new');
						},
						fail: () => {
							api.showToast('服务器连接失败，请检查网络是否正常');
						}
					});
				} else {
					api.jumpUrl('/pages/svod/player?info=' + JSON.stringify(item), 'new');
				}
			},
			goInfo(e) {
				e.isMe = (_self.userId == e.uid) ? true : false;
				if (!_self.info.isVip && e.isVip == 1 && _self.userId != e.uid) {
					_self.viewType = 4;
					_self.showPop();
					return false;
				}
				let d = {
					allImg: e.allImg,
					id: e.id,
					headimgurl: _self.info.headimgurl,
					username: _self.info.username,
					nickname: _self.info.nickname,
					tag: e.tag,
					text: e.text,
					add_time: e.add_time
				}
				uni.setStorage({
					key: 'info_content_' + api.appkey,
					data: d,
					success: () => {
						_self.skipUrl('/pages/plaza/info?t=2', 'new');
					},
					fail: () => {
						api.showToast('数据加载失败，请退出重试', 2000);
					}
				});
			},
			goBack() {
				//console.log(_self.uri.url);
				_self.skipUrl(_self.uri.url, _self.uri.t);
			},
			setTabId(e) {
				_self.tabId = e;
				_self.list = [];
				_self.initData(1);
			},
			// 跳转登录
			skipUrl(uri = '/pages/login/login', type = 'new') {
				api.jumpUrl(uri, type)
			},
			openVIP() {
				_self.skipUrl('/pages/recharge/recharge?type=2', 'new');
			},
		},
		onPullDownRefresh() {
			_self.initData();
			uni.stopPullDownRefresh();
		},
		onPageScroll({
			scrollTop
		}) {
			_self.scrollTop = scrollTop;
		}
	};
</script>

<style>
	@import url('@/components/loading/loading.css');

	.video-gold .date {
		color: #999999;
	}

	.video-gold .gold {
		margin-left: 5upx;
		color: #ffffff;
	}

	.video-gold .left {
		width: 32upx;
		height: 20upx;
		//margin-top: 10upx;
	}

	.video-gold .left-icon {
		width: 32upx;
		height: 20upx;
		//margin-top: 10upx;
	}

	.video-gold {
		font-size: 25upx;
		margin-top: -5upx;
		height: 40upx;
		line-height: 40upx;
		padding: 0 10upx;
		margin-bottom: 10upx;
	}

	.comment-info-center .more {
		display: inline-block;
		width: 80upx;
		height: 40upx;
		line-height: 40upx;
		border-radius: 10upx;
		text-align: center;
		font-size: 24upx;
		margin-right: 10upx;
		background-color: #ff962f;
	}

	.comment-info-center {
		font-size: 30upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: #FFFFFF;
	}

	.comment-sum image {
		width: 30upx;
		height: 30upx;
		margin-top: 31upx;
		margin-right: 10upx;
	}

	.comment-sum {
		display: inline-block;
		height: 80upx;
		line-height: 80upx;
		//background-color: #007AFF;
	}

	.comment-username .date {
		font-size: 12px;
		color: #999;
	}

	.comment-username {
		font-size: 30upx;
		height: 80upx;
		margin-left: 20upx;
		display: inline-block;
		//background-color: #007AFF;
	}

	.comment-tx {
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		border: 1px solid rgba(255, 12, 208, 0.8);
	}

	.comment-info-top {
		padding: 20upx 25upx;
	}

	.comment-info {
		width: 94%;
		margin: 0 3% 15upx;
		border-radius: 10upx;
		background-color: rgba(255, 255, 255, 0.06);
	}

	.video-title {
		height: 50upx;
		line-height: 50upx;
		font-size: 28upx;
		padding-left: 10upx;
		margin-top: 12upx;
		color: #CCCCCC;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.video-info .cover {
		width: 100%;
		height: 200upx;
		border-radius: 15upx 15upx 0 0;
	}

	.cover>>>.origin-img {
		border-radius: 15upx 15upx 0 0;
	}

	.video-info {
		width: 46.5%;
		margin-left: 2%;
		display: inline-block;
		margin-bottom: 15upx;
		background-color: #20202C;
		border-radius: 15upx;
		border: 1px solid #333333;
	}

	.content-bottom {
		padding-top: 5upx;
		margin-bottom: 30upx;
		//background-color: #20202C;
	}

	.content-tab .sel {
		color: rgba(255, 215, 0, 1);
		border-bottom: 3px solid rgba(255, 215, 0, 1);
	}

	.content-tab view {
		width: 40%;
		height: 110upx;
		line-height: 110upx;
		display: inline-block;
		background-color: rgba(0, 0, 0, 0.6);
		font-size: 30upx;
		font-weight: bold;
		color: #FFFFFF;
	}

	.content-tab {
		text-align: center;
		z-index: 2;
		width: 100%;
		position: fixed;
	}

	.center-content .tx .username {
		font-size: 33upx;
		color: #FFFFFF;
		font-weight: bold;
	}

	.center-content .tx .left-image {
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
		border: 5upx solid rgba(255, 255, 255, 0.4);
		margin-bottom: 10upx;
	}

	.center-content .tx {
		position: absolute;
		height: 300upx;
		margin-top: 140upx;
		z-index: 2;
		width: 100%;
		//background-color: #007AFF;
	}

	.center-content .back image {
		width: 40upx;
		height: 40upx;
		float: left;
		margin: 10upx 8upx;
	}

	.center-content .back {
		position: absolute;
		width: 60upx;
		height: 60upx;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 50%;
		margin-left: 30upx;
		z-index: 2;
	}

	.center-content .bg {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 1;
		box-shadow: 0px 6px 6px 5px rgba(0, 0, 0, 0.2);
		border-bottom: 1px solid rgba(0, 0, 0, 0.4);
	}

	.head-top {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 560upx;
		z-index: 1;
	}

	.left {
		float: left;
	}

	.right {
		float: right;
	}

	.tx-name {
		width: 100%;
		align-items: center;
		margin-top: 120upx;
		display: flex;
		justify-content: center;
	}

	.tx-avatar {
		position: absolute;
		left: 50%;
		margin-left: -55upx;
	}

	.apply-btn {
		font-size: 18upx;
		background-color: red;
		color: white;
		padding: 6upx;
		border-radius: 6rpx;
		vertical-align: middle;
		margin-left: 16upx;
	}

	.tx-level {
		width: 100%;
		align-items: center;
		margin-top: 10upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.tx-level-name {
		width: 100%;
		align-items: center;
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-bottom: 20upx;

	}

	.tx-level-name text {
		color: white;
		font-size: 20upx;
		margin-right: 10upx;
	}

	.tx-level-name image {
		width: 80upx;
		height: 19upx
	}

	.tx-level-desc {
		width: 100%;
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-bottom: 6upx;
		padding: 6upx 0;
		color: rgba(195, 195, 195, 1);
		font-size: 20upx;
		background-image: linear-gradient(to right, rgba(0, 0, 0, 0.1) 0, rgba(255, 255, 255, .15) 35%, rgba(255, 255, 255, .15) 70%, rgba(0, 0, 0, 0.1) 100%);
	}

	.tx-data {
		width: 100%;
		align-items: center;
		display: flex;
		flex-direction: row;
		justify-content: center;
		color: white;
		margin-top: 10upx;
	}

	.tx-data-grid {
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-size: 24upx;
	}

	.tx-data-grid+.tx-data-grid {
		margin-left: 20upx;
		padding-left: 20upx;
		border-left: rgba(222, 222, 222, .65) 1px solid;
	}

	.tx-data-text {
		font-size: 28upx;
	}

	.content-zanshang {
		padding: 0 50upx;
		padding-top: 110upx;
		height: 90upx;
		align-items: center;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.content-zanshang-item {
		align-items: center;
		display: flex;
		flex-direction: row;
	}

	.zanshang-text {
		font-size: 20upx;
		color: gray;
	}

	.zanshang-btn {
		background-color: indianred;
		color: white;
		font-size: 20upx;
		padding: 2upx 4upx;
		border-radius: 6upx;
		margin-left: 10upx;
	}

	.zanshang-image {
		width: 50upx;
		height: 50upx;
		border-radius: 50%;
		background-color: rgba(200, 200, 200, .7);
		border: rgba(0, 0, 0, .35) 2upx solid;
	}

	.zanshang-image+.zanshang-image {
		margin-left: -40upx;
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

	.cz_ds_btn {
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

	.ye_ds_text {
		margin-top: 10px;
		padding-top: 10px;
		width: 100%;
		height: 30px;
		text-align: center;
		font-size: 14px;
		color: #FFFFFF;
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



	.center-content-center {
		margin: 20upx 3% 0;
		font-size: 26upx;
		//height: 100upx;
		//background-color: #007AFF;
	}

	.center-content-text .more {
		display: inline-block;
		width: 80upx;
		height: 40upx;
		line-height: 40upx;
		border-radius: 10upx;
		color: #FFFFFF;
		text-align: center;
		font-size: 24upx;
		margin-right: 10upx;
		background-color: #007AFF;
	}

	.center-content-text {
		font-size: 28upx;
		margin-bottom: 20upx;
		color: #FFFFFF;
		//background-color: #009688;
		padding-top: 10upx;
	}

	.center-top-img {
		width: 110upx;
		height: 110upx;
		position: absolute;
		left: 3%;
		margin-top: -22upx;
		z-index: 3;
	}

	.imgBox {
		display: inline-block;
		text-indent: 0;
		width: 31% !important;
		margin-right: 1%;
		margin-left: 1%;
		padding-top: 31% !important;
		margin-bottom: 1%;
		overflow: hidden;
		border-radius: 5px;
		height: 0;
		position: relative;
		//background-color: #007AFF;
	}

	.imgBoxA {
		width: 48% !important;
		margin-right: 1%;
		margin-left: 1%;
		padding-top: 48% !important;
	}

	.imgBoxB {
		width: 100% !important;
		margin-right: 0;
		margin-left: 0;
		padding-top: 100% !important;
	}

	._imgmore {
		position: absolute;
		left: 0;
		top: 0;
		text-indent: 0;
		width: 100% !important;
		height: 100% !important;
		overflow: hidden;
		border-radius: 5px;
		//background-color: #007AFF;
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
</style>
