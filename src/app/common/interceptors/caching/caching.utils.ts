import { getItemSessionStorage, setItemSessionStorage } from "../../storages/session-storage.utils";
import { sessionStorageEnum } from "../../storages/session-storage..Enum";
import { environment } from "src/environments/environment";
import { roots } from "src/app/shared/configs/endPoints";
import { HttpRequest } from "@angular/common/http";
import { cachingEnum } from "../caching.Enum";

// Cached URLs array (you can initially load this with predefined URLs if needed)
export const chachingAPIsURLs: string[] = [
  // `${environment?.apiUrl}/${roots?.dashboard?.customers?.customersShortList}`,
  `${environment?.apiUrl}/${roots?.dashboard?.supervisors?.supervisorsList}`,
  `${environment?.apiUrl}/${roots?.dashboard?.drivers?.driversList}`,
  `${environment?.apiUrl}/${roots?.dashboard?.customers?.customersList}`,
  `${environment?.apiUrl}/${roots?.dashboard?.users?.usersList}`,
  `${environment?.apiUrl}/${roots?.dashboard?.serviceAgents?.serviceAgentsList}`,
  `${environment?.apiUrl}/${roots?.dashboard?.tanks?.tanksList}`,
  // `${environment?.apiUrl}/${roots?.dashboard?.orders?.GetOrdersQL}`,
];

// Function to check if the request URL (with params) exists in the cache
function functionToCheck(url: string): boolean {
  return chachingAPIsURLs.some((cachedUrl) => url.startsWith(cachedUrl)); // Compare base URL + params
}

// Function to get cached request URLs from session storage
function getCachedRequestsURLs(): string[] {
  const cachedData = getItemSessionStorage(sessionStorageEnum.CACHINGREQUESTS);
  return cachedData ? JSON.parse(''+cachedData) : []; // Return empty array if data is null
}

// Function to set or remove a cached URL from session storage
export function setOrRemoveCacheRequestURL(
  requestURl: HttpRequest<any> | string,
  type: string,
  params: { [key: string]: any } = {}
): boolean {
  // Get the cached URLs array from session storage
  let cachedRequestsURLArr = getCachedRequestsURLs();

  // Determine if the requestURl is a string or an HttpRequest object
  const urlToCheck = typeof requestURl === 'string' ? requestURl : requestURl.urlWithParams;

  // If there are params, append them to the URL
  const urlWithParams = appendParamsToURL(urlToCheck, params);

  // If the operation is REMOVE, filter URLs based on the prefix with params
  if (type === cachingEnum.REMOVE) {
    // Remove all URLs that start with the given URL with params
    cachedRequestsURLArr = cachedRequestsURLArr.filter(url => !url.startsWith(urlWithParams));
    setItemSessionStorage(sessionStorageEnum.CACHINGREQUESTS, JSON.stringify(cachedRequestsURLArr));

    // Optionally, remove from localStorage
    localStorage.removeItem(urlWithParams); // You can remove specific or all URLs related to the given URL
    return true;
  }

  // Check if the full URL exists in the cache for ADD operation
  const urlExistsInCache = functionToCheck(urlWithParams);

  if (urlExistsInCache) {
    if (type === cachingEnum.ADD) {
      // Add URL if it's not already in the cached list
      if (!cachedRequestsURLArr.includes(urlWithParams)) {
        cachedRequestsURLArr.push(urlWithParams);
        setItemSessionStorage(sessionStorageEnum.CACHINGREQUESTS, JSON.stringify(cachedRequestsURLArr));
      }
    }
    return true;
  }

  return false; // URL not found in the cache
}

// Helper function to append params to URL
function appendParamsToURL(url: string, params: { [key: string]: any }): string {
  const searchParams = new URLSearchParams();
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      searchParams.append(key, params[key]);
    }
  }
  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}


