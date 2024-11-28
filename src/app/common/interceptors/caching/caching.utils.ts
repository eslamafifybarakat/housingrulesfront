import { environment } from "src/environments/environment";
import { roots } from "src/app/shared/configs/endPoints";
import { HttpRequest } from "@angular/common/http";
import { cachingEnum } from "../caching.Enum";


// Cached URLs array
export const chachingAPIsURLs: string[] = [
  `${environment?.apiUrl}/${roots?.dashboard?.customers?.customersShortList}`,
  `${environment?.apiUrl}/${roots?.dashboard?.customers?.customersShortList}` // You might have other URLs too
];

// Function to check if the request URL exists in chachingAPIsURLs
function functionToCheck(url: string): boolean {
  return chachingAPIsURLs.includes(url);
}

// The function to add or remove the request URL from chachingAPIsURLs based on the type
export function setOrRemoveCacheRequestURL(requestURl: HttpRequest<any>, type: string): any {
  console.log(type);
  console.log(requestURl.url);

  // Check if requestURl.url exists in chachingAPIsURLs
  if (functionToCheck(requestURl.url)) {
    // URL already exists in cache
    console.log('URL exists in cache, skipping operation.');
    return null;
  } else {
    // // If the URL does not exist, handle ADD or REMOVE operation based on the type
    // if (type === cachingEnum.ADD) {
    //   // Add to chachingAPIsURLs
    //   chachingAPIsURLs.push(requestURl.url);
    //   console.log(`Added URL: ${requestURl.url} to the cache.`);
    // }
    // if (type === cachingEnum.REMOVE) {
    //   // Remove from chachingAPIsURLs if it exists
    //   const index = chachingAPIsURLs.indexOf(requestURl.url);
    //   if (index !== -1) {
    //     chachingAPIsURLs.splice(index, 1);
    //     console.log(`Removed URL: ${requestURl.url} from the cache.`);
    //   } else {
    //     console.log('URL not found in cache, nothing to remove.');
    //   }
    // }
    return null;
  }
}
