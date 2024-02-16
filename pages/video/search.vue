<template>
	<view>
		<view class="head-content" id="head">
			<view class="head-placeholder"></view>
			<view class="head-search">
				<view class="head-left" @click="backUrl">
					<image src="/static/imgs/back.png" mode="aspectFill"></image>
				</view>
				<view class="head-center">
					<text class="sel">搜索</text>
					<text @click="api.jumpUrl('/pages/class/index', 'new')">分类</text>
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
		<view class="top-content" v-if="isSearchShow">
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
					<text class="r" style="color:#777;font-weight: 200;font-size: 14px;"
						@click="api.jumpUrl('/pages/video/world', 'new')">更多</text>
				</view>
				<view class="search-hot-content" v-for="(e, h) in hotList" :key="h" @click="playVideo(e.id)">
					<view class="search-hot-list">
						<text class="search-hot-sort one" v-if="(h+1)==1">{{h+1}}</text>
						<text class="search-hot-sort two" v-if="(h+1)==2">{{h+1}}</text>
						<text class="search-hot-sort thr" v-if="(h+1)==3">{{h+1}}</text>
						<text class="search-hot-sort" v-if="(h+1)>3">{{h+1}}</text>
						<text class="search-hot-time">{{utils.timeTodate('Y/m/d',e.update_time)}}</text>
						<text class="search-hot-title">{{e.title}}</text>
					</view>
				</view>
			</view>
			<view class="search-log" v-if="allHide">
				<view class="search-log-top hot">
					<text class="line"></text>
					<text class="c-title">大家都在搜</text>
				</view>
				<view class="search-all-content">
					<view class="search-all-item" v-for="(e, h) in allList" :key="h" @click="searchLog(e.content)">
						<text>{{e.content}}</text>
					</view>
				</view>
			</view>
			<view class="search-log" v-if="goodHide">
				<view class="search-log-top hot">
					<text class="line"></text>
					<text class="c-title">大家都在赞</text>
				</view>
				<view class="search-good-content">

					<scroll-view :scroll-x="true" :show-scrollbar="false" style="white-space: nowrap;">
						<view class="video-item" v-for="(item,index) in goodList" :key="index"
							@click="playVideo(item.id)">
							<image class="is-vip" src="/static/play/ico_vip.png" v-if="item.gold>0"></image>
							<image class="is-vip" src="/static/play/ico_free.png" v-else></image>
							<!-- <image class="cover" :src="b.cover" mode="aspectFill"></image> -->
							<easy-loadimage mode="aspectFill" :scroll-top="scrollTop" :image-src="item.cover"
								:open-transition="true" class="cover">
							</easy-loadimage>
							<view class="item-extra">
								<image src="/static/imgs/ico_good.png"></image>
								<text>{{item.good}}</text>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<view class="search-log" v-if="svodHide">
				<view class="search-log-top hot">
					<text class="line"></text>
					<text class="c-title">大家都在看</text>
				</view>
				<view class="search-svod-content">
					<scroll-view :scroll-x="true" :show-scrollbar="false" style="white-space: nowrap;">
						<view class="svod-video-item" v-for="(b, i) in svodList" :key="i"
							@click="goShort(b)">
							<image class="is-vip" src="/static/play/ico_vip.png" v-if="b.gold>0"></image>
							<image class="is-vip" src="/static/play/ico_free.png" v-else></image>
							<!-- <image class="cover" :src="b.cover" mode="aspectFill"></image> -->
							<easy-loadimage mode="aspectFill" :scroll-top="scrollTop" :image-src="b.cover"
								:open-transition="true" class="cover" style="height: 260upx;">
							</easy-loadimage>
							<view class="item-extra">
								<image src="/static/imgs/ico_good.png"></image>
								<text>{{b.good}}</text>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<view class="video-list" v-else>
			<view class="search-tabs">
				<view class="search-tab-item" :class="{active:tab.type == currentTab.type}"
					v-for="(tab,index) in tabList" :key="index" @click="changeTab(tab)">
					<text>{{tab.name}}</text>
				</view>
			</view>
			<view style="display: flex;flex-wrap: wrap;">
				<block v-if="currentTab.type == 'video'">
					<view class="video-info" v-for="(v, k) in videoList" :key="k" @click="playVideo(v.id)">
						<image :src="v.thumbnail" mode="aspectFill"></image>
						<view style="padding: 0 3px;" class="video-info-video-title">
							<rich-text class="title" :nodes="v.title">...</rich-text>
							<view class="video-info-icos">
								<view class="ico-item">
									<image src="/static/imgs/ico_collect.png"></image>
									<text>{{convertNumer(v.good)}}</text>
								</view>
								<view class="ico-item">
									<image src="/static/imgs/ico_play.png"></image>
									<text>{{convertNumer(v.click)}}</text>
								</view>
							</view>
						</view>
					</view>
				</block>
				<view class="short-list" v-if="currentTab.type == 'short'">

					<view class="short-info" style="width:48.5%;margin-bottom:8.5px;" v-for="(b, i) in videoList"
						:key="i" @click="goShort(b)">
						<image class="is-vip" src="/static/play/ico_vip.png" v-if="b.gold>0"></image>
						<image class="is-vip" src="/static/play/ico_free.png" v-else></image>
						<!-- <image class="cover" :src="b.cover" mode="aspectFill"></image> -->
						<easy-loadimage mode="aspectFill" :scroll-top="scrollTop" :image-src="b.thumbnail"
							:open-transition="true" class="cover" style="height: 240px;">
						</easy-loadimage>
						<rich-text class="v-list-title short-info-video-title" :nodes="b.title">...</rich-text>
						<view class="short-info-icos">
							<view class="ico-item">
								<image src="/static/imgs/ico_collect.png"></image>
								<text>{{convertNumer(b.good)}}</text>
							</view>
							<view class="ico-item">
								<image src="/static/imgs/ico_play.png"></image>
								<text>{{convertNumer(b.click)}}</text>
							</view>
						</view>
					</view>
				</view>
				<block v-if="currentTab.type == 'plaza'">
					<view class="plaza-info" v-for="(m, k) in videoList" :key="k" @click="goHome(m.user_id)">
						<!--文字内容-->
						<view class="center-content-text" @click="goInfo(m)">
							<rich-text class="title" :nodes="m.title">...</rich-text>
						</view>
						<image v-if="m.allImg.length==1" v-for="(mm, ii) in m.allImg" :src="mm" :key="ii"
							class="_imgmore1" mode="aspectFill"></image>
						<image v-if="m.allImg.length==2" v-for="(mm, ii) in m.allImg" :src="mm" :key="ii"
							class="_imgmore2" mode="aspectFill"></image>
						<image v-if="m.allImg.length >2" v-for="(mm, ii) in m.allImg" :src="mm" :key="ii"
							class="_imgmore" mode="aspectFill"></image>
					</view>
				</block>
				<block v-if="currentTab.type == 'image'">

					<view class="image-item" v-for="(item,index) in videoList" @click="userWatch(index)" :key="index">
						<view class="image-item-cover">
							<easy-loadimage mode="aspectFill" :scroll-top="scrollTop" :image-src="item.cover"
								:open-transition="true" class="content-cover">
							</easy-loadimage>
							<view class="image-item-cover-tags">
								<text v-if="item.gold == 0">免费</text>
								<text v-else>{{item.gold}}金币</text>
								<text v-if="item.is_vip == 1">VIP专项</text>
							</view>
							<view class="image-item-cover-num">
								<text>{{item.buy_num}}人已购买</text>
							</view>
						</view>
						<view class="image-content">
							<view class="image-content-text">
								<rich-text class="title" :nodes="item.title">...</rich-text>
								<rich-text class="sub" :nodes="item.content">...</rich-text>
							</view>
							<view class="image-content-bottom">
								<view class="image-contnet-bottom-data">
									<text>年龄:{{item.price?item.price: '0'}}/三围:{{item.hours?item.hours:'0'}}/服务:{{item.size?item.size:'0'}}</text>
								</view>
								<view class="image-contnet-bottom-date">
									<view class="image-content-bottom-date-text">
										<uni-icons type="location" color="#999999" size="16"></uni-icons>
										<text>{{item.city}}</text>
									</view>
									<view class="image-content-bottom-date-text">
										<uni-icons type="eye" color="#999999" size="16"></uni-icons>
										<text>{{item.click}}</text>
									</view>
								</view>
							</view>
							<view v-if="item.tag_name" class="image-content-tag">
								<text>{{item.tag_name}}</text>
							</view>
						</view>
					</view>
				</block>
			</view>
			<!--<view class="moreTig" v-if="isMoreTig">{{isMoreMsg}}</view>-->
			<view class="video-desc">共搜索到{{videoCount}}个与<text class="colorRed">{{searchWord}}</text>相关的{{currentTab.name}}
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
		<uni-popup ref="popupBuy" type="center">
			<view class="popup-buy">
				<image src="/static/imgs/nt.png" class="popup-bg-xx"></image>
				<view class="buy-title">温馨提示</view>
				<view class="buy-content">需要支付{{buyInfo.gold}}金币，您的支持我的动力</view>
				<view class="buy-btn">
					<text class="btn" @click="buyPicture(buyInfo)">扣币进入</text>
					<view class="btn right" @click="noBuy">取消</view>
				</view>
			</view>
		</uni-popup>
		<css-loading ref="cssLoading"></css-loading>
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
				allHide: false,
				goodHide: false,
				svodHide: false,
				isSearchShow: true,
				logList: {},
				hotList: {},
				allList: {},
				goodList: {},
				svodList: {},
				isSearchs: 1,
				search: '',
				searchWord: '',
				userId: 0,
				utils: utils,
				videoList: [],
				videoCount: 0,
				scrollTop: 0,
				page: 1,
				api: api,
				currentTab: {
					type: 'video',
					name: '长视频'
				},
				formKey: 'video',
				tabList: [{
						type: 'video',
						name: '长视频'
					},
					{
						type: 'short',
						name: '短视频'
					},
					{
						type: 'plaza',
						name: '社区'
					},
					{
						type: 'image',
						name: '官方约炮'
					}
				],
				buyInfo: {}, //收费金币数
				userInfo: {},
				isLogin: false,
			}
		},
		onLoad(e) {
			_self = this;
			_self._showLoading('加载中,请稍后...');
			var info = api.getLogins();
			if (info != false) _self.userId = info.userId;
			_self.getUserInofo()
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
			if (e.keyword && e.keyword.length > 0) {
				_self.search = e.keyword
				_self.searchKey(1)
			}
			if (e.form && e.form.length > 0) {
				_self.formKey = e.form
				_self.tabList.forEach(n => {
					if (n.type == _self.formKey) {
						_self.changeTab(n)
					}
				})
			}
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
			filterHTMLTag(msg) {
			    var msg = msg.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
			    msg = msg.replace(/[|]*\n/, '') //去除行尾空格
			    msg = msg.replace(/&npsp;/ig, ''); //去掉npsp
			    return msg;
			},
			goShort(item)
			{
				item.title = this.filterHTMLTag(item.title)
				api.jumpUrl('/pages/svod/player?info='+JSON.stringify(item), 'new')
			},
			getUserInofo() {
				uni.request({
					url: api.apiData.getInfo,
					method: 'POST',
					data: {
						userId: _self.userId,
						hasImageDown: 1
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						if (e.data.Code == 200) {
							_self.userInfo = e.data.Data;
							_self.isLogin = true;
						} else {
							api.delLogins();
							_self.isLogin = false;
						}
					},
					fail: () => {
						api.showToast('服务器连接失败，请检查网络是否正常', 3000);
					}
				});
			},
			buyPicture(i) {
				if (!_self.isLogin) {
					api.showToast('登录已超时或未登录');
					let timer = setTimeout(() => {
						_self.skipUrl('/pages/login/login', 'new');
						clearTimeout(timer);
					}, 500);
					return
				}
				_self._showLoading('付费中...');
				uni.request({
					url: api.apiData.buyPicture,
					method: 'POST',
					data: {
						zid: i.id,
						userId: _self.userId
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						//console.log(i.id); 
						var r = e.data;
						api.showToast(r.Msg, 2000);
						if (r.Code == 200) {
							_self.buyInfo.isBuy = true;
							_self.noBuy();
							let timer = setTimeout(() => {
								_self.goInfo(i.id, 0);
								clearTimeout(timer);
							}, 1000);
						}
					},
					fail: () => {
						// 加载失败提示
						api.showToast("服务器连接失败，请检查网络是否正常", 3000);
					}
				});
			},
			goInfo(id, t) {
				if (t != 0) _self.noBuy();
				_self._hideLoading()
				let timer = setTimeout(() => {
					_self.skipUrl('/pages/image/info?zid=' + id, 'new');
					clearTimeout(timer);
				}, t)
			},
			userWatch(i) {
				_self.buyInfo = _self.videoList[i];
				if (!_self.userInfo.isVip && _self.buyInfo.is_vip == 1) {
					_self.$refs.showintroduction.open();
				} else
				if (_self.buyInfo.gold > 0 && !_self.buyInfo.isBuy) {
					_self.$refs.popupBuy.open();
				} else {
					_self.goInfo(_self.buyInfo.id, 0);
				}
			},
			cancel() {
				this.$refs['showintroduction'].close()
			},
			noBuy() {
				_self.$refs.popupBuy.close();
			},
			gotoVIP() {
				_self.skipUrl('/pages/recharge/recharge?type=2', 'new');
			},
			goHome(uid) {
				if (uid == 0) {
					api.showToast('模拟数据，请重启APP', 2000);
					return
				}
				var param = {
					url: '/pages/video/search?form=plaza%26keyword=' + _self.search,
					t: 'new'
				}
				_self.skipUrl('/pages/member/home_page?type=' + JSON.stringify(param) + '&uid=' + uid, 'new');
			},
			skipUrl(uri = '/pages/login/login', type = 'new') {
				api.jumpUrl(uri, type)
			},
			convertNumer(str) {
				let num = parseFloat(str)
				if (num > 10000) return (num / 10000).toFixed(2) + '万'
				return num
			},
			playVideo(vid) {
				uni.setStorage({
					key: 'vid',
					data: vid,
					success: () => {
						var param = {
							url: '/pages/video/class',
							t: 'tab'
						}
						api.jumpUrl('/pages/video/play?type=' + JSON.stringify(param), 'new');
					},
					fail: () => {
						api.showToast('播放失败，请检查网络是否正常');
					}
				});
			},
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
			// 同步接口清空搜索记录
			delSearchLog() {
				_self._showLoading('处理中...');
				uni.request({
					url: api.apiData.emptySearch,
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
						_self._hideLoading();
					},
					fail: () => {
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
				if (_self.search.length == 0) {
					_self.isSearchShow = true;
				} else {
					_self.searchKey(1);
				}
			},
			changeTab(tab) {
				_self.currentTab = tab
				_self.searchKey(2);
			},
			searchKey(ex) {
				if (ex) _self.page = 1;
				_self._showLoading('搜索中,请稍后...');
				if (!_self.search || _self.search.length == 0) {
					_self._hideLoading();
					return api.showToast('请输入搜索关键字', 2000);
				}
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
				_self.searchWord = _self.search
				//console.log(_self.userId+'=='+_self.did+'=='+_self.search)
				uni.request({
					url: api.apiData.searchVideo,
					method: 'POST',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						uid: _self.userId,
						did: _self.did,
						key: _self.search,
						page: _self.page,
						type: _self.currentTab.type
					},
					success: (e) => {
						var data = e.data;
						_self.videoCount = 0;
						_self._hideLoading();
						if (data.Code == 201) {
							return api.showToast(data.Msg, 2000);
						} else if (data.Code == 202) {
							_self.isSearchShow = false;
							if (e && _self.page == 1) {
								_self.videoList = []
								//api.showToast(data.Msg, 2000);
							} else {
								api.showToast("已到顶到胃了");
							}
							_self.videoCount = _self.videoList.length;
							_self.isMoreMsg = "——— 我是有底线的 ———";
							_self.page = _self.page - 1;
							_self.isMore = true;
							return false;
						}
						//console.log(3)
						if (_self.page > 1) _self.isMoreTig = true;
						if (data.Data.video.length > 0) {
							_self.isMoreMsg = "——— 加载数据中 ———";
							if (e && _self.page == 1) {
								_self.videoList = data.Data.video;
							} else {
								_self.videoList = _self.videoList.concat(data.Data.video);
							}
						}
						_self.videoCount = _self.videoList.length;
						_self.isSearchShow = false;
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
				//console.log(_self.did)
				uni.request({
					url: api.apiData.getHotSearch,
					method: 'POST',
					data: {
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
						if (res.hotList.length) {
							_self.hotList = res.hotList;
							_self.hotHide = true;
						}
						if (res.allList.length) {
							_self.allList = res.allList;
							_self.allHide = true;
						}
						if (res.goodList.length) {
							_self.goodList = res.goodList;
							_self.goodHide = true;
						}
						if (res.svodList.length) {
							_self.svodList = res.svodList;
							_self.svodHide = true;
						}
					},
					fail: () => {
						// 加载失败提示
						_self.back('服务器连接失败，请检查网络是否正常');
					},
					complete: () => {
						_self._hideLoading();
					}
				});
			},
			// 返回上一层
			backUrl() {
				if (_self.isSearchShow) {
					api.jumpUrl('/pages/video/class', 'tab');
				} else {
					_self.page = 1;
					_self.videoList = [];
					_self.isSearchShow = true;
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
			if (!_self.isMore && !_self.isSearchShow) {
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
	.left {
		float: left;
	}

	.right {
		float: right;
	}

	.moreTig {
		width: 100%;
		text-align: center;
		color: #999999;
		font-size: 25upx;
		margin-top: 20upx;
		padding-bottom: 30px;
	}

	.colorRed {
		color: #B01A1C;
	}

	.video-list {
		width: 97%;
		padding: 1px 0 10px 3%;
	}

	.video-desc {
		width: 100%;
		text-align: center;
		font-size: 12px;
		color: #999999;
		margin: 10px 0;
	}

	.video-info {
		width: 45%;
		height: 265upx;
		border-radius: 5px;
		border: 1px solid #E5E5E5;
		padding-bottom: 8px;
		display: inline-block;
		margin: 0 0 3% 2%;
		position: relative;
	}

	.video-info image {
		width: 100%;
		height: 200upx;
		border-radius: 5px 5px 0 0;
	}

	.video-info .title {
		font-size: 12px;
		color: #CCCCCC;
		line-height: 30upx;
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

	.search-all-content {
		width: 92%;
		font-size: 13px;
		border-radius: 3px;
		margin: 0 5% 0 3%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		max-height: 260upx;
		overflow: hidden;
	}

	.search-all-item {
		width: auto;
		padding: 8upx 16upx;
		margin: 2upx 4upx 10upx 10upx;
		background-color: #777;
		color: #F1F1F1;
		font-size: 14px;
		border-radius: 6upx;
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
		padding: 0 20upx;
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


	.svod-video-item {
		display: inline-block;
		width: 210upx;
		position: relative;
		margin-bottom: 10upx;
		margin-right: 16upx;
	}

	.svod-video-item .video-title {
		width: 100%;
		text-align: center;
	}

	.svod-video-item .cover {
		width: 100%;
		height: 260upx;
		border-radius: 8px;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.item-extra {
		position: absolute;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		color: #FFF;
		font-size: 12px;
		font-weight: 200;
		width: 100%;
		padding: 3upx 10upx;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.item-extra image {
		width: 56upx;
		height: 26upx;
		margin-right: 10upx;
	}

	.is-vip {
		width: 32px;
		height: 16px;
		position: absolute;
		margin-bottom: -16px;
		z-index: 1;
	}

	.video-bottom {
		width: 50%;
		height: 30px;
		background-color: #272733;
		border-radius: 30px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin: 13px auto 23px;
	}

	.video-title {
		font-size: 12px;
		line-height: 16px;
		padding: 5px 0 2px 0;
		width: 100%;
		color: rgba(255, 255, 255, 0.7);
		display: -webkit-box;
		text-overflow: ellipsis;
		overflow: hidden;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.video-item .cover {
		width: 260upx;
		height: 180upx;
		border-radius: 8px;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.cover>>>.origin-img {
		border-radius: 8px;
	}

	.video-item {
		display: inline-block;
		width: 260upx;
		height: 180upx;
		position: relative;
		margin-right: 16upx;
	}

	.search-svod-content {
		margin-bottom: 20upx;
	}

	.search-tabs {
		width: 100%;
		box-sizing: border-box;
		padding: 6upx 18upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-bottom: 20upx;
	}

	.search-tab-item {
		width: 25%;
		height: 50upx;
		font-size: 16px;
		color: #FFF;
	}

	.search-tab-item.active text {
		color: #F2692F;
		font-weight: bold;
		border-bottom: 2px solid #F2692F;
	}


	.video-info-icos {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		font-size: 12px;
		color: #FFF;
		background-color: rgba(0, 0, 0, .3);
		position: absolute;
		bottom: 80upx;
		left: 0;
		height: 40upx;
		padding: 0 16upx;
		box-sizing: border-box
	}

	.video-info-icos .ico-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-right: 16upx;
	}

	.video-info-icos .ico-item image {
		height: 20upx;
		width: 22upx;
		margin-right: 4upx;
	}

	.short-info .v-list-title {
		position: absolute;
		margin-top: -74upx;
		background-color: rgba(0, 0, 0, 0.2);
		color: #fff;
		font-size: 12px;
		width: 98%;
		overflow: hidden;
		height: 32upx;
		padding: 2px 1%;
	}

	.short-info-icos {
		position: absolute;
		margin-top: -36upx;
		background-color: rgba(0, 0, 0, 0.2);
		color: #fff;
		font-size: 12px;
		width: 98%;
		overflow: hidden;
		height: 32upx;
		padding: 2px 1%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.short-info-icos .ico-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-right: 16upx;
	}

	.short-info-icos .ico-item image {
		height: 20upx;
		width: 22upx;
		margin-right: 4upx;
	}



	.short-info .is-vip {
		width: 32px;
		height: 16px;
		position: absolute;
		margin-bottom: -16px;
		z-index: 1;
	}


	.short-info .video-bottom {
		width: 50%;
		height: 30px;
		background-color: #272733;
		border-radius: 30px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin: 12px auto 23px;
	}

	.short-info-video-title {
		font-size: 12px;
		line-height: 16px;
		padding: 5px 0 2px 0;
		width: 100%;
		color: rgba(255, 255, 255, 0.7);
		display: -webkit-box;
		text-overflow: ellipsis;
		overflow: hidden;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.short-info .video-item .cover {
		width: 100%;
		height: 165px;
		border-radius: 8px;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.cover>>>.origin-img {
		border-radius: 8px;
	}

	.short-info:nth-child(2n) {
		margin-left: 1%;
	}

	.short-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		width: 100%;
		height: auto;
		box-sizing: border-box;
		padding-right: 3%;
	}

	.short-info {
		display: inline-block;
		width: 32%;
		position: relative;
		margin-bottom: 7px;
		overflow: hidden;
	}


	.plaza-info {
		font-size: 26upx;
		width: 97%;
		background-color: rgba(255, 255, 255, 0.03);
		border-radius: 15upx;
		padding: 20upx;
		margin-bottom: 20upx;
		box-sizing: border-box;
	}



	.plaza-info .center-content-text .more {
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

	.plaza-info .center-content-text {
		font-size: 28upx;
		margin-bottom: 20upx;
		color: #FFFFFF;
		//background-color: #009688;
	}

	.plaza-info ._imgmore {
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

	.plaza-info ._imgmore1 {
		display: inline-block;
		text-indent: 0;
		width: 100% !important;
		height: 260px !important;
		overflow: hidden;
		border-radius: 5px;
		//background-color: #007AFF;
	}

	.plaza-info ._imgmore2 {
		display: inline-block;
		text-indent: 0;
		width: 48% !important;
		margin-left: 1.3%;
		height: 180px !important;
		overflow: hidden;
		border-radius: 5px;
		//background-color: #007AFF;
	}






	.image-item {
		width: 100%;
		border-radius: 20upx;
		background-color: #3b3b3b;
		color: #8b8b8b;
		display: flex;
		flex-direction: row;
		padding: 20upx;
		box-sizing: border-box;
		height: 300upx;
		margin-bottom: 20upx;
	}

	.image-item-cover {
		width: 200upx;
		height: 260upx;
		border-radius: 15upx;
		overflow: hidden;
		position: relative;
		background-color: #8b8b8b;
		margin-right: 20upx;
	}

	.image-item-cover .content-cover {
		width: 100%;
		height: 100%;
	}

	.image-content {
		flex: 1;
		font-size: 14px;
		line-height: 30upx;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.image-content-text {
		flex: 1;
		width: 100%;
		display: flex;
		flex-direction: column;
		height: 160upx;
	}

	.image-content-text .sub {
		width: 100%;
		overflow: hidden;
		height: calc(100% - 76upx);
	}

	.image-item .title {
		width: calc(100% - 160upx);
		height: 60upx !important;
		line-height: 60upx;
		font-size: 15px;
		font-weight: bold;
		color: #FFF;
		margin-bottom: 10upx;
		overflow: hidden;
	}

	.image-content-bottom {
		width: 100%;
		height: 100upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}

	.image-contnet-bottom-data {
		width: 100%;
		height: 60upx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.image-contnet-bottom-date {
		width: 100%;
		height: 40upx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.image-content-bottom-date-text {
		margin-right: 20upx;
		font-size: 14px;
	}

	.image-content-bottom-date-text text {
		margin-left: 10upx;
	}

	.image-item-cover-tags {
		position: absolute;
		right: 0;
		bottom: 0;
		font-size: 11px;
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: flex-start;
	}

	.image-item-cover-tags text {
		margin-bottom: 20upx;
		padding: 4upx 10upx;
		background: #aaa;
		border-radius: 10upx;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.image-item-cover-num {
		position: absolute;
		top: 0;
		right: 0;
		font-size: 12px;
		color: #FFF;
		border-bottom-left-radius: 15upx;
		background-color: #eb6532;
		padding: 6upx 12upx;
	}

	.image-content-tag {
		width: 180upx;
		height: 50upx;
		position: absolute;
		right: -20upx;
		top: -20upx;
		color: #FFF;
		background: url(@/static/image/right-vod-tip-1.png) center center no-repeat;
		background-size: 100% 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 600;
	}

	.image-content-tag text {
		margin-top: -6upx;
		text-shadow: 0 1upx 2upx rgba(0, 0, 0, .35);
	}

	.image-item:nth-child(2n) .image-content-tag {
		background-image: url(@/static/image/right-vod-tip-2.png);
	}

	.image-item:nth-child(3n) .image-content-tag {
		background-image: url(@/static/image/right-vod-tip-3.png);
	}

	.image-item:nth-child(4n) .image-content-tag {
		background-image: url(@/static/image/right-vod-tip-4.png);
	}

	.image-item:nth-child(5n) .image-content-tag {
		background-image: url(@/static/image/right-vod-tip-5.png);
	}

	.popup-bg-xx {
		width: 230upx;
		height: 200upx;
		position: absolute;
		right: 0upx;
		top: -80upx
	}

	.buy-btn .btn {
		display: inline-block;
		padding: 0 30upx;
		height: 70upx;
		line-height: 70upx;
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		border-radius: 13upx;
		color: #FFFFFF;
		text-align: center;
		font-size: 12px;
		box-shadow: inset 0px 1px rgba(255, 255, 255, 0.4), 0 3px 8px rgba(0, 0, 0, 0.5);
	}

	.buy-content {
		margin: 30upx 0 40upx;
	}

	.buy-title {
		font-size: 33upx;
		font-weight: bold;
	}

	.popup-buy {
		font-size: 30upx;
		width: 500upx;
		color: #666;
		padding: 30upx 30upx;
		border-radius: 15upx;
		background-color: #FFFFFF;
		box-shadow: inset 0px 1px rgba(255, 255, 255, 0.4), 0 3px 8px rgba(0, 0, 0, 0.5);
	}

	.image-item .content-cover>>>.origin-img {
		border-radius: 15upx 15upx 0 0;
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
</style>