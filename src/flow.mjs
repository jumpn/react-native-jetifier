// @flow strict

type Dict<Key, Value> = {[key: Key]: Value};

type DictOf<Value> = Dict<string, Value>;

// We are exploiting a corner case of $Rest as $Shape does not work well with
// exact objects
// https://flow.org/en/docs/types/utilities/#toc-rest
type ExactShape<ExactType> = $Rest<ExactType, {}>;

export type {DictOf, ExactShape};
