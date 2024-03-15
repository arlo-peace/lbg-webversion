<template>
	<view class="conbox">
		<!-- 视频播放框 -->
		<view class="top-box">
			<video id='video1' class="video" object-fit="contain" :direction="direction" :src="videourl"
				:autoplay="true" :loop="true" :initial-time="initialtime" :controls="controls" :poster="poster"
				@play="onstart" @pause="onpause" @error="onfail" @timeupdate="timeupdate"
				@fullscreenchange="fullscreenchange" @loadedmetadata="loadedmetadata" v-if="isShowPlay">
			</video>
			<!--切换路线-->
			<view class='video-line-box' v-if="_self.videoline.length > 1 && loadings != 1">
				<view class='video-line' @click="changeline(0, _self.videoline[0].title)">
					<text style="font-size: 14px;"
						:class="_self.currentline == 0 ?'current-line':'no-current-line'">{{ _self.videoline[0].title}}
					</text>
				</view>
				<image class="video-line-exchange-icon" src="@/static/imgs/exchange_icon.png"></image>
				<view class='video-line' @click="changeline(1, _self.videoline[1].title)">
					<text style="font-size: 14px;"
						:class="_self.currentline == 1 ?'current-line':'no-current-line'">{{ _self.videoline[1].title}}</text>
				</view>
			</view>
			<image class="before-ad" v-if="isHide == 0" @click="open(ad_url)" :src="ad_img" mode="aspectFit"></image>
			<image class="pause-ad"
				:style="{ width:windowWidth+ 'px',height: pauseHeight + 'px',left:pauseLeft+ 'px',top:pauseTop+'px', }"
				v-if="ispause == 1 && ad_img" @click="open(ad_url)" :src="ad_img"></image>

			<view class="ad-time" @click="skip" v-if="seconds != 0">{{ seconds }} | VIP可跳过广告 </view>
			<view class="ad-time" v-if="trySeconds != 0">{{ trySeconds }} S 后试看结束 </view>

			<text class="video-rate" @click="openRate" v-if="nowRate==1">倍速</text>
			<text class="video-rate" @click="openRate" v-else>x {{nowRate}}</text>
			<view class="rate-list" v-if="isShowRate">
				<text class="rate-list-text" :class="nowRate==r?'rate-list-text-sel':''" @click="setRate(r)"
					v-for="(r, i) in rateList" :key="i">x {{r}}</text>
			</view>
		</view>

		<view class="video-gold-tips-box-mask" v-if="_self.showNotGoldTips && loadings != 1">
			<view class="video-tips-box video-gold-tips-box" v-if="true">
				<view style="color: #fff;font-size: 16px;">{{ _self.showMsgContent }}</view>
				<view class="tips-bt-box">
					<view class="tips-bt flex-row" @click="clickConfirm('_self.'+_self.confirmType+'()')">
						{{ _self.confirmText }}
					</view>
				</view>
			</view>
		</view>

		<view class="content-head" @click="back(1)">
			<image class="backimage" src="@/static/imgs/back.png" mode="aspectFill"
				style="width:20px;height:20px;margin:5px 0 0 -3px;"></image>
		</view>

		<view class='placeholder-box' style="width:100%;height:270px;background-color: #1D1D28;"
			v-if="_self.videoline.length > 1"></view>
		<view class='placeholder-box' style="width:100%;height:225px;background-color: #1D1D28;" v-else></view>

		<div class="ad-list" @click="jumpAdUrl('/pages/member/poster', 'new')"
			v-if="!info.isVip&&isShowFree&&freeWacth.count>0">
			<text class="watch-free"
				:style="{'background-image':'url('+imageURL+')'}">今日剩余观看次数：{{freeWacth.free}}/{{freeWacth.count}}</text>
		</div>

		<!-- 视频详情 -->
		<view class='video-content' v-if="loadings != 1">
			<view class='video-info-box'>
				<view class='video-title' style="padding: 0;">{{_self.info.videoInfo.title}}</view>
				<div class='flex-row relative'>
					<div class="video-gold" style="padding-right:0;margin-left:0;" v-if="info.isVip">
						<text class='video-gold-num' style="color:#ff9030;font-size:12px;">尊贵的VIP</text>
					</div>
					<div class="video-gold" style="padding-right:0;margin-left:0;"
						v-else-if="true">
						<image class="video-gold-image" src="@/static/imgs/gold.png" style="height:13px;width:13px;">
						</image>
						<text class='video-gold-num'
							style="color:#ff9030;font-size:12px;">{{_self.info.videoInfo.gold}}</text>
					</div>
					<div class="video-gold" style="padding-right:0;margin-left:0;" v-else>
						<text class='video-gold-num' style="color:#ff9030;font-size:12px;">限免</text>
					</div>
					<image src="/static/imgs/_rd.png"
						style="height:13px;width:13px;margin-left:5px;margin-bottom:-2px;"></image>
					<text class='video-click-num'
						style="font-size:12px;color:#999999;">{{_self.info.videoInfo.click}}次播放</text>
					<image src="/static/imgs/_rd.png"
						style="height:13px;width:13px;margin-left:5px;margin-bottom:-2px;"></image>
					<text class='video-click-num'
						style="font-size:12px;color:#999999;">{{_self.info.videoInfo.className}}</text>
					<image src="/static/imgs/_rd.png"
						style="height:13px;width:13px;margin-left:5px;margin-bottom:-2px;"></image>
					<text class='video-click-num'
						style="font-size:12px;color:#999999;">{{utils.timeTodate('Y年m月d日',info.videoInfo.add_time+'')}}</text>
					<!-- <text style="margin: 10px;" @click="playDemo">测试</text> -->
				</div>
				<div class='video-operation-box flex-row relative' style="margin-bottom:5px;margin-top:0px;width:100%;">
					<div class="action-buttons" style="margin:0 20upx 0 -20upx;" @click="like()">
						<view>
						<image class="video-operation-image" v-if="info.isLike == 1" src="@/static/imgs/like.png">
						</image>
						<image class="video-operation-image" v-else src="@/static/imgs/like_un.png"></image>
						<text style="font-size:11px;color:#999999;">点赞({{info.likeSum}})</text>
						</view>
					</div>

					<div class="action-buttons" @click="collection()">
						<view>
						<image class="video-operation-image" v-if="info.isCollection == 1"
							src="@/static/imgs/collection.png"></image>
						<image class="video-operation-image" v-else src="@/static/imgs/collection_un.png"></image>
						<text style="font-size:11px;color:#999999;width:25px;text-align:center;">收藏</text>
						</view>
					</div>

					<div class="action-buttons" @click="jumpUrl('member/poster', 'new')">
						<view>
						<image class="video-operation-image" :src="shareImg"></image>
						<text style="font-size:11px;color:#999999;width:25px;text-align:center;">分享</text>
						</view>
					</div>
					<!-- <div style="display:inline-block;" @click="selectLine()" v-if="subLineList.length>0">
						<image class="video-operation-image" src="@/static/imgs/_cut.png"></image>
						<text style="font-size:11px;color:#B01A1C;">线路 {{lineName}}</text>
					</div> -->
					<div class="show-introduction flex-row"
						style="width:150upx;text-align:right;line-height:60upx;height:60upx;">
						<text class="show-introduction-text" @click="showIntroduction()">简介</text>
						<uni-icons class="show-introduction-icons" type="forward" color="#cccccc" size="22"
							style="margin-right:-5px;" @click="showIntroduction()"></uni-icons>
					</div>
				</div>

			</view>
			<div style="height:80upx;line-height:80upx;background-color:#20202C;margin-top:20upx;padding:0 20upx;"
				@click="goAuthorHome(author.id)" v-if="author.id>0">
				<image class="author-tx" :src="author.headimgurl" mode="aspectFill"></image>
				<div class="author-username">{{author.username}}</div>
				<div class="author-home">作者主页</div>
			</div>
			<div style="width:100%;background-color:#1D1D28;padding:10upx 0 20upx 0;" v-if="adList.length>0">
				<div class="ad-list" v-for="(a, i) in adList" :key="i">
					<image class="ad-img" :style="{ height: a.height+'px' }" :src="a.content" mode="aspectFill"
						@click="jumpAdUrl(a.url, 'web')"></image>
				</div>
			</div>
			<div style="background-color:#1D1D28;padding-left:20upx;margin-top:20upx;"
				v-if="info.productionList.length>0">
				<div>
					<div class="title" style="margin-top:-8upx;display:inline-block;font-size:16px;">演员或出品</div>
				</div>
				<div>
					<scroll-view class="production-scroll" :show-scrollbar="false" scroll-x="true">
						<div class="production-info" v-for="(s, i) in _self.info.productionList" :key="i">
							<div class="production-item">
								<image @click="goProduction(s.id)" class="production-img" :src="s.thumbnail"
									mode="aspectFill"></image>
								<div @click="goProduction(s.id)" class="production-title">
									{{s.name}}
								</div>
								<image @click="focusProduction(i)"
									:src="`/static/production/${s.focus ? 'guanzhu002' : 'guanzhu001'}.png`"
									class="production-focus"></image>
							</div>
						</div>
					</scroll-view>
				</div>
			</div>
			<div style="background-color:#1D1D28;padding-left:20upx;margin-top:20upx;" v-if="info.simi.length>0">
				<div>
					<div class="title" style="margin-top:-8upx;display:inline-block;font-size:16px;">相关视频</div>
				</div>
				<div>
					<scroll-view class="teleplay-scroll" :show-scrollbar="false" scroll-x="true">
						<div class="simi-info" v-for="(s, i) in _self.info.simi" :key="i" @click="playVideo(s.id)">
							<image class="simi-img" :src="s.thumbnail" mode="aspectFill"></image>
							<div class="simi-title">{{s.title}}</div>
						</div>
					</scroll-view>
				</div>
			</div>
			<!-- 猜你喜欢 -->
			<view class="guess-video-list flex-row">
				<view
					style="width: 100%;height:21px;line-height:21px;padding: 0 20rpx;font-size:16px;color:#FFFFFF;margin-left:10px;margin-bottom:30upx;border-left: 6px solid #FF8F00;">
					<view style="display:inline-block;position:absolute;">猜你喜欢</view>
				</view>

				<view class="video-info" v-for="(i, k) in info.guess" :key="k" @click="playVideo(i.id)">
					<view>
						<image class="is-vip" src="/static/play/ico_vip.png" v-if="true"></image>
						<image class="is-vip" src="/static/play/ico_free.png" v-else></image>
						<image class="guess-video-img" :src="i.thumbnail" mode="aspectFill"></image>
						<view class="video-playTime" v-if="i.play_time">{{i.play_time}}</view>
						<view class="video-title video-info-video-title">{{i.title}}</view>
						<view class="video-gold">
							<image src="/static/homePage/click.png" mode="aspectFill"></image>{{i.click}}
						</view>
						<view class="video-date">{{utils.timeTodate('Y-m-d',i.update_time+'')}}</view>
					</view>
				</view>
			</view>

			<!-- 评论列表 -->
			<view class="uni-comment-list-box">
				<view style="width:100%;height:21px;line-height:21px;font-size:16px;color:#FFFFFF;">
					<view
						style="display:inline-block;position:absolute;border-left: 6px solid #FF8F00;padding-left:10px;">
						网友吐槽</view>
				</view>

				<view class="uni-comment" v-if="commentList.list.length">
					<view class="uni-comment-list flex-row" v-for="(i, k) in commentList.list" :key="k">
						<view class="uni-comment-face flex-row">
							<image class="uni-comment-face-img" v-if="i.headimgurl" :src="i.headimgurl"></image>
							<image class="uni-comment-face-img" v-else src="@/static/imgs/head.png"></image>
						</view>
						<view class="uni-comment-body flex-row">
							<view class="uni-comment-top">
								<view class="uni-comment-username">{{i.nickname}}</view>
							</view>
							<view class="uni-comment-date">
								<view class="uni-comment-addtime" v-if="i.last_time">
									{{utils.timeTodate('Y年m月d日', i.last_time+'')}}
								</view>
								<view class="uni-comment-addtime" v-else>刚刚</view>
							</view>
							<view class="uni-comment-content">{{i.content}}</view>
						</view>
					</view>

				</view>
				<view class="uni-not-comment" v-else>
					<image src="/static/empty.png" style="width:100px;height:100px;"></image>
					<view class="not-comment-text">当前暂无评论</view>
				</view>

			</view>

			<div class="add-comment-box" :style="{ bottom: keyheight+'px' }">
				<input class="comment-input" v-model="commentContent" type="text" placeholder="我要说点什么~"
					confirm-type="send" @confirm="comment(e)" @input="onInput" adjust-position="false"
					@keyboardheightchange="keyboardheightchange">
				<text class="comment-send" @click="comment()">发送</text>
			</div>

		</view>

		<!-- 简介 -->
		<uni-popup ref="showintroduction" type="bottom" @change="change">
			<div class="introduction-box"
				:style="{'min-height': (_self.SystemInfo.screenHeight-225) + 'px', 'max-height': (_self.SystemInfo.screenHeight-225) + 'px',}">
				<div class="introduction-head">
					<text class="introduction-title">视频简介</text>
					<image class="introduction-close" src="@/static/imgs/delx.png" @click="cancel('introduction')">
					</image>
				</div>
				<div style="margin:15px;border-bottom:1px solid #F5F5F5;padding-bottom:20upx;">
					<div style="flex-direction:row">
						<text class="introduction-name">片名：</text>
						<text class="introduction-content">{{info.videoInfo.title}}</text>
					</div>
					<div v-if="info.actorList != ''" style="flex-direction:row">
						<text class="introduction-name">主演：</text>
						<text class="introduction-content" style="color:#007AFF;">{{info.actorList}}</text>
					</div>
					<div v-if="info.tagList != ''" style="flex-direction:row">
						<text class="introduction-name">标签：</text>
						<text class="introduction-content" style="color:#007AFF;">{{info.tagList}}</text>
					</div>
					<div style="flex-direction:row">
						<text class="introduction-name">时间：</text>
						<text
							class="introduction-content">{{utils.timeTodate('Y年m月d日', info.videoInfo.add_time+'')}}</text>
					</div>
				</div>
				<div style="background-color: #007AFF;" v-if="info.videoInfo.info">
					<jyf-parser :html="info.videoInfo.info" ref="article" style="font-size: 16px;padding: 10px;">
						数据正在加载中...</jyf-parser>
				</div>
				<div v-else>
					<text class="introduction-text">暂无简介</text>
				</div>
			</div>
		</uni-popup>
		<uni-popup
			ref="popupDownloadAlert" 
			type="center">
			<view class="down-app">
				<text>下载应用程序并继续观看。</text>
				<view class="tips-bt flex-row" @click="appDownload()">
					下载申请表
				</view>
			</view>
		</uni-popup>
		<css-loading ref="cssLoading"></css-loading>
		<view class="show-toast" :style="{width:SystemInfo.windowWidth + 'px',height: SystemInfo.windowHeight+ 'px'}"
			v-if="showToast">
			<view class="show-toast-box">
				<text class="show-toast-box-text" v-for="t,i in texts" :key="i">{{t}}</text>
			</view>
		</view>
	</view>

</template>
<style>
	.is-vip {
		width: 32px;
		height: 16px;
		position: absolute;
		z-index: 1;
	}

	// 倍数
	.rate-list {
		position: absolute;
		border-radius: 3rpx;
		background-color: rgba(0, 0, 0, 0.5);
		top: 25px;
		right: 130rpx;
		z-index: 12;
		flex-direction: column;
		padding: 10rpx 0;
		display: flex;
	}

	.rate-list-text {
		color: #FFFFFF;
		font-size: 30rpx;
		padding: 10rpx 20rpx;
	}

	.rate-list-text-sel {
		color: #FF8F00 !important;
	}

	.video-rate {
		position: absolute;
		height: 26px;
		line-height: 26px;
		width: 100rpx;
		text-align: center;
		border-radius: 3rpx;
		background-color: rgba(0, 0, 0, 0.5);
		top: 97px;
		right: 30rpx;
		font-size: 28rpx;
		color: #FFFFFF;
		z-index: 12;
		font-weight: bold;
	}

	.author-home {
		float: right;
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		color: #FFFFFF;
		font-size: 26upx;
		padding: 0 20upx;
		height: 60upx;
		line-height: 60upx;
		margin-top: 10upx;
		border-radius: 10upx;
	}

	.author-username {
		display: inline-block;
		height: 80upx;
		line-height: 80upx;
		margin-left: 20upx;
		font-size: 30upx;
		color: #FFFFFF;
	}

	.author-tx {
		border-radius: 50%;
		height: 50upx;
		width: 50upx;
		float: left;
		margin-top: 15upx;
	}

	.simi-info {
		width: 230upx;
		height: 190upx;
		margin-right: 10upx;
		margin-bottom: 25upx;
		display: inline-block;
		//background-color: #007AFF;
	}

	.simi-img {
		border-radius: 5px;
		height: 150upx;
		width: 230upx;
	}

	.simi-title {
		font-size: 13px;
		color: #999999;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 230upx;
	}

	.teleplay-scroll {
		white-space: nowrap;
		//background-color: #007AFF;
	}

	.production-scroll {
		white-space: nowrap;
		//background-color: #007AFF;
	}

	.production-info {
		width: 25%;
		height: 190upx;
		margin-bottom: 25upx;
		box-sizing: border-box;
		display: inline-block;
	}

	.production-item {
		width: 100%;
		height: 100%;
		padding: 0 20upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.production-img {
		border-radius: 70px;
		height: 140upx;
		width: 140upx;
		border: #999 2px solid;
		margin-bottom: 10upx;
	}

	.production-title {
		font-size: 13px;
		color: #999999;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 150upx;
		text-align: center;
	}

	.production-focus {
		width: 40upx;
		height: 40upx;
		position: absolute;
		top: 110upx;
		right: 20upx;
		z-index: 1;
	}

	.teleplay-number {
		width: 93upx;
		height: 86upx;
		line-height: 86upx;
		color: #666666;
		background-color: #E5E5E5;
		text-align: center;
		border-radius: 5px;
		margin-right: 5px;
		margin-bottom: 5px;
		font-size: 15px;
	}

	.introduction-name,
	.introduction-content {
		font-size: 14px;
		color: #444;
		line-height: 22px;
		width: 110upx;
		font-weight: bold;
	}

	.introduction-content {
		font-weight: 100;
		width: 600upx;
	}

	.introduction-text {
		font-size: 30upx;
		padding-top: 20upx;
		lines: 0;
		color: #666666;
		width: 95%;
		text-align: center;
		display: block;
		//background-color: #007AFF;
	}

	.video-list {
		width: 97%;
		padding: 10px 3% 20px 0;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		/* Firefox */
		-webkit-box-sizing: border-box;
	}

	.video-list view {
		//display: inline-block;
	}

	.videoImg {
		width: 100%;
		height: 200upx;
		border-radius: 8px 8px 0 0;
		background: #e2e2e2;
		display: inline-block;
	}

	.video-list>>>.origin-img {
		border-radius: 8px 8px 0 0;
	}

	.video-playTime {
		font-size: 18upx;
		background-color: rgba(0, 0, 0, 0.4);
		color: #FFFFFF;
		padding: 0 10upx;
		height: 34upx;
		line-height: 34upx;
		border-radius: 5upx;
		position: relative;
		float: left;
		margin: -45upx 0 0 10upx;
		z-index: 2;
		display: inline-block;
	}

	.video-info {
		display: inline-block;
		width: 44%;
		background: #1D1D28;
		margin: 0 0 25upx 4%;
		border-radius: 8px;
		font-size: 28upx;
		padding: 0 0 10upx 0;
		border: 1px solid #333;
		//box-shadow: 0px 4px 6px 0px rgba(103, 103, 103, 0.2);
	}

	.video-title {
		padding: 0upx 2% 5upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 13px;
		line-height: 20px;
		color: rgba(255, 255, 255, 0.8);
	}

	.video-gold {
		margin-left: 10upx;
		height: 30upx;
		line-height: 30upx;
		border-radius: 5upx;
		color: #999999;
		font-size: 12px;
		display: inline-block;
	}

	.video-gold image {
		width: 32upx;
		height: 20upx;
		//margin-bottom: -4upx;
		margin-right: 2px;
	}

	.video-date {
		float: right;
		margin-right: 10upx;
		font-size: 23upx;
		color: #999999;
	}
	.down-app{
		width: 600upx;
		position: relative;
		background-color: #fff;
		border-radius: 6px;
		padding: 20px;
		height: 110px;
		display: flex;
		flex-flow: column;
		align-items: center;
	}
	.down-app text{
		font-size: 26px;
		font-weight: 600;
		color: red;
	}
</style>
<script>
	import api from "@/common/api.js";
	const requestUrl = api.apiData.videoInfo;
	const requestCommentListUrl = api.apiData.commentList;
	const requestAddCollectionUrl = api.apiData.addCollection;
	const requestLikeUrl = api.apiData.videoLike;
	const requestProductionLikeUrl = api.apiData.productionFocus;
	const requestAddCommentUrl = api.apiData.addComment;
	const duration = 30000
	var _self;
	var userid = 0;
	var videoId = 0;
	var lastCommentId = 0; //最后一条评论的id
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import uniSection from '@/components/uni-section/uni-section.vue'
	import uniTransition from '@/components/uni-transition/uni-transition.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import utils from '@/components/shoyu-date/utils.filter.js';
	export default {
		components: {
			uniSection,
			uniPopup,
			uniIcons,
			uniTransition
		},
		data() {
			return {
				showLoading: true,
				controls: false, //是否显示默认播放控件（播放/暂停按钮、播放进度、时间）
				initialtime: "0", //指定视频初始播放位置，单位为秒（s）
				videourl: "https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20181126.mp4",
				poster: '', //视频封面
				seconds: 0, //广告时间
				isHide: 1, //是否显示前置图片广告
				ispause: 0, //是否暂停
				ad_url: "", //广告地址
				ad_img: "", //广告图片
				fireTime: 5,
				adSkip: 0,
				showToast: false,
				downloadAlert: false,
				texts: [],
				info: {
					isVip: false,
					watch: 0,
					videoInfo: {
						title: '加载中...',
					}
				}, //视频数据
				commentList: {
					list: [],
				}, //评论列表
				windowWidth: 280,
				pauseHeight: 150, //暂停广告高度
				pauseLeft: 10, //暂停广告left位置
				pauseTop: 42, //暂停广告top位置
				isTry: 0, //是否是试看
				trySeconds: 0, //试看剩余时间
				videoAd: 0, //是否是视频广告
				loadings: 1,
				barHeight: 23,
				commentContent: '',
				dbName: 'video',
				currentTime: 0, //视频当前播放时间
				did: '', //设备id
				isTryEnd: 0,
				currentline: 0, //当前播放路线（清晰度码率）
				currentVideoType: 2, //当前播放视频类型（1为正式视频2为广告视频）
				videoline: [{}],
				keyheight: 0,
				transfromClass: {
					'position': 'fixed',
					'bottom': 0,
					'left': 0,
					'right': 0,
					'display': 'flex',
					'justify-content': 'center',
					'align-items': 'center'
				},
				transShow: false,
				modeClass: ['slide-bottom'],
				showVideoErrorTips: false,
				showNotGoldTips: false,
				resSize: 0, //视频大小
				showMsgContent: '弹出内容', //提示内容
				confirmText: '确定', //确定按钮文本
				cancelText: '取消', //取消按钮文本
				confirmType: 'confirm', //确定按钮处理事件
				cancelType: 'cancel', //取消按钮处理事件
				palyTimeKey: '', //当前视频播放时间缓存key值
				shareImg: '../../static/imgs/share.png',
				downImg: '../../static/imgs/download.png',
				utils: utils,
				adList: [],

				subLineList: [],
				isPlay: false,
				freeWacth: {
					count: 0,
					free: 0
				},
				imageURL: '../../static/play/free.png',
				isShowFree: false,
				author: {
					id: 0,
					headimgurl: '',
					'usrname': ''
				},
				uri: {
					url: '/pages/video/class',
					t: 'tab'
				},
				rateList: ['0.50', '0.80', '1.00', '1.25', '1.50'], // 倍数
				nowRate: 1, //当前倍数
				isShowRate: false,
				SystemInfo: {},
				direction: -90,
				isTop: false
			}
		},
		onReady() {
			_self.context = uni.createVideoContext("video1", this);
		},
		onHide() {
			_self.context.pause();
			let timer = setTimeout(() => {
				_self.isShowPlay = false;
				clearTimeout(timer);
			}, 800);
		},
		onShow() {
			_self.isShowPlay = true;
			if (_self.isTry != 1) {
				let timer = setTimeout(() => {
					_self.isShowPlay = true;
					clearTimeout(timer);
				}, 800);
			}
			if (_self.showVideoErrorTips || _self.showNotGoldTips) {
				_self.ispause = 0;
			}
		},
		onLoad(e) {
			_self = this;
			_self._showLoading()
			if (e.isTop) _self.isTop = e.isTop
			if (JSON.stringify(e) != '{}') _self.uri = JSON.parse(e.type);
			uni.getSystemInfo({
				success: (res) => {
					_self.SystemInfo = res;
					_self.pauseLeft = (res.screenWidth - _self.windowWidth) / 2;
				}
			});
			_self.reload();
		},
		methods: {
			appDownload() {
				api.jumpUrl(api.apiData.apiUrl+'/redirtype/appdownvideo1')
			},
			goProduction(productionId) {
				api.jumpUrl('/pages/production/detail?id=' + productionId, 'new');
			},
			focusProduction(productionIndex) {
				if (userid) {
					uni.request({
						url: requestProductionLikeUrl,
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded',
						},
						data: {
							productionId: _self.info.productionList[productionIndex].id,
							userId: userid,
						},
						success: (res) => {
							if (res.data.Code == 200) {
								if (_self.info.productionList[productionIndex].focus) {
									api.showToast('取消关注成功');
								} else {
									api.showToast('关注成功');
								}
								_self.info.productionList[productionIndex].focus = !_self.info.productionList[
									productionIndex].focus
							} else {
								api.showToast(res.data.Msg);
							}
						},
						fail: (err) => {
							api.showToast('关注失败');
						},
						complete: () => {
							_self.showLoading = false;
							_self._hideLoading()
						}
					});
				} else {
					_self.showLogin();
				}
			},
			loadedmetadata(e) {
				e = e.detail.height - e.detail.width;
				_self.direction = (e > 50) ? 0 : -90;
			},
			setRate(r) {
				_self.nowRate = Number(r);
				_self.context.playbackRate(_self.nowRate);
				_self.isShowRate = false;
			},
			openRate() {
				_self.isShowRate = !_self.isShowRate;
			},
			goAuthorHome(uid) {
				var param = {
					url: '/pages/video/play',
					t: 'new'
				}
				api.jumpUrl('/pages/member/home_page?type=' + JSON.stringify(param) + '&uid=' + uid, 'new');
			},
			jumpAdUrl(uri, type = 'new') {
				if (uri == '#' || uri == '') return false;
				api.jumpUrl(uri, type);
			},
			reload(e) {
				//console.log(uni.getStorageSync("userInfo"));	
				_self.loadings = 1;
				_self.videourl = "";
				_self.poster = ''; //视频封面
				_self.seconds = 0; //广告时间
				_self.isHide = 1; //是否显示前置图片广告
				_self.ispause = 0; //是否暂停
				_self.ad_url = ""; //广告地址
				_self.ad_img = ""; //广告图片
				_self.isTry = 0; //是否是试看
				_self.trySeconds = 0; //试看剩余时间
				_self.videoAd = 0; //是否是视频广告
				_self.showVideoErrorTips = false;
				_self.showNotGoldTips = false;
				_self.currentVideoType = 2;
				_self.isTryEnd = 0;
				_self.currentTime = 0;
				_self.showMsgContent = '弹出内容';
				_self.confirmText = '确定';
				_self.cancelText = '取消';

				lastCommentId = 0;
				userid = this.getUserId();
				uni.getStorage({
					key: 'mobileDid_' + api.appkey,
					success: (res) => {
						_self.did = res.data.data;
						if (!_self.did) _self.did = res.data;
					}
				});
				uni.getStorage({
					key: 'vid',
					success: (res) => {
						videoId = res.data.data;
						if (!videoId) videoId = res.data;
						_self.palyTimeKey = 'videoPalyTime' + videoId;
						_self.getData();
						_self.getCommentList();
					},
					fail: () => {
						if (!videoId) api.showToast('系统繁忙');
					}
				});
			},
			onInput(e) {
				//传出值
				this.$emit('input', e.target.value)
			},
			keyboardheightchange(e) {
				this.transShow = true;
				//console.log(e);
				//_self.keyheight = e.detail.height > 0 ? e.detail.height : 0;
				if (_self.SystemInfo.platform == "android") {
					_self.keyheight = e.detail.height + plus.navigator.getStatusbarHeight();
				} else {
					_self.keyheight = e.detail.height;
				}

			},
			//喜欢点赞
			like(e) {
				if (userid) {
					uni.request({
						url: requestLikeUrl,
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded',
						},
						data: {
							videoId: videoId,
							userId: userid,
						},
						success: (res) => {
							if (res.data.Code == 200) {
								api.showToast('点赞成功');
								_self.info.isLike = 1;
							} else {
								api.showToast(res.data.Msg);
							}
						},
						fail: (err) => {
							api.showToast('点赞失败');
						},
						complete: () => {
							_self.showLoading = false;
							_self._hideLoading()
						}
					});
				} else {
					_self.showLogin();
				}
			},
			//收藏视频
			collection(e) {
				if (userid) {
					uni.request({
						url: requestAddCollectionUrl,
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded',
						},
						data: {
							videoId: videoId,
							userId: userid,
						},
						success: (res) => {
							//console.log(res);
							if (res.data.Code == 200) {
								api.showToast('收藏成功');
								_self.info.isCollection = 1;
							} else {
								api.showToast(res.data.Msg);
							}
						},
						fail: (err) => {
							api.showToast('收藏失败');
						},
						complete: () => {
							_self.showLoading = false;
							_self._hideLoading()
						}
					});
				} else {
					_self.showLogin();
				}
			},
			//评论视频
			comment() {
				if (userid) {
					_self._showLoading('发送中...');
					uni.request({
						url: requestAddCommentUrl,
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded',
						},
						data: {
							videoId: videoId,
							userId: userid,
							content: _self.commentContent,
						},
						success: (res) => {
							if (res.data.Code == 200) {
								if (res.data.Msg == '评论成功') {
									var newcomment = {
										"content": _self.commentContent,
										"last_time": '',
										"username": _self.info.member.username,
										"headimgurl": _self.info.member.headimgurl,
										"nickname": _self.info.member.nickname,
									}
									_self.commentList.list.unshift(newcomment);
									uni.hideKeyboard();
									api.showToast('评论成功', 2000);
								} else {
									api.showToast(res.data.Msg, 2000);
								}
								_self.commentContent = '';
							} else {
								api.showToast(res.data.Msg, 2000);
							}
						},
						fail: err => {
							api.showToast('评论失败', 2000);
						},
						complete: () => {
							_self.showLoading = false;
							_self._hideLoading()
						}
					});
				} else {
					_self.showLogin();
				}
			},
			showLogin(e) {
				uni.showModal({
					content: '您还没有登录，请先登录后再操作！',
					cancelText: '取消',
					confirmText: '登录',
					success: (res) => {
						if (res.confirm) {
							_self.gotoLogin();
						} else if (res.cancel) {

						}
					}
				});
			},
			startVideo(e) {
				_self.poster = _self.info.videoInfo.thumbnail;
				_self.clickConfirm(_self.tryPaly())
				// if (_self.info.videoInfo.gold > 0) {
				// 	//非免费视频
				// 	if (userid) {
				// 		//已经登录
				// 		if (_self.info.alreadyBuy == 1) {
				// 			_self.beforeAd();
				// 		} else {
				// 			_self.cancelText = '试看视频';
				// 			_self.confirmText = '立即下载';
				// 			_self.showMsgContent = '该视频需 ' + _self.info.videoInfo.gold + ' 金币，确认观看吗？';
				// 			_self.showNotGoldTips = true;
				// 			_self.confirmType = 'download';
				// 			_self.cancelType = 'tryPaly';
				// 		}
				// 	} else {
				// 		//未登录
				// 		_self.cancelText = '立即登录';
				// 		_self.confirmText = '立即下载';
				// 		// _self.showMsgContent = _self.info.watch > 0 ? '游客可试看' + _self.info.feeLook + 's，注册可免费观看' + _self
				// 			// .info.watch + '部视频' : '游客可试看' + _self.info.feeLook + '秒，登录后无限制';
				// 		_self.showMsgContent = '下载app观看完整视频';
				// 		_self.showNotGoldTips = true;
				// 		_self.confirmType = 'download';
				// 		_self.cancelType = 'gotoLogin';
				// 	}
				// } else {
				// 	_self.beforeAd();
				// }
				_self.beforeAd();
			},
			getData() {
				uni.request({
					url: requestUrl,
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						videoId: videoId,
						userId: userid,
						did: _self.did,
						sys: 'web',
					},
					success: (res) => {
						var r = res.data;
						if (r.Code == 201) {
							api.showToast(r.Msg, 1500);
							let timer = setTimeout(() => {
								_self.back();
								clearTimeout(timer);
							}, 1000)
							return;
						}
						_self.info = r.Data;
						_self.adSkip = _self.info.adSkip
						_self.author = _self.info.author;
						_self.videoline = res.data.Data.videoInfo.videoline;
						_self.freeWacth = _self.info.freeWacth;
						if (_self.info.adList.length) _self.adList = _self.info.adList;
						_self.loadings = 0;
						let timer = setTimeout(() => {
							_self.startVideo();
							clearTimeout(timer);
						}, 1000)
					},
					fail: (err) => {
						api.showToast('操作失败');
					},
					complete: () => {
						_self.showLoading = false;
						_self._hideLoading()
						_self.isShowFree = true;
					}
				});
			},
			getCommentList(e) {
				uni.request({
					url: requestCommentListUrl,
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						videoId: videoId,
						lastId: lastCommentId,
						limit: 8,
					},
					success: (res) => {
						if (res.data.Data) {
							if (lastCommentId == 0) {
								_self.commentList = res.data.Data;
							} else {
								var list = res.data.Data.list;
								_self.commentList.list = _self.commentList.list.concat(list);
							}
							_self.commentList.count = res.data.Data.count;
						} else {
							if (res.data.Code == 201) api.showToast(res.data.Msg, 2000);
						}
						if (_self.commentList.list) {
							if (_self.commentList.list.length) {
								lastCommentId = _self.commentList.list[_self.commentList.list.length - 1].id;
							}
						}
					},
					fail: (err) => {
						api.showToast('操作失败');
					},
					complete: () => {
						_self.showLoading = false;
						_self._hideLoading()
					}
				});

			},
			onstart(e) {
				_self.ispause = 0;
			},
			onpause(e) {
				//暂停
				if (_self.videoAd != 1) {
					_self.ad_url = _self.info.ad.pause.url;
					_self.ad_img = _self.info.ad.pause.img;
					_self.ispause = 1;
				} else {
					_self.context.play();
				}
			},
			countDown() {
				//_self.isShows = 0;
				if (_self.seconds <= 0) {
					_self.isHide = 1;
					_self.videourl = _self.info.videoInfo.url;
					_self.currentVideoType = 1;
					_self.play();
				} else {
					let timer = setTimeout(() => {
						if (_self.seconds > 0) {
							_self.seconds--;
							this.countDown();
						}
						clearTimeout(timer);
					}, 1000);
				}
			},
			countTryDown() {
				let timer = setTimeout(() => {
					if (_self.trySeconds > 0) {
						_self.trySeconds--
						this.countTryDown()
					}
					clearTimeout(timer);
				}, 1000);
			},
			skip() {
				if (_self.info.isVip) {
					this.videourl = this.info.videoInfo.url;
					_self.isHide = 1;
					_self.seconds = 0;
					_self.currentVideoType = 1;
					_self.play();
				} else {
					api.showToast('只有VIP才能跳过广告', 2000);
				}
			},
			// 跳转
			open(url) {
				if (url == '#' || url == '') return false;
				api.jumpUrl(url, 'web');
			},
			play(event) {
				_self.videoAd = 0;
				// console.log(_self.info.feeLook)
				if (_self.isTry == 1) {
					_self.controls = false;
					_self.trySeconds = _self.info.feeLook;
					//_self.countTryDown();
				} else {
					var palyTimes = 0;
					uni.getStorage({
						key: _self.palyTimeKey,
						success: (res) => {
							palyTimes = res.data.data;
							if (!palyTimes) {
								palyTimes = res.data;
							}
							_self.initialtime = palyTimes;
						},
						fail() {
							_self.initialtime = 0;
						},
					});
					_self.controls = true;
				}
				let timer = setTimeout(() => {
					//_self.initialtime = 10;
					_self.context.play();
					if (_self.isTry == 1) {
						_self.context.pause()
						_self.context.seek(_self.adSkip)
						_self.context.play()
					}
					clearTimeout(timer);
				}, 500);
			},
			//前置广告
			beforeAd(event) {
				if (_self.info.adTime > 0) {
					_self.seconds = _self.info.adTime;
					_self.ad_url = _self.info.ad.before.url;
					_self.ad_img = _self.info.ad.before.img;
					if (_self.info.ad.before.type == 'video') {
						//console.log('视频广告');
						_self.isHide = 1;
						_self.currentVideoType = 2;
						_self.controls = false;
						_self.videourl = _self.info.ad.before.img;
						_self.videoAd = 1;
						_self.context.play();
					} else {
						_self.isHide = 0;
					}
					_self.countDown();
				} else {
					_self.videourl = _self.info.videoInfo.url;
					_self.play();
				}
			},
			pause(event) {
				_self.context.pause();
			},
			stop() {
				_self.context.seek(1);
				_self.pause();
			},
			fullscreenchange(e) {
				if (e.detail.fullScreen == true) {
					//全屏
					_self.pauseLeft = (_self.SystemInfo.screenHeight - _self.windowWidth) / 2;
					_self.pauseTop = (_self.SystemInfo.screenWidth - _self.pauseHeight) / 2;
				} else {
					_self.pauseLeft = (_self.SystemInfo.screenWidth - _self.windowWidth) / 2;
					_self.pauseTop = 42;
				}
			},
			timeupdate(e) {
				_self.currentTime = e.detail.currentTime;
				_self.ispause = 0;
				if (e.detail.currentTime > 0 && _self.isTryEnd != 1) {
					_self.showVideoErrorTips = false;
					_self.showNotGoldTips = true;
				}
				if (_self.currentVideoType == 2) {
					// _self.cancelText = '下载应用程序';
					// _self.confirmText = '立即下载';
					// _self.showMsgContent = '下载APP观看完整版视频';
					// _self.showNotGoldTips = true;
					// _self.confirmType = 'gotoLogin';
					// _self.cancelType = 'againTry';
					// console.log('fd')
					//return false;
				}
				if (_self.isTry == 1) {
					let feeLook = _self.info.feeLook + _self.adSkip
					if (_self.trySeconds != 0) {
						_self.trySeconds = feeLook - _self.formatSeconds(e.detail.currentTime);
					}
					if (e.detail.currentTime > feeLook && _self.isTryEnd != 1) {
						_self.isTryEnd = 1;
						_self.stop();
						//试看结束
						
						if (userid) {
							//已经登录
							_self.cancelText = '扣费观看';
							_self.confirmText = '立即下载';
							_self.showMsgContent = '下载APP观看完整版视频';
							_self.showNotGoldTips = true;
							_self.confirmType = 'gotoDownload';
							_self.cancelType = 'buyVideo';
							_self.loadings = 0;
						} else {
							//未登录
							_self.cancelText = '重新观看';
							_self.confirmText = '立即下载';
							// _self.showMsgContent = _self.info.watch > 0 ? '试看结束，注册账号可免费观看' + _self.info.watch + '部视频' :
							// 	'视频已试看结束，下载app观看完整视频';
							_self.showMsgContent = '下载APP观看完整版视频';
							_self.showNotGoldTips = true;
							_self.confirmType = 'gotoDownload';
							_self.cancelType = 'againTry';
							_self.loadings = 0;
						}
						// _self.downloadAlert = true;
						// this.$refs.popupDownloadAlert.open()
					} else {
						if(_self.isTryEnd != 1){
							_self.showNotGoldTips = false;
						}
					}
				} else {
					uni.setStorage({
						key: _self.palyTimeKey,
						data: _self.currentTime,
						success: () => {
							//console.log('success');
						}
					});
				}
				console.log(_self.showNotGoldTips)
			},
			showFire() {
				if (_self.fireTime > 0) {
					_self.showToast = true
					_self.texts = ['金币不足，请先充值', _self.fireTime + "秒后自动进入充值页面"]
					_self.fireTime--
					setTimeout(() => {
						_self.showFire()
					}, 1000)
				} else {
					_self.fireTime = 5
					_self.showToast = false
					_self.gotoRecharge()
				}
			},
			getUserId() {
				var isLogin = api.getLogins();
				return isLogin ? isLogin.userId : 0
			},
			formatSeconds(a) {
				var hh = parseInt(a / 3600);
				var ss = parseInt((a - hh * 3600));
				if (ss < 10) ss = "0" + ss;
				if (a >= 0) {
					return ss;
				} else {
					return "00";
				}
			},
			gotoLogin() {
				uni.setStorage({
					key: 'sourceUrl',
					data: '/pages/video/play',
					success: () => {
						api.jumpUrl('/pages/login/login?vid=' + videoId, 'new');
					},
					fail: () => {
						api.showToast('网络连接失败，请检查网络是否正常', 2000);
					}
				});
			},
			playVideo(vid) {
				uni.setStorage({
					key: 'vid',
					data: vid,
					success: () => {
						api.jumpUrl('/pages/video/play?type=' + JSON.stringify(_self.uri), 'new');
					}
				});
			},
			back() {
				if (_self.uri.url == '/pages/index/index') {
					_self.uri.url = '/pages/video/class'
				}
				if (_self.isTop) {
					api.jumpUrl('/pages/top/top', 'newx');
				} else {
					api.jumpUrl(_self.uri.url, _self.uri.t);
				}
			},
			//购买视频
			buyVideo(e) {
				uni.request({
					url: api.apiData.buyVideo,
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						videoId: videoId,
						userId: userid,
						did: _self.did,
					},
					success: (res) => {
						if (res.data.Code != 200) {
							_self.showNotGoldTips = false;
							api.showToast(res.data.Msg, 2000);
							if ('金币不足，请先充值' == res.data.Msg) {
								_self.showFire()
							}
						} else {
							_self.reloadPage = true;
							// if (e == 2) {
							// 	_self.buyPlayVideo();
							// 	api.showToast('购买成功', 1000);
							// } else {
							// 	_self.reload();
							// }
						}
					},
					fail: () => {
						api.showToast('网络连接失败，请检查网络是否正常', 2000);
					}
				});
			},
			buyPlayVideo() {
				_self.seconds = -1;
				_self.videourl = _self.info.videoInfo.url;
				_self.controls = true;
				_self.context.play();
			},
			//显示简介
			showIntroduction(e) {
				_self.togglePopup('bottom', 'introduction');
			},
			togglePopup(type, open) {
				this.type = type
				this.$nextTick(() => {
					this.$refs['show' + open].open()
				})
			},
			cancel(type) {
				this.$refs['show' + type].close()
			},
			onfail(e) {
				if (_self.currentVideoType == 2) {
					return false;
				} else {
					_self.showVideoErrorTips = true;
					//api.showToast('视频资源不存在', 5000);
				}
			},
			onloadedmetadata(e) {
				if (_self.currentVideoType == 2) {
					return false;
				}
			},
			change(e) {},
			tryPaly() {
				_self.showNotGoldTips = false;
				_self.currentVideoType = 1;
				_self.currentTime = 0;
				_self.initialtime = 0;
				_self.isTryEnd = 0;
				_self.isTry = 1;
				_self.play();
			},
			gotoRecharge() {
				api.jumpUrl('/pages/recharge/recharge?type=2&vid=' + videoId, 'new');
			},
			//切换画质
			changeline(e, t) {
				if (userid) {
					if (_self.seconds != 0) return api.showToast('广告禁止切换画质', 2000);
					_self._showLoading('正在切换...');
					if (_self.currentline == e) return api.showToast('当前已经是[' + t + ']', 2000);
					if (!_self.info.isVip) return api.showToast('只有vip才能切换画质', 2000);
					_self.videourl = _self.info.videoInfo.videoline[e].url;
					_self.currentline = e;
					_self.initialtime = _self.currentTime;
					_self.context.play();
					api.showToast('已切换至[' + t + ']', 2000);
				} else {
					uni.showModal({
						content: '登录后才能切换',
						confirmText: '登录',
						success: (res) => {
							if (res.confirm) {
								_self.gotoLogin();
							}
						}
					});
				}
			},
			// 视频弹出框确定按钮点击事件
			clickConfirm(e) {
				_self.clickCancelBt(e, 1);
			},
			gotoDownload() {
				api.jumpUrl(api.apiData.apiUrl+'/redirtype/appdownvideo2')
			},
			// 视频弹出框取消按钮点击事件
			clickCancelBt(e, t = 2) {
				var _event = (t == 1) ? _self.confirmType : _self.cancelType;
				switch (_event) {
					case 'buyVideo':
						_self.buyVideoTig(t);
						break;
					case 'tryPaly':
						_self.isTry = 1;
						_self.beforeAd();
						break;
					case 'againTry':
						_self.tryPaly();
						break;
					default:
						eval(e);
				}
				_self.showNotGoldTips = false;
			},
			buyVideoTig(e) {
				uni.showModal({
					title: '温馨提示',
					content: '需要扣除' + _self.info.videoInfo.gold + '金币才能观看《' + _self.info.videoInfo.title + '》',
					cancelText: '考虑一下',
					confirmText: '扣费观看',
					success: (res) => {
						if (res.confirm) {
							_self._showLoading('加载中...');
							_self.buyVideo(e);
							_self.showNotGoldTips = false;
						} else if (res.cancel) {
							_self.showNotGoldTips = true;
						}
					}
				});
			},
			jumpUrl(uri = 'login/login', type = 'new') {
				api.jumpUrl('/pages/' + uri, type);
			}
		}
	}
</script>
<style>
	.watch-free {
		display: none;
		width: 92%;
		height: 90upx;
		line-height: 90upx;
		background-size: 100% 100%;
		border-radius: 10upx;
		color: #FFFFFF;
		font-size: 30upx;
		padding-left: 20upx;
		margin: 0 auto;
	}

	.comment-send {
		height: 60upx;
		line-height: 60upx;
		width: 130upx;
		color: #FFFFFF;
		margin-right: 30upx;
		border-radius: 60upx;
		text-align: center;
		font-size: 27upx;
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
	}

	.ad-list {
		width: 100%;
		text-align: center;
	}

	.ad-img {
		width: 95%;
		height: 100upx;
		border-radius: 5px;
		margin-top: 5upx;
	}

	.head-placeholder {
		height: 50wx;
		padding-top: 10upx;
		background-color: #000;
	}

	.introduction-box {
		width: 750upx;
		background-color: #FFFFFF;
		padding-top: 15upx;
	}

	.introduction-head {
		flex-direction: row;
		position: relative;
		padding: 30upx;
		background-color: #F5F5F5;
		border-bottom: 1px solid #F5F5F5;
		margin-top: -7px;
	}

	.introduction-title {
		font-size: 35upx;
	}

	.introduction-close {
		width: 48upx;
		height: 48upx;
		position: absolute;
		right: 15upx;
		transform: rotate(90deg);
		transform-origin: 24upx 24upx;
	}

	.introduction-text {
		font-size: 28upx;
		padding-left: 25upx;
		padding-right: 25upx;
		padding-top: 20upx;
		line-height: 42upx;
		lines: 0;
	}

	//公用样式
	.flex-row {
		float: left;
	}

	.flex-row-reverse {
		flex-direction: row-reverse;
	}

	.relative {
		position: relative;
	}

	.flex-row-rtl {
		float: right;
	}

	.title {
		width: 350upx;
		font-size: 28upx;
		padding: 0 20upx;
		color: #FFFFFF;
		border-left: 6px solid #FF8F00;
		margin-bottom: 30upx;
	}

	.title-icon {
		width: 38upx;
		height: 38upx;
		margin: 20upx 0upx 20upx 0;
	}

	//公用样式结束

	.top-box {
		position: fixed;
		top: 0;
		z-index: 9;
	}

	//视频样式
	.video {
		width: 750upx;
		height: 220px;
		background-color: #000;
	}

	.back {
		position: absolute;
		left: 18wx;
		top: 5wx;
	}

	.before-video-ad {
		width: 750upx;
		height: 220px;
	}

	.before-ad {
		position: absolute;
		left: 0px;
		top: 0px;
		width: 750upx;
		height: 220px;
		z-index: 999;
	}

	.pause-ad {
		position: absolute;
	}

	.ad-time {
		position: absolute;
		right: 10px;
		color: #FFFFFF;
		background-color: #333333;
		border-radius: 8px;
		font-size: 12px;
		top: 10px;
		padding: 10px;
		text-align: center;
		z-index: 999;
	}

	.controls-play {
		left: 50wx;
	}

	.controls-pause {
		right: 50wx;
	}

	.controls-title {
		width: 100%;
		text-align: center;
		color: #FFFFFF;
	}

	//视频样式结束

	//多线路 开始
	.video-line-box {
		display: flex;
		margin-top: -10px;
		width: 750upx;
		height: 50px;
		font-size: 18px;
		background-color: #fff;
		box-shadow: 0px 4px 6px 0px rgba(103, 103, 103, 0.2);
	}

	.video-line-exchange-icon {
		margin-top: 10px;
		width: 68upx;
		height: 68upx;
	}

	.video-line {
		line-height: 50px;
		text-align: center;
		flex: 1;
		font-size: 18px;
	}

	//多线路 结束
	.video-content {
		background-color: #1D1D28;
	}

	.video-info-box {
		overflow: hidden;
		width: 750upx;
		padding: 15px;
		padding-bottom: 0;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		/* Firefox */
		-webkit-box-sizing: border-box;
		/* Safari */
		background-color: #1D1D28;
	}

	.video-title {
		width: 100%;
		font-size: 13px;
		margin-bottom: 5px;
		color: #FFFFFF;
	}

	.video-click-num {
		font-size: 14px;
		color: #cccccc;
	}

	.video-gold {
		padding-right: 10px;
	}

	.video-gold-image {
		width: 16px;
		height: 16px;
		float: left;
		margin-top: 1px;
	}

	.video-gold-num {
		height: 18px;
		font-size: 14px;
		color: #cccccc;
	}

	.show-introduction {
		position: absolute;
		right: -8px;
		height: 30px;
		top: 6px;
		align-items: center;
	}

	.show-introduction-text {
		margin-top: 2px;
		font-size: 16px;
		color: #cccccc;
	}

	.video-operation {
		margin-top: 5px;
	}

	.video-operation-image {
		margin: 10px;
		width: 22px;
		height: 22px;
		float: left;
	}


	// 猜你喜欢样式开始
	.guess-video-list {
		flex-wrap: wrap;
		width: 100%;
		padding-bottom: 20upx;
		background: #1D1D28;
		margin-top: 20upx;
	}

	.space-between {
		justify-content: space-between;
	}

	.flex-start {
		justify-content: flex-start;
	}

	.guess-video-info {
		float: left;
		width: 345upx;
		background-color: #FFFFFF;
		margin: 0 0 25upx 0;
		border-radius: 8px;
		font-size: 28upx;
		height: 290upx;
		/*
		box-shadow: 0px 4px 6px 0px rgba(103, 103, 103, 0.2);
		*/
		border-bottom: 1px #E2E2E2 solid;
		position: relative;
		padding-bottom: 38upx;
	}

	.guess-video-img {
		width: 100%;
		height: 200upx;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
		background-color: #e2e2e2;
	}

	.guess-video-playTime {
		font-size: 18upx;
		background-image: linear-gradient(to right, rgba(0, 0, 0, 0.6), #ff6f33);
		color: #FFFFFF;
		padding: 0 10upx;
		height: 30upx;
		line-height: 30upx;
		border-radius: 5upx;
		position: absolute;
		right: 18upx;
		top: 165upx;
		z-index: 9;
	}

	.guess-video-title {
		width: 330upx;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 10upx;
		lines: 1;
		font-size: 25upx;
	}

	.guess-video-gold {
		width: 120upx;
		padding: 0 10upx;
		height: 30upx;
		line-height: 30upx;
		color: #ff9030;
	}

	.guess-video-gold-img {
		width: 26upx;
		height: 26upx;
		margin-right: 5upx;
	}

	.guess-video-gold-num {
		font-size: 26upx;
		color: #ff9030;
	}

	.guess-video-date {
		margin-right: 15upx;
		font-size: 22upx;
	}

	// 猜你喜欢样式结束

	// 评论
	.uni-comment-list-box {
		overflow: hidden;
		width: 94%;
		font-size: 28upx;
		margin-bottom: 80upx;
		background-color: #1D1D28;
		padding: 0 3% 80upx;
	}

	.uni-comment {
		width: 720upx;
	}

	.uni-comment-list {
		flex-wrap: nowrap;
		padding: 35upx 0 10upx;
		width: 94%;
		//border-bottom: 1px #F8F8F8 solid;
	}

	.uni-comment-face {
		width: 70upx;
		height: 70upx;
		border-radius: 70upx;
		margin-right: 20upx;
		overflow: hidden;
	}

	.uni-comment-face-img {
		height: 70upx;
		width: 70upx;
		border-radius: 70upx;
		border-bottom: 1px #E2E2E2 solid;
	}

	.uni-comment-body {
		width: 580upx;
	}

	.uni-comment-top {
		line-height: 1.5em;
		justify-content: space-between;
	}

	.uni-comment-username {
		color: #0A98D5;
		font-size: 24upx;
	}

	.uni-comment-date {
		line-height: 38upx;
		flex-direction: row;
		justify-content: space-between;
	}

	.uni-comment-addtime {
		color: #666666;
		font-size: 24upx;
		line-height: 38upx;
	}

	.uni-comment-content {
		line-height: 42upx;
		font-size: 28upx;
		padding: 8rpx 0 20upx;
		color: #FFFFFF;
		border-bottom: 1px solid rgba(255, 255, 255, 0.03);
	}

	.uni-not-comment {
		padding: 100upx 0;
		width: 720upx;
		justify-content: center;
		align-items: center;
		//border-bottom: 1px #E2E2E2 solid;
		//border-top: 1px #E2E2E2 solid;
		text-align: center;
	}

	.not-comment-img {
		margin: 20upx auto;
		width: 210upx;
		height: 130upx;
	}

	.not-comment-text {
		font-size: 14px;
		color: #FFFFFF;
		text-align: center;
	}

	// 评论 结束
	//添加评论
	.add-comment-box {
		width: 100%;
		height: 48wx;
		border-top: 1px #333333 solid;
		background-color: #20202C;
		padding: 5px;
		position: fixed;
		bottom: 0;
		align-items: center;
		display: flex;
		z-index: 9;
	}

	.f-add-comment-box {
		width: 100%;
		height: 48wx;
		border-top: 1px #E2E2E2 solid;
		background-color: #fff;
		padding: 10wx;
		align-items: center;
		display: flex;
		align-content: flex-start;
	}

	.comment-img {
		width: 34wx;
		height: 34wx;
	}

	.comment-input {
		font-size: 12px;
		height: 36px;
		flex: 1;
		padding: 0 30upx;
		overflow: hidden;
		border: 1px solid #333333;
		border-radius: 50upx;
		margin: 0 20upx;
		color: #FFFFFF;
	}

	.comment-paperplane {
		padding-right: 5px;
	}

	.comment-submit {
		width: 22wx;
		height: 22wx;
	}

	.content-head {
		position: fixed;
		width: 30px;
		height: 30px;
		line-height: 30px;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.3);
		top: 15px;
		left: 15px;
		text-align: center;
		font-size: 15px;
		color: #fff;
		z-index: 9;
		font-weight: bold;
	}

	.backimage {
		margin-top: 5px;
		margin-left: 5px;
		width: 18px;
		height: 18px;
	}

	.current-line {
		color: #fff;
		border: 1px #e241d5 solid;
		border-radius: 20upx;
		padding: 6upx 68upx;
		line-height: 30px;
		background-color: #e241d5;
	}

	.no-current-line {
		color: #808080;
		border: 1px #808080 solid;
		border-radius: 20upx;
		padding: 6upx 68upx;
		line-height: 30px;
	}

	.box {
		color: #fff;
		width: 100px;
		height: 100px;
		line-height: 100px;
		text-align: center;
		background-color: #4CD964;
	}

	.video-tips-box {
		position: fixed;
		width: 750upx;
		left: 0;
		right: 0;
		top: 120px;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}

	.video-gold-tips-box {
		top: 80px;
		text-align: center;
	}

	.video-gold-tips-box-mask {
		position: fixed;
		top: 0;
		width: 750upx;
		height: 220px;
		background-color: #000;
		z-index: 9;
	}

	.tips-bt-box {
		width: 100%;
		margin: 0 auto;
		display: flex;
		justify-content: center;
	}
	.tips-bt {
		width: 45%;
		margin-top: 32px;
		height: 38px;
		border-radius: 50px;
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		color: #FFFFFF;
		font-size: 14px;
		line-height: 38px;
		text-align: center;
	}

	.show-toast {
		background-color: rgba(0, 0, 0, .75);
		position: fixed;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.show-toast-box {
		background-color: rgba(0, 0, 0, .75);
		padding: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		border-radius: 10px;
	}

	.show-toast-box-text {
		color: white;
		text-align: center;
	}

	.action-buttons {
		display: inline-block;
		height: 80upx;
	}
	.action-buttons > view{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: -10upx;
	}
	.action-buttons > view > text{
		margin-top: -16upx;
		width: 100%;
		text-align: center;
	}
</style>
