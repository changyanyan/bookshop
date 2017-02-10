/*
 * 弹出列表构造函数
 */
function MenuList (MenuListID, SubListID, eventType, chiTagName, openClassName, closeClassName) {
	if (!MenuListID || PG._$(MenuListID) == null) {
		throw new Error("必须指定正确的 MenuListID");
	}
	if (!SubListID || PG._$(SubListID) == null) {
		throw new Error("必须指定正确的 SubListID");
	}
	this.MenuListID = MenuListID;
	this.SubListID = SubListID;
	this.MenuListDiv = PG._$(this.MenuListID);
	this.SubListDiv = PG._$(this.SubListID);
	this.eventType = eventType.substr(2);
	this.label = [];
	this.chiTagName = chiTagName == null ? "none": chiTagName.toUpperCase();
	this.openClassName = openClassName == null ? "selected": openClassName;
	this.closeClassName = closeClassName == null ? "": closeClassName;
	this.subPosition = "absolute";
	this.zIndex = 999;
	this.subLeft = 0;
	this.subTop = 0;
	this.state = "ready";
	this.tempobj = new Object();
}
MenuList.prototype = {
	version: "1.30",
	author: "jzy",
	_delay: 50,
	_delay_t2: 20,
	initialize: function(){
		var t = this;
		this._timer = null;
		this.SubListDiv.style.position = this.subPosition;
		this.SubListDiv.style.zIndex = this.zIndex;
		this.SubListDiv.style.left = (this.subLeft ? this.subLeft : this.MenuListDiv.offsetWidth) + "px";
		this.SubListDiv.style.top = this.subTop;
		this.SubListDiv.style.overflow = "hidden";
		PG.addEvent(this.MenuListDiv, this.eventType, function(){
			if (t.state == "stoping") {
				clearTimeout(t._timer);
				t.unSelect(t.tempobj, t.chiTagName, 'block');
				t.state = "ready";
			} else {
				clearTimeout(t._timer);
				t._timer = setTimeout(function() {
					t.startMove(t.SubListDiv, 'width', '0px', 'none', 'block');
				}, t._delay);
				t.state = "ready";
			}
		});
		if (t.eventType == 'mouseenter') {
			PG.addEvent(this.MenuListDiv, 'mouseleave', function() {
				clearTimeout(t._timer);
				t._timer = setTimeout(function() {
					t._setClassName(t.tempobj, "close");
					if (t.state == "ready" && t.chiTagName != "none"){
						t.unSelect(t.tempobj, t.chiTagName, 'none');
						for (var i = 0; i < t.label.length; i++) {
							t.unSelect(PG._$(t.label[i][0]), t.chiTagName, 'none');
						}
					}
					t.SubListDiv.style.display = "none";
				}, t._delay);
			});
		}
		PG.addEvent(this.SubListDiv, this.eventType, function() {
			t.state = "stoping";
			clearTimeout(t._timer);
		});
		PG.addEvent(this.SubListDiv, 'mouseleave', function() {
			t._timer = setTimeout(function() {
				t.SubListDiv.style.display = "none";
				t._setClassName(t.tempobj, "close");
				if (t.state == "stoping" && t.chiTagName != "none"){
					t.unSelect(t.tempobj, t.chiTagName, 'none');
					for (var i = 0; i < t.label.length; i++) {
						t.unSelect(PG._$(t.label[i][0]), t.chiTagName, 'none');
					}
				}
				t.state = "ready";
			}, t._delay);
		});
	},
	addLabel: function(labelID, contID) {
		var t = this;
		var labelObj = PG._$(labelID);
		var contObj = PG._$(contID);
		if (labelObj == null && labelID != "none") {
			throw new Error("addLabel(labelID)参数错误:labelID 对像不存在!(value:" + labelID + ")");
		}
		var TempID = this.label.length;
		this.label.push([labelID, contID]); //label 二维数组
		PG.addEvent(labelObj, this.eventType, (function(d){
			return function(){tempFn.call(d)};
		})(labelObj));
		var tempFn = function(){
			clearTimeout(this._timeout);
			this._timeout = setTimeout(function() {
				t.select(TempID);
			}, t._delay_t2);
		}
		if (t.eventType == 'mouseenter') {
			PG.addEvent(labelObj, 'mouseleave', (function(d){
				return function(){t.fn.call(d)};
			})(labelObj))
		}
		this.fn = function(){
			clearTimeout(this._timeout);
			t.tempobj = this;
		}
	},
	select: function(num) {
		if (typeof(num) != "number") {
			throw new Error("select(num)参数错误:num 不是 number 类型!(value:" + num + ")")
		}
		var i;
		for (i = 0; i < this.label.length; i++) {
			if (i == num) {
				if (this.label[i][0] != "none") {
					this._setClassName(PG._$(this.label[i][0]), "open");
					if (this.chiTagName != "none") {
						this.unSelect(PG._$(this.label[i][0]), this.chiTagName, 'block');
					}
				}
				if (PG._$(this.label[i][1])) {
					PG._$(this.label[i][1]).style.display = "";
					//this.SubListDiv.style.top = i * 60 + "px";
				}
			} else {
				if (this.label[i][0] != "none") {
					this._setClassName(PG._$(this.label[i][0]), "close");
					if (this.chiTagName != "none") {
						this.unSelect(PG._$(this.label[i][0]), this.chiTagName, 'none');
					}
				}
				if (PG._$(this.label[i][1])) {
					PG._$(this.label[i][1]).style.display = "none";
				}
			}
		}
	},
	unSelect: function(obj, tag, state){
		var tempArr = [];
		tempArr = PG.GT(obj, tag);
		for (var n = 0;n < tempArr.length;n++) {
			tempArr[n].style.display = state;
		}
	},
	_setClassName: function(obj, type) {
		var temp;
		temp = obj.className;
		if (temp) {
			temp = temp.replace(this.openClassName, "");
			temp = temp.replace(this.closeClassName, "");
			temp += " " + (type == "open" ? this.openClassName: this.closeClassName)
		} else {
			temp = (type == "open" ? this.openClassName: this.closeClassName)
		}
		obj.className = temp
	},
	startMove: function(obj, attr, iniTar, iTarget, iDisplay){
		var thisTemp = this;
		if (iniTar != 'none') {
			if (iTarget == 'none') {
				obj.style.display = 'block';
				iTarget = parseInt(PG.getStyle(obj, attr));
			} else {
				iTarget = parseInt(iTarget);
			}
			obj.style[attr] = parseInt(iniTar) + 'px';
		} else {
			if (iTarget == 'none') {
				iTarget = parseInt(PG.getStyle(obj, attr));
			} else {
				iTarget = parseInt(iTarget);
			}
		}
        clearInterval(obj.timer);
        obj.timer = setInterval(function(){
        	thisTemp.doMove(obj, attr, iTarget, iDisplay);
        }, 10);
    },
    doMove: function(obj, attr, iTarget, iDisplay){
        var iCur = 0;
        if (attr == 'opacity') {
            iCur = parseInt(100 * PG.getStyle(obj, attr)) || 0;
        } else {
            iCur = parseInt(PG.getStyle(obj, attr)) || 0;
        }
        var iSpeed = (iTarget - iCur) / 5;
        iSpeed = (iSpeed > 0) ? Math.ceil(iSpeed) : Math.floor(iSpeed);
        if (iCur == iTarget) {
            clearInterval(obj.timer);
			if (iDisplay == 'none') {
				obj.style.display = 'none';
			}
        } else if (attr == 'opacity') {
			obj.style.filter = 'alpha(opacity=' + (iCur + iSpeed) + ')';
			obj.style.opacity = (iCur + iSpeed) / 100;
		} else {
			obj.style[attr] = iCur + iSpeed + 'px';
		}
    }
}