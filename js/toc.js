// https://github.com/ghiculescu/jekyll-table-of-contents : MIT
// Modified also by Jeff Wilcox : MIT
(function($){
  $.fn.toc = function(options) {
    var defaults = {
      noBackToTopLinks: false,
      title: '<i>Jump to...</i>',
      minimumHeaders: 3,
      headers: 'h1, h2, h3, h4, h5, h6',
      listType: 'ol', // values: [ol|ul]
      showEffect: 'show', // values: [show|slideDown|fadeIn|none]
      showSpeed: 'slow' // set to 0 to deactivate effect
    },
    settings = $.extend(defaults, options);

    function fixedEncodeURIComponent (str) {
      return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16);
      });
    }

    var headers = $(settings.headers).filter(function() {
      // get all headers with an ID
      var previousSiblingName = $(this).prev().attr( "name" );
      //console.log('psn: ' + previousSiblingName);
      //console.log('id:  ' + $(this).id);
      if (!$(this).id && previousSiblingName) {
        //$(this).id =  $(this).attr( "id", previousSiblingName.replace(/\./g, "-") );
         $(this).attr( "id", previousSiblingName.replace(/[\.:]/g, "-") );
      }
      console.log('this id is now: ' + $(this).attr('id'));
      //console.log($(this).text());
      return $(this).attr('id') || $(this).id;
      //return this.id;
    }), output = $(this);
    if (!headers.length || headers.length < settings.minimumHeaders || !output.length) {
      //$(this).hide();
      return;
    }
    if (0 === settings.showSpeed) {
      settings.showEffect = 'none';
    }
    var render = {
      show: function() { output.hide().html(html).show(settings.showSpeed); },
      slideDown: function() { output.hide().html(html).slideDown(settings.showSpeed); },
      fadeIn: function() { output.hide().html(html).fadeIn(settings.showSpeed); },
      none: function() { output.html(html); }
    };

    var get_level = function(ele) { return parseInt(ele.nodeName.replace("H", ""), 10); }
    var highest_level = headers.map(function(_, ele) { return get_level(ele); }).get().sort()[0];
    var return_to_top = '<i class="icon-arrow-up back-to-top"> </i>';
    var itemCount = 0;
    var level = get_level(headers[0]),
      this_level,
      html = settings.title + " <"+settings.listType + settings.extraListGoo + ">";
    headers.on('click', function() {
      if (!settings.noBackToTopLinks) {
        window.location.hash = this.id;
      }
    })
    .addClass('clickable-header')
    .each(function(_, header) {
      this_level = get_level(header);
      if (!settings.noBackToTopLinks && this_level === highest_level) {
        $(header).addClass('top-level-header').after(return_to_top);
      }
        itemCount++;
        if (itemCount == 1 && settings.firstItemHtml) {
            html += settings.firstItemHtml;
        }

      if (this_level === level) // same level as before; same indenting
        html += "<li><a href='#" + fixedEncodeURIComponent(header.id) + "'>" + header.innerHTML + "</a>";
      else if (this_level <= level){ // higher level than before; end parent ol
        for(i = this_level; i < level; i++) {
          html += "</li></"+settings.listType+">"
        }
        html += "<li><a href='#" + fixedEncodeURIComponent(header.id) + "'>" + header.innerHTML + "</a>";
      }
      else if (this_level > level) { // lower level than before; expand the previous to contain a ol
        for(i = this_level; i > level; i--) {
          html += "<"+settings.listType + settings.extraListGoo2 + "><li>"
        }
        html += "<a href='#" + fixedEncodeURIComponent(header.id) + "'>" + header.innerHTML + "</a>";
      }
      level = this_level; // update for the next one
    });
    html += "</"+settings.listType+">";
    if (!settings.noBackToTopLinks) {
      $(document).on('click', '.back-to-top', function() {
        $(window).scrollTop(0);
        window.location.hash = '';
      });
    }
    if (settings.footer) {
        html += settings.footer;
    } 
    render[settings.showEffect]();
  };
})(jQuery);
