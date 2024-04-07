<style lang="scss">
.bdd {
	background: url() no-repeat center center fixed ; //参数解释请往下看
	background-size: cover;
	box-sizing: border-box;
	height: 100vh;
}
</style>
<template>
	<view class="bdd" @click="goToLink()" :style="{'background-image': 'url('+bgurl+')'}"></view>
</template>
<script>
	import api from "@/common/api.js";
	export default {
		components: {
			
		},
		onLoad() {
			this.dataLoad()
		},
		data() {
			return {
				bgurl: "/static/game/gameing.jpg",
				link: "",
				title: ""
			}
		},
		methods: {
			dataLoad(){
				const _self = this;
				uni.request({
					url: api.apiData.gameWap,
					method: 'GET',
					success: (e) => {
						_self.bgurl = e.data.Data.bgurl
						_self.link = e.data.Data.url
						_self.title = e.data.Data.title
						uni.setNavigationBarTitle({
							title: e.data.Data.title
						})
					},
					fail: (e) => {
						console.log(e)
						// _self.msgData('服务器连接失败，请检查网络是否正常', 5000);
					}
				});
			},
			goToLink(){
				if(this.link.includes('http') || uthis.linkincludes('https')){
					api.jumpUrl(this.link)
				} else {
					api.jumpUrl(this.link, 'new');
				}
			}
		}
	}
</script>