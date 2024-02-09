export const environment = {
  production: true,
  hmr: false,
  // apiUrl: 'http://10.198.49.150/',
  // host: 'http://10.198.49.150/',
  apiUrl: 'http://localhost:8000/',
  host: 'http://localhost:4200/',
  sso_host: 'https://gymkhana.iitb.ac.in/sso/oauth/authorize/',
  sso_client_id: '0vptOdXpmB8MIGhV6ZeADQxNQ7xuaa3ntITZwqPX',
  service_worker_url: '/ngsw-worker.js',
  VAPID_PUBLIC_KEY:
    'BIH7RBzSBVprQy4-6uaUQZOp5TmrzbpCYKA2COp02jRdS1ihX2qZ3sB0SJG4_pr6G2Q2GSCfGtK8kMax19b0mz0',
  VERSION: require('../../package.json').version,
};
