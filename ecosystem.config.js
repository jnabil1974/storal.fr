module.exports = {
  apps: [
    {
      name: 'storal-next',
      cwd: __dirname,
      script: 'node_modules/.bin/next',
      args: 'start -p 3001',
      instances: 1,
      exec_mode: 'fork',
      // Use production env file to avoid accidental overrides
      env_file: '.env.production',
      env: {
        NODE_ENV: 'production',
      }
    }
  ]
};
