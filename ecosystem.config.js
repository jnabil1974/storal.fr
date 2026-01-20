module.exports = {
  apps: [
    {
      name: 'storal-next',
      cwd: __dirname,
      script: 'node_modules/.bin/next',
      args: 'start -p 3001',
      instances: 1,
      exec_mode: 'fork',
      env_file: '.env',
      env: {
        NODE_ENV: 'production',
      }
    }
  ]
};
