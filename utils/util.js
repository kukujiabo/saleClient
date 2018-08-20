
function renderTime(date) {

  var arr = date.split(/[- : \/]/)
  var Year = parseInt(arr[0])
  var Month = parseInt(arr[1])
  var Day = parseInt(arr[2])
  var Hours = parseInt(arr[3])
  var Minutes = parseInt(arr[4])
  var Seconds = parseInt(arr[5])
  var CurrentDate = "";
  CurrentDate += Year + "-";
  if (Month >= 10) {
    CurrentDate += Month + "-";
  }
  else {
    CurrentDate += "0" + Month + "-";
  }
  if (Day >= 10) {
    CurrentDate += Day;
  }
  else {
    CurrentDate += "0" + Day;
  }
  if (Hours < 10) {
    Hours = "0" + Hours;
  }
  if (Minutes < 10) {
    Minutes = "0" + Minutes;
  }
  if (Seconds < 10) {
    Seconds = "0" + Seconds;
  }
  return CurrentDate + " " + Hours + ":" + Minutes + ":" + Seconds;

}

function renderPosTime(data) {

  var time_array = data.split('T')

  var time_two_array = time_array[1].split('.')

  return time_array[0] + ' ' + time_two_array[0]

}

function inArray(el, arr) {

  for (var i = 0; i < arr.length; i++) {

    if (el == arr[i]) {

      return i

    }

  }

  return -1

}

function arrayValuesMatch(arr1, arr2) {

  let compArr1 = [], compArr2 = []

  arr1.forEach(el => {

    compArr1.push(el)

  })

  arr2.forEach(el => {

    compArr2.push(el)

  })

  return compArr1.sort().toString() == compArr2.sort().toString()

}

function objKeySort(obj) {//排序的函数
  var newkey = Object.keys(obj).sort();
  　　//先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  var newObj = {};//创建一个新的对象，用于存放排好序的键值对
  for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
    newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newObj;//返回排好序的新对象
}

function randStr(length) {

  var chars = 'abscefghijklmnopqrstuvwxyz0123456789'

  var str = ''

  for (let i = 0; i < length; i++) {

    var index = Math.floor(Math.random() * 36)

    str += chars[index]

  }

  return str

}

module.exports = {
  renderTime: renderTime,
  renderPosTime: renderPosTime,
  inArray: inArray,
  arrayValuesMatch: arrayValuesMatch,
  objKeySort: objKeySort,
  randStr: randStr
}