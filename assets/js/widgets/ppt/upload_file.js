(function ($) {
    var uploader;
    var uploadfile;
    //var   uploadUrl = 'http://file.tt9.com:80/rc/upload';//开发环境
    //var uploadUrl = 'http://files.tt139.com:80/rc/upload';//线上环境
    var uploadUrl = 'https://file.hoozha.com/rc/upload';//线上环境

    //var preview_url="http://doc.tt9.com/preview/";//开发环境
    var preview_url = "http://doc.tt139.com/preview/";//线上环境

    //var icon_url="ttkaifa.com:8080/rc/geticon?";
    var icon_url = "tt139.com/rc/geticon?";////线上环境

    //短网址服务
    //var short_url="http://192.168.51.112:5800/";

    var short_url = "http://tta.so/";

    var bkLib = {
        uploadUrl: uploadUrl,
        sid: function () {
            return 'MTI2MDA3Mzk4OTM4OTkud3d3LjEzNzU2NjcxNTkxNjAuZmEwNjVjMzJiNDUxNWNjY2M3ZDdhN2E3YjgxMDE0ZWQ';
        },
        ppt_array: new Array(),
        cancelEvent: function (e) {
            e = e || window.event;
            if (e.preventDefault && e.stopPropagation) {
                e.preventDefault();
                e.stopPropagation();
            }
            return false;
        }
    };

    var sid = bkLib.sid();

    var Upload = function (element, options) {
        this.el = $(element);
        this.options = options;
        this._init();
        this._addEvents();
    }

    Upload.prototype = {
        _init: function () {
            this.uploader = new plupload.Uploader({
                runtimes: 'gears,html5,flash,silverlight,browserplus',
                browse_button: this.options.button,
                container: 'container',
                max_file_size: '20mb',
                unique_names: true,
                url: bkLib.uploadUrl + '?sid=' + sid,
                flash_swf_url: '/plupload/plupload.flash.swf',
                silverlight_xap_url: '/plupload/plupload.silverlight.xap',
                multi_selection: false,
                //prevent_duplicates : true,
                filters: [
                    {title: "PPt files", extensions: "ppt,pptx"}
                ],
            });
            this.uploader.init();
            this.progress = false;//上传进度
            this.$ppt_progress = $('[node-type="upload_progress"]');
        },

        up_progress_init : function(){
            this.$ppt_progress.find('.progressBar').css("width", "0%");
            this.$ppt_progress.find('.number').text("0%");
            this.$ppt_progress.find('.name').text('上传中...');
            this.$ppt_progress.hide();
        },

        _addEvents: function () {
            var that = this;
            this.uploader.bind('Init', function (up, params) {
                if(!!that.progress) return;
            });

            this.uploader.bind('FilesAdded', function (up, files) {
                setTimeout(function () {
                    if(!!that.progress){
                        alert("请稍后上传");
                        return;
                    }
                    that.uploader.start();
                }, 50);
                up.refresh(); // Reposition Flash/Silverlight
            });

            this.uploader.bind('BeforeUpload', function (up, file) {
                if(!!that.progress) return;
                uploadfile = file;
                var date = new Date();
                that.$ppt_progress.show();
            });

            this.uploader.bind('UploadProgress', function (up, file) {
                if(!!that.progress) return;
                $('[node-type="up_list"]').scrollTop(0);//滚动条置顶
                that.$ppt_progress.find('.progressBar').css("width", file.percent + "%");
                that.$ppt_progress.find('.number').text(file.percent + "%");
                that.$ppt_progress.find('.name').text('上传中...');
                that.progress = true;
            });

            this.uploader.bind('Error', function (up, err) {
                if(!!err && !!err.message){
                    if(err.code == -600){
                        alert("请上传小于20M的文件");
                    }else{
                        alert(err.message);
                    }
                }
                up.refresh(); // Reposition Flash/Silverlight
            });

            this.uploader.bind('FilesRemoved', function (up, err) {
                console.log("删除秀消息 ****************8   ");
            });

            this.uploader.bind('FileUploaded', function (up, file, response) {
                var res = eval(response);
                var rdata = JSON.parse(res.response);
                var rid = rdata.rid;
                console.log("fileuploaded   " + JSON.stringify(rdata));
                var postdata = {};
                postdata.rid = rid;
                postdata.size = file.size;
                postdata.tt_uid = "1231";
                that.$ppt_progress.find('.progressBar').css("width", "0%");
                that.$ppt_progress.find('.number').text("0%");
                that.$ppt_progress.find('.name').text('上传完成解析中...');

                var startSeconds = new Date().getTime() / 1000;
                var curSeconds;
                var interval = setInterval(function () {
                    curSeconds = new Date().getTime() / 1000;
                    var percent = Math.floor((1 - Math.pow(0.9, (curSeconds - startSeconds))) * 100);
                    that.$ppt_progress.find('.progressBar').css("width", percent + "%");
                    that.$ppt_progress.find('.number').text(percent + "%");
                }, 100);

                $.post('/upload.json', postdata, function (data, status) {
                    if(data.code == 0){
                        alert("解析失败");
                        clearInterval(interval);
                        that.up_progress_init();
                        that.progress = false;
                        return;
                    }
                    console.log("upload json == " + JSON.stringify(data));
                    clearInterval(interval);
                    if ("1" == data.code) {//成功
                        //var progerss = parseInt($('#deal_upload_progress_' + file.id).html());
                        var progerss = 0;
                        console.log("progeresss ======= " + progerss);
                        var prointerval = setInterval(function () {
                            progerss += 5;
                            if (progerss > 100) {
                                progerss = 100;
                            }
                            if (progerss == 100) {
                                that.up_progress_init();
                                var date = new Date(data.data.upload_time);
                                $('#primary-btn-' + file.id).css("display", "");
                                $('#meeting-btn-' + file.id).css("display", "");
                                $('#close-btn-' + file.id).css("display", "");
                                $('#close-btn-' + file.id).removeAttr("id");
                                file.rid = rid;
                                file.cover_image = data.data.cover_image;
                                that.el.trigger("uploadEnd", file);
                                $("#ppt_empty").hide();
                                that.progress = false;
                                //$('#ppttime_' + file.id).html(date. getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日，" + data.data.slide_num + "张PPT");
                                clearInterval(prointerval);
                            }
                        }, 50);
                         //Addppt.init_masonry();
                    } else {
                        that.progress = false;
                        var delete_div = $('[data-key="pptshow-box' + ppt_array.length + '"]');
                        //$('#pptshow-lists-div').masonry('remove', delete_div).masonry();
                        //Addppt.init_masonry();
                    }
                });
            });
        }
    }

    $.fn.uploadfile = function (option) {
        return this.each(function (input_field) {
            var $this = $(this)
                , data = $this.data('uploadfile')
                , options = typeof option == 'object' && option;
            if (!data) {
                $this.data('uploadfile', (data = new Upload(this, options)));
            } else {
                data.reset(options);
            }
            if (typeof option == 'string') data[option]();
        });
    };

})($);