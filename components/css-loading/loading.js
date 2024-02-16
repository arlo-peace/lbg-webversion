export default {
	methods: {
		_showLoading(text = null){
			this.$nextTick(()=>{
				this.$refs.cssLoading.open(text)
			})
		},
		_hideLoading(){
			this.$nextTick(()=>{
				this.$refs.cssLoading.close()
			})
		}
	}
}