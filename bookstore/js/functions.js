//---------- 图片自动比例
/*$( function() {
	$(".PicAuto").each( function() {
		var BoxWidth = $(this).attr("width")?$(this).attr("width"):$(this).attr("_width");
		var BoxHeight = $(this).attr("height")?$(this).attr("height"):$(this).attr("_height");
		var img = new Image(),_this = $(this);
		img.src = $(this).attr("src");
		if ( img.complete ) {
			var RealWidth = img.width,RealHeight = img.height,Padding = 0;
			if ( RealWidth / RealHeight > BoxWidth / BoxHeight ) {
				RealHeight = parseInt( BoxWidth / RealWidth * RealHeight );
				RealWidth = parseInt( BoxWidth );
				Padding = parseInt( ( BoxHeight - RealHeight ) / 2 );
				_this.attr("width",RealWidth).attr("height",RealHeight).css("padding",Padding + "px 0");
			}
			else {
				RealWidth = parseInt( BoxHeight / RealHeight * RealWidth );
				RealHeight = parseInt( BoxHeight );
				Padding = parseInt( ( BoxWidth - RealWidth ) / 2 );
				_this.attr("width",RealWidth).attr("height",RealHeight).css("padding","0 " + Padding + "px");
			}
		}
		img.onload = function() {
			var RealWidth = img.width,RealHeight = img.height,Padding = 0;
			if ( RealWidth / RealHeight > BoxWidth / BoxHeight ) {
				RealHeight = parseInt( BoxWidth / RealWidth * RealHeight );
				RealWidth = parseInt( BoxWidth );
				Padding = parseInt( ( BoxHeight - RealHeight ) / 2 );
				_this.attr("width",RealWidth).attr("height",RealHeight).css("padding",Padding + "px 0");
			}
			else {
				RealWidth = parseInt( BoxHeight / RealHeight * RealWidth );
				RealHeight = parseInt( BoxHeight );
				Padding = parseInt( ( BoxWidth - RealWidth ) / 2 );
				_this.attr("width",RealWidth).attr("height",RealHeight).css("padding","0 " + Padding + "px");
			}
			return;
		};
	} );
	
	$(".PicLoad").hide().each( function() {
		var img = new Image(),_this = $(this),maxwidth = parseInt( $(this).attr("maxwidth") ),showtime = $(this).attr("showtime");
		img.src = $(this).attr("src");
		if ( /^[0-9]+$/.test(showtime) ) {
			showtime = parseInt(showtime);
		}
		if ( img.complete ) {
			if ( maxwidth > img.width ) {
				maxwidth = img.width;
			}
			$(this).attr("width",maxwidth).show(showtime);
		}
		img.onload = function() {
			if ( maxwidth > this.width ) {
				maxwidth = this.width;
			}
			_this.attr("width",maxwidth).show(showtime);
			return;
		};
	} );
} );*/