import React, { ChangeEventHandler, createRef, Component } from 'react';
import axios from 'axios';
import classnames from 'classnames';

import Checkbox, { CheckboxProps } from '../Checkbox/Checkbox';
import Input from '../Input/Input';
import Expander from '../Expander/Expander';
import ExpanderButton from '../Expander/ExpanderButton';
import ExpanderPanel from '../Expander/ExpanderPanel';
import Listbox from '../Listbox/Listbox';

import './CandidateFinder.scss';

import {
  Constituency,
  ConstituencyType,
  PoliticalPosition 
} from '../../models';

interface CandidateFinderState {
  keyword: string,
  checked: {
    [propName: string]: boolean
  },
  constituencyType: string,
  constituency: string
}

const DEFAULT_CONSTITUENCY_TYPE = '';
const DEFAULT_CONSTITUENCY = '';

class CandidateFinder extends Component<any, CandidateFinderState> {
  constituencies: Constituency[] = [];
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

  constituencyTypes: ConstituencyType[] = [
    {
      id: 'gc',
      name: '地方選區'
    },
    {
      id: 'fc',
      name: '功能組別選區'
    }
  ]

  candidateSearchInputRef = createRef<HTMLInputElement>();

  constructor(props: any) {
    super(props);
    this.state = {
      keyword: '',
      checked: {},
      constituencyType: DEFAULT_CONSTITUENCY_TYPE,
      constituency: DEFAULT_CONSTITUENCY
    };
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
    const candidateSearchInput = this.candidateSearchInputRef.current;
    const checked = [
      ...this.politicalPositions.map(obj => obj.id)
    ].reduce((set, id) => {
      return {
        ...set,
        [id]: false
      }
    }, {});  
    this.setState({
      checked
    });
    if (candidateSearchInput !== null) {
      candidateSearchInput.focus();
    }
    try {
      this.constituencies = await this.getConstituencies();
    } catch (error) {
      console.error(error);
    }
  }

  handleSearchInputChange: ChangeEventHandler<HTMLInputElement> = event => {
    const { value } = event.target;
    this.setState({
      keyword: value
    });
  }

  handleConstituencyTypeChange: ChangeEventHandler<HTMLSelectElement> = event => {
    const { value } = event.target;
    this.setState(prevState => {
      const prevValue = prevState.constituencyType;
      return {
        constituency: value !== prevValue ? DEFAULT_CONSTITUENCY : prevState.constituency,
        constituencyType: value
      }
    })
  }
  handleConstituencyChange: ChangeEventHandler<HTMLSelectElement> = event => {
    this.setState({
      constituency: event.target.value
    });
  }

  handleCheckboxChange: ChangeEventHandler<HTMLInputElement> = event => {
    const { id } = event.target;
    this.setState(prevState => {
      return {
        checked: {
          ...prevState.checked,
          [id]: !prevState.checked[id]
        }
      }
    });
  }

  createOption(value: string, label: string) {
    return (
      <option key={ value } value={ value } >
        { label }
      </option>
    );
  }

  createCheckbox(
    option: { id: string, name: string }, 
    name: string
  ) {
    const props: CheckboxProps = {
      className: 'legco-checkbox--small',
      id: option.id,
      label: option.name,
      name,
      checked: this.state.checked[option.id] || false,
      onChange: this.handleCheckboxChange
    };
    return (
      <Checkbox key={ option.id } {...props} />
    );
  }

  render() {
    // To visually hide label, we lift input up when
    // [1] input is in focus (handled by CSS) and
    // [2] input is not empty.
    const candidateSearchInputClass = classnames(
      'candidate-search__input',
      {
        'candidate-search__input--non-empty': !!this.state.keyword // [2]
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
            <label 
              className="legco-label candidate-search__label" 
              htmlFor="candidate_search_input"
            >搜索候選人</label>
            <Input
              ref={ this.candidateSearchInputRef }
              className={ candidateSearchInputClass }
              id="candidate_search_input"
              name="candidate_name" 
              value={ this.state.keyword } 
              onChange={ this.handleSearchInputChange } />
          </div>
          <div className="candidate-filter">
            <Expander className="candidate-filter__expander">
              <ExpanderButton>所在選區</ExpanderButton>
              <ExpanderPanel>
                <div className="legco-form-group">
                  <label 
                    className="candidate-filter__label legco-label" 
                    htmlFor="constituency_type"
                  >選區類別</label>
                  <Listbox 
                    className="candidate-filter__options" 
                    id="constituency_type"
                    name="constituency_type"
                    value={ this.state.constituencyType }
                    onChange={ this.handleConstituencyTypeChange }
                  >
                    <option value={ DEFAULT_CONSTITUENCY_TYPE }>
                      所有選區類別
                    </option>
                    { this.constituencyTypes.map(obj => this.createOption(obj.id, obj.name)) }
                  </Listbox>
                </div>
                <div className="legco-form-group">
                  <label 
                    className="candidate-filter__label legco-label" 
                    htmlFor="constituency_name"
                  >選區</label>
                  <Listbox 
                    className="candidate-filter__options" 
                    id="constituency_name"
                    name="constituency"
                    value={ this.state.constituency }
                    onChange={ this.handleConstituencyChange }
                    disabled={ this.state.constituencyType === DEFAULT_CONSTITUENCY_TYPE }
                  >
                    <option value={ DEFAULT_CONSTITUENCY }>
                      所有選區
                    </option>
                    {
                      this.constituencies
                        .filter(obj => obj.type === this.state.constituencyType)
                        .map(obj => this.createOption(obj.id, obj.name))
                    }
                  </Listbox>
                </div>
              </ExpanderPanel>
            </Expander>
            <Expander className="candidate-filter__expander">
              <ExpanderButton>政治立場</ExpanderButton>
              <ExpanderPanel>
                <fieldset className="legco-fieldset">
                  <legend className="candidate-filter__label legco-legend visually-hidden">政治立場</legend>
                  <div className="candidate-filter__options legco-form-group">
                    {
                      this.politicalPositions
                        .map(obj => this.createCheckbox(obj, 'political_positions'))
                    }
                  </div>
                </fieldset>
              </ExpanderPanel>
            </Expander>
          </div>
        </form>
        <footer className="candidate-finder__footer">
          <div className="legco-container">
            <button type="button" className="legco-button candidate-finder__show-results">
              查看xxx個結果
            </button>
          </div>
        </footer>
      </div>
    )
  }
}

export default CandidateFinder;