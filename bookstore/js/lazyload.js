/**
 * @version 1.00
 * @author  焦质晔
 * @update  2014-08-20
 */
function Lazyload(){
	this.init.apply(this, arguments);
}
Lazyload.prototype = {
	version: "1.00",
	author: "jzy",
	init: function(options){
		var thisTemp = this;
		
		var oImgArr = [];
		//var tArr = document.getElementsByTagName('img'); //可做灵活处理
		var tArr = jQuery("img:visible");
		
		for (var i = 0 in tArr){
			oImgArr[i] = tArr[i];
			oImgArr[i]._top = PG.getPosition(tArr[i])[1];
		}
		
		lazyFn(oImgArr);
		
		function scrollFn(){
			lazyFn(oImgArr);
			if (oImgArr.length == 0){
				PG.delEvent(window, 'scroll', scrollFn);
			}
		}
		
		function lazyFn(arr){
			for (var i = 0; i < arr.length; i++){
				var t = arr[i]._top - PG.scrollY() - PG.windowHeight();
				if (t < 200){
					if (arr[i].getAttribute('_src')){
						arr[i].src = arr[i].getAttribute('_src');
					}
					arr.splice(i, 1);
					i--; //指针向前移动一位
				}
			}
		}
		
		PG.addEvent(window, 'scroll', scrollFn);
		
	}
}
