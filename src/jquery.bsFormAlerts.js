/**
  * A jQuery plugin for displaying Bootstrap form alerts via jQuery events.
  */
;(function($, window, document, undefined) {
  "use strict";

  /* BsFormAlerts class definition
   * ========================== */
  var BsFormAlerts = function(element, options) {
    var self = this;

    this.element = element;
    this.options = $.extend({}, $.fn.bsFormAlerts.defaults, options);

    $(document).on("set-alert-id-"+this.options.alertid, function() {
      /**
        * Event data is passed in as multiple params, we
        * want them all as an array starting at the second one.
        * The first param is the event.
        */
      var msgs = Array.prototype.slice.call(arguments, 1);
      self.renderAlerts(msgs);
    });

    $(document).on("clear-alert-id."+this.options.alertid, function() {
      self.clear();
    });
  };

  BsFormAlerts.prototype = {
    constructor: BsFormAlerts,
    clear: function() {
      var $this = $(this.element);
      var $controlGroup = controlGroup($this);
      clearControlGroup($controlGroup);
      $this.html("");
    },
    renderAlerts: function(msgs) {
      var $this = $(this.element);

      if (msgs.length > 0) {
        var $controlGroup = controlGroup($this);
        var priority = highestPriority(msgs);

        // clear element
        clearControlGroup($controlGroup);
        $this.html("");

        var $ul = $("<ul/>");

        $.each(msgs, function(ix, it) {
          if (it.message && it.message.length > 0) {
            var $li = $("<li/>", {
              'class': 'text-'+bsPriority(it.priority)
            }).html(it.message);
            $ul.append($li);
          }
        });

        $this.append($ul);

        $controlGroup.addClass(bsPriority(priority));
      }
    }
  };

  // "private" functions
  function bsPriority(it) {
    if (it === "notice") {
      return "info";
    }
    else if (it === "danger") {
      return "error";
    }
    return it;
  }

  function highestPriority(msgs) {
    var errCnt = $.grep(msgs, function(it) {
      return it.priority === "error";
    }).length;

    if (errCnt > 0) {
      return "error";
    }

    var warnCnt = $.grep(msgs, function(it) {
      return it.priority === "warning";
    }).length;

    if (warnCnt > 0) {
      return "warning";
    }

    var successCnt = $.grep(msgs, function(it) {
      return it.priority === "success";
    }).length;

    if (successCnt > 0) {
      return "success";
    }

    return "info";
  }

  function controlGroup($ele) {
    return $ele.closest("div.control-group");
  }

  function clearControlGroup($ele) {
    $ele.removeClass("info");
    $ele.removeClass("warning");
    $ele.removeClass("error");
    $ele.removeClass("success");
  }

  /* BsFormAlerts plugin definition
   * ===================== */

  var old = $.fn.bsFormAlerts;

  $.fn.bsFormAlerts = function(option) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('bsFormAlerts'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('bsFormAlerts', (data = new BsFormAlerts(this, options)));
      }
      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.bsFormAlerts.Constructor = BsFormAlerts;

  $.fn.bsFormAlerts.defaults = {
    alertid: "bs-form-alert"
  };


  /* BsFormAlerts no conflict
   * =============== */

  $.fn.bsFormAlerts.noConflict = function () {
    $.fn.bsFormAlerts = old;
    return this;
  };


  /* BsFormAlerts data-api
   * ============ */

  $(document).ready(function () {
    $('[data-alertid]').each(function () {
      var $ele = $(this);
      $ele.bsFormAlerts($ele.data());
    });
  });

})(jQuery, window, document);
