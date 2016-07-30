/**
 * Created by fengge on 16/6/15.
 */
var actionHistory = new SimpleStack();
 function SimpleStackException(msg) {
  this.message = msg;
  this.name = 'SimpleStackException';
}

function SimpleStack() {
  var MAX_ENTRIES = 2048;
  var self = this;
  self.sp = -1; // stack pointer
  self.entries = []; // stack heap

  self.push = function(newEntry) {
    if (self.sp > MAX_ENTRIES - 1) {
      throw new SimpleStackException('Can not push on a full stack.');
    }
    self.sp++;
    self.entries[self.sp] = newEntry;
    // make sure to clear the "future" stack after a push occurs
    self.entries.splice(self.sp + 1, self.entries.length);
  };

  self.pop = function() {
    if (self.sp < 0) {
      throw new SimpleStackException('Can not pop from an empty stack.');
    }
    var entry = self.entries[self.sp];
    self.sp--;
    return entry;
  };

  self.reversePop = function() {
    self.sp++;
    if (!self.entries[self.sp]) {
      self.sp--;
      throw new SimpleStackException('Can not reverse pop an entry that has never been created.');
    }
    return self.entries[self.sp];
  }
}

var lut = [];
for (var i = 0; i < 256; i++) {
  lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
}

function generateUuid() {
  var d0 = Math.random() * 0xffffffff | 0;
  var d1 = Math.random() * 0xffffffff | 0;
  var d2 = Math.random() * 0xffffffff | 0;
  var d3 = Math.random() * 0xffffffff | 0;
  return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
    lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
    lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
    lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
}


var is ={
            isMove: false,
            isArc: false,
            isPencil: false,
            isShape: false,
            isRectangle: false,
            isEraser: false,
            isText: false,

            set: function(shape) {
                var cache = this;
                cache.isLine = cache.isArc = cache.isMove = cache.isPencil = cache.isRectangle = cache.isEraser = cache.isText = cache.isZoomIn = cache.isZoomOut = isImage = false;
                cache['is' + shape] = true;
            }
        }


;(function($){
    var Draw = function(element, options){
        this.el = $(element);
        this.options = $.extend($.fn.Draw.defaults,options);
        var draw_width = this.options.width || window.screen.width,
            draw_height = this.options.height || window.screen.height;
        var ele = createToolsBar(this.options.canvasid, draw_width, draw_height, this.options);

        this.el.append(ele);

        this._init();//初始化
        this._addEvents();//注册事件
        this._initSocket();//注册通信
    };
    Draw.prototype = {
        _init : function(){
            var _this =  this;
            this.canvas =  new fabric.Canvas(this.options.canvasid);
            for(var key in this.options.tools){
                switch(key) {
                    case 'circle':
                        _this.$circle = _this.el.find(".shape-item.circle");
                        _this.$circle.on("click", $.proxy(_this.circle, _this));
                        break;
                    case 'rect':
                        _this.$rect = _this.el.find(".shape-item.square");
                        _this.$rect.on("click", $.proxy(_this.rect, _this));
                        break;
                    case 'triangle':
                        _this.$triangle = _this.el.find(".shape-item.triangle");
                        _this.$triangle.on("click", $.proxy(_this.triangle, _this));
                        break;
                    case 'line':
                        _this.$line = _this.el.find(".shape-item.line");
                        _this.$line.on("click", $.proxy(_this.line, _this));
                        break;
                    case 'pen':
                        if(this.options.channel == "ppt"){
                            this.$pencil = this.el.find("#line-width-btn");
                            this.$penColor = this.el.find("#line-color-btn");
                            this.$lineWidth = this.el.find("#line-width-icon");
                            this.$lineColor = this.el.find("#line-color-icon");
                            this.$lineWidth.on("click", $.proxy(this.lineWidth, this));
                            this.$lineColor.on("click", $.proxy(this.lineColor, this));
                        }else{
                            this.$pencil = this.el.find(".tool-item.pen");
                        }
                        this.$pencil.on("click", $.proxy(_this.pencil, _this));
                        this.$black = this.el.find(".color-item.black");
                        this.$black.on("click", $.proxy(this.black, this));
                        this.$blue = this.el.find(".color-item.blue");
                        this.$blue.on("click", $.proxy(this.blue, this));
                        this.$red = this.el.find(".color-item.red");
                        this.$red.on("click", $.proxy(this.red, this));
                        this.$green = this.el.find(".color-item.green");
                        this.$green.on("click", $.proxy(this.green, this));
                        this.$orange = this.el.find(".color-item.orange");
                        this.$orange.on("click", $.proxy(this.orange, this));
                        this.$gray = this.el.find(".color-item.gray");
                        this.$gray.on("click", $.proxy(this.gray, this));
                        this.$purple = this.el.find(".color-item.purple");
                        this.$purple.on("click", $.proxy(this.purple, this));
                        this.$thin = this.el.find(".brush-item.thin");
                        this.$thin.on("click", $.proxy(this.thin, this));
                        this.$fine = this.el.find(".brush-item.fine");
                        this.$fine.on("click", $.proxy(this.fine, this));
                        this.$medium = this.el.find(".brush-item.medium");
                        this.$medium.on("click", $.proxy(this.medium, this));
                        this.$thick = this.el.find(".brush-item.thick");
                        this.$thick.on("click", $.proxy(this.thick, this));
                        break;
                    case 'undo':
                        _this.$undo = _this.el.find(".tool-item.go-back");
                        _this.$undo.on("click", $.proxy(_this.undo, _this));
                        break;
                    case 'redo':
                        _this.$redo = _this.el.find(".tool-item.go-forward");
                        _this.$redo.on("click", $.proxy(_this.redo, _this));
                        break;
                    case 'zoomin':
                        _this.$zoomin = _this.el.find(".tool-item.enlarge");
                        _this.$zoomin.on("click", $.proxy(_this.zoomIn, _this));
                        break;
                    case 'zoomout':
                        _this.$zoomout = _this.el.find(".tool-item.reduce");
                        _this.$zoomout.on("click", $.proxy(_this.zoomOut, _this));
                        break;
                    case 'eraser':
                        _this.$eraser = _this.el.find(".tool-item.eraser");
                        _this.$eraser.on("click", $.proxy(_this.eraser, _this));
                        break;
                    case 'move':
                        _this.$drag = this.el.find(".tool-item.move");
                        _this.$drag.on("click", $.proxy(this.drag, _this));
                        break;
                    case 'selection':
                        _this.$selection = this.el.find(".tool-item.selector");
                        _this.$selection.on("click", $.proxy(this.selection, _this));
                        break;
                    case 'text':
                        _this.$text = _this.el.find(".tool-item.text");
                        _this.$text.on("click", $.proxy(this.text, _this));
                        break;
                    case 'eraserall':
                        _this.$eraserall = _this.el.find(".tool-item.eraser-all");
                        _this.$eraserall.on("click", $.proxy(this.eraserAll, _this));
                        break;
                    case 'image':
                        _this.$image = _this.el.find(".tool-item.add-picture");
                        _this.$image.on("click", $.proxy(this.image, _this));
                        break;
                    case 'toimage':
                        _this.$toimage = _this.el.find(".tool-item.save");
                        _this.$toimage.on("click", $.proxy(this.toimage, _this));
                        break;
                    case 'shape':
                        _this.$shape = _this.el.find(".tool-item.shape");
                        _this.$shape.on("click", $.proxy(this.shape, _this));
                    default:
                        break;
                }
            }

            this.is('Pencil');

            this.current = "";
            this.list = [];
            this.state = [];
            this.index = 0;
            this.index2 = 0;
            this.action = false;
            this.refresh = true;

            this.draging = false;
            this.moveing = false;
            this.erasering = false;

            this.currentX = 0;
            this.currentY = 0;

            this.rendering = false;

            // clear canvas
            this.clear();
            // remove currently selected object
            this.canvas.remove(this.canvas.getActiveObject());

            this.toolbar = this.el.find("#drawToolbar");
        },

        isEraser:false,
        isMove:false,
        isSelection:false,
        isShape:false,
        isPencil:true,
        isText:false,

        is:function(shape){
            var cache = this, cls;

            if(cache.isEraser){
                //去掉橡皮的开关
                this.disabledLine();
                this.canvas.selection = true;
                this.canvas.interactive = true;
                this.draging = true;
                this.erasering = false;
            } else if(cache.isMove){
                //设置移动开关
                this.disabledLine();
                this.canvas.selection = true;
                this.canvas.interactive = false;
                this.draging = false;
                this.erasering = true;
            } else if(cache.isShape){
                //设置图形开关
                this.disabledLine();
                this.canvas.selection = false;
                this.canvas.interactive = false;
                this.draging = true;
                this.erasering = true;
            } else if(cache.isPencil){
                //画笔
                this.canvas.isDrawingMode = false;
                this.draging = true;
                this.erasering = true;
                this.canvas.selection = false;
                this.canvas.interactive = false;
            } else if(cache.isText){
                //如果是文字
                this.disabledLine();
                this.canvas.selection = false;
                this.canvas.interactive = false;
                this.draging = true;
                this.erasering = true;
            } else if(cache.isSelection){
                //如果是选择
                this.disabledLine();
                this.canvas.selection = false;
                this.canvas.interactive = false;
                this.draging = true;
                this.erasering = true;
            } else if(cache.isImage){
                this.disabledLine();
                this.canvas.selection = false;
                this.canvas.interactive = false;
                this.draging = true;
                this.erasering = true;
            }

            cache.isLine = cache.isArc = cache.isMove = cache.isPencil = cache.isRectangle = cache.isEraser = cache.isText = cache.isSelection = cache.isShape = false;
            cache['is' + shape] = true;

            if(cache.isEraser){
                //去掉橡皮的开关
                this.disabledLine();
                this.canvas.selection = false;
                this.canvas.interactive = false;
                this.draging = false;
                this.erasering = true;
                cls = '.eraser';
            } else if(cache.isMove){
                //设置移动开关
                this.disabledLine();
                this.canvas.selection = false;
                this.canvas.interactive = true;
                this.draging = true;
                this.erasering = false;
                cls = '.move';
            } else if(cache.isSelection){
                //设置选择开关
                this.disabledLine();
                this.canvas.selection = true;
                this.canvas.interactive = true;
                this.draging = false;
                this.erasering = false;
                cls = '.selector';
            } else if(cache.isShape){
                //设置图形开关
                this.disabledLine();
                this.canvas.selection = true;
                this.canvas.interactive = true;
                this.draging = false;
                this.erasering = false;
                cls = '.shape';
            } else if(cache.isPencil){
                //画笔
                this.canvas.isDrawingMode = true;
                this.draging = false;
                this.erasering = false;
                this.canvas.selection = true;
                this.canvas.interactive = true;
                cls = '.pen';
            } else if(cache.isText){
                //如果是文字
                this.disabledLine();
                this.canvas.selection = true;
                this.canvas.interactive = true;
                this.draging = false;
                this.erasering = false;
                cls = '.text';
            } else if(cache.isImage){
                //如果是文字
                this.disabledLine();
                this.canvas.selection = true;
                this.canvas.interactive = true;
                this.draging = false;
                this.erasering = false;
                cls = '.add-picture';
            }

            if(!cache.isPencil){
                this.$pencil.find(".pen-list").hide();
            }

            var e = event || window.event || arguments.callee.caller.arguments[0]
                ,target = $(e.target).closest(cls);

            target.addClass("active").siblings().removeClass("active");
        },

        getFabricObjectByUuid:function(uuid) {
          var fabricObject = null;
          this.canvas.getObjects().forEach(function(object) {
            if (typeof object.id != "undefined" && object.id === uuid) {
              fabricObject = object;
            }
          });
          return fabricObject;
        },


        _initSocket : function(){
            var _this = this;
            if(typeof io != "undefined"){
                this.socket = io.connect("https://glbl.hoozha.com:13000");
            }
            this.socket.emit("drawstart", roomid);//加入房间挂载roomid(临时)

            this.socket.emit("getDraw",roomid).on("getDraw", function(canvas){
                _this.canvas.isDrawingMode = true;
                //渲染
                if(!canvas){
                    _this.canvas.loadFromJSON({});
                }else{
                    var json = JSON.parse(canvas);
                    var zoom = typeof json.zoom == "undefined" ? 1 : json.zoom;
                    var transX = typeof json.transX == "undefined" ? _this.canvas.viewportTransform[4] : json.transX;
                    var transY = typeof json.transY == "undefined" ? _this.canvas.viewportTransform[5] : json.transY;
                    json.objects.complete = true;
                    _this.canvas.loadFromJSON(json,_this.canvas.renderAll.bind(_this.canvas));
                    //typeof json.transX != "undefined" && _this.canvas.setViewportTransform([zoom, 0, 0, zoom, transX, transY], "refresh");
                    //typeof json.zoom != "undefined" && _this.canvas.setZoom(zoom, _this.getCenter(), "refresh");
                }
                _this.canvas.renderAll();
                _this.index = 0;
            });

            this.socket.on("drawUpdate", function(type,canvas){
                console.log("更新数据: "+type);
                _this.rendering = true;
                var json = null, zoom = 1,
                    transX = _this.canvas.viewportTransform[4],
                    transY = _this.canvas.viewportTransform[5];
                if(!!canvas){
                    json = JSON.parse(canvas);
                    zoom = typeof json.zoom == "undefined" ? 1 : json.zoom;
                    transX = typeof json.transX == "undefined" ? transX : json.transX;
                    transY = typeof json.transY == "undefined" ? transY : json.transY;
                    json.objects.complete = true;
                    json.ptype = type;
                }
                _this.canvas.loadFromJSON(json, _this.canvas.renderAll.bind(_this.canvas));
                type == "drag" && _this.canvas.setViewportTransform([zoom, 0, 0, zoom, transX, transY], type);
                type == "zoom" && _this.canvas.setZoom(zoom, _this.getCenter(), type);
                _this.canvas.renderAll(type);
            });

            this.socket.on("drawClear", function(roomid){
                _this.clear();
            });

            this.socket.on("modified", function(obj){
                if(!!obj){
                    var json = JSON.parse(obj);
                    //klass = fabric.util.createClass(json);
                    var klass = _this.toKlass(json);
                    klass.canvas = _this.canvas;
                    klass.remove();
                    _this.canvas.added(klass);
                    //klass.setOptions(json);
                    //klass.setCoords();
                    //_this.canvas.renderAll();
                }
            });

            this.socket.on("added", function(obj){
                if(!!obj){
                    var json = JSON.parse(obj),
                        klass = _this.toKlass(json);
                    _this.canvas.added(klass);
                    //_this.canvas.renderAll();
                }
            });
        },

        addObj : function(obj){
            if(!!obj){
                var json = JSON.parse(obj),
                    klass = this.toKlass(json);
                this.canvas.added(klass);
                this.canvas.renderAll();
            }
        },

        toKlass : function(obj){
            var json = null;
            if(!!obj){
                var klass = fabric.util.getKlass(obj.type);
                if(klass.async){
                    klass.fromObject(obj, function(obj,error){
                        if(!error){
                            json = obj;
                        }
                    });
                }else{
                    json = klass.fromObject(obj);
                }
            }
            return json;
        },

        _addEvents : function(){
            var _this = this;
            /**
             * 添加元素后
             */
            this.canvas.on('object:added', function(e) {
                var object = e.target;
                // bypass the event for path objects, as they are handled by `path:created`
                //if (object.type === 'path') {
                //    return;
                //}
                // if the object has not been given an uuid, that means it is a fresh object created by this client
                if (!object.uuid) {
                    object.uuid = generateUuid();
                }
                if (!object.bypassHistory) {
                    actionHistory.push({
                        type: 'object_added',
                        object: JSON.stringify(object)
                    });
                }
                _this.drawUpdate("added");
            });

            /**
             * 修改元素
             */
            this.canvas.on('object:modified', function(e) {
                console.log("modified");
                var object = e.target;
                if(typeof latestTouchedObject == "undefined") latestTouchedObject = fabric.util.object.clone(object);
                actionHistory.push({
                    type: 'object_modified',
                    objectOld: JSON.stringify(latestTouchedObject),
                    objectNew: JSON.stringify(object)
                });
                _this.drawUpdate("modified");
            });

            this.canvas.on("object:scaling", function(e){
                console.log(e.target);
            });

            /**
             * 文本框改变
             */
            this.canvas.on('text:changed', function(e) {
                var object = e.target;
                actionHistory.push({
                    type: 'text_changed',
                    objectOld: JSON.stringify(latestTouchedObject),
                    objectNew: JSON.stringify(object)
                });
                _this.drawUpdate("modified");
            });

            /**
             * 移除元素事件
             */
            this.canvas.on('object:removed', function(e) {
                var object = e.target;
                if (!object.bypassHistory) {
                    actionHistory.push({
                        type: 'object_removed',
                        object: JSON.stringify(object)
                    });
                }
                _this.drawUpdate("removed");
            });

            /**
             * 清除canvas
             */
            this.canvas.on('canvas:cleared', function(e) {
                //if (!_this.canvas.bypassHistory) {
                //    actionHistory.push({
                //        type: 'canvas_cleared',
                //        canvas: JSON.stringify(_this.canvas)
                //    });
                //}
            });

            this.canvas.on('mouse:down', function(options) {
              if (options.target) {
                latestTouchedObject = fabric.util.object.clone(options.target);
              }
            });

            this.canvas.on("object:selected", function(e){
                //_this.saveState(e,"selected");
            });

            this.canvas.on("mouse:over", function(options){
                //console.log(_this.erasering,_this.moveing,"mouseOver: "+JSON.stringify(options));
                //当时橡皮和移动屏幕时,把元素设置为不可选择
                if(!!_this.isEraser){
                    options.target.selectable = false;
                }else{
                    options.target.selectable = true;
                }
                if(!!_this.erasering && !!_this.moveing){
                    _this.canvas.remove(options.target);
                }
            });

            this.canvas.on("mouse:move", function(options){
                if(!!_this.erasering && !!_this.moveing){
                    _this.canvas.remove(options.target);
                }
            });

            this.canvas.on("mouse:out", function(options){
                if(!!_this.erasering && !!_this.moveing){
                    _this.canvas.remove(options.target);
                }
            });


            this.canvas.on("mouse:up", $.proxy(this._mouseUp, this));
            this.canvas.on("mouse:down", $.proxy(this._mouseDown, this));
            this.canvas.on("mouse:move", $.proxy(this._mouseMove, this));

            this.canvas.on('after:render', function(opt){
                this.calcOffset();
                if(opt == "complete"){
                    _this.rendering = false;
                    console.log("加载完成");
                }
            });

             window.onresize = function(){
                 //if (_this.canvas.width != _this.el.width()) {
                 //    var scaleMultiplier = _this.el.width() / _this.canvas.width;
                 //    var objects = _this.canvas.getObjects();
                 //    for (var i in objects) {
                 //        objects[i].scaleX = objects[i].scaleX * scaleMultiplier;
                 //        objects[i].scaleY = objects[i].scaleY * scaleMultiplier;
                 //        objects[i].left = objects[i].left * scaleMultiplier;
                 //        objects[i].top = objects[i].top * scaleMultiplier;
                 //        objects[i].setCoords();
                 //    }
                 //
                 //    _this.canvas.setWidth(_this.canvas.getWidth() * scaleMultiplier);
                 //    _this.canvas.setHeight(_this.canvas.getHeight() * scaleMultiplier);
                 //    _this.canvas.renderAll();
                 //    _this.canvas.calcOffset();
                 //}
                 //var w = _this.el.width(), h = _this.el.height();
                 //if(!!h && !!w)
                 //_this.setSize(w,h);

             }
        },

        setSize : function(width, height){
            if(width && height){
                this.canvas.setWidth(width);
                this.canvas.setHeight(height);
            }
        },

        saveState : function(e,type){
            var object = e.target;
            if (this.action === true) {
                //this.state = [this.state[this.index2]];
                //this.list = [this.list[this.index2]];
                //this.stateType = [this.stateType[this.index2]];
                //this.stateType[this.index] = type;
                //this.action = false;
                //this.index = 1;
                this.state = [this.state[this.index2]];
                this.list = [this.list[this.index2]];
                this.action = false;
                this.index = 1;
            }
            object.saveState();
            this.state[this.index] = JSON.stringify(object.originalState);
            //if(!!type) object.optype = type;
            object.optype = type;
            this.list[this.index] = object;
            this.index++;
            this.index2 = this.index - 1;
            this.refresh = true;
        },

        clear : function(){
            if(!!this.canvas){
                this.canvas.clear();
            }
        },

        reset : function(){
            var ele = createToolsBar(this.options.canvasid, 1000, 1000, this.options);
            this.el.html(ele);
        },

        added : function(obj){
            if(!!this.socket && !!obj){
                this.socket.emit("added", roomid, JSON.stringify(obj));
            }
        },

        /**
         * 修改对象后同步
         */
        modified : function(obj){
            if(!!this.socket && !this.rendering && obj){
                this.socket.emit("modified", roomid, JSON.stringify(obj));
            }
        },

        /**
         * 获取
         */
        getZoom : function(){
            if(!!this.canvas){
                return this.canvas.getZoom();
            }
            return 1;
        },

        /**
         * 发送同步数据
         */
        drawUpdate : function(type, transX, transY){
            console.log("发送数据: "+type);
            if(!!this.socket){
                var json = this.canvas.toJSON();
                json.zoom = this.canvas.getZoom();
                //console.log(JSON.stringify(json));
                if(typeof transX != "undefined") json.transX = transX;
                if(typeof transY != "undefined") json.transY = transY;
                this.socket.emit("drawUpdate", roomid, type, JSON.stringify(json));
            }
        },

        /**
         * 禁止划线
         */
        disabledLine : function(){
            this.canvas.isDrawingMode = false;
        },

        /**
         * 橡皮
         */
        eraser : function(){
            // var e = event || window.event || arguments.callee.caller.arguments[0];
            // var target = $(e.target).closest(".eraser");
            // target.addClass("active").siblings().removeClass("active");
            // this.disabledLine();
            // this.canvas.selection = false;
            // this.canvas.interactive = false;
            // this.draging = false;
            // this.erasering = true;
            this.is('Eraser');
        },

        setPenTools : function(state){
            if(!!state){
                this.$pencil.find(".pen-list").show();
            }else{
                this.$pencil.find(".pen-list").hide();
            }
        },

        setShapeTools : function(state){
            if(!!state){
                this.$shape.find(".shape-list").show();
            }else{
                this.$shape.find(".shape-list").hide();
            }
        },

        getActiveObject : function(){
            if(this.canvas){
               return this.canvas.getActiveObject();
            }
            return null;
        },

        _mouseMove : function(options){
            var e = event || arguments.callee.caller.arguments[0];
            if(!!this.draging && !!this.moveing && !this.getActiveObject()){
                // console.log(active);
                var nowX = options.e.clientX, nowY = options.e.clientY;
                var moveX = nowX - this.currentX, moveY = nowY - this.currentY;
                //console.log(this.currentX,this.currentY);
                var zoom = this.getZoom();
                this.canvas.setViewportTransform([zoom, 0, 0, zoom, moveX, moveY], "drag");
                //console.log(moveX, moveY);
                //this.drawUpdate(moveX, moveY);
            }
            if(!!this.erasering && !!this.moveing){
                this.canvas.findTarget(e);
            }
        },


        _mouseDown : function(options){
            var e = event || arguments.callee.caller.arguments[0];
            if(!!this.draging){
                var transX = this.canvas.viewportTransform[4], transY = this.canvas.viewportTransform[5];
                this.currentX = e.clientX-transX;
                this.currentY = e.clientY-transY;
            }
            this.moveing = true;
            this.isPencil && this.setPenTools(false);
            this.isShape && this.setShapeTools(false);
            if(this.options.channel == "ppt"){
                this.pptColor(false);
                this.pptWidth(false);
            }
        },

        _mouseUp : function(options){
            if(!!this.draging && !!this.moveing && !this.getActiveObject()){
                //this.moveing = false;
                //console.log(options.e.clientX, options.e.clientY);
                var transX = this.canvas.viewportTransform[4], transY = this.canvas.viewportTransform[5];
                this.drawUpdate("drag",transX, transY);
            }
            this.moveing = false;
        },

        drag : function(){
            this.is('Move');
        },

        selection : function(){
            this.is("Selection");
        },

        updateModifications : function(){
            var json = this.canvas.toJSON();
            json.objects.complete = true;
            //json = JSON.stringify(json);
            this.state.push(json);
        },

        getObjectById : function(obj){
            var result = null;
            if(!!obj && typeof obj.id != "undefined"){
                this.canvas.getObjects().forEach(function(item){
                     if(typeof item.id != "undefined" && item.id == obj.id){
                       return result = item;
                     }
                });
            }
            return result;
        },

        drawRender : function(obj,type){
            var _this = this;
            fabric.util.enlivenObjects([obj], function(actualObjects) {
                var object = actualObjects[0];
                if(type == "added"){
                    _this.canvas.added(object);
                }else if(type == "modified"){
                    var existingObject = _this.getFabricObjectByUuid(obj.id);
                    if (existingObject) {
                        _this.canvas.remove(existingObject);
                    }
                    _this.canvas.added(object);
                }
            });

            if(type == "removed"){
                var object = _this.getFabricObjectByUuid(obj.id);
                _this.canvas.removed(object,true);
            }
        },

        /**
         * 撤销
         */
        undo : function(){
            var _this = this;
            var action, objectCandidate;
              try {
                action = actionHistory.pop();
              } catch (e) {
                console.log(e.message);
                return;
            }
            console.log('undo');

            if (action.type === 'object_added') {
                objectCandidate = JSON.parse(action.object);
                var object = this.getFabricObjectByUuid(objectCandidate.id);
                object.bypassHistory = true;

                _this.canvas.remove(object);
            } else if (action.type === 'object_removed') {
                objectCandidate = JSON.parse(action.object);
                fabric.util.enlivenObjects([objectCandidate], function (actualObjects) {
                    actualObjects[0].id = objectCandidate.id;
                    var object = actualObjects[0];
                    object.bypassHistory = true;
                    _this.canvas.add(object);
                    object.bypassHistory = false;
                });
            } else if (action.type === 'object_modified' || action.type === 'text_changed') {
                objectCandidate = JSON.parse(action.objectOld);
                fabric.util.enlivenObjects([objectCandidate], function (actualObjects) {
                    actualObjects[0].id = objectCandidate.id;
                    var object = actualObjects[0];
                    var existingObject = _this.getFabricObjectByUuid(objectCandidate.id);
                    if (existingObject) {
                        existingObject.bypassRemoveEvent = true;
                        existingObject.bypassHistory = true;
                        _this.canvas.remove(existingObject);
                    }
                    object.bypassHistory = true;
                    _this.canvas.add(object);
                    object.bypassHistory = false;
                });
            } else if (action.type === 'canvas_cleared') {
                var canvasPresentation = JSON.parse(action.canvas);
                _this.canvas.bypassHistory = true;
                _this.canvas.loadFromJSON(canvasPresentation);
                _this.canvas.renderAll();
                _this.canvas.bypassHistory = false;
                _this.drawUpdate("added");
            }
            // if (this.index < 0) {
            //     this.index = 0;
            //     return;
            // }
            // if (this.refresh === true) {
            //     this.index>0 && this.index--;
            //     this.refresh = false;
            // }
            // console.log('undo');
            // var lastObj = this.list[this.index];
            // if(!!lastObj && lastObj.optype == "mod"){
            //     this.index2 = this.index - 1;
            //     if(this.index2 > 0){
            //         this.current = this.list[this.index2];
            //         this.current.setOptions(JSON.parse(this.state[this.index2]));
            //         this.current.setCoords();
            //     }
            // }else if(lastObj.optype == "add"){
            //     //this.canvas.remove(lastObj);
            // }else if(lastObj.optype == "remove"){
            //     //this.canvas.add(lastObj);
            // }
            // this.index--;
            // this.canvas.renderAll();
            // this.action = true;
            // this.drawUpdate("undo");

            //if(this.index <= 0){
            //    this.index = 0;
            //    return;
            //}
            //this.index--;
            //this.socket.emit("history", 1001, this.index);

            //if(this.index < this.state.length){
            //    this.canvas.loadFromJSON(this.state[this.state.length - 1 - this.index]);
            //    this.canvas.renderAll();
            //    this.index = this.index + 1;
            //    this.drawUpdate();
            //}
        },
        /**
         * 前进
         */
        redo : function(){
            var _this = this;
            var action, objectCandidate;
              try {
                action = actionHistory.reversePop();
              } catch (e) {
                console.log(e.message);
                return;
              }
              if (action.type === 'object_added') {
                objectCandidate = JSON.parse(action.object);
                fabric.util.enlivenObjects([objectCandidate], function(actualObjects) {
                  actualObjects[0].id = objectCandidate.id;
                  var object = actualObjects[0];
                  object.bypassHistory = true;
                  _this.canvas.add(object);
                  object.bypassHistory = false;
                });
              } else if (action.type === 'object_removed') {
                objectCandidate = JSON.parse(action.object);
                var object = _this.getFabricObjectByUuid(objectCandidate.id);
                object.bypassHistory = true;
                _this.canvas.remove(object);
                object.bypassHistory = false;
              } else if (action.type === 'object_modified' || action.type === 'text_changed') {
                objectCandidate = JSON.parse(action.objectNew);
                fabric.util.enlivenObjects([objectCandidate], function(actualObjects) {
                  actualObjects[0].id = objectCandidate.id;
                  var object = actualObjects[0];
                  var existingObject = _this.getFabricObjectByUuid(objectCandidate.id);
                  if (existingObject) {
                    existingObject.bypassRemoveEvent = true;
                    existingObject.bypassHistory = true;
                    _this.canvas.remove(existingObject);
                  }
                  object.bypassHistory = true;
                  _this.canvas.add(object);
                  object.bypassHistory = false;
                });
              } else if (action.type === 'canvas_cleared') {
                _this.canvas.clear();
                  _this.socket.emit("drawClear", roomid);
              }
            // this.action = true;
            // if (this.index >= this.state.length - 1) {
            //     return;
            // }
            //this.index++;
            //console.log('redo');
            //var lastObj = this.list[this.index],
            //    optObj = this.getObjectById(lastObj),
            //    stateType = this.stateType[this.index];
            //console.log(this.index, stateType, this.stateType);
            //if(!optObj && stateType != "remove") return false;
            //if(stateType == "mod"){
            //    //if (this.index >= this.state.length-1) {
            //    //    return;
            //    //}
            //    this.index2 = this.index;
            //    this.current = this.list[this.index2];
            //    this.current.setOptions(JSON.parse(this.state[this.index2]));
            //    this.current.setCoords();
            //    //this.index++;
            //}else if(stateType == "add"){
            //    if(!!optObj){
            //        this.canvas.stateRemove(optObj);
            //    }
            //}else if(stateType == "remove"){
            //    if(!!lastObj){
            //        this.canvas.add(lastObj);
            //    }
            //}
            ////this.index++;
            //this.canvas.renderAll();
            //this.drawUpdate("redo");

            // this.index2 = this.index + 1;
            // this.current = this.list[this.index2];
            // this.current.setOptions(JSON.parse(this.state[this.index2]));

            // this.index++;
            // this.current.setCoords();
            // this.canvas.renderAll();
            // this.drawUpdate("redo");

            //this.index++;
            //this.socket.emit("history", 1001, this.index);

            //if(this.index > 0){
            //    this.canvas.loadFromJSON(this.state[this.state.length - 1 - this.index + 1]);
            //    this.canvas.renderAll();
            //    this.index = this.index - 1;
            //    this.drawUpdate();
            //}
        },

        scale : function(value){
            var scaleValue = fabric.util.toFixed(value, 2);
            for (var canvasObjects = this.canvas.getObjects(), i = canvasObjects.length; i--; ) {
                canvasObjects[i].scaleX *= scaleValue;
                canvasObjects[i].scaleY *= scaleValue;
                canvasObjects[i].left *= scaleValue;
                canvasObjects[i].top *= scaleValue;
            }
            this.el.attr("scale", value);
            this.canvas.renderAll();
        },

        getCenter : function(objWidth, objHeight){
            //console.log(this.el.innerHeight(),this.toolbar.innerHeight());
            objWidth = !!objWidth ? objWidth : 0;
            objHeight = !!objHeight ? objHeight : 0;
            return{
                y : (this.el.innerHeight()-this.toolbar.innerHeight()-objHeight)/2,
                x : (this.el.innerWidth()-objWidth)/2
            }
        },

        /**
         * 放大
         */
        zoomIn : function(){
            var scale = !!this.el.attr("scale") ? this.el.attr("scale") : 1;
            //scale = scale*1 + 1;
            scale = this.canvas.getZoom();
            this.canvas.setZoom(scale*1+0.1, this.getCenter());
            this.disabledLine();
            this.draging = false;
            this.erasering = false;
            this.canvas.selection = true;
            this.canvas.interactive = true;
            this.canvas.renderAll();
            this.drawUpdate("zoom");
        },
        /**
         * 缩小
         */
        zoomOut : function(){
            var scale = !!this.el.attr("scale") ? this.el.attr("scale") : 1;
            scale = this.canvas.getZoom();
            scale = (scale-0.1).toFixed(1);
            if(scale > 0){
                this.canvas.setZoom(scale, this.getCenter());
            }
            this.disabledLine();
            this.canvas.selection = true;
            this.canvas.interactive = true;
            this.draging = false;
            this.erasering = false;
            this.canvas.renderAll();
            this.drawUpdate("zoom");
        },

        /**
         * 获取元素初始化中心位置
         */
        getObjectCenter : function(objWidth,objHeight){
            var center = this.getCenter(objWidth,objHeight);
            return {
                x: center.x+(1-this.getZoom())*center.x-this.canvas.viewportTransform[4],
                y:center.y+(1-this.getZoom())*center.y-this.canvas.viewportTransform[5]
            }
        },

        text : function(){
            var textSample = new fabric.IText('请输入文字', {
                    left: this.getObjectCenter(200,50).x,
                    top: this.getObjectCenter(200,50).y,
                    fontFamily: 'helvetica',
                    //angle: getRandomInt(-10, 10),
                    fill: 'black',
                    fontWeight: '',
                    originX: 'left',
                    hasRotatingPoint: true,
                    centerTransform: true,
                    selectable : true,
                    isEditing : true
                });
                this.canvas.add(textSample);
                this.is('Text');
        },

        shape : function(){
            //var e = event || window.event || arguments.callee.caller.arguments[0];
            //var target = $(e.target).closest(".shape");
            //target.addClass("active").siblings().removeClass("active");
            //this.disabledLine();
            //this.canvas.selection = true;
            //this.canvas.interactive = true;
            //this.draging = false;
            //this.erasering = false;
            this.is('Shape');
            this.setShapeTools(true);
        },

        eraserAll : function(){
            var _cfm = confirm("你确定清空白板吗？");
            if(!!this.canvas && !!_cfm){
                if (!this.canvas.bypassHistory) {
                    actionHistory.push({
                        type: 'canvas_cleared',
                        canvas: JSON.stringify(this.canvas)
                    });
                }
                this.canvas.clear();
                this.socket.emit("drawClear", roomid);
            }
        },

        pptColor : function(state){
            if(!!state){
                this.el.find("#line-color").show();
            }else{
                this.el.find("#line-color").hide();
            }
        },

        pptWidth : function(state){
            if(!!state){
                this.el.find("#line-width").show();
            }else{
                this.el.find("#line-width").hide();
            }
        },

        lineColor : function(){
            //ppt 显示颜色
            this.pptColor(true);
        },

        lineWidth : function(){
            //ppt 显示线层
            this.pptWidth(true);
        },

        pencil : function(){
            this.is('Pencil');
            this.setPenTools(true);
        },

        setColor : function(color){
            if(!!color && this.options.channel == "ppt"){
                this.$penColor.removeClass().addClass("ppt-color "+color+"");
                this.pptColor(false);
            }
        },

        setLineWidth : function(){
            if(this.options.channel == "ppt"){
                this.pptWidth(false);
            }
        },

        purple : function(){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            var target = $(e.target).closest(".purple");
            target.addClass("active").siblings().removeClass("active");
            this.canvas.freeDrawingBrush.color = "purple";
            this.options.channel == "ppt" && this.setColor("purple");
        },

        gray : function(){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            var target = $(e.target).closest(".gray");
            target.addClass("active").siblings().removeClass("active");
            this.canvas.freeDrawingBrush.color = "gray";
            this.options.channel == "ppt" && this.setColor("gray");
        },

        orange : function(){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            var target = $(e.target).closest(".orange");
            target.addClass("active").siblings().removeClass("active");
            this.canvas.freeDrawingBrush.color = "orange";
            this.options.channel == "ppt" && this.setColor("orange");
        },

        green : function(){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            var target = $(e.target).closest(".green");
            target.addClass("active").siblings().removeClass("active");
            this.canvas.freeDrawingBrush.color = "green";
            this.options.channel == "ppt" && this.setColor("green");
        },

        red : function(){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            var target = $(e.target).closest(".red");
            target.addClass("active").siblings().removeClass("active");
            this.canvas.freeDrawingBrush.color = "red";
            this.options.channel == "ppt" && this.setColor("red");
        },

        blue : function(){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            var target = $(e.target).closest(".blue");
            target.addClass("active").siblings().removeClass("active");
            this.canvas.freeDrawingBrush.color = "blue";
            this.options.channel == "ppt" && this.setColor("blue");
        },

        black : function(){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            var target = $(e.target).closest(".black");
            target.addClass("active").siblings().removeClass("active");
            this.canvas.freeDrawingBrush.color = "black";
            this.options.channel == "ppt" && this.setColor("black");
        },

        thick : function(){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            var target = $(e.target).closest(".thick");
            target.addClass("active").siblings().removeClass("active");
            this.canvas.freeDrawingBrush.width = 16;
            this.options.channel == "ppt" && this.setLineWidth();
        },

        medium : function(){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            var target = $(e.target).closest(".medium");
            target.addClass("active").siblings().removeClass("active");
            this.canvas.freeDrawingBrush.width = 8;
            this.options.channel == "ppt" && this.setLineWidth();
        },

        fine : function(){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            var target = $(e.target).closest(".fine");
            target.addClass("active").siblings().removeClass("active");
            this.canvas.freeDrawingBrush.width = 4;
            this.options.channel == "ppt" && this.setLineWidth();
        },

        thin : function(){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            var target = $(e.target).closest(".thin");
            target.addClass("active").siblings().removeClass("active");
            this.canvas.freeDrawingBrush.width = 2;
            this.options.channel == "ppt" && this.setLineWidth();
        },

        line : function(){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            var target = $(e.target).closest(".line");
            target.addClass("active").siblings().removeClass("active");
            if(!!this.canvas){
                this.canvas.add(new fabric.Line([ 50, 100, 200, 200], {
                    id: getRandomId(),
                    left: this.getObjectCenter(150,100).x,
                    top: this.getObjectCenter(150,100).y,
                    stroke: 'black'
                }));
            }
            this.disabledLine();
        },

        triangle : function(){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            var target = $(e.target).closest(".triangle");
            target.addClass("active").siblings().removeClass("active");
            if(!!this.canvas){
                this.canvas.add(new fabric.Triangle({
                    id: getRandomId(),
                    width: 50,
                    height: 50,
                    left: this.getObjectCenter(50,50).x,
                    top: this.getObjectCenter(50,50).y,
                    fill: '#f0f0f0',
                    strokeWidth: 1, 
                    stroke: "black"
                }));
            }
            this.disabledLine();
        },

        rect : function(){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            var target = $(e.target).closest(".square");
            target.addClass("active").siblings().removeClass("active");
            var zoom = this.getZoom();
            //console.log(this.canvas.viewportTransform, this.getCenter());
            if(!!this.canvas){
                this.canvas.add(new fabric.Rect({
                    id: getRandomId(),
                    width: 50,
                    height: 50,
                    lockUniScaling:true,
                    left: this.getObjectCenter(50,50).x,
                    top: this.getObjectCenter(50,50).y,
                    fill: '#f0f0f0',
                    strokeWidth: 1, 
                    stroke: "black"
                }));
            }
            this.disabledLine();
        },

        circle : function(){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            var target = $(e.target).closest(".circle");
            target.addClass("active").siblings().removeClass("active");
            if(!!this.canvas){
                this.canvas.add(new fabric.Circle({
                    id: getRandomId(),
                    radius: 40,
                    left: this.getObjectCenter(50,50).x,
                    top: this.getObjectCenter(50,50).y,
                    fill: '#f0f0f0',
                    strokeWidth: 1, 
                    stroke: "black"
                    //opacity: 0.5
                }));
            }
        },

        image : function(){
            var _this = this;
            var selector = new FileSelector();
            selector.selectSingleFile(function(file) {
                var reader = new FileReader();
                reader.onload = function(event) {
                    var img = new Image();
                    img.onload = function() {
                        var _w = this.width, _h = this.height,
                            canvas_w = _this.canvas.width,
                            canvas_h = _this.canvas.height;

                        var attr = getImageSize(_w, _h, canvas_w/3, canvas_h/3),
                            centerXY = _this.getObjectCenter(attr.Width,attr.Height);

                        if(!!img){
                            fabric.Image.fromURL(event.target.result, function(image) {
                              image.set({
                                  id: getRandomId(),
                                  width: attr.Width,
                                  height: attr.Height,
                                  left: centerXY.x,
                                  top: centerXY.y,
                                  angle: 0
                              })
                              .setCoords();
                              _this.canvas.add(image);
                            });
                        }
                    };
                    img.src = event.target.result;
                };
                
                reader.readAsDataURL(file);
            });
            
            this.is('Image');
        },
        toimage:function(){
            var _this = this;
            window.open(_this.canvas.toDataURL('png'));
        }
    };
    var FileSelector = function() {
        var selector = this;

        selector.selectSingleFile = selectFile;
        selector.selectMultipleFiles = function(callback) {
            selectFile(callback, true);
        };

        function selectFile(callback, multiple) {
            var file = document.createElement('input');
            file.type = 'file';
            file.accept = "image/*";

            if (multiple) {
                file.multiple = true;
            }

            file.onchange = function() {
                if (multiple) {
                    if (!file.files.length) {
                        console.error('No file selected.');
                        return;
                    }
                    callback(file.files);
                    return;
                }

                if (!file.files[0]) {
                    console.error('No file selected.');
                    return;
                }

                callback(file.files[0]);

                file.parentNode.removeChild(file);
            };
            file.style.display = 'none';
            (document.body || document.documentElement).appendChild(file);
            fireClickEvent(file);
        }

        function fireClickEvent(element) {
            var evt = new window.MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                button: 0,
                buttons: 0,
                mozInputSource: 1
            });

            var fired = element.dispatchEvent(evt);
        }
    };

    $.fn.Draw = function (option) {
        return this.each(function() {
            var $this = $(this)
                , data = $this.data('Draw')
                , options = typeof option == 'object' && option;
            if (!data) {
                $this.data('Draw', (data = new Draw(this, options)));
            }else{
                data.reset(options);
            }
            if (typeof option == 'string') data[option]();
        });
    };

    $.fn.Draw.defaults = {
        channel:'',
        roomid:1001,
        uid:getRandomId(),
        canvasid:'canvas',
        defaultTool:'pen',
        width : 0,
        height : 0,
        tools:{
            image:true,
            move : true,
            selection: false,
            text:true,
            eraser:true,
            zoomin:true,
            zoomout:true,
            undo:true,
            redo:true,
            pen:true,
            rect:true,
            circle:true,
            triangle:true,
            line:true,
            eraserall:true,
            toimage:true,
            shape:true
        }
    };
})(window.jQuery);