<template>
<div class="center" :class="{'upload-image-box': isUnshift}">
  <uploader class="chat__upload"
    :max="varmax"
    :images="images"
    :show-header="false"
    :readonly="false"
    :upload-url="uploadUrl"
    :auto-upload="false"
    :handle-click="false"
    size="normal"
    :add-btn-class="classname"
    :has-list-class="hasclass"
    :show-del="isShowDelBtn"
    :listMaxView = "listMaxView"
    :compress= "compressData"
    ref="uploadImg"
    @preview="previewMethod"
    @upload-image="uploadImage"
  ></uploader>

  <div v-transfer-dom>
    <previewer :list="previewList" ref="previewer" ></previewer>
  </div>

  <loading v-model="showLoading" :text="loadText"></loading>
</div>
</template>

<script>
import Uploader from 'vux-uploader'
import api from '@/service/index'
import { Loading, Previewer, TransferDom  } from 'vux'
export default {
  props: ['token','classname', 'isShowDelBtn', 'isPreview', 'uploadType','isUnshift','listMaxView', 'hasclass','chatPage', 'compress'],
  directives: {
    TransferDom
  },
  components: {
    Uploader,
    Loading, 
    Previewer
  },
  data() {
    return {
      images:[],
      varmax: 100,
      title: '上传图片',
      autoUpload:  false,
      uploadUrl: '',
      showLoading: false,
      loadText: 'loading',
      compressData: '',
      previewList: []
    }
  },
  created() {
    this.compressData = JSON.stringify(this.compress) 
  },
  methods: {
    previewMethod: function(index, image) {
      if(this.isPreview) {
        this.$refs.previewer.show(index)
      }
    },
    uploadImage: function(formData) {
      this.showLoading = true;
      if(this.chatPage){
        this.loadText = '需要等对方回复后才能发送图片。';
        setTimeout(()=>{
          this.showLoading = false;
        },2500)
        return;
      }
      this.loadText = '上传中...'
      // return false
      api.upload(formData, this.uploadType).then( res => {        
        if(res.data.code === 0) {
          this.showLoading = false
          this.$refs.uploadImg.value = ''
          const img = res.data.data
          if(this.isUnshift) {
            window.location.href = '/'
            // this.images.unshift({url: img})
          } else {
            this.images.push({url: img})
          }

          // 要求 image 为 jpg或 jpge 格式
          this.previewList.push({src: img})

          // 加载完成，将事件传递到父组件
          this.$emit('uploaded-success', this.images);
        }
      })
    }
  }
};
</script>
 
<style lang="less">
@import '~vux/src/styles/weui/widget/weui-uploader/index.less';
.upload-avatar {
  border-radius: 50%;
}
.chat__upload.weui-cell {
 padding: 0px;
}
.chat-upload{
  // .weui-uploader__input-box{
    // width: 50px ;
    height: 50px !important;
    margin-top: 4px;
    float: left;
  // }
}
.upload-image-box {
  position: relative;
  z-index: 2;
}
.up-file {
  position: absolute;
  left: 5px;
  top: 0;
  z-index:  110;
}
</style>
