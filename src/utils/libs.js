/**
/* 生日转换为星座
/* @param mon 月份
/* @param day 日份（1-31）
/* @return string 对应日期生日的星座字符串
**/
export function constellation(mon, day) {
  const s = "魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";

  const d = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];

  const i = mon * 2 - (day < d[mon - 1] ? 2 : 0);

  return s.substring(i, i + 2) + "座";
}

/**
 * 格式化日期
 * @param  date {string| object} 日期（可选)
 * @return dateform {string} yyyy-mm-dd  日期格式
 */

export function formatDate(date) {
  const d = date ? new Date(date) : new Date();
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  const dateInfo = {
    month: month,
    day: day,
    formatDate: [year, month, day].join('-')
  }
  return dateInfo;
}




/**
 * json => array
 * @param jsonstring {object}
 * @return array {Array}
 */
export function jsonToArray(obj) {
  const jsonParam = JSON.parse(obj);

  const mapped = Object.keys(jsonParam).map(function (key) {
    return {
      key: `${[key]}`,
      value: `${jsonParam[key]}`
    }
  });
  return mapped;
}

/**
 *  get url search
 * @param key {string} search key
 * @return value {string} search value
 */
export function urlGetValue(key) {
  return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}



export function param(key, url) {
  var match = (url || location.search).match(new RegExp('(\\?|&)' + key + '=([^&]*)'));

  if (match) {
    return decodeURIComponent(match[2]);
  } else {
    return null;
  }
};



/**
 * 手机输入框等 验证
 * @param val {string} 
 * @return true | false {boolean} 
 */
export function phoneNumber(val) {

}

/**
 * 密码 输入验证
 * @param value {string}
 * @return toast {boolean}
 */
export function validatePwd(value) {
  if (value) return
  let flag = true
  const passwordPattern = /^[a-zA-Z]\w{6,20}$/
  if (!passwordPattern.test(value)) {
    flag = false
  }
  return flag
}
