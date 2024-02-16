<template>
	<view class="content">
		<view class="head-top" :style="{'padding-top':top+'px'}">
			<view class="content-head" @click="goPlazaIndex">
				<image src="/static/plaza/back.png" mode="aspectFill" style="width:26upx;height:40upx;"></image>
			</view>
			<text>发帖</text>
			<view :class="isSend?'send-right-y':'send-right-n'" @click="send">发布</view>
		</view>
		<view :style="{'padding-top':contentTop+'px'}">
			<view class="textarea">
				<textarea @blur="bindTextAreaBlur" :value="content" :maxlength="maxlength" @input="sendText"
					placeholder="尬聊内容, 写在这里哦~~" />
				<view class="bottom-right">{{wzCount}}/{{maxlength}}</view>
			</view>
		</view>
		<view class="item-line" v-if="classList.length>0">
			<image class="ico left" src="@/static/upload/class-pic1.png" mode="aspectFill"></image>
			<scroll-view scroll-x="true" :show-scrollbar="false" class="class-list">
				<view :class="cid==c.id?'class-item sel':'class-item'" v-for="(c, i) in classList" :key="i"
					@click="setCid(c.id)">{{c.name}}</view>
			</scroll-view>
		</view>
		<view class="item-line">
			<image class="ico left" src="@/static/upload/class-pic2.png" mode="aspectFill"></image>
			<scroll-view scroll-x="true" :show-scrollbar="false" class="class-list">
				<view :class="vip==0?'class-item sel':'class-item'" @click="setVIP(0)">免费图</view>
				<view :class="vip==1?'class-item sel':'class-item'" @click="setVIP(1)">VIP图</view>
			</scroll-view>
		</view>
		<view style="clear: both;"></view>
		<view class="content-bottom">
			<text>1. 内容不允许出现数字、英文字母。</text>
			<text>2. 最多可添加{{maxCount}}张图片。</text>
			<text>3. 免费贴，所有用户都可看。VIP贴，只有VIP用户可看。</text>
			<text>4. 分类和权限为必选项，请选择后发图。</text>
		</view>
		<view class="bottom-btn">
			<g-upload ref='gUpload' :mode="imgList" @chooseFile='chooseFile' @imgDelete='imgDelete' :control='control'
				:maxCount="maxCount" :columnNum="columnNum">
			</g-upload>
		</view>
		<css-loading ref="cssLoading"></css-loading>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	import gUpload from "@/components/g-upload/g-upload.vue"
	var _self;
	export default {
		components: {
			gUpload
		},
		data() {
			return {
				isLogin: false,
				userId: 0,
				top: 0,
				phone: {},
				contentTop: 35,
				cid: 0,
				isSend: false,

				maxCount: 9,
				maxlength: 200,
				uploadSize: '500M',
				wzCount: 0,

				control: true,
				columnNum: 3,
				imgList: [],
				newImgList: [],
				classList: [],
				content: '',
				vip: 0,
				oldContent: {
					id: 0
				},
				type: 0,
			}
		},
		onLoad(e) {
			_self = this;
			_self.phone = uni.getSystemInfoSync();
			_self.top = _self.phone.statusBarHeight;
			//console.log(_self.phone)
			// #ifdef H5
			_self.top = 9;
			// #endif
			_self.type = e.t;
			_self.contentTop = _self.top + 46;
			if (e.t == 0) _self.removeStorage();
			uni.getStorage({
				key: 'edit_content_' + api.appkey,
				success: (res) => {
					_self.oldContent = res.data;
					//console.log(res.data);
				},
				complete: () => {
					_self.isUserLogin();
				}
			});
			_self.mydata();
		},
		methods: {
			setCid(e) {
				_self.cid = e;
			},
			setVIP(e) {
				_self.vip = e;
			},
			isUserLogin() {
				_self.isLogin = api.getLogins();
				if (!_self.isLogin) {
					_self.skipUrl('/pages/login/login', 'new');
				} else {
					_self.userId = _self.isLogin.userId;
					if (_self.type == 1 && _self.oldContent.uid == _self.userId) {
						_self.imgList = _self.oldContent.allImg;
						_self.content = _self.oldContent.text;
						_self.wzCount = _self.oldContent.text.length;
					}
					//console.log(_self.imgList);
				}
			},
			removeStorage() {
				uni.removeStorage({
					key: 'edit_content_' + api.appkey,
					success: () => {
						//console.log('ok')
					}
				});
			},
			goPlazaIndex() {
				_self.skipUrl('/pages/plaza/index', 'new')
			},
			// 点击上传控件上传
			uploadImg() {
				_self.$refs.gUpload.uploadImg()
			},
			/*
			上传后返回的值：
			list：上传后图片数组
			v：返回当前上传图片的临时路径
			*/
			chooseFile(list, v) {
				//console.log("上传图片_list：", list)
				//console.log("上传图片_v：", v);
				//_self.uploadFileToServe(v);
				_self.newImgList = _self.newImgList.concat(v);
				//console.log(_self.newImgList)
			},
			/*
			删除图片：
			list：删除返回删除后剩余的图片数组
			eq：返回删除的数组
			*/
			imgDelete(list, eq) {
				_self.newImgList = list;
				/* console.log("删除图片_list：", list)
				console.log("删除图片_eq：", eq) */
			},
			/*
			执行上传服务：
			urlList：要上传的图片：数组类型
			*/
			uploadFileToServe(urlList = '') {
				//console.log(_self.newImgList);
				/* if (!urlList || urlList.length <= 0) {
					return
				}; */
				let isData = 0;
				let imgs = []
				if (_self.newImgList.length > 0) {
					imgs = _self.newImgList.map((value, index) => {
						return {
							name: "imgs[" + index + "]",
							uri: value
						}
					});
					isData = 1;
				}
				if (_self.content.length == 0) {
					//api.showToast('请输入帖子内容', 2000);
					return;
				}
				if (!_self.cid || _self.cid == 0) {
					api.showToast('请选择帖子标签', 2000);
					return;
				}
				if (isData == 0) {
					api.showToast('请上传至少一张图片', 2000);
					return;
				}
				_self._showLoading('发布中...');
				//for (let i = 0; i < urlList.length; i++) {
				uni.uploadFile({
					url: api.apiData.uploadImg,
					//filePath: urlList[i],
					files: imgs,
					//name: 'fileName',
					formData: {
						userId: _self.userId,
						content: _self.content,
						type: 1,
						id: _self.oldContent.id,
						isData: isData,
						is_vip: _self.vip,
						mtype: _self.cid,
					},
					success: (res) => {
						var r = JSON.parse(res.data);
						api.showToast(r.Msg, 2000);
						if (r.Code == 200) {
							setTimeout(() => {
								_self.goPlazaIndex();
							}, 500);
						}
					},
					fail: (e) => {
						api.showToast('暂未开启发帖功能', 2000);
					}
				});
				//}
			},
			send() {
				//console.log('send');
				_self.uploadFileToServe();
			},
			bindTextAreaBlur() {
				//console.log('hide');
			},
			sendText(e) {
				var value = e.detail.value;
				_self.wzCount = value.length;
				_self.content = value;
				if (_self.wzCount > 0) {
					_self.isSend = true;
				} else {
					_self.isSend = false;
				}
				if (value.length >= _self.maxlength) {
					api.showToast('最多可输入' + _self.maxlength + '个文字');
				}
				//console.log(value.length);
			},
			mydata() {
				var postUrl = api.apiData.getGtypeList;;
				uni.request({
					url: postUrl,
					method: 'POST',
					data: {},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						_self.classList = e.data.Data.data;
					},
					fail: () => {
						_self.msgData("服务器连接失败，请检测网格是否正常");
					}
				});
			},
			// 跳转登录
			skipUrl(uri = '/pages/login/login', type = 'new') {
				api.jumpUrl(uri, type)
			},
		}
	};
</script>

<style>
	.sel {
		border: 1px solid rgba(255, 255, 208, 0.1) !important;
		background-color: rgba(255, 255, 208, 0.8) !important;
		color: #FFFFFF !important;
	}

	.class-item {
		display: inline-block;
		margin-left: 1%;
		width: 120upx;
		float: left;
		font-size: 12px;
		text-align: center;
		height: 50upx;
		line-height: 50upx;
		padding: 0 10upx;
		border-radius: 18upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		border: 1px solid;
		background-color: #FFFFF0;
		color: #ff9f00;
		margin-bottom: 6upx;
	}

	.ico {
		width: 56upx;
		height: 56upx;
		margin-left: 10px;
		text-align: center;
	}

	.class-list {
		white-space: nowrap;
		width: 80%;
		display: inline-block;
		//background-color: #007AFF;
	}

	.bottom-btn {
		//background-color: #007AFF;
	}

	.item-line {
		margin-top: 10px;
		display: flex;
		justify-content: flex-start;
	}

	.content-bottom text {
		display: block;
		margin-bottom: 8upx;
	}

	.content-bottom {
		width: 97%;
		margin: 20upx 3%;
		font-size: 24upx;
		color: #999999;
	}

	.bottom-right {
		text-align: right;
		font-size: 24upx;
		color: #999999;
		width: 97%;
		padding-right: 3%;
		padding-bottom: 15upx;
		box-sizing: border-box;
	}

	.textarea textarea {
		width: 94%;
		height: 200upx;
		margin: 0 3%;
		padding: 20upx 0 0upx;
		font-size: 26upx;
		color: #FFFFFF;
		//background-color: #007AFF;
	}

	.textarea {
		width: 96%;
		//height: 300upx;
		margin: 0 2%;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 18upx;
	}

	.light-theme .textarea {
		border: 1px solid var(--plaza-color-gray-1);
		border-radius: 10upx;
	}

	.light-theme .textarea textarea {
		color: var(--plaza-color-dark);
	}

	.send-right-n {
		display: inline-block;
		right: 35upx;
		width: 120upx;
		height: 55upx;
		line-height: 55upx;
		color: #888888;
		background-color: #F8F8F8;
		border-radius: 40upx;
		font-size: 30upx;
		position: absolute;
		margin-top: 8upx;
	}

	.send-right-y {
		display: inline-block;
		right: 35upx;
		width: 120upx;
		height: 55upx;
		line-height: 55upx;
		color: #FFFFFF;
		background-image: linear-gradient(to right, #FF8F00, rgba(254, 67, 101, 0.8));
		border-radius: 40upx;
		font-size: 12px;
		position: absolute;
		margin-top: 8upx;
	}

	.content-head {
		position: absolute;
		display: inline-block;
		//background: rgba(0,0,0,0.5);
		color: #cccccc;
		left: 35upx;
		margin-top: 14upx;
	}

	.head-top text {
		display: inline-block;
		width: 50%;
		height: 30px;
		line-height: 30px;
		font-weight: bold;
	}

	.head-top {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		text-align: center;
		font-size: 15px;
		z-index: 10;
		background-color: #20202C;
		padding-bottom: 15upx;
		border-bottom: 1px solid #20202C;
		color: #FFFFFF;
	}
</style>
