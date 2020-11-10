import * as path from 'path';

export default {
  enabled: true,
  timestamp: true,
  useLevelLabels: true,
  prettyPrint: true,
  level: 'info',
  path: path.resolve(__dirname, '../app.log'),
};
