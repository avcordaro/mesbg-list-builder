export const findAndRemoveItem = <T>(
  array: T[],
  predicate: (item: T) => boolean,
): T | null => {
  const itemIndex = array.findIndex(predicate);
  if (itemIndex !== -1) {
    // If the item has an index (and thus is found), remove it from the array and return the item.
    return array.splice(itemIndex, 1)[0];
  }
  return null;
};
