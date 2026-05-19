export const msalConfig = {
  auth: {
    clientId: '96dc58c8-da9e-4131-8604-849d6495e974',
    authority: 'https://login.microsoftonline.com/3660e206-f53b-49a3-a9d4-a4f15cb51931',
    redirectUri: window.location.origin, // works for both localhost and Netlify automatically
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};
 
// Scopes — what data we request from Microsoft Graph
export const loginRequest = {
  scopes: ['User.Read'],
};
 
// Microsoft Graph endpoint for the logged-in user's profile
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};
 