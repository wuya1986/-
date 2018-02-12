module.exports = {
  apps: [{
    name: 'yida-admin',
    script: 'app.js',
    node_args: '--harmony',
    watch: true,
    ignore_watch: [
      'public',
      'views',
    ],
    exec_mode: 'fork',
    combine_logs: true,
    env: {
      PORT: 3001,
      NODE_ENV: 'dev',
    },
  }],
};
