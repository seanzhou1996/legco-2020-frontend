import React from 'react';
import classnames from 'classnames';

import './Input.scss';

import { Props } from 'constants/types';

export interface InputProps extends Props {
  type?: 'text' | 'number',
  name?: string,
  id?: string,
  value?: string,
  placeholder?: string,
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export type InputRef = HTMLInputElement;

export default React.forwardRef<InputRef, InputProps>((props = { type: 'text' }, ref) => {
  const { className, children, ..._props } = props;
  const inputClass = classnames(
    ...(className || '').split(/\s+/g),
    'legco-input'
  );
  return (
    <input {..._props} className={ inputClass } ref={ ref } />
  )
});
