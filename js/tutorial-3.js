(function() {
  // clipboard
  var clipInit = false;
  $("pre code:not(.no-copy)").each(function() {
    var code = $(this);

    if (code.text().split('\n').length > 20) {
      code.closest('pre').addClass('with-expand');
      code.closest('pre').append('<div class=expander>▾ Click to Expand ▾</div>')

      if (!clipInit) {
        var text;
        var clip = new ClipboardJS(".copy-btn", {
          text: function(trigger) {
            text = $(trigger).prev("code").text();
            return text.replace(/^\$\s/gm, "");
          }
        });

        clip.on("success", function(e) {
          e.clearSelection();
          $(e.trigger).text("Copied to clipboard!").addClass("copied");

          window.setTimeout(function() {
            $(e.trigger).text("Copy").removeClass("copied");
          }, 2000);
        });

        clip.on("error", function(e) {
          e.clearSelection();
          $(e.trigger).text("Error copying");

          window.setTimeout(function() {
            $(e.trigger).text("Copy");
          }, 2000);
        });

        clipInit = true;
      }

      code.after('<span class="copy-btn">Copy</span>');
    }
  });

  $('pre .expander').click(function(e) {
    e.preventDefault();
    $(this).closest('pre').addClass('expanded');
  })
})();
