import React from 'react';

interface ListboxOptionProps {
  value: string,
  disabled?: boolean
}

export default class ListboxOption extends React.Component<ListboxOptionProps> {
  render() {
    return (
      <option {...this.props} >
        { this.props.children }
      </option>
    )
  }
}