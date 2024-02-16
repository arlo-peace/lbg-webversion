<template>
	<view class="conbox">
		<view class="container">
			<!-- 背景 -->
			<image :src="awardsConfig.bg" class="cont" mode="aspectFill"></image>
			<image src="/static/img/caidai.png" class="caidai" mode=""></image>
			<view class="header" :style="{ padding: top + 'px 0 40upx 0' }">
				<view class="header-title">
					<view class="left">
						<!-- 次数： <text style="color:#E4431A;">{{chishu}}</text> -->
					</view>
					<view class="right" v-if="mold==1">
						抽奖次数： <text style="color:#E4431A;margin-right:3px;">{{chishu}}</text>次
					</view>
					<view class="right" v-else>
						账户金币： <text style="color:#E4431A;margin-right:3px;">{{awardsConfig.gold}}</text>个
					</view>
				</view>
			</view>
			<view class="main">
				<view class="canvas-container">
					<view :animation="animationData" class="canvas-content" id="zhuanpano" :style="zhuanpano">
						<view class="canvas-line">
							<view class="canvas-litem" v-for="(item,index1) in awardsList" :key="index1"
								:style="[{transform:'rotate('+item.lineTurn+')'}]"></view>
						</view>
						<view class="canvas-list">
							<view class="canvas-item" :style="[{zIndex:index2}]" v-for="(iteml,index2) in awardsList"
								:key="index2">
								<view class="canvas-item-text" :style="[{transform:'rotate('+iteml.turn+')'}]">
									<text>{{iteml.award}}</text>
									<image class="canvas-item-text-img" :src="iteml.ico"></image>
									<text style="font-size:12px;margin-top:5px;"
										v-if="iteml.amount>0">+{{iteml.amount}}</text>
								</view>
							</view>
						</view>
					</view>

					<view @tap="playReward" class="canvas-btn" v-bind:class="btnDisabled">开始</view>
				</view>
			</view>
			<!-- 我的奖品 -->
			<view class="myLuck" @click="getmyPrize">
				查看我的奖品列表
			</view>
			<!-- 切换抽奖方式 -->
			<view class="typecheckbox">
				<view :class="mold==i?'left active':'left'" @click="choosetype(i)"
					v-for="(t, i) in awardsConfig.luckMold" :key="i">
					{{t}}
				</view>
			</view>
			<!-- 规则 -->
			<view class="guize">
				<view class="title">
					规则说明
				</view>
				<view class="g_item">
					1.抽奖方式分两种：免费抽奖和金币抽奖；
				</view>
				<view class="g_item">
					2.免费：完成指定任务可获得免费抽奖次数；
				</view>
				<view class="g_item">
					3.金币：消耗{{awardsConfig.payGold}}个金币数可抽奖一次；
				</view>
				<view class="g_item">
					4.用户中奖奖品，可在我的奖品列表里查看，实物奖品请联系平台客服。
				</view>
			</view>
			<!-- 显示我的奖品 -->
			<view class="shadowbox" v-if="r_flg" @click="closeshadow">
				<view class="myrewards" @click.stop="openshadow">
					<view class="title" style="margin-bottom:10px;">我的奖品</view>
					<view class="itembox">
						<view class="item" v-for="(items,i) in myPrizelist" :key="i">
							<view class="left">
								<image :src="items.img"
									style="width:14px;height:14px;float:left;margin-right:10px;margin-top:-1px;">
								</image>
								<text>{{items.name}}</text>
							</view>
							<text class="right">{{utils.timeTodate('Y/m/d H:i',items.createtime)}}</text>
						</view>
						<view class="item" v-if="!isMyPrizelist">
							<view style="color:#DD524D;margin:auto;">你还没有奖品，快去试试手气吧</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 中奖提示 -->
			<view class="winning" v-if="isWinning" @click="isWinningFun">
				<!-- <fireworks /> -->
				<view class="winning-content">
					<image src="/static/img/winning.png" style="height:100%;"></image>
					<view class="winning-title">
						<view style="font-size:33upx;width:100%;text-align:center;line-height:30px;">{{winningTitle}}
						</view>
						<text>{{winningContent}}</text>
					</view>
				</view>
			</view>
		</view>
		<css-loading ref="cssLoading"></css-loading>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	import utils from '@/components/shoyu-date/utils.filter.js';
	import fireworks from '@/components/sanshui-fireworks/index.vue'
	var _self;
	export default {
		components: {
			fireworks
		},
		data() {
			return {
				awardsConfig: {
					chance: true, //是否有抽奖机会
					lists: [], //奖品列表 
					luckMold: [] //抽奖方式
				},
				awardsList: {},
				animationData: {},
				btnDisabled: '',
				thanksarr: [], //存储谢谢参与的索引
				chishu: 0,
				mold: 1,
				r_flg: 0,
				myPrizelist: [],
				userId: 0,
				zhuanpano: '',
				utils: utils,
				top: 30,
				isWinning: false,
				winningTitle: '中奖啦',
				winningContent: '正在加载中...',
				gameId: 0,
				isMyPrizelist: false,
			}
		},
		onLoad(e) {
			this._showLoading('加载中...');
			var mobile = uni.getSystemInfoSync();
			this.top = mobile.safeArea.top + 10;
			this.gameId = e.gid;
			//console.log(e.gid)
			// 是否登录
			const info = api.getLogins();
			if (info === false) {
				this.skipUrl();
			} else {
				this.userId = info.userId;
				// 获取奖品列表
				this.initdata(this);
				//console.log(this.userId)
			}
		},
		methods: {
			// 中奖提示
			isWinningFun() {
				this.isWinning = !this.isWinning;
			},
			// 查看奖品
			getmyPrize() {
				this._showLoading('加载中...');
				uni.stopPullDownRefresh();
				var that = this
				uni.request({
					url: api.apiData.getPrize + '/gameId/' + that.gameId + '/userId/' + that.userId +
						'/type/3/page/1/num/500',
					method: 'GET',
					success: (e) => {
						that._hideLoading();
						if (e.data.Code == 201) {
							that.msgData(e.data.Msg, 3000);
							return false;
						}
						var data = e.data.Data;
						//console.log(data)
						/* data.lists.forEach(function(element,index){
							element.createtime = element.createtime;
						}) */
						that.myPrizelist = data.lists;
						if (that.myPrizelist.length > 0) that.isMyPrizelist = true;
						that.r_flg = 1;
					},
					fail: () => {
						that._hideLoading();
						// 加载失败提示
						that.msgData('服务器连接失败，请检查网络是否正常', 3000);
					}
				});
			},
			openshadow() {
				this.r_flg = 1
			},
			closeshadow() {
				this.r_flg = 0
			},
			// 选择抽奖方式
			choosetype(val) {
				this._showLoading('切换中...');
				this.mold = val;
				this.initdata(this);
			},
			// 初始化抽奖数据
			initdata(that) {
				uni.request({
					url: api.apiData.getPrize + '/gameId/' + that.gameId + '/userId/' + that.userId +
						'/type/1/mold/' + that.mold,
					method: 'GET',
					success: (e) => {
						that._hideLoading();
						if (e.data.Code == 201) {
							that.msgData(e.data.Msg, 3000);
							return false;
						}
						var data = e.data.Data;
						//console.log(that.userId)
						that.awardsConfig = data
						that.chishu = data.luckdraw;
						// 设置背景图片
						api.imgCache(that.awardsConfig.bg, (img) => {
							that.awardsConfig.bg = img;
						});
						// 获取奖品的个数
						let awarrlength = that.awardsConfig.lists.length
						// push 谢谢参与奖项
						/* for (var i = 0; i <= 3 * 2; i++) {
							if (i % 3 == 0) {
								that.thanksarr.push(i)
								that.awardsConfig.lists.splice(i, 0, {
									name: '谢谢参与',
									type: 0
								});
							}
						} */
						// 为每一项追加index属性
						that.awardsConfig.lists.forEach(function(element, index) {
							element.index = index
						})
						// 画转盘
						that.drawAwardRoundel();
					},
					fail: () => {
						// 加载失败提示
						that.msgData('服务器连接失败，请检查网络是否正常', 3000);
					}
				});
			},
			// 画抽奖圆盘  
			drawAwardRoundel() {
				// 拿到奖品列表
				var awards = this.awardsConfig.lists;
				var awardsList = [];
				// 每份奖品所占角度
				var turnNum = 1 / awards.length * 360; // 文字旋转 turn 值  
				// 奖项列表  
				for (var i = 0; i < awards.length; i++) {
					awardsList.push({
						turn: i * turnNum + 'deg', //每个奖品块旋转的角度
						lineTurn: i * turnNum + turnNum / 2 + 'deg', //奖品分割线的旋转角度
						award: awards[i].name, //奖品的名字,
						type: awards[i].type,
						id: awards[i].id,
						ico: awards[i].img,
						amount: awards[i].amount, // 奖励数值
					});
				}
				if (this.mold == 1) {
					this.btnDisabled = this.chishu ? '' : 'disabled';
				} else {
					this.btnDisabled = this.awardsConfig.gold < this.awardsConfig.payGold ? 'disabled' : '';
				}
				this.awardsList = awardsList;
			},
			// 发起抽奖  
			playReward() {
				this._showLoading('正在抽奖...');
				var that = this
				// that.runDeg = 60*Math.random()
				if (that.mold == 1) {
					// 免费抽奖
					if (that.chishu < 1) {
						that.msgData('抽奖次数已经用完', 3000);
						that.btnDisabled = 'disabled';
						return
					}
				} else {
					// 金币抽奖
					if (that.awardsConfig.gold < that.awardsConfig.payGold) {
						that.msgData('账户金币不足，请充值', 3000);
						that.btnDisabled = 'disabled';
						return
					}
				}
				that.btnDisabled = 'disabled';
				// 获取奖品
				uni.request({
					url: api.apiData.getPrize + '/gameId/' + that.gameId + '/userId/' + that.userId +
						'/type/2/mold/' + that.mold,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						that._hideLoading();
						var data = e.data.Data;
						//console.log(that.userId)
						if (e.data.Code == 201) {
							that.msgData(e.data.Msg, 3000);
							that.btnDisabled = '';
							return false;
						}
						//console.log(data)
						var awardIndex = 3
						that.awardsList.forEach(function(element, index) {
							if (element.id == data.id) {
								awardIndex = index
							}
						})
						//中奖index  
						var awardsNum = that.awardsConfig.lists;
						// var awardIndex = 1 || Math.round(Math.random() * (awardsNum.length - 1)); //随机数  
						var runNum = 8; //旋转8周  
						var duration = 4000; //时长  
						// 旋转角度  
						that.runDeg = that.runDeg || 0;
						let preDeg = that.runDeg
						that.runDeg = that.runDeg + (360 - that.runDeg % 360) + (360 * runNum - awardIndex * (
							360 / awardsNum.length)) + 1
						//创建动画  
						var animationRun = uni.createAnimation({
							duration: duration,
							timingFunction: 'ease'
						})
						animationRun.rotate(that.runDeg).step();
						that.animationData = animationRun.export();
						that.btnDisabled = 'disabled';
						// 中奖提示  
						var awardsConfig = that.awardsConfig;
						//var awardType = awardsConfig.lists[awardIndex].type;
						if (that.mold == 1) {
							that.chishu = that.chishu - 1;
						} else {
							that.awardsConfig.gold = that.awardsConfig.gold - that.awardsConfig.payGold;
						}
						setTimeout(function() {
							/* uni.showModal({
								title: '中奖啦',
								content: '获得' + (awardsConfig.lists[awardIndex].name),
								showCancel: false,
								success: function(){
									// 置空style  否则动画不生效
									setTimeout(function(){
										that.zhuanpano = '';
									},1000)
								}
							}); */
							// 弹出中奖提示
							that.winningTitle = data.title;
							that.winningContent = data.content;
							that.isWinningFun();
							// 置空style  否则动画不生效
							setTimeout(function() {
								that.zhuanpano = '';
							}, 1000)
							// 恢复抽奖按钮
							that.btnDisabled = '';
						}.bind(that), duration);
					},
					fail: () => {
						// 加载失败提示
						_self.msgData('服务器连接失败，请检查网络是否正常', 3000);
					}
				});
			},
			// 提示
			msgData(title = '', times = 1000, style = 'none') {
				this._hideLoading()
				setTimeout(() => {
					uni.showToast({
						icon: style,
						title: title,
						mask: true,
						duration: times
					});
				}, 200)
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
		}
	}
</script>
<style scoped>
	.winning {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 999;
	}

	.winning-content {
		width: 100%;
		height: 580upx;
		top: 45%;
		position: absolute;
		margin-top: -275upx;
		text-align: center;
		color: #b01a1c;
		font-weight: bold;
	}

	.winning-title {
		position: absolute;
		top: 110upx;
		left: 50%;
		width: 180upx;
		font-size: 25upx;
		margin-left: -85upx;
		text-align: left;
		line-height: 40upx;
	}

	.myLuck {
		position: relative;
		left: 20upx;
		top: -10upx;
		padding: 8upx 10px;
		border: 1px solid #ffcb3f;
		color: #ffcb3f;
		font-size: 13px;
		font-weight: bold;
		border-radius: 26upx;
		width: 60px;
		text-align: center;
		z-index: 9;
		line-height: 40upx;
	}

	.conbox {
		width: 750upx;
		height: 100vh;
		overflow-x: hidden;
		overflow-y: scroll;
	}

	.container,
	image.cont {
		width: 750upx;
		min-height: 100vh;
		height: auto;
		position: relative;
	}

	image.cont {
		height: 100%;
		position: absolute;
		z-index: 0;
	}

	image.caidai {
		position: absolute;
		top: 0;
		left: 0;
		width: 750upx;
		height: 1024upx;
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* height: 246upx; */
		//padding-top: 48upx;
		padding-bottom: 40upx;
		box-sizing: border-box;
		position: relative;
		z-index: 3;
	}

	.header-title {
		width: 100%;
		height: 60upx;
		display: flex;
		align-items: center;
		padding: 0 16upx;
		box-sizing: border-box;
		justify-content: space-between;
	}

	.header-title .right {
		padding: 2upx 20upx;
		height: 50upx;
		line-height: 50upx;
		border: 1px solid #d89720;
		color: #d89720;
		font-size: 28upx;
		border-radius: 26upx;
	}

	/* 转盘 */
	.canvas-container {
		margin: 0 auto;
		position: relative;
		width: 600upx;
		height: 600upx;
		background: url(../../static/img/circle.png) no-repeat;
		background-size: cover;
		border-radius: 50%;
	}

	.canvas {
		width: 100%;
		height: 100%;
		display: block !important;
		border-radius: 50%;
	}

	.canvas-content {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
		display: block;
		width: 600upx;
		height: 600upx;
		border-radius: inherit;
		/* background-clip: padding-box; */
		/* background-color: #ffcb3f; */
	}

	.canvas-element {
		position: relative;
		z-index: 1;
		width: inherit;
		height: inherit;
		border-radius: 50%;
	}

	.canvas-list {
		position: absolute;
		left: 0;
		top: 0;
		width: inherit;
		height: inherit;
		z-index: 9999;
	}

	.canvas-item {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		color: #e4370e;
		/* text-shadow: 0 1upx 1upx rgba(255, 255, 255, 0.6); */
	}

	.canvas-item-text {
		position: relative;
		display: block;
		padding-top: 46upx;
		margin: 0 auto;
		text-align: center;
		-webkit-transform-origin: 50% 300upx;
		transform-origin: 50% 300upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #FB778B;
	}

	.canvas-item-text text {
		font-size: 30upx;
	}

	.canvas-item-text-img {
		width: 50upx;
		height: 50upx;
		padding-top: 30upx;
	}

	/* 分隔线 */
	.canvas-line {
		position: absolute;
		left: 0;
		top: 0;
		width: inherit;
		height: inherit;
		z-index: 99;
	}

	.canvas-litem {
		position: absolute;
		left: 300upx;
		top: 0;
		width: 3upx;
		height: 300upx;
		background-color: rgba(228, 55, 14, 0.4);
		overflow: hidden;
		-webkit-transform-origin: 50% 300upx;
		transform-origin: 50% 300upx;
	}

	/**  
* 抽奖按钮  
*/
	.canvas-btn {
		position: absolute;
		left: 260upx;
		top: 260upx;
		z-index: 400;
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		color: #f4e9cc;
		background-color: #e44025;
		line-height: 80upx;
		text-align: center;
		font-size: 26upx;
		text-shadow: 0 -1px 1px rgba(0, 0, 0, 0.6);
		box-shadow: 0 3px 5px rgba(0, 0, 0, 0.6);
		text-decoration: none;
	}

	.canvas-btn::after {
		position: absolute;
		display: block;
		content: ' ';
		left: 12upx;
		top: -44upx;
		width: 0;
		height: 0;
		overflow: hidden;
		border-width: 30upx;
		border-style: solid;
		border-color: transparent;
		border-bottom-color: #e44025;
	}

	.canvas-btn.disabled {
		pointer-events: none;
		background: #b07a7b;
		color: #ccc;
	}

	.canvas-btn.disabled::after {
		border-bottom-color: #b07a7b;
	}

	.canvas-btn-table {
		color: #A83FDB;
		width: 120upx;
		text-align: center;
		position: absolute;
		left: 240upx;
		top: 360upx;
		font-size: 26upx;
		background-color: #FFFFFF;
		opacity: 0.9;
	}

	.typecheckbox {
		width: 100%;
		position: relative;
		z-index: 3;
		display: flex;
		justify-content: space-between;
		padding: 20upx;
		box-sizing: border-box;
		color: #fff;
		font-size: 28upx;
		top: -170upx;
		flex-direction: column;
		height: 180upx;
		//background: #007AFF;
		align-items: flex-end;
		/* padding-top: 46upx; */
	}

	.typecheckbox view {
		border: 1px solid #ffcb3f;
		background: transparent;
		color: #ffcb3f;
		display: flex;
		height: 60upx;
		width: 140upx;
		border-radius: 50upx;
		align-items: center;
		justify-content: center;
		display: flex;
		margin-left: 20upx;
	}

	.typecheckbox view.active {
		background: #FF3637;
		color: #fff;
		border: 1px solid rgba(255, 255, 255, 0.8);
	}

	.guize {
		width: 502upx;
		//min-height: 300upx;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 3;
		background-image: linear-gradient(-180deg, #F48549 0%, #F2642E 100%);
		border: 18upx solid #E4431A;
		border-radius: 16px;
		margin: -144upx auto;
		padding: 48upx;
		/* box-sizing: border-box; */
		color: #fff;
	}

	.guize .title {
		text-align: center;
		margin-bottom: 28upx;
	}

	.guize .g_item {
		font-family: PingFang-SC-Medium;
		font-size: 24upx;
		color: #FFFFFF;
		letter-spacing: 0.5px;
		text-align: justify;
		line-height: 20px;
	}

	.shadowbox {
		width: 750upx;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		background: rgba(0, 0, 0, .6);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.myrewards {
		width: 600upx;
		min-height: 80upx;
		background: #FFEEDF;
		border: 10upx solid #F2692F;
		color: #333;
		font-size: 24upx;
		font-family: PingFang-SC-Medium;
		border-radius: 40upx;
		padding-bottom: 20upx;
	}

	.myrewards .title {
		font-family: PingFang-SC-Bold;
		font-size: 16px;
		color: #E4431A;
		letter-spacing: 0.57px;
		display: flex;
		padding-top: 36upx;
		justify-content: center;
	}

	.myrewards .itembox {
		max-height: 320upx;
		overflow-y: auto;
	}

	.myrewards .item {
		width: 100%;
		height: 50upx;
		padding: 0 32upx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>