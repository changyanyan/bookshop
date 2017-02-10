/**
 * @version 1.00
 * @author  焦质晔
 * @update  2014-08-20
 */
function Tab(){
	this.init.apply(this, arguments);
}
Tab.prototype = {
	version: "1.00",
	author: "jzy",
	init: function(options){
		this.optionId = options.optionId;
		this.contId = options.contId;
		this.evType = options.eventType || 'mouseover';
		this.tabUrlId = options.tabUrlId || '';
		this.curIndex = options.curIndex || 0;

		var thisTemp = this;

		if (!this.optionId && !this.contId){
			throw new Error('必须制定正确的 optionId 和 contId.');
			return;
		}
		
		var oTab = PG._$(this.optionId);
		var oCont = PG._$(this.contId);
		var urlArr = [];
		
		var oTabArr = PG.getChildNodes(oTab);
		var oContArr = PG.getChildNodes(oCont);
		if (oTabArr.length != oContArr.length){
			throw new Error('选项卡初始化的不正确.');
			return;
		}
		var Len = oTabArr.length;
		
		//初始化
		for (var i = 0; i < Len; i++){
			oTabArr[i].index = oContArr.index = i;
			PG.addClass(oTabArr[this.curIndex], 'selected');

			//卡内图片懒加载
			oTabArr[i].lazyload = true;
			
			//有 more 的情况
			if (this.tabUrlId){
				//urlArr[i] = oTabArr[i]._url; //IE 能获取到 FF, chrome 无法获取到 , 需使用 getAttribute 方法, 如果是 js 动态创建(或者标签自带的属性)的属性则可以用 /.属性/ 的方法获取
				urlArr[i] = oTabArr[i].getAttribute('_url');
			}

			oContArr[i].style.display = 'none';
			if (this.curIndex == i) oContArr[i].style.display = 'block';

			//绑定事件
			PG.addEvent(oTabArr[i], this.evType, function(){
				select(this.index);
			});
		}

		//处理懒加载
		lazyload(this.curIndex);

		//有 more 的情况
		if (this.tabUrlId) {
			var oMore = PG._$(this.tabUrlId);
			oMore.href = urlArr[this.curIndex];
		}

		function select(index){
			for (var i = 0; i < Len; i++){
				PG.removeClass(oTabArr[i], 'selected');
				PG.addClass(oTabArr[index], 'selected');
				
				oContArr[i].style.display = 'none';
				oContArr[index].style.display = 'block';
			}

			//处理懒加载
			if (oTabArr[index].lazyload) lazyload(index);

			//有 more 的情况
			if (thisTemp.tabUrlId) oMore.href = urlArr[index];
		}
		
		//图片懒加载方法
		function lazyload(index){
			oTabArr[index].lazyload = false;

			var oImgArr = oContArr[index].getElementsByTagName('img');
			for (var k = 0; k < oImgArr.length; k++){
				oImgArr[k].src = oImgArr[k].getAttribute('_src');
			}
		}

	}
}