// @flow

type FilterFn<Value> = (
  value: Value,
  index: number,
  array: Array<Value>
) => mixed;

type UnaryFn<TParam, TResult> = (param: TParam) => TResult;

const filter = <TValueFiltered, TValue = TValueFiltered>(
  filterFn: FilterFn<TValue>
): UnaryFn<Array<TValue>, Array<TValueFiltered>> => array =>
  // $FlowFixMe
  array.filter(filterFn);

export {filter};
