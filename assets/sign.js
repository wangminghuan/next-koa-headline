const md5 = require('md5');
Date.prototype.format = function (n) {
  var t = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds()
  };
  /(y+)/.test(n) && (n = n.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)));
  for (var r in t) {
    var e = t[r];
    new RegExp("(" + r + ")").test(n) && (n = n.replace(RegExp.$1, 1 == RegExp.$1.length ? e : ("00" + e)
      .substr(("" + e).length)))
  }
  return n
}
const encodeParams=(url,obj)=>{
  var _key='Jck3Dy3CjkZUji6MhPnRU1i8LKfPnHAl'
  var _data = {
    ...obj,
    u_id: 1,
    ver:"1.3.6",
    app_id: "zc_pc_admin",
    api_version: "1.0.0",
    request_sign: "c5da3ebf9fba-dba97572ef64",
    request_date: (new Date).format("yyyy-MM-dd hh:mm:ss"),
  };
  const arr=[];
  for (var key in _data){
    arr.push(key + "=" + _data[key]);
  }
   _data.sign=md5('service.inswindows.com'+url+"?"+arr.sort().join("&")+_key)
  return _data
}

export default encodeParams