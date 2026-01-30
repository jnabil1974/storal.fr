module.exports = {
  apps: [
    {
      name: 'storal-fr',
      cwd: __dirname,
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_SUPABASE_URL: 'https://qctnvyxtbvnvllchuibu.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdG52eXh0YnZudmxsY2h1aWJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MTI3MzcsImV4cCI6MjA1MTM4ODczN30.5c4-bZUHW3-7vcdj_hVqkEFBiSxGkvAQLIXgzVd9L9k',
        SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdG52eXh0YnZudmxsY2h1aWJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTgxMjczNywiZXhwIjoyMDUxMzg4NzM3fQ.hMLhG5FIeMW6VuaSaZFiwpW6eQZ0BVjO9Nn4i82L9t4'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    }
  ]
};
