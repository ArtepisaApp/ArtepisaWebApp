// js/msal-config.js
const REPO = "ArtepisaWebApp";                 // ← NOMBRE EXACTO del repo de Pages
const CLIENT_ID = "385ab3e7-6726-46e2-99f0-fcdda0ed840b"; // ← tu Application (client) ID
const TENANT_ID = "774a9e31-4613-4a73-9bfb-592b182ba5c1"; // ← tu Directory (tenant) ID

const AUTHORITY = `https://login.microsoftonline.com/${TENANT_ID}`;
const REDIRECT = `${location.origin}/${REPO}/index.html`; // si publicas en raíz, usa solo `${location.origin}/index.html`

window.MSAL_CONFIG = {
  clientId: CLIENT_ID,
  tenantId: TENANT_ID,
  redirectUri: REDIRECT,
  postLogoutRedirectUri: REDIRECT,
  scopes: ["User.Read", "Sites.ReadWrite.All"],
  options: {
    auth: { clientId: CLIENT_ID, authority: AUTHORITY, redirectUri: REDIRECT, postLogoutRedirectUri: REDIRECT, navigateToLoginRequestUrl: false },
    cache: { cacheLocation: "sessionStorage", storeAuthStateInCookie: false },
    system: { loggerOptions: { loggerCallback: () => {}, piiLoggingEnabled: false }, allowNativeBroker: false }
  },
  requests: {
    loginRequest: { scopes: ["User.Read", "Sites.ReadWrite.All"] },
    tokenRequest: { scopes: ["User.Read", "Sites.ReadWrite.All"] }
  }
};


/* ---------------------------------------------
   Backend de datos: SharePoint (site) para Lists
   --------------------------------------------- */
(function ensureGraphStorage() {
  const DEFAULT_STORAGE = {
    location: "site",             // usamos SharePoint, no OneDrive personal
    siteId: "",                   // ← pega aquí TU siteId cuando lo tengas
    folderPath: "/ArtepisaData"   // opcional; para Lists no es requerido
  };

  const incoming = window.GRAPH_STORAGE || {};
  window.GRAPH_STORAGE = {
    location: "site",
    siteId: incoming.siteId || DEFAULT_STORAGE.siteId,
    folderPath: incoming.folderPath || DEFAULT_STORAGE.folderPath
  };
})();

/* ---------------------------------------------
   Tips rápidos
   ---------------------------------------------
   - Asegúrate que en Azure → App Registration → Authentication
     tengas registrado EXACTAMENTE el Redirect URI que aquí genera
     (ej.: https://<usuario>.github.io/<REPO>/index.html)

   - Permisos en la App (Delegated):
       User.Read
       Sites.ReadWrite.All   (o Sites.Read.All si solo leerás)
     y otorga "Grant admin consent".

   - Para operar SharePoint Lists usa endpoints Graph tipo:
       /sites/{siteId}/lists/{listId}/items?expand=fields
*/
