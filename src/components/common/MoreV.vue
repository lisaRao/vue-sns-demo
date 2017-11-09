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
    data() {
        return {
            loadingShow: true,
            text: '正在努力加载中...'
        }
    },
    mounted: function () {
    	    let scrollEle = document.getElementById('postIndex');
        scrollEle.addEventListener('scroll', this.handleScroll);
    },
  //   destroyed() {
  //   	let scrollEle = document.getElementById('postIndex');
		// scrollEle.removeEventListener('scroll', this.handleScroll);
  //   },
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

				case 'loading':
					this.text = '正在努力加载中...';
					this.loadingShow = true;
					break;
			}
		},
		handleScroll: function(e) {
			const scrollH = document.getElementById('postIndex').scrollHeight;
			const scrollY = document.getElementById('postIndex').scrollTop;
			const innerHeight = window.innerHeight;
			const moreHeight = 30;
			
			if(scrollH < scrollY + innerHeight + moreHeight) {
				// console.log(11222222222)
				this.$emit('load', this);
			}
		}
    }
}
</script>
<style lang="less" scoped>
.ispinner {
	.weui-loadmore {
		height: 50px;
	}
}
</style>
