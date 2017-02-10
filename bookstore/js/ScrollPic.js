//无缝滚动图片构造函数
function ScrollPic() {
	this.scrollContId = "";
	this.arrLeftId = "";
	this.arrRightId = "";
	this.frameWidth = 0;
	this.pageWidth = 0;
	this.speed = 20;
	this.space = 20;
	this.circularly = true;
	this.upright = false;
	this.autoPlay = true;
	this.autoPlayTime = 5;
	this.autoTimeObj;
	this.scrollTimeObj;
	this.addNum = 0;
	this.state = "ready";
	this.stripDiv = document.createElement("DIV");
};
ScrollPic.prototype = {
	version: "1.30",
	author: "jzy",
	initialize: function() {
		var thisTemp = this;
		if (!this.scrollContId) {
			throw new Error("必须指定scrollContId.");
			return
		}
		this.scDiv = PG._$(this.scrollContId);
		if (!this.scDiv) {
			throw new Error("scrollContId不是正确的对象.(scrollContId = \"" + this.scrollContId + "\")");
			return
		}
		
		this.disLen= 0;
		this._scroll = this.upright ? 'scrollTop': 'scrollLeft';
		this.scWid = PG.getFirstChild(this.scDiv).offsetWidth + this.addNum;
		this.scHei = PG.getFirstChild(this.scDiv).offsetHeight + this.addNum;
		this.scDiv.style[this.upright ? 'height': 'width'] = this.frameWidth + 'px';
		this.scDiv.style.overflow = "hidden";
		this.scDiv.style.zoom = "1";
		this.scDiv[this._scroll] = 0;
		
		this.stripDiv.innerHTML = this.scDiv.innerHTML;
		this.scDiv.innerHTML = "";
		this.scDiv.appendChild(this.stripDiv);
		this.stripDiv.style.overflow = "hidden";
		this.stripDiv.style.zoom = "1";
		
		if (this.circularly) {
			this.stripDiv.innerHTML += this.stripDiv.innerHTML;
		}
		this.tempArr = PG.getChildNodes(this.stripDiv);
		
		if (!this.upright) {
			this.stripDiv.style.width = this.scWid * this.tempArr.length + 'px';
			for (var i = 0;i < this.tempArr.length;i++){
				this.tempArr[i].style.cssFloat = "left";
				this.tempArr[i].style.styleFloat = "left";
			}
			this.disLen = this.circularly ? parseInt(this.stripDiv.style.width) / 2 : parseInt(this.stripDiv.style.width);
		} else {
			this.stripDiv.style.height = this.scHei * this.tempArr.length + 'px';
			this.halfWidth = this.ContWidth * this.tempArr.length;
			this.disLen = this.circularly ? parseInt(this.stripDiv.style.height) / 2 : parseInt(this.stripDiv.style.height);
		}

		if (this.arrLeftId) {
			this.alObj = PG._$(this.arrLeftId);
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
		if (this.arrRightId) {
			this.arObj = PG._$(this.arrRightId);
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

		PG.addEvent(this.scDiv, "mouseover", function(){
			thisTemp.stop()
		});
		PG.addEvent(this.scDiv, "mouseout", function(){
			thisTemp.play()
		});


		if (this.autoPlay) {
			this.play()
		}
	},
	leftMouseDown: function() {
		if (this.state != "ready") {
			return
		};
		var thisTemp = this;
		this.state = "floating";
		clearInterval(this.scrollTimeObj);
		this.scrollTimeObj = setInterval(function() {
			thisTemp.moveLeft();
		},
		this.speed);
		
		this.moveLeft()
	},
	rightMouseDown: function() {
		if (this.state != "ready") {
			return
		};
		var thisTemp = this;
		this.state = "floating";
		clearInterval(this.scrollTimeObj);
		this.scrollTimeObj = setInterval(function() {
			thisTemp.moveRight()
		},
		this.speed);
		this.moveRight()
	},
	moveLeft: function() {
		if (this.state != "floating") {
			return;
		}
		if (this.circularly) {
			if (this.scDiv[this._scroll] + this.space >= this.disLen) {
				this.scDiv[this._scroll] = this.scDiv[this._scroll] + this.space - this.disLen;
			} else {
				this.scDiv[this._scroll] += this.space;
			}
		} else {
			if (this.scDiv[this._scroll] + this.space >= this.disLen - this.pageWidth) {
				this.scDiv[this._scroll] = this.disLen - this.pageWidth;
				this.leftEnd()
			} else {
				this.scDiv[this._scroll] += this.space
			}
		}
	},
	moveRight: function() {
		if (this.state != "floating") {
			return;
		}
		if (this.circularly) {
			if (this.scDiv[this._scroll] - this.space <= 0) {
				this.scDiv[this._scroll] = this.disLen + this.scDiv[this._scroll] - this.space;
			} else {
				this.scDiv[this._scroll] -= this.space;
			}
		} else {
			if (this.scDiv[this._scroll] - this.space <= 0) {
				this.scDiv[this._scroll] = 0;
				this.rightEnd()
			} else {
				this.scDiv[this._scroll] -= this.space
			}
		}
	},
	leftEnd: function() {
		if (this.state != "floating") {
			return
		}
		this.state = "stoping";
		clearInterval(this.scrollTimeObj);
		var fill = this.pageWidth - this.scDiv[this._scroll] % this.pageWidth;
		this.move(fill);
	},
	rightEnd: function() {
		if (this.state != "floating") {
			return
		}
		this.state = "stoping";
		clearInterval(this.scrollTimeObj);
		var fill = -this.scDiv[this._scroll] % this.pageWidth;
		this.move(fill);
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
		var temp = this.scDiv[this._scroll] + thisMove;
		if (thisMove > 0) {
			if (this.circularly) {
				if (this.scDiv[this._scroll] + thisMove >= this.disLen) {
					this.scDiv[this._scroll] = this.scDiv[this._scroll] + thisMove - this.disLen
				} else {
					this.scDiv[this._scroll] += thisMove
				}
			} else {
				if (this.scDiv[this._scroll] + thisMove >= this.disLen - this.frameWidth) {
					this.scDiv[this._scroll] = this.disLen - this.frameWidth;
					this.state = "ready";
					theEnd = true
				} else {
					this.scDiv[this._scroll] += thisMove
				}
			}
		} else {
			if (this.circularly) {
				if (this.scDiv[this._scroll] + thisMove < 0) {
					this.scDiv[this._scroll] = this.disLen + this.scDiv[this._scroll] + thisMove
				} else {
					this.scDiv[this._scroll] += thisMove
				}
			} else {
				if (this.scDiv[this._scroll] + thisMove <= 0) {
					this.scDiv[this._scroll] = 0;
					this.state = "ready";
					theEnd = true
				} else {
					this.scDiv[this._scroll] += thisMove
				}
			}
		};
		if (theEnd) {
			return
		};
		num -= thisMove;
		if (Math.abs(num) == 0) {
			this.state = "ready";
			if (this.autoPlay) {
				this.play()
			};
			return
		} else {
			clearTimeout(this.scrollTimeObj);
			this.scrollTimeObj = setTimeout(function() {
				thisTemp.move(num)
			},
			this.speed)
		}
	},
	pre: function() {
		if (this._state != "ready") {
			return
		};
		this._state = "stoping";
		this.move( - this.pageWidth)
	},
	next: function() {
		if (this.state != "ready") {
			return
		};
		this.state = "stoping";
		if (this.circularly) {
			this.move(this.pageWidth)
		} else {
			if (this.scDiv[this._scroll] >= this.disLen - this.frameWidth) {
				this.state = "ready";
			} else {
				this.move(this.pageWidth)
			}
		}
	},
	play: function() {
		var thisTemp = this;
		if (!this.autoPlay) {
			return
		}
		clearInterval(this.autoTimeObj);
		this.autoTimeObj = setInterval(function() {
			thisTemp.next()
		},
		this.autoPlayTime * 1000)
	},
	stop: function() {
		clearInterval(this.autoTimeObj)
	}
}