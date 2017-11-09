import { Config } from './config'
const API_ROOT = Config.api

const apiCollect = {
  userLogin: '/login', // 手机登录
  userLogOut: '/logout', // 注销
  userRegister: '/user/registerBasic', // 注册
  friendsList: '/user/friends', // 获取好友列表
  friendsCount: '/user/friendsCount', // 好友个数
  sendMsgCode: '/util/sendMsgCode', // 获取验证码
  validMsgCode: '/util/validateMsgCode', // 验证 验证码是否正确
  userRegisterFully: '/user/registerFully', // 注册第二步骤
  getCurrentCity: '/util/getCurrentCity', // 获取当前城市
  resetPassword: '/user/resetPassword', // 找回密码
  getUser: '/userPage', // 获取用户信息
  upload: '/util/upload', // 上传图片
  friendsInfo: '/friendRel/getFriendsInfo', // 获取好友信息列表
  deFriendCode: '/friendRel/delFriend', // 删除好友
  addFriendCode: '/friendRel/addFriend', // 添加好友
  getMsgList: '/community/msg/getList', // 获取好友聊天列表
  updataMsgState: '/community/msg/updateStatus', // 更新聊天状态
  getReadMsgList: '/community/msg/getMsgHistory', // 获取历史聊天记录
  todayNotAnswerQuestion: '/question/todayNotAnswerQuestion',  // 今日答题
  answerQuestion: '/question/answerQuestion', // 答题
  answerHistory: '/question/answerHistory', // 历史答题
  tagList: '/tag/list', //获取主题
  getProvinces: '/util/getProvinces', // 获取省份
  getCities: '/util/getCities', // 获取城市
  searchRecommend: '/search/recommend', //兴趣推荐
  searchUser: '/search/user', //获取搜索的列表
  getPostList: '/post/list', //获取搜索的列表
  postDetail: '/post/detail', //获取帖子详情
  getPostRely: '/post/comment/list', //获取评论列表
  addComment: '/post/comment/add', //评论帖子
  likePost: '/postAction/like', //点赞
  participationPost: '/postAction/participation', //参与帖子
  addPost: '/post/add',
  participationList: '/community/participation/list', //参与的用户列表
  userRegisterFully: '/user/registerFully', // 注册第二步骤
  getCurrentCity: '/util/getCurrentCity', // 获取当前城市
  resetPassword: '/user/resetPassword', // 找回密码
  getUser: '/userPage', // 获取用户信息
  upload: '/util/upload', // 上传图片
  uploadAvatar: '/user/uploadAvatarURL', //用户上传头像，返回 url
  addPicFile: '/albumPic/addPicFile', // 用户上传图片
  weather: '/util/weather', // 天气
  horoscope: '/util/horoscope', // 星座
  thisWeekHoroscope: '/util/thisWeekHoroscope', // 周星座运势
  updateProfile: '/user/updateProfile', // 更新用户资料
  answerHistory: '/question/answerHistory', // 历史答题
  phoneExist: '/user/phoneExist',   // 验证手机是否存在
  deletePic: '/albumPic/deletePic',   // 删除图片


  getCollectList:'/postAction/attention/list',  // 收藏的帖子列表
  addPostList:'/postAction/add/list', // 发布的帖子列表
  likePostList:'/postAction/like/list', // 点赞的帖子列表
  collectPost:'/postAction/attention', // 点赞的帖子列表
  userTagList:'/userTag/list', // 用户标签
  addUserTag:'/userTag/add', // 添加用户标签
  homePage:'/homePage', // 获取下载，商店链接
  getPicTextArea:'/picTextArea/getPicTextArea', // 获取公告栏
  NoticeList:'/notice/list',//获取通知列表
  NoticeRead:'/notice/read',//设置为已读
  NoticeReadBatch:'/notice/read/batch',//设置为已读

  getSystemMessage: '/community/sysMsg/getList', // 获取历史消息
  updataSystemMessageState: '/community/sysMsg/updateSysStatus', // 更新历史消息状态

  getUnReadMsgCount: 'community/msg/getUnReadMsgCount' // 获取未读消息条数
}
export const UserLoginApi = API_ROOT.concat(apiCollect.userLogin);
export const userLogOutApi = API_ROOT.concat(apiCollect.userLogOut);
export const UserRegisterApi = API_ROOT.concat(apiCollect.userRegister);
export const FriendsListApi = API_ROOT.concat(apiCollect.friendsList);
export const FriendsCountApi = API_ROOT.concat(apiCollect.friendsCount);
export const SendMsgCodeApi = API_ROOT.concat(apiCollect.sendMsgCode);
export const ValidMsgCodeApi = API_ROOT.concat(apiCollect.validMsgCode);
export const tagListApi = API_ROOT.concat(apiCollect.tagList);
export const GetProvincesApi = API_ROOT.concat(apiCollect.getProvinces);
export const GetCitiesApi = API_ROOT.concat(apiCollect.getCities);
export const searchRecommendApi = API_ROOT.concat(apiCollect.searchRecommend);
export const searchUserApi = API_ROOT.concat(apiCollect.searchUser);
export const getPostListApi = API_ROOT.concat(apiCollect.getPostList);
export const postDetailApi = API_ROOT.concat(apiCollect.postDetail);
export const getPostRelyApi = API_ROOT.concat(apiCollect.getPostRely);
export const addCommentApi = API_ROOT.concat(apiCollect.addComment);
export const likePostApi = API_ROOT.concat(apiCollect.likePost);
export const participationPostApi = API_ROOT.concat(apiCollect.participationPost);
export const collectPostApi = API_ROOT.concat(apiCollect.collectPost);

export const GetCurrentCityApi = API_ROOT.concat(apiCollect.getCurrentCity);
export const UserRegisterFullyApi = API_ROOT.concat(apiCollect.userRegisterFully);
export const ResetPasswordApi = API_ROOT.concat(apiCollect.resetPassword);
export const GetUserApi = API_ROOT.concat(apiCollect.getUser);
export const TodayNotAnswerQuestionApi = API_ROOT.concat(apiCollect.todayNotAnswerQuestion);
export const AnswerQuestionApi = API_ROOT.concat(apiCollect.answerQuestion);
export const AnswerHistoryApi = API_ROOT.concat(apiCollect.answerHistory);
export const WeatherApi = API_ROOT.concat(apiCollect.weather);
export const HoroscopeApi = API_ROOT.concat(apiCollect.horoscope);
export const ThisWeekHoroscopeApi = API_ROOT.concat(apiCollect.thisWeekHoroscope);
export const UpdateProfileApi = API_ROOT.concat(apiCollect.updateProfile);

export const UploadApi = API_ROOT.concat(apiCollect.upload);
export const UploadAvatarApi = API_ROOT.concat(apiCollect.uploadAvatar);
export const AddPicFileApi = API_ROOT.concat(apiCollect.addPicFile);

export const friendsInfoApi = API_ROOT.concat(apiCollect.friendsInfo);
export const deFriendApi = API_ROOT.concat(apiCollect.deFriendCode);
export const addFriendApi = API_ROOT.concat(apiCollect.addFriendCode);
export const getMsgListApi = API_ROOT.concat(apiCollect.getMsgList);
export const updataMsgStateApi = API_ROOT.concat(apiCollect.updataMsgState);
export const getReadMsgListApi = API_ROOT.concat(apiCollect.getReadMsgList);

export const addPostApi = API_ROOT.concat(apiCollect.addPost);
export const participationListApi = API_ROOT.concat(apiCollect.participationList);
export const getCollectListApi=API_ROOT.concat(apiCollect.getCollectList);
export const addPostListApi=API_ROOT.concat(apiCollect.addPostList);
export const likePostListApi=API_ROOT.concat(apiCollect.likePostList);
export const userTagListApi=API_ROOT.concat(apiCollect.userTagList);
export const addUserTagApi=API_ROOT.concat(apiCollect.addUserTag);

export const homePageApi=API_ROOT.concat(apiCollect.homePage);
export const getPicTextAreaApi=API_ROOT.concat(apiCollect.getPicTextArea);

export const phoneExistApi = API_ROOT.concat(apiCollect.phoneExist);
export const deletePicApi = API_ROOT.concat(apiCollect.deletePic);
export const NoticeListApi = API_ROOT.concat(apiCollect.NoticeList);
export const NoticeReadApi = API_ROOT.concat(apiCollect.NoticeRead);
export const NoticeReadBatchApi = API_ROOT.concat(apiCollect.NoticeReadBatch);

export const getSystemMessageApi =  API_ROOT.concat(apiCollect.getSystemMessage);
export const updataSystemMessageStateApi =  API_ROOT.concat(apiCollect.updataSystemMessageState);

export const getUnReadMsgCountApi =  API_ROOT.concat(apiCollect.getUnReadMsgCount);

