// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'fhvlhed2ng'
export const apiEndpoint = `https://${apiId}.execute-api.ap-northeast-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-k68389gq.us.auth0.com', // Auth0 domain
  clientId: 'n6gPOc5y5gV7dlwtsACOsUeW7lKIpoqJ', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
