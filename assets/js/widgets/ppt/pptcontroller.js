(function($) {
    var PptController = function(element,options){
        this.el = $(element);
        this.options = $.extend($.fn.pptController.defaults,options);
        this._init();//初始化
        this._addevents();//注册事件
        this._socket();//添加监听
    };

    PptController.prototype = {
        _init : function(){
            this.idx = this.options.idx;
            this.rid = this.options.rid;
            this.max_len = this.options.max_len || 1;
            this.ppt_container = this.options.ppt_container || Array();
            this.ppt_array = this.options.pptdata || Array();
            this.$left = this.el.find('[node-type="left"]');
            this.$right = this.el.find('[node-type="right"]');
            this.$currNumber = this.el.find('[node-type="ppt-curr-number"]');
            this.$sumNumber = this.el.find('[node-type="ppt-sum-number"]');
            this.$pptName = this.el.find('[node-type="ppt-name"]');
            this.setPptName();//PPTname
            var page = this.getStore();
            this.turnPage(page);
        },

        setPptName : function (){
            if(!!this.options.name){
                this.$pptName.text(this.options.name);
            }
        },

        getStore : function(){
            var page = 0;
            if(!!this.rid){
                //page = localStorage.getItem(this.rid);
                this.idx = page = !!page ? page*1 : 0;
            }
            return page;
        },

        _addevents : function(){
            this.$right.on("click", $.proxy(this.flipRight, this));
            this.$left.on("click", $.proxy(this.flipLeft, this));
            $(window).on("resize", $.proxy(this.resize, this));
        },

        reset : function(options){
            this.options = $.extend($.fn.pptController.defaults,options);
            this._init();//初始化
            //this._addevents();//注册事件
            //this._socket();//添加监听
            var page = this.getStore();
            this.turnPage(page);
        },

        resize : function(){
            this.pptrender(this.options.ppt_container[this.idx]);
        },

        flipRight : function(){
            var e = event || window.event;
            var target = $(e.target).closest('[node-type="right"]');
            this.next();
            if (target.attr('data-key')) {
                var message = '{"key":' + target.attr('data-key')
                    + ',"page":' + this.idx + '}';
                iosocket.send(message);
            }
        },

        flipLeft : function(){
            var e = event || window.event;
            var target = $(e.target).closest('[node-type="left"]');
            this.prev();
            if (target.attr('data-key')) {
                var message = '{"key":' + target.attr('data-key')
                    + ',"page":' + this.idx + '}';
                iosocket.send(message);
            }
        },

        turnAnimate : function(target,type){
            if(!!target){
                if(type == "next"){
                    target.addClass("fadeInRight");
                    target.on("webkitAnimationEnd animationEnd", function(){
                        target.removeClass("fadeInRight");
                    });
                }else if(type == "prev"){
                    target.addClass("fadeInLeft");
                    target.on("webkitAnimationEnd animationEnd", function(){
                        target.removeClass("fadeInLeft");
                    });
                }
            }
        },

        next : function(){
            var _this = this;
            if (this.idx < this.ppt_array.length - 1) {
                this.load2cache(1);
                //this.turnAnimate($("#ppt-box"), "next");
                this.$left.removeClass("disabled");
                if(!!this.rid){
                    var cuid = this.rid+"_"+this.idx;
                    $("#_canvas").attr("data-cuid", cuid);
                    $("#_canvas").trigger("load_ppt", cuid);
                }
                this.$currNumber.text(this.idx+1);
            }
            this.idx == this.ppt_array.length-1  && this.$right.addClass("disabled");
        },

        prev : function(){
            var _this = this;
            if (this.idx > 0) {
                this.load2cache(-1);
                //this.turnAnimate($("#ppt-box"), "prev");
                _this.$right.removeClass("disabled");
                if(!!this.rid){
                    var cuid = this.rid+"_"+this.idx;
                    $("#_canvas").attr("data-cuid",cuid);
                    $("#_canvas").trigger("load_ppt", cuid);
                }
                this.$currNumber.text(this.idx+1);
            }
            this.idx == 0 && this.$left.addClass("disabled");
        },

        pptrender : function(img){
            if(!img) return false;
            var dh = $('.ppt-show').height();//show_height
            var dw = $('.ppt-show').width();//show_maxwidth
            img.removeAttr("height");
            img.removeAttr("width");
            var v1 = dh / dw;
            var img_height = img[0].height == 0 ? 720 : img[0].height;
            var img_width = img[0].width == 0 ? 960 : img[0].width;
            var cvs_height = 0;
            var cvs_width = 0;
            var v2 = img_height / img_width;

            if (v1 < v2) {
                cvs_height = dh;
                cvs_width = cvs_height * img_width / img_height;
                img.attr("height", cvs_height);
                img.attr("width", cvs_width);
            } else {
                cvs_width = dw;
                cvs_height = cvs_width * img_height / img_width;
                img.attr("width", cvs_width);
                img.attr("height", cvs_height);
            }
            var a = $('#slides');
            //设置容器尺寸
            a.css({"width":cvs_width,"height":cvs_height});
            var a_img = $('#slides img');
            a_img.remove();
            // a.empty();
            img.show();
            a.append(img);
            // 设置画布位置_canvas
            var canvas = $('#_canvas');
            canvas.attr('height', cvs_height);
            canvas.attr('width', cvs_width);

            setTimeout(function(){
                var draw = $("#ppt_canvas").data("Draw");
                if(!!draw){
                    draw.setSize(cvs_width,cvs_height);
                }
            },300);
        },

        load2cache : function(direction){
            var _this = this;
            if ((direction == 1 && this.idx >= this.ppt_array.length - 1)
                || (-1 == direction && this.idx <= 0)) {
                return;
            }
            if (1 == direction) {// 向下翻页
                this.idx++;
                var add_idx = this.max_len + this.idx - 1;
                if (this.max_len + this.idx - 1 < this.ppt_array.length
                    && this.ppt_container[add_idx] == null) {

                    var _img = '<img  data-key="' + add_idx + '" src="'
                        + this.ppt_array[add_idx].url + '" />';
                    var img_node = $(_img);
                    img_node.hide();
                    img_node.load(function(){
                        $(this).attr('width', this.width);
                        $(this).attr('height', this.height);
                        _this.ppt_container[add_idx] = img_node;
                        _this.pptrender(_this.ppt_container[_this.idx]);
                    });
                    //img_node.attr('width', img_node.width());
                    //img_node.attr('height', img_node.height());
                    //this.ppt_container[add_idx] = img_node;
                }else{
                    _this.pptrender(_this.ppt_container[_this.idx]);
                }
            } else {// 后退翻页
                this.idx--;
                var add_idx = (this.idx - this.max_len + 1);
                if (add_idx >= 0 && this.ppt_container[add_idx] == null) {
                    var _img = '<img  data-key="' + add_idx + '" src="'
                        + this.ppt_array[add_idx].url + '" />';
                    var img_node = $(_img);
                    img_node.hide();
                    img_node.load(function(){
                        $(this).attr('width', this.width);
                        $(this).attr('height', this.height);
                        _this.ppt_container[add_idx] = img_node;
                        _this.pptrender(_this.ppt_container[_this.idx]);
                    });
                    //img_node.attr('width', img_node.width());
                    //img_node.attr('height', img_node.height());
                    //this.ppt_container[add_idx] = img_node;
                }else{
                    _this.pptrender(_this.ppt_container[_this.idx]);
                }
            }
            if(!!_this.rid && !!_this.idx){
                localStorage.setItem(_this.rid, _this.idx);
            }
        },

        /**
         * 跳转到指定页
         * @param currentpage
         */
        turnPage : function(currentpage){
            var _this = this;
            var start = currentpage - _this.max_len > 0 ? (currentpage - _this.max_len)
                : 0;
            var pageIndex = currentpage + _this.max_len > _this.ppt_container.length ? _this.ppt_container.length
                : (currentpage + _this.max_len);
            for (var i = start; i < pageIndex; i++) {
                var _img = '<img  data-key="' + i + '" src="'
                    + this.ppt_array[i].url + '" />';
                var img_node = $(_img);
                _this.ppt_container[i] = img_node;
            }
            currentpage == 0 && this.$left.addClass("disabled");
            if(!!this.rid){
                var cuid = this.rid+"_"+this.idx;
                $("#_canvas").attr("data-cuid",cuid);
                $("#_canvas").trigger("load_ppt", cuid);
            }
            _this.pptrender(_this.ppt_container[currentpage]);
            this.$currNumber.text(pageIndex);
            this.$sumNumber.text(this.ppt_array.length);
        },

        _socket : function(){
            var _this = this;
            /**
             *  连接
             */
            iosocket.on('connect', function() {
                iosocket.emit('addroom', room, usertype, _this.idx);
                iosocket.emit('turnpage');
            });
            /**
             * 断开
             */
            iosocket.on('disconnect', function() {

            });
            /**
             * 加入
             */
            iosocket.on('joinroomsucc', function (currentpage) {
                //console.log("joinroomsucc  " + currentpage);
                //_this.turnPage(currentpage);
            });
            /**
             * 接收推送翻页(上下页)
             */
            iosocket.on('message', function(message, page) {
                if (parseInt(message) == 39) {// 右翻页
                    _this.idx = page - 1;
                    _this.next();
                } else if (parseInt(message) == 37) {// 左翻页
                    _this.idx = page + 1;
                    _this.prev();
                }
            });
            /**
             * 指定翻页
             */
            iosocket.on('resetpage',function (page) {
                _this.idx = page;
                _this.turnPage(page);
                //var start = page - _this.max_len > 0 ? (page - _this.max_len) : 0;
                //var pageIndex = page + _this.max_len > _this.ppt_container.length ? _this.ppt_container.length
                //    : (page + _this.max_len);
                //for (var i = start; i < pageIndex; i++) {
                //    var _img = '<img  data-key="' + i + '" src="'
                //        + ppt_array[i].url + '" />';
                //    var img_node = $(_img);
                //    _this.ppt_container[i] = img_node;
                //}
                //_this.pptrender(_this.ppt_container[_this.idx]);
            });
        }
    };

    $.fn.pptController = function (option) {
        return this.each(function(input_field) {
            var $this = $(this)
                , data = $this.data('pptController')
                , options = typeof option == 'object' && option;
            if (!data) {
                $this.data('pptController', (data = new PptController(this, options)));
            }else{
                data.reset(options);
            }
            if (typeof option == 'string') data[option]();
        });
    };

    $.fn.pptController.defaults = {ispreviewshow :false, ismenushow:false, isqrcodeshow : false, idx : 0, ppt_container : 0, ppt_preview_container : 0, max_len : 1};

})($);