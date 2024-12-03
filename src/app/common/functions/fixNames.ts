export function updateItemName(item: any, arname: string, enname: string): void {
    if (!arname || arname === ''|| arname === '---') {
      item.arName = enname;
    } else {
      item.arName = arname;
    }
  
    if (!enname || enname === ''|| enname === '---') {
      item.enName = arname;
    } else {
      item.enName = enname;
    }
  }