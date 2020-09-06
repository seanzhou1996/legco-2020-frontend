import React from 'react';
import classnames from 'classnames';

import {
  ClassList
} from 'constants/types';

import './Input.scss';

export interface InputProps extends ClassList {
  type?: 'text' | 'number',
  name?: string,
  id?: string,
  value?: string,
  placeholder?: string,
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export type InputRef = HTMLInputElement;

export default React.forwardRef<InputRef, InputProps>((props = { type: 'text' }, ref) => {
  const {
    classList,
    ..._props
  } = props;
  const inputClass = classnames(
    ...(classList || []),
    'legco-input'
  );
  return (
    <input {..._props} className={ inputClass } ref={ ref } />
  )
});
