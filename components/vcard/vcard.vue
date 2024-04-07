<template>
	<view class="vcard" @click="goToDetails(item.id)">
		<text class="vcard-text">{{ item.title }}</text>
		<view class="vcard-img">
			<image :src="getImage(item.images, item.url)" :style="{'height': '200px'}" class="vcard-img-bx" mode="aspectFill"></image>
			<image src="@/static/imgs/play.png" style="width: 60px; height: 60px;" class="vcard-play"></image>
		</view>
		<view class="vcard-info">
			<text class="vcard-info-text">{{ item.hint }}</text>
			<text class="vcard-info-text tspace">{{ item.views }}</text>
			<text class="vcard-info-text">{{ item.agos }}</text>
		</view>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	export default {
		name:"vcard",
		props: {
			item: {
				type: Object,
				default: null
			},
		},
		data() {
			return {
				api: api
			};
		},
		methods: {
			getImage(img, vid) {
				if(img && img!=''){
					const images = img.split(',')
					return images[0];
				}
				return '/static/imgs/head.png';
			},
			goToDetails(id){
				uni.setStorageSync('encdetail_id', id);
				api.jumpUrl('/pages/encyclopedia/details?id='+id, 'new')
			}
		},
	}
</script>

<style scoped>
.vcard{
	display: flex;
	flex-direction: column;
	flex: 1;
	padding: 16px 0;
}
.vcard-text{
	color: #FFFFFF;
	font-size: 14px;
	padding-bottom: 6px;
}
.vcard-img{
	display: flex;
	flex: 1;
	position: relative;
}
.vcard-img-bx{
	flex: 1;
	opacity: .7;
	display: flex;
	border-radius: 10px
}
.vcard-play{
	position: absolute;
	top: 40%;
	left: 43%;
}
.vcard-info{
	display: flex;
	align-items: center;
	color: #f6f6f6;
	margin-top: 6px;
}
.vcard-info-text{
	color: #c9c9c9;
	font-size: 12px;
}
.tspace{
	padding: 0px 6px;
}
</style>