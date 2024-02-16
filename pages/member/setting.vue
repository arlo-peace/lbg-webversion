<template>
	<view>
		<view class="content-head" :style="{ padding: top + 'px 0 10px 0' }">编辑资料</view>
		<progress :percent="percent" backgroundColor="#20202C" strock-width="10"></progress>
		<view style="text-align: center;margin: 20px 0;">
			<image :src="avatar" mode="aspectFill" class="head-img" @click="uploadTx">
				<view style="font-size:14px;color:#fff;margin-top:10upx;">点击更换头像</view>
		</view>
		<view class="line"></view>
		<view class="head-tx">
			<view>账号</view>
			<view class="head-acc">{{userInfo.username}}</view>
		</view>
		<view class="head-tx">
			<view>昵称</view>
			<view class="head-acc" @click="editUserInfo(1)">{{userInfo.nickname}}
				<image src="/static/imgs/r.png" style="width:12px;height:10px;"></image>
			</view>
		</view>
		<!-- <view class="head-tx" @click="editUserInfo(4)">
			<view>我的性别</view>
			<view class="head-acc">{{sex[userInfo.sex]}} <image src="/static/imgs/r.png" style="width:12px;height:10px;"></image></view>
		</view> -->
		<view class="head-tx">
			<view>绑定手机</view>
			<view class="head-acc" v-if="isTel">{{userInfo.tel}}</view>
			<view class="head-acc" @click="editUserInfo(2)" v-else>绑定后不可修改 <image src="/static/imgs/r.png"
					style="width:12px;height:10px;"></image>
			</view>
		</view>
		<view class="head-tx">
			<view>登录密码</view>
			<view class="head-acc" @click="editUserInfo(3)">修改登录密码<image src="/static/imgs/r.png"
					style="width:12px;height:10px;"></image>
			</view>
		</view>
		<neil-modal :show="isNotice" @confirm="confirm" @close="closeNotice" :title="title" confirm-text="提交数据"
			cancel-text="我再想想">
			<view style="min-height:90upx;padding:24upx 30upx 10upx;">
				<view v-if="type==1">
					<input class="input" type="text" :value="value" maxlength="15" @input="inputUserInfo"
						placeholder="请输入用户昵称" />
				</view>
				<view v-if="type==2">
					<input class="input" type="number" :value="value" maxlength="11" @input="inputUserInfo"
						placeholder="请输入手机号" />
					<view class="sms-box">
						<input class="input" style="width:63%;" type="number" :value="sms.code" @input="inputCode" maxlength="11" placeholder="请输入验证码" />
						<view class="sms-btn" v-if="sms.time == 60" @click="getSms">获取</view>
						<view class="sms-btn disabled" v-else>{{ sms.time }}</view>
					</view>
				</view>
				<view v-if="type==3">
					<input class="input pwd" type="password" :value="fromData.oldPwd" id="oldPwd" maxlength="15"
						@input="inputPwd" placeholder="请输入原密码" />
					<input class="input pwd" type="password" :value="fromData.newPwd" id="newPwd" maxlength="15"
						@input="inputPwd" placeholder="请输入新密码" />
					<input class="input pwd" type="password" :value="fromData.rPwd" id="rPwd" maxlength="15"
						@input="inputPwd" placeholder="再输入一次" />
				</view>
				<view v-if="type==4">
					<radio-group style="display:flex;flex-direction:row;padding-top:10upx;" @change="radioChange">
						<label style="flex:1;flex-direction:row;display:flex;align-items:center;justify-content:center;"
							v-for="(item, index) in sex" :key="index">
							<view>
								<radio :value="index" :checked="index==userInfo.sex" />
							</view>
							<view>{{item}}</view>
						</label>
					</radio-group>
				</view>
			</view>
		</neil-modal>
		<css-loading ref="cssLoading"></css-loading>
	</view>
</template>

<script>
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import api from "@/common/api.js";
	var _self, timer;
	export default {
		data() {
			return {
				userInfo: {},
				avatar: '/static/imgs/tx0.png',
				userId: 0,
				isNotice: false,
				isTel: false,
				title: '提示',
				value: '',
				type: 1,
				percent: 0,
				imgs: '',
				fromData: {
					oldPwd: '',
					newPwd: '',
					rPwd: ''
				},
				top: 27,
				sex: ['保密', '帅哥', '美女'],
				sms: {
					code: '',
					time: 60,
					id: 0
				}
			}
		},
		onLoad() {
			_self = this;
			_self._showLoading('加载中...');
			var mobile = uni.getSystemInfoSync();
			_self.top = mobile.safeArea.top + 7;
			// 是否登录
			var info = api.getLogins();
			if (info === false) {
				_self.skipUrl();
			} else {
				_self.userId = info.userId;
				_self.getUserInfo();
			}
			//uni.hideLoading();
		},
		methods: {
			roundTime() {
				_self.sms.time--
				if (_self.sms.time > 0) {
					timer = setTimeout(() => {
						this.roundTime()
					}, 1000)
				} else {
					timer && clearTimeout(timer)
					_self.sms.time = 60
				}
			},
			getSms() {
				if (_self.sms.time == 60) {
				if (!(/^1[345789]\d{9}$/.test(_self.value))) {
					_self.msgData('手机号有误，请输入有效的手机号');
					return false;
				}
				_self._showLoading('正在发送...');
				// 发起API请求
				uni.request({
					url: api.apiData.getMobileCode + '/mobile/' + _self.value,
					method: 'GET',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (e) => {
						var res = e.data;
						if (res.Code == 201) {
							_self.msgData(res.Msg, 2000);
							return false;
						}
						_self.sms.id = res.Data;
						_self.msgData('验证码已发送，请注意查收', 2000);
						timer = setTimeout(() => {
							this.roundTime()
						}, 1000)
					},
					fail: () => {
						// 失败提示
						_self.msgData('服务器连接失败，请检查网络是否正常', 3000);
					}
				});
				}
			},
			radioChange(evt) {
				//console.log(evt)
				for (let i = 0; i < _self.sex.length; i++) {
					if (i === evt.target.value) {
						_self.userInfo.sex = i;
						break;
					}
				}
			},
			// 读取个人信息
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
						_self.userInfo = e.data.Data;
						if (_self.userInfo.avatar.length > 0) _self.avatar = _self.userInfo.avatar;
						_self.userInfo.sex = (_self.userInfo.sex == '' || _self.userInfo.sex == null) ? 0 :
							_self.userInfo.sex;
						if (_self.userInfo.tel != null && _self.userInfo.tel.length > 0) _self.isTel = true;
						_self._hideLoading();
					},
					fail: () => {
						// 加载失败提示
						_self.msgData('服务器连接失败，请检查网络是否正常', 5000);
					}
				});
			},
			// 弹出修改框
			editUserInfo(e) {
				_self._showLoading('加载中...');
				_self.isNotice = true;
				_self.type = e;
				if (e == 1) {
					_self.title = "请输入新昵称";
					_self.value = _self.userInfo.nickname;
				} else if (e == 2) {
					_self.title = "请输入新手机号";
					_self.value = _self.userInfo.tel;
				} else if (e == 3) {
					_self.title = "修改登录密码";
					_self.fromData.oldPwd = '';
					_self.fromData.newPwd = '';
					_self.fromData.rPwd = '';
				} else {
					_self.title = "请选择性别";
				}
				_self._hideLoading();
			},
			// 修改密码
			inputPwd(e) {
				_self.fromData[e.target.id] = e.target.value;
			},
			// 获取用户输入的信息
			inputUserInfo(e) {
				_self.value = e.detail.value;
			},
			inputCode(e){
				_self.sms.code = e.detail.value;
			},
			// 提交保存
			confirm(type = 0) {
				_self.msgData("处理中...");
				var content = (type == 1) ? _self.imgs : _self.value;
				if (_self.type == 3) {
					var postUrl = api.apiData.changePwd;
					var data = {
						userId: _self.userId,
						oldPwd: _self.fromData.oldPwd,
						newPwd: _self.fromData.newPwd,
						confirm: _self.fromData.rPwd
					}
				} else if(_self.type == 2) {
					var postUrl = api.apiData.editInfo;
					var data = {
						type: _self.type,
						userId: _self.userId,
						content: content,
						code: _self.sms.code,
						logId: _self.sms.id
					}
				} else {
					var postUrl = api.apiData.editInfo;
					var data = {
						type: _self.type,
						userId: _self.userId,
						content: content
					}
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
							if (_self.type == 1) {
								_self.userInfo.nickname = _self.value;
							} else if (_self.type == 2) {
								_self.userInfo.tel = _self.value;
								_self.isTel = true;
							} else if (_self.type == 3) {
								api.delLogins();
								_self.skipUrl();
								_self.msgData("密码修改成功");
							} else {
								_self.percent = 0;
								_self.msgData("头像更换成功");
							}
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
			// 上传头像
			uploadTx() {
				uni.chooseImage({
					count: 1,
					sizeType: ['copressed'],
					success(res) {
						//因为有一张图片， 输出下标[0]， 直接输出地址
						var imgFiles = res.tempFilePaths[0]
						// 上传图片
						var uper = uni.uploadFile({
							// 需要上传的地址
							url: api.apiData.upload,
							// filePath  需要上传的文件
							filePath: imgFiles,
							//fileType: 'image',
							name: 'fileName',
							formData: {
								fileType: 'image'
							},
							success(e) {
								var d = eval("(" + e.data + ")");
								// 显示上传信息
								if (d.Code == 200) {
									_self.avatar = d.Data;
									_self.type = 0;
									_self.imgs = d.Data;
									_self.confirm(1);
								} else {
									api.showToast(d.Msg, 2000);
								}
							}
						});
						// onProgressUpdate 上传对象更新的方法
						uper.onProgressUpdate(function(res) {
							_self.percent = res.progress
						})
					}
				})
			},
			// 跳转登录
			skipUrl() {
				uni.reLaunch({
					url: "/pages/login/login"
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
					});
				}, 200)
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			_self.getUserInfo();
			uni.stopPullDownRefresh();
		},
		components: {
			neilModal
		}
	}
</script>

<style>
	.line {
		height: 8px;
		background-color: #20202C;
	}

	.content-head {
		//position: fixed;
		width: 100%;
		height: 30px;
		line-height: 30px;
		//top: 27px;
		text-align: center;
		color: #FFFFFF;
		background: rgba(0, 0, 0, 0.2);
		font-size: 17px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}

	.input {
		width: 96%;
		padding: 5px 2%;
		border: 1px solid #E2E2E2;
		border-radius: 5px;
		font-size: 13px;
	}

	.pwd {
		margin-bottom: 10px;
	}

	.head-tx view {
		display: inline-block;
	}

	.head-tx {
		width: 90%;
		height: 60px;
		line-height: 60px;
		color: #FFFFFF;
		margin-top: 15px;
		font-size: 30upx;
		margin: auto;
		border-bottom: 1upx solid #20202C;
	}

	.head-img {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		border: 1px solid #FF8F00;
	}

	.head-acc {
		float: right;
		color: #999999;
	}

	.sms-box {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 10upx;
	}

	.sms-btn {
		width: 30%;
		height: 64upx;
		line-height: 60upx;
		text-align: center;
		background-image: linear-gradient(to right, #da4141, rgba(254, 67, 101, 0.8));
		color: #FFFFFF;
		padding: 2px 2%;
		border-radius: 5px;
		font-size: 13px;
		box-sizing: border-box;
	}

	.sms-btn.disabled {
		background-image: linear-gradient(to right, #91868d, rgba(150, 143, 135, 0.8));
	}
</style>