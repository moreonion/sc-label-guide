export const _API_ = {
  queryDelim: ',',
  opDelim: ':',
  orderBy: {
    token: {
      asc: '',
      descr: '-'
    }
  }
}

/**
 * A default autocomplete endpoint returns paged results to given
 * query.
 *
 * An emulated autocomplete endpoint returns paged results without
 * considering a query.
 * That is an emulated autocompletion may be implemented the following way:
 *
 * 1. Fetch endpoint with offset=0 and limit={limit}
 * 2. On the client: filter response data for given query
 * 3. If filtered results is less than {minResults} then
 *    add the filtered results of the next page to the current
 *    result set until either enough results are found or no
 *    more pages are left. Otherwise return filtered results.
 */
export const AutocompleteTypes = {
  DEFAULT: 0,
  EMULATED: 1
}
