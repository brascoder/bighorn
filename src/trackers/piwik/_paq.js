var util = require("../../util");
var kvn = require("../../kvn");
var logger = require("../../logger");

var formatEventData = function (eventData) {
  eventData = JSON.parse(JSON.stringify(eventData));
  delete eventData.validation_errors;
  return {
    category: kvn({ target: eventData.target }),
    action: kvn(eventData),
    label: kvn({ name: eventData.name }),
    value: eventData.value
  };
};

// http://piwik.org/docs/event-tracking/
module.exports = function (eventData) {
  var name     = "_paq";
  var logLabel = "Bighorn.track piwik _paq";
  var tracker  = self[name];

  try {
    var data = formatEventData(eventData);

    if (!util.isObject(tracker)) {
      logger.log("SKIP", logLabel, "tracker not found", eventData);
      return false;
    }
    if (!util.isFunction(tracker.push)) {
      logger.log("SKIP", logLabel, "push method not found", eventData);
      return false;
    }
    if (!util.isValidString(data.category)) {
      logger.log("SKIP", logLabel, "category not valid", eventData);
      return false;
    }
    if (!util.isValidString(data.action)) {
      logger.log("SKIP", logLabel, "action not valid", eventData);
      return false;
    }

    tracker.push(["trackEvent", data.category, data.action, data.label, data.value]);
    logger.log("SUCCESS", logLabel, eventData);
    return true;
  } catch (e) {
    logger.log("ERROR", logLabel, e.message, eventData);
    return false;
  }
};
