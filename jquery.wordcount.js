/**
 * jQuery Word Count Plugin by M. Pezzi
 * http://thespiral.ca/jquery/wordcount/demo/
 * Version: 0.1-alpha (07/27/11)
 * Dual licensed under the MIT and GPL licences:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires: jQuery v1.4.2 or later
 */

 /**
  * jQuery Word / Character Count Plugin.
  */
;(function($){

$.fn.wordcount = function(settings) {
  return this.each(function(){
    var self        = $(this), o = $.extend({}, $.fn.wordcount.defaults, settings || {}),
        form        = $(this).parents('form'),
        disable     = $(o.disable, form),
        messages    = o.messages[o.type],
        status      = $('<div />').addClass(o.statusClass).insertAfter(self),
        error_min   = $('<div />').addClass(o.errorClass),
        error_max   = $('<div />').addClass(o.errorClass),
        length      = get_count(self, o.type);

    self.keyup(function(){
      var length    = get_count(self, o.type);
          min_valid = true,
          max_valid = true;

      // Minimum words.
      if ( o.min > 0 ) {
        // Need more words.
        if ( length < o.min ) {
          min_valid = false;
          if ( !error_min.data('wordcount:error-min') ) {
            error_min.data('wordcount:error-min', 1).insertAfter(form);
            set_message(error_min, messages.error_min);
          }
        }
        // It's all good.
        else {
          error_min.data('wordcount:error-min', 0).remove();
        }
      }

      // Maximum words.
      if ( o.max > 0 ) {
        // Need less words.
        if ( length > o.max ) {
          max_valid = false;
          if ( !error_max.data('wordcount:error-max') ) {
            error_max.data('wordcount:error-max', 1).insertAfter(form);
            set_message(error_max, messages.error_max);
          }
        }
        // It's all good.
        else {
          error_max.data('wordcount:error-max', 0).remove();
        }
      }

      // Enable or Disable form.
      ( !min_valid || !max_valid ) ?
        disable.attr('disabled', 'disabled') :
        disable.removeAttr('disabled');

      set_message(status, messages.status, length);
      
      if ( o.min > 0 ) {
        count = o.min - length;
        count = ( count >= 0 ) ? count : 0;

        set_message(status, messages.reached_min, count, true);

        if ( ( length / o.min ) >= 1 ) {
          status.removeClass(o.minClassError);
          status.removeClass(o.minClassWarning);
          status.addClass(o.minClassGood);
        }
        else if ( ( length / o.min ) > 0.8 ) {
          status.removeClass(o.minClassError);
          status.addClass(o.minClassWarning);
        }
        else if ( ( length / o.min ) > 0 ) {
          status.removeClass(o.minClassWarning);
          status.addClass(o.minClassError);
        }
      }

      if ( o.max > 0 ) {
        count = o.max - length;
        count = ( count >= 0 ) ? count : 0;

        set_message(status, messages.reached_max, count, true);

        if ( ( length / o.max ) < 0.8 ) {
          status.removeClass(o.maxClassError);
          status.removeClass(o.maxClassWarning);
          status.addClass(o.maxClassGood);
        }
        else if ( ( length / o.max ) < 0.9 ) {
          status.removeClass(o.maxClassError);
          status.addClass(o.maxClassWarning);
        }
        else if ( ( length / o.max ) >= 0.9 ) {
          status.removeClass(o.maxClassWarning);
          status.addClass(o.maxClassError);
        }
      }

    });

    set_message(status, messages.status, length);

    // Get the count of an element.
    function get_count(element, type) {
      switch ( type ) {
        case 'words':
          return ( $.trim( element.val() ) != '' ) ?
            $.trim( element.val() ).split(/\s+/).length : 0;
        case 'chars':
        default:
          return element.val().length;
      }
    }

    // Set the message of the current element.
    function set_message(element, haystack, replace, append) {
      if ( typeof replace == 'undefined' ) replace = '';
      if ( typeof append == 'undefined' ) append = false;

      append ? 
        element.html( element.html() + ' ' + String(haystack).replace('@count', replace) ) :
        element.html(String(haystack).replace('@count', replace));
    }

  });
};

$.fn.wordcount.defaults = {
  type: 'words',
  min: 0,
  max: 0,
  disable: 'input:submit, input:image',
  statusClass: 'wordcount-status',
  errorClass: 'wordcount-error',
  warningClass: 'wordcount-warning',
  minClassError: 'wordcount-min-error',
  minClassWarning: 'wordcount-min-warning',
  minClassGood: 'wordcount-min-good',
  maxClassError: 'wordcount-max-error',
  maxClassWarning: 'wordcount-max-warning',
  maxClassGood: 'wordcount-max-good',
  messages: {
    words : {
      status: '@count word(s) used.',
      reached_min: 'You need <span class="min">@count more word(s)</span>.',
      reached_max: 'You have <span class="max">@count word(s) left</span>.',
      error_min: "You don't have enough words in the field above. Please increase the number of words to fit the limit.",
      error_max: "You used too many words in the field above. Please reduce the number of words to fit the limit."
    },
    chars : {
      status: '@count character(s) used.',
      reached_min: 'You need <span class="min">@count more character(s)</span>.',
      reached_max: 'You have <span class="max">@count character(s) left</span>.',
      error_min: "You don't have enough characters in the field above. Please increase the number of characters to fit the limit.",
      error_max: "You used too many characters in the field above. Please reduce the number of characters to fit the limit."
    }
  }
};

})(jQuery);