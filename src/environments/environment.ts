// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  branchsbased: true,
  // apiUrl: "https://qa-tms.qatarcentral.cloudapp.azure.com/api",
  // publicUrl: "https://qa-tms.qatarcentral.cloudapp.azure.com/api",
  apiUrl: "http://qa-tms.qatarcentral.cloudapp.azure.com:4455/api",
  publicUrl: "http://qa-tms.qatarcentral.cloudapp.azure.com:4455/api",
  // PUSHER_API_KEY: 'e88237276efd33cea7a6',
  // PUSHER_API_CLUSTER: 'ap2'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
