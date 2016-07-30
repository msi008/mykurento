/**
 * Created by msi008 on 2015/7/1.
 */
;Date.prototype.format = function(format)
{
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    };;
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length==1 ? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
};

Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
(function ($) {
    /**
     * loading
     */
    var Loading = function () {
        this.init();
    };;
    Loading.prototype = {
        init: function () {
            this.render();
        },
        render: function () {
            var arr = Array();
            arr.push('<div class="mask">');
            arr.push('<i class="loading"></i>');
            arr.push('</div>');
            $(document.body).append(arr.join(""));
            //$(".mask").length > 0 ? void(0) :  $(document.body).append(arr.join(""));
        },
        show: function () {
            $(".mask").show();
        },
        hide: function () {
            $(".mask").hide();
        }
    };;

    /**
     * 提示框
     * @param message
     * @param callback
     * @param caller
     * @constructor
     */
    var MessageBox = function (message, callback, caller) {
        this.message = message;
        this.callback = callback;
        this.caller = caller;
        if (!callback) {
            !!this.caller && this.error();
            //this.vibrate();
        }
        this.init();
        this.addEvents();
    };;

    MessageBox.prototype = {
        init: function () {
            this.render();
            this.tip = $("#messagebox");
            this.closed = this.tip.find('[data-type="tip_closed"]');
            this.action = this.tip.find('[action-type="accept_action"]');
            //this.tip.find('p').text(this.message);
        },
        render: function () {
            var messageText = "";
            for (var m in this.message) {
                messageText += "<p>" + this.message[m] + "</p>";
            }
            var arr = Array();
            arr.push('<div id="messagebox" style="display: none;">');
            arr.push('<div id="masker" class="masker" style="display:block;">');
            arr.push('</div>');

            arr.push('<div class="popover" style="display:block;position: fixed;top:35%;left:50%;width: 300px;margin-left: -150px;">');
            arr.push('<div class="popover-inner">');
            arr.push('<div class="message-box">');

            arr.push(messageText);
            arr.push('</div>');
            arr.push('</div>');
            arr.push('</div>');

            arr.push('</div>');
            $(document.body).append(arr.join(""));
        },

        addEvents: function () {
            var that = this;
            this.action.off("click").on("click", function () {
                that.hide();
                if (!!that.callback && Object.prototype.toString.call(that.callback) == '[object Function]') {
                    that.callback();
                }
            });

            this.closed.off('click').on('click', function () {
                that.hide();
                if (!!that.callback && Object.prototype.toString.call(that.callback) == '[object Function]') {
                    //that.callback();
                }
            });
            this.tip.off("click").on("click", function () {
                that.hide();
                if (!!that.callback && Object.prototype.toString.call(that.callback) == '[object Function]') {
                    //that.callback();
                }
            });
            if (!!this.caller) {
                this.caller.off("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend").on("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                    $(this).removeClass('shake');
                    that.show();
                });
            } else {
                this.show();
            }
        },
        vibrate: function () {
            if ((navigator.vibrate || navigator.webkitVibrate) && window.webkitNotifications) {
                if (window.webkitNotifications.checkPermission() != 0) {
                    window.webkitNotifications.requestPermission(function () {
                    });
                }
            } else {
                //提示浏览器不支持此api
            }

            if (navigator.vibrate) {
                navigator.vibrate(200);
            } else if (navigator.webkitVibrate) {
                navigator.webkitVibrate(200);
            }
        },
        error: function () {
            !!this.caller ? this.caller.addClass('shake') : void 0;
        },
        reset: function () {
            !!this.caller ? this.caller.removeClass('shake') : void 0;
            this.destroy();
        },
        destroy: function () {
            this.tip.remove();
            this.tip = null;
            this.closed = null;
            this.action = null;
            this.caller = null;
        },
        show: function () {
            this.tip.show();
        },
        hide: function () {
            this.tip.hide();
            this.reset();
        }
    };;


    var Share = function(){};;
    Share.prototype = {
        remove_sharetag : function(str){
            str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
            str = str.replace(/　/g,'');//去除中文空格
            str = str.replace(/(^\s*)|(\s*$)/g, "");
            str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
            str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
            str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
            return str;
        },
        // share begin
        mb_strcut : function(str, maxlength, dot) {
            var len = 0;
            var res = '';
            str = this.remove_sharetag(str);
            var dot = !dot ? '...' : '';
            if (typeof page_charset == 'undefined') {
                page_charset = document.characterset;
            }
            maxlength = maxlength - dot.length;
            for ( var i = 0; i < str.length; i++) {
                len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? (page_charset == 'utf-8' ? 3 : 2) : 1;
                if (len > maxlength) {
                    res += dot;
                    break;
                }
                res += str.substr(i, 1);
            }
            return res;
        },
        qqweibo : function(evt){
            var node = $(evt.target);
            var opt = this.getShareParam(node);
            var _title = '我正在tuturead阅读《'+opt.title+'》',_title = this.mb_strcut(_title+opt.summary,140),w=700,h=680;
            var _pic = !!opt.pic ? '&pic='+encodeURIComponent(opt.pic) :  '&pic='+encodeURIComponent(this.sitesharelogo);

            // var qqUrl = 'http://share.v.t.qq.com/index.php?c=share&a=index'
            //     +'&title='+encodeURIComponent(_title)+'&url='+encodeURIComponent(opt.url)
            //     +'&site='+encodeURIComponent('yasongju.tthuakan.com')
            //     +_pic;

            // this.opurl(qqUrl,'qqweibo',w,h);
        },
        sitesharelogo : 'http://www.tuturead.com/assets/img/logo-icon_75.png',
        tieba : function(opt){
            if (!!opt.summary){
                opt.summary = this.remove_sharetag(opt.summary);
            }
            var _title = '【'+opt.title+'】',_title = this.mb_strcut(_title+opt.summary,240),w=620,h=450;
            var _pic = !!opt.pic ? '&pic='+encodeURIComponent(TT_CONFIG.URL_CONSTANTS.RC_UPYUN_HTTP+opt.pic) : '&pic='+encodeURIComponent(this.sitesharelogo);
            var sinaUrl = 'http://tieba.baidu.com/f/commit/share/openShareApi?url='+encodeURIComponent(opt.url)
                +'&appkey='+TT_CONFIG.CONSTANTS.WEIBO_APPID
                +'&source=bshare'
                +'&retcode=0'
                +_pic
                +'&title='+encodeURIComponent(_title)+'(发表于:@孝礼APP)'
                +'&appkey=&ralateUid=&dpc=1&state=1';
            // console.log(opt,111);
            this.opurl(sinaUrl,'sinaweibo',w,h);
        },
        sinaweibo : function(opt){
            if (!!opt.summary){
                opt.summary = this.remove_sharetag(opt.summary);
            }
            var ptype = opt.ptype;
            var _title =  ptype == 1 ? '【'+opt.title+'】' : '我在【孝礼】发现了好礼物【'+opt.title+'】',w=620,h=450;
            var _pic = !!opt.pic ? '&pic='+encodeURIComponent(TT_CONFIG.URL_CONSTANTS.RC_UPYUN_HTTP+opt.pic) : '&pic='+encodeURIComponent(this.sitesharelogo);
            var sinaUrl = 'http://service.weibo.com/share/share.php?url='+encodeURIComponent(opt.url)
                +'&appkey='+TT_CONFIG.CONSTANTS.WEIBO_APPID
                +'&source=bshare'
                +'&retcode=0'
                +_pic
                +'&title='+encodeURIComponent(_title)+'(分享自 @孝礼APP)'
                +'&appkey=&ralateUid=&dpc=1&state=1';
            // console.log(opt,111);
            this.opurl(sinaUrl,'sinaweibo',w,h);
        },
        douban : function(evt) {
            var node = $(evt.target);
            var opt = this.getShareParam(node);
            var _title = '我正在tuturead阅读《'+opt.title+'》。',_title = this.mb_strcut(_title,140),
                s1=window.getSelection,s2=document.getSelection,
                s3=document.selection,s=s1?s1():s2?s2():s3?s3.createRange().text:'',
                w=450,h=330;
            var _pic = !!opt.pic ? '&image='+encodeURIComponent(opt.pic) :  '&image='+encodeURIComponent(this.sitesharelogo);
            var _summary = this.mb_strcut(opt.summary,240);
            var doubanUrl = 'http://www.douban.com/recommend/?url='+encodeURIComponent(opt.url)
                +'&title='+encodeURIComponent(_title)
                +'&sel='+encodeURIComponent(_summary)
                +_pic
                +'&v=1';
            // +'&name='+encodeURIComponent(_summary)//encodeURIComponent(this.mb_strcut(opt.summary,140))
            // +'&text='+encodeURIComponent(_summary)


            this.opurl(doubanUrl,'douban',w,h);
        },
        opurl : function(r,name,w,h){
            var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
            var android = ( navigator.userAgent.match(/(android)/g) ? true : false );//
            if (iOS || android){
                var link = document.createElement('a');
                link.setAttribute("href", r);
                link.setAttribute("target", "_blank");

                $(link).trigger("click");
                var dispatch = document.createEvent("HTMLEvents");
                dispatch.initEvent("click", true, true);
                link.dispatchEvent(dispatch);
            }
            else{
                var x=function(){if(!window.open(r,name,'toolbar=0,resizable=1,scrollbars=yes,status=1,width='+w+',height='+h+',left='+(screen.width-w)/2+',top='+(screen.height-h)/2))location.href=r+'&r=1'};
                if(/Firefox/.test(navigator.userAgent)){setTimeout(x,0)}else{x()}
            }
        },
        weixin : function(node,opt){//node,_url,_css,_logo
            var _opts = $.extend({}, {container:'#screen-content'}, opt);
            // var _opts = {container:'#screen-content',url:_url,laycss:_css,logo:_logo};
            node.weixinpanel(_opts);//
        },

        qq : function(opt){
            if (!!opt.summary){
                opt.summary = this.remove_sharetag(opt.summary);
            }
            //opt.url = "http://www.myxiaoli.com/h5/glload/e184d39";

            var ptype = opt.ptype, _title =  ptype == 0 ? '我在【孝礼】发现了好礼物【'+opt.title+'】' : opt.title,_desc = this.mb_strcut(opt.summary,240),w=820,h=450;
            var _pic = !!opt.pic ? '&pics='+encodeURIComponent(TT_CONFIG.URL_CONSTANTS.RC_UPYUN_HTTP+opt.pic) : '&pics='+encodeURIComponent(this.sitesharelogo);
            var qqUrl = 'http://connect.qq.com/widget/shareqq/index.html?url='+encodeURIComponent(opt.url)
                +'&title='+encodeURIComponent(_title)
                //+'&desc='+encodeURIComponent(_desc)
                +'&summary='+encodeURIComponent(_desc)
                +_pic;
             //console.log(qqUrl);
            this.opurl(qqUrl,'qq',w,h);
        },

        qzone : function(opt){
            if (!!opt.summary){
                opt.summary = this.remove_sharetag(opt.summary);
            }
            var ptype = opt.ptype, _title =  ptype == 1 ? '【'+opt.title+'】' : '我在【孝礼】发现了好礼物',_desc = this.mb_strcut(opt.summary,240),w=620,h=450;
            var _pic = !!opt.pic ? '&pics='+encodeURIComponent(TT_CONFIG.URL_CONSTANTS.RC_UPYUN_HTTP+opt.pic) : '&pics='+encodeURIComponent(this.sitesharelogo);
            var qzoneUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+encodeURIComponent(opt.url)
                +'&title='+encodeURIComponent(_title)
                +'&summary='+encodeURIComponent(ptype == 1 ? _desc : opt.title)
                +_pic;
            console.log(opt,111);
            this.opurl(qzoneUrl,'qzone',w,h);
        }
    };

    /**
     * 工具函数
     * @type {{replaceHtmlTag: Function, testNickName: Function, arrayDistinct: Function, _regMobile: Function}}
     */
    var Tool = {
        pageStar : function(){
            if(typeof NProgress != "undefined") NProgress.start();
        },

        pageEnd : function(){
            if(typeof NProgress != "undefined") NProgress.done();
        },
        networkStatus : function(){
            return navigator.onLine;
        },

        getCurrentTarget : function(){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            return $(e.target);
        },

        share : function(){
            return new Share();
        },

        checkUrl :function(url){
            //var regex =/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/i;
            var regex = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;
            if(regex.test(url)){
                return true;
            }
            return false;
        },

        checkPlus : function(n){
           var regex =  /^([1-9]\d*|\+?(\d*\.\d{1,2})|[0]{1,1})$/;
           return !!regex.test(n);
        },

        checklen: function () {
            var target = $(this);
            if (!!target) {
                var text = $.trim(target.val());
                target.next(".number").find("[data-number]").text(text.length);
            }
        },
        errorInfo: function (message, target, scrolling) {
            if (message && !!target) {
                target.siblings("p").text(message).closest("div").addClass("error");
                if (!!scrolling) {
                    var top = target.position().top;
                    $("html,body").animate({scrollTop: top});
                }
                target.addClass("shake");
                target.on("webkitAnimationEnd mozAnimationEnd animationEnd", function () {
                    target.removeClass("shake");
                });
            }
        },
        clearError: function (target) {
            if (!!target) {
                target.next("p").text("").closest("div").removeClass("error");
            }
        },
        messageBox: function (message, callback, caller) {
            new MessageBox(message, callback, caller);
        },
        loading: function () {
            return new Loading();
        },
        replaceHtmlTag: function (value) {
            if (typeof value === "undefined" || !value) return "";
            return value.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
        },
        testNickName: function () {
            var reg = /([\^_|~!@#$%&*()`=+:,.;?<>-]|[\s]\[|\]|\\|\——|\/|\'|\·|\~|\～|\"|\，|\。|\《|\》|\？|\；|\：|\’|\”|\！|\【|\】|\{|\｛|\｝|\}|\、|\＆|\……|\％|\￥|\＃|\＠|\×|\（|\）|\s)/ig;  //非法字符
            return !reg.test(name);
        },

        checkLdentity: function (card) {
            // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            return !!reg.test(card);
        },

        arrayDistinct: function () {
            var n = {}, r = []; //n为hash表，r为临时数组
            for (var i = 0; i < arr.length; i++) //遍历当前数组
            {
                if (!n[arr[i]]) //如果hash表中没有当前项
                {
                    n[arr[i]] = true; //存入hash表
                    r.push(arr[i]); //把当前数组的当前项push到临时数组里面
                }
            }
            return r;
        },

        regMobile: function (m) {
            var PATTERN_CHINAMOBILE = /^1(3[4-9]|5[012789]|8[23478])\d{8}$/,
                reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;

            if (reg.test(m)) {
                if (PATTERN_CHINAMOBILE.test(m)) {
                    return 3;
                } else {
                    return 1;
                }
            } else {//手机号不合法
                return 0;
            }
        },

        isMobile: function () {
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            var bIsMidp = sUserAgent.match(/midp/i) == "midp";
            var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            var bIsAndroid = sUserAgent.match(/android/i) == "android";
            var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
            if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
                return true;
            } else {
                return false;
            }
        },

        checkEmail: function (email) {
            var reg = /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/;
            return !!reg.test(email);
        },

        check_pwd: function (pwd) {
            var patrn = /^(\w){6,18}$/;
            if (!patrn.exec(pwd)) return false;;
            return true
        },

        check_card : function(value){
            var patrn=/^(\d){16,19}$/;
            if (!patrn.exec(value)) return false;;
            return true
        },
        check_captcha : function (captcha) {
            var reg = /^\d{6}$/;
            var re = new RegExp(reg);
            if (!re.test(captcha)) return false;
            return true;
        },

        wait : 60,
        t : null,
        countDown : function(el){
            if(Tool.wait == 0){
                el.removeClass("disabled");
                el.text('重新获取');
                Tool.wait = 60;
                clearTimeout(Tool.t);
            }else{
                el.addClass('disabled');
                el.text('重新获取('+Tool.wait+')');
                Tool.wait--;
                Tool.t = setTimeout(function(){
                    Tool.countDown(el);
                },1000);
            }
        },

        clearTime : function(el){
            el.removeClass("disabled");
            el.text('获取验证码');
            Tool.wait = 60;
            clearTimeout(Tool.t);
        },

        check_name: function (name) {
            //var reg = /([\^_|~!@#$%&*()`=+:,.;?<>-]|[\s]\[|\]|\\|\——|\/|\'|\·|\~|\～|\"|\，|\。|\《|\》|\？|\；|\：|\’|\”|\！|\【|\】|\{|\｛|\｝|\}|\、|\＆|\……|\％|\￥|\＃|\＠|\×|\（|\）|\s)/ig;  //非法字符
            var reg = /^([A-Za-z0-9-\u4e00-\u9fa5]|\·)+$/;
            return reg.test(name);
        },

        check_mobile: function (mobile) {
            var regu = /0?(13|14|15|18|17)[0-9]{9}/;
            var re = new RegExp(regu);
            if (!re.test(mobile)) {
                return false;
            }
            return true;
        },

        isWeiXin: function () {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        },

        validateIdCard: function (id, backInfo) {
            var info = {
                    y: "1900",
                    m: "01",
                    d: "01",
                    sex: "m",
                    valid: false,
                    length: 0
                },
                initDate = function (length) {
                    info.length = length;
                    var a = length === 15 ? 0 : 2,  // 15:18
                        temp;
                    info.y = (a ? "" : "19") + id.substring(6, 8 + a);
                    info.m = id.substring(8 + a, 10 + a);
                    info.d = id.substring(10 + a, 12 + a);
                    info.sex = id.substring(14, 15 + a) % 2 === 0 ? "f" : "m";
                    temp = new Date(info.y, info.m - 1, info.d);
                    return (temp.getFullYear() == info.y * 1)
                        && (temp.getMonth() + 1 == info.m * 1)
                        && (temp.getDate() == info.d * 1);
                },
                back = function () {
                    return backInfo ? info : info.valid;
                };
            if (typeof id !== "string") return back();
            // 18
            if (/^\d{17}[0-9x]$/i.test(id)) {
                if (!initDate(18)) return back();
                id = id.toLowerCase().split("");
                var wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
                    y = "10x98765432".split(""),
                    sum = 0;
                for (var i = 0; i < 17; i++) sum += wi[i] * id[i];
                if (y[sum % 11] === id.pop().toLowerCase()) info.valid = true;
                return back();
            }
            // 15
            else if (/^\d{15}$/.test(id)) {
                if (initDate(15)) info.valid = true;
                return back();
            }
            else {
                return back();
            }
        },

        strlen: function (str) {
            ///<summary>获得字符串实际长度，中文2，英文1</summary>
            ///<param name="str">要获得长度的字符串</param>
            var realLength = 0, len = str.length, charCode = -1;
            for (var i = 0; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128) realLength += 1;
                else realLength += 2;
            }
            return realLength;
        },

        ajax: function (a, d, c, e, b, f) {
            b = !!b ? b : "post";
            var Ajax = $.ajax({
                url: a,
                data: d,
                type: b,
                async:f,
                dataType: 'json'
            }).done(c).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                e.call();
                console.log("status:  " + XMLHttpRequest.status);
                console.log("readyState:  " + XMLHttpRequest.readyState);
                console.log("textStatus:  " + textStatus);
            });
            return Ajax;
        },

        fromUnixTimestamp: function (timestamp) {
            //default
            //console.log(new Date(timestamp*1).format("h:m"));
            if (timestamp == '') {
                return new Date("m月d日  H:i", timestamp);
            }
            var str = "", timestamp1 = timestamp;
            timestamp = Math.round(timestamp/1000);
            var now = Math.round(new Date().getTime()/1000);
            var micro = Math.ceil((now - timestamp));

            if (micro < 60) {
                str = '刚刚';
            }
            else if (micro < 3600) {
                str = (Math.round(micro / 60) <= 0 ? 1 : Math.round(micro / 60)) + '分钟前';
            }
            else if (micro < 86400) {
                var d = Math.floor(micro/86400);
                if(d < 1){
                    str = '今天 '+new Date(timestamp1*1).format("hh:mm");
                }
            }
            else {
                var d = Math.floor(micro/86400);
                if(d == 1){
                    str = '昨天 '+new Date(timestamp1*1).format("hh:mm");
                }else if(d == 2){
                    str = '前天 '+new Date(timestamp1*1).format("hh:mm");
                }else{
                    str = new Date(timestamp1*1).format("MM月dd日 hh:mm");
                }
            }
            return str;
        },

        convertIcon : function(icon){
            if(!!icon){
               return icon.indexOf("http://") > -1 ? icon : TT_CONFIG.URL_CONSTANTS.RC_UPYUN_HTTP+icon;
            }
            return icon;
        },

        getRandomString: function () {
            if (window.crypto && window.crypto.getRandomValues && -1 === navigator.userAgent.indexOf("Safari")) {
                for (var a = window.crypto.getRandomValues(new Uint32Array(3)), token = "", i = 0, l = a.length; l > i; i++) token += a[i].toString(36);
                return token
            }
            return (Math.random() * (new Date).getTime()).toString(36).replace(/\./g, "")
        }
    };

    var weixinpanel = function(element,options){
        this.$el = $(element);
        this.options = $.extend({}, $.fn.weixinpanel.defaults, options);
        this.initialized();
    };

    weixinpanel.prototype = {
        initialized : function(){
            this.setup();
            this.settings = {};
            $.extend(this.settings, TT);
            this.settings.delegateEvents(this);//继承events事件
        },
        events : {
            'click' : 'togglepop'
        },

        generate_random_id : function(prefix) {
            var string;
            string = prefix + this.generate_random_char() + this.generate_random_char() + this.generate_random_char();
            while ($("#" + string).length > 0) {
                string += this.generate_random_char();
            }
            return string;
        },
        generate_random_char : function() {
            var chars, newchar, rand;
            chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
            rand = Math.floor(Math.random() * chars.length);
            return newchar = chars.substring(rand, rand + 1);
        },

        setup : function(){
            var options = this.options;
            this.popid =  (this.options.container) ? this.generate_random_id('popwx-') : 'popwx-';

            var html = $('#popweixin').tmpl({'id':this.popid,'url':encodeURIComponent(this.options.url),'laycss':this.options.laycss,'logo':this.options.logo,'qrtitle':this.options.qrtitle,'isdownqr':this.options.isdownqr});
            $tip = $(html);
            this.placement = this.$el.attr('placement');

            if (typeof this.options.container == 'string'){
                this.options.container=$(this.options.container);
            }
            this.options.container ? $tip.appendTo(this.options.container) : $tip.appendTo(this.$el);
            //this.$el.html(html);

            this.$popwx = $('#'+this.popid);
            this.$masker = $('#masker');
            var zIndex = parseInt(this.$masker.filter(function() {
                    return $(this).css('z-index') != 'auto';
                }).first().css('z-index'))+50;
            // this.show();
            this.$popwx.delegate('[data-type="weixinclose"]', 'click', $.proxy(function(event) {
                this.hide();
            },this));
            this.$popwx.css({'z-index':zIndex});
        },
        togglepop : function() {
            if (!this.$popwx.hasClass('fade')){
                var _callback = this.options.showcallback,
                    _scope = this.options.showscope;
                if (TT.isFunction(_callback)) {
                    _callback.apply(_scope, arguments);
                }
                //_hmt.push(['_trackEvent', 'share', 'click', 'weixin']);
                this.show();
            }
            else{
                this.hide();
            }
        },
        show : function(){
            this.$popwx.show().addClass('fade in');
            this.$popwx.css({
                "top": "50%","left": "50%",
                "margin-top": function () {
                    return - ($(this).outerHeight() / 2);
                },
                'margin-left': function () {
                    return -($(this).outerWidth() / 2);
                }
            });
            setTimeout($.proxy(function(){
                $('html').off('click.weixin.data-api').on('click.weixin.data-api', $.proxy(function (e) {
                    if (!!e && ($(e.target).closest('[data-type="pop-weixin"]').length>0 || $(e.target).closest('[data-action="share-on-weixin"]').length>0)){
                        e.stopPropagation() ;
                    }
                    else{
                        this.hide();
                    }
                },this));
            },this),20);
        },
        hide : function(){
            $('html').off('click.weixin.data-api');
            this.$popwx.hide().removeClass('fade in');
        }
    };

    $.fn.weixinpanel = function (option) {

        return this.each(function(input_field) {

            var $this = $(this)
                , data = $this.data('weixinpanel')
                , options = typeof option == 'object' && option;
            if (!data) {
                $this.data('weixinpanel', (data = new weixinpanel(this, options)))
            }
            else if(typeof option == 'object' && option){
                data['show']();
            }
            if (typeof option == 'string') data[option]();
        });
    };
    $.fn.weixinpanel.defaults = {url:'',content:'',heading:'',laycss:'',logo:'',qrtitle:'分享到微信','isdownqr':false};


    $.fn.setCursorPosition = function(position){
        if(this.lengh == 0) return this;
        return $(this).setSelection(position, position);
    };;

    $.fn.setSelection = function(selectionStart, selectionEnd) {
        if(this.lengh == 0) return this;
        input = this[0];

        if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        } else if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
        }

        return this;
    };;

    $.fn.focusEnd = function(){
        this.setCursorPosition(this.val().length);
    };;

    window.Tool = Tool;
})(window.jQuery);
