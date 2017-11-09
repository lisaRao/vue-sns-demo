import axios from "axios";
import qs from "qs";
import store from '@/store'
import { Code } from './config'
import {
  addCommentApi,
  addFriendApi,
  AddPicFileApi,
  addPostApi,
  addPostListApi,
  addUserTagApi,
  AnswerHistoryApi,
  AnswerQuestionApi,
  collectPostApi,
  deFriendApi,
  deletePicApi,
  FriendsCountApi,
  friendsInfoApi,
  FriendsListApi,
  getCollectListApi,
  GetCurrentCityApi,
  getMsgListApi,
  getPicTextAreaApi,
  getPostListApi,
  getPostRelyApi,
  getReadMsgListApi,
  GetUserApi,
  homePageApi,
  HoroscopeApi,
  likePostApi,
  likePostListApi,
  NoticeListApi,
  NoticeReadApi,
  participationListApi,
  participationPostApi,
  phoneExistApi,
  postDetailApi,
  ResetPasswordApi,
  searchRecommendApi,
  searchUserApi,
  SendMsgCodeApi,
  tagListApi,
  ThisWeekHoroscopeApi,
  TodayNotAnswerQuestionApi,
  updataMsgStateApi,
  UpdateProfileApi,
  UploadApi,
  UploadAvatarApi,
  UserLoginApi,
  UserRegisterApi,
  UserRegisterFullyApi,
  userTagListApi,
  ValidMsgCodeApi,
  WeatherApi,
  getSystemMessageApi,
  updataSystemMessageStateApi,
  userLogOutApi,
  getUnReadMsgCountApi, NoticeReadBatchApi
} from "./resource";

axios.defaults.timeout = 8000; // 设置请求超时 为 5s
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'; // 设置请求 header content-type
axios.defaults.withCredentials = true; //allow cros
axios.interceptors.response.use(function (response) {
  const statusCode = response.data.code
  // token 已过期，重定向到登录页面
  if ( statusCode === Code.NOT_LOGIN.code){
    store.commit('USER_DEL_TOKEN')
    store.commit('USER_INFO_DEL')
    window.location.href = '/login'
    return
  }
  if(statusCode === Code.NEED_COMPLEMENT_INFO.code) {
    window.location.href = '/registernext'
    return
  }
  return response
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})
export default {
  // 获取 ip 信息
  getIpInfo(data) {
    return axios.get(`${GetIpInfoApi}${data}`)
  },
  // 登录
  userLogin(data) {
    // qs.stringify == json.stringify  转为 string 传给 接口端
    return axios.post(UserLoginApi, qs.stringify(data))
  },
  // 注册
  userRegister(data) {
    return axios.post(UserRegisterApi, qs.stringify(data))
  },
  //  获取好友列表
  friendsList(data) {
    return axios.post(FriendsListApi, qs.stringify(data))
  },
  // 获取好友个数
  friendsCount(data) {
    return axios.post(FriendsCountApi, qs.stringify(data))
  },
  // 短信获取验证码
  sendMessageCode(data) {
    return axios.post(SendMsgCodeApi, qs.stringify(data))
  },
  // 验证验证码
  validMessageCode(data) {
    return axios.post(ValidMsgCodeApi, qs.stringify(data))
  },
  // 获取当前城市
  getCurrentCity(data) {
    return axios.post(GetCurrentCityApi, qs.stringify(data))
  },
  // 注册第二步骤
  userRegisterFully(data) {
    return axios.post(UserRegisterFullyApi, qs.stringify(data))
  },
  // 找回密码
  resetPassword(data) {
    return axios.post(ResetPasswordApi, qs.stringify(data))
  },
  // 获取用户信息
  getUser(data) {
    return axios.post(GetUserApi, qs.stringify(data))
  },
  // 今日答题
  todayNotAnswerQuestion(data) {
    return axios.post(TodayNotAnswerQuestionApi, qs.stringify(data))
  },
  // 答题
  answerQuestion(data) {
    return axios.post(AnswerQuestionApi, qs.stringify(data))
  },
  // 历史答题
  answerHistory(data) {
    return axios.post(AnswerHistoryApi, qs.stringify(data))
  },
  // 天气
  weather(data) {
    return axios.post(WeatherApi, qs.stringify(data))
  },
  // 星座
  horoscope(data) {
    return axios.post(HoroscopeApi, qs.stringify(data))
  },
  // 周星座运势
  thisWeekHoroscope(data) {
    return axios.post(ThisWeekHoroscopeApi, qs.stringify(data))
  },
  // 更新用户信息
  updateProfile(data) {
    return axios.post(UpdateProfileApi, qs.stringify(data))
  },
  // 上传图片特殊处理
  upload(formdata, type) {
    // axios.defaults.headers.post['Content-Type'] = 'multipart/form-data' // 设置请求 header content-type
    // 设定 不同类型 调用不同 function 0= 默认上传; 1= 用户上传头像; 2 = 用户上传图片
    const requestByType = [UploadApi, UploadAvatarApi, AddPicFileApi]
    const funcName = type ? requestByType[type] : requestByType[0]
    const instance = axios.create({
      timeout: 10000,
      headers: {'Content-Type': 'multipart/form-data'}
    });
    return instance.post(`${funcName}`, formdata)

  },
  // 通讯录列表
  friendsInfoLIst(data) {
    return axios.post(friendsInfoApi, qs.stringify(data))
  },
  // 删除好友
  deFriend(data) {
    return axios.post(deFriendApi, qs.stringify(data))
  },
  // 添加好友
  addFriend(data) {
    return axios.post(addFriendApi, qs.stringify(data))
  },
  // 添加好友
  getMsgList(data) {
    return axios.post(getMsgListApi, qs.stringify(data))
  },
  upDataState(data) {
    return axios.post(updataMsgStateApi, qs.stringify(data))
  },
  getReadMsgList(data) {
    return axios.post(getReadMsgListApi, qs.stringify(data))
  },
  // 获取主题
  tagList(data) {
    return axios.post(tagListApi, qs.stringify(data))
  },

  // 提交搜索帖子
  searchRecommend(data) {
    return axios.post(searchRecommendApi, qs.stringify(data))
  },
  // 提交搜索帖子
  searchUser(data) {
    console.log(searchUserApi)
    return axios.post(searchUserApi, qs.stringify(data))
  },
  // 获取帖子列表
  getPostList(data) {
    return axios.post(getPostListApi, qs.stringify(data))
  },
  //获取帖子详情
  getPostDetail(data) {
    return axios.post(postDetailApi, qs.stringify(data))
  },
  // 获取帖子评论
  getPostRely(data) {
    return axios.post(getPostRelyApi, qs.stringify(data))
  },
  // 评论帖子
  addComment(data) {
    return axios.post(addCommentApi, qs.stringify(data))
  },
  // 点赞
  likePost(data) {
    return axios.post(likePostApi, qs.stringify(data))
  },
  // 参与活动
  participationPost(data) {
    return axios.post(participationPostApi, qs.stringify(data))
  },
  // 发布帖子
  addPost(data) {
    return axios.post(addPostApi, qs.stringify(data))
  },
  // 发布帖子
  participationList(data) {
    return axios.post(participationListApi, qs.stringify(data))
  },
// 收藏的帖子
  getCollectList(data) {
    return axios.post(getCollectListApi, qs.stringify(data))
  },
  // 发布的帖子列表
  addPostList(data) {
    return axios.post(addPostListApi, qs.stringify(data))
  },
  // 点赞的帖子列表
  likePostList(data) {
    return axios.post(likePostListApi, qs.stringify(data))
  },
   // 参与的帖子列表
  collectPost(data) {
    return axios.post(collectPostApi, qs.stringify(data))
  },
  // 用户标签列表
  userTagList(data) {
    return axios.post(userTagListApi, qs.stringify(data))
  },
  // 添加用户标签
  addUserTag(data) {
    return axios.post(addUserTagApi, qs.stringify(data))
  },
  //  验证手机是否存在
  phoneExist(data) {
    return axios.post(phoneExistApi, qs.stringify(data))
  },
   //  获取home页面的下载 商店链接
  homePage(data) {
    return axios.post(homePageApi, qs.stringify(data))
  },
     //  获取home页面的下载 商店链接
  getPicTextArea(data) {
    return axios.post(getPicTextAreaApi, qs.stringify(data))
  },
  // 删除相册图片
  deletePic(data) {
    return axios.post(deletePicApi, qs.stringify(data))
  },

  //获取通知列表
   noticeList(data) {
    return axios.post(NoticeListApi, qs.stringify(data))
   },
  //设置为已读
  noticeRead(data) {
    return axios.post(NoticeReadApi, qs.stringify(data))
  },
  //设置为已读
  noticeReadBatch(data) {
    return axios.post(NoticeReadBatchApi, qs.stringify(data))
  },
  // 获取系统历史消息
  systemMessage(data) {
    return axios.post(getSystemMessageApi, qs.stringify(data))
  },
  // 更新系统消息状态
  upSystemMessage(data) {
    return axios.post(updataSystemMessageStateApi, qs.stringify(data))
  },
  // 退出登录
  userloginout( data) {
    return axios.post(userLogOutApi, qs.stringify(data))
  },
  // 获取未读消息条数
  UnReadMsgCount(data){
    return axios.post(getUnReadMsgCountApi, qs.stringify(data))
  }

}
