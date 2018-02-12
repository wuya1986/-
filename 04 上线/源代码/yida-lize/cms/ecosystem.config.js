module.exports = {
  apps: [{
    name: 'yida-cms',
    script: 'bin/www',
    node_args: '--harmony',
    watch: true,
    ignore_watch: [
      'public',
    ],
    exec_mode: 'fork',
    combine_logs: true,
    env: {
      PORT: 3001,
      NODE_ENV: 'dev',
    },
  }],
};
