/*
 * banner 多种切换模式_无缝切换 构造函数
 */
function Banner(){
	this.banContId = "";
	this.banButId = "";
	this.banTitId = "";
	this.banLeftId = "";
	this.banRightId = "";
	this.listEvent = "onmouseover";
	this.dotClassName  = "dBanBtn";
    this.dotOnClassName = "sBanBtn";
	this.autoPlay = true;
	this.autoPlayTime = 5;
	this.autoTimeObj;
	this.scrollTimeObj;
	this.fadeMove = true;
	this.leftMove = false;
	this.upMove = false;
	this.circularly = true;
	this.pageIndex = 0;
	this.speed = 20;
	this.space = 20;
	this.tempArr = [];
	this.state = "ready";
}
Banner.prototype = {
	version: "1.40",
	author: "jzy",
	initialize: function(){
		var thisTemp = this;
		if (!this.banContId) {
			throw new Error("必须指定banContId.");
			return;
		};
		this.banDiv = PG._$(this.banContId);
		if (!this.banDiv) {
			throw new Error("banContId不是正确的对象.(banContId = \"" + this.banContId + "\")");
			return
		};
		
		if ((this.fadeMove ? 1 : 0) + (this.leftMove ? 1 : 0) + (this.upMove ? 1 : 0) !== 1) {
			return;
		};
		this.disLen= 0;
		this.pageLength = 0;
		this.listEvent = this.listEvent.substr(2);
		this.aButArr = PG._$(this.banButId).getElementsByTagName("span");
		this.scWid = PG.getFirstChild(this.banDiv).offsetWidth;
		this.scHei = PG.getFirstChild(this.banDiv).offsetHeight;
		
		
		PG.addEvent(this.banDiv, "mouseover", function(){
			thisTemp.stop()
		});
		PG.addEvent(this.banDiv, "mouseout", function(){
			thisTemp.play()
		});
		
		if (this.fadeMove) {
			this.tempArr = PG.getChildNodes(this.banDiv);
			if (this.banTitId){
				this.banTit = PG._$(this.banTitId);
				this.banTitArr = PG.GT(this.banTit, 'p');
			}
			
			this.pageLength = this.tempArr.length;
			this.banDiv.style.position = "relative";
			for(var i = 0;i < this.tempArr.length;i++){
				this.tempArr[i].index = i;
				this.tempArr[i].style.opacity = 0;
				if (PG.isIE){
					this.tempArr[i].style.filter = "alpha(opacity:0)";
				}
				this.tempArr[i].style.position = "absolute";
				this.tempArr[i].style.zIndex = 1;
				this.aButArr[i].className = this.dotClassName;
				
				if (this.banTitId){
					this.banTitArr[i].index = i;
					this.banTitArr[i].className = 'none';
				}
				
				PG.addEvent(this.aButArr[i], this.listEvent, (function(b){
					return function(){thisTemp.fn.call(b)};
				})(this.tempArr[i]));
			}
			this.tempArr[this.pageIndex].style.opacity = 100;
			if (PG.isIE){
				this.tempArr[this.pageIndex].style.filter = "alpha(opacity:100)";
			}
			this.tempArr[this.pageIndex].style.zIndex = 2;
			this.aButArr[this.pageIndex].className = this.dotOnClassName;

			if (this.banTitId){
				this.banTitArr[this.pageIndex].className = ' ';
			}
			
			this.fn = function(){
				thisTemp.cut(this);
			}
			
			if (this.banLeftId) {
				this.alObj = PG._$(this.banLeftId);
				if (this.alObj) {
					PG.addEvent(this.alObj, "click",
					function(e) {
						thisTemp.leftFade();
						e = PG.getEvent(e);
						PG.preventDefault(e)
					});
				}
			}
			if (this.banRightId) {
				this.arObj = PG._$(this.banRightId);
				if (this.arObj) {
					PG.addEvent(this.arObj, "click",
					function(e) {
						thisTemp.rightFade();
						e = PG.getEvent(e);
						PG.preventDefault(e)
					});
				}
			}
			
		} else {
			this.scCont = this.banDiv.parentNode;
			this.scCont.style.overflow = "hidden";
			this.scCont.style.zoom = "1";
			this.banDiv.style.zoom = "1";
			if (this.circularly) {
				this.banDiv.innerHTML += this.banDiv.innerHTML;
			}
			this.tempArr = PG.getChildNodes(this.banDiv);
			if (this.leftMove) {
				this._scroll = "scrollLeft";
				this.pageWidth = this.scWid;
				this.banDiv.style.width = this.scWid * this.tempArr.length + 'px';
				for (var i = 0;i < this.tempArr.length;i++){
					this.tempArr[i].style.cssFloat = "left";
					this.tempArr[i].style.styleFloat = "left";
				}
				this.disLen = this.circularly ? parseInt(this.banDiv.style.width) / 2 : parseInt(this.banDiv.style.width);
				this.scCont[this._scroll] = this.pageWidth * this.pageIndex;
			} else {
				this._scroll = "scrollTop";
				this.pageWidth = this.scHei;
				this.banDiv.style.height = this.scHei * this.tempArr.length + 'px';
				this.disLen = this.circularly ? parseInt(this.banDiv.style.height) / 2 : parseInt(this.banDiv.style.height);
				this.scCont[this._scroll] = this.pageWidth * this.pageIndex;
			}
			
			if (this.banLeftId) {
				this.alObj = PG._$(this.banLeftId);
				if (this.alObj) {
					PG.addEvent(this.alObj, "mousedown",
					function(e) {
						thisTemp.rightMouseDown();
						e = PG.getEvent(e);
						PG.preventDefault(e)
					});
					PG.addEvent(this.alObj, "mouseup",
					function() {
						thisTemp.rightEnd()
					});
					PG.addEvent(this.alObj, "mouseout",
					function() {
						thisTemp.rightEnd()
					})
				}
			}
			if (this.banRightId) {
				this.arObj = PG._$(this.banRightId);
				if (this.arObj) {
					PG.addEvent(this.arObj, "mousedown",
					function(e) {
						thisTemp.leftMouseDown();
						e = PG.getEvent(e);
						PG.preventDefault(e)
					});
					PG.addEvent(this.arObj, "mouseup",
					function() {
						thisTemp.leftEnd()
					});
					PG.addEvent(this.arObj, "mouseout",
					function() {
						thisTemp.leftEnd()
					})
				}
			}
			
			var pages = Math.ceil(this.disLen / this.pageWidth);
			this.pageLength = pages;
			for (i = 0; i < this.pageLength; i++) {
				this.aButArr[i].index = i;
				if (i == this.pageIndex) {
					this.aButArr[i].className = this.dotOnClassName;
				} else {
					this.aButArr[i].className = this.dotClassName;
				}
				PG.addEvent(this.aButArr[i], this.listEvent, (function(b){
					return function(){thisTemp.fn.call(b)};
				})(this.aButArr[i]));
			};
			this.fn = function(){
				thisTemp.pageTo(this.index);
			}
		}
		
		if (this.autoPlay) {
			this.play()
		}
	},
	play: function() {
		var thisTemp = this;
		if (!this.autoPlay) {
			return
		}
		clearInterval(this.autoTimeObj);
		if (this.fadeMove) {
			this.autoTimeObj = setInterval(function() {
				thisTemp.pageIndex++;
				if (thisTemp.pageIndex >= thisTemp.pageLength) {
					thisTemp.pageIndex = 0;
				}
				thisTemp.cut(thisTemp.tempArr[thisTemp.pageIndex]);
			},
			this.autoPlayTime * 1000);
		} else {
			this.autoTimeObj = setInterval(function() {
				thisTemp.next()
			},
			this.autoPlayTime * 1000)
		}
	},
	stop: function() {
		if (!this.autoPlay) {
			return
		}
		clearInterval(this.autoTimeObj);
	},
	next: function() {
		if (this.state != "ready") {
			return
		};
		this.state = "stoping";
		if (this.circularly) {
			this.move(this.pageWidth)
		} else {
			if (this.scCont[this._scroll] >= this.disLen - this.frameWidth) {
				this.state = "ready";
			} else {
				this.move(this.pageWidth)
			}
		}
	},
	pageTo: function(num) {
		if (this.pageIndex == num) {
			return
		}
		if (num < 0) {
			num = this.pageLength - 1;
		}
		clearTimeout(this.scrollTimeObj);
		clearInterval(this.scrollTimeObj);
		this.state = "stoping";
		var fill = num * this.pageWidth - this.scCont[this._scroll];
		this.move(fill);
	},
	leftMouseDown: function() {
		if (this.state != "ready") {
			return;
		}
		var thisTemp = this;
		this.state = "floating";
		clearInterval(this.scrollTimeObj);
		this.scrollTimeObj = setInterval(function() {
			thisTemp.moveLeft();
		}, this.speed);

		this.moveLeft();
	},
	rightMouseDown: function() {
		if (this.state != "ready") {
			return;
		}
		var thisTemp = this;
		this.state = "floating";
		clearInterval(this.scrollTimeObj);
		this.scrollTimeObj = setInterval(function() {
			thisTemp.moveRight();
		}, this.speed);
		this.moveRight();
	},
	moveLeft: function() {
		if (this.state != "floating") {
			return;
		}
		if (this.circularly) {
			if (this.scCont[this._scroll] + this.space >= this.disLen) {
				this.scCont[this._scroll] = this.scCont[this._scroll] + this.space - this.disLen;
			} else {
				this.scCont[this._scroll] += this.space;
			}
		} else {
			if (this.scCont[this._scroll] + this.space >= this.disLen - this.pageWidth) {
				this.scCont[this._scroll] = this.disLen - this.pageWidth;
				this.leftEnd()
			} else {
				this.scCont[this._scroll] += this.space
			}
		}
		this.accountPageIndex();
	},
	moveRight: function() {
		if (this.state != "floating") {
			return;
		}
		if (this.circularly) {
			if (this.scCont[this._scroll] - this.space <= 0) {
				this.scCont[this._scroll] = this.disLen + this.scCont[this._scroll] - this.space;
			} else {
				this.scCont[this._scroll] -= this.space;
			}
		} else {
			if (this.scCont[this._scroll] - this.space <= 0) {
				this.scCont[this._scroll] = 0;
				this.rightEnd()
			} else {
				this.scCont[this._scroll] -= this.space
			}
		}
		
		this.accountPageIndex();
	},
	leftEnd: function() {
		if (this.state != "floating") {
			return
		}
		this.state = "stoping";
		clearInterval(this.scrollTimeObj);
		var fill = this.pageWidth - this.scCont[this._scroll] % this.pageWidth;
		this.move(fill);
	},
	rightEnd: function() {
		if (this.state != "floating") {
			return
		}
		this.state = "stoping";
		clearInterval(this.scrollTimeObj);
		var fill = -this.scCont[this._scroll] % this.pageWidth;
		this.move(fill);
	},
	cut: function(obj) {
		this.state = "stoping";
		for(var i = 0;i < this.tempArr.length;i++){
			this.startMove(this.tempArr[i], 'opacity', 0);
			this.tempArr[i].style.zIndex = 1;

			if (this.banTitId){
				this.banTitArr[i].className = 'none';
			}
		}
		
		this.startMove(obj, 'opacity', 100);
		obj.style.zIndex = 2;
		
		if (this.banTitId){
			this.banTitArr[obj.index].className = ' ';
		}
		
		this.accountPageIndex(obj.index);
	},
	startMove: function(obj, attr, iTarget){
		var thisTemp = this;
        clearInterval(obj.timer);
        obj.timer = setInterval(function(){
        	thisTemp.doMove(obj, attr, iTarget);
        }, this.speed);
    },
    doMove: function(obj, attr, iTarget){
        var iCur = 0;
        if (attr == 'opacity') {
            iCur = parseInt(100 * PG.getStyle(obj, attr)) || 0;
        }
        else {
            iCur = parseInt(PG.getStyle(obj, attr)) || 0;
        }
        var iSpeed = (iTarget - iCur) / 8;
        iSpeed = (iSpeed > 0) ? Math.ceil(iSpeed) : Math.floor(iSpeed);
        if (iCur == iTarget) {
            clearInterval(obj.timer);
            this.state = "ready";
        } else if (attr == 'opacity') {
			obj.style.filter = 'alpha(opacity=' + (iCur + iSpeed) + ')';
			obj.style.opacity = (iCur + iSpeed) / 100;
		} else {
			obj.style[attr] = iCur + iSpeed + 'px';
		}
    },
    leftFade: function(){
    	if (this.state != "ready") {
			return
		}
    	this.pageIndex -= 1;
    	this.pageIndex = this.pageIndex < 0 ? (this.pageLength - 1) : this.pageIndex;
    	this.cut(this.tempArr[this.pageIndex]);
    },
    rightFade: function(){
    	if (this.state != "ready") {
			return
		}
    	this.pageIndex += 1;
    	this.pageIndex = this.pageIndex >= this.pageLength ? 0 : this.pageIndex;
    	this.cut(this.tempArr[this.pageIndex]);
    },
	move: function(num) {
		var thisTemp = this;
		var thisMove = num / 8;
		var theEnd = false;
		if (Math.abs(thisMove) < 1 && thisMove != 0) {
			thisMove = thisMove >= 0 ? 1 : -1
		} else {
			thisMove = Math.round(thisMove)
		}
		var temp = this.scCont[this._scroll] + thisMove;
		if (thisMove > 0) {
			if (this.circularly) {
				if (this.scCont[this._scroll] + thisMove >= this.disLen) {
					this.scCont[this._scroll] = this.scCont[this._scroll] + thisMove - this.disLen
				} else {
					this.scCont[this._scroll] += thisMove
				}
			} else {
				if (this.scCont[this._scroll] + thisMove >= this.disLen - this.frameWidth) {
					this.scCont[this._scroll] = this.disLen - this.frameWidth;
					this.state = "ready";
					theEnd = true
				} else {
					this.scCont[this._scroll] += thisMove
				}
			}
		} else {
			if (this.circularly) {
				if (this.scCont[this._scroll] + thisMove < 0) {
					this.scCont[this._scroll] = this.disLen + this.scCont[this._scroll] + thisMove
				} else {
					this.scCont[this._scroll] += thisMove
				}
			} else {
				if (this.scCont[this._scroll] + thisMove <= 0) {
					this.scCont[this._scroll] = 0;
					this.state = "ready";
					theEnd = true
				} else {
					this.scCont[this._scroll] += thisMove
				}
			}
		};
		if (theEnd) {
			return
		}
		this.accountPageIndex();
		num -= thisMove;
		if (Math.abs(num) == 0) {
			this.state = "ready";
			if (this.autoPlay) {
				this.play()
			};
			this.accountPageIndex();
			return
		} else {
			clearTimeout(this.scrollTimeObj);
			this.scrollTimeObj = setTimeout(function() {
				thisTemp.move(num)
			},
			this.speed)
		}
	},
	accountPageIndex: function(num) {
		var pageIndex = this.fadeMove ? num : Math.round(this.scCont[this._scroll] / this.pageWidth);
		if (pageIndex >= this.pageLength) {
			pageIndex = 0;
		}
		this.pageIndex = pageIndex;
		for (var i = 0; i < this.pageLength; i++) {
			if (i == this.pageIndex) {
				this.aButArr[i].className = this.dotOnClassName;
			} else {
				this.aButArr[i].className = this.dotClassName;
			}
		}
	}
}