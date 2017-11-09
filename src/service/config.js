/**
 *  全站 地址配置文件 (接口，图片路径等)
 * 
 */

const siteConfig = {
    production: {
        api: '/api',
        websocketApi: 'http://www.samehomeland.com/api/community_chat',
        assetsRoot: 'http://samehomeland.com',
        imageAssetsRoot: 'http://pic.samehomeland.com/'
    },
    development: {
        api: '/api',
        websocketApi: 'http://test.samehomeland.com/api/community_chat',
        assetsRoot: 'http://test.samehomeland.com',
        imageAssetsRoot: 'http://pic.test.samehomeland.com/'
    } 
}

// export const Config = PROCESS_ENV === "production" ? siteConfig.production : siteConfig.development;
// export const Config = (PROCESS_ENV === "production" &&  BUILD_ENV === "prod") ? siteConfig.production : siteConfig.development;

function getConf() {
    let conf;
    if(PROCESS_ENV === "production") {
        if(BUILD_ENV === "test") {
            conf = siteConfig.development
        } else {
            conf = siteConfig.production
        }
    } else {
        conf = siteConfig.development
    }  
    return conf      
}

export const Config = getConf()


export const Code = {
    SERVER_EXCEPTION: {
        code: -1,
        msg: '服务器繁忙'
    },
    WRONG_PARAM: {
        code: 1,
        msg: '参数错误'
    }, 
    NOT_LOGIN: {
        code: 2,
        msg: '未登录'
    },
    NO_AUTHORIZTION: {
        code: 3,
        msg: '未授权'
    },
    NEED_COMPLEMENT_INFO: {
        code: 4,
        msg: '未完善资料'
    },
    USER_BANNED: {
        code: 5,
        msg: '用户被禁用'
    },
    DUPLICATE_ADD_FRIEND: {
        code: 6,
        msg: '重复注册'
    }

}



