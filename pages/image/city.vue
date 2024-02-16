<template>
	<view class="city-list">
		<view class="city-group" id="city_current">
			<text class="city-group-name">当前</text>
			<view class="cities">
				<view class="city" @click="clickCity(city)">
					<text>{{city}}</text>
				</view>
			</view>
		</view>
		<view class="city-group" id="city_hot">
			<text class="city-group-name">热门</text>
			<view class="cities">
				<view class="city" @click="clickCity('全国')">
					<text>全国</text>
				</view>
				<view class="city" @click="clickCity(city.name)" v-for="(city,index) in hotCities" :key="index">
					<text>{{city.name}}</text>
				</view>
			</view>
		</view>
		<view class="city-group" :id="`city_${group.name}`" :class="{notop:index > 0}" v-for="(group,index) in groups" :key="index">
			<text class="city-group-name">{{group.name}}</text>
			<view class="cities-list">
				<view class="city-item" @click="clickCity(city.name)" v-for="(city,i) in group.children" :key="i">
					<text>{{city.name}}</text>
				</view>
			</view>
		</view>
		<view class="city-choose">
			<view @click="scrollTo('current')" class="city-choose-item">
				<text>当前</text>
			</view>
			<view @click="scrollTo('hot')" class="city-choose-item">
				<text>热门</text>
			</view>
			<view @click="scrollTo(group.name)" class="city-choose-item"  v-for="(group,index) in groups" :key="index">
				<text>{{group.name}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import api from "@/common/api.js";
	export default {
		data() {
			return {
				cities: [],
				city: '全国'
			}
		},
		computed: {
			hotCities() {
				return this.cities.sort((a, b) => {
					return a.count < b.count ? 1 : -1;
				}).slice(0,7)
			},
			groups(){
				let groups = {}
				this.cities.forEach(n=>{
					if(groups[n.group])
					{
						groups[n.group].count++;
						groups[n.group].children.push(n)
					}else{
						groups[n.group] = {
							name: n.group,
							count: 1,
							children: [n]
						}
					}
				})
				let result = []
				for(let i in groups)
				{
					result.push(groups[i])
				}
				return result.sort((a,b) => {return a.name > b.name ? 1 : -1})
			}
		},
		onLoad(e) {
			this.city = e.city && e.city.length > 0 ? e.city : '全国'
			this.getCity()
		},
		methods: {
			scrollTo(name){
				uni.pageScrollTo({
					selector:`#city_${name}`,
					duration: 300
				})
			},
			clickCity(name)
			{
				uni.setStorageSync("image_city_" + api.appkey,name)
				setTimeout(()=>{
					uni.navigateBack()
				},300)
			},
			getCity() {
				uni.request({
					url: api.apiData.getAtlasCity,
					method: 'GET',
					success: (e) => {
						var r = e.data;
						if (r.Code == 200) {
							this.cities = r.Data;
							console.log(this.cities.sort((a, b) => {
								return a.count > b.count ? 1 : -1;
							}))
						} else {
							api.showToast(r.Msg, 2000);
						}
					},
					fail: () => {
						api.showToast("服务器连接失败，请检查网络是否正常", 3000);
					}
				});
			}
		}
	}
</script>

<style scoped>
	.city-list {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.city-group {
		margin-top: 10upx;
		display: flex;
		flex-direction: column;
		color: #FFF;
	}
	.city-group.notop{
		margin-top: 0;
	}

	.city-group-name {
		background-color: #3b3b3b;
		height: 70upx;
		line-height: 46upx;
		font-size: 15px;
		padding: 10upx 30upx;
		box-sizing: border-box;

	}

	.cities {
		width: 100%;
		display: flex;
		padding: 30upx 20upx 10upx;
		box-sizing: border-box;
		flex-direction: row;
		flex-wrap: wrap;
		padding-bottom: 0;
	}

	.city {
		width: 25%;
		height: 80upx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 10upx;
		box-sizing: border-box;
		margin-bottom: 20upx;
	}

	.city text {
		width: 100%;
		height: 80upx;
		background-color: #3b3b3b;
		border-radius: 14upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.cities-list {
		width: 100%;
		display: flex;
		box-sizing: border-box;
		flex-direction: column;
		padding-bottom: 0;
	}
	.city-item{
		width: 100%;
		height: 80upx;
		padding: 10upx 30upx;
		box-sizing: border-box;
		border-bottom: #333 1px solid;
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
	.city-item:last-child{
		border-bottom: 0;
	}
	
	.city-item:active{
		opacity: .75;
	}
	.city-choose{
		position: fixed;
		right: 20upx;
		top: 50%;
		margin-top: -30%;
		color: #d9d9ef;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	.city-choose-item{
		font-size: 14px;
		height: 60upx;
	}
</style>