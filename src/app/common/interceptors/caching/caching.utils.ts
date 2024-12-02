import { getItemSessionStorage, setItemSessionStorage } from "../../storages/session-storage.utils";
import { sessionStorageEnum } from "../../storages/session-storage..Enum";
import { environment } from "src/environments/environment";
import { roots } from "src/app/shared/configs/endPoints";
import { HttpRequest } from "@angular/common/http";
import { cachingEnum } from "../caching.Enum";

// Cached URLs array (you can initially load this with predefined URLs if needed)
export const chachingAPIsURLs: string[] = [
  `${environment?.apiUrl}/${roots?.dashboard?.customers?.customersShortList}`,
  `${environment?.apiUrl}/${roots?.dashboard?.supervisors?.supervisorsList}`,
  `${environment?.apiUrl}/${roots?.dashboard?.drivers?.driversList}`,
  `${environment?.apiUrl}/${roots?.dashboard?.customers?.customersList}`,
];

// Function to check if the request URL exists in chachingAPIsURLs
function functionToCheck(url: string): boolean {
  return chachingAPIsURLs.includes(url);
}

// Function to get cached request URLs from session storage
function getCachedRequestsURLs(): string | any {
  const cachedData = getItemSessionStorage(sessionStorageEnum.CACHINGREQUESTS);
  return cachedData || '[]';  // Return empty array as string if data is null
}

// Function to set or remove a cached URL from session storage
export function setOrRemoveCacheRequestURL(requestURl: HttpRequest<any> | string, type: string): boolean {
  // console.log("requestURl: ",requestURl);
  // Get the cached URLs array from session storage and parse it safely
  let cachedRequestsURLArr: string[] = JSON.parse(getCachedRequestsURLs());

  // Check if the requestURl is a string or an HttpRequest object
  let urlToCheck: string;
  if (typeof requestURl === 'string') {
    urlToCheck = requestURl; // Directly use the string as the URL
  } else {
    urlToCheck = requestURl.url; // Use the URL property from the HttpRequest object
  }

  // Check if the URL exists in the cache
  const urlExistsInCache = functionToCheck(urlToCheck);

  if (urlExistsInCache) {
    // URL already exists in cache

    if (type === cachingEnum.ADD) {
      // URL exists, but we still try to add it if it's not already in the cached list
      if (!cachedRequestsURLArr.includes(urlToCheck)) {
        cachedRequestsURLArr.push(urlToCheck);
        // Save the updated list to session storage
        setItemSessionStorage(sessionStorageEnum.CACHINGREQUESTS, JSON.stringify(cachedRequestsURLArr));
      }
    }

    if (type === cachingEnum.REMOVE) {
      // Remove the URL from the cached list
      const indexToRemove = cachedRequestsURLArr.indexOf(urlToCheck);
      if (indexToRemove !== -1) {
        cachedRequestsURLArr.splice(indexToRemove, 1);
        // Save the updated list to session storage
        setItemSessionStorage(sessionStorageEnum.CACHINGREQUESTS, JSON.stringify(cachedRequestsURLArr));
        localStorage.removeItem(urlToCheck)
      }
    }
    return true;
  } else {
    // URL is not in the cache
    return false;
  }
}
