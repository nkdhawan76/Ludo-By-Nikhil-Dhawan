const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
const nodeMode = process.env.NODE_ENV;

const rawBaseUrl = (nodeMode === "development" ? beckendLocalApiUrl : beckendLiveApiUrl);
export const baseUrl = (rawBaseUrl && rawBaseUrl !== "undefined") ? rawBaseUrl : "http://localhost:7010/";
