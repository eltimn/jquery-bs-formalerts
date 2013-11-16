/**
  * A jQuery plugin for displaying Bootstrap form alerts via jQuery events.
  */
;(function($, window, document, undefined) {
  "use strict";

  /* BsFormAlerts class definition
   * ========================== */
  var BsFormAlerts = function(element, options) {
    var self = this;

    self.element = element;
    self.options = $.extend({}, $.fn.bsFormAlerts.defaults, options);

    $(document).on("set-alert-id-"+self.options.alertid, function() {
      /**
        * Event data is passed in as multiple params, we
        * want them all as an array starting at the second one.
        * The first param is the event.
        */
      var msgs = Array.prototype.slice.call(arguments, 1);
      self.renderAlerts(msgs);
    });

    $(document).on("clear-alert-id."+self.options.alertid, function() {
      self.clear();
    });

    self.clear = function() {
      var $this = $(this.element);
      var $formGroup = formGroup($this);
      clearFormGroup($formGroup, self.options);
      $this.html("");
    };

    self.renderAlerts = function(msgs) {
      var $this = $(this.element);

      if (msgs.length > 0) {
        var $formGroup = formGroup($this);
        var priority = highestPriority(msgs);

        // clear element
        clearFormGroup($formGroup, self.options);
        $this.html("");

        var $ul = $("<ul/>");

        $.each(msgs, function(ix, it) {
          if (it.message && it.message.length > 0) {
            var p = bsPriority(it.priority);
            if (p === "danger") {
              p = self.options.error_css;
            }
            var $li = $("<li/>", {
              'class': 'text-'+p
            }).html(it.message);
            $ul.append($li);
          }
        });

        $this.append($ul);
        var p = bsPriority(priority);
        if (p === "danger") { p = "error"; }
        $formGroup.addClass(self.options.css_prefix+p);
      }
    };

    // "private" functions
    function bsPriority(it) {
      if (it === "notice") {
        return "info";
      }
      else if (it === "error") {
        return "danger";
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

    function formGroup($ele) {
      return $ele.closest(self.options.outer_query);
    }

    function clearFormGroup($ele) {
      $ele.removeClass(self.options.css_prefix+"info");
      $ele.removeClass(self.options.css_prefix+"warning");
      $ele.removeClass(self.options.css_prefix+"error");
      $ele.removeClass(self.options.css_prefix+"success");
    }
  };

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
    alertid: "bs-form-alert",
    outer_query: "div.form-group",
    css_prefix: "has-",
    error_css: "danger"
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
