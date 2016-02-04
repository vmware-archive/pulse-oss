/*!
 * Code from http://tutorialzine.com/2011/05/generating-files-javascript-php/
 *
 * License with relevant portions reproduced below:
 *
 *   http://tutorialzine.com/license/
 *
 * The source code and techniques, covered in our tutorials, are free for use
 * in your personal and commercial projects.
 *
 * You can use, modify and build upon our code for your (or your clients’)
 * personal and commercial projects with no attribution necessary.
 *
 * If you plan to include our source code in site templates or to package it
 * with other forms of digital content, meant for direct selling on online
 * marketplaces (such as ThemeForest, ActiveDen etc.), you are required to
 * include a back-link to the article in question on Tutorialzine.com.
 */
(function($){
	
	// Creating a jQuery plugin:
	
	$.generateFile = function(options){
		
		options = options || {};
		
		if(!options.script || !options.filename || !options.content){
			throw new Error("Please enter all the required config options!");
		}
		
		// Creating a 1 by 1 px invisible iframe:
		
		var iframe = $('<iframe>',{
			width:1,
			height:1,
			frameborder:0,
			css:{
				display:'none'
			}
		}).appendTo('body');

		var formHTML = '<form action="" method="post">'+
			'<input type="hidden" name="filename" />'+
			'<input type="hidden" name="content" />'+
			'</form>';
		
		// Giving IE a chance to build the DOM in
		// the iframe with a short timeout:
		
		setTimeout(function(){
		
			// The body element of the iframe document:
		
			var body = (iframe.prop('contentDocument') !== undefined) ?
							iframe.prop('contentDocument').body :
							iframe.prop('document').body;	// IE
			
			body = $(body);
			
			// Adding the form to the body:
			body.html(formHTML);
			
			var form = body.find('form');
			
			form.attr('action',options.script);
			form.find('input[name=filename]').val(options.filename);
			form.find('input[name=content]').val(options.content);
			
			// Submitting the form to download.php. This will
			// cause the file download dialog box to appear.
			
			form.submit();
		},50);
	};
	
})(jQuery);
