module.exports = {
  apps: [
    {
      name: 'storal-next',
      cwd: __dirname,
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://storal.fr',
        NEXT_PUBLIC_SUPABASE_URL: 'REPLACE_WITH_SUPABASE_URL',
        SUPABASE_SERVICE_ROLE_KEY: 'REPLACE_WITH_SERVICE_ROLE_KEY',
        STRIPE_PUBLIC_KEY: 'REPLACE_WITH_STRIPE_PUBLIC_KEY',
        STRIPE_SECRET_KEY: 'REPLACE_WITH_STRIPE_SECRET_KEY'
      }
    }
  ]
};
