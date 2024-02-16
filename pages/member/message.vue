<template>
	<view class="bg">

		<view style="width: 100%;height:auto;">
			<view class="image-box" @click="tsetMtype(1)">
				<image v-if="mtype == 1 && !isNotice" src="../../static/img/guanzhu.png"></image>
				<image v-else src="../../static/img/guanzhu_1.png"></image>
				<view :class="{active:mtype == 1 && !isNotice}">关注</view>
				<view class="dot" v-if="newsCount.tab_1 > 0"></view>
			</view>
			<view class="image-box" @click="tsetMtype(2)">
				<image v-if="mtype == 2 && !isNotice" src="../../static/img/mypinglun.png"></image>
				<image v-else src="../../static/img/mypinglun_1.png"></image>
				<view :class="{active:mtype == 2 && !isNotice}">评论</view>
				<view class="dot" v-if="newsCount.tab_2 > 0"></view>
			</view>

			<view class="image-box" @click="tsetMtype(3)">
				<image v-if="mtype == 3 && !isNotice" src="../../static/img/mydashang.png"></image>
				<image v-else src="../../static/img/mydashang_1.png"></image>
				<view :class="{active:mtype == 3 && !isNotice}">打赏</view>
				<view class="dot" v-if="newsCount.tab_3 > 0"></view>
			</view>
			<view class="image-box" @click="tsetMtype(4)">
				<image v-if="mtype == 4 && !isNotice" src="../../static/img/xitong.png"></image>
				<image v-else src="../../static/img/xitong_1.png"></image>
				<view :class="{active:mtype == 4 && !isNotice}">系统</view>
				<view class="dot" v-if="newsCount.tab_4 > 0"></view>
			</view>
			<view class="image-box" @click="postMsg(3)">
				<image v-if="type == 3 && isNotice" src="../../static/img/admin.png"></image>
				<image v-else src="../../static/img/admin_1.png"></image>
				<view :class="{active:type == 3 && isNotice}">在线客服</view>
				<view class="dot" v-if="newsCount.tab_5 > 0"></view>
			</view>
		</view>

		<view style="clear: both;"></view>

		<view v-for="(c, i) in msgList" :key="i" class="head-tx">
			<view class="addtime">{{formatDate(c)}}</view>
			<view class="word_wrap" v-if="mtype == 1">
				<text class="head-tx-main">{{c.content}}</text>
				<text class="head-tx-main" @click="goHome(c.anchor_id)">{{c.nickname}}</text>
			</view>
			<view class="word_wrap" v-else-if="mtype == 2">
				<text class="head-tx-main">我评论了{{c.nickname}}:</text>
				<text class="message-text-content">{{c.content}}</text>
			</view>
			<view class="word_wrap" v-else-if="mtype == 3">
				<template v-if="c.gift_name != '现金'">
					<text class="head-tx-main">我打赏礼物给{{c.nickname}}, {{c.gift_name}} x 1</text>
				</template>
				<template v-else>
					<text class="head-tx-main">我打赏了{{c.nickname}},{{c.price}}金币</text>
					<text class="message-text-content" v-if="c.content">打赏附言:{{c.content}}</text>
				</template>
			</view>
			<rich-text class="word_wrap" v-else :nodes="c.content"></rich-text>
		</view>

		<view style="width:100%;margin-top:400rpx;text-align:center;" v-if="isShowTig">
			<image src="/static/empty.png" style="width:100px;height:100px;"></image>
			<view style="width:100%;font-size:25upx;color:#999;margin-top:30upx;">当前页面暂无内容</view>
		</view>
		<neil-modal :show="isNotice" @confirm="confirm" @close="closeNotice" :title="title" confirm-text="提交数据"
			cancel-text="我再想想">
			<view style="min-height:90upx;padding:24upx 30upx 10upx;">
				<view>
					<input class="input" type="text" :value="value" maxlength="50" @input="inputUserInfo"
						placeholder="请输入留言内容" />
				</view>
			</view>
		</neil-modal>
		<view class="moreTig" v-if="isMoreTig">——— 我是有底线的 ———</view>
		<css-loading ref="cssLoading"></css-loading>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	var _self;
	export default {
		data() {
			return {
				top: 27,
				userId: 0,
				page: 1,
				mtype: 1,
				msgList: [],
				isNotice: false,
				isMoreTig: false,
				isShowTig: false,
				more: false,
				title: '',
				newsCount: {
					tab_1: 0,
					tab_2: 0,
					tab_3: 0,
					tab_4: 0,
					tab_5: 0
				},
				value: ''
			}
		},
		onLoad() {
			_self = this;
			_self._showLoading('加载中...');
			var mobile = uni.getSystemInfoSync();
			_self.top = mobile.statusBarHeight;
			// 是否登录
			const info = api.getLogins();
			if (info === false) {
				_self.skipUrl();
			} else {
				_self.userId = info.userId;
				_self.getData();
			}
		},
		methods: {
			formatDate(t, format = "Y-M-D h:m:s") {
				let value = Math.ceil((new Date).getTime() / 1000)
				if (t.add_time) value = t.add_time
				if (t.addtime) value = t.addtime
				if (t.gratuity_time) value = t.gratuity_time
				const formatNumber = n => `0${n}`.slice(-2);
				const date = new Date(value * 1000);
				const formatList = ["Y", "M", "D", "h", "m", "s"];
				const resultList = [];
				resultList.push(date.getFullYear().toString());
				resultList.push(formatNumber(date.getMonth() + 1));
				resultList.push(formatNumber(date.getDate()));
				resultList.push(formatNumber(date.getHours()));
				resultList.push(formatNumber(date.getMinutes()));
				resultList.push(formatNumber(date.getSeconds()));
				for (let i = 0; i < resultList.length; i++) {
					format = format.replace(formatList[i], resultList[i]);
				}
				return format;
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
			tsetMtype(tid) {
				_self.mtype = tid;
				_self.page = 1;
				_self.msgList = [];
				_self.isShowTig = true;
				_self.getData();
			},
			getData() {
				if (_self.page > 1) _self._showLoading('正在加载...');
				uni.request({
					url: api.apiData.getMessage + '/userId/' + _self.userId + '/page/' + _self.page + '/mtype/' +
						_self.mtype,
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var msgList = e.data.Data.list;
						_self.newsCount = e.data.Data.count
						if (!_self.more) _self.msgList = [];
						if (msgList != null && msgList.length > 0) {
							if (_self.mtype == 4) {
								msgList.forEach(n => {
									n.content =
										'<span style="width:100%;display:inline-block;vertical-align: bottom;">' +
										n.content.replace('发送给你',
											'发送给你:</span><span class="message-text-content">') +
										'</span>'
								})
							}
							_self.msgList = _self.msgList.concat(msgList);
							_self.isShowTig = false;
						} else {
							_self.page--;
							if (_self.more) {
								_self.isMoreTig = true;
							} else {
								_self.isShowTig = true;
							}
						}
						_self._hideLoading();
					},
					fail: () => {
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
			// 初始化参数
			startOpt() {
				_self.page = 1;
				_self.isShowTig = false;
				_self.isMoreTig = false;
				_self.more = false;
			},
			skipUrl(url = '/pages/login/login', type = 1) {
				if (type == 1) {
					uni.reLaunch({
						url: url
					});
				} else {
					uni.navigateTo({
						url: url
					});
				}
			},
			// 提交保存
			confirm(type = 0) {
				_self.msgData("处理中...");
				var content = _self.value;
				var postUrl = api.apiData.toPostNews;
				var data = {
					type: 3,
					to_uid: _self.to_uid,
					uid: _self.userId,
					content: content
				}
				//console.log(data)
				uni.request({
					url: postUrl,
					method: 'POST',
					data: data,
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						if (type == 0) _self.msgData(e.data.Msg);
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
			// 取消
			closeNotice() {
				_self.isNotice = false;
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
					});
				}, 200)
			},
			// 获取用户输入的信息
			inputUserInfo(e) {
				_self.value = e.detail.value;
			},
			// 弹出修改框
			postMsg(e) {
				_self._showLoading('加载中...');
				_self.isNotice = true;
				if (e == 3) {
					_self.title = "请输入留言内容";
					_self.type = 3;
				}
				_self._hideLoading();
			},
			setContent(e) {
				_self.content = e.detail.value;
			},
		},
		// 上拉加载数据
		onReachBottom() {
			if (!_self.isMoreTig) {
				_self._showLoading('加载中...');
				_self.more = true;
				_self.isShowTig = false;
				_self.page++;
				_self.getData();
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			_self.startOpt();
			_self.getData();
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
	.bg {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.word_wrap {
		word-wrap: break-word;
		width: 100%;
		height: auto;
	}

	.image-box {
		width: calc(20% - 4px);
		text-align: center;
		margin-left: 4px;
		font-size: 14px;
		float: left;
		color: #fff;
		box-sizing: border-box;
		position: relative;
	}

	.image-box .active {
		color: #d8ae6e;
		font-weight: 600;
	}

	.image-box .dot {
		width: 6px;
		height: 6px;
		background-color: #f541bc;
		position: absolute;
		right: 5px;
		top: 5px;
		border-radius: 50%;
	}

	.image-box image {
		width: 30px;
		height: 30px;
		margin-top: 5px;
	}

	.content-head {
		//position: fixed;
		width: 100%;
		height: 30px;
		line-height: 30px;
		//top: 27px;
		text-align: center;
		//color: #666666; 
		background: #f8f8f8;
		font-size: 17px;
		border-bottom: 1px solid #f7f7f7;
	}

	.update-center {
		margin: 15px 5%;
		font-size: 16px;
		color: #666666;
	}

	.update-botton {
		width: 80%;
		height: 40px;
		background: #ff6f33;
		border-radius: 40px;
		color: #FFFFFF;
		text-align: center;
		line-height: 40px;
		margin: 0 10%;
		box-shadow: 0px 4px 6px 0px rgba(103, 103, 103, 0.2);
	}

	.update-ing {
		height: 15px;
		width: 90%;
		border: 1px solid #E5E5E5;
		margin: auto;
		text-align: center;
		border-radius: 15px;
	}

	.update-ing .ing {
		height: 15px;
		background: #ff6f33;
		border-radius: 15px;
		font-size: 10px;
		color: #FFFFFF;
		line-height: 15px;
	}

	.update-wz {
		width: 100%;
		text-align: center;
		margin-top: 10px;
		font-size: 16px;
		color: #ff6f33;
	}

	.update {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		position: fixed;
		top: 0;
	}

	.update-content {
		width: 70%;
		background: #FFFFFF;
		//height: 225px;
		position: absolute;
		margin: -158px 15%;
		top: 50%;
		border-radius: 5px;
		box-shadow: 0px 4px 6px 0px rgba(103, 103, 103, 0.2);
		padding-bottom: 45upx;
	}

	.update-colse {
		position: absolute;
		right: -10px;
		top: -10px;
		width: 30px;
		height: 30px;
		//background: #F0AD4E;
		border-radius: 50%;
		color: #FFFFFF;
		text-align: center;
		line-height: 25px;
		font-weight: bold;
		box-shadow: 0px 4px 6px 0px rgba(103, 103, 103, 0.2);
	}

	.update-head {
		height: 80px;
		line-height: 80px;
		color: #FFFFFF;
		background: -webkit-gradient(linear, left top, right top, from(#ff6f33), to(#E14351));
		border-radius: 5px 5px 0 0;
		text-align: center;
		font-size: 23px;
	}

	.newTig {
		width: 12px;
		height: 12px;
		background: #F9221D;
		border-radius: 50%;
	}

	.input {
		width: 96%;
		padding: 5px 2%;
		border: 1px solid #E2E2E2;
		border-radius: 5px;
	}

	.head-tx {
		width: 90%;
		height: auto;
		border-radius: 10rpx;
		background-color: #1d1d2d;
		box-shadow: 0 1px 1px rgba(0, 0, 0, .5);
		margin-top: 80rpx;
		color: #fff;
		line-height: 22px;
		border: #111 solid 1px;
		padding: 10rpx 20rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	.head-tx .addtime {
		margin-top: -80rpx;
		color: #e4e4e4;
		text-align: center;
		width: 100%;
		font-size: 12px;
		line-height: 80rpx;
	}


	.head-img {
		width: 60px;
		height: 60px;
	}

	.head-acc {
		float: right;
		color: #999999;
	}

	.message-text-content {
		width: 100%;
		font-size: 14px;
	}

	.word_wrap>div>span:first-child,
	.head-tx-main {
		width: 100%;
		font-size: 14px;
		font-weight: 600;
	}

	.moreTig {
		text-align: center;
		color: #ccc;
		font-size: 25upx;
		margin: 30upx 0 50upx 0;
	}
</style>