'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaBinding = require('aurelia-binding');

var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

var SanitizeHtmlValueConverter = (function () {
  function SanitizeHtmlValueConverter() {
    _classCallCheck(this, _SanitizeHtmlValueConverter);

    this.sanitizer = SanitizeHtmlValueConverter.defaultSanitizer;
  }

  var _SanitizeHtmlValueConverter = SanitizeHtmlValueConverter;

  _SanitizeHtmlValueConverter.defaultSanitizer = function defaultSanitizer(untrustedMarkup) {
    return untrustedMarkup.replace(SCRIPT_REGEX, '');
  };

  _SanitizeHtmlValueConverter.prototype.toView = function toView(untrustedMarkup) {
    if (untrustedMarkup === null) {
      return null;
    }

    return this.sanitizer(untrustedMarkup);
  };

  SanitizeHtmlValueConverter = (0, _aureliaBinding.valueConverter)('sanitizeHtml')(SanitizeHtmlValueConverter) || SanitizeHtmlValueConverter;
  return SanitizeHtmlValueConverter;
})();

exports.SanitizeHtmlValueConverter = SanitizeHtmlValueConverter;