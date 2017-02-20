/**
 * Created by john on 20/02/2017.
 */
(function () {

  'use strict';

  angular.module('ng-showdown').
    provider('$showdown', ngShowdown);

  /**
   * Angular Provider
   * Enables configuration of showdown via angular.config and Dependency Injection into controllers, views
   * directives, etc... This assures the directives and filters provided by the library itself stay consistent
   * with the user configurations.
   * If the user wants to use a different configuration in a determined context, he can use the "classic" Showdown
   * object instead.
   */
  function ngShowdown() {

    // Configuration parameters for Showdown
    var config = {
      extensions: [],
      sanitize: false
    };

    /**
     * Sets a configuration option
     *
     * @param {string} key Config parameter key
     * @param {string} value Config parameter value
     */
    /* jshint validthis: true */
    this.setOption = function (key, value) {
      config[key] = value;
      return this;
    };

    /**
     * Gets the value of the configuration parameter specified by key
     *
     * @param {string} key The config parameter key
     * @returns {string|null} Returns the value of the config parameter. (or null if the config parameter is not set)
     */
    this.getOption = function (key) {
      if (config.hasOwnProperty(key)) {
        return config[key];
      } else {
        return undefined;
      }
    };

    /**
     * Loads a Showdown Extension
     *
     * @param {string} extensionName The name of the extension to load
     */
    this.loadExtension = function (extensionName) {
      config.extensions.push(extensionName);

      return this;
    };

    function SDObject() {
      var converter = new showdown.Converter(config);

      /**
       * Converts a markdown text into HTML
       *
       * @param {string} markdown The markdown string to be converted to HTML
       * @returns {string} The converted HTML
       */
      this.makeHtml = function (markdown) {
        return converter.makeHtml(markdown);
      };

      /**
       * Strips a text of it's HTML tags. See http://stackoverflow.com/questions/17289448/angularjs-to-output-plain-text-instead-of-html
       *
       * @param {string} text
       * @returns {string}
       */
      this.stripHtml = function (text) {
        return String(text).replace(/<[^>]+>/gm, '');
      };

      /**
       * Gets the value of the configuration parameter of CONVERTER specified by key
       * @param {string} key The config parameter key
       * @returns {*}
       */
      this.getOption = function (key) {
        return converter.getOption(key);
      };

      /**
       * Gets the converter configuration params
       * @returns {*}
       */
      this.getOptions = function () {
        return converter.getOptions();
      };

      /**
       * Sets a configuration option
       *
       * @param {string} key Config parameter key
       * @param {string} value Config parameter value
       * @returns {SDObject}
       */
      this.setOption = function (key, value) {
        converter.setOption(key, value);
        return this;
      };

      /**
       * Get showdown's default options
       *
       * @param simple
       */
      this.getDefaultOptions = function(simple) {
        if (typeof showdown.getDefaultOptions !== 'undefined') {
          return showdown.getDefaultOptions(simple);
        } else {
          return null;
        }

      }
    }

    // The object returned by service provider
    this.$get = function () {
      return new SDObject();
    };
  }

})();