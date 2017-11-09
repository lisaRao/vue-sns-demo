<template>
  <div class="post_detail">
    <div class="top_header">
      <x-header class="header_bar" :left-options="{backText: ''}">
        <span v-text="'帖子详情'"></span>
        <x-button  style="top:-7px;"  v-if="postInfo.nickyName==name" mini slot="right" type="default" @click.native="gotoSendRely()">评论</x-button>
      </x-header>
    </div>
    <div class="post-detail-info" id="postIndex">
      <group class="post-title">
        <cell :title="postInfo.title" class="post-ui-title">
        </cell>
        <cell :title="postInfo.nickyName" type="ndroid-settings">
          <div class="details-font" solt="value">
            <span class="ui-color" @click="gotFouce"  v-if="postInfo.nickyName==name">评论</span>
            <span v-if="postInfo.nickyName!=name">评论</span>
            <span>{{postInfo.commentCount}}条</span>　
          </div>
          <div slot="inline-desc">
            <flexbox style="font-size:10px;postion:relative;bottom:0px;width:80%;">
              <flexbox-item :span="12">
                <span>{{postInfo.addDate}}</span>
              </flexbox-item>
            </flexbox>
          </div>
          <div slot="icon" class="avatar-box">
            <div class="ui-avatar" @click="gotoCent(postInfo.userId)" :style="postInfo.avatarUrl | style"> </div>
          </div>
        </cell>
        <div class="weui-media-box__desc post-dec">
          <div v-on:click="previewImage($event)"><p v-html="postInfo.content"></p></div>
          <div class="post-footer">
            <span @click="setZan(postInfo,1)">
              <x-icon type="ios-heart" size="15" class="zan" :class="{'icon-red':isZan}"></x-icon>{{postInfo.likeCount}}</span>
            <span @click="setZan(postInfo,-1)">
              <x-icon type="heart-broken" size="15" class="zan" :class="{'icon-red':isCai}"></x-icon>{{postInfo.dislikeCount}}</span>
            <span @click="collectPost"><x-icon type="star" size="15" class="icon-red zan"></x-icon></span>
            <span @click="joinAct(postInfo)" v-bind:class="{'none':postInfo.type==2}"
                  class="weui-cell__ft">{{postInfo.participation | parseJoin}}</span>
            <span @click="gotoJoinList" v-bind:class="{'none':postInfo.type==2}"
                  class="weui-cell__ft">参与人数{{postInfo.participationCount}}人</span>
          </div>
        </div>
      </group>
      <div class="ui-comment">
          <group v-for="(sub,i) in commentList" :key="sub.id">
            <cell :title="sub.nickyName" type="ndroid-settings">
              <div slot="inline-desc">
                <flexbox style="font-size:10px;postion:relative;bottom:0px;width:80%;">
                  <flexbox-item>
                    <span>{{sub.addDate}}</span>
                  </flexbox-item>
                </flexbox>
              </div>
              <div slot="icon" class="avatar-box">
                <div class="ui-avatar" @click="gotoCent(sub.id)" :style="sub.avatarUrl | style">
                </div>
              </div>
            </cell>
            <div class="weui-media-box__desc post-dec">
              <div v-if="sub.type == 0"><p v-text="sub.content"></p></div>
              <div v-else-if="sub.type == 1" v-on:click="previewCommentImage($event)">
                <img  :src="sub.content" :index="i" />
              </div>
              <div v-else v-on:click="previewCommentImage($event)">
                <p   v-html="sub.cotentText"></p>
              </div>
            </div>
          </group>
      </div>
      <v-more v-show="loading.show" v-on:load="getScrollData" ref="loadingMore"></v-more>
    </div>
    <div class="add-comment-box" v-if="name==postInfo.nickyName">
      <x-icon slot="right" type="ios-plus-outline" size="31"></x-icon>
      <div class="upload-comment-box"> </div>
      <input id="comment" v-model="inputValue" placeholder="评论">
      <div class="ui-btn-s ui-btn-primary" @click="sendRely(0)">发送</div>
      <div class="up-file">
        <v-upload v-on:uploaded-success="uploadedSuccess"
            ref="uploadChild"
            classname="comment-upload"
            :token="token"
            :isShowDelBtn="false"
            :isPreview="false"
            :chatPage="false"
            :compress="compressOption"
            uploadType="0"></v-upload>
      </div>
    </div>

    <div v-transfer-dom>
      <previewer :list="imgList" ref="previewer"></previewer>
    </div>
    <div v-transfer-dom>
      <previewer :list="commentImgList" ref="commentPreviewer"></previewer>
    </div>

    <toast v-model="toast" :type="toastType" is-show-mask :time="1000">{{tipsMsg}}</toast>
    <!-- <v-tabbar></v-tabbar> -->
  </div>
</template>
<script>
  import {
    XHeader,
    Group,
    Cell,
    XInput,
    XButton,
    Flexbox,
    FlexboxItem,
    Toast,
    TabItem, Previewer, TransferDom
  } from 'vux'
  import vUploadImg from '@/components/common/UploadImage'
  import vTabbar from '../common/Tabbar.vue';
  import api from '@/service/index';
  import vUserPhoto from '../user/UserPhoto'
  import {
    param
  } from '@/utils/libs';
  import {
    mapState
  } from 'vuex';
  import More from '@/components/common/MoreV'


  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Group,
      Cell,
      XInput,
      XButton,
      Flexbox,
      FlexboxItem,
      Toast,
      'v-tabbar': vTabbar,
      'v-more': More,
      'v-upload': vUploadImg,
      Previewer, 'v-userphoto': vUserPhoto
    },
    data() {
      return {
        showBack: true,
        rows: 13,
        isZan: false,
        isCai: false,
        // zanIcon: 'ios-heart-outline',
        detailParam: {
          postId: '',
          token: ''
        },
        replyParam: {
          page: 1,
          size: 10,
          postId: '',
          token: ''
        },
        windowHeight: '',
        postId: '',
        commentList: [],
        commentCount: 0,
        toast: false,
        tipsMsg: '',
        postInfo: [],
        pageIndex: 1,
        inputValue: '',
        inputImgValue: '',
        toastType: 'success',
        loading: {
          show: false
        },
        avatarUrl: '',
        name: '',
        scroll: true,
        pageCount: 1,
        imgList: [],
        commentImgList: [],
        compressOption: {
          quality: 0.6,
        }
      }
    },
    computed: mapState({
      token: state => state.token,
      user: state => state.user
    }),
    filters: {
      parseJoin: function (type) {
        if (type == true) {
          return '取消参与'
        }
        if (type == false) {
          return '立即参与'
        }

      }
    },
    deactivated(){
      this.commentList = [];
      this.postInfo=[];
      this.replyParam.page=1;
    },
    activated() {
      let self = this;
      self.$data.name = this.user.name;
      self.$data.avatarUrl = this.user.avatarUrl;
      self.$data.detailParam.token = this.token;
      this.detailParam.postId = this.$route.query.post;
      this.replyParam.postId = this.$route.query.post;
      this.postId = this.$route.query.post;
      self.$data.commentList = [];
      this.getPostDetail();
      this.getPostRely();

      this.replyParam.page = 1;

    },
    methods: {
      previewImage(event) {
        if (event.target.nodeName === 'IMG') {
          if (event.target.hasAttribute("index")) {
            this.$refs.previewer.show(event.target.getAttribute("index"))
          }
        }
      },
      previewCommentImage(event) {
        if (event.target.nodeName === 'IMG') {
          console.log(event.target)
          if (event.target.hasAttribute("index")) {
            this.$refs.commentPreviewer.show(event.target.getAttribute("index"))
          }
        }
      },
      gotoSendRely() {
        this.$router.push({
          name: 'sendRely',
          query: {
            post: this.postId
          }
        });
      },
      gotoJoinList() {
        this.$router.push({
          name: 'JoinList',
          query: {
            post: this.postId
          }
        });
      },
      gotoCent(userId) {
        if (userId != this.user.id) {
          this.$router.push({
            name: 'userinfo',
            params: {
              uid: userId
            }
          });
        } else {
          this.$router.push({
            name: 'Index'
          });
        }
      },
      uploadedSuccess: function (data) {
        if (data.length > 1) {
          this.toast = !this.toast;
          this.tipsMsg = '一次只能发送一张图片';
          this.toastType = 'warn';
        } else {
          const uploadImageUrl = data[0].url;
          this.inputImgValue = uploadImageUrl;
          this.sendRely(1);
        }
        this.$refs.uploadChild.images = [];
      },
      getPostDetail() {
        let self = this,
          data,
          detailParam = self.$data.detailParam;
        api.getPostDetail(detailParam).then(res => {
          if (res.data.code != 0) {
            self.$data.toast = !this.toast;
            self.$data.tipsMsg = '获取失败了';
            self.$data.toastType = 'warn';

          } else {
            data = res.data.data;

            self.isZan = data.like;
            self.isCai = data.dislike;

            self.$data.imgList = data.cotentImgs;
            self.$data.postInfo = {
              abbreviateTitle: data.abbreviateTitle,
              addDate: data.addDate,
              avatarUrl: data.avatarUrl,
              commentCount: data.commentCount,
              content: self.html_decode(data.cotentText),
              dislikeCount: data.dislikeCount,
              id: data.id,
              likeCount: data.likeCount,
              nickyName: data.nickyName,
              regionId: data.regionId,
              state: data.state,
              tagId: data.tagId,
              title: data.title,
              type: data.type,
              updateDate: data.updateDate,
              userId: data.userId,
              participation: data.participation,
              viewCount: data.viewCount,
              participationCount: data.participationCount
            };

          }
        })
      },
      html_decode(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&gt;/g, ">");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        s = s.replace(/<br>/g, "\n");
        return s;
      },
      getPostRely() {
        var self = this,
        replyParam;
        self.$data.replyParam.token = this.token;
        replyParam = self.$data.replyParam;

        api.getPostRely(replyParam).then(res => {
          if (res.data.code != 0) {
            self.$data.toast = !this.toast;
            self.$data.tipsMsg = '获取失败了';
            self.$data.toastType = 'warn';
          } else {
            this.scroll = true;
            self.$data.pageCount = Math.ceil(res.data.data.total / replyParam.size);
            if (res.data.data.records.length == 0) {
            } else {
              for (let i = 0; i < res.data.data.records.length; i++) {
                var comment =  res.data.data.records[i];
                if(comment.type == 0) {
                  self.$data.commentImgList.push({});
                }else if(comment.type == 1){
                  self.$data.commentImgList.push({"src":comment.content});
                }else{
                  if(comment.cotentImgs.length>0) {
                     console.log(comment.cotentImgs)
                    self.$data.commentImgList=self.$data.commentImgList.concat(comment.cotentImgs);
                  }else{
                    self.$data.commentImgList.push({});
                  }

                }
                self.$data.commentList.push(comment);
              }
            }
          }
        })
      },
      joinAct(data) {
        let self = this,
          type;
        type = data.participation ? -1 : 0;
        api.participationPost({
          type: type,
          postId: this.postId,
          token: this.token
        }).then(res => {
          console.log(res)
          if (res.data.code == 0) {
            self.$data.toast = !this.toast;
            self.$data.toastType = 'success';

            if (data.participation) {
              type = -1;
              self.$data.tipsMsg = '取消成功';
              this.postInfo.participationCount = this.postInfo.participationCount - 1;
            } else {
              type = 0;
              self.$data.tipsMsg = '参与成功';
              this.postInfo.participationCount = this.postInfo.participationCount + 1;
            }

            data.participation = !data.participation;
          } else if (res.data.code == -1) {

            self.$data.toast = !this.toast;
            self.$data.toastType = 'warn';
            self.$data.tipsMsg = res.data.msg;

          } else {
            self.$data.toast = !this.toast;
            self.$data.tipsMsg = res.data.msg;
            self.$data.toastType = 'text';
          }
        })
      },
      setZan(data, type) {
        let self = this,
          msg;
        api.likePost({
          type: type,
          postId: this.postId,
          token: this.token
        }).then(res => {
          self.$data.toast = !this.toast;

          if (res.data.code != 0) {

            if (res.data.code == 10 || res.data.code == 11) {
              msg = '取消成功'
              if (res.data.code == 10) {
                data.likeCount = res.data.data.like;
                data.dislikeCount = res.data.data.dislike;

                self.$data.isZan = false;
              }
              if (res.data.code == 11) {
                data.dislikeCount = res.data.data.dislike;
                data.likeCount = res.data.data.like;

                self.$data.isCai = false;
              }

            } else {
              msg = type == 1 ? '点赞失败' : '踩失败';
            }

            self.$data.tipsMsg = msg;
            self.$data.toastType = 'warn';

          } else {
            if (type == 1) {
              data.likeCount = res.data.data.like;
              data.dislikeCount = res.data.data.dislike;

              self.$data.tipsMsg = '成功点赞';
              self.$data.toastType = 'success';
              self.$data.isZan = true;
              self.$data.isCai = false;


            } else {
              data.dislikeCount = res.data.data.dislike;
              data.likeCount = res.data.data.like;

              self.$data.tipsMsg = '成功踩';
              self.$data.toastType = 'success';
              self.$data.isCai = true;
              self.$data.isZan = false;


            }
          }
        })
      },
      getMoreRely(num) {
        var self = this;
        self.$data.replyParam.page = num;
        self.getPostRely();
      },
      gotFouce() {
        let input = document.getElementById('comment');
        input.focus();
      },
      collectPost() {
        let self = this;
        api.collectPost({
          token: this.token,
          type: 1,
          postId: this.postId

        }).then(res => {
          if (res.data.code != 0 && res.data.code != -1) {
            self.$data.toast = !this.toast;
            self.$data.tipsMsg = '收藏失败';
            self.$data.toastType = 'warn';

          } else if (res.data.code == -1) {
            self.$data.toast = !this.toast;
            self.$data.tipsMsg = '你已经收藏了';
            self.$data.toastType = 'warn';
          } else {
            self.$data.toast = !this.toast;
            self.$data.tipsMsg = '收藏成功';
            self.$data.toastType = 'success';
          }
        })
      },
      sendRely(type) {
        let self = this,
          now = new Date(),
          time = this.parseDate(now),
          content = type == 0?self.$data.inputValue:self.$data.inputImgValue;
        if (type==0 && self.$data.inputValue == '' ) {
          self.$data.toast = !this.toast;
          self.$data.tipsMsg = '请输入内容';
          return;
        }
        api.addComment({
          postId: self.$data.postId,
          content: content,
          token: this.token,
          type: type,
        }).then(res => {
          if (res.data.code != 0 && res.data.code != -1) {
            self.$data.toast = !this.toast;
            self.$data.tipsMsg = '评论失败';

          }
          if (res.data.code == 0) {
            self.$data.toastType = 'success';
            self.$data.toast = !this.toast;
            self.$data.tipsMsg = '评论成功';
            self.$data.commentList.push({
              nickyName: self.$data.name,
              avatarUrl: self.$data.avatarUrl,
              content: content,
              addDate: time,
              type:type
            })

            if(type == 1) {
              self.$data.commentImgList.push({"src":content});
            }else{
              self.$data.commentImgList.push({});
            }
            self.$data.inputValue = '';
            self.$data.postInfo.commentCount = self.$data.postInfo.commentCount + 1;

          }
        })
      },
      getScrollData() {
        if (this.scroll) {
          this.scroll = false;
          this.loading.show = true;
          if (this.replyParam.page < this.pageCount) {
            this.replyParam.page += 1;
            this.getPostRely();

          } else {
            this.$refs.loadingMore.loadingStatus('loaded')
          }
        }
      },
      parseDate(time) {
        let year, month, date, data, hour, minutes, seconds;
        year = time.getFullYear();
        month = time.getMonth()+1;
        date = time.getDate();
        hour = time.getHours();
        minutes = time.getMinutes();
        seconds = time.getSeconds();
        return year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + seconds;
      }

    }
  }
</script>
<style scoped>
  .up-file{
    top:10px;
  }

  .comment-upload {
    height: 30px !important;
    width: 30px !important;
  }
  .ui-color {
    color: #12B7F5;
  }

  .details-font {
    font-size: 0.8rem;
  }

  .avatar-box {
    width: 50px;
    height: 50px;
    margin-right: 0.5rem;
  }

  .ui-avatar {
    width: 50px;
    height: 50px;
    background: no-repeat center center;
    background-size: cover;
    position: absolute;
    border-radius: 50%;
    z-index: 1;
  }

  .header-icon {
    fill: #fff;
    position: relative;
    top: -3px;
    left: -3px;
    font-weight: 100;
  }

  .post-dec,
  ul.ui-rely-box {
    display: block;
    padding: 0 15px;
    color: #666;
    font-size: 0.75rem;
    line-height: 1.2rem;
  }

  .post-dec p {
    min-height: 100px;
    height: 100%;
    padding-bottom: 10px;
  }

  .post-footer {
    text-align: right;
    padding-bottom: 5px;
  }

  .post-footer span {
    padding-right: 10px;
  }

  .post-footer::afert {
    border-bottom: 1px solid #999;
  }

  .icon-red.zan {
    fill: #f26f20;
  }

  .post-title .weui-cells__title {
    color: #000;
    font-size: 0.9rem;
  }

  .post_detail .weui-cells {
    margin-top: 10px;
  }

  .weui-cells:after {
    border-bottom: 1px solid #ddd;
  }

  .post-detail-info {
    /*margin-bottom: 30px;*/
  }

  .post_detail {
    font-size: 0.75rem;
  }

  .post-detail-info {
    background-color: #f2f2f2;
  }

  .post-num span {
    display: inline-block;
    width: 25px;
    height: 25px;
    text-align: center;
    line-height: 25px;
    background-color: #fff;
    margin-bottom: 3px;
    border: 1px solid #ddd;
  }

  .post-num span.correct {
    background-color: #f26f20;
  }

  .post_detail .weui-cell__ft {
    font-size: 0.7rem;
    color: #12B7F5;
  }

  .ui-btn-s {
    padding-left: 5px;
    color: #f26f20;
    line-height: 30px;
  }

  .post_detail .ui-rely-box span {
    color: #12B7F5;
  }

  .post_detail .ui-rely-box {
    font-size: 0.75rem;
  }

  .post_detail .weui-cells__title {
    margin-top: 0px;
    padding-top: 0.77rem
  }

  .add-comment-box {
    position: absolute;
    z-index: 110;
    bottom: 0px;
    width: 100%;
    box-sizing: border-box;
    display: -webkit-box;
    padding: 9px 11px;
    background: #F1F2F4;
  }

  .add-comment-box input {
    border-radius: 6px;
    border: none;
    display: block;
    -webkit-box-flex: 1;
    font-size: 14px;
    padding-left: 10px;
    height: 30px;
  }

  .add-comment-box button {
    margin-left: 10px;
    color: #f26f20;
  }

  .post-ui-title {
    /*border-bottom: 1px solid #ddd;*/
    /*//margin-top: 10px;*/
    /*padding: 10px 10px 0 10px;*/
    font-weight: bold;
  }

  #postIndex {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: scroll;
  }
</style>
