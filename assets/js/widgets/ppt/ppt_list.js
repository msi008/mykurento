/**
 * Created by fengge on 16/4/18.
 */
;(function($){
    var PptList = function(element, options){
        this.el = $(element);
        this.options = options;
        this._init();
        this._addEvents();
    };

    PptList.prototype = {
        _init : function(){
            this.isshow = false;
            this.$ppt_list = $('[node-type="ppt_list"]');
            this.initUpload();
        },

        _addEvents : function(){
            var that = this;
            //this.el.on("click", $.proxy(this.show, this));
            this.$ppt_list.on("click", $.proxy(this.loadPPT, this));
        },

        loadPPT : function(){
            var e = event || window.event;
            if($(e.target).closest("li").length > 0){
                var traget = $(e.target).closest("li");
                var rid = traget.attr("data-rid");
                Tool.ajax("/loadppt",{rid:rid},function(res){
                    if(!!res && res.code == 1){
                        var data = res.data;
                        if(!!data){
                            var ppt_array = JSON.parse(data);
                            $(".ppt-show").pptController({rid:rid, pptdata : ppt_array, ppt_container : new Array(ppt_array.length), ppt_preview_container : new Array(ppt_array.length)});
                            $("#ppt_canvas").Draw({width:$("#ppt-box").width(), height:$("#ppt-box").height()});
                            //if(mode == "t" && !!rid && !!room){
                            //    iosocket.emit("addppt",room, rid);
                            //    localStorage.setItem("currtask", "ppt");
                            //    localStorage.setItem("pptid", rid);
                            //    $("#toolbar").show();
                            //    $("#content_container").trigger("switch_ppt");//同步切换
                            //}
                        }
                    }
                }, function(e){
                    console.log(e);
                });
            }
        },

        initUpload : function(){
            this.el.uploadfile({button:"upload_ppt", container:"container"});
            this.el.on("uploadEnd", function(event, file){
                if(!!file){
                    console.log(file);
                    var rid = file.rid, name = file.name, img = file.cover_image;
                    var photo_node = $('[node-type="up_list"]');
                    var progress = $('[node-type="upload_progress"]');
                    progress.after('<li data-rid="'+ rid +'"><img src="' + img + '"><p>'+ name +'</p></li>');
                    //photo_node.prepend('<li data-rid="'+ rid +'"><img src="' + img + '"><p>'+ name +'</p></li>');
                }
            });
        },

        show : function(){
            var that = this;
            var left = this.el.offset().left;
            var top = this.el.offset().top+this.el.height();
            !this.isshow && this.$ppt_list.css({'left':left,'top':top}).addClass("tipScaleIn").show();
            this.isshow = true;
            $('html').on("click", function(){
                var e = event || window.event;
                if($(e.target).closest(".btn-upload").length > 0 || $(e.target).closest(".plupload").length > 0  || $(e.target).closest('#ppt_list').length > 0){
                    e.stopPropagation();
                }else{
                    that.hide();
                }
            });
        },

        hide : function(){
            !!this.isshow && this.$ppt_list.hide();
            this.isshow = false;
        }

    };

    $.fn.pptlist = function (option) {
       var ob = "";
       this.each(function(input_field) {
            var $this = $(this)
                , data = $this.data('pptlist')
                , options = typeof option == 'object' && option;
            if (!data) {
                $this.data('pptlist', (data = new PptList(this, options)));
            }else{
                data.reset(options);
            }
            if (typeof option == 'string') data[option]();
            ob = data;
        });
        return ob;
    };

})(window.jQuery);
