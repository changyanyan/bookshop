/*
 * banner 多种切换模式 构造函数
 */
function PicCut(){
	this.PicContId = '';
	this.PicCutIdArr = '';
	this.showIndex = 0;
}
PicCut.prototype = {
	version: "1.00",
	author: "jzy",
	initialize: function(){
		var thisTemp = this;
		if (!this.PicCutIdArr) {
			throw new Error("必须指定PicCutIdArr.");
			return;
		}
		if (!this.PicContId) {
			throw new Error("必须指定PicContId.");
			return;
		}
		
		this.oCont = PG._$(this.PicContId);
		this.ContWid = this.oCont.offsetWidth;
		this.tWid = Math.floor(this.ContWid / this.PicCutIdArr.length);
		this.PicCutWid = PG._$(this.PicCutIdArr[0]).offsetWidth;
		this.tHoverWid = Math.floor((this.ContWid - this.PicCutWid) / (this.PicCutIdArr.length - 1));
		for (var i = 0;i < this.PicCutIdArr.length;i++) {
			var tCutDiv = PG._$(this.PicCutIdArr[i]);
			
			tCutDiv.style.position = 'absolute';
			tCutDiv.style.top = '0px';
			if (i < this.showIndex) {
				tCutDiv.style.left = this.tHoverWid * i + 'px';
			}else{
				tCutDiv.style.left = (this.tHoverWid * (i - 1) + this.PicCutWid) + 'px';
			}
			
			PG.addEvent(tCutDiv, 'mouseover', (function(d){
				return function(){thisTemp.fn.call(d)};
			})(tCutDiv));

		}
		this.fn = function(){
			for (var k = 0;k < thisTemp.PicCutIdArr.length;k++){
				var tCutDiv_1 = PG._$(thisTemp.PicCutIdArr[k]);
				$(tCutDiv_1).children('.list-left').children('a').attr('class', ' ');
			}
			$(this).children('.list-left').children('a').attr('class', 'ahover');
			
			var tIndex = thisTemp.ArrIndexOf(thisTemp.PicCutIdArr, this.id);
			if (tIndex < 0) {
				throw new Error("必须指定this.id在数组中不存在.");
				return
			}
			for (var n = 0;n < thisTemp.PicCutIdArr.length;n++) {
				if (n <= tIndex) {
					thisTemp.startMove(PG._$(thisTemp.PicCutIdArr[n]), 'left', thisTemp.tHoverWid * n);
				} else {
					thisTemp.startMove(PG._$(thisTemp.PicCutIdArr[n]), 'left', (thisTemp.tHoverWid * (n - 1) + thisTemp.PicCutWid));
				}
			}
		}
	},
	startMove: function(obj, attr, iTarget){
		var thisTemp = this;
        clearInterval(obj.timer);
        obj.timer = setInterval(function(){
        	thisTemp.doMove(obj, attr, iTarget);
        }, 20);
    },
    doMove: function(obj, attr, iTarget){
        var iCur = 0;
        if (attr == 'opacity') {
            iCur = parseInt(100 * PG.getStyle(obj, attr)) || 0;
        } else {
            iCur = parseInt(PG.getStyle(obj, attr)) || 0;
        }
        var iSpeed = (iTarget - iCur) / 8;
        iSpeed = (iSpeed > 0) ? Math.ceil(iSpeed) : Math.floor(iSpeed);
        if (iCur == iTarget) {
            clearInterval(obj.timer);
        } else if (attr == 'opacity') {
            obj.style.filter = 'alpha(opacity=' + (iCur + iSpeed) + ')';
            obj.style.opacity = (iCur + iSpeed) / 100;
        } else {
            obj.style[attr] = iCur + iSpeed + 'px';
        }
    },
	ArrIndexOf: function(oArr, val){
		for (var i = 0;i < oArr.length;i++) {
			if (oArr[i] == val) {
				return i;
			}
		}
		return -1;
	}
}