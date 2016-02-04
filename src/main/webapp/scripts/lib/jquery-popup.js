/*!
 * Copyright (c) 2010-2015 Pivotal Software, Inc. All rights reserved.
 *
 * Licensed under the same terms as jQuery: https://jquery.org/license
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE
 */
$(document).ready(function() {

  // popHandler handles the display of pop up window on click event on link
  function popupHandler(e) {
    // Cancel the link behavior
    e.preventDefault();

    // Get the A tag
    var id = $(this).attr('href');

    // Get the screen height and width
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();

    // Set height and width to mask to fill up the whole screen
    $('#mask').css({
      'width' : maskWidth,
      'height' : maskHeight
    });

    // transition effect
    $('#mask').fadeIn(1000);
    $('#mask').fadeTo("fast", 0.8);

    // Get the window height and width
    var winH = $(window).height();
    var winW = $(window).width();

    // Set the popup window to center
    $(id).css('top', winH / 2 - $(id).height() / 2);
    $(id).css('left', winW / 2 - $(id).width() / 2);

    // transition effect
    $(id).fadeIn(1500);

  };    // end of popupHandler

  // Add popupHandler on click of version details link   
  $('[id=pulseVersionDetailsLink]').click(popupHandler);

  // if close button is clicked
  $('.window .closePopup').click(function(e) {
    // Cancel the link behavior
    e.preventDefault();

    $('#mask').hide();
    $('.window').hide();
  });
  // if input close button is clicked
  $('.window .closePopupInputButton').click(function(e) {
    // Cancel the link behavior
    e.preventDefault();

    $('#mask').hide();
    $('.window').hide();
  });

  // if mask is clicked
  $('#mask').click(function() {
    $(this).hide();
    $('.window').hide();
  });

});
