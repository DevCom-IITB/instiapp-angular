export const environment = {
  production: true,
  hmr: false,
  apiUrl: 'https://gymkhana.iitb.ac.in/instiapp/',
  host: 'https://www.insti.app/',
  sso_host: 'https://gymkhana.iitb.ac.in/sso/oauth/authorize/',
  sso_client_id: 'vR1pU7wXWyve1rUkg0fMS6StL1Kr6paoSmRIiLXJ',
  service_worker_url: '/ngsw-worker.js',
  VAPID_PUBLIC_KEY:
    'BIH7RBzSBVprQy4-6uaUQZOp5TmrzbpCYKA2COp02jRdS1ihX2qZ3sB0SJG4_pr6G2Q2GSCfGtK8kMax19b0mz0',
  VERSION: require('../../package.json').version,
};