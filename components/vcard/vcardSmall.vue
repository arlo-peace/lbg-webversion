<template>
	<view class="vcard-small" @click="goToDetails(item.id)">
		<view class="vcard-small-left">
			<text class="vcard-small-text">
                {{ item.title }}</text>
            </text>
			<view class="vcard-small-foot">
				<text class="vcard-info-text">{{ item.hint }}</text>
				<text class="vcard-info-text tspace">{{ item.views }}</text>
				<text class="vcard-info-text">{{ item.agos }}</text>
			</view>
		</view>
		<view class="vcard-small-img">
			<image class="vsmm" style="width: 100px; height: 100px;" :src="getImage(item.images, item.url)" mode="aspectFill"></image>
		</view>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	export default {
		name:"vcardSmall",
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
		}
	}
</script>

<style scoped>
.vcard-small{
	display: flex;
	flex: 1;
	flex-direction: row;
	padding: 16px 0;
}
.vcard-small-left{
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between
}
.vcard-small-text{
	color: #FFFFFF;
}
.vcard-small-foot{
	display: flex;
	align-items: center;
	color: #f6f6f6;
	margin-top: 6px;
}
.vcard-info-text{
	color: #c9c9c9;
	font-size: 12px;
}
.vcard-small-img{
	width: 100px;
	height: 100px;
	display: flex;
}
.vsmm{
	flex: 1;
	border-radius: 6px;
}
.tspace{
	padding: 0px 6px;
}
</style>