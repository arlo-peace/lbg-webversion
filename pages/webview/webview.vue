<template>
    <view>
        <web-view :src="url" />
    </view>
</template>

<script>
    export default {
        data() {
            return {
                url: ''
            };
        },
        onLoad(options) {
            if (options.url) {
                this.url = decodeURIComponent(options.url);
            }
        }
    };
</script>
