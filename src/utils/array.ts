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
