<template>
	<view>
		<css-loading ref="cssLoading"></css-loading>
		<view class="head-content" id="head">
			<view class="head-placeholder"></view>
			<view class="head-search">
				<view class="head-left" @click="backUrl">
					<image src="/static/imgs/back.png" mode="aspectFill"></image>
				</view>
				<view class="head-center">
					<text :class="tabId==0?'sel':''" @click="setTabId(0)">文字小说</text>
					<text :class="tabId==1?'sel':''" @click="setTabId(1)">有声小说</text>
				</view>
				<view class="head-left"></view>
			</view>
			<view class="head-bottom">
				<view class="head-search-center">
					<input class="head-input" focus="true" :value="search" @input="inputKey" confirm-type="search"
						@confirm="searchKey(1)" type="search" maxlength="20" placeholder="搜索一下,发现新世界...">
				</view>
				<view class="head-search-right" @click="searchKey(1)">
					<image src="/static/imgs/search.png" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<view :style="{ height: topHeight + 'px' }"></view>
		<view class="top-content" v-if="isShearchShow">
			<view class="search-log" v-if="logHide">
				<view class="search-log-top">
					<text class="line"></text>
					<text class="c-title">历史搜索</text>
					<image src="/static/imgs/del.png" @click="delSearch"></image>
				</view>
				<view class="search-log-content">
					<view class="search-log-list" v-for="(t, i) in logList" :key="i" @click="searchLog(t.content)">
						<text>{{t.content}}</text>
					</view>
				</view>
			</view>
			<view class="search-log" v-if="hotHide">
				<view class="search-log-top hot">
					<text class="line"></text>
					<text class="c-title">热门搜索</text>
				</view>
				<block v-if="tabId == 0">
					<view class="search-hot-content" v-for="(e, h) in hotTextList" :key="h" @click="openPop(e)">
						<view class="search-hot-list">
							<text class="search-hot-sort one" v-if="(h+1)==1">{{h+1}}</text>
							<text class="search-hot-sort two" v-if="(h+1)==2">{{h+1}}</text>
							<text class="search-hot-sort thr" v-if="(h+1)==3">{{h+1}}</text>
							<text class="search-hot-sort" v-if="(h+1)>3">{{h+1}}</text>
							<text class="search-hot-time">{{utils.timeTodate('Y/m/d',e.update_time)}}</text>
							<text class="search-hot-title">{{e.title}}</text>
						</view>
					</view>
				</block>
				<block v-if="tabId == 1">
					<view class="search-hot-content" v-for="(e, h) in hotAudioList" :key="h" @click="openPop(e)">
						<view class="search-hot-list">
							<text class="search-hot-sort one" v-if="(h+1)==1">{{h+1}}</text>
							<text class="search-hot-sort two" v-if="(h+1)==2">{{h+1}}</text>
							<text class="search-hot-sort thr" v-if="(h+1)==3">{{h+1}}</text>
							<text class="search-hot-sort" v-if="(h+1)>3">{{h+1}}</text>
							<text class="search-hot-time">{{utils.timeTodate('Y/m/d',e.update_time)}}</text>
							<text class="search-hot-title">{{e.title}}</text>
						</view>
					</view>
				</block>
			</view>
		</view>
		<view class="video-list" v-else>
			<block v-if="tabId == 0">
				<view class="video-desc">共搜索到{{textCount}}个与<text class="colorRed">{{search}}</text>相关的文字小说</view>
				<view style="display: flex;flex-wrap: wrap;">
					<block v-for="(v, k) in textList" :key="k">
						<view class="text-item" @click="openPop(v)">
							<view class="text-item-image">
								<image :src="v.url" mode="aspectFill"></image>
							</view>
							<view class="text-item-content">
								<rich-text class="text-item-title" :nodes="v.title">...</rich-text>
								<view class="text-item-description">{{v.description}}</view>
								<view class="text-item-price">
									<view class="buy_btn" v-if="v.alreadyBuy == 0 && v.price > 0">￥{{v.price}}</view>
									<view class="buy_btn" v-else-if="v.is_vip == 1">VIP</view>
									<view class="buy_btn" v-else-if="v.price == 0 ">免费</view>
									<view class="buy_btn" v-else>{{userInfo.isVip ? 'VIP免费' : '已购买'}}</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</block>
			<block v-if="tabId == 1">
				<view class="video-desc">共搜索到{{audioCount}}个与<text class="colorRed">{{search}}</text>相关的有声小说</view>
				<view style="display: flex;flex-wrap: wrap;">
					<block v-for="(v, k) in audioList" :key="k">
						<view class="audio-item" @click="openPop(v)">
							<view class="audio-item-image">
								<image :src="v.url" mode="aspectFill"></image>
							</view>
							<view class="audio-item-content">
								<rich-text class="audio-item-title" :nodes="v.title">...</rich-text>
								<view class="audio-item-description">{{v.description}}</view>
								<view class="audio-item-price">
									<view class="buy_btn" v-if="v.alreadyBuy == 0 && v.price > 0">￥{{v.price}}</view>
									<view class="buy_btn" v-else-if="v.is_vip == 1">VIP</view>
									<view class="buy_btn" v-else-if="v.price == 0 ">免费</view>
									<view class="buy_btn" v-else>{{userInfo.isVip ? 'VIP免费' : '已购买'}}</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</block>
			<view class="moreTig" v-if="isMoreTig">{{isMoreMsg}}</view>
		</view>
		<uni-popup ref="popupNotice" type="center" backColor="rgba(0,0,0,0.8)">
			<view class="notice-bg">
				<image class="notice_title" src="/static/img/buy_head.png" mode="aspectFill" />
				<view class="notice_title_text" :class="{moreTitle:popData.title.length > 10}">
					<text>购买小说:</text>
					<rich-text class="title1" :nodes="popData.title">...</rich-text>
				</view>
				<view class="notice_content">
					<view class="notice_content_line_1">
						<text>实付<text class="redprice">{{popData.gold}}</text>金币</text>
					</view>
					<view class="notice_content_line_2" v-if="tabId == 0">
						<text><text class="maintext">￥{{popData.gold}}</text>购买可获得同专辑小说<text
								class="maintext">{{popData.count}}</text>部</text>
					</view>
					<view class="notice_content_line_3">
						<text class="buy_btn_small" @click="buyBook">立即支付</text>
					</view>
					<view class="notice_content_line_4">
						<text>可用金币： {{userInfo.corn}}</text>
						<text @click="gotoRecharge" class="link">去充值 &gt;</text>
					</view>
					<view class="notice_content_line_5">
						<text>价格随作品数量逐步递增,越早买越省钱</text>
					</view>
				</view>
				<view style="height:50upx;"></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	import utils from '@/components/shoyu-date/utils.filter.js';
	var _self;
	export default {
		data() {
			return {
				isMoreTig: false,
				isMoreMsg: '——— 我是有底线的 ———',
				isMore: false,
				topHeight: 76,
				did: 0,
				logHide: false,
				hotHide: false,
				isShearchShow: true,
				logList: {},
				hotTextList: {},
				hotAudioList: {},
				isSearchs: 1,
				tabId: 0,
				search: '',
				userId: 0,
				utils: utils,
				textList: [],
				textCount: 0,
				audioList: [],
				audioCount: 0,
				scrollTop: 0,
				userInfo: {
					nickname: '无名',
					is_vip: 0,
					money: 0,
				},
				page: 1,
				api: api,
				popData: {
					title: '',
					gold: 0.00,
					id: 0,
					count: 0,
					type: 'album'
				},
			}
		},
		onLoad(e) {
			if (e && e.type) {
				this.tabId = e.type == 1 ? 1 : 0
			}
			this._showLoading('加载中,请稍后...');
			_self = this;
			var info = api.getLogins();
			if (info != false) _self.userId = info.userId;
			_self.getUserInfo();
			uni.getStorage({
				key: 'mobileDid_' + api.appkey,
				success: res => {
					// 从缓存中拉取
					_self.did = res.data;
					//console.log(_self.did)
				},
				complete: () => {
					_self.getHotSearch();
				}
			});
		},
		mounted() {
			const query = uni.createSelectorQuery().in(this);
			let timer = setTimeout(() => {
				query.select('#head').boundingClientRect(ah => {
					_self.topHeight = ah.height;
				}).exec();
				clearTimeout(timer);
			}, 100);
		},
		methods: {
			getUserInfo() {
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
						}
					},
					fail: () => {
						api.showToast('服务器连接失败，请检查网络是否正常', 3000);
					}
				});
			},
			setTabId(id) {
				_self.tabId = id
			},
			// 清空搜索记录
			delSearch() {
				uni.showModal({
					content: '确认清空搜索记录吗？',
					cancelText: '考虑一下',
					confirmText: '清空记录',
					success: res => {
						if (res.confirm) {
							_self.delSearchLog();
						} else if (res.cancel) {

						}
					}
				});
			},
			gotoRecharge() {
				api.jumpUrl('/pages/recharge/recharge', 'new');
			},
			// 同步接口清空搜索记录
			delSearchLog() {
				this._showLoading('处理中...');
				uni.request({
					url: api.apiData.emptyBookSearch,
					method: 'POST',
					//timeout: 3000,
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						did: _self.did
					},
					success: (e) => {
						//console.log(e)
						if (e.data.Code == 200) {
							_self.logHide = false;
						}
						this._hideLoading();
					},
					fail: () => {
						this._hideLoading()
						api.showToast('服务器连接失败，请检查网络是否正常', 2000);
					}
				});
			},
			// 跳转播放页
			playVideo(vid) {
				//console.log(vid);
				uni.setStorage({
					key: 'vid',
					data: vid,
					fail: () => {
						_self.back('服务器连接失败，请检查网络是否正常');
					},
					complete: () => {
						var param = {
							url: '/pages/video/search',
							t: 'new'
						}
						api.jumpUrl('/pages/video/play?type=' + JSON.stringify(param), 'new');
					}
				});
			},
			inputKey(e) {
				_self.search = e.detail.value;
			},
			searchLog(e) {
				_self.search = e;
				_self.searchKey(1);
				//console.log(e)
			},
			openPop(v) {
				if (v.is_vip == 1 && !_self.userInfo.isVip) {
					uni.showModal({
						title: '温馨提示',
						content: '您需要开通VIP才能' + (_self.tabId == 0 ? '查看' : '收听') + '该内容',
						confirmText: '立即开通VIP',
						cancelText: '再考虑一下',
						success: function(res) {
							if (res.confirm) {
								api.jumpUrl('/pages/recharge/recharge?type=2&book_' + (_self.tabId == 0 ?
										'album' : 'audio') + '_id=' + _self.popData
									.id,
									'new');
							}
						}
					});
				} else {
					if (v.alreadyBuy == 0 && v.price > 0) {
						_self.popData.title = v.title
						_self.popData.gold = v.price
						_self.popData.id = _self.tabId == 0 ? v.parentId : v.id
						_self.popData.count = v.count
						this.$nextTick(() => {
							_self.$refs['popupNotice'].open();
						})
					} else {
						api.jumpUrl('/pages/book/book_' + (_self.tabId == 0 ? 'album' : 'audio') + '_detail?id=' + v.id,
							'new')
					}
				}
			},
			buyBook() {
				uni.request({
					url: api.apiData.buyBook,
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						bookId: _self.popData.id,
						userId: _self.userId,
						type: _self.tabId == 0 ? 'album' : 'audio',
						did: _self.did,
					},
					success: (res) => {
						if (res.data.Code != 200) {
							api.showToast(res.data.Msg, 2000);
						} else {
							api.showToast(res.data.Msg, 2000);
							_self.$refs['popupNotice'].close();
							api.jumpUrl('/pages/book/book_' + (_self.tabId == 0 ? 'album' : 'audio') +
								'_detail?id=' + _self.popData.id, 'new')
						}
					},
					fail: () => {
						api.showToast('网络连接失败，请检查网络是否正常', 2000);
					}
				});
			},
			searchKey(x) {
				if (x == 1) _self.page = 1;
				this._showLoading('搜索中,请稍后...');
				if (_self.search.length == 0) return api.showToast('请输入搜索关键字', 2000);
				// 是否允许普通用户搜索
				if (!_self.isSearchs) {
					if (_self.userId == 0) {
						api.showToast('禁止游客使用搜索功能，请先登录', 2000);
						let timer = setTimeout(() => {
							api.jumpUrl('/pages/login/login', 'newx');
							clearTimeout(timer);
						}, 1000);
						return;
					}
				}
				if (_self.page == 1) {
					_self.textList = []
					_self.textCount = 0
					_self.audioList = []
					_self.audioCount = 0
					_self.isMore = false
				}
				_self.isMoreMsg = "——— 加载数据中 ———";
				uni.request({
					url: api.apiData.searchBook,
					method: 'POST',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						uid: _self.userId,
						did: _self.did,
						key: _self.search,
						page: _self.page
					},
					success: (e) => {
						var data = e.data;
						if (data.Code == 201) {
							return api.showToast(data.Msg, 2000);
						} else if (data.Code == 202) {
							if (x && _self.page == 1) {
								api.showToast(data.Msg, 2000);
							} else {
								api.showToast("已到顶到胃了");
							}
							_self.isMoreMsg = "——— 我是有底线的 ———";
							_self.page = _self.page - 1;
							_self.isMore = true;
							return false;
						}
						if (_self.page > 1) _self.isMoreTig = true;
						if (data.Data.text.length > 0) {
							if (_self.page == 1) {
								_self.textList = data.Data.text;
							} else {
								_self.textList = _self.textList.concat(data.Data.text);
							}
							if (data.Data.text.length == 0) _self.isMore = false
						}
						_self.textCount = data.Data.text_count;
						if (data.Data.audio.length > 0) {
							if (_self.page == 1) {
								_self.audioList = data.Data.audio;
							} else {
								_self.audioList = _self.audioList.concat(data.Data.audio);
							}
							if (data.Data.audio.length == 0) _self.isMore = false
						}
						_self.audioCount = data.Data.audio_count;
						_self.isShearchShow = false;
						_self.isMoreMsg = "——— 上滑加载更多 ———";
						let timer = setTimeout(() => {
							_self.getHotSearch();
							clearTimeout(timer);
						}, 300);
					},
					fail: () => {
						_self.back('服务器连接失败，请检查网络是否正常');
					}
				});
			},
			getHotSearch() {
				uni.request({
					url: api.apiData.getHotBookSearch,
					method: 'POST',
					data: {
						userId: _self.userId,
						did: _self.did
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var res = e.data.Data;
						_self.isSearchs = res.isSearchs;
						if (res.logList.length) {
							_self.logList = res.logList;
							_self.logHide = true;
						}
						if (res.hotTextList.length) {
							_self.hotTextList = res.hotTextList;
						}
						if (res.hotAudioList.length) {
							_self.hotAudioList = res.hotAudioList;
						}
						if (res.hotTextList.length || res.hotAudioList.length) {
							_self.hotHide = true;
						}
					},
					fail: () => {
						// 加载失败提示
						_self.back('服务器连接失败，请检查网络是否正常');
					},
					complete: () => {
						_self._hideLoading()
					}
				});
			},
			// 返回上一层
			backUrl() {
				if (_self.isShearchShow) {
					api.jumpUrl('/pages/book/book', 'old');
				} else {
					_self.page = 1;
					_self.videoList = [];
					_self.isShearchShow = true;
					_self.isMore = false;
				}
			},
			// 提示
			back(msg = '') {
				if (msg.length == 0) return;
				api.showToast(msg);
				let timer = setTimeout(() => {
					uni.navigateBack();
					clearTimeout(timer);
				}, 1500);
			}
		},
		// 上拉加载数据
		onReachBottom() {
			if (!_self.isMore) {
				_self.page++;
				_self.searchKey(0);
			}
		},
		// 滚动监听事件
		onPageScroll({
			scrollTop
		}) {
			_self.scrollTop = scrollTop;
		}
	}
</script>

<style>
	.moreTig {
		width: 100%;
		text-align: center;
		color: #999999;
		font-size: 25upx;
		margin-top: 20upx;
		padding-bottom: 30px;
	}

	.video-desc {
		width: 100%;
		text-align: center;
		font-size: 12px;
		color: #999999;
		margin: 10px 0;
	}

	.colorRed {
		color: #B01A1C;
	}

	.video-list {
		width: 97%;
		padding: 1px 0 10px 3%;
	}


	.one {
		background: #B01A1C;
		color: #FFFFFF !important;
	}

	.two {
		background: #007AFF;
		color: #FFFFFF !important;
	}

	.thr {
		background: #A83FDB;
		color: #FFFFFF !important;
	}

	.search-hot-list {
		width: 92%;
		font-size: 13px;
		border-radius: 3px;
		margin: 0 5% 0 3%;
	}

	.search-hot-sort {
		width: 20px;
		height: 20px;
		line-height: 20px;
		display: inline-block;
		text-align: center;
		border-radius: 50%;
		color: #777777;
	}

	.search-hot-title {
		width: 63%;
		padding: 0 5% 0 0;
		height: 20px;
		line-height: 20px;
		display: inline-block;
		color: #999;
		float: right;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.search-hot-time {
		width: 22%;
		float: right;
		height: 20px;
		line-height: 20px;
		text-align: right;
	}

	.search-hot-content {
		margin-top: 10px;
	}

	.hot {
		margin-bottom: 18px;
	}

	.search-log-content {
		margin-top: 18px;
	}

	.search-log-content view {
		display: inline-block;
	}

	.search-log-list {
		width: 25%;
		height: 30px;
		line-height: 30px;
		text-align: center;
		background: #f5f5f5;
		font-size: 13px;
		border-radius: 3px;
		color: #666666;
		margin: 0 0 5px 10px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		padding: 0 5px;
	}

	.search-log-top .line {
		width: 8px;
		height: 15px;
		background-color: #FF8F00;
		margin-right: 20upx;
		border-radius: 8px;
	}

	.c-title {
		flex: 1;
		color: #FFFFFF;
	}

	.search-log-top image {
		width: 20px;
		height: 20px;
	}

	.search-log-top {
		height: 30px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.search-log {
		margin-top: 10px;
		padding: 0 35upx;
		font-size: 17px;
		color: #666666;
		font-weight: bold;
	}

	.top-content {
		margin-top: 10px;
	}

	.head-content {
		width: 94%;
		background: #20202C;
		padding: 0 3% 10upx;
		text-align: center;
		position: fixed;
		top: 0;
		z-index: 999;
		border-bottom: 1px solid rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
	}

	.head-placeholder {
		height: var(--status-bar-height);
		padding-top: 16upx;
		box-sizing: content-box;
	}

	.head-bottom {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin: 10upx 0;
	}

	.head-left image {
		width: 30px;
		height: 30px;
		margin-top: 1px;
		border-radius: 50%;
		opacity: 0.6;
		filter: alpha(opacity=60);
	}

	.head-left {
		width: 30px;
	}

	.head-center .sel {
		font-weight: bold;
		border-bottom: 2px solid #F2692F;
	}

	.head-center text {
		color: #FFFFFF;
		font-size: 16px;
		margin: 0 30upx;
		border-bottom: 2px solid #20202C;
	}

	.head-center {
		height: 35.5px;
		line-height: 30px;
		flex: 1;
	}

	.head-search {
		display: flex;
		flex-direction: row;
	}

	.head-search-right image {
		width: 32px;
		height: 32px;
		border-radius: 50%;
	}

	.head-search-center {
		flex: 1;
		margin: 0 20upx;
	}

	.head-input {
		height: 32px;
		line-height: 32px;
		background: #E5E5E5;
		border-radius: 50px;
		font-size: 26upx;
		padding: 0px 30upx;
		text-align: left;
		color: #666666;
	}

	.error {
		margin-top: 300upx;
	}


	.audio-item {
		width: 100%;
		border-radius: 10px;
		color: #fff;
		font-size: 14px;
		display: inline-block;
		margin-bottom: 10px;
		box-sizing: border-box;
		padding: 10px 5px;
		background-color: #20202C;
		box-shadow: 4px 4px 6px 0px rgba(103, 103, 103, 0.1);
	}

	.audio-item-image {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		overflow: hidden;
		display: inline-block;
		vertical-align: top;
	}

	.audio-item-content {
		width: calc(100% - 60px);
		margin-left: 10px;
		height: 50px;
		display: inline-block;
		vertical-align: top;
		position: relative;
	}

	.audio-item-title {
		width: calc(100% - 70px);
		height: 28px;
		display: inline-block;
		line-height: 28px;
		font-size: 26upx;
		overflow: hidden;
		text-overflow: ellipsis;
		justify-content: left;
		white-space: nowrap;
	}

	.audio-item-description {

		width: calc(100% - 70px);
		height: 22px;
		display: inline-block;
		line-height: 22px;
		color: #999;
		font-size: 22upx;
		overflow: hidden;
		text-overflow: ellipsis;
		justify-content: left;
		white-space: nowrap;
		margin-top: -10px;
	}

	.audio-item-price {
		width: 70px;
		position: absolute;
		right: 0;
		top: -5px;
		height: 50px;
		vertical-align: top;
		padding: 5px;
		box-sizing: border-box;
	}

	.buy_btn {
		width: 100%;
		line-height: 40px;
		border-radius: 10px;
		font-size: 24upx;
		color: #fff;
		text-align: center;
		background: linear-gradient(to left, #ff6034, #ee0a24)
	}


	.text-item {
		width: 100%;
		border-radius: 10px;
		color: #fff;
		font-size: 14px;
		display: inline-block;
		margin-bottom: 10px;
		box-sizing: border-box;
		padding: 10px 5px;
		background-color: #20202C;
		box-shadow: 4px 4px 6px 0px rgba(103, 103, 103, 0.1);
	}

	.text-item-image {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		overflow: hidden;
		display: inline-block;
		vertical-align: top;
	}

	.text-item-content {
		width: calc(100% - 60px);
		margin-left: 10px;
		height: 50px;
		display: inline-block;
		vertical-align: top;
		position: relative;
	}

	.text-item-title {
		width: calc(100% - 70px);
		height: 28px;
		display: inline-block;
		line-height: 28px;
		font-size: 26upx;
		overflow: hidden;
		text-overflow: ellipsis;
		justify-content: left;
		white-space: nowrap;
	}

	.text-item-description {

		width: calc(100% - 70px);
		height: 22px;
		display: inline-block;
		line-height: 22px;
		color: #999;
		font-size: 22upx;
		overflow: hidden;
		text-overflow: ellipsis;
		justify-content: left;
		white-space: nowrap;
		margin-top: -10px;
	}

	.text-item-price {
		width: 70px;
		position: absolute;
		right: 0;
		top: -5px;
		height: 50px;
		vertical-align: top;
		padding: 5px;
		box-sizing: border-box;
	}



	.notice_content {
		width: 90%;
		height: 500upx;
		padding: 0 5%;
		margin-top: 25upx;
		position: relative;
	}

	.notice_title {
		width: 100%;
		height: 146upx;
	}

	.notice_title_text {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 146upx;
		font-size: 36upx;
		text-align: center;
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.notice_title_text.moreTitle {
		line-height: 48upx;
	}

	.notice_title_text .title1 {
		font-size: 34upx;
		font-weight: bold;
	}

	.notice-bg {
		width: 600upx;
		border-radius: 60upx;
		background-color: #FFFFFF;
	}

	.notice_content_line_1 {
		width: 100%;
		text-align: center;
		font-size: 40upx;
		height: 40px;
		line-height: 30px;
		font-weight: 500;
	}

	.notice_content_line_1 .redprice {
		font-size: 56upx;
		color: #F9221D;
		margin: 0 5px;
	}


	.notice_content_line_2 {
		width: 100%;
		text-align: center;
		font-size: 32upx;
		height: 90px;
		line-height: 40upx;
		font-weight: 500;
	}

	.notice_content_line_2 .maintext {
		font-size: 28upx;
		margin: 0 3px;
	}

	.notice_content_line_3 {
		width: 100%;
		height: 46px;
		padding: 3px 10px;
		box-sizing: border-box;
	}

	.notice_content_line_3 .buy_btn_small {

		width: 100%;
		height: 100%;
		line-height: 40px;
		border-radius: 20px;
		font-size: 26upx;
		color: #fff;
		text-align: center;
		display: inline-block;
		background: linear-gradient(to left, #ff6034, #ee0a24)
	}

	.notice_content_line_4 {
		width: 100%;
		height: 40px;
		line-height: 40px;
		font-size: 32upx;
		font-weight: 400;
		text-align: center;
	}

	.notice_content_line_4 .link {
		color: #F9221D;
		margin-left: 10px;
	}

	.notice_content_line_5 {
		width: 100%;
		height: 30px;
		line-height: 30px;
		font-size: 24upx;
		font-weight: 400;
		text-align: center;
		color: #999;
	}
</style>