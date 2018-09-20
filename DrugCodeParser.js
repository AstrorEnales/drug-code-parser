(function() {
  'use strict';
  var root = this;

  function ParseException(message) {
    this.message = message;
    this.name = 'ParseException';
  }

  var DrugCodeParser = function() {
  }

  DrugCodeParser.validatePPN = function(ppn) {
    if (typeof ppn === 'undefined' || ppn.length !== 12) {
      return false;
    }
    var ppnSum = 0;
    for (var j = 0; j < ppn.length - 2; j++) {
      ppnSum += (j + 2) * ppn[j].charCodeAt(0);
    }
    return (ppnSum % 97) === parseInt(ppn.substring(ppn.length - 2));
  }

  DrugCodeParser.validatePZN = function(pzn) {
    if (typeof pzn === 'undefined' || (pzn.length !== 7 && pzn.length !== 8)) {
      return false;
    }
    const weightPadding = pzn.length === 7 ? 2 : 1;
    var pznSum = 0;
    for (var j = 0; j < pzn.length - 1; j++) {
      pznSum += (j + weightPadding) * parseInt(pzn[j]);
    }
    return (pznSum % 11) === parseInt(pzn.substring(pzn.length - 1));
  }

  DrugCodeParser.parseIFAPPN = function(text) {
    if (typeof text === 'undefined' || text.length < 8) {
      throw new ParseException('The text is not a valid IFA PPN code (text is too short).');
    }
    if (!text.startsWith('[)>') || text.charCodeAt(3) !== 30) {
      throw new ParseException('The text is not a valid IFA PPN code (prefix mismatch).');
    }
    const endIndex = text.indexOf(String.fromCharCode(30) + String.fromCharCode(4));
    const data = text.substring(4, endIndex);
    const parts = data.split(String.fromCharCode(29));
    if (parts[0] != '06') {
      throw new ParseException('The text is not a valid IFA PPN code.');
    }
    var result = {};
    for (var i = 1; i < parts.length; i++) {
      const part = parts[i];
      if (part.startsWith('9N')) {
        // Product number
        const ppn = part.substring(2);
        const pzn = ppn.substring(2, ppn.length - 2);
        result.ppn = { value: ppn, valid: DrugCodeParser.validatePPN(ppn) };
        result.pzn = { value: pzn, valid: DrugCodeParser.validatePZN(pzn) };
      } else if (part.startsWith('1T')) {
        // Batch
        result.batch = part.substring(2);
      } else if (part.startsWith('D')) {
        // Expiration date
        result.expiration_date = '20' + part.substring(1, 3) + '-' + part.substring(3, 5);
        if (part.substring(5, 7) !== '00') {
          result.expiration_date += '-' + part.substring(5, 7);
        }
      } else if (part.startsWith('16D')) {
        // Production date
        result.production_date = part.substring(3, 7) + '-' + part.substring(7, 9);
        if (part.substring(9, 11) !== '00') {
          result.production_date += '-' + part.substring(9, 11);
        }
      } else if (part.startsWith('S')) {
        // Serial number
        result.serial = part.substring(1);
      } else if (part.startsWith('8P')) {
        // GTIN/NTIN
        result.gtin_ntin = part.substring(2);
      }
    }
    return result;
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = DrugCodeParser;
    }
    exports.DrugCodeParser = DrugCodeParser;
  }
  else {
    root.DrugCodeParser = DrugCodeParser;
  }
}).call(this);
