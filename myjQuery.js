/*!
 * my jQuery Demo v0.1.0
 *
 * Author: Zain King
 *
 * Released under the MIT license
 *
 * Introduce: 一个简单的仿制jQuery，实现了IE9+兼容下的$('selector').on(),$('selector').addClass(),$('selector').removeClass(),$('selector').toggleClass(),$('selector').text(),$('selector').html(),$('selector').find(),$('selector').end(),$('selector').css()方法和$.ajax()函数
 *
 * Date: 2017-12-26
 */
window.jQuery = function(selectorOrElements){
  var array = [];

  if (typeof selectorOrElements === 'string') {
    var elements = document.querySelectorAll(selectorOrElements);

    for (var i = 0; i < elements.length; i++) {
      array.push(elements[i]);
    }
  }else if (selectorOrElements instanceof Array) {
    for (var i = 0; i < selectorOrElements.length; i++) {
      array.push(selectorOrElements[i]);
    }
    array.previousSelection = selectorOrElements.previousSelection;
  }
  /* 封装on方法
   * @param {string}eventType 事件类型
   * @param {function}fn 事件触发时执行的回调函数
   */
  array.on = function (eventType, fn) {
    for (var i = 0; i < array.length; i++) {
      array[i].addEventListener(eventType, fn);
    }
    return array;
  }
  /* 封装addClass方法
   * @param {string}className html标签类名，如果没有此类名则增加此类
   */
  array.addClass = function (className) {
    for (var i = 0; i < array.length; i++) {
      array[i].classList.add(className);
    }
    return array;
  }
  /* 封装removeClass方法
   * @param {string}className html标签类名，如果有此类名则删除此类
   */
  array.removeClass = function (className) {
    for (var i=0; i<array.length; i++) {
      array[i].classList.remove(className);
    }
    return array;
  }
  /* 封装toggleClass方法
   * @param {string}className html标签类名，如果有此类名则删除此类，如果没有此类型则增加此类
   */
  array.toggleClass = function (className) {
    for (var i=0; i<array.length; i++) {
      array[i].classList.toggle(className);
    }
    return array;
  }
  /* 封装text方法
   * @param {string}text text字符串，如果填写则会将所有匹配的元素内text重写，如果不填写会返回所有元素内文本节点内容
   */
  array.text = function (value) {
    if (value === undefined) {
      var result = [];
      for (var i = 0; i < array.length; i++) {
        result.push(array[i].textContent);
      }
      if (result.length === 1) {
        return result[0];
      }
      return result
    } else {
      for (var i = 0; i < array.length; i++) {
        array[i].textContent = value;
      }
      return array;
    }

  }
  /* 封装html方法
   * @param {string}htmlString html字符串，如果填写则会将所有匹配的元素内html重写，如果不填写会返回所有元素内html
   */
  array.html = function (htmlString) {
    if (htmlString === undefined) {
      var result = [];
      for(var i=0; i<array.length; i++){
        result.push(array[i].innerHTML);
      }
      if(result.length === 1){
        return result[0];
      }
      return result;
    } else {
      for (var i=0; i<array.length; i++) {
        array[i].innerHTML = htmlString;
      }
      return array;
    }
  }
  /* 封装find方法
   * @param {string}selector 选择器字符串，用于寻找这个选择器对象内符合规则的字符串
   */
  array.find = function (selector) {
    var array2 = []
    for (var i = 0; i<array.length; i++) {
      var elements = array[i].querySelectorAll(selector);
      for (var j = 0; j<elements.length; j++) {
        array2.push(elements[j]);
      }
    }
    array2.previousSelection = array;
    var _array = jQuery(array2);
    return _array;
  }
  /* 封装end方法 获取用于获取本元素的元素*/
  array.end = function () {
    return array.previousSelection;
  }
  /* 封装css方法
   * @param {string}ruleName css属性名，支持中横线写法和驼峰写法
   * @param {string}value css属性的值，如果不填则返回计算属性
   */
  array.css = function (ruleName, value) {
    if (value === undefined) {
      var result = [];
      for(var i = 0;i < array.length;i++){
        result.push(getComputedStyle(array[i])[ruleName]);
      }
      if(result.length === 1){
        return result[0];
      }
      return result;
    } else {
      var str = getCamelCase(ruleName);
      for (var i = 0;i < array.length;i++){
        array[i].style[str] = value;
      }
    }
    return array;
  }

  //工具方法，转换中横线写法为驼峰式
  function getCamelCase(str) {
      return str.replace( /-([a-z])/g, function( all, i ){
          return i.toUpperCase();
      } )
  }

  return array;
}
/* 封装ajax函数
 * @param {string}opt.type http连接的方式，包括POST和GET两种方式
 * @param {string}opt.url 发送请求的url
 * @param {boolean}opt.async 是否为异步请求，true为异步的，false为同步的
 * @param {object}opt.data 发送的参数，格式为对象类型
 * @param {function}opt.success ajax发送并接收成功调用的回调函数
 */
jQuery.ajax = function (opt) {
    opt = opt || {};

    opt.method = (opt.method==null?"GET":opt.method.toUpperCase());
    opt.url = opt.url || '';
    opt.async = opt.async || true;
    opt.data = opt.data || null;
    opt.success = opt.success || function () {};

    var xmlHttp = null;
    if (XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
    else {
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }var params = [];
    for (var key in opt.data){
        params.push(key + '=' + opt.data[key]);
    }
    var postData = params.join('&');
    if (opt.method.toUpperCase() === 'POST') {
        xmlHttp.open(opt.method, opt.url, opt.async);
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xmlHttp.send(postData);
    }
    else if (opt.method.toUpperCase() === 'GET') {
        xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
        xmlHttp.send(null);
    }
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            opt.success(xmlHttp.responseText);
        }
    };
}
window.$ = window.jQuery;
