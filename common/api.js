// 接口域名
const apiUrl = "https://b592952ry9852ryhg.xyz";
// 接口文件
const interfaceFile = "appapi";
// 与接口通讯的KEY
const appkey = 'abc123456';
// 选择线路
const getWebDomain = function() {
	const nowDomain = uni.getStorageSync('nowDomain_' + appkey);
	if (nowDomain) {
		return nowDomain;
	} else {
		return apiUrl;
	}
}
var nowUrl = getWebDomain();
// 完整接口(域名+接口文件+接口方法)
const apiData = {
	// 初始化接口
	"apiUrl": nowUrl + "/" + interfaceFile + "/redirectTo/appkey/" + appkey,
	"appInits": nowUrl + "/" + interfaceFile + "/appInit/appkey/" + appkey,
	//获取打赏列表
	"getDashangList": nowUrl + "/" + interfaceFile + "/getDashangList/appkey/" + appkey,
	// 广场首页数据
	"getGtypeList": nowUrl + "/" + interfaceFile + "/getGtypeList/appkey/" + appkey,
	// 变更城市
	"updateCity": nowUrl + "/" + interfaceFile + "/updateCity/appkey/" + appkey,
	//关注
	"goToGuanzhu": nowUrl + "/" + interfaceFile + "/goToGuanzhu/appkey/" + appkey,
	// 获取APP版本信息
	"getVersion": nowUrl + "/" + interfaceFile + "/getVersion/appkey/" + appkey,
	// DG接口相关
	"getDgGameSet": nowUrl + "/" + interfaceFile + "/getDgGameSet/appkey/" + appkey,
	// 首页数据
	"homeData": nowUrl + "/" + interfaceFile + "/homeMain/appkey/" + appkey,
	// 视频列表
	"videoData": nowUrl + "/" + interfaceFile + "/videoList/appkey/" + appkey,
	// 专题详情
	"getAlbum": nowUrl + "/" + interfaceFile + "/albumInfo/appkey/" + appkey,
	// 视频详情
	"videoInfo": nowUrl + "/" + interfaceFile + "/detail/appkey/" + appkey,
	// 评论列表
	"commentList": nowUrl + "/" + interfaceFile + "/commentList/appkey/" + appkey,
	// 添加集合
	"addCollection": nowUrl + "/" + interfaceFile + "/addCollection/appkey/" + appkey,
	// 添加集合
	"videoLike": nowUrl + "/" + interfaceFile + "/like/appkey/" + appkey,
	// 添加集合
	"addComment": nowUrl + "/" + interfaceFile + "/comment/appkey/" + appkey,
	// 充值到游戏余额
	"rechargeDgGame": nowUrl + "/" + interfaceFile + "/rechargeDgGame/appkey/" + appkey,
	// 余额提现
	"getMoney": nowUrl + "/" + interfaceFile + "/getMoney/appkey/" + appkey,
	// 金币余额互转
	"transferMoney": nowUrl + "/" + interfaceFile + "/transferMoney/appkey/" + appkey,
	// 获取银行卡列表
	"getBank": nowUrl + "/" + interfaceFile + "/bankLists/appkey/" + appkey,
	// 获取银行卡列表
	"getDigit": nowUrl + "/" + interfaceFile + "/digitLists/appkey/" + appkey,
	// 获取用户银行卡列表
	"getUserBank": nowUrl + "/" + interfaceFile + "/userBankList/appkey/" + appkey,
	// 设置提现银行卡
	"setBank": nowUrl + "/" + interfaceFile + "/setDefaultBank/appkey/" + appkey,
	// 删除提现银行卡
	"delBank": nowUrl + "/" + interfaceFile + "/delBank/appkey/" + appkey,
	// 添加提现银行卡
	"addBank": nowUrl + "/" + interfaceFile + "/addBank/appkey/" + appkey,
	// 添加提现银行卡
	"addDigit": nowUrl + "/" + interfaceFile + "/addDigit/appkey/" + appkey,
	// 我的消息
	"getMessage": nowUrl + "/" + interfaceFile + "/message/appkey/" + appkey,
	// 检查系统新消息
	"checkNewMessage": nowUrl + "/" + interfaceFile + "/checkNewMessage/appkey/" + appkey,
	// 小说首页
	"getBook": nowUrl + "/" + interfaceFile + "/book/appkey/" + appkey,
	// 音频小说
	"getBookAudio": nowUrl + "/" + interfaceFile + "/bookAudio/appkey/" + appkey,
	// 图文小说
	"getBookAlbum": nowUrl + "/" + interfaceFile + "/bookAlbum/appkey/" + appkey,
	// 音频小说详情
	"getBookAudioDetail": nowUrl + "/" + interfaceFile + "/bookAudioDetail/appkey/" + appkey,
	// 图文小说详情
	"getBookAlbumDetail": nowUrl + "/" + interfaceFile + "/bookAlbumDetail/appkey/" + appkey,
	// 提现记录
	"getDeposit": nowUrl + "/" + interfaceFile + "/depositLog/appkey/" + appkey,
	// 账户明细
	"getDetailed": nowUrl + "/" + interfaceFile + "/detailedList/appkey/" + appkey,
	// 修改昵称,手机号,头像
	"editInfo": nowUrl + "/" + interfaceFile + "/editInfo/appkey/" + appkey,
	// 上传接口
	"upload": nowUrl + "/" + interfaceFile + "/upload/appkey/" + appkey,
	// 收藏列表
	"getColl": nowUrl + "/" + interfaceFile + "/collectionList/appkey/" + appkey,
	// 删除收藏视频
	"delColl": nowUrl + "/" + interfaceFile + "/deleteCollection/appkey/" + appkey,
	// 我的足迹
	"getWatchLog": nowUrl + "/" + interfaceFile + "/getWatchLog/appkey/" + appkey,
	// 短视频购买记录
	"getSvodBuyLog": nowUrl + "/" + interfaceFile + "/getSvodBuyLog/appkey/" + appkey,
	// 删除我的足迹
	"delWatchLog": nowUrl + "/" + interfaceFile + "/delWatchLog/appkey/" + appkey,
	// 我的分享
	"myShare": nowUrl + "/" + interfaceFile + "/myShare/appkey/" + appkey,
	// 分享记录
	"getShareLog": nowUrl + "/" + interfaceFile + "/shareLog/appkey/" + appkey,
	// 修改密码
	"changePwd": nowUrl + "/" + interfaceFile + "/changePwd/appkey/" + appkey,
	// 充值套餐
	"getCharge": nowUrl + "/" + interfaceFile + "/getChargeData/appkey/" + appkey,
	// 支付方式
	"getPayList": nowUrl + "/" + interfaceFile + "/getPayList/appkey/" + appkey,
	// 创建订单
	"createOrder": nowUrl + "/" + interfaceFile + "/createOrder/appkey/" + appkey,
	// 收听记录
	"bookAudioWatch": nowUrl + "/" + interfaceFile + "/bookAudioWatch/appkey/" + appkey,
	// 关于我们
	"getAbout": nowUrl + "/" + interfaceFile + "/getAbout/appkey/" + appkey,
	// 官方公告
	"getAnnounement": nowUrl + "/" + interfaceFile + "/getAnnounement/appkey/" + appkey,
	// 活动列表
	"getGameList": nowUrl + "/" + interfaceFile + "/getGameList/appkey/" + appkey,
	// 活动详情
	"getGameDetail": nowUrl + "/" + interfaceFile + "/getGameDetail/appkey/" + appkey,
	// 幸运转盘
	"getPrize": nowUrl + "/" + interfaceFile + "/getPrize/appkey/" + appkey,
	// 购买视频
	"buyVideo": nowUrl + "/" + interfaceFile + "/buy/appkey/" + appkey,
	// 购买小说
	"buyBook": nowUrl + "/" + interfaceFile + "/buyBook/appkey/" + appkey,
	// 热门搜索
	"getHotSearch": nowUrl + "/" + interfaceFile + "/getHotSearch/appkey/" + appkey,
	// 热门搜索A
	"getWorldSearch": nowUrl + "/" + interfaceFile + "/getWorldSearch/appkey/" + appkey,
	// 发起搜索
	"searchVideo": nowUrl + "/" + interfaceFile + "/searchVideo/appkey/" + appkey,
	// 热门小说搜索
	"getHotBookSearch": nowUrl + "/" + interfaceFile + "/getHotBookSearch/appkey/" + appkey,
	// 发起小说搜索
	"searchBook": nowUrl + "/" + interfaceFile + "/searchBook/appkey/" + appkey,
	// 清空小说搜索记录
	"emptyBookSearch": nowUrl + "/" + interfaceFile + "/emptyBookSearch/appkey/" + appkey,
	// 清空搜索记录
	"emptySearch": nowUrl + "/" + interfaceFile + "/emptySearch/appkey/" + appkey,
	// 获广告
	"getAd": nowUrl + "/" + interfaceFile + "/getAd/appkey/" + appkey,
	// 获取分享者id
	"getSharePid": nowUrl + "/" + interfaceFile + "/getSharePid/appkey/" + appkey,
	// 发帖图片
	"uploadImg": nowUrl + "/" + interfaceFile + "/uploadImg/appkey/" + appkey,
	// 广场首页数据
	"getPlazaList": nowUrl + "/" + interfaceFile + "/communityHomepage/appkey/" + appkey,
	// 帖子详情获取评论
	"getComment": nowUrl + "/" + interfaceFile + "/getPostComment/appkey/" + appkey,
	// 帖子详情广告
	"getAdInfo": nowUrl + "/" + interfaceFile + "/getAdInfo/appkey/" + appkey,
	// 发帖
	"sendComment": nowUrl + "/" + interfaceFile + "/sendPostComment/appkey/" + appkey,
	// 个人主页
	"homePage": nowUrl + "/" + interfaceFile + "/homePage/appkey/" + appkey,
	// 上传配置
	"uploadConfig": nowUrl + "/" + interfaceFile + "/getUploadConfig/appkey/" + appkey,
	// 顶部导航
	"getTopMenu": nowUrl + "/" + interfaceFile + "/getTopMenu/appkey/" + appkey,
	/********************** 直播相关 **********************/
	// 获取主播列表
	"getAnchorList": nowUrl + "/" + interfaceFile + "/getAnchorList/appkey/" + appkey,
	// 购买付费房
	"buyGoldRoom": nowUrl + "/" + interfaceFile + "/buyGoldRoom/appkey/" + appkey,
	// 查询用户是否为主播
	"getUserAnchor": nowUrl + "/" + interfaceFile + "/getUserIsAnchor/appkey/" + appkey,
	// 签约主播
	"regAnchor": nowUrl + "/" + interfaceFile + "/regAnchor/appkey/" + appkey,
	// 进入直播间
	"playerConfig": nowUrl + "/" + interfaceFile + "/enterTheStudio/appkey/" + appkey,
	// 关注主播
	"focusAnchor": nowUrl + "/" + interfaceFile + "/focusOnTheAnchor/appkey/" + appkey,
	// 退出直播间
	"logoutRoom": nowUrl + "/" + interfaceFile + "/exitTheStudio/appkey/" + appkey,
	// 打赏主播
	"giveAnchor": nowUrl + "/" + interfaceFile + "/rewardTheAnchor/appkey/" + appkey,
	// 开始直播
	"liveInitData": nowUrl + "/" + interfaceFile + "/startLiveBroadcast/appkey/" + appkey,
	// 保存房间信息
	"saveRoomData": nowUrl + "/" + interfaceFile + "/saveRoomData/appkey/" + appkey,
	// 上传封面图片
	"roomUploadImg": nowUrl + "/" + interfaceFile + "/roomUploadImg/appkey/" + appkey,
	// 结束直播并结算
	"endLivePlayer": nowUrl + "/" + interfaceFile + "/endLiveBroadcast/appkey/" + appkey,
	// 禁言与恢复
	"updateSendMs": nowUrl + "/" + interfaceFile + "/updateSendMs/appkey/" + appkey,
	// 主播踢人出房间
	"anchorOutUser": nowUrl + "/" + interfaceFile + "/anchorOutUser/appkey/" + appkey,
	//图片资源发布设置
	"getPictureConfig": nowUrl + "/" + interfaceFile + "/getPictureConfig/appkey/" + appkey,
	// 图片 + 资讯
	"getPicture": nowUrl + "/" + interfaceFile + "/getPicture/appkey/" + appkey,
	// 购买图片
	"buyPicture": nowUrl + "/" + interfaceFile + "/buyPicture/appkey/" + appkey,
	// 图片详情
	"pictureInfo": nowUrl + "/" + interfaceFile + "/pictureInfo/appkey/" + appkey,
	// app内打开H5
	"openH5Url": nowUrl + "/" + interfaceFile + "/openH5Url/appkey/" + appkey,
	// 上传试看时间
	"updateTryTime": nowUrl + "/" + interfaceFile + "/updateTryTime/appkey/" + appkey,
	// 获取专题列表
	"getAlbumList": nowUrl + "/" + interfaceFile + "/getAlbumList/appkey/" + appkey,
	// 获取迷你广告
	"getAdMini": nowUrl + "/" + interfaceFile + "/getAdMini/appkey/" + appkey,
	// 获取排行前五的UP主
	"getUPtop": nowUrl + "/" + interfaceFile + "/getUPtop/appkey/" + appkey,
	// 我的团队
	"getUserTeam": nowUrl + "/" + interfaceFile + "/getUserTeam/appkey/" + appkey,
	// 直播记录
	"getPlayerLog": nowUrl + "/" + interfaceFile + "/getPlayerLog/appkey/" + appkey,
	// 礼物记录
	"getPlayerGift": nowUrl + "/" + interfaceFile + "/getPlayerGift/appkey/" + appkey,
	// 长视频分类筛选
	"getFilterData": nowUrl + "/" + interfaceFile + "/getFilterData/appkey/" + appkey,
	// 长视频分类筛选视频
	"getFilters": nowUrl + "/" + interfaceFile + "/getFilterVideo/appkey/" + appkey,
	// 长视频
	"getClassData": nowUrl + "/" + interfaceFile + "/getClassData/appkey/" + appkey,
	// 长视频下分类视频
	"getClassVideo": nowUrl + "/" + interfaceFile + "/getClassVideoData/appkey/" + appkey,
	// 长视频标签
	"getTagData": nowUrl + "/" + interfaceFile + "/getTagData/appkey/" + appkey,
	// 短视频
	"getSvodClass": nowUrl + "/" + interfaceFile + "/getSvodClassData/appkey/" + appkey,
	// 大分类短视频
	"getSvodData": nowUrl + "/" + interfaceFile + "/getSvodClassVideoData/appkey/" + appkey,
	// 按排序获取短视频
	"getSvodHotData": nowUrl + "/" + interfaceFile + "/getSvodHotVideoData/appkey/" + appkey,
	// 短视频排行榜
	"getSvodTopData": nowUrl + "/" + interfaceFile + "/getSvodTopData/appkey/" + appkey,
	// 加载短视频
	"getSvodMain": nowUrl + "/" + interfaceFile + "/getSvodMain/appkey/" + appkey,
	// 扣除免费次数
	"updateFree": nowUrl + "/" + interfaceFile + "/updateFree/appkey/" + appkey,
	// 金币购买视频
	"goldBuyVideo": nowUrl + "/" + interfaceFile + "/goldBuyVideo/appkey/" + appkey,
	// 点赞
	"likeSvodVideo": nowUrl + "/" + interfaceFile + "/likeSvodVideo/appkey/" + appkey,
	// 收藏短视频
	"collectSvodVideo": nowUrl + "/" + interfaceFile + "/collectSvodVideo/appkey/" + appkey,
	// 短视频评论列表
	"svodVideoComm": nowUrl + "/" + interfaceFile + "/svodVideoComment/appkey/" + appkey,
	// 短视频评论
	"sendVideoComm": nowUrl + "/" + interfaceFile + "/sendVideoComment/appkey/" + appkey,
	// 按标签获取短视频
	"tagSvodVideo": nowUrl + "/" + interfaceFile + "/tagSvodVideo/appkey/" + appkey,
	// 短视频播放
	"playSvodVideo": nowUrl + "/" + interfaceFile + "/playSvdoaaa/appkey/" + appkey,
	// 周下载量记数
	"vipWeekDowns": nowUrl + "/" + interfaceFile + "/vipWeekDowns/appkey/" + appkey,
	"changeLive": nowUrl + "/" + interfaceFile + "/changeLive/appkey/" + appkey,
	// 关注制作单位
	"productionFocus": nowUrl + "/" + interfaceFile + "/productionFocus/appkey/" + appkey,
	//制作单位列表
	"production": nowUrl + "/" + interfaceFile + "/production/appkey/" + appkey,
	//制作单位详情
	"productionDetail": nowUrl + "/" + interfaceFile + "/productionDetail/appkey/" + appkey,
	//短视频作者列表
	"shortVideo": nowUrl + "/" + interfaceFile + "/shortVideo/appkey/" + appkey,
	"refreshSvod": nowUrl + "/" + interfaceFile + "/refreshSvod/appkey/" + appkey,
	"shortVideoFocus": nowUrl + "/" + interfaceFile + "/shortVideoFocus/appkey/" + appkey,
	"shortVideoDetail": nowUrl + "/" + interfaceFile + "/shortVideoDetail/appkey/" + appkey,
	"clickPost": nowUrl + "/" + interfaceFile + "/addClickPost/appkey/" + appkey,
	"focusList": nowUrl + "/" + interfaceFile + "/focusList/appkey/" + appkey,
	/* 不需要APPKEY的统一放在下面 */
	// 去支付
	"getPay": nowUrl + "/" + interfaceFile + "/pay",
	// 服务协议
	"agreement": nowUrl + "/" + interfaceFile + "/privacy/type/1",
	// 隐私政策
	"privacy": nowUrl + "/" + interfaceFile + "/privacy/type/2",
	"getAtlasCity": nowUrl + "/" + interfaceFile + "/getAtlasCity/appkey/" + appkey,
	"heartBeat": nowUrl + "/" + interfaceFile + "/heartbeat/appkey/" + appkey,
	"userLogin": nowUrl + "/" + interfaceFile + "/login/appkey/" + appkey,
	"userReg": nowUrl + "/" + interfaceFile + "/register/appkey/" + appkey,
	"getInfo": nowUrl + "/" + interfaceFile + "/getUserInfo/appkey/" + appkey,
	"userSign": nowUrl + "/" + interfaceFile + "/userSign/appkey/" + appkey,
	"myBalance": nowUrl + "/" + interfaceFile + "/balance/appkey/" + appkey,
	"giveFeedback": nowUrl + "/" + interfaceFile + "/userFeedback/appkey/" + appkey,
	"initialInstall": nowUrl + "/" + interfaceFile + "/initialInstall/appkey/" + appkey,
	"toPostNews": nowUrl + "/" + interfaceFile + "/toPostNews/appkey/" + appkey,
	"encCate": nowUrl + "/" + interfaceFile + "/encyCategory/appkey/" + appkey,
	"encyclopedias": nowUrl + "/" + interfaceFile + "/encyclopedias/appkey/" + appkey,
	"encDetail": nowUrl + "/" + interfaceFile + "/encyclopediaDetails/appkey/" + appkey,
	"encAction": nowUrl + "/" + interfaceFile + "/encycloAction/appkey/" + appkey,
	"postFocus": nowUrl + "/" + interfaceFile + "/postFocus/appkey/" + appkey,
	"gameWap": nowUrl + "/" + interfaceFile + "/gameWap/appkey/" + appkey,
}
// 是否登录 未登录返回false
const getLogins = function() {
	try {
		const res = uni.getStorageSync('userInfo_' + appkey);
		return res ? res : false;
	} catch (e) {
		return false;
	}
}
// 缓存登录信息
const setLogins = function(data) {
	try {
		uni.setStorageSync('userInfo_' + appkey, data);
		return true;
	} catch (e) {
		return false;
	}
}
// 注销登录
const delLogins = function() {
	try {
		uni.removeStorageSync('userInfo_' + appkey);
		return true;
	} catch (e) {
		return false;
	}
}
/*
 * randomWord 产生任意长度随机字母数字组合
 * randomFlag 是否任意长度 min 任意长度最小位[固定位数] max 任意长度最大位
 *
 * 生成6—12位随机字符串 ：randomWord(true,6,12)
 * 生成随机的6位字符串 ： randomWord(false,6) 
 * type : true纯数字,false为数字和字母
 */
const randomWord = function(randomFlag = false, type = false, min, max) {
	let str = "",
		range = min;
	if (type) {
		var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	} else {
		var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
			'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
			'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
			'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
			'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
		];
	}
	//'-','.','~','!','@','#','$','%','^','&','*','(',')','_',':','<','>','?'
	if (randomFlag) {
		range = Math.round(Math.random() * (max - min)) + min; // 任意长度
	}
	for (let i = 0; i < range; i++) {
		var pos = Math.round(Math.random() * (arr.length - 1));
		str += arr[pos];
	}
	return str;
}
// 同步缓存图片
const imgCache = function(image_url, backFun) {
	// #ifdef H5
	backFun(image_url);
	// #endif
	// #ifdef APP-PLUS
	let md5 = require('./md5.min.js')
	var image_name = md5(image_url) + appkey + '';
	//uni.removeStorageSync(image_name);
	//console.log(image_name)
	var imgUrl = uni.getStorageSync(image_name);
	// 存在则读缓存 
	if (imgUrl) {
		//if(uni.getSystemInfoSync().platform == 'ios') imgUrl = "file:" + imgUrl;
		plus.io.resolveLocalFileSystemURL(imgUrl, entry => {
			entry.file(file => {
				//console.log(imgUrl);
			});
		}, err => {
			uni.removeStorageSync(image_name);
		});
		backFun(imgUrl);
		//console.log(imgUrl)
	} else {
		backFun(image_url);
		//console.log(image_url);
		// 本地没有缓存则下载 
		uni.downloadFile({
			url: image_url,
			success: res => {
				//console.log(res.tempFilePath);
				if (res.statusCode == 200) {
					uni.saveFile({
						tempFilePath: res.tempFilePath,
						success: e => {
							var savedFilePath = e.savedFilePath;
							uni.setStorageSync(image_name, savedFilePath);
						}
					});
				}
			}
		});
	}
	// #endif
}
// 获得URL中的文件名
const splitUrl = function(imgUrl) {
	if (!imgUrl) return false;
	var imgArr = imgUrl.split('/');
	var fileName = imgArr[imgArr.length - 1];
	return fileName;
}
// 加载提示
const showToast = function(title = '', times = 1000, style = 'none', image = '') {
	uni.$emit('_hideLoading')
	setTimeout(() => {
		uni.showToast({
			icon: style,
			title: title,
			mask: true,
			duration: times,
			image: image
		});
	}, 200)
}
const getFileSize = function(fileByte) {
	try {
		var fileSizeByte = fileByte;
		var fileSizeMsg = "";
		if (fileSizeByte < 1048576) fileSizeMsg = (fileSizeByte / 1024).toFixed(2);
		else if (fileSizeByte == 1048576) fileSizeMsg = 1;
		else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024))
			.toFixed(2);
		else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824) fileSizeMsg = "1GB";
		else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 *
			1024 * 1024)).toFixed(2);
		else fileSizeMsg = "文件超过1TB";
		return fileSizeMsg;
	} catch (e) {
		return false;
	}
}

// 获取设备ID
const getMobileDid = function(backFun) {
	var phone = uni.getSystemInfoSync();
	var did = phone.deviceId;
	if (did.length > 0) {
		var did = did.split("|").filter(function(r) {
			return r && r.trim();
		});
		backFun(did[did.length - 1]);
	} else {
		// #ifdef APP-PLUS
		plus.device.getInfo({
			success: function(e) {
				if (phone.platform == 'android') {
					var arr = e.uuid.split(",");
					did = arr[0];
				} else {
					did = e.uuid;
				}
			},
			fail: function(e) {
				did = getMobileRandDid();
			},
			complete: function(e) {
				backFun(did);
			}
		});
		// #endif
		// #ifdef H5 || MP-WEIXIN
		backFun(getMobileRandDid());
		// #endif
	}
}
// 随机设备ID
const getMobileRandDid = function() {
	const didKey = 'my_did_' + appkey;
	const getDid = uni.getStorageSync(didKey);
	if (getDid) {
		return getDid;
	} else {
		var randDid = randomWord(false, false, 16, 16);
		uni.setStorageSync(didKey, 'H5' + randDid);
		return randDid;
	}
}
// 关闭APP
const outApp = function() {
	// #ifdef APP-PLUS
	switch (uni.getSystemInfoSync().platform) {
		case 'android':
			plus.runtime.quit();
			break;
		case 'ios':
			plus.ios.import('UIApplication').sharedApplication().performSelector('exit');
			break;
	}
	// #endif
	// #ifdef H5
	window.opener = null;
	window.open(' ', '_self', ' ');
	window.close();
	// #endif
}
// 跳转方法
const jumpUrl = function(url, type = 'web', delta = 1) {
	if (url == '#' || url == '') return false;
	if (url == 'back') {
		var delta = parseInt(type) ? type : 1;
		uni.navigateBack({
			delta: delta
		});
		return
	}
	switch (type) {
		// 原窗口
		case 'old':
			uni.reLaunch({
				url: url
			});
			break;
			// 不关闭当前页跳转
		case 'new':
			uni.navigateTo({
				url: url,
				fail() {
					uni.switchTab({
						url: url
					})
				}
			});
			break;
			// tabBar
		case 'tab':
			uni.switchTab({
				url: url
			});
			break;
			// 关闭当前页跳转
		case 'newx':
			uni.redirectTo({
				url: url,
				fail() {
					uni.switchTab({
						url: url
					})
				}
			});
			break;
			// APP内打开链接
		case 'app':
			var app = '/pages/jump/index?u=' + url + (typeof delta != 'number' ? '&title=' + delta : '')
			//console.log(app)
			uni.navigateTo({
				url: app
			});
			break;
			// 跳至外置浏揽器
		default:
			// #ifdef APP-PLUS
			plus.runtime.openURL(url);
			// #endif
			// #ifdef H5
			// window.location.href = url;
			 window.open(url, '_blank');
			//window.open(url);
			// #endif
	}
}
// 复制H5+APP
const copy = function(str) {
	var content = str + '';
	// #ifdef APP-PLUS
	uni.setClipboardData({
		data: content,
		success: () => {
			showToast('复制成功', 2000);
		}
	});
	// #endif
	// #ifdef H5
	const result = h5Copy(content);
	if (result == false) {
		showToast('不支持', 2000);
	} else {
		showToast('复制成功', 2000);
	}
	// #endif
}
const h5Copy = function(content) {
	if (!document.queryCommandSupported('copy')) return false
	let textarea = document.createElement("textarea")
	textarea.value = content
	textarea.readOnly = "readOnly"
	document.body.appendChild(textarea)
	textarea.select() // 选择对象
	textarea.setSelectionRange(0, content.length) //核心
	let result = document.execCommand("copy") // 执行浏览器复制命令
	textarea.remove()
	return result
}
var bgView = null;
// 创建原生View控件
const createView = function(height = '50px', opacity = '0.3', text = '') {
	// #ifdef APP-PLUS
	/* if(uni.getSystemInfoSync().platform == 'ios' && height=='50px'){
		height = '105px';
	} */
	bgView = new plus.nativeObj.View('bg', {
		bottom: '0px',
		left: '0px',
		height: height,
		width: '100%',
		opacity: opacity,
		backgroundColor: 'rgba(0,0,0,1)'
	});
	if (text != '') {
		bgView.drawText(text, {
			widht: '100%',
			height: '100%'
		}, {
			size: '18px',
			color: '#fff',
			//backgroundColor: '#FFFFFF'
		});
	}
	bgView.show();
	// #endif
}
// 关闭罩层
const closeView = function() {
	// #ifdef APP-PLUS
	bgView.close();
	// #endif
}
// 打电话给xxx
const callUp = function(number) {
	// #ifdef APP-PLUS
	uni.makePhoneCall({
		phoneNumber: number + '',
		fail: () => {
			api.showToast('操作失败', 2000);
		}
	});
	// #endif
	// #ifdef H5
	window.location.href = 'tel://' + number;
	// #endif
}
const getContacts = function(backFun) {
	// #ifdef H5
	backFun(false);
	// #endif
	// #ifdef APP-PLUS 
	plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, (addressbook) => {
		addressbook.find(["displayName", "phoneNumbers"], (contacts) => {
			//console.log(contacts);
			backFun(contacts);
		}, () => {
			backFun(false);
		}, {
			multiple: true
		});
	}, (e) => {
		backFun(false);
	});
	// #endif
}
const formatSeconds = function(value, type = 1) {
	let result = parseInt(value);
	let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
	let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 %
		60));
	let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
	let res = '';
	if (type == 1) {
		res += `${h}:`;
		res += `${m}:`;
		res += `${s}`;
	} else {
		res += `${h}时`;
		res += `${m}分`;
		res += `${s}秒`;
	}
	return res;
}
/* 获取远程文件大小 */
const getWebFileSize = function(filed = '', backFun) {
	var resSize = 0;
	if (filed.length < 1) {
		backFun(resSize);
		return;
	}
	uni.request({
		url: filed,
		method: 'HEAD',
		success: (e) => {
			if (e.statusCode == 200) {
				resSize = getFileSize(e.header['Content-Length']); // 调用函数换算单位
			}
		},
		complete: () => {
			backFun(resSize);
		}
	});
}
// H5获取浏览器类型
const isH5 = function() {
	var Sys = {
		'type': 'app',
		'ver': 0
	};
	// #ifdef H5
	var ua = navigator.userAgent.toLowerCase();
	var s;
	if (s = ua.match(/version\/([\d.]+).*safari/)) {
		Sys = {
			'type': 'safari',
			'ver': s[1]
		};
	} else if (s = ua.match(/opera.([\d.]+)/)) {
		Sys = {
			'type': 'opera',
			'ver': s[1]
		};
	} else if (s = ua.match(/chrome\/([\d.]+)/)) {
		Sys = {
			'type': 'chrome',
			'ver': s[1]
		};
	} else if (s = ua.match(/firefox\/([\d.]+)/)) {
		Sys = {
			'type': 'firefox',
			'ver': s[1]
		};
	} else if (s = ua.match(/msie ([\d.]+)/)) {
		Sys = {
			'type': 'ie',
			'ver': s[1]
		};
	} else {
		Sys = {
			'type': 'web',
			'ver': 0
		};
	}
	/* 
	(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
	(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
	(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
	(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
	(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
	if (Sys.ie) document.write('IE: ' + Sys.ie);
	if (Sys.firefox) document.write('Firefox: ' + Sys.firefox);
	if (Sys.chrome) document.write('Chrome: ' + Sys.chrome);
	if (Sys.opera) document.write('Opera: ' + Sys.opera);
	if (Sys.safari) document.write('Safari: ' + Sys.safari); 
	*/
	// #endif
	return Sys;
}

const str_repeat = function(i, m) {
	for (var o = []; m > 0; o[--m] = i);
	return o.join('');
}

/* 
var classic = $.sprintf('%s %d%% %.3f', 'string', 40, 3.141593); 
// classic = 'string 40% 3.142' 

var named = $.sprintf('%(name)s: %(value)d', {name: 'age', value: 40}); 
// named = 'age: 40'

var classic = $.vsprintf('%s %d%% %.3f', ['string', 40, 3.141593]); 
// classic = 'string 40% 3.142'

var named = $.vsprintf('%(name)s: %(value)d', [{name: 'age', value: 40}]); 
// named = 'age: 40' 
 */
const sprintf = function() {
	var i = 0,
		a, f = arguments[i++],
		o = [],
		m, p, c, x, s = '';
	while (f) {
		if (m = /^[^\x25]+/.exec(f)) {
			o.push(m[0]);
		} else if (m = /^\x25{2}/.exec(f)) {
			o.push('%');
		} else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
			if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) {
				throw ('Too few arguments.');
			}
			if (/[^s]/.test(m[7]) && (typeof(a) != 'number')) {
				throw ('Expecting number but found ' + typeof(a));
			}
			switch (m[7]) {
				case 'b':
					a = a.toString(2);
					break;
				case 'c':
					a = String.fromCharCode(a);
					break;
				case 'd':
					a = parseInt(a);
					break;
				case 'e':
					a = m[6] ? a.toExponential(m[6]) : a.toExponential();
					break;
				case 'f':
					a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a);
					break;
				case 'o':
					a = a.toString(8);
					break;
				case 's':
					a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a);
					break;
				case 'u':
					a = Math.abs(a);
					break;
				case 'x':
					a = a.toString(16);
					break;
				case 'X':
					a = a.toString(16).toUpperCase();
					break;
			}
			a = (/[def]/.test(m[7]) && m[2] && a >= 0 ? '+' + a : a);
			c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
			x = m[5] - String(a).length - s.length;
			p = m[5] ? str_repeat(c, x) : '';
			o.push(s + (m[4] ? a + p : p + a));
		} else {
			throw ('Huh ?!');
		}
		f = f.substring(m[0].length);
	}
	return o.join('');
}

/* H5版权日志 */
const printLog = function() {
	console.log(' ========= copyright: AprApp视频v5 ========= ');
}

String.prototype.strLen = function() {
	var len = 0;
	for (var i = 0; i < this.length; i++) {
		if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0) len += 2;
		else len++;
	}
	return len;
}
String.prototype.strToChars = function() {
	var chars = new Array();
	for (var i = 0; i < this.length; i++) {
		chars[i] = [this.substr(i, 1), this.isCHS(i)];
	}
	String.prototype.charsArray = chars;
	return chars;
}
String.prototype.isCHS = function(i) {
	if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0)
		return true;
	else
		return false;
}
String.prototype.subCHString = function(start, end) {
	var len = 0;
	var str = "";
	this.strToChars();
	for (var i = 0; i < this.length; i++) {
		if (this.charsArray[i][1])
			len += 2;
		else
			len++;
		if (end < len)
			return str;
		else if (start < len)
			str += this.charsArray[i][0];
	}
	return str;
}
String.prototype.subCHStr = function(start, length) {
	return this.subCHString(start, start + length);
}

module.exports = {
	appkey,
	apiUrl,
	apiData,
	getLogins,
	getMobileDid,
	randomWord,
	printLog,
	getWebFileSize,
	setLogins,
	imgCache,
	jumpUrl,
	formatSeconds,
	showToast,
	isH5,
	delLogins,
	outApp
}