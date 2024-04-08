const winston = require('winston');

const getFormat = label =>
  winston.format.combine(
    winston.format.colorize({all: true}),
    winston.format.label({label}),
    winston.format.timestamp({ format: 'DD-MM HH:mm:ss'}),
    winston.format.metadata({fillExcept: ['timestamp', 'level', 'message', 'label']}),
    winston.format.printf(({timestamp, level, message, metadata, label}) => {
      if (metadata && Object.keys(metadata).length > 0) {
        const formattedMetadata = Object.entries(metadata)
          .map(([key, value]) => `\n ${key}: '${value}'`)
          .join(', ');
        return `[${timestamp}] [${level}] [${label}] ${message} \n{${formattedMetadata}\n}`;
      }
      return `[${timestamp}] [${level}] [${label}] ${message}`;
    })
  );

const container = new winston.Container({
  level: process.env.LOG_LEVEL || 'info',
  transports: [new winston.transports.Console()],
});

function makeLogger(componentName) {
  container.add(componentName, {
    format: getFormat(componentName),
  });
  return container.get(componentName);
}

exports.makeLogger = makeLogger
exports.MainLogger = makeLogger('Main');
