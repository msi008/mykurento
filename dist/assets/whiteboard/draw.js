function SimpleStackException(a){this.message=a,this.name="SimpleStackException"}function SimpleStack(){var a=2048,b=this;b.sp=-1,b.entries=[],b.push=function(c){if(b.sp>a-1)throw new SimpleStackException("Can not push on a full stack.");b.sp++,b.entries[b.sp]=c,b.entries.splice(b.sp+1,b.entries.length)},b.pop=function(){if(b.sp<0)throw new SimpleStackException("Can not pop from an empty stack.");var a=b.entries[b.sp];return b.sp--,a},b.reversePop=function(){if(b.sp++,!b.entries[b.sp])throw b.sp--,new SimpleStackException("Can not reverse pop an entry that has never been created.");return b.entries[b.sp]}}function generateUuid(){var a=4294967295*Math.random()|0,b=4294967295*Math.random()|0,c=4294967295*Math.random()|0,d=4294967295*Math.random()|0;return lut[255&a]+lut[a>>8&255]+lut[a>>16&255]+lut[a>>24&255]+"-"+lut[255&b]+lut[b>>8&255]+"-"+lut[b>>16&15|64]+lut[b>>24&255]+"-"+lut[63&c|128]+lut[c>>8&255]+"-"+lut[c>>16&255]+lut[c>>24&255]+lut[255&d]+lut[d>>8&255]+lut[d>>16&255]+lut[d>>24&255]}for(var actionHistory=new SimpleStack,lut=[],i=0;i<256;i++)lut[i]=(i<16?"0":"")+i.toString(16);var is={isMove:!1,isArc:!1,isPencil:!1,isShape:!1,isRectangle:!1,isEraser:!1,isText:!1,set:function(a){var b=this;b.isLine=b.isArc=b.isMove=b.isPencil=b.isRectangle=b.isEraser=b.isText=b.isZoomIn=b.isZoomOut=isImage=!1,b["is"+a]=!0}};!function(a){var b=function(b,c){this.el=a(b),this.options=a.extend(a.fn.Draw.defaults,c);var d=this.options.width||window.screen.width,e=this.options.height||window.screen.height,f=createToolsBar(this.options.canvasid,d,e,this.options);this.el.append(f),this._init(),this._addEvents(),this._initSocket()};b.prototype={_init:function(){var b=this;this.canvas=new fabric.Canvas(this.options.canvasid);for(var c in this.options.tools)switch(c){case"circle":b.$circle=b.el.find(".shape-item.circle"),b.$circle.on("click",a.proxy(b.circle,b));break;case"rect":b.$rect=b.el.find(".shape-item.square"),b.$rect.on("click",a.proxy(b.rect,b));break;case"triangle":b.$triangle=b.el.find(".shape-item.triangle"),b.$triangle.on("click",a.proxy(b.triangle,b));break;case"line":b.$line=b.el.find(".shape-item.line"),b.$line.on("click",a.proxy(b.line,b));break;case"pen":this.$pencil=this.el.find(".tool-item.pen"),this.$pencil.on("click",a.proxy(b.pencil,b)),this.$black=this.el.find(".color-item.black"),this.$black.on("click",a.proxy(this.black,this)),this.$blue=this.el.find(".color-item.blue"),this.$blue.on("click",a.proxy(this.blue,this)),this.$red=this.el.find(".color-item.red"),this.$red.on("click",a.proxy(this.red,this)),this.$green=this.el.find(".color-item.green"),this.$green.on("click",a.proxy(this.green,this)),this.$orange=this.el.find(".color-item.orange"),this.$orange.on("click",a.proxy(this.orange,this)),this.$gray=this.el.find(".color-item.gray"),this.$gray.on("click",a.proxy(this.gray,this)),this.$purple=this.el.find(".color-item.purple"),this.$purple.on("click",a.proxy(this.purple,this)),this.$thin=this.el.find(".brush-item.thin"),this.$thin.on("click",a.proxy(this.thin,this)),this.$fine=this.el.find(".brush-item.fine"),this.$fine.on("click",a.proxy(this.fine,this)),this.$medium=this.el.find(".brush-item.medium"),this.$medium.on("click",a.proxy(this.medium,this)),this.$thick=this.el.find(".brush-item.thick"),this.$thick.on("click",a.proxy(this.thick,this));break;case"undo":b.$undo=b.el.find(".tool-item.go-back"),b.$undo.on("click",a.proxy(b.undo,b));break;case"redo":b.$redo=b.el.find(".tool-item.go-forward"),b.$redo.on("click",a.proxy(b.redo,b));break;case"zoomin":b.$zoomin=b.el.find(".tool-item.enlarge"),b.$zoomin.on("click",a.proxy(b.zoomIn,b));break;case"zoomout":b.$zoomout=b.el.find(".tool-item.reduce"),b.$zoomout.on("click",a.proxy(b.zoomOut,b));break;case"eraser":b.$eraser=b.el.find(".tool-item.eraser"),b.$eraser.on("click",a.proxy(b.eraser,b));break;case"move":b.$drag=this.el.find(".tool-item.move"),b.$drag.on("click",a.proxy(this.drag,b));break;case"selection":b.$selection=this.el.find(".tool-item.selector"),b.$selection.on("click",a.proxy(this.selection,b));break;case"text":b.$text=b.el.find(".tool-item.text"),b.$text.on("click",a.proxy(this.text,b));break;case"eraserall":b.$eraserall=b.el.find(".tool-item.eraser-all"),b.$eraserall.on("click",a.proxy(this.eraserAll,b));break;case"image":b.$image=b.el.find(".tool-item.add-picture"),b.$image.on("click",a.proxy(this.image,b));break;case"toimage":b.$toimage=b.el.find(".tool-item.save"),b.$toimage.on("click",a.proxy(this.toimage,b));break;case"shape":b.$shape=b.el.find(".tool-item.shape"),b.$shape.on("click",a.proxy(this.shape,b))}this.is("Pencil"),this.current="",this.list=[],this.state=[],this.index=0,this.index2=0,this.action=!1,this.refresh=!0,this.draging=!1,this.moveing=!1,this.erasering=!1,this.currentX=0,this.currentY=0,this.rendering=!1,this.clear(),this.canvas.remove(this.canvas.getActiveObject()),this.toolbar=this.el.find("#drawToolbar")},isEraser:!1,isMove:!1,isSelection:!1,isShape:!1,isPencil:!0,isText:!1,is:function(b){var c,d=this;d.isEraser?(this.disabledLine(),this.canvas.selection=!0,this.canvas.interactive=!0,this.draging=!0,this.erasering=!1):d.isMove?(this.disabledLine(),this.canvas.selection=!0,this.canvas.interactive=!1,this.draging=!1,this.erasering=!0):d.isShape?(this.disabledLine(),this.canvas.selection=!1,this.canvas.interactive=!1,this.draging=!0,this.erasering=!0):d.isPencil?(this.canvas.isDrawingMode=!1,this.draging=!0,this.erasering=!0,this.canvas.selection=!1,this.canvas.interactive=!1):d.isText?(this.disabledLine(),this.canvas.selection=!1,this.canvas.interactive=!1,this.draging=!0,this.erasering=!0):d.isSelection?(this.disabledLine(),this.canvas.selection=!1,this.canvas.interactive=!1,this.draging=!0,this.erasering=!0):d.isImage&&(this.disabledLine(),this.canvas.selection=!1,this.canvas.interactive=!1,this.draging=!0,this.erasering=!0),d.isLine=d.isArc=d.isMove=d.isPencil=d.isRectangle=d.isEraser=d.isText=d.isSelection=d.isShape=!1,d["is"+b]=!0,d.isEraser?(this.disabledLine(),this.canvas.selection=!1,this.canvas.interactive=!1,this.draging=!1,this.erasering=!0,c=".eraser"):d.isMove?(this.disabledLine(),this.canvas.selection=!1,this.canvas.interactive=!0,this.draging=!0,this.erasering=!1,c=".move"):d.isSelection?(this.disabledLine(),this.canvas.selection=!0,this.canvas.interactive=!0,this.draging=!1,this.erasering=!1,c=".selector"):d.isShape?(this.disabledLine(),this.canvas.selection=!0,this.canvas.interactive=!0,this.draging=!1,this.erasering=!1,c=".shape"):d.isPencil?(this.canvas.isDrawingMode=!0,this.draging=!1,this.erasering=!1,this.canvas.selection=!0,this.canvas.interactive=!0,c=".pen"):d.isText?(this.disabledLine(),this.canvas.selection=!0,this.canvas.interactive=!0,this.draging=!1,this.erasering=!1,c=".text"):d.isImage&&(this.disabledLine(),this.canvas.selection=!0,this.canvas.interactive=!0,this.draging=!1,this.erasering=!1,c=".add-picture"),d.isPencil||this.$pencil.find(".pen-list").hide();var e=event||window.event||arguments.callee.caller.arguments[0],f=a(e.target).closest(c);f.addClass("active").siblings().removeClass("active")},getFabricObjectByUuid:function(a){var b=null;return this.canvas.getObjects().forEach(function(c){"undefined"!=typeof c.id&&c.id===a&&(b=c)}),b},_initSocket:function(){var a=this;"undefined"!=typeof io&&(this.socket=io.connect("https://glbl.hoozha.com:13000")),this.socket.emit("drawstart",roomid),this.socket.emit("getDraw",roomid).on("getDraw",function(b){if(a.canvas.isDrawingMode=!0,b){var c=JSON.parse(b);"undefined"==typeof c.zoom?1:c.zoom,"undefined"==typeof c.transX?a.canvas.viewportTransform[4]:c.transX,"undefined"==typeof c.transY?a.canvas.viewportTransform[5]:c.transY;c.objects.complete=!0,a.canvas.loadFromJSON(c,a.canvas.renderAll.bind(a.canvas))}else a.canvas.loadFromJSON({});a.canvas.renderAll(),a.index=0}),this.socket.on("drawUpdate",function(b,c){console.log("更新数据: "+b),a.rendering=!0;var d=null,e=1,f=a.canvas.viewportTransform[4],g=a.canvas.viewportTransform[5];c&&(d=JSON.parse(c),e="undefined"==typeof d.zoom?1:d.zoom,f="undefined"==typeof d.transX?f:d.transX,g="undefined"==typeof d.transY?g:d.transY,d.objects.complete=!0,d.ptype=b),a.canvas.loadFromJSON(d,a.canvas.renderAll.bind(a.canvas)),"drag"==b&&a.canvas.setViewportTransform([e,0,0,e,f,g],b),"zoom"==b&&a.canvas.setZoom(e,a.getCenter(),b),a.canvas.renderAll(b)}),this.socket.on("drawClear",function(b){a.clear()}),this.socket.on("modified",function(b){if(b){var c=JSON.parse(b),d=a.toKlass(c);d.canvas=a.canvas,d.remove(),a.canvas.added(d)}}),this.socket.on("added",function(b){if(b){var c=JSON.parse(b),d=a.toKlass(c);a.canvas.added(d)}})},addObj:function(a){if(a){var b=JSON.parse(a),c=this.toKlass(b);this.canvas.added(c),this.canvas.renderAll()}},toKlass:function(a){var b=null;if(a){var c=fabric.util.getKlass(a.type);c.async?c.fromObject(a,function(a,c){c||(b=a)}):b=c.fromObject(a)}return b},_addEvents:function(){var b=this;this.canvas.on("object:added",function(a){var c=a.target;c.uuid||(c.uuid=generateUuid()),c.bypassHistory||actionHistory.push({type:"object_added",object:JSON.stringify(c)}),b.drawUpdate("added")}),this.canvas.on("object:modified",function(a){console.log("modified");var c=a.target;"undefined"==typeof latestTouchedObject&&(latestTouchedObject=fabric.util.object.clone(c)),actionHistory.push({type:"object_modified",objectOld:JSON.stringify(latestTouchedObject),objectNew:JSON.stringify(c)}),b.drawUpdate("modified")}),this.canvas.on("object:scaling",function(a){console.log(a.target)}),this.canvas.on("text:changed",function(a){var c=a.target;actionHistory.push({type:"text_changed",objectOld:JSON.stringify(latestTouchedObject),objectNew:JSON.stringify(c)}),b.drawUpdate("modified")}),this.canvas.on("object:removed",function(a){var c=a.target;c.bypassHistory||actionHistory.push({type:"object_removed",object:JSON.stringify(c)}),b.drawUpdate("removed")}),this.canvas.on("canvas:cleared",function(a){}),this.canvas.on("mouse:down",function(a){a.target&&(latestTouchedObject=fabric.util.object.clone(a.target))}),this.canvas.on("object:selected",function(a){}),this.canvas.on("mouse:over",function(a){b.isEraser?a.target.selectable=!1:a.target.selectable=!0,b.erasering&&b.moveing&&b.canvas.remove(a.target)}),this.canvas.on("mouse:move",function(a){b.erasering&&b.moveing&&b.canvas.remove(a.target)}),this.canvas.on("mouse:out",function(a){b.erasering&&b.moveing&&b.canvas.remove(a.target)}),this.canvas.on("mouse:up",a.proxy(this._mouseUp,this)),this.canvas.on("mouse:down",a.proxy(this._mouseDown,this)),this.canvas.on("mouse:move",a.proxy(this._mouseMove,this)),this.canvas.on("after:render",function(a){this.calcOffset(),"complete"==a&&(b.rendering=!1,console.log("加载完成"))}),window.onresize=function(){}},setSize:function(a,b){a&&b&&(this.canvas.setWidth(a),this.canvas.setHeight(b))},saveState:function(a,b){var c=a.target;this.action===!0&&(this.state=[this.state[this.index2]],this.list=[this.list[this.index2]],this.action=!1,this.index=1),c.saveState(),this.state[this.index]=JSON.stringify(c.originalState),c.optype=b,this.list[this.index]=c,this.index++,this.index2=this.index-1,this.refresh=!0},clear:function(){this.canvas&&this.canvas.clear()},reset:function(){var a=createToolsBar(this.options.canvasid,1e3,1e3,this.options);this.el.html(a)},added:function(a){this.socket&&a&&this.socket.emit("added",roomid,JSON.stringify(a))},modified:function(a){this.socket&&!this.rendering&&a&&this.socket.emit("modified",roomid,JSON.stringify(a))},getZoom:function(){return this.canvas?this.canvas.getZoom():1},drawUpdate:function(a,b,c){if(console.log("发送数据: "+a),this.socket){var d=this.canvas.toJSON();d.zoom=this.canvas.getZoom(),"undefined"!=typeof b&&(d.transX=b),"undefined"!=typeof c&&(d.transY=c),this.socket.emit("drawUpdate",roomid,a,JSON.stringify(d))}},disabledLine:function(){this.canvas.isDrawingMode=!1},eraser:function(){this.is("Eraser")},setPenTools:function(a){a?this.$pencil.find(".pen-list").show():this.$pencil.find(".pen-list").hide()},setShapeTools:function(a){a?this.$shape.find(".shape-list").show():this.$shape.find(".shape-list").hide()},getActiveObject:function(){return this.canvas?this.canvas.getActiveObject():null},_mouseMove:function(a){var b=event||arguments.callee.caller.arguments[0];if(this.draging&&this.moveing&&!this.getActiveObject()){var c=a.e.clientX,d=a.e.clientY,e=c-this.currentX,f=d-this.currentY,g=this.getZoom();this.canvas.setViewportTransform([g,0,0,g,e,f],"drag")}this.erasering&&this.moveing&&this.canvas.findTarget(b)},_mouseDown:function(a){var b=event||arguments.callee.caller.arguments[0];if(this.draging){var c=this.canvas.viewportTransform[4],d=this.canvas.viewportTransform[5];this.currentX=b.clientX-c,this.currentY=b.clientY-d}this.moveing=!0,this.isPencil&&this.setPenTools(!1),this.isShape&&this.setShapeTools(!1)},_mouseUp:function(a){if(this.draging&&this.moveing&&!this.getActiveObject()){var b=this.canvas.viewportTransform[4],c=this.canvas.viewportTransform[5];this.drawUpdate("drag",b,c)}this.moveing=!1},drag:function(){this.is("Move")},selection:function(){this.is("Selection")},updateModifications:function(){var a=this.canvas.toJSON();a.objects.complete=!0,this.state.push(a)},getObjectById:function(a){var b=null;return a&&"undefined"!=typeof a.id&&this.canvas.getObjects().forEach(function(c){if("undefined"!=typeof c.id&&c.id==a.id)return b=c}),b},drawRender:function(a,b){var c=this;if(fabric.util.enlivenObjects([a],function(d){var e=d[0];if("added"==b)c.canvas.added(e);else if("modified"==b){var f=c.getFabricObjectByUuid(a.id);f&&c.canvas.remove(f),c.canvas.added(e)}}),"removed"==b){var d=c.getFabricObjectByUuid(a.id);c.canvas.removed(d,!0)}},undo:function(){var a,b,c=this;try{a=actionHistory.pop()}catch(a){return void console.log(a.message)}if(console.log("undo"),"object_added"===a.type){b=JSON.parse(a.object);var d=this.getFabricObjectByUuid(b.id);d.bypassHistory=!0,c.canvas.remove(d)}else if("object_removed"===a.type)b=JSON.parse(a.object),fabric.util.enlivenObjects([b],function(a){a[0].id=b.id;var d=a[0];d.bypassHistory=!0,c.canvas.add(d),d.bypassHistory=!1});else if("object_modified"===a.type||"text_changed"===a.type)b=JSON.parse(a.objectOld),fabric.util.enlivenObjects([b],function(a){a[0].id=b.id;var d=a[0],e=c.getFabricObjectByUuid(b.id);e&&(e.bypassRemoveEvent=!0,e.bypassHistory=!0,c.canvas.remove(e)),d.bypassHistory=!0,c.canvas.add(d),d.bypassHistory=!1});else if("canvas_cleared"===a.type){var e=JSON.parse(a.canvas);c.canvas.bypassHistory=!0,c.canvas.loadFromJSON(e),c.canvas.renderAll(),c.canvas.bypassHistory=!1,c.drawUpdate("added")}},redo:function(){var a,b,c=this;try{a=actionHistory.reversePop()}catch(a){return void console.log(a.message)}if("object_added"===a.type)b=JSON.parse(a.object),fabric.util.enlivenObjects([b],function(a){a[0].id=b.id;var d=a[0];d.bypassHistory=!0,c.canvas.add(d),d.bypassHistory=!1});else if("object_removed"===a.type){b=JSON.parse(a.object);var d=c.getFabricObjectByUuid(b.id);d.bypassHistory=!0,c.canvas.remove(d),d.bypassHistory=!1}else"object_modified"===a.type||"text_changed"===a.type?(b=JSON.parse(a.objectNew),fabric.util.enlivenObjects([b],function(a){a[0].id=b.id;var d=a[0],e=c.getFabricObjectByUuid(b.id);e&&(e.bypassRemoveEvent=!0,e.bypassHistory=!0,c.canvas.remove(e)),d.bypassHistory=!0,c.canvas.add(d),d.bypassHistory=!1})):"canvas_cleared"===a.type&&(c.canvas.clear(),c.socket.emit("drawClear",roomid))},scale:function(a){for(var b=fabric.util.toFixed(a,2),c=this.canvas.getObjects(),d=c.length;d--;)c[d].scaleX*=b,c[d].scaleY*=b,c[d].left*=b,c[d].top*=b;this.el.attr("scale",a),this.canvas.renderAll()},getCenter:function(a,b){return a=a?a:0,b=b?b:0,{y:(this.el.innerHeight()-this.toolbar.innerHeight()-b)/2,x:(this.el.innerWidth()-a)/2}},zoomIn:function(){var a=this.el.attr("scale")?this.el.attr("scale"):1;a=this.canvas.getZoom(),this.canvas.setZoom(1*a+.1,this.getCenter()),this.disabledLine(),this.draging=!1,this.erasering=!1,this.canvas.selection=!0,this.canvas.interactive=!0,this.canvas.renderAll(),this.drawUpdate("zoom")},zoomOut:function(){var a=this.el.attr("scale")?this.el.attr("scale"):1;a=this.canvas.getZoom(),a=(a-.1).toFixed(1),a>0&&this.canvas.setZoom(a,this.getCenter()),this.disabledLine(),this.canvas.selection=!0,this.canvas.interactive=!0,this.draging=!1,this.erasering=!1,this.canvas.renderAll(),this.drawUpdate("zoom")},getObjectCenter:function(a,b){var c=this.getCenter(a,b);return{x:c.x+(1-this.getZoom())*c.x-this.canvas.viewportTransform[4],y:c.y+(1-this.getZoom())*c.y-this.canvas.viewportTransform[5]}},text:function(){var a=new fabric.IText("请输入文字",{left:this.getObjectCenter(200,50).x,top:this.getObjectCenter(200,50).y,fontFamily:"helvetica",fill:"black",fontWeight:"",originX:"left",hasRotatingPoint:!0,centerTransform:!0,selectable:!0,isEditing:!0});this.canvas.add(a),this.is("Text")},shape:function(){this.is("Shape"),this.setShapeTools(!0)},eraserAll:function(){var a=confirm("你确定清空白板吗？");this.canvas&&a&&(this.canvas.bypassHistory||actionHistory.push({type:"canvas_cleared",canvas:JSON.stringify(this.canvas)}),this.canvas.clear(),this.socket.emit("drawClear",roomid))},pencil:function(){this.is("Pencil"),this.setPenTools(!0)},purple:function(){var b=event||window.event||arguments.callee.caller.arguments[0],c=a(b.target).closest(".purple");c.addClass("active").siblings().removeClass("active"),this.canvas.freeDrawingBrush.color="purple"},gray:function(){var b=event||window.event||arguments.callee.caller.arguments[0],c=a(b.target).closest(".gray");c.addClass("active").siblings().removeClass("active"),this.canvas.freeDrawingBrush.color="gray"},orange:function(){var b=event||window.event||arguments.callee.caller.arguments[0],c=a(b.target).closest(".orange");c.addClass("active").siblings().removeClass("active"),this.canvas.freeDrawingBrush.color="orange"},green:function(){var b=event||window.event||arguments.callee.caller.arguments[0],c=a(b.target).closest(".green");c.addClass("active").siblings().removeClass("active"),this.canvas.freeDrawingBrush.color="green"},red:function(){var b=event||window.event||arguments.callee.caller.arguments[0],c=a(b.target).closest(".red");c.addClass("active").siblings().removeClass("active"),this.canvas.freeDrawingBrush.color="red"},blue:function(){var b=event||window.event||arguments.callee.caller.arguments[0],c=a(b.target).closest(".blue");c.addClass("active").siblings().removeClass("active"),this.canvas.freeDrawingBrush.color="blue"},black:function(){var b=event||window.event||arguments.callee.caller.arguments[0],c=a(b.target).closest(".black");c.addClass("active").siblings().removeClass("active"),this.canvas.freeDrawingBrush.color="black"},thick:function(){var b=event||window.event||arguments.callee.caller.arguments[0],c=a(b.target).closest(".thick");c.addClass("active").siblings().removeClass("active"),this.canvas.freeDrawingBrush.width=16},medium:function(){var b=event||window.event||arguments.callee.caller.arguments[0],c=a(b.target).closest(".medium");c.addClass("active").siblings().removeClass("active"),this.canvas.freeDrawingBrush.width=8},fine:function(){var b=event||window.event||arguments.callee.caller.arguments[0],c=a(b.target).closest(".fine");c.addClass("active").siblings().removeClass("active"),this.canvas.freeDrawingBrush.width=4},thin:function(){var b=event||window.event||arguments.callee.caller.arguments[0],c=a(b.target).closest(".thin");c.addClass("active").siblings().removeClass("active"),this.canvas.freeDrawingBrush.width=2},line:function(){var b=event||window.event||arguments.callee.caller.arguments[0],c=a(b.target).closest(".line");c.addClass("active").siblings().removeClass("active"),this.canvas&&this.canvas.add(new fabric.Line([50,100,200,200],{id:getRandomId(),left:this.getObjectCenter(150,100).x,top:this.getObjectCenter(150,100).y,stroke:"black"})),this.disabledLine()},triangle:function(){var b=event||window.event||arguments.callee.caller.arguments[0],c=a(b.target).closest(".triangle");c.addClass("active").siblings().removeClass("active"),this.canvas&&this.canvas.add(new fabric.Triangle({id:getRandomId(),width:50,height:50,left:this.getObjectCenter(50,50).x,top:this.getObjectCenter(50,50).y,fill:"#f0f0f0",strokeWidth:1,stroke:"black"})),this.disabledLine()},rect:function(){var b=event||window.event||arguments.callee.caller.arguments[0],c=a(b.target).closest(".square");c.addClass("active").siblings().removeClass("active");this.getZoom();this.canvas&&this.canvas.add(new fabric.Rect({id:getRandomId(),width:50,height:50,lockUniScaling:!0,left:this.getObjectCenter(50,50).x,top:this.getObjectCenter(50,50).y,fill:"#f0f0f0",strokeWidth:1,stroke:"black"})),this.disabledLine()},circle:function(){var b=event||window.event||arguments.callee.caller.arguments[0],c=a(b.target).closest(".circle");c.addClass("active").siblings().removeClass("active"),this.canvas&&this.canvas.add(new fabric.Circle({id:getRandomId(),radius:40,left:this.getObjectCenter(50,50).x,top:this.getObjectCenter(50,50).y,fill:"#f0f0f0",strokeWidth:1,stroke:"black"}))},image:function(){var a=this,b=new c;b.selectSingleFile(function(b){var c=new FileReader;c.onload=function(b){var c=new Image;c.onload=function(){var d=this.width,e=this.height,f=a.canvas.width,g=a.canvas.height,h=getImageSize(d,e,f/3,g/3),i=a.getObjectCenter(h.Width,h.Height);c&&fabric.Image.fromURL(b.target.result,function(b){b.set({id:getRandomId(),width:h.Width,height:h.Height,left:i.x,top:i.y,angle:0}).setCoords(),a.canvas.add(b)})},c.src=b.target.result},c.readAsDataURL(b)}),this.is("Image")},toimage:function(){var a=this;window.open(a.canvas.toDataURL("png"))}};var c=function(){function a(a,c){var d=document.createElement("input");d.type="file",d.accept="image/*",c&&(d.multiple=!0),d.onchange=function(){return c?d.files.length?void a(d.files):void console.error("No file selected."):d.files[0]?(a(d.files[0]),void d.parentNode.removeChild(d)):void console.error("No file selected.")},d.style.display="none",(document.body||document.documentElement).appendChild(d),b(d)}function b(a){var b=new window.MouseEvent("click",{view:window,bubbles:!0,cancelable:!0,button:0,buttons:0,mozInputSource:1});a.dispatchEvent(b)}var c=this;c.selectSingleFile=a,c.selectMultipleFiles=function(b){a(b,!0)}};a.fn.Draw=function(c){return this.each(function(){var d=a(this),e=d.data("Draw"),f="object"==typeof c&&c;e?e.reset(f):d.data("Draw",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.Draw.defaults={roomid:1001,uid:getRandomId(),canvasid:"canvas",defaultTool:"pen",width:0,height:0,tools:{image:!0,move:!0,selection:!1,text:!0,eraser:!0,zoomin:!0,zoomout:!0,undo:!0,redo:!0,pen:!0,rect:!0,circle:!0,triangle:!0,line:!0,eraserall:!0,toimage:!0,shape:!0}}}(window.jQuery);