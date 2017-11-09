<template>
    <section class="loading-panel flex">
        <div class="ispinner gray animating">
            <load-more :show-loading="loadingShow" :tip="text"></load-more>
        </div>
    </section>
</template>
<script>

import { LoadMore } from 'vux'
export default {
    components: {
        LoadMore
	},
	name: 'More',
    data() {
        return {
            loadingShow: true,
            text: '正在努力加载中...'
        }
    },
    mounted: function () {
		window.addEventListener('scroll', this.handleScroll)
    },
    destroyed() {
		window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
		loadingStatus: function (status) {
			switch(status) {
				case 'loaded':
					this.text = '全部加载完毕';
					this.loadingShow = false;
					break;
				case 'error':
					this.text = '服务器错误，请刷新重试';
					this.loadingShow = false;
					break;

				default:
					this.text = '正在努力加载中...';
					this.loadingShow = true;
					break;
			}
		},
		handleScroll: function() {			
			const scrollH = document.body.scrollHeight;
			const scrollY = window.scrollY;
			const innerHeight = window.innerHeight;
			const moreHeight = 30;
			if(scrollH < scrollY + innerHeight + moreHeight) {
				this.$emit('load', this);
			}
		}
    }
}
</script>
<style lang="less" scoped>

</style>
