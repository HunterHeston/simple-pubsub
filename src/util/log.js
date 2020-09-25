////////////////////////////////////////////////////////////////////////////////
/// enumeration of log levels
////////////////////////////////////////////////////////////////////////////////
const LOG_LEVELS = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 5,
  FATAL: 6,
  DISABLED: 7,
};

////////////////////////////////////////////////////////////////////////////////
/// get the current time for logging
////////////////////////////////////////////////////////////////////////////////
function getTimeString() {
  const date = new Date();

  const current_date = date.getDate();
  const day = current_date <= 9 ? `0${current_date}` : current_date;

  const current_month = date.getMonth();
  const month = current_month <= 9 ? `0${current_month}` : current_month;

  const current_hour = date.getHours();
  const hour = current_hour <= 9 ? `0${current_hour}` : current_hour;

  const current_minute = date.getMinutes();
  const minute = current_minute <= 9 ? `0${current_minute}` : current_minute;

  const current_second = date.getSeconds();
  const seconds = current_second <= 9 ? `0${current_second}` : current_second;

  return `[${day}/${month}/${date.getFullYear()} ${hour}:${minute}:${seconds}:${date.getMilliseconds()}]`;
}

////////////////////////////////////////////////////////////////////////////////
/// TRACE level logging
////////////////////////////////////////////////////////////////////////////////
function LOG_TRACE(logMessage) {
  if (LOG_LEVELS.TRACE < process.env.log_level) {
    return;
  }

  console.debug(getTimeString(), logMessage);
}

////////////////////////////////////////////////////////////////////////////////
/// DEBUG level logging
////////////////////////////////////////////////////////////////////////////////
function LOG_DEBUG(logMessage) {
  if (LOG_LEVELS.DEBUG < process.env.log_level) {
    return;
  }

  console.debug(getTimeString(), logMessage);
}

////////////////////////////////////////////////////////////////////////////////
/// INFO level logging
////////////////////////////////////////////////////////////////////////////////
function LOG_INFO(logMessage) {
  if (LOG_LEVELS.INFO < process.env.log_level) {
    return;
  }

  console.info(getTimeString(), logMessage);
}

////////////////////////////////////////////////////////////////////////////////
/// WARN level logging
////////////////////////////////////////////////////////////////////////////////
function LOG_WARN(logMessage) {
  if (LOG_LEVELS.WARN < process.env.log_level) {
    return;
  }

  console.warn(getTimeString(), logMessage);
}

////////////////////////////////////////////////////////////////////////////////
/// ERROR level logging
////////////////////////////////////////////////////////////////////////////////
function LOG_ERROR(logMessage) {
  if (LOG_LEVELS.ERROR < process.env.log_level) {
    return;
  }

  console.error(getTimeString(), logMessage);
}

////////////////////////////////////////////////////////////////////////////////
/// FATAL level logging
////////////////////////////////////////////////////////////////////////////////
function LOG_FATAL(logMessage) {
  if (LOG_LEVELS.FATAL < process.env.log_level) {
    return;
  }

  console.error(getTimeString(), logMessage);
}

////////////////////////////////////////////////////////////////////////////////
/// exports
////////////////////////////////////////////////////////////////////////////////

module.exports.LOG_TRACE = LOG_TRACE;
module.exports.LOG_DEBUG = LOG_DEBUG;
module.exports.LOG_INFO = LOG_INFO;
module.exports.LOG_WARN = LOG_WARN;
module.exports.LOG_ERROR = LOG_ERROR;
module.exports.LOG_FATAL = LOG_FATAL;
