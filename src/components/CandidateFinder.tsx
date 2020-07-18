import React from 'react';
import axios from 'axios';
import classnames from 'classnames';

import Checkbox from './Checkbox/Checkbox';
import Input from './Input';
import Expander from './Expander/Expander';
import ExpanderButton from './Expander/ExpanderButton';
import ExpanderPanel from './Expander/ExpanderPanel';

import './CandidateFinder.scss';

import {
  Constituency,
  PoliticalPosition 
} from '../models';

interface CandidateFinderState {
  searchText: string,
  focused?: boolean,
  isChecked: {
    [propName: string]: boolean
  }
}

class CandidateFinder extends React.Component<any, CandidateFinderState> {
  constituencies: Constituency[] = [];
  geographicalConstituencies: Constituency[] = [];
  functionalConstituencies: Constituency[] = [];
  politicalPositions: PoliticalPosition[] = [
    {
      id: 'est',
      name: '建制派'
    },
    {
      id: 'dem',
      name: '民主派'
    },
    {
      id: 'others',
      name: '其他'
    }
  ];

  constructor(props: any) {
    super(props);
    this.state = {
      searchText: '',
      isChecked: {}
    };
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleSearchInputFocus = this.handleSearchInputFocus.bind(this);
    this.handleSearchInputBlur = this.handleSearchInputBlur.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  async getConstituencies(): Promise<Constituency[]> {
    const url = process.env.PUBLIC_URL + '/assets/constituencies.json';
    return axios.get(url)
      .then(res => {
        if ([200, 201].includes(res.status)) {
          return res.data.constituencies;
        } else {
          console.warn(res.statusText);
          return [];
        }
      })
      .catch(err => {
        throw err;
      });
  }

  async componentDidMount() {
    try {
      this.constituencies = await this.getConstituencies();
      this.geographicalConstituencies = this.constituencies.filter(obj => {
        return obj.type === 'gc';
      });
      this.functionalConstituencies = this.constituencies.filter(obj => {
        return obj.type === 'fc';
      });
      const isChecked = [
        ...this.constituencies.map(obj => obj.id),
        ...this.politicalPositions.map(obj => obj.id)
      ].reduce((set, id) => {
        return {
          ...set,
          [id]: false
        }
      }, {});  
      this.setState({
        isChecked
      });
    } catch (error) {
      console.error(error);
    }
  }

  handleSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    this.setState({
      searchText: value
    });
  }

  handleSearchInputFocus() {
    this.setState({
      focused: true
    });
  }

  handleSearchInputBlur() {
    this.setState({
      focused: false
    });
  }

  handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { id } = event.target;
    this.setState(prevState => {
      return {
        isChecked: {
          ...prevState.isChecked,
          [id]: !prevState.isChecked[id]
        }
      }
    });
  }

  createCheckbox(
    option: { id: string, name: string }, 
    name: string
  ) {
    return (
      <Checkbox 
        key={ option.id }
        id={ option.id }
        label={ option.name }
        name={ name }
        checked={ this.state.isChecked[option.id] || false }
        size={ 'small' }
        onChange={ this.handleCheckboxChange } />
    );
  }

  render() {
    const checkboxes1 = this.geographicalConstituencies.map(obj => {
      return this.createCheckbox(obj, 'constituencies');
    });
    const checkboxes2 = this.functionalConstituencies.map(obj => {
      return this.createCheckbox(obj, 'constituencies');
    });
    const checkboxes3 = this.politicalPositions.map(obj => {
      return this.createCheckbox(obj, 'political_positions');
    });
    const labelClass = classnames(
      'candidate-search__label',
      'legco-label',
      // Visually hide label when [1] input is in focus and
      // [2] input is not empty.
      {
        'visually-hidden': 
          this.state.focused || // [1]
          !!this.state.searchText // [2]
      }
    )
    return (
      <div className="candidate-finder">
        <header className="candidate-finder__header">
          <h1 className="candidate-finder__title">篩選候選人</h1>
          <button className="candidate-finder__return-link" type="button">
            返回主頁
          </button>
        </header>
        <form className="candidate-finder__form">
          <div className="candidate-search legco-form-group">
            <label className={ labelClass } htmlFor="candidate_search_input">搜索候選人</label>
            <Input
              className="candidate-search__input"
              id="candidate_search_input"
              name="candidate_name" 
              value={ this.state.searchText } 
              onChange={ this.handleSearchInputChange }
              onFocus={ this.handleSearchInputFocus }
              onBlur={ this.handleSearchInputBlur } />
          </div>
          <div className="candidate-filter">
            <Expander className="candidate-filter__expander">
              <ExpanderButton>地方選區</ExpanderButton>
              <ExpanderPanel>
                <fieldset className="legco-fieldset">
                  <legend className="candidate-filter__label legco-legend visually-hidden">地方選區</legend>
                  <div className="candidate-filter__options legco-form-group">
                    { checkboxes1 }
                  </div>
                </fieldset>
              </ExpanderPanel>
            </Expander>
            <Expander className="candidate-filter__expander">
              <ExpanderButton>功能組別選區</ExpanderButton>
              <ExpanderPanel>
                <fieldset className="legco-fieldset">
                  <legend className="candidate-filter__label legco-legend visually-hidden">功能組別選區</legend>
                  <div className="candidate-filter__options legco-form-group">
                    { checkboxes2 }
                  </div>
                </fieldset>
              </ExpanderPanel>
            </Expander>
            <Expander className="candidate-filter__expander">
              <ExpanderButton>政治立場</ExpanderButton>
              <ExpanderPanel>
                <fieldset className="legco-fieldset">
                  <legend className="candidate-filter__label legco-legend visually-hidden">政治立場</legend>
                  <div className="candidate-filter__options legco-form-group">
                    { checkboxes3 }
                  </div>
                </fieldset>
              </ExpanderPanel>
            </Expander>
          </div>
        </form>
        <footer className="candidate-finder__footer">
          <div className="legco-container">
            <button type="button" className="legco-button candidate-finder__show-results">查看xxx個結果</button>
          </div>
        </footer>
      </div>
    )
  }
}

export default CandidateFinder;