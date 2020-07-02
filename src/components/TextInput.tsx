import React from 'react';

import './TextInput.scss';

interface TextInputProps {
  name: string,
  id?: string,
  value: string,
  placeholder: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

class TextInput extends React.Component<TextInputProps> {
  render() {
    return (
      <input 
        className="legco-text_input"
        type="text" 
        name={ this.props.name }
        id={ this.props.id }
        value={ this.props.value }
        placeholder={ this.props.placeholder }
        onChange={ this.props.onChange } />
    );
  }
}

export default TextInput;