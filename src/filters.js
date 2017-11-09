import { Config } from '@/service/config'
// console.log(`${Config.imageAssetsRoot}`)
// vue filter
const picOriginPath = `${Config.imageAssetsRoot}/static/pics/weather-icon`
// 举例 时间格式化
exports.time = timestamp => {
  return new Date(timestamp).toLocaleTimeString()
}

// 后面直接添加类似方法


/**
 * json => array
 * @param jsonstring {object}
 * @return array {Array}
 */

exports.jsonFormat = obj => {
  return JSON.parse(obj);;
}

/**
 * index  filters
 * @param index {int}
 * @return A-Z {string}
 */
exports.filterIndex = index => {
  const codeIndex = ['A', 'B', 'C', 'D']
  return codeIndex[index];
}


/**
 * 
 */
exports.filterOption = obj => {
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
 * get string to array string
 * @param array {obj}
 * @return string {string}
 */
exports.string2Array = string => {
  return string.split('[')[1].split(']')[0]
}

/**
 *  转变成行内样式
 * @param image url {string}
 * @return stylesheet {string}
 */
exports.style = img => {
  if (!img) return
  return `backgroundImage: url(${img})`
}

/**
 * 将数组转化成想要的 格式
 * @param array {array} 
 * @return json obj
 */
exports.filterPhotoList = josnData => {
  if (josnData.length < 0) return
  const mapped = josnData.map(function (key) {
    return {
      src: `${key.url}`,
      id: `${key.id}`
    }
  });
  return mapped;
}

/**
 *  天气图标
 */

exports.weatherPic = code => {
  if (!code) return
  return `${picOriginPath}/${code}.png`
}
/**
 * 天气格式
 */
exports.todayFormat = datastr => {
  if (!datastr) return
  return datastr.split(' ')[1];
}

/**
 * 城市替换
 */
exports.replaceCity = city => {
  if(!city) return
  return city.split('_')[1]
}

/**
 * replace birthday
 */
exports.replaceBirthday = birthday => {
  if(!birthday) return
  return birthday.split(' ')[0]
}

/**
 * format sex
 */
exports.formatSex = sex => {
  const idx = sex || 0
  const sexArr = ['女', '男']
  return sexArr[idx] 
}