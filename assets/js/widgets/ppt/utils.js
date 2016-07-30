(function(global) {

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function pad(str, length) {
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }

    var getRandomInt = fabric.util.getRandomInt;
    function getRandomColor() {
        return (
            pad(getRandomInt(0, 255).toString(16), 2) +
            pad(getRandomInt(0, 255).toString(16), 2) +
            pad(getRandomInt(0, 255).toString(16), 2)
        );
    }

    function getRandomString() {
        if (window.crypto && window.crypto.getRandomValues && -1 === navigator.userAgent.indexOf("Safari")) {
            for (var a = window.crypto.getRandomValues(new Uint32Array(3)), token = "", i = 0, l = a.length; l > i; i++) token += a[i].toString(36);
            return token
        }
        return (Math.random() * (new Date).getTime()).toString(36).replace(/\./g, "")
    }

    function getRandomNum(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getRandomLeftTop() {
        var offset = 50;
        return {
            left: fabric.util.getRandomInt(0 + offset, 700 - offset),
            top: fabric.util.getRandomInt(0 + offset, 500 - offset)
        };
    }

    var supportsInputOfType = function(type) {
        return function() {
            var el = document.createElement('input');
            try {
                el.type = type;
            }
            catch(err) { }
            return el.type === type;
        };
    };

    function createToolsBar(id, width, height, options){
        width = width || '50%';
        height = height || '50%';

        function createColor(){
            return [  '<ul class="color-list clearfix">',
                '  <li class="color-item black active"></li>',
                '  <li class="color-item blue"></li>',
                '  <li class="color-item red"></li>',
                '  <li class="color-item green"></li>',
                '  <li class="color-item orange"></li>',
                '  <li class="color-item gray"></li>',
                '  <li class="color-item purple"></li>',
                '</ul>'].join("");
        }

        function pptColor(){
            return[
                '<ul class="color-list">',
                '<li class="color-item black active"></li>',
                '<li class="color-item blue"></li>',
                '<li class="color-item red"></li>',
                '<li class="color-item green"></li>',
                '<li class="color-item orange"></li>',
                '<li class="color-item gray"></li>',
                '<li class="color-item purple"></li>',
                '</ul>'].join("");
        }


        function createBrush(){
            return [
                '<ul class="brush-list clearfix">',
                '<li class="brush-item thin active"></li>',
                '<li class="brush-item fine"></li>',
                '<li class="brush-item medium"></li>',
                '<li class="brush-item thick"></li>',
                '</ul>'
            ].join("");
        }

        function pptBrush(){
            return [
                '<ul class="brush-list">',
                '<li class="brush-item thin active"></li>',
                '<li class="brush-item fine"></li>',
                '<li class="brush-item medium"></li>',
                '<li class="brush-item thick"></li>',
                '</ul>'
            ].join("");
        }

        function createShape(){
            return ['<button class="tool-item shape">',
                '<ul class="shape-list">',
                '  <li class="shape-item circle"></li>',
                '  <li class="shape-item square"></li>',
                '  <li class="shape-item triangle"></li>',
                '  <li class="shape-item line"></li>',
                '</ul>',
                '</button>'].join("");
        }

        function createTools(){
            var str = ['<div id="drawToolbar" class="toolbar"><div class="toolbar-inner"><div class="btn-tool clearfix">'], tools = options.tools;
            tools.zoomin ? str.push('<button class="tool-item enlarge" title="放大">',

                '</button>') : '';
            tools.zoomout ? str.push('<button class="tool-item reduce" title="缩小">',

                '</button>') : '';
            tools.redo ? str.push('<button class="tool-item go-forward" title="前进">',

                '</button>') : '';
            tools.undo ? str.push('<button class="tool-item go-back" title="回退">',

                '</button>') : '';
            tools.image ? str.push('<button class="tool-item add-picture" title="图片">',

                '</button>') : '';
            tools.move ? str.push('<button class="tool-item move" title="拖动">',
                '<i class="icons icons-draft"></i>',
                '</button>') : '';
            tools.selection ? str.push('<button class="tool-item selector" title="移动">',
                '</button>') : '';
            tools.pen ? str.push('<button class="tool-item pen active"><div class="pen-list" style="display:none;">',createBrush(),createColor(),'</div></button>') : '';
            tools.eraser ? str.push('<button class="tool-item eraser" title="橡皮">','</button>') : '';
            tools.shape ? str.push(createShape()) : "";
            tools.text ? str.push('<button class="tool-item text" title="文字"></button>') : '';
            tools.eraserall ? str.push('<button class="tool-item eraser-all" title="清屏"></button>') : '';
            tools.toimage ? str.push('<button class="tool-item save" title="生成">',
                '</button>') : '';
            str.push('</dvi>');
            // str.push(createColor());
            // str.push(createBrush());

            return str.join("");
        }

        function pptTools(){
            return  ['<span class="ppt-btn">',
                '<span id="line-color-btn" class="ppt-color"></span><i id="line-color-icon" class="icons icons-bottom-narrow"></i>',
                '<div id="line-color" class="popover fade ppt-popover" style="margin-left:-22px;display: none;"><!--fade-->',
                pptColor(),
                '</div>',
                '</span>',
                '<span class="ppt-btn">',
                '<i id="line-width-btn" class="icons icons-brush"></i><i id="line-width-icon" class="icons icons-bottom-narrow"></i>',
                '<div id="line-width" class="popover fade ppt-popover" style="margin-left:-53px;display: none;"><!--fade-->',
                pptBrush(),
                '</div>',
                '</span>'].join("");
        }

        if(options.channel == "ppt"){
            //$("#canvas-toolbar").append(pptTools());
            return ['<canvas id="'+id+'" width="'+width+'" height="'+height+'"></canvas>',
                '<div class="ppt-toolbar">',
                pptTools(),
                '</div>'].join("");
        }else{
            return ['<canvas id="'+id+'" width="'+width+'" height="'+height+'"></canvas>',
                '<div class="toolbar">',
                '<div class="toolbar-inner">',
                createTools(),
                '</div>',
                '</div></div></div>'].join("");
        }
    }

    function setimgsize(imgWidth,imgHeight,maxWidth,maxHeight){
        var maxWidth = maxWidth||900, maxHeight = maxHeight||1000, maxconsult = maxWidth/maxHeight, imgconsult = imgWidth/imgHeight
            ,imgW, imgH;
        if(imgHeight>=maxHeight&&imgWidth<maxWidth){
            imgW = (maxHeight*imgWidth)/imgHeight;
            imgH = maxHeight;
        }else if(imgHeight<maxHeight&&imgWidth>=maxWidth){
            //图高<最大高 图宽>最大宽
            imgH = (maxWidth*imgHeight)/imgWidth;
            imgW = maxWidth;
        }else if(imgWidth<=maxWidth&&imgHeight<=maxHeight){
            //图宽<=最大宽 图高<=最大高
            imgW = imgWidth;
            imgH = imgHeight;
        }else if(imgconsult>=maxconsult&&imgWidth>maxWidth&&imgHeight>maxHeight){
            //图高>最大高 图宽>最大宽 图比>=最大比
            imgW = maxWidth;
            imgH = (maxWidth*imgHeight)/imgWidth;
        }else if(imgconsult<maxconsult&&imgWidth>maxWidth&&imgHeight>maxHeight){
            //图高>最大高 图宽>最大宽 图比<最大比
            imgH = maxHeight;
            imgW = (maxHeight*imgWidth)/imgHeight;
        }
        imgWidth = parseInt(imgW);
        imgHeight = parseInt(imgH);

        return {Width:imgWidth,Height:imgHeight};
    }

    var supportsSlider = supportsInputOfType('range'),
        supportsColorpicker = supportsInputOfType('color');

    global.getRandomNum = getRandomNum;
    global.getRandomInt = getRandomInt;
    global.getRandomColor = getRandomColor;
    global.getRandomLeftTop = getRandomLeftTop;
    global.supportsSlider = supportsSlider;
    global.supportsColorpicker = supportsColorpicker;
    global.capitalize = capitalize;
    global.createToolsBar = createToolsBar;
    global.getRandomId = getRandomString;
    global.getImageSize = setimgsize;
})(this);
