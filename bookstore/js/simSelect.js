/*
 * sim_select 类
 */
function sim_select(selId) {
	this.selId = selId;
	if (!this.selId){
		throw new Error("必须指定this.selId.");
		return
	}
	var thisTemp = this;
	this.obj = PG._$(this.selId);
	this.obj.style.display = 'none';
	var opts = this.obj.options;
	var parent = this.obj.parentNode;
	this.isShow = false;
	this.div = document.createElement('div');
	this.ul = document.createElement('ul');
	this.h3 = document.createElement('h3');
	this.div.className = 'sim_select';
	parent.replaceChild(this.div, this.obj);
	this.div.appendChild(this.obj);
	this.ul.style.display = 'none';
	this.h3.innerHTML = opts[this.obj.selectedIndex].innerHTML;

	for (var i = 0, l = this.obj.length; i < l; i++) {
		var li = document.createElement('li');
		li.innerHTML = opts[i].innerHTML;
		li.index = i;
		//li.setAttribute("val",opts[i].getAttribute("value"));
		this.ul.appendChild(li);
		li.onmouseover = function() {
			this.className += ' over'
		};
		li.onmouseout = function() {
			this.className = this.className.replace(/over/gi, '')
		};
		li.onclick = function() {
			thisTemp.hide();
			thisTemp.h3.innerHTML = this.innerHTML;
			//thisTemp.obj.value = this.getAttribute("val");
			opts[this.index].setAttribute("selected", "selected");
		};
	};
	this.div.appendChild(this.h3);
	this.div.appendChild(this.ul);
	this.ul.style.width = parent.offsetWidth + 'px';
	this.ul.style.position = "absolute";
	var ulBorWid = parseInt(PG.getStyle(parent, 'borderLeftWidth'));
	if (ulBorWid > 0) {
		this.ul.style.left = -ulBorWid + 'px';
	} else {
		this.ul.style.left = 0;
	}
	this.ul.style.top = this.h3.offsetHeight + 'px';
	this.ul.style.zIndex = 2;
	this.init();
};
sim_select.prototype = {
	version: "1.00",
	author: "jzy",
	init: function(){
		var thisTemp = this;
		PG.addEvent(document.documentElement, 'click', function(e){
			thisTemp.close(e);
		});
		this.h3.onclick = function(){
			thisTemp.toggles();
		}
	},
	show: function(){
		this.ul.style.display = 'block';
		this.isShow = true;
	},
	hide: function(){
		this.ul.style.display = 'none';
		this.isShow = false;
	},
	close: function(e){
		var t = window.event ? window.event.srcElement : e.target;//事件源对象,被该事件绑定的对象
		do {
			if (t == this.div) {
				return
			}
			else 
				if (t == document.documentElement) {
					this.hide();
					return
				}
				else {
					t = t.parentNode;
					if (!t) {
						break;
					}
				}
		}
		while (t.parentNode)
	},
	toggles: function(){
		this.isShow ? this.hide() : this.show()
	}
}