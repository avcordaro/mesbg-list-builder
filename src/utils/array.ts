/**
 * Function to remove an item from an array which then also gets
 * returned from the function to use in later stages. Useful for
 * removing units or warbands from the roster. Deleted warband /
 * unit can be used for calculations.
 *
 * @param array a list of <T>
 * @param predicate check to match the item to remove.
 */
export const findAndRemoveItem = <T>(
  array: T[],
  predicate: (item: T) => boolean,
): T | null => {
  const itemIndex = array.findIndex(predicate);
  if (itemIndex !== -1) {
    // If the item has an index (and thus is found),
    // remove it from the array and return the item.
    return array.splice(itemIndex, 1)[0];
  }
  return null;
};

export const arraysIntersect = (arr1, arr2) => {
  const set1 = new Set(arr1);
  return arr2.some((item) => set1.has(item));
};

export function moveItem<ITEM_TYPE>(
  array: ITEM_TYPE[],
  fromIndex: number,
  toIndex: number,
): ITEM_TYPE[] {
  const [item] = array.splice(fromIndex, 1);
  array.splice(toIndex, 0, item);
  return array;
}

export function moveItemBetweenLists<ITEM_TYPE>(
  array1: ITEM_TYPE[],
  fromIndex: number,
  array2: ITEM_TYPE[],
  toIndex: number,
): [ITEM_TYPE[], ITEM_TYPE[]] {
  const [item] = array1.splice(fromIndex, 1);
  array2.splice(toIndex, 0, item);
  return [array1, array2];
}
