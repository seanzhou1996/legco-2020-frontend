import React, { Component } from 'react';

import Input from 'components/Input/Input';

import {
  SearchBoxProps,
} from 'constants/types';

import './SearchBox.scss';

export default class SearchBox extends Component<SearchBoxProps> {
  render() {
    const {
      keyword,
      handleKeywordChange
    } = this.props;
    
    // To visually hide label, we lift input up when
    // [1] input is in focus (handled by CSS) or
    // [2] input is not empty.
    const inputClassList = [
      'search-box__input',
      keyword.length > 0 ? 'search-box__input--filled' : null // [2]
    ];
    return (
      <div className="search-box">
        <label 
          className="legco-label search-box__label" 
          htmlFor="name_input"
        >搜索候選人</label>
        <Input
          classList={ inputClassList }
          id="name_input"
          name="name" 
          value={ keyword } 
          onChange={ handleKeywordChange } />
        <button className="search-box__button" type="button"></button>
      </div>
    )
  }
}