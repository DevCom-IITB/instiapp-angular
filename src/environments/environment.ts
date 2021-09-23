// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  hmr: true,
  host: 'http://localhost:4200/',
  sso_host: 'https://gymkhana.iitb.ac.in/sso/oauth/authorize/',
  sso_client_id: 'vR1pU7wXWyve1rUkg0fMS6StL1Kr6paoSmRIiLXJ',
  service_worker_url: '/ngsw-worker.js',
  VAPID_PUBLIC_KEY: 'BIH7RBzSBVprQy4-6uaUQZOp5TmrzbpCYKA2COp02jRdS1ihX2qZ3sB0SJG4_pr6G2Q2GSCfGtK8kMax19b0mz0',
  VERSION: require('../../package.json').version,
};
