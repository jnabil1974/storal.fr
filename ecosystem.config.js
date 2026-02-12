module.exports = {
  apps: [{
    name: 'storal-fr',
    script: 'node_modules/.bin/next',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    exec_mode: 'fork'
  }]
}
