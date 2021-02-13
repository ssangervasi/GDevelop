// @flow
import * as React from 'react';
import ReactJsonView from 'react-json-view';
import {
  type GameData,
  type EditFunction,
  type CallFunction,
} from '../GDJSInspectorDescriptions';
import { parseFloatSafe } from '../Utils/StringHelpers';
import mapValues from 'lodash/mapValues';

type Props = {|
  variablesContainer: GameData,
  onCall: CallFunction,
  onEdit: EditFunction,
|};

const transformVariable = variable => {
  if (!variable) return null;

  if (!variable._isStructure) {
    return variable._stringDirty ? variable._value : variable._str;
  } else {
    if (!variable._children) return null;

    return mapValues(variable._children, transformVariable);
  }
};

const transform = variablesContainer => {
  if (
    !variablesContainer ||
    !variablesContainer._variables ||
    !variablesContainer._variables.items
  )
    return null;

  return mapValues(variablesContainer._variables.items, transformVariable);
};

const handleEdit = (edit, { onCall, onEdit }: Props) => {
  // Reconstruct the path to the variable to edit
  const path = ['_variables', 'items'];
  edit.namespace.forEach(variableName => {
    path.push(variableName);
    path.push('_children');
  });
  path.push(edit.name);

  // Guess the type of the new value (number or string)
  if (parseFloatSafe(edit.new_value).toString() === edit.new_value) {
    path.push('setNumber');
    onCall(path, [parseFloatSafe(edit.new_value)]);
  } else {
    path.push('setString');
    onCall(path, ['' + edit.new_value]);
  }

  return true;
};

export default (props: Props) => (
  <ReactJsonView
    collapsed={false}
    name={false}
    src={props.variablesContainer ? transform(props.variablesContainer) : null}
    enableClipboard={false}
    displayDataTypes={false}
    displayObjectSize={false}
    onEdit={edit => handleEdit(edit, props)}
    groupArraysAfterLength={50}
    theme="monokai"
  />
);
