/*!
 * modernizr v3.5.0
 * Build https://modernizr.com/download?-addtest-dontmin
 *
 * Copyright (c)
 *  Faruk Ates
 *  Paul Irish
 *  Alex Sexton
 *  Ryan Seddon
 *  Patrick Kettner
 *  Stu Cox
 *  Richard Herrera

 * MIT License
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in the
 * current UA and makes the results available to you in two ways: as properties on
 * a global `Modernizr` object, and as classes on the `<html>` element. This
 * information allows you to progressively enhance your pages with a granular level
 * of control over the experience.
*/

;(function(window, document, undefined){
  var tests = [];
  

  /**
   *
   * ModernizrProto is the constructor for Modernizr
   *
   * @class
   * @access public
   */

  var ModernizrProto = {
    // The current version, dummy
    _version: '3.5.0',

    // Any settings that don't work as separate modules
    // can go in here as configuration.
    _config: {
      'classPrefix': '',
      'enableClasses': true,
      'enableJSClass': true,
      'usePrefixes': true
    },

    // Queue of tests
    _q: [],

    // Stub these for people who are listening
    on: function(test, cb) {
      // I don't really think people should do this, but we can
      // safe guard it a bit.
      // -- NOTE:: this gets WAY overridden in src/addTest for actual async tests.
      // This is in case people listen to synchronous tests. I would leave it out,
      // but the code to *disallow* sync tests in the real version of this
      // function is actually larger than this.
      var self = this;
      setTimeout(function() {
        cb(self[test]);
      }, 0);
    },

    addTest: function(name, fn, options) {
      tests.push({name: name, fn: fn, options: options});
    },

    addAsyncTest: function(fn) {
      tests.push({name: null, fn: fn});
    }
  };

  

  // Fake some of Object.create so we can force non test results to be non "own" properties.
  var Modernizr = function() {};
  Modernizr.prototype = ModernizrProto;

  // Leak modernizr globally when you `require` it rather than force it here.
  // Overwrite name so constructor name is nicer :D
  Modernizr = new Modernizr();

  

  var classes = [];
  

  /**
   * is returns a boolean if the typeof an obj is exactly type.
   *
   * @access private
   * @function is
   * @param {*} obj - A thing we want to check the type of
   * @param {string} type - A string to compare the typeof against
   * @returns {boolean}
   */

  function is(obj, type) {
    return typeof obj === type;
  }
  ;

  /**
   * Run through all tests and detect their support in the current UA.
   *
   * @access private
   */

  function testRunner() {
    var featureNames;
    var feature;
    var aliasIdx;
    var result;
    var nameIdx;
    var featureName;
    var featureNameSplit;

    for (var featureIdx in tests) {
      if (tests.hasOwnProperty(featureIdx)) {
        featureNames = [];
        feature = tests[featureIdx];
        // run the test, throw the return value into the Modernizr,
        // then based on that boolean, define an appropriate className
        // and push it into an array of classes we'll join later.
        //
        // If there is no name, it's an 'async' test that is run,
        // but not directly added to the object. That should
        // be done with a post-run addTest call.
        if (feature.name) {
          featureNames.push(feature.name.toLowerCase());

          if (feature.options && feature.options.aliases && feature.options.aliases.length) {
            // Add all the aliases into the names list
            for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
              featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
            }
          }
        }

        // Run the test, or use the raw value if it's not a function
        result = is(feature.fn, 'function') ? feature.fn() : feature.fn;


        // Set each of the names on the Modernizr object
        for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
          featureName = featureNames[nameIdx];
          // Support dot properties as sub tests. We don't do checking to make sure
          // that the implied parent tests have been added. You must call them in
          // order (either in the test, or make the parent test a dependency).
          //
          // Cap it to TWO to make the logic simple and because who needs that kind of subtesting
          // hashtag famous last words
          featureNameSplit = featureName.split('.');

          if (featureNameSplit.length === 1) {
            Modernizr[featureNameSplit[0]] = result;
          } else {
            // cast to a Boolean, if not one already
            if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
              Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
            }

            Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
          }

          classes.push((result ? '' : 'no-') + featureNameSplit.join('-'));
        }
      }
    }
  }
  ;

  /**
   * hasOwnProp is a shim for hasOwnProperty that is needed for Safari 2.0 support
   *
   * @author kangax
   * @access private
   * @function hasOwnProp
   * @param {object} object - The object to check for a property
   * @param {string} property - The property to check for
   * @returns {boolean}
   */

  // hasOwnProperty shim by kangax needed for Safari 2.0 support
  var hasOwnProp;

  (function() {
    var _hasOwnProperty = ({}).hasOwnProperty;
    /* istanbul ignore else */
    /* we have no way of testing IE 5.5 or safari 2,
     * so just assume the else gets hit */
    if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
      hasOwnProp = function(object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function(object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }
  })();

  

  /**
   * docElement is a convenience wrapper to grab the root element of the document
   *
   * @access private
   * @returns {HTMLElement|SVGElement} The root element of the document
   */

  var docElement = document.documentElement;
  

  /**
   * A convenience helper to check if the document we are running in is an SVG document
   *
   * @access private
   * @returns {boolean}
   */

  var isSVG = docElement.nodeName.toLowerCase() === 'svg';
  

  /**
   * setClasses takes an array of class names and adds them to the root element
   *
   * @access private
   * @function setClasses
   * @param {string[]} classes - Array of class names
   */

  // Pass in an and array of class names, e.g.:
  //  ['no-webp', 'borderradius', ...]
  function setClasses(classes) {
    var className = docElement.className;
    var classPrefix = Modernizr._config.classPrefix || '';

    if (isSVG) {
      className = className.baseVal;
    }

    // Change `no-js` to `js` (independently of the `enableClasses` option)
    // Handle classPrefix on this too
    if (Modernizr._config.enableJSClass) {
      var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
      className = className.replace(reJS, '$1' + classPrefix + 'js$2');
    }

    if (Modernizr._config.enableClasses) {
      // Add the new classes
      className += ' ' + classPrefix + classes.join(' ' + classPrefix);
      if (isSVG) {
        docElement.className.baseVal = className;
      } else {
        docElement.className = className;
      }
    }

  }

  ;


   // _l tracks listeners for async tests, as well as tests that execute after the initial run
  ModernizrProto._l = {};

  /**
   * Modernizr.on is a way to listen for the completion of async tests. Being
   * asynchronous, they may not finish before your scripts run. As a result you
   * will get a possibly false negative `undefined` value.
   *
   * @memberof Modernizr
   * @name Modernizr.on
   * @access public
   * @function on
   * @param {string} feature - String name of the feature detect
   * @param {function} cb - Callback function returning a Boolean - true if feature is supported, false if not
   * @example
   *
   * ```js
   * Modernizr.on('flash', function( result ) {
   *   if (result) {
   *    // the browser has flash
   *   } else {
   *     // the browser does not have flash
   *   }
   * });
   * ```
   */

  ModernizrProto.on = function(feature, cb) {
    // Create the list of listeners if it doesn't exist
    if (!this._l[feature]) {
      this._l[feature] = [];
    }

    // Push this test on to the listener list
    this._l[feature].push(cb);

    // If it's already been resolved, trigger it on next tick
    if (Modernizr.hasOwnProperty(feature)) {
      // Next Tick
      setTimeout(function() {
        Modernizr._trigger(feature, Modernizr[feature]);
      }, 0);
    }
  };

  /**
   * _trigger is the private function used to signal test completion and run any
   * callbacks registered through [Modernizr.on](#modernizr-on)
   *
   * @memberof Modernizr
   * @name Modernizr._trigger
   * @access private
   * @function _trigger
   * @param {string} feature - string name of the feature detect
   * @param {function|boolean} [res] - A feature detection function, or the boolean =
   * result of a feature detection function
   */

  ModernizrProto._trigger = function(feature, res) {
    if (!this._l[feature]) {
      return;
    }

    var cbs = this._l[feature];

    // Force async
    setTimeout(function() {
      var i, cb;
      for (i = 0; i < cbs.length; i++) {
        cb = cbs[i];
        cb(res);
      }
    }, 0);

    // Don't trigger these again
    delete this._l[feature];
  };

  /**
   * addTest allows you to define your own feature detects that are not currently
   * included in Modernizr (under the covers it's the exact same code Modernizr
   * uses for its own [feature detections](https://github.com/Modernizr/Modernizr/tree/master/feature-detects)). Just like the offical detects, the result
   * will be added onto the Modernizr object, as well as an appropriate className set on
   * the html element when configured to do so
   *
   * @memberof Modernizr
   * @name Modernizr.addTest
   * @optionName Modernizr.addTest()
   * @optionProp addTest
   * @access public
   * @function addTest
   * @param {string|object} feature - The string name of the feature detect, or an
   * object of feature detect names and test
   * @param {function|boolean} test - Function returning true if feature is supported,
   * false if not. Otherwise a boolean representing the results of a feature detection
   * @example
   *
   * The most common way of creating your own feature detects is by calling
   * `Modernizr.addTest` with a string (preferably just lowercase, without any
   * punctuation), and a function you want executed that will return a boolean result
   *
   * ```js
   * Modernizr.addTest('itsTuesday', function() {
   *  var d = new Date();
   *  return d.getDay() === 2;
   * });
   * ```
   *
   * When the above is run, it will set Modernizr.itstuesday to `true` when it is tuesday,
   * and to `false` every other day of the week. One thing to notice is that the names of
   * feature detect functions are always lowercased when added to the Modernizr object. That
   * means that `Modernizr.itsTuesday` will not exist, but `Modernizr.itstuesday` will.
   *
   *
   *  Since we only look at the returned value from any feature detection function,
   *  you do not need to actually use a function. For simple detections, just passing
   *  in a statement that will return a boolean value works just fine.
   *
   * ```js
   * Modernizr.addTest('hasJquery', 'jQuery' in window);
   * ```
   *
   * Just like before, when the above runs `Modernizr.hasjquery` will be true if
   * jQuery has been included on the page. Not using a function saves a small amount
   * of overhead for the browser, as well as making your code much more readable.
   *
   * Finally, you also have the ability to pass in an object of feature names and
   * their tests. This is handy if you want to add multiple detections in one go.
   * The keys should always be a string, and the value can be either a boolean or
   * function that returns a boolean.
   *
   * ```js
   * var detects = {
   *  'hasjquery': 'jQuery' in window,
   *  'itstuesday': function() {
   *    var d = new Date();
   *    return d.getDay() === 2;
   *  }
   * }
   *
   * Modernizr.addTest(detects);
   * ```
   *
   * There is really no difference between the first methods and this one, it is
   * just a convenience to let you write more readable code.
   */

  function addTest(feature, test) {

    if (typeof feature == 'object') {
      for (var key in feature) {
        if (hasOwnProp(feature, key)) {
          addTest(key, feature[ key ]);
        }
      }
    } else {

      feature = feature.toLowerCase();
      var featureNameSplit = feature.split('.');
      var last = Modernizr[featureNameSplit[0]];

      // Again, we don't check for parent test existence. Get that right, though.
      if (featureNameSplit.length == 2) {
        last = last[featureNameSplit[1]];
      }

      if (typeof last != 'undefined') {
        // we're going to quit if you're trying to overwrite an existing test
        // if we were to allow it, we'd do this:
        //   var re = new RegExp("\\b(no-)?" + feature + "\\b");
        //   docElement.className = docElement.className.replace( re, '' );
        // but, no rly, stuff 'em.
        return Modernizr;
      }

      test = typeof test == 'function' ? test() : test;

      // Set the value (this is the magic, right here).
      if (featureNameSplit.length == 1) {
        Modernizr[featureNameSplit[0]] = test;
      } else {
        // cast to a Boolean, if not one already
        if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
          Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
        }

        Modernizr[featureNameSplit[0]][featureNameSplit[1]] = test;
      }

      // Set a single class (either `feature` or `no-feature`)
      setClasses([(!!test && test != false ? '' : 'no-') + featureNameSplit.join('-')]);

      // Trigger the event
      Modernizr._trigger(feature, test);
    }

    return Modernizr; // allow chaining.
  }

  // After all the tests are run, add self to the Modernizr prototype
  Modernizr._q.push(function() {
    ModernizrProto.addTest = addTest;
  });

  


  // Run each test
  testRunner();

  delete ModernizrProto.addTest;
  delete ModernizrProto.addAsyncTest;

  // Run the things that are supposed to run after the tests
  for (var i = 0; i < Modernizr._q.length; i++) {
    Modernizr._q[i]();
  }

  // Leak Modernizr namespace
  window.Modernizr = Modernizr;


;

})(window, document);





/*!
 * Detectizr v2.2.0
 * http://barisaydinoglu.github.com/Detectizr/
 *
 * Written by Baris Aydinoglu (http://baris.aydinoglu.info) - Copyright 2012
 * Released under the MIT license
 *
 * Date: 2016-11-10T12:08Z
 */
window.Detectizr = (function(window, navigator, document, undefined) {
  var Detectizr = {},
    Modernizr = window.Modernizr,
    deviceTypes = ["tv", "tablet", "mobile", "desktop"],
    options = {
      // option for enabling HTML classes of all features (not only the true features) to be added
      addAllFeaturesAsClass: false,
      // option for enabling detection of device
      detectDevice: true,
      // option for enabling detection of device model
      detectDeviceModel: true,
      // option for enabling detection of screen size
      detectScreen: true,
      // option for enabling detection of operating system type and version
      detectOS: true,
      // option for enabling detection of browser type and version
      detectBrowser: true,
      // option for enabling detection of common browser plugins
      detectPlugins: true
    },
    plugins2detect = [{
      name: "adobereader",
      substrs: ["Adobe", "Acrobat"],
      // AcroPDF.PDF is used by version 7 and later
      // PDF.PdfCtrl is used by version 6 and earlier
      progIds: ["AcroPDF.PDF", "PDF.PDFCtrl.5"]
    }, {
      name: "flash",
      substrs: ["Shockwave Flash"],
      progIds: ["ShockwaveFlash.ShockwaveFlash.1"]
    }, {
      name: "wmplayer",
      substrs: ["Windows Media"],
      progIds: ["wmplayer.ocx"]
    }, {
      name: "silverlight",
      substrs: ["Silverlight"],
      progIds: ["AgControl.AgControl"]
    }, {
      name: "quicktime",
      substrs: ["QuickTime"],
      progIds: ["QuickTime.QuickTime"]
    }],
    rclass = /[\t\r\n]/g,
    docElement = document.documentElement,
    resizeTimeoutId,
    oldOrientation;

  // Create Global "extend" method, so Detectizr does not need jQuery.extend
  function extend(obj, extObj) {
    var a, b, i;
    if (arguments.length > 2) {
      for (a = 1, b = arguments.length; a < b; a += 1) {
        extend(obj, arguments[a]);
      }
    } else {
      for (i in extObj) {
        if (extObj.hasOwnProperty(i)) {
          obj[i] = extObj[i];
        }
      }
    }
    return obj;
  }

  // simplified and localized indexOf method as one parameter fixed as useragent
  function is(key) {
    return Detectizr.browser.userAgent.indexOf(key) > -1;
  }

  // simplified and localized regex test method as one parameter fixed as useragent
  function test(regex) {
    return regex.test(Detectizr.browser.userAgent);
  }

  // simplified and localized regex exec method as one parameter fixed as useragent
  function exec(regex) {
    return regex.exec(Detectizr.browser.userAgent);
  }

  // localized string trim method
  function trim(value) {
    return value.replace(/^\s+|\s+$/g, "");
  }

  // convert string to camelcase
  function toCamel(string) {
    if (string === null || string === undefined) {
      return "";
    }
    return String(string).replace(/((\s|\-|\.)+[a-z0-9])/g, function($1) {
      return $1.toUpperCase().replace(/(\s|\-|\.)/g, "");
    });
  }

  // removeClass function inspired from jQuery.removeClass
  function removeClass(element, value) {
    var class2remove = value || "",
      cur = element.nodeType === 1 && (element.className ? (" " + element.className + " ").replace(rclass, " ") : "");
    if (cur) {
      while (cur.indexOf(" " + class2remove + " ") >= 0) {
        cur = cur.replace(" " + class2remove + " ", " ");
      }
      element.className = value ? trim(cur) : "";
    }
  }

  // add version test to Modernizr
  function addVersionTest(version, major, minor) {
    if (!!version) {
      version = toCamel(version);
      if (!!major) {
        major = toCamel(major);
        addConditionalTest(version + major, true);
        if (!!minor) {
          addConditionalTest(version + major + "_" + minor, true);
        }
      }
    }
  }

  // add test to Modernizr based on a condition
  function addConditionalTest(feature, test) {
    if (!!feature && !!Modernizr) {
      if (options.addAllFeaturesAsClass) {
        Modernizr.addTest(feature, test);
      } else {
        test = typeof test === "function" ? test() : test;
        if (test) {
          Modernizr.addTest(feature, true);
        } else {
          delete Modernizr[feature];
          removeClass(docElement, feature);
        }
      }
    }
  }

  // set version based on versionFull
  function setVersion(versionType, versionFull) {
    versionType.version = versionFull;
    var versionArray = versionFull.split(".");
    if (versionArray.length > 0) {
      versionArray = versionArray.reverse();
      versionType.major = versionArray.pop();
      if (versionArray.length > 0) {
        versionType.minor = versionArray.pop();
        if (versionArray.length > 0) {
          versionArray = versionArray.reverse();
          versionType.patch = versionArray.join(".");
        } else {
          versionType.patch = "0";
        }
      } else {
        versionType.minor = "0";
      }
    } else {
      versionType.major = "0";
    }
  }

  function checkOrientation() {
    //timeout wrapper points with doResizeCode as callback
    window.clearTimeout(resizeTimeoutId);
    resizeTimeoutId = window.setTimeout(function() {
      oldOrientation = Detectizr.device.orientation;
      //wrapper for height/width check
      if (window.innerHeight > window.innerWidth) {
        Detectizr.device.orientation = "portrait";
      } else {
        Detectizr.device.orientation = "landscape";
      }
      addConditionalTest(Detectizr.device.orientation, true);
      if (oldOrientation !== Detectizr.device.orientation) {
        addConditionalTest(oldOrientation, false);
      }
    }, 10);
  }

  function detectPlugin(substrs) {
    var plugins = navigator.plugins,
      plugin, haystack, pluginFoundText, j, k;
    for (j = plugins.length - 1; j >= 0; j--) {
      plugin = plugins[j];
      haystack = plugin.name + plugin.description;
      pluginFoundText = 0;
      for (k = substrs.length; k >= 0; k--) {
        if (haystack.indexOf(substrs[k]) !== -1) {
          pluginFoundText += 1;
        }
      }
      if (pluginFoundText === substrs.length) {
        return true;
      }
    }
    return false;
  }

  function detectObject(progIds) {
    var j;
    for (j = progIds.length - 1; j >= 0; j--) {
      try {
        new ActiveXObject(progIds[j]);
      } catch (e) {
        // Ignore
      }
    }
    return false;
  }

  function detect(opt) {
    var i, j, device, os, browser, plugin2detect, pluginFound;

    options = extend({}, options, opt || {});

    /** Device detection **/
    if (options.detectDevice) {
      Detectizr.device = {
        type: "",
        model: "",
        orientation: ""
      };
      device = Detectizr.device;
      if (test(/googletv|smarttv|smart-tv|internet.tv|netcast|nettv|appletv|boxee|kylo|roku|dlnadoc|roku|pov_tv|hbbtv|ce\-html/)) {
        // Check if user agent is a smart tv
        device.type = deviceTypes[0];
        device.model = "smartTv";
      } else if (test(/xbox|playstation.3|wii/)) {
        // Check if user agent is a game console
        device.type = deviceTypes[0];
        device.model = "gameConsole";
      } else if (test(/ip(a|ro)d/)) {
        // Check if user agent is a iPad
        device.type = deviceTypes[1];
        device.model = "ipad";
      } else if ((test(/tablet/) && !test(/rx-34/) && !test(/shield/)) || test(/folio/)) {
        // Check if user agent is a Tablet
        device.type = deviceTypes[1];
        device.model = String(exec(/playbook/) || "");
      } else if (test(/linux/) && test(/android/) && !test(/fennec|mobi|htc.magic|htcX06ht|nexus.one|sc-02b|fone.945/)) {
        // Check if user agent is an Android Tablet
        device.type = deviceTypes[1];
        device.model = "android";
      } else if (test(/kindle/) || (test(/mac.os/) && test(/silk/))) {
        // Check if user agent is a Kindle or Kindle Fire
        device.type = deviceTypes[1];
        device.model = "kindle";
      } else if (test(/gt-p10|sc-01c|shw-m180s|sgh-t849|sch-i800|shw-m180l|sph-p100|sgh-i987|zt180|htc(.flyer|\_flyer)|sprint.atp51|viewpad7|pandigital(sprnova|nova)|ideos.s7|dell.streak.7|advent.vega|a101it|a70bht|mid7015|next2|nook/) || (test(/mb511/) && test(/rutem/))) {
        // Check if user agent is a pre Android 3.0 Tablet
        device.type = deviceTypes[1];
        device.model = "android";
      } else if (test(/bb10/)) {
        // Check if user agent is a BB10 device
        device.type = deviceTypes[2];
        device.model = "blackberry";
      } else {
        // Check if user agent is one of common mobile types
        device.model = exec(/iphone|ipod|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec|j2me/);
        if (device.model !== null) {
          device.type = deviceTypes[2];
          device.model = String(device.model);
        } else {
          device.model = "";
          if (test(/bolt|fennec|iris|maemo|minimo|mobi|mowser|netfront|novarra|prism|rx-34|skyfire|tear|xv6875|xv6975|google.wireless.transcoder/)) {
            // Check if user agent is unique Mobile User Agent
            device.type = deviceTypes[2];
          } else if (test(/opera/) && test(/windows.nt.5/) && test(/htc|xda|mini|vario|samsung\-gt\-i8000|samsung\-sgh\-i9/)) {
            // Check if user agent is an odd Opera User Agent - http://goo.gl/nK90K
            device.type = deviceTypes[2];
          } else if ((test(/windows.(nt|xp|me|9)/) && !test(/phone/)) || test(/win(9|.9|nt)/) || test(/\(windows 8\)/)) {
            // Check if user agent is Windows Desktop, "(Windows 8)" Chrome extra exception
            device.type = deviceTypes[3];
          } else if (test(/macintosh|powerpc/) && !test(/silk/)) {
            // Check if agent is Mac Desktop
            device.type = deviceTypes[3];
            device.model = "mac";
          } else if (test(/linux/) && test(/x11/)) {
            // Check if user agent is a Linux Desktop
            device.type = deviceTypes[3];
          } else if (test(/solaris|sunos|bsd/)) {
            // Check if user agent is a Solaris, SunOS, BSD Desktop
            device.type = deviceTypes[3];
          } else if (test(/cros/)) {
            // Check if user agent is a Chromebook
            device.type = deviceTypes[3];
          } else if (test(/bot|crawler|spider|yahoo|ia_archiver|covario-ids|findlinks|dataparksearch|larbin|mediapartners-google|ng-search|snappy|teoma|jeeves|tineye/) && !test(/mobile/)) {
            // Check if user agent is a Desktop BOT/Crawler/Spider
            device.type = deviceTypes[3];
            device.model = "crawler";
          } else {
            // Otherwise assume it is a Mobile Device
            device.type = deviceTypes[2];
          }
        }
      }
      for (i = 0, j = deviceTypes.length; i < j; i += 1) {
        addConditionalTest(deviceTypes[i], (device.type === deviceTypes[i]));
      }
      if (options.detectDeviceModel) {
        addConditionalTest(toCamel(device.model), true);
      }
    }

    /** Screen detection **/
    if (options.detectScreen) {
      device.screen = {};
      if (!!Modernizr && !!Modernizr.mq) {
        if (Modernizr.mq("only screen and (max-width: 240px)")) {
          device.screen.size = "veryVerySmall";
          addConditionalTest("veryVerySmallScreen", true);
        } else if (Modernizr.mq("only screen and (max-width: 320px)")) {
          device.screen.size = "verySmall";
          addConditionalTest("verySmallScreen", true);
        } else if (Modernizr.mq("only screen and (max-width: 480px)")) {
          device.screen.size = "small";
          addConditionalTest("smallScreen", true);
        }
        if (device.type === deviceTypes[1] || device.type === deviceTypes[2]) {
          if (Modernizr.mq("only screen and (-moz-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)")) {
            device.screen.resolution = "high";
            addConditionalTest("highresolution", true);
          }
        }
      }
      if (device.type === deviceTypes[1] || device.type === deviceTypes[2]) {
        window.onresize = function(event) {
          checkOrientation(event);
        };
        checkOrientation();
      } else {
        device.orientation = "landscape";
        addConditionalTest(device.orientation, true);
      }
    }

    /** OS detection **/
    if (options.detectOS) {
      Detectizr.os = {};
      os = Detectizr.os;
      if (device.model !== "") {
        if (device.model === "ipad" || device.model === "iphone" || device.model === "ipod") {
          os.name = "ios";
          setVersion(os, (test(/os\s([\d_]+)/) ? RegExp.$1 : "").replace(/_/g, "."));
        } else if (device.model === "android") {
          os.name = "android";
          setVersion(os, (test(/android\s([\d\.]+)/) ? RegExp.$1 : ""));
        } else if (device.model === "blackberry") {
          os.name = "blackberry";
          setVersion(os, (test(/version\/([^\s]+)/) ? RegExp.$1 : ""));
        } else if (device.model === "playbook") {
          os.name = "blackberry";
          setVersion(os, (test(/os ([^\s]+)/) ? RegExp.$1.replace(";", "") : ""));
        }
      }
      if (!os.name) {
        if (is("win") || is("16bit")) {
          os.name = "windows";
          if (is("windows nt 10")) {
            setVersion(os, "10");
          } else if (is("windows nt 6.3")) {
            setVersion(os, "8.1");
          } else if (is("windows nt 6.2") || test(/\(windows 8\)/)) { //windows 8 chrome mac fix
            setVersion(os, "8");
          } else if (is("windows nt 6.1")) {
            setVersion(os, "7");
          } else if (is("windows nt 6.0")) {
            setVersion(os, "vista");
          } else if (is("windows nt 5.2") || is("windows nt 5.1") || is("windows xp")) {
            setVersion(os, "xp");
          } else if (is("windows nt 5.0") || is("windows 2000")) {
            setVersion(os, "2k");
          } else if (is("winnt") || is("windows nt")) {
            setVersion(os, "nt");
          } else if (is("win98") || is("windows 98")) {
            setVersion(os, "98");
          } else if (is("win95") || is("windows 95")) {
            setVersion(os, "95");
          }
        } else if (is("mac") || is("darwin")) {
          os.name = "mac os";
          if (is("68k") || is("68000")) {
            setVersion(os, "68k");
          } else if (is("ppc") || is("powerpc")) {
            setVersion(os, "ppc");
          } else if (is("os x")) {
            setVersion(os, (test(/os\sx\s([\d_]+)/) ? RegExp.$1 : "os x").replace(/_/g, "."));
          }
        } else if (is("webtv")) {
          os.name = "webtv";
        } else if (is("x11") || is("inux")) {
          os.name = "linux";
        } else if (is("sunos")) {
          os.name = "sun";
        } else if (is("irix")) {
          os.name = "irix";
        } else if (is("freebsd")) {
          os.name = "freebsd";
        } else if (is("bsd")) {
          os.name = "bsd";
        }
      }
      if (!!os.name) {
        addConditionalTest(os.name, true);
        if (!!os.major) {
          addVersionTest(os.name, os.major);
          if (!!os.minor) {
            addVersionTest(os.name, os.major, os.minor);
          }
        }
      }
      if (test(/\sx64|\sx86|\swin64|\swow64|\samd64/)) {
        os.addressRegisterSize = "64bit";
      } else {
        os.addressRegisterSize = "32bit";
      }
      addConditionalTest(os.addressRegisterSize, true);
    }

    /** Browser detection **/
    if (options.detectBrowser) {
      browser = Detectizr.browser;
      if (!test(/opera|webtv/) && (test(/msie\s([\d\w\.]+)/) || is("trident"))) {
        browser.engine = "trident";
        browser.name = "ie";
        if (!window.addEventListener && document.documentMode && document.documentMode === 7) {
          setVersion(browser, "8.compat");
        } else if (test(/trident.*rv[ :](\d+)\./)) {
          setVersion(browser, RegExp.$1);
        } else {
          setVersion(browser, (test(/trident\/4\.0/) ? "8" : RegExp.$1));
        }
      } else if (is("firefox")) {
        browser.engine = "gecko";
        browser.name = "firefox";
        setVersion(browser, (test(/firefox\/([\d\w\.]+)/) ? RegExp.$1 : ""));
      } else if (is("gecko/")) {
        browser.engine = "gecko";
      } else if (is("opera")) {
        browser.name = "opera";
        browser.engine = "presto";
        setVersion(browser, (test(/version\/([\d\.]+)/) ? RegExp.$1 : (test(/opera(\s|\/)([\d\.]+)/) ? RegExp.$2 : "")));
      } else if (is("konqueror")) {
        browser.name = "konqueror";
      } else if (is("edge")) {
        browser.engine = "webkit";
        browser.name = "edge";
        setVersion(browser, (test(/edge\/([\d\.]+)/) ? RegExp.$1 : ""));
      } else if (is("chrome")) {
        browser.engine = "webkit";
        browser.name = "chrome";
        setVersion(browser, (test(/chrome\/([\d\.]+)/) ? RegExp.$1 : ""));
      } else if (is("iron")) {
        browser.engine = "webkit";
        browser.name = "iron";
      } else if (is("crios")) {
        browser.name = "chrome";
        browser.engine = "webkit";
        setVersion(browser, (test(/crios\/([\d\.]+)/) ? RegExp.$1 : ""));
      } else if (is("fxios")) {
        browser.name = "firefox";
        browser.engine = "webkit";
        setVersion(browser, (test(/fxios\/([\d\.]+)/) ? RegExp.$1 : ""));
      } else if (is("applewebkit/")) {
        browser.name = "safari";
        browser.engine = "webkit";
        setVersion(browser, (test(/version\/([\d\.]+)/) ? RegExp.$1 : ""));
      } else if (is("mozilla/")) {
        browser.engine = "gecko";
      }
      if (!!browser.name) {
        addConditionalTest(browser.name, true);
        if (!!browser.major) {
          addVersionTest(browser.name, browser.major);
          if (!!browser.minor) {
            addVersionTest(browser.name, browser.major, browser.minor);
          }
        }
      }
      addConditionalTest(browser.engine, true);

      // Browser Language
      browser.language = navigator.userLanguage || navigator.language;
      addConditionalTest(browser.language, true);
    }

    /** Plugin detection **/
    if (options.detectPlugins) {
      browser.plugins = [];
      for (i = plugins2detect.length - 1; i >= 0; i--) {
        plugin2detect = plugins2detect[i];
        pluginFound = false;
        if (window.ActiveXObject) {
          pluginFound = detectObject(plugin2detect.progIds);
        } else if (navigator.plugins) {
          pluginFound = detectPlugin(plugin2detect.substrs);
        }
        if (pluginFound) {
          browser.plugins.push(plugin2detect.name);
          addConditionalTest(plugin2detect.name, true);
        }
      }
      if (typeof navigator.javaEnabled === "function" && navigator.javaEnabled()) {
        browser.plugins.push("java");
        addConditionalTest("java", true);
      }
    }
  }
  Detectizr.detect = function(settings) {
    return detect(settings);
  };
  Detectizr.init = function() {
    if (Detectizr !== undefined) {
      Detectizr.browser = {
        userAgent: (navigator.userAgent || navigator.vendor || window.opera || "").toLowerCase()
      };
      Detectizr.detect();
    }
  };
  Detectizr.init();

  return Detectizr;
}(this, this.navigator, this.document));
