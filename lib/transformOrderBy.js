import reduce from 'lodash.reduce'

export function orderByObjToSortedArray(orderBy) {
  const orderByArr = reduce(orderBy, (accum, [dir, index], column) => {
    accum.push([column, dir, index])
    return accum
  }, [])

  // Sort by index on (third element)
  return orderByArr.sort((o1, o2) => o1[2] > o2[2] ? 1 : -1)
}
