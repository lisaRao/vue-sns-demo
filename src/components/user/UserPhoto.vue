<template>
    <div class="user_photo_box">
        <div class="photo-lists" :class="classname">
            <ul class="data-small-view">
                <li v-for="(item,index) in photolist" :key="item.id" class="photo" :style="item.url | style" @click="previewImage(index,item.url)"></li>
            </ul>
        </div>
        <v-upload v-if="hasUploadOpt" classname="upload-user-photo" hasclass="item-view" :token="token" :isShowDelBtn="false" :isPreview="true" uploadType="2" :isUnshift="true" :listMaxView="3" :compress="compress"></v-upload>
        <div v-transfer-dom>
            <previewer :list="previewPhoto | filterPhotoList" ref="previewer" @on-close="previewClose"></previewer>
        </div>
        <div v-transfer-dom v-show="isShowDeleteBtn">
            <div tabindex="-1" role="dialog" aria-hidden="true" class="preview-del-box" @click="deletePic">
                <p class="del-button">
                    <i slot="icon" class="tab-icon icon iconfont icon-delete"></i>
                </p>
            </div>
        </div>
        <div v-transfer-dom>
            <confirm v-model="showConfirm"  title=""  @on-confirm="onConfirm" @on-cancel="onCancel">
                <p style="text-align:center;">确定删除该图片？</p>
            </confirm>
        </div>
    </div>
</template>
<script>

import vUploadImg from '@/components/common/UploadImage'
import { Previewer, TransferDom, Confirm } from 'vux'
import api from '@/service/index'

export default {
    props: ['photolist', 'previewPhoto', 'token', 'hasUploadOpt', 'canDel', 'classname'],
    directives: {
        TransferDom
    },
    components: {
        Previewer,
        Confirm,
        'v-upload': vUploadImg
    },
    data() {
        return {
            previewList: [],
            isShowDeleteBtn: false,
            showConfirm: false,
            compress: {
                width: 800,
                quality: 0.7
            }
        }
    },
    methods: {
        previewImage: function (index, image) {
            this.$refs.previewer.show(index)
            if (this.canDel) this.isShowDeleteBtn = true
        },
        deletePic: function () {
            this.showConfirm = true
        },
        onConfirm: function() {
            const currentPicInfo = this.$refs.previewer.currentItem()
            const picId = currentPicInfo.id 
            this.showConfirm = false
            api.deletePic({
                token: this.token,
                picId: picId
            }).then(res => {
                if (res.data.code === 0) {
                    window.location.href = '/'
                }
            })           
        },
        onCancel: function() {
            console.log('onCancel')
        },
        previewClose: function () {
            this.isShowDeleteBtn = false
        }
    }
}
</script>
<style lang="less">
.user_photo_box {
    margin: 15px;
    position: relative;
    width: 100%;
    height: 79px;
    .flex {
        display: flex;
        align-items: center;
        align-content: center;
    }
    .photo {
        float: left;
        margin-right: 9px;
        margin-bottom: 9px;
        width: 79px;
        height: 79px;
        background: no-repeat center center;
        background-size: cover;
        &:last-child {
            margin-right: 0;
        }
        img {
            width: 100%;
            height: 100%;
        }
    }
    .photo-lists {
        position: absolute;
        left: 0;
        top: 0;
        width: 265px;
        height: 79px;
        z-index: 1;
    }
    .other-photolist {
        width: 100%;
        position: relative;
        height: auto;
    }
    .center {
        width: 100%;
    }
}


.preview-del-box {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
}

.icon-delete {
    color: #fff;
    font-size: 24px;
}
</style>


