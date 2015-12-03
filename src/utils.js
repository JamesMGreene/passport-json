exports.lookup = function(obj, field) {
  if (obj && typeof obj === 'object' && field && typeof field === 'string') {
    var chain = field.replace(/\]/g, '').split(/[\[.]/);
    for (var i = 0, len = chain.length; i < len; i++) {
      var prop = obj[chain[i]];
      if (typeof prop === 'undefined') {
        return null;
      }
      if (typeof prop !== 'object') {
        return prop;
      }
      obj = prop;
    }
  }
  return null;
};
