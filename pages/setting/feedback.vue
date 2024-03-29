<!-- This example does not contain the complete css, please refer to the above to get the external link css, check it in the hello uni-app project -->
<template>
	<view class="main-box">
		<view class="header">
			<text class="head-text">我们非常感谢您的反馈</text>
		</view>
		<view>
			<form>
				<view class="item lbg-column">
					<view class="btn-group">
						<view class="lbg-btn" :class="form.type=='positive'?' active':''" @click="changeFeeling('positive')">
							<image class="icon-image" src="@/static/member/like.png"></image>
							<text>积极的</text>
						</view>
						<view class="lbg-btn" :class="form.type=='negative'?' active':''" @click="changeFeeling('negative')">
							<image class="icon-image" src="@/static/member/dislike.png"></image>
							<text>消极的</text>
						</view>
					</view>
				</view>
				<view class="item lbg-column">
					<input class="lbg-input" v-model="form.title" type="text" placeholder-style="color:#cccccc;" maxlength="200" placeholder="输入您的主题"></input>
					<text class="form-label" v-if="formError.title!=''">* {{formError.title}}</text>
				</view>
				<view class="item lbg-column">
					<view class="lbg-form">
						<textarea v-model="form.content" class="lbg-textarea" placeholder-style="color:#cccccc;" placeholder="输入您的内容"/>
					</view>
					<text class="form-label" v-if="formError.content!=''">* {{formError.content}}</text>
				</view>
				<view class="lbg-btn-v">
					<button class="button" @click="onSubmit()">发送反馈</button>
					<button class="button reset" type="default"  @click="onReset()">清除</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	export default {
		data() {
			return {
				form: {
					type: 'positive',
					title: '',
					content: ''
				},
				formError: {
					title: '',
					content: ''
				},
				version: '000',
				versionCode: '000',
				ostype: '',
				browserName: '',
				browserVersion: '',
				dBrand: '',
				did: '',
				platform: '',
				deviceModel: '',
				system: '',
				useragent: ''
			}
		},
		mounted() {
			uni.getSystemInfo({
				success: res => {
					this.version = 'WebVersion'
					this.versionCode = Date.now()
					this.ostype = res.osName
					this.dBrand = res.deviceBrand
					this.did = res.deviceId
					this.platform = res.uniPlatform
					this.deviceModel = res.deviceModel
					this.system = res.system
					this.useragent = res.ua
					this.browserName = res.browserName
					this.browserVersion = res.browserVersion
				}
			});
			// #ifdef APP-PLUS
			this.getAppVersion()
			// #endif
		},
		methods: {
			onSubmit() {
				// Validation
				if(this.form.title == ''){
					this.formError.title = "请输入您的主题。"
					return;
				}
				if(this.form.title.length > 200){
					this.formError.title = "该主题字段的最大长度为 200。"
					return;
				}
				if(this.form.content == ''){
					this.formError.content = "请输入您的评论。"
					return;
				}
				if(this.form.content.length > 500){
					this.formError.content = "该评论字段的最大长度为 500。"
					return;
				}
				
				this.resetError()
				// Formsubmit
				uni.request({
					url: api.apiData.giveFeedback,
					method: 'POST',
					data: {
						userId: this.getUserId(),
						type: this.form.type,
						title: this.form.title,
						content: this.form.content,
						version: this.version,
						versionCode: this.versionCode,
						ostype: this.ostype,
						dBrand: this.dBrand,
						did: this.did,
						platform: this.platform,
						deviceModel: this.deviceModel,
						system: this.system,
						useragent: this.useragent,
						browserName: this.browserName,
						browserVersion: this.browserVersion
					},
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						const resp = res.data
						if(resp.Code==200){
							uni.showToast({
								title: resp.Msg,
								duration: 3000
							});
							this.resetForm()
						} else {
							uni.showToast({
								icon: 'error',
								title: resp.Msg,
								duration: 3000
							});
						}
					},
					fail: (e) => {
						console.log(e)
					}
				})
			},
			onReset(){
				this.resetForm()
				this.resetError()
			},
			resetForm(){
				this.form = {
					type: 'positive',
					title: '',
					content: ''
				}
			},
			resetError(){
				this.formError = {
					title: '',
					content: ''
				}
			},
 			changeFeeling(d) {
				this.form.type = d
			},
			getUserId() {
				var isLogin = api.getLogins();
				return isLogin ? isLogin.userId : 0
			},
			getAppVersion() {
				plus.runtime.getProperty(plus.runtime.appid, (e) => {
					this.versionCode = e.versionCode;
					this.version = e.version;
				});
			},
		}
	}
</script>

<style>
	.main-box{
		padding: 20upx 30upx;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.button {
		width: 100%;
		height: 80upx;
	}
	.button {
		background-image: linear-gradient(to right, #f99a46, #fa8d38, #fb7e2c, #fc6e21, #fd5c18);
		color: #FFF;
		font-size: 15px;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: row;
		border-radius: 40upx;
	}
	.button.reset {
		margin-top: 10px;
		background-image: none;
		background-color: transparent;
		border: 1px solid #333333;
		color: #c2c1c1;
	}
	.header{
		display: block;
		margin: auto;
		margin-top: 16px;
		margin-bottom: 2rem;
	}
	.header .head-text{
		color: #FFFFFF;
		font-size: 1.2rem;
	}
	.item.lbg-column{
		display: flex;
		margin-bottom: 20px;
		flex-direction: column;
	}
	.lbg-input{
		background-color: rgba(0,0,0,0.5);
		border-radius: 30px;
		padding: 15px 20px;
		font-size: 28upx;
		color: #CCCCCC;
		flex: 1;
	}
	.lbg-textarea{
		background-color: rgba(0,0,0,0.5);
		border-radius: 15px;
		padding: 20px;
		font-size: 28upx;
		color: #CCCCCC;
		flex: 1;
	}
	.lbg-form{
		width: 100%;
		display: flex;
	}
	.form-label{
		color: #FFFFFF;
		font-size: .7rem;
		padding-left: 16rpx;
		margin-top: 5px;
		color: red;
	}
	.btn-group{
		display: flex;
		justify-content: space-between;
		grid-row-gap: 1rem;
		width: 100%;
	}
	.btn-group .lbg-btn{
		color: #CCCCCC;
		border-radius: 5px;
		border: 1px solid #fb7e2c;
		display: flex;
		align-items: center;
		padding: 3px 15px;
	}
	.btn-group .lbg-btn .icon-image{
		width: 30px;
		height: 30px;
		padding: 5px;
	}
	.btn-group .lbg-btn text{
		margin-left: 10px;
	}
	.btn-group .lbg-btn .notlike{
		color: #CCCCCC;
		border-radius: 1px;
		border: 1px solid #FF4433;
	}
	.btn-group .lbg-btn .notlike{
		background-color: #FF4433;
	}
	.btn-group .lbg-btn.active{
		background-color: #fb7e2c;
		color: #FFFFFF;
	}
</style>