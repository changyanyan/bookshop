/**
 * @version 1.00
 * @author  焦质晔
 * @update  2014-10-30
 */
 (function( window, undefined){
	var PG = {
		version : "1.00",
		author: "jzy",
		_$: function(id) {
			return document.getElementById(id);
		},
		getEle: function(sExp, oParent){ //by blue
			var aResult = []; //返回值是个数组
			var i = 0;
			oParent || (oParent = document);
			this.trim(sExp);
			
			if(oParent instanceof Array){
				for(i = 0; i < oParent.length; i++) {
					aResult = aResult.concat(this.getEle(sExp, oParent[i]));
				}
			} else {
				if(/,/.test(sExp)){ //xxx, xxx, xxx
					var arr = sExp.split(/[, ]+/);
					if (!tArr) var tArr = [];
					for(i = 0; i < arr.length; i++){
						tArr = tArr.concat(this.getEle(arr[i], oParent));
					}
					aResult = tArr;
				} else if (/[ >]/.test(sExp)){ //xxx xxx xxx 或者 xxx>xxx>xxx
					var aParent = [];
					var aChild = [];
					
					var arr = sExp.split(/[ >]+/);
					
					aChild = [oParent];
					for(i = 0; i < arr.length; i++){
						aParent = aChild;
						aChild = [];
						for(var j = 0; j < aParent.length; j++){
							aChild = aChild.concat(this.getEle(arr[i], aParent[j]));
						}
					}
					
					aResult = aChild;
				} else { //#xxx .xxx xxx
					switch(sExp.charAt(0)){
						case '#':
							return this._$(sExp.substring(1));
							break;
						case '.':
							return this.getEByClassName(oParent, sExp.substring(1));
							break;
						default:
							var tArr = [];
							for (i = 0; i < oParent.getElementsByTagName(sExp).length; i++){
								tArr.push(oParent.getElementsByTagName(sExp)[i]);
							}
							return tArr;
							break;
					}
				}
			}
			
			return aResult;
		},
		DC: function(b) {
			return document.createElement(b);
		},
		GT: function(b, t) {
			return b.getElementsByTagName(t);
		},
		getStyle: function(b, attr){
			if (b.currentStyle) {
				return b.currentStyle[attr];
			} else if (window.getComputedStyle){
				return window.getComputedStyle(b, false)[attr];
			}
		},
		setStyle: function(obj, json){
			if(arguments.length == 2){
				for(var i = '' in json) this.setStyle(obj, i, json[i]);
			} else { //name, value
				switch(arguments[1].toLowerCase()){
					case 'opacity':
						obj.style.filter = 'alpha(opacity:' + arguments[2] + ')';
						obj.style.opacity = arguments[2] / 100;
						break;
					default:
						if(typeof arguments[2] == 'number'){
							obj.style[arguments[1]] = arguments[2] + 'px';
						} else {
							obj.style[arguments[1]] = arguments[2];
						}
						break;
				}
			}
		},
		setStyle3: function(obj, name, value){
			obj.style['Webkit' + name.charAt(0).toUpperCase() + name.substring(1)] = value;
			obj.style['Moz' + name.charAt(0).toUpperCase() + name.substring(1)] = value;
			obj.style['ms' + name.charAt(0).toUpperCase() + name.substring(1)] = value;
			obj.style['O' + name.charAt(0).toUpperCase() + name.substring(1)] = value;
			obj.style[name] = value;
		},
		getClass: function(a) {
			return a.className.replace(/\s+/, ' ').split(' ');
		},
		hasClass: function(c, d) {
			var b = this.getClass(c);
			for (var a = 0; a < b.length; a++) {
				if (b[a] === d) return true;
			}
			return false;
		},
		addClass: function(a, b) {
			if (!this.hasClass(a, b)){
				a.className += (a.className ? ' ': '') + b;
				return true;
			} else {
				return false;
			}
		},
		removeClass: function(c, d) {
			var b = this.getClass(c);
			var f = b.length;
			for (var a = f - 1; a >= 0; a--) {
				if (b[a] === d) delete(b[a]);
			}
			c.className = b.join(' ');
			return f == b.length ? false: true;
		},
		toggleClass: function(f, g) {
			this.hasClass(f, g) ? this.removeClass(f, g) : this.addClass(f, g);
		},
		attr: function(f, d, g) {
			if (g == undefined) {
				return f.getAttribute(d);
			} else {
				g == '' ? f.removeAttribute(d) : f.setAttribute(d, g);
			}
		},
		getCByClassName: function(b, c) {
			var Arr = [];
			b = this.getChildNodes(b);
			for (var i = 0; i < b.length; i++) {
				if (this.hasClass(b[i], c)) Arr.push(b[i]);
			}
			return Arr.length ? Arr : false;
		},
		getEByClassName: function(b, c, t){
			var Arr = [];
			var d = ( t == null ) ? this.GT(b, '*') : this.GT(b, t);
			for (i = 0; i < d.length; i++) {
				if (this.hasClass(d[i], c)) Arr.push(d[i]);
			}
			return Arr.length ? Arr : false;
		},
		getChildNodes: function(b) {
			var Arr = [];
			b = b.childNodes;
			if (b == null) return false;
			for (var i = 0; i < b.length; i++) {
				if (this.isElement(b[i])) Arr.push(b[i]);
			}
			return Arr.length ? Arr : false;
		},
		getSiblings: function(b) {
			var a = [];
			var Arr = this.getChildNodes(b.parentNode);
			for(var i = 0; i < Arr.length; i++) {
				if (Arr[i] !== b) a.push(Arr[i]);
			}
			return a.length ? a : false;
		},
		getNextSibling: function(b){
			b = b.nextSibling;
			if (b == null) return false;
			return this.isElement(b) ? b: this.getNextSibling(b);
		},
		getPrevSibling: function(b){
			b = b.previousSibling;
			if (b == null) return false;
			return this.isElement(b) ? b: this.getPrevSibling(b);
		},
		getFirstChild: function(b){
			b = b.firstChild;
			if (b == null) return false;
			return this.isElement(b) ? b: this.getNextSibling(b);
		},
		getLastChild: function(b){
			var b = b.lastChild;
			if (b == null) return false;
			return this.isElement(b) ? b: this.getPrevSibling(b);
		},
		insertAfter: function(g, f){ //g 新节点对象，f 参考节点对象 
			var h = f.parentNode;
			this.getLastChild(h) == f ? h.appendChild(g) : h.insertBefore(g, this.getNextSibling(f));
		},
		replace: function(f, c) {
			c.parentNode.replaceChild(f, c);
		},
		getEvent: function (e) { 
			return e || window.event;
		},  
		getEventTarget: function (e) {  
			return window.event ? window.event.srcElement : e.target;
		},
		preventDefault: function(e) {  //-----阻止事件的默认行为-----
			e.preventDefault ? e.preventDefault() : window.event.returnValue = false;
		},
		stopPropagation: function (e) {  //-----阻止事件冒泡-----
			window.event ? window.event.cancelBubble = true : e.stopPropagation();
		},
		addEvent: function(b, a, c) {
			if (b.attachEvent) {
				b.attachEvent('on' + a, function(){
					c.call(b, arguments); //改变this指向
				})
			} else {
				switch(a){
					case 'mouseenter':
						b.addEventListener('mouseover', this.withinElement(c), false);
						break;
					case 'mouseleave':
						b.addEventListener('mouseout', this.withinElement(c), false);
						break;
					default:
						if (a == 'mousewheel' && document.mozHidden !== undefined) a = 'DOMMouseScroll';
						b.addEventListener(a, c, false);
						break;
				}
			}
		},
		delEvent: function(b, a, c) {
			if (b.detachEvent) {
				b.detachEvent('on' + a, c);
			} else {
				b.removeEventListener(a, c, false);
			}
		},
		withinElement: function(c){
			return function (e) {
				var p = e.relatedTarget;
				while (p && p != this) {
				try {p = p.parentNode}
					catch(e) {break}
				}
				if (p != this) c.call(this, e);
			}
		},
		contains: function(a, b) {
			try {
				return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16);
			} catch(e) {}
		},
		loadJs: function(g, f, i) {
			var h = this.DC('script');
			if (f) {
				if (this.B.ie) {
					h.onreadystatechange = function() {
						if (h.readyState == 'loaded' || h.readyState == 'complete') {
							f();
						}
					}
				} else {
					h.onload = f;
				}
			}
			i && this.attr(h, 'charset', i);
			this.attr(h, 'type', 'text/javascript');
			this.attr(h, 'src', g);
			this.attr(h, 'language', 'javascript');
			this.GT(document, 'head')[0].appendChild(h);
		},
		loadCss: function(g, f, i) {
			var h = i ? i: this.DC('link');
			if (f) {
				h.onload = f;
			}
			if (!i) {
				this.attr(h, 'type', 'text/css');
				this.attr(h, 'rel', 'stylesheet');
				this.GT(document, 'head')[0].appendChild(h)
			}
			this.attr(h, 'href', g);
		},
		getPosition: function(b) {
			var X = 0;
			var Y = 0;
			while (b != null && b != document.body) {
				X += b.offsetLeft;
				Y += b.offsetTop;
				b = b.offsetParent;
			}
			return [X, Y];
		},
		width: function(b) {
			return b.offsetWidth;
		},
		height: function(b) {
			return b.offsetHeight;
		},
		scrollX: function () {
			var d = document.documentElement;
			return self.pageXOffset || ( d && d.scrollLeft ) || document.body.scrollLeft;
		},
		scrollY: function () {
			var d = document.documentElement;
			return self.pageYOffset || ( d && d.scrollTop ) || document.body.scrollTop;
		},
		pageWidth: function() {
			return document.body.scrollWidth || document.documentElement.scrollWidth;
		},
		pageHeight: function() {
			return document.body.scrollHeight || document.documentElement.scrollHeight;
		},
		windowWidth: function() {
			var b = document.documentElement;
			return self.innerWidth || b && b.clientWidth || document.body.clientWidth;
		},
		windowHeight: function() {
			var b = document.documentElement;
			return self.innerHeight || b && b.clientHeight || document.body.clientHeight;
		},
		scrollTo: function(x, y) {
			return window.scrollTo(x, y);
		},
		trim: function(b) {
			return b.replace(/^\s+|\s+$/g, '');
		},
		map: function(arr, fn){
			for(var i = 0; i < arr.length; i++){
				fn.call(arr[i], i);
			}
		},
		random: function(f, c) {
			if (f == undefined) f = 0;
			if (c == undefined) c = 9;
			return Math.floor(Math.random() * (c - f + 1) + f);
		},
		toPercent: function(num){
			return (Math.round(num * 10000) / 100).toFixed(2) + '%';
		},
		toggleDisplay : function (b) {
			b.style.display == 'none' ? b.style.display = 'block' : b.style.display = 'none';  
		},
		css: function(obj, attr, value) {
			if (arguments.length == 2) {
				if (attr == 'scale' || attr == 'rotate' || attr == 'rotateX' || attr == 'rotateY' || attr == 'scaleX' || attr == 'scaleY' || attr == 'translateY' || attr == 'translateX' || attr == 'translateZ') {
					if (!obj.$Transform) {
						obj.$Transform = {};
					}
					switch (attr) {
						case 'scale':
						case 'scaleX':
						case 'scaleY':
							return typeof(obj.$Transform[attr]) == 'number' ? obj.$Transform[attr] : 100;
							break;
						case 'translateY':
						case 'translateX':
						case 'translateZ':
							return obj.$Transform[attr] ? obj.$Transform[attr] : 0;
							break;
						default:
							return obj.$Transform[attr] ? obj.$Transform[attr] : 0;
							break;
					}
				}
				var sCur = obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj, false)[attr];
				if (attr == 'opacity') {
					return Math.round((parseFloat(sCur) * 100));
				} else {
					return parseInt(sCur);
				}
			} else if (arguments.length == 3) {
				switch (attr) {
				case 'scale':
				case 'scaleX':
				case 'scaleY':
				case 'rotate':
				case 'rotateX':
				case 'rotateY':
				case 'translateY':
				case 'translateX':
				case 'translateZ':
					this.setCss3(obj, attr, value);
					break;
				case 'width':
				case 'height':
				case 'paddingLeft':
				case 'paddingTop':
				case 'paddingRight':
				case 'paddingBottom':
					value = Math.max(value, 0);
				case 'left':
				case 'top':
				case 'marginLeft':
				case 'marginTop':
				case 'marginRight':
				case 'marginBottom':
					if (typeof value == "string") {
						obj.style[attr] = value;
					} else {
						obj.style[attr] = value + 'px';
					}
					break;
				case 'opacity':
					obj.style.filter = 'alpha(opacity:' + value + ')';
					obj.style.opacity = value / 100;
					break;
				default:
					obj.style[attr] = value;
					break;
				}
			}
			return function(attr_in, value_in) {
				this.css(obj, attr_in, value_in);
			}
		},
		setCss3: function(obj, attr, value) {
			var sTr = '';
			var sVal = '';
			var arr = ['Webkit', 'Moz', 'O', 'ms', ''];
			if (!obj['$Transform']) {
				obj['$Transform'] = {};
			}
			obj['$Transform'][attr] = parseInt(value);
			for (sTr in obj['$Transform']) {
				switch (sTr) {
				case 'scale':
				case 'scaleX':
				case 'scaleY':
					sVal += sTr + '(' + (obj['$Transform'][sTr] / 100) + ') ';
					break;
				case 'rotate':
				case 'rotateX':
				case 'rotateY':
					sVal += sTr + '(' + (obj['$Transform'][sTr]) + 'deg) ';
					break;
				case 'translateY':
				case 'translateX':
				case 'translateZ':
					sVal += sTr + '(' + (obj['$Transform'][sTr]) + 'px) ';
					break
				}
			}
			for (var i = 0; i < arr.length; i++) {
				obj.style[arr[i] + 'Transform'] = sVal;
			}
		},
		StartMove: function(obj, oTarget, iType, fnCallBack, fnDuring) {
			var _this = this, fnMove = null;
			if (obj.timer) clearInterval(obj.timer);
			switch (iType) {
				case 1:
					fnMove = this.DoMoveBuffer;
					break;
				case 2:
					fnMove = this.DoMoveFlex;
					break;
				case 3:
					fnMove = this.DoMoveNormal;
					break;
				case 4:
					fnMove = this.DoMoveNormal;
					break;
				default:
					break;
			}
			obj.timer = setInterval(function() {
				fnMove(obj, oTarget, iType, fnCallBack, fnDuring);
				obj.lastMove = (new Date()).getTime();
			}, 30);
			if (!obj.lastMove) obj.lastMove = 0;
			var iNow = (new Date()).getTime();
			if (iNow - obj.lastMove > 30) {
				fnMove(obj, oTarget, iType, fnCallBack, fnDuring);
				obj.lastMove = iNow;
			}
		},
		MOVE_TYPE: {
			BUFFER: 1,
			FLEX: 2,
			NORMAL: 3,
			FAST: 4
		},
		DoMoveBuffer: function(obj, oTarget, iType, fnCallBack, fnDuring) {
			var bStop = true;
			var attr = '';
			var cur = 0;
			if (!obj.oSpeed) obj.oSpeed = {};
			for (attr in oTarget) {
				if (!obj.oSpeed[attr]) obj.oSpeed[attr] = 0; //步长
				cur = PG.css(obj, attr);
				if (oTarget[attr] != cur) {
					bStop = false;
					obj.oSpeed[attr] = (oTarget[attr] - cur) / 5;
					obj.oSpeed[attr] = obj.oSpeed[attr] > 0 ? Math.ceil(obj.oSpeed[attr]) : Math.floor(obj.oSpeed[attr]);
					PG.css(obj, attr, cur + obj.oSpeed[attr]);
				}
			}
			if (fnDuring) fnDuring.call(obj);
			if (bStop) {
				clearInterval(obj.timer);
				obj.timer = null;
				if (fnCallBack) fnCallBack.call(obj);
			}
		},
		DoMoveFlex: function(obj, oTarget, iType, fnCallBack, fnDuring) {
			var bStop = true;
			var attr = '';
			var speed = 0;
			var cur = 0;
			if (!obj.oSpeed) obj.oSpeed = {};
			for (attr in oTarget) {
				if (!obj.oSpeed[attr]) obj.oSpeed[attr] = 0;
				cur = PG.css(obj, attr);
				if (Math.abs(oTarget[attr] - cur) >= 1 || Math.abs(obj.oSpeed[attr]) >= 1) {
					bStop = false;
					obj.oSpeed[attr] += (oTarget[attr] - cur) / 5;
					obj.oSpeed[attr] *= 0.75;
					PG.css(obj, attr, cur + obj.oSpeed[attr]);
				}
			}
			if (fnDuring) fnDuring.call(obj);
			if (bStop) {
				clearInterval(obj.timer);
				obj.timer = null;
				for (attr in oTarget) PG.css(obj, attr, oTarget[attr]);
				if (fnCallBack) fnCallBack.call(obj);
			}
		},
		DoMoveNormal: function(obj, oTarget, iType, fnCallBack, fnDuring) {
			var bStop = true;
			var attr = '';
			var cur = 0, init = 0;
			var iTimes = 20; //执行次数
			if (!obj.oSpeed) obj.oSpeed = {};
			for (attr in oTarget) {
				if (!obj.oSpeed[attr]){
					init = PG.css(obj, attr);
					obj.oSpeed[attr] = (oTarget[attr] - init) / iTimes; //步长
				}
				if (iType == PG.MOVE_TYPE.FAST) obj.oSpeed[attr] *= 1.2;
				cur = PG.css(obj, attr);
				if (oTarget[attr] - cur > obj.oSpeed[attr]) {
					bStop = false;
					PG.css(obj, attr, cur + obj.oSpeed[attr]);
				}
			}
			if (fnDuring) fnDuring.call(obj);
			if (bStop) {
				clearInterval(obj.timer);
				obj.timer = null;
				obj.oSpeed = {}; //清空 oSpeed 对象
				for (attr in oTarget) PG.css(obj, attr, oTarget[attr]);
				if (fnCallBack) fnCallBack.call(obj);
			}
		},
		E: function(b) {
			b = window.event || b;
			return {
				clone: true,
				stop: function() {
					if (b && b.stopPropagation) {
						b.stopPropagation();
					} else {
						b.cancelBubble = true;
					}
				},
				prevent: function() {
					if (b && b.preventDefault) {
						b.preventDefault();
					} else {
						b.returnValue = false;
					}
				},
				target: b.target || b.srcElement,
				x: b.clientX || b.pageX,
				y: b.clientY || b.pageY,
				button: b.button,
				key: b.keyCode,
				shift: b.shiftKey,
				alt: b.altKey,
				ctrl: b.ctrlKey,
				type: b.type,
				wheel: b.wheelDelta / 120 || -b.detail / 3 //鼠标滚轮方向
			}
		},
		//cookie
		setCookie: function(name, value, iDay){
			if(iDay !== false){
				var oDate = new Date();
				oDate.setDate(oDate.getDate() + iDay);
				document.cookie = name + '=' + value + ';expires=' + oDate + ';path=/';
			} else {
				document.cookie = name + '=' + value;
			}
		},
		getCookie: function(name){
			var arr = document.cookie.split('; ');
			var i = 0;
			
			for(i = 0; i < arr.length; i++){
				var arr2 = arr[i].split('=');
				
				if(arr2[0] == name){
					return arr2[1];
				}
			}
			
			return '';
		},
		removeCookie: function(name){
			this.setCookie(name, 'a', -1);
		},
		isObject: function(b) {
			return typeof b == 'object';
		},
		isElement: function(b) {
			return b && b.nodeType == 1;
		},
		isUndefined: function(b) {
			return typeof b == 'undefined';
		},
		isFunction: function(b) {
			return this.getType(b) == 'Function';
		},
		isNumber: function(b) {
			return this.getType(b) == 'Number';
		},
		isString: function(b) {
			return this.getType(b) == 'String';
		},
		isArray: function(b) {
			return this.getType(b) == 'Array';
		},
		getType: function(b) {
			return Object.prototype.toString.call(b).slice(8, -1);
		},
		isIE: navigator.appVersion.indexOf('MSIE') != -1 ? true: false,
		//isIE6: navigator.appVersion.indexOf("MSIE 6.0") != -1 ? true: false,
		isIE6: !!window.ActiveXObject && !window.XMLHttpRequest,
		isIE7: navigator.appVersion.indexOf('MSIE 7.0') != -1 ? true: false
	};
	
	// zepto 选择器
	var undefined, $, emptyArray = [], slice = emptyArray.slice, simpleSelectorRE = /^[\w-]*$/,

	zepto = {};

	function isDocument(obj) {return obj != null && obj.nodeType == obj.DOCUMENT_NODE};
	function trim(b) {return b.replace(/^\s+|\s+$/g, '')}

	zepto.init = function(selector) {
		var dom;
		if (!selector) return zepto.Z();
		if (typeof selector == 'string') {
			selector = trim(selector);
			dom = zepto.qsa(window.document, selector);
		}
		
		return zepto.Z(dom, selector);
	}
	
	zepto.Z = function(dom, selector) {
		dom = dom || [];
		return dom;
	}
	
	zepto.qsa = function(element, selector){ //IE8+、FF3.5+、Safari 3.1+、Chrome、Opera 10+
		var found,
			maybeID = selector[0] == '#',
			maybeClass = !maybeID && selector[0] == '.',
			nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
			isSimple = simpleSelectorRE.test(nameOnly);
		return (isDocument(element) && isSimple && maybeID) ?
			( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
			(element.nodeType !== 1 && element.nodeType !== 9) ? [] :
			slice.call(
				isSimple && !maybeID ?
				maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
				element.getElementsByTagName(selector) : // Or a tag
				element.querySelectorAll(selector) // Or it's not simple, and we need to query all
			)
	}
	
	$$ = function(selector){
		return zepto.init(selector);
	}
	
	window.PG === undefined && (window.PG = PG); //将 PG 挂载到 window 上
	window.$$ === undefined && (window.$$ = $$)
 })(window);
