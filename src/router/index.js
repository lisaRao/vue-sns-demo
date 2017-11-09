import App from '../App'

// lisa
const Home = r => require.ensure([], () => r(require('@/components/home/Index')), 'Home')
const Login = r => require.ensure([], () => r(require('@/components/profile/Login')), 'Login')
const Register = r => require.ensure([], () => r(require('@/components/profile/Register')), 'Register')
const RegisterNext = r => require.ensure([], () => r(require('@/components/profile/RegisterNext')), 'RegisterNext')
const ForgetPwd = r => require.ensure([], () => r(require('@/components/profile/ForgetPwd')), 'ForgetPwd')
const User = r => require.ensure([], () => r(require('@/components/user/Info')), 'User')
const UserInfo = r => require.ensure([], () => r(require('@/components/user/UserInfo')), 'UserInfo')
const TodayNotAnswer = r => require.ensure([], () => r(require('@/components/question/TodayNotAnswer')), 'TodayNotAnswer')
const HistoryQuestion = r => require.ensure([], () => r(require('@/components/question/HistoryQuestion')), 'HistoryQuestion')
const Weather = r => require.ensure([], () => r(require('@/components/weather/Weather')), 'Weather')
const TheWeekLuck = r => require.ensure([], () => r(require('@/components/horoscope/TheWeekLuck')), 'TheWeekLuck')
const TodayLuck = r => require.ensure([], () => r(require('@/components/horoscope/TodayLuck')), 'TodayLuck')
const TomorrowLuck = r => require.ensure([], () => r(require('@/components/horoscope/TomorrowLuck')), 'TomorrowLuck')
const UpdateInfo = r => require.ensure([], () => r(require('@/components/user/UpdateInfo')), 'UpdateInfo')
const Agreement = r => require.ensure([], () => r(require('@/components/user/Agreement')), 'Agreement')
const UserTagList = r => require.ensure([], () => r(require('@/components/user/UserTagList')), 'UserTagList')

//
const Message = r => require.ensure([], () => r(require('@/components/profile/Message')), 'Message')
const SystemMessage = r => require.ensure([], () => r(require('@/components/profile/system')), 'SystemMessage')
const Contacts = r => require.ensure([], () => r(require('@/components/profile/Contacts')), 'Contacts')
const Chat = r => require.ensure([], () => r(require('@/components/profile/Chat')), 'Chat')
// appxu
const Search = r => require.ensure([], () => r(require('@/components/search/search')), 'Search')
const SearchPost = r => require.ensure([], () => r(require('@/components/search/search_post')), 'SearchPost')
const PostList = r => require.ensure([], () => r(require('@/components/post/post_list')), 'PostList')
const Detail = r => require.ensure([], () => r(require('@/components/post/detail')), 'Detail')
const Addpost = r => require.ensure([], () => r(require('@/components/post/addpost')), 'Addpost')
const JoinList = r => require.ensure([], () => r(require('@/components/post/joinlist')), 'JoinList')
const TagList = r => require.ensure([], () => r(require('@/components/profile/tag')), 'TagList')
const SearchInerest = r => require.ensure([], () => r(require('@/components/search/search_interest')), 'SearchInerest')
const ContactUs = r => require.ensure([], () => r(require('@/components/home/contactUs')), 'ContactUs')
const Reply = r => require.ensure([], () => r(require('@/components/post/reply')), 'Reply');
const SearchUser = r => require.ensure([], () => r(require('@/components/search/search_user')), 'SearchUser')
const InterestList = r => require.ensure([], () => r(require('@/components/search/interest_list')), 'InterestList')
const SendRely = r => require.ensure([], () => r(require('@/components/post/send_rely')), 'SendRely')


// const Sockjs = r => require.ensure([], () => r(require('@/assets/libs/sockjs.min.js')), 'Sockjs')

const Upload = r => require.ensure([], () => r(require('@/components/common/UploadImage')), 'Upload')
const EditBox = r => require.ensure([], () => r(require('@/components/common/EditBox')), 'EditBox')

export default [{
  path: '/',
  component: App,
  children: [
    {
      path: '',
      name: 'Index',
      component: User,
      meta: {
        keepAlive: true,
        title: '首页',
        auth: true
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        keepAlive: true,
        title: ' 家'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        keepAlive: true,
        title: '登录',
        auth: false
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        keepAlive: true,
        title: '注册',
        auth: false
      }
    },
    {
      path: '/registernext',
      name: 'RegisterNext',
      component: RegisterNext,
      meta: {
        keepAlive: true,
        title: '注册完善资料'
      }
    },
    {
      path: '/forget',
      name: 'ForgetPwd',
      component: ForgetPwd,
      meta: {
        keepAlive: true,
        title: '忘记密码',
        auth: false
      }
    },
    {
      path: '/user/:uid',
      name: 'userinfo',
      component: UserInfo,
      meta: {
        keepAlive: true,
        title: '个人主页'
      }
    },
    {
      path: '/usertags/:uid',
      name: 'usertags',
      component: UserTagList,
      meta: {
        keepAlive: false,
        title: '标签页'
      }
    },
    {
      path: '/updateinfo',
      name: 'UpdateInfo',
      component: UpdateInfo,
      meta: {
        keepAlive: true,
        title: '修改资料'
      }
    },
    {
      path: '/question',
      name: 'Question',
      component: TodayNotAnswer,
      meta: {
        keepAlive: true,
        title: '今日答题'
      }
    },
    {
      path: '/hquestion/:uid',
      name: 'Hquestion',
      component: HistoryQuestion,
      meta: {
        keepAlive: false,
        title: '历史答题'
      }
    },
    {
      path: '/weather',
      name: 'Weather',
      component: Weather,
      meta: {
        keepAlive: true,
        title: '天气'
      }
    },
    {
      path: '/weekluck',
      name: 'TheWeekLuck',
      component: TheWeekLuck,
      meta: {
        keepAlive: true,
        title: '本周运势'
      }
    },
    {
      path: '/todayluck',
      name: 'TodayLuck',
      component: TodayLuck,
      meta: {
        keepAlive: true,
        title: ' 今日运势'
      }
    },
    {
      path: '/tomorrowluck',
      name: 'TomorrowLuck',
      component: TomorrowLuck,
      meta: {
        keepAlive: true,
        title: '明日运势'
      }
    },
    // appxu
    {
      path: '/search',
      name: 'Search',
      component: Search,
      meta: {
        keepAlive: false,
        title: '搜索',
        type: 'default'
      }
    },
    {
      path: '/searchUser',
      name: 'searchUser',
      component: SearchUser,
      meta: {
        keepAlive: true,
        title: '精确搜索',
        type: 'default'
      }
    },
    {
      path: '/postList/:postType',
      name: 'postList',
      component: PostList,
      meta: {
        keepAlive: true,
        title: '帖子列表'
      }
    },
    {
      path: '/joinList',
      name: 'JoinList',
      component: JoinList,
      meta: {
        keepAlive: true,
        title: '用户参与列表'
      }
    }, {
      path: '/detail',
      name: 'detail',
      component: Detail,
      meta: {
        keepAlive: true,
        title: '帐子详情'
      }
    },
  {
      path: '/tagList',
      name: 'tagList',
      component: TagList,
      meta: {
        keepAlive: true,
        title: '添加标签'
      }
    },
    {
      path: '/addpost',
      name: 'addpost',
      component: Addpost,
      meta: {
        keepAlive: true,
        title: '发帖'
      }
    }, {
      path: '/searchPost',
      name: 'searchPost',
      component: SearchPost,
      meta: {
        keepAlive: true,
        title: '兴趣论坛'
      }
    }, {
      path: '/searchInerest',
      name: 'searchInerest',
      component: SearchInerest,
      meta: {
        keepAlive: true,
        title: '兴趣推荐'
      }
    },{
      path: '/reply',
      name: 'reply',
      component: Reply,
      meta: {
        keepAlive: true,
        title: '收到的通知'
      }
    },{
      path: '/interestList',
      name: 'interestList',
      component: InterestList,
      meta: {
        keepAlive: false,
        title: '兴趣推荐'
      }
    },
    {
      path: '/sendRely',
      name: 'sendRely',
      component: SendRely,
      meta: {
        keepAlive: false,
        title: '发表评论'
      }
    },

    // watermelon
    {
      path: '/message',
      name: 'Message',
      component: Message,
      meta: {
        keepAlive: true,
        title: '消息'
      }
    },
    {
      path: '/systemmessage',
      name: 'SystemMessage',
      component: SystemMessage,
      meta: {
        keepAlive: true,
        title: '系统消息'
      }
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: Contacts,
      meta: {
        keepAlive: true,
        title: '通讯录'
      }
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat,
      meta: {
        keepAlive: true,
        title: '聊天'
      }
    },
    // other
    {
      path: '/upload',
      name: 'upload',
      component: Upload,
      meta: {
        keepAlive: true,
        title: '上传',
        auth: false
      }
    },
    {
      path: '/agreement',
      name: 'agreement',
      component: Agreement,
      meta: {
        keepAlive: true,
        title: ' 协议',
        auth: false
      }
    },
     {
      path: '/contactUs',
      name: 'contactUs',
      component: ContactUs,
      meta: {
        keepAlive: true,
        title: '联系我们',
        auth: false
      }
    },
    {
      path: '/edit',
      name: 'EditBox',
      component: EditBox,
      meta: {
        title: ' 编辑器',
        auth: true,
        keepAlive: false
      }
    },
    {
      path: '*',
      redirect: '/login'
    },

  ]
}]
