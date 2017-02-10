$(function(){
	$("#search").submit( function() {
			var searchTxt = $("#search input:text[name='seastr']").val();
			if ( searchTxt == "" || searchTxt == $("#search input:text[name='seastr']").attr("defval") ) {
				$(this).find("input:text[name='seastr']").val($("#search input:text[name='seastr']").attr("defval"));
				return false;
			}
		} ).find("input:text[name='seastr']").focus( function() {
			var searchTxt = $(this).val();
			if ( searchTxt == $(this).attr("defval") ) {
				$(this).val("");
			}
		} ).blur( function() {
			var searchTxt = $("#search input:text[name='seastr']").val();
			if (searchTxt == $(this).attr("defval") || searchTxt == "" ) {
				$(this).val($(this).attr("defval"));
			}
		} );
});