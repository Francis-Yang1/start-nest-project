import * as path from 'path';

export default {
  enabled: true,
  timestamp: true,
  useLevelLabels: true,
  prettyPrint: false,
  level: 'info',
  path: path.resolve(__dirname, '../app.log'),
};
