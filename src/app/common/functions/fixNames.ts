export function updateItemName(item: any, arName: string, enName: string): void {
    if (!arName || arName === ''|| arName === '---') {
      item.arName = enName;
    } else {
      item.arName = arName;
    }
  
    if (!enName || enName === ''|| enName === '---') {
      item.enName = arName;
    } else {
      item.enName = enName;
    }
  }