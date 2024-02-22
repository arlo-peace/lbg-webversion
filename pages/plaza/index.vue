<template>

	<view class="content" :style="{height:(phone.safeArea.top + contentTop)+'px'}">
		<css-loading ref="cssLoading"></css-loading>
		<view class="content-head">
			<view class="city-box-dingwei">
				<view class="city-box-pic-text">
					<image src="../../static/img/dingwei.png"></image>
					<text>{{userInfo.city ? userInfo.city : city}}</text>
				</view>
				<view class="city-box-pic-text">
					<image></image>
					<text></text>
				</view>
				<view class="city-box-pic-text">
					<image></image>
					<text></text>
				</view>
				<view class="city-box-pic-text">
					<image></image>
					<text></text>
				</view>
			</view>
		</view>
		<view class="top-total" :style="{top:(phone.safeArea.top + contentTop - 59)+'px'}">
			<scroll-view class="center-scroll" scroll-x="true">
				<view class="top-total-box" @click="openimagelist()">
					<image src="/static/imgs/guanfnag-pic1.jpg"></image>
					<view>官方认证资源</view>
				</view>
				<view v-for="(m, i) in typeList" :key="i" class="top-total-box" @click="changeTag(m.id)">
					<image :src="m.icon"></image>
					<view>{{m.name}}({{m.count}})</view>
				</view>
			</scroll-view>
		</view>
		<view class="head-top" :style="{'padding-top':(phone.safeArea.top + contentTop + 90)+'px'}">
			<view class="top-two">
				<view @click="setTabId(1)">
					<text :class="tabId==1?'sel':''">推荐</text>
				</view>
				<view @click="setTabId(2)">
					<text :class="tabId==2?'sel':''">最新</text>
				</view>
				<view @click="setTabId(3)">
					<text :class="tabId==3?'sel':''">关注</text>
				</view>
				<view @click="setTabId(4)">
					<text :class="tabId==4?'sel':''">同城约P</text>
				</view>
				<view class="right" style="padding-right:15upx;margin-top:5upx;" @click="goSend">
					<text class="send-content">+ 发帖</text>
				</view>
			</view>
		</view>
		<view class="center-content"
			:style="{'margin-top':(phone.safeArea.top + contentTop + 160)+'px','padding-bottom':'55px'}">
			<view style="width:100%;overflow: hidden;">
				<view class="center-content-item" v-for="(m, i) in msgList" :key="i">
					<view v-if="m.type==0">
						<view class="center-top">
							<image class="center-top-img" @click="goHome(m.uid)" src="@/static/plaza/top2.png"
								mode="aspectFill" v-if="m.isTop"></image>
							<image class="tx left" @click="goHome(m.uid)" :src="m.headimgurl" mode="aspectFill"></image>
							<view class="username">
								<view style="height:56upx;line-height:65upx;font-weight:bold;color:#FFFFFF;">
									<text v-if="m.username">{{m.nickname}} <text style="font-size:12px;"
											v-if="m.nickname.length < 6">({{m.username}})</text></text>
									<text v-else>* 保密 *</text>
								</view>
								<view style="font-size:12px;color:#999;">
									{{utils.timeTodate('Y年m月d日 H:i',m.add_time)}}
								</view>
							</view>
							<view class="go-home right" v-if="m.isMe && tabId > 1">
								<image class="left" src="@/static/live/_my.png" mode="aspectFill"></image>
								<text>我的</text>
							</view>
							<view class="go-home right" @click="showIntroduction('bottom','guanzhu',m.id,m.uid,m.focus)"
								v-if="!m.isMe && tabId > 1">
								<image class="left" src="@/static/plaza/home.png" mode="aspectFill"></image>
								<text>私信</text>
							</view>
							<!--<view class="go-home right" @click="goHome(m.uid)" v-if="!m.isMe && tabId > 1">
								<image class="left" src="@/static/plaza/home.png" mode="aspectFill"></image>
								<text>主页</text>
							</view>
							<view class="go-home right" @click="postMsg(m.uid)" v-if="!m.isMe && tabId > 1">
								<image class="left" src="@/static/plaza/home.png" mode="aspectFill"></image>
								<text>私信</text>
							</view> -->
							<view class="go-home right" @click="editContent(m)" v-if="m.status==0 && tabId==1">
								<image class="left" src="@/static/live/settings.png" mode="aspectFill"></image>
								<text>审核中</text>
							</view>
						</view>
						<view class="center-content-center">
							<!--文字内容-->
							<view class="center-content-text" @click="goInfo(m)">
								<text v-if="m.tag" style="color:rgba(255, 12, 208, 0.8)">#{{m.tag}}#</text>{{m.text}}
							</view>
							<image v-if="m.allImg.length==1" v-for="(mm, ii) in m.allImg" :src="mm"
								@click="TanPreviewImage(mm,m)" :key="ii" class="_imgmore1" mode="aspectFill"></image>
							<image v-if="m.allImg.length==2" v-for="(mm, ii) in m.allImg" :src="mm"
								@click="TanPreviewImage(mm,m)" :key="ii" class="_imgmore2" mode="aspectFill"></image>
							<image v-if="m.allImg.length >2" v-for="(mm, ii) in m.allImg" :src="mm"
								@click="TanPreviewImage(mm,m)" :key="ii" class="_imgmore" mode="aspectFill"></image>
						</view>
						<view class="dashang-head-list">
							<view class="avatar-list-stacked">
								<view class="avatar" v-for="(mm, ii) in m.gratuity_recordList"
									@click="godashang(mm.id,m.id)" :key="ii"
									:style="{backgroundImage:'url('+mm.headImg+')'}">
								</view>
							</view>
						</view>

						<view class="bottom-view-flex">
							<view class="bottom-4pic-text" @click="dianzhanPost(m.id,1)">
								<image style="margin-left: 15rpx;"
									:src="m.pstatus==0?'../../static/imgs/like.png':'../../static/imgs/like_un.png'">
								</image>
								<text>{{m.good || 0}}</text>
							</view>
							<view class="bottom-4pic-text" style="width: 960rpx;">
								<image src="/static/imgs/click1.png"></image>
								<text>{{m.click || 0}}次阅读</text>
							</view>
							<view class="bottom-4pic-text" @click="showIntroduction('bottom','introduction',m.id)">
								<image style="margin-left: 40rpx;" src="@/static/imgs/comment_title_icon.png"></image>
								<text>{{m.comment || 0}}</text>
							</view>
							<view class="bottom-4pic-text" @click="showIntroduction('center','dashang',m.id,m.uid)">
								<image style="margin-left: 40rpx;" src="@/static/imgs/gold.png"></image>
								<text>{{m.gratuity_record || 0}}</text>
							</view>
						</view>

						<!--<view class="content-bottom" @click="goInfo(m)">
							<text>@ 共{{m.comment}}条评论</text>
							<image class="msg" src="@/static/plaza/msg.png"></image>
						</view>
						-->
					</view>
					<!--广告位-->
					<view class="plaza-ad" @click="skipUrl(m.url, 'web')" v-if="m.type==1 && tabId>1">
						<image :src="m.img" mode="aspectFill" :style="{'height':m.height+'px'}"></image>
					</view>

				</view>

				<view class="moreTig" v-if="isMoreTig">——— 我是有底线的 ———</view>
			</view>

			<view style="width:100%;text-align:center;" :style="{'margin-top':(phone.windowHeight/2) - 100 +'px'}"
				v-if="isShowTig">
				<image src="/static/empty.png" style="width:100px;height:100px;"></image>
				<view style="width:100%;font-size:25upx;color:#666;margin-top:30upx;">本页面暂无内容</view>
			</view>

			<!--评论弹出列表开始-->
			<uni-popup ref="showintroduction" :type="popType">
				<view v-if="viewType==1" class="pinglun_lb">
					<scroll-view class="center-scroll" scroll-y="true" style="max-height: 600rpx;">
						<view v-for="(c, i) in commentList" :key="i" class="pinglun_lb_box">
							<image :src="c.member.headimgurl" mode="aspectFill"
								style="width: 50px;height: 50px;border-radius: 50%;float: left;"></image>
							<view style="width: 78%;padding-left: 5px;float: left;">
								<view class="pinglun_name_dianzhan">{{c.member.nickname}}({{c.member.username}})
									<image v-if="c.iszan==0" src="../../static/img/dianzhan_.png"
										@click="dianzhanPost(userId,c.id,2)" class="pinglun_lb_box_dz"></image>
									<image v-if="c.iszan==1" src="../../static/img/dianzhan_ok.png"
										@click="dianzhanPost(userId,c.id,2)" class="pinglun_lb_box_dz"></image>
									<text>{{c.good}}</text>
								</view>
								<view> <text
										style="font-size: 12px;line-height: 12px;color:#A9A9A9;">{{c.add_time}}</text>
								</view>
								<view class="pinglun-text">{{c.content}}</view>

							</view>
							<view class="line"></view>
						</view>
					</scroll-view>
					<view class="send-comment">
						<input type="text" @input="setContent" :value="content" placeholder="我也来说几句" :maxlength="150"
							:cursor-spacing="10" />
						<text class="btn right" @click="sendPostComment">评论</text>
					</view>

				</view>
				<!--评论弹出列表结束-->
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
					<view class="ye_ds_text">余额:￥{{userInfo.corn}}</view>
					<view class="tc_ds_btn_3">
						<view class="ds_btn" @click="gochongzhi()" v-if="userInfo.corn ==0">余额不足,立即充值</view>
						<view class="chongzhi_btn" @click="gotopay()" v-if="userInfo.corn >0">我要打赏</view>
					</view>
					<view @click="cancel('dashang')" class="tc_ds_btn_2">下次再说吧!</view>
				</view>
				<!--打赏弹出层结束-->
				<!--三个小点开始-->
				<view v-if="viewType==3" style=" width: 100%; height:220px;border-radius: 5px;">
					<view style="width: 85%;height: 130px;background:#20202c;margin: 0 auto;border-radius: 5px;">
						<view @click="gotoGuanzhuan()"
							style="height:30px; text-align: center;padding-top: 10px;font-size: 14px;"
							:style="isFocus == 0 ? 'color: #1AAD19;' : 'color:#ffffff;'">
							{{isFocus == 1 ? '取消关注' : '关注'}}
						</view>
						<view class="gline"></view>
						<view @click="postMsg(1)"
							style="height:30px; text-align: center;padding-top: 10px;color:#ffffff;font-size: 14px;">私信
						</view>
						<view class="gline"></view>
						<view @click="postMsg(2)"
							style="height:30px; text-align: center;padding-top: 10px;color:red;font-size: 14px;">举报
						</view>
					</view>
				</view>
				<!--三个小点结束-->
				<!--广场提示开通VIP开始-->
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
				<!--广场提示开通VIP结束-->
			</uni-popup>


			<neil-modal :show="isNotice" @confirm="confirm" @close="closeNotice"
				:title="'请输入'+(msgType==1 ? '私信' : '举报')+'内容'" confirm-text="提交数据" cancel-text="我再想想">
				<view style="min-height:90upx;padding:24upx 30upx 10upx;">
					<view><input class="input" type="text" :value="value" maxlength="15" @input="inputUserInfo"
							:placeholder="'请输入'+(msgType==1 ? '私信' : '举报')+'内容'" /></view>
				</view>
			</neil-modal>
		</view>
		<!--<view class="tabbar">
			<view class="tabbar-box">
				<view class="tabbar-border"></view>
				<view class="tabbar-item">
					<view class="tabbar-item-box" @click="api.jumpUrl('/pages/video/class','tab')">
						<image class="tabbar-item-box-icon" src="../../static/tabbar/home.png"></image>
						<text class="tabbar-item-box-label">首页</text>
					</view>
				</view>
				<view class="tabbar-item">
					<view class="tabbar-item-box" @click="api.jumpUrl('/pages/index/index','tab')">
						<image class="tabbar-item-box-icon" src="../../static/tabbar/class.png"></image>
						<text class="tabbar-item-box-label">短视频</text>
					</view>
				</view>
				<view class="tabbar-item tabbar-item-middle"
					@click="api.jumpUrl('/pages/recharge/recharge?type=2','tab')">
					<view class="tabbar-item-box-icon">
						<image src="../../static/tabbar/svip.png"></image>
					</view>
					<view class="tabbar-item-box">
						<view class="tabbar-item-box-icon"></view>
						<text class="tabbar-item-box-label">充值</text>
					</view>
				</view>
				<view class="tabbar-item">
					<view class="tabbar-item-box" @click="api.jumpUrl('/pages/game/game_list','tab')">
						<image class="tabbar-item-box-icon" src="../../static/tabbar/game.png"></image>
						<text class="tabbar-item-box-label">活动</text>
					</view>
				</view>
				<view class="tabbar-item">
					<view class="tabbar-item-box" @click="api.jumpUrl('/pages/member/member','tab')">
						<image class="tabbar-item-box-icon" src="../../static/tabbar/my.png"></image>
						<text class="tabbar-item-box-label">我的</text>
					</view>
				</view>
			</view>
			<view class="uni-placeholder" style="height:50px;"></view>
		</view> !-->
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
				api: api,
				loading: true,
				isLogin: false,
				isNotice: false,
				value: '',
				city: '上海',
				userId: 0,
				to_uid: 0,
				post_id: 0,
				top: 0,
				phone: {},
				tabId: 2,
				contentTop: 35,
				isShowTig: false,
				isFocus: false,
				typeList: [],
				userInfo: [],
				msgList: [],
				page: 1,
				mtype: 0,
				msgType: 0,
				isMoreTig: false,
				loadingHieght: 100,
				headTop: 0,
				h5Top: 0,
				popType: 'bottom',
				viewType: 0,
				commentList: [],
				content: '',
				ds_amount: '10',
				ds_content: '',
				newTop: 0,
				did: 0,
				lastId: 0
			}
		},
		onLoad(e) {
			_self = this;
			_self._showLoading()
			_self.isLogin = api.getLogins();
			if (_self.isLogin) _self.userId = _self.isLogin.userId;
			_self.phone = uni.getSystemInfoSync();
			_self.top = 10;
			_self.contentTop = _self.top + 90;
			_self.loadingHieght = _self.phone.windowHeight - _self.top;
			_self.newTop = _self.phone.safeArea.top + _self.contentTop + 100
			// #ifdef H5
			_self.newTop = _self.phone.safeArea.top + _self.contentTop + 60
			_self.headTop = 44;
			_self.h5Top = 30;
			// #endif
			_self.getUserInofo();
			_self.getCity()
			_self.getData();
			uni.getStorage({
				key: 'mobileDid_' + api.appkey,
				success: (res) => {
					_self.did = res.data.data;
					if (!_self.did) _self.did = res.data;
				}
			});
		},
		onHide() {
			_self.one = true;
		},
		onShow() {
			_self.isLogin = api.getLogins();
			if (_self.one) {
				if (_self.isLogin) _self.userId = _self.isLogin.userId;
				//_self.getData();
			}
		},
		methods: {
			TanPreviewImage(imageUrl, e) {
				if (!_self.userInfo.isVip && e.isVip == 1 && !e.isMe) {
					_self.viewType = 4;
					_self.popType = "center";
					_self.togglePopup('center', 'introduction');
					return false;
				}

				var images = [];
				images.push(imageUrl);
				for (var i in e.allImg) {
					if (e.allImg[i] != imageUrl) {
						images.push(e.allImg[i]);
					}
				}
				if (_self.lastId != e.id) {
					uni.request({
						url: api.apiData.clickPost,
						method: 'POST',
						data: {
							userId: _self.userId,
							post_id: e.id
						},
						header: {
							'Content-type': 'application/x-www-form-urlencoded'
						},
						success: () => {
							_self.lastId = e.id
							e.click++
						},
						fail: () => {
							api.showToast("服务器连接失败，请检查网络是否正常", 3000);
						}
					});
				}
				uni.previewImage({ // 预览图片  图片路径必须是一个数组 => ["http://192.168.100.251:8970/6_1597822634094.png"]
					current: 0,
					urls: images,
					longPressActions: { //长按保存图片到相册
						itemList: ['保存图片'],
						success: (data) => {
							uni.saveImageToPhotosAlbum({ //保存图片到相册
								filePath: payUrl,
								success: function() {
									uni.showToast({
										icon: 'success',
										title: '保存成功'
									})
								},
								fail: (err) => {
									uni.showToast({
										icon: 'none',
										title: '保存失败，请重新尝试'
									})
								}
							});
						},
						fail: (err) => {
							console.log(err.errMsg);
						}
					}
				});
			},
			getCity() {
				uni.getLocation({
					type: 'wgs84',
					geocode: true,
					success: function(res) {
						if (typeof res.address != 'undefined') {
							_self.city = res.address.city
							if (_self.city != 'undefined') {
								uni.request({
									url: api.apiData.updateCity,
									method: 'POST',
									data: {
										userId: _self.userId,
										city: _self.city
									},
									header: {
										'Content-type': 'application/x-www-form-urlencoded'
									},
									fail: () => {
										api.showToast("服务器连接失败，请检查网络是否正常", 3000);
									}
								});
							}
						}
					}
				});
			},
			// 提示
			msgData(title = '', times = 1000, style = 'none') {
				_self._hideLoading()
				setTimeout(() => {
					uni.showToast({
						icon: style,
						title: title,
						mask: true,
						duration: times
					})
				}, 200)
			},
			// 提交保存
			confirm(type = 0) {
				if (!_self.userInfo.isVip) {
					api.showToast("你不是VIP用户,不可以发送私信!", 2000);
					return false;
				}
				_self.msgData("处理中...");
				var content = _self.value;
				var postUrl = api.apiData.toPostNews;
				var data = {
					to_uid: _self.to_uid,
					uid: _self.userId,
					content: content,
					type: _self.msgType
				}
				uni.request({
					url: postUrl,
					method: 'POST',
					data: data,
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						if (e.data.Code == 200) {
							_self.value = "";
							_self.msgData("发送成功");
						}
					},
					fail: () => {
						_self.msgData("服务器连接失败，请检测网格是否正常");
					}
				});
			},
			gotoGuanzhuan() {
				uni.request({
					url: api.apiData.goToGuanzhu,
					method: 'POST',
					data: {
						to_uid: _self.to_uid,
						uid: _self.userId,
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var r = e.data;
						api.showToast(r.Msg, 2000);
						_self.content = '';
						_self.getData();
						setTimeout(() => {
							_self.cancel('guanzhu');
						}, 500);

					},
					fail: () => {
						// 加载失败提示
						api.showToast("服务器连接失败，请检查网络是否正常", 3000);
					},
					complete: () => {
						setTimeout(() => {
							_self.loading = false;
						}, 500);
					}
				});
			},
			// 获取用户输入的信息
			inputUserInfo(e) {
				_self.value = e.detail.value;
			},
			// 取消
			closeNotice() {
				_self.isNotice = false;
			},
			// 弹出修改框
			postMsg(msgType) {
				_self._showLoading('加载中...');
				_self.isNotice = true;
				_self.msgType = msgType
				_self.cancel(1)
				_self._hideLoading();
			},
			sendPostComment() {
				if (!_self.isLogin) {
					api.showToast('请登录后再发来帖');
					setTimeout(() => {
						_self.skipUrl('/pages/login/login', 'new');
					}, 500);
					return;
				}
				if (_self.content.length < 1) {
					api.showToast('请输入评论内容', 1500);
					return;
				}
				_self._showLoading('发布中...');
				uni.request({
					url: api.apiData.sendComment,
					method: 'POST',
					data: {
						post_id: _self.post_id,
						userId: _self.userId,
						content: _self.content,
						pid: 0
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var r = e.data;
						api.showToast(r.Msg, 2000);
						_self.content = '';
						_self.getData();
						_self.content = '';
						setTimeout(() => {
							_self.cancel('introduction');
						}, 500);
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
			backUrl() {
				api.jumpUrl('/pages/member/member', 'tab');
			},
			cancel(type) {
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

				if (_self.ds_amount > _self.userInfo.k_money) {
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
						post_id: _self.post_id,
						uid: _self.userId,
						content: _self.ds_content,
						to_uid: _self.to_uid,
						amount: _self.ds_amount
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var r = e.data;
						api.showToast(r.Msg, 1500);
						_self.getData();

						_self.content = '';
						setTimeout(() => {
							_self.cancel('dashang');
							//_self.skipUrl('/pages/recharge/recharge', 'new');
						}, 1000);

					},
					fail: () => {
						// 加载失败提示
						api.showToast("服务器连接失败，请检查网络是否正常", 3000);
					},
					complete: () => {
						setTimeout(() => {
							_self.loading = false;
						}, 500);
					}
				});
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
			showIntroduction(b, e, tid, to_uid, isFocus) {
				if (!_self.isLogin) {
					api.showToast('请登录后再操作');
					setTimeout(() => {
						_self.skipUrl('/pages/login/login', 'new');
					}, 500);
					return;
				}
				_self.post_id = tid;
				_self.to_uid = to_uid;
				_self.isFocus = isFocus
				if (e == "dashang") {
					_self.viewType = 2;
					_self.getUserInofo();
				} else if (e == "guanzhu") {
					_self.viewType = 3;
				} else {
					_self.viewType = 1;
				}
				_self.popType = b;

				_self.getCommentListData(tid);
				_self.togglePopup(b, e);

			},
			getCommentListData() {
				//if(_self.page > 1) uni.showLoading({ title:'正在载加...',mask:true });
				uni.request({
					url: api.apiData.getComment,
					method: 'POST',
					data: {
						post_id: _self.post_id,
						userid: _self.userId
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						//console.log(e)
						var r = e.data;
						if (r.Code == 201) {
							api.showToast(r.Msg, 2000);
							return
						}
						_self.commentList = r.Data;
						//console.log(_self.commentList)
						_self.commentCount = _self.commentList.length;
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
			togglePopup(type, open) {
				this.msgType = type
				this.$nextTick(() => {
					this.$refs['showintroduction'].open()
				})
			},
			dianzhanPost(tid, type) {

				if (!_self.isLogin) {
					api.showToast('请登录后再发来帖');
					setTimeout(() => {
						_self.skipUrl('/pages/login/login', 'new');
					}, 500);
					return;
				}
				uni.request({
					url: api.apiData.likePost,
					method: 'POST',
					data: {
						postid: tid,
						userId: _self.userId,
						type: type
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						//console.log(e)
						var res = e;
						if (res.data.Code == 200) {
							uni.showModal({
								content: res.data.Msg,
								showCancel: false
							});

						} else {
							uni.showModal({
								content: res.data.Msg,
								showCancel: false
							});
						}
						_self.page = 1;
						_self.getData();
						if (type == 2) {
							_self.getCommentListData();
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
			changeTag(tagid) {
				_self.tabId = 2;
				_self.page = 1;
				_self.mtype = tagid;
				_self.loading = true;
				_self.msgList = [];
				_self.getData();
			},
			openimagelist() {
				_self.skipUrl('/pages/image/list', 'new');
			},
			moveHandle() {},
			goInfo(e) {
				_self.getUserInofo();

				if (!_self.userInfo.isVip && e.isVip == 1 && _self.userInfo['id'] != e.uid) {
					_self.viewType = 4;
					_self.popType = "center";
					_self.togglePopup('center', 'introduction');
					return false;
				}

				uni.setStorage({
					key: 'info_content_' + api.appkey,
					data: e,
					success: () => {
						_self.skipUrl('/pages/plaza/info?t=1', 'new');
					},
					fail: () => {
						api.showToast('数据加载失败，请退出重试', 2000);
					}
				});
			},
			openVIP() {
				_self.skipUrl('/pages/recharge/recharge?type=2', 'new');
			},
			editContent(e) {
				//console.log(e)
				uni.setStorage({
					key: 'edit_content_' + api.appkey,
					data: e,
					success: () => {
						_self.skipUrl('/pages/plaza/send?t=1', 'new');
					},
					fail: () => {
						api.showToast('数据加载失败，请退出重试', 2000);
					}
				});
			},
			goHome(uid) {
				if (uid == 0) {
					api.showToast('模拟数据，请重启APP', 2000);
					return
				}
				var param = {
					url: '/pages/plaza/index',
					t: 'new'
				}
				_self.skipUrl('/pages/member/home_page?type=' + JSON.stringify(param) + '&uid=' + uid, 'new');
			},
			goSend() {
				if (!_self.isLogin) {
					api.showToast('请登录后再发来帖');
					setTimeout(() => {
						_self.skipUrl('/pages/login/login', 'new');
					}, 500);
				} else {
					_self.skipUrl('/pages/plaza/send?t=0', 'new');
				}
			},
			setTabId(t) {
				if (t == 1) {
					if (!_self.isLogin) {
						api.showToast('请登录后再发来帖');
						setTimeout(() => {
							_self.skipUrl('/pages/login/login', 'new');
						}, 500);
						return;
					}
				}
				_self.tabId = t;
				_self.page = 1;
				_self.loading = true;
				_self._showLoading()
				_self.msgList = [];
				_self.getData();
			},
			getData() {
				if (_self.page > 1) _self._showLoading('正在加载...');
				uni.request({
					url: api.apiData.getPlazaList,
					method: 'POST',
					data: {
						page: _self.page,
						order: _self.tabId,
						uid: _self.userId,
						mtype: _self.mtype,
						city: _self.city
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var r = e.data;
						if (r.Code == 200) {
							var msgList = r.Data.list;
							_self.typeList = r.Data.typeList
							if (_self.page > 1) {
								if (msgList.length > 0) {
									_self.isMoreTig = false;
									_self.msgList = _self.msgList.concat(msgList);
								} else {
									_self.isMoreTig = true;
								}
							} else {
								_self.isMoreTig = false;
								_self.msgList = msgList;
								_self.isShowTig = msgList.length == 0 ? true : false;
							}
						} else {
							api.showToast(r.Msg, 2000);
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
			set_ds_content(e) {
				_self.ds_content = e.detail.value;
			},
			gochongzhi() {
				_self.skipUrl('/pages/recharge/recharge?type=1', 'new');
			},
			// 跳转登录
			skipUrl(uri = '/pages/login/login', type = 'new') {
				api.jumpUrl(uri, type)
			},
			godashang(touid, post_id) {
				_self.skipUrl('/pages/plaza/dashang?touid=' + touid + "&post_id=" + post_id, 'new');
			},
		},
		onPullDownRefresh() {
			_self.page = 1;
			_self.getData();
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			_self.page++;
			_self.getData();
		},
		onBackPress(e) {
			api.jumpUrl('/pages/video/class', 'tab');
			return true;
		}
	};
</script>

<style>
	@import url('@/components/loading/loading.css');

	.avatar-list-stacked .avatar {
		box-shadow: 0 0 0 1px #fff;
	}

	.avatar-list-stacked .avatar {
		margin-right: -1.3em !important;
	}

	.avatar {
		width: 30px;
		height: 30px;
		line-height: 20rem;
		display: inline-block;
		background: #2ddcd3 no-repeat center/cover;
		position: relative;
		text-align: center;
		color: #fff;
		font-weight: 600;
		vertical-align: bottom;
		font-size: .875rem;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		border-radius: 50%;
	}

	.only_vip {
		width: 100%;
		text-align: center;
	}

	.only_vip image {
		width: 600upx;
		height: 200upx;
	}

	.uni-popup {
		z-index: 999;
	}

	.head-placeholder {
		height: var(--status-bar-height);
		padding-top: 5upx;
		box-sizing: content-box;
		position: fixed;
		z-index: 99;
	}

	.content-head {
		position: fixed;
		top: -6px;
		z-index: 9999;
		width: 100%;
		height: 50upx;
	}

	.plaza-ad image {
		margin: -20upx 0 -25upx 0 !important;
		width: 100%;
		border-radius: 15upx;
	}

	.moreTig {
		text-align: center;
		color: #ccc;
		font-size: 25upx;
		margin-top: 26upx;
		padding-bottom: 30upx;
		//background: #007AFF;
		//padding-bottom: 30px;
	}

	.send-content {
		color: #FFFFFF;
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		border-radius: 10upx;
		padding: 6upx 16upx;
		font-size: 12px;
	}

	.content-bottom .msg {
		width: 35upx;
		height: 30upx;
		margin-bottom: -5upx;
		margin-left: 5upx;
		//display: inline-block;
	}

	.content-bottom {
		margin: 20upx 3% 5upx;
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 10upx;
		font-size: 26upx;
		color: #999;
		height: 60upx;
		line-height: 60upx;
		padding: 5upx;
		box-sizing: border-box;
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
	}

	.center-top-img {
		width: 110upx;
		height: 110upx;
		position: absolute;
		left: 3%;
		margin-top: -22upx;
		z-index: 3;
	}

	.center-content-center {
		margin: 20upx 3% 0;
		font-size: 26upx;
		//height: 100upx;
		//background-color: #007AFF;
	}

	.center-top .go-home image {
		width: 40upx;
		height: 40upx;
		margin: 15upx 5upx;
	}

	.center-top .go-home {
		height: 70upx;
		line-height: 70upx;
		//padding: 0 20upx;
		font-size: 26upx;
		//border-radius: 10upx;
		margin: 14upx 14upx;
		color: #FFFFFF;
		//background-image: linear-gradient(to right,rgba(255,12,208,0.8), rgba(254,67,101,0.8));
	}

	.username view {
		display: block;
		color: #000000;
		font-size: 30upx;
		height: 38upx;
		line-height: 30upx;
	}

	.username .author {
		display: inline-block;
		margin-left: 10upx;
		height: 40upx;
		line-height: 40upx;
		width: 40upx;
		text-align: center;
		border-radius: 50%;
		color: #FFFFFF;
		font-size: 20upx;
		background-image: linear-gradient(to right, rgba(255, 12, 208, 0.8), rgba(254, 67, 101, 0.8));
	}

	.center-top .username {
		display: inline-block;
		margin-left: 20upx;
		height: 94upx;
		line-height: 94upx;
	}

	.center-top .tx {
		width: 90upx;
		height: 90upx;
		border-radius: 50%;
		border: 1px solid rgba(255, 12, 208, 0.8);
	}

	.center-top {
		width: 94%;
		//background-color: #007AFF;
		margin: 0 3%;
	}

	.center-content-item {
		width: 92%;
		background-color: rgba(255, 255, 255, 0.03);
		margin: 0 4% 20upx;
		border-radius: 15upx;
		padding: 20upx 0;
	}

	.center-content {
		margin-bottom: 60upx;
	}

	.head-top .top-two image {
		width: 72upx;
		height: 30upx;
		margin-left: 10upx;
	}

	.head-top .top-two .sel {
		border-bottom: 3px solid #FFFFFF;
		color: #FFFFFF;
		//font-weight: bold;
	}

	.head-top .top-two view {
		display: inline-block;
		text-align: center;
		color: #999999;
		font-size: 30upx;
		border-bottom: 3px solid #20202C;
		margin-right: 40upx;
		//font-weight: bold;
	}

	.head-top {
		position: fixed;
		top: 0;
		/* left: 0; */
		z-index: 9;
		width: 100%;
		padding: 0 28upx 20upx;
		//height: 35px;
		background-color: #20202C;
		box-shadow: 4px 4px 6px 0px rgba(103, 103, 103, 0.1);
	}

	.content {
		width: 100%;
	}

	.left {
		float: left;
	}

	.right {
		float: right;
	}

	.top-total {
		position: fixed;
		width: 100%;
		text-align: left;
		background-color: #20202C;
		margin: 0 auto;
		clear: both;
		z-index: 999;
		height: 140px;
	}

	.center-scroll {
		white-space: nowrap;
	}

	.top-total-box {
		margin: 10upx;
		width: 29%;
		height: 100px;
		padding: 5upx;
		display: inline-block;
		_display: inline;
		*display: inline;
		zoom: 1;
		text-align: center;
		border-radius: 5px;
		background: rgba(255, 255, 255, 0.03);
	}

	.top-total-box image {
		width: 100%;
		height: 100%;
		border-radius: 10px;
	}

	.top-total-box view {
		color: #fff;
		font-size: 14px;
	}

	.top-total-box text {
		color: #fff;
		font-size: 14px;
	}

	.more-box {
		width: 100%;
		height: 50upx;
		line-height: 50upx;
	}

	.more-box-item {
		width: 20%;
		color: #fff;
		font-size: 12px;
		display: inline-block;
		line-height: 50upx;
		vertical-align: middle;
	}

	.more-box-item-second {
		width: 30%;
	}

	.more-box-item image {
		width: 14px;
		height: 14px;
		vertical-align: middle;
		margin-right: 5px;
	}

	.more-box-item-last {
		float: right;
		text-align: right;
	}

	.send-comment .btn {
		display: inline-block;
		color: #FFFFFF;
		font-size: 26upx;
		height: 30px;
		width: 20%;
		line-height: 30px;
		border-radius: 30px;
		text-align: center;
		margin-right: 5%;
		margin-top: 10px;
		background-image: linear-gradient(to right, rgba(255, 12, 208, 0.8), rgba(254, 67, 101, 0.8));
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

	.send-comment input {
		height: 30px;
		width: 60%;
		border: 1px solid #333;
		margin: 9px 0 0 5%;
		border-radius: 36px;
		padding: 0 20upx;
		font-size: 26upx;
		color: #999;
		background-color: #1D1D28;
		display: inline-block;
	}

	.send-comment {
		width: 100%;
		height: 50px;
		background-color: #20202C;
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

	.tabbar {
		display: block;
		box-sizing: border-box;
		width: 100%;
		z-index: 998;
		position: fixed;
		left: var(--window-left);
		right: var(--window-right);
	}

	.tabbar .tabbar-box {
		background-color: rgb(29, 29, 40);
		bottom: 0;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		position: fixed;
		left: var(--window-left);
		right: var(--window-right);
		display: flex;
		z-index: 998;
		box-sizing: border-box;
	}

	.tabbar .tabbar-box .tabbar-border {
		background-color: rgba(0, 0, 0, 0.33);
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 1px;
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
	}

	.tabbar .tabbar-box .tabbar-item {
		flex-direction: column;
		flex: 1;
		font-size: 0;
		text-align: center;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.tabbar .tabbar-box .tabbar-item.tabbar-item-middle {
		flex: 0 0 50px;
		position: relative;
	}

	.tabbar .tabbar-box .tabbar-item .tabbar-item-box {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		cursor: pointer;
		position: relative;
	}

	.tabbar .tabbar-box .tabbar-item.tabbar-item-middle .tabbar-item-box-icon {
		display: flex;
		justify-content: center;
		position: absolute;
		bottom: 0;
		background-size: 100% 100%;
		width: 50px;
		height: 64px;
	}

	.tabbar .tabbar-box .tabbar-item.tabbar-item-middle .tabbar-item-box-icon image {
		width: 40px;
		height: 40px;
	}

	.tabbar .tabbar-box .tabbar-item .tabbar-item-box .tabbar-item-box-icon {
		position: relative;
		display: inline-block;
		margin-top: 5px;
		width: 24px;
		height: 24px;
	}

	.tabbar .tabbar-box .tabbar-item .tabbar-item-box .tabbar-item-box-label {
		position: relative;
		text-align: center;
		color: rgb(138, 138, 138);
		font-size: 12px;
		line-height: normal;
		margin-top: 3px;
	}

	._imgmore {
		display: inline-block;
		text-indent: 0;
		width: 31% !important;
		margin-right: 1%;
		margin-left: 1%;
		height: 120px !important;
		overflow: hidden;
		border-radius: 5px;
		//background-color: #007AFF;
	}

	._imgmore1 {
		display: inline-block;
		text-indent: 0;
		width: 100% !important;
		height: 260px !important;
		overflow: hidden;
		border-radius: 5px;
		//background-color: #007AFF;
	}

	._imgmore2 {
		display: inline-block;
		text-indent: 0;
		width: 48% !important;
		margin-left: 1.3%;
		height: 180px !important;
		overflow: hidden;
		border-radius: 5px;
		//background-color: #007AFF;
	}

	.pinglun_img {
		width: 100%;
		margin-top: 5px;
		margin-bottom: 10px;
		margin-left: 10px;
	}

	.pinglun_img image {
		width: 30px;
		height: 30px;
		float: left;
		border-radius: 30px;
	}

	.dashang-head-list {
		width: 100%;
		margin-top: 5px;
		margin-bottom: 10px;
		margin-left: 20px;
	}

	.pinglun_lb {
		background: #20202C;
		width: 92%;
		margin-bottom: 20%;
		position: relative;
		overflow-y: scroll;

		left: 4%;
		border-radius: 15px; //圆角尺度
		z-index: 999;
		-webkit-overflow-scrolling: touch;
		white-space: nowrap;

	}

	.pinglun_lb_box {
		width: 90%;
		padding: 10px;
		background: #20202C;
		color: #F0F8FF;
		text-overflow: ellipsis;
	}

	.pinglun_lb_box_dz {
		width: 18px;
		height: 16px;
		margin-right: 4px;

	}

	.pinglun_name_dianzhan {
		font-size: 12px;
		position: relative;
		line-height: 12px;
		position: relative;
	}

	.pinglun_name_dianzhan image {
		left: 98%;
		bottom: 1px;
		position: absolute;
	}

	.pinglun_name_dianzhan text {
		font-size: 12px;
		margin-right: 5px;
		text-align: right;
		position: absolute;
		right: 3px;
		vertical-align: middle;
	}

	.line {
		clear: both;
		text-align: center;
		padding-top: 5px;
		border-bottom: 1px dashed #F0F8FF;
	}

	.pinglun-text {
		font-size: 12px;
		line-height: 22px;
		clear: both;
		/* 清除左右浮动 */
		width: 100%;
		/* 必须定义宽度 */
		word-break: break-word;
		/* 文本行的任意字内断开 */
		word-wrap: break-word;
		/* IE */
		white-space: -moz-pre-wrap;
		/* Mozilla */
		white-space: -hp-pre-wrap;
		/* HP printers */
		white-space: -o-pre-wrap;
		/* Opera 7 */
		white-space: -pre-wrap;
		/* Opera 4-6 */
		white-space: pre;
		/* CSS2 */
		white-space: pre-wrap;
		/* CSS 2.1 */
		white-space: pre-line;
		/* CSS 3 (and 2.1 as well, actually) */
	}

	.city-box-dingwei {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		margin: 20rpx 3% 5rpx;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 18rpx;
	}

	.city-box-pic-text {
		height: 50rpx;
		width: 100%;
		//border: 1px solid #fff;
	}

	.city-box-pic-text image {
		width: 23px;
		vertical-align: middle;
		height: 21px;
		margin-left: 15px;
	}

	.city-box-pic-text text {
		height: 22px;
		vertical-align: middle;
		line-height: 22px;
		margin-left: 5px;
		font-size: 12px;
		padding-top: 15px;
		color: #ffffff;
	}

	.bottom-4pic-text {
		height: 50rpx;
		width: 100%;
		//border: 1px solid #fff;
	}

	.bottom-4pic-text image {
		height: 36rpx;
		width: 36rpx;
		vertical-align: middle;
		margin-right: 8rpx;
	}

	.bottom-4pic-text text {
		vertical-align: middle;
		font-size: 21rpx;
		color: #ffffff;
		height: 50rpx;
		line-height: 50rpx;
	}



	/* 同行显示 水平平均分布 */
	.bottom-view-flex {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		margin: 20rpx 3% 5rpx;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 18rpx;
		height: 65rpx;
	}
	.content-head, .top-total, .head-top{
		max-width: 450px;
	}
</style>
