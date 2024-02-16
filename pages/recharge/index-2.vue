<template>
	<view>
    </view>
</template>
<script>
var _self;
export default {
	data() {
		return {
			status: 0, 
		}
	},
	onLoad() {
		_self = this;
	},
	onHide(e) {
		_self.status = 1;
	},
	onShow() {
		if(_self.status == 1){
			uni.switchTab({
			    url: '/pages/member/member',
				success: function(res) {
					_self.status = 0;
				}
			});
		}else{
			uni.navigateTo({
			    url: '/pages/recharge/recharge',
				success: function(res) {
					_self.status = 1;
				}
			});
		}
	},
};
</script>
