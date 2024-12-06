import { setOrRemoveCacheRequestURL } from "../interceptors/caching/caching.utils";

export enum sessionStorageEnum {
  CACHINGREQUESTS = 'Caching Requests'
}

export function clearSessionCachingRequests() {
  window.sessionStorage.removeItem(sessionStorageEnum.CACHINGREQUESTS);
}

export function applyAddOrRemoveCacheRequest(urls: string[], action: 'Remove' | 'Add'): void {
  if (urls && urls.length > 0) {
    urls.forEach(url => {
      setOrRemoveCacheRequestURL(url, action);
    });
  }
}

