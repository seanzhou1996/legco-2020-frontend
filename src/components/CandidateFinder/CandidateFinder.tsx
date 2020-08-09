import React, { ChangeEventHandler, createRef, Component } from 'react';
import axios from 'axios';
import classnames from 'classnames';

import Input from '../Input/Input';

import CandidateFilter, { CandidateFilterProps } from './CandidateFilter/CandidateFilter';
import SelectedFilters, { SelectedFiltersProps } from './SelectedFilters/SelectedFilters';

import './CandidateFinder.scss';

import {
  Constituency
} from '../../models';

interface CandidateFinderState {
  keyword: string,
  checked: {
    [id: string]: boolean
  },
  selected: {
    [group: string]: string
  },
  remoteSourceFetched: boolean
}

class CandidateFinder extends Component<any, CandidateFinderState> {
  candidates: Candidate[] = [];
  constituencies: Constituency[] = [];
  checkboxOptions = [
    {
      id: '35_or_younger', 
      name: '35嵗及以下候選人',
      group: 'age'
    },
    {
      id: 'dem_primary',
      name: '參與民主派初選',
      group: 'others'
    },
    {
      id: 'fresh_face',
      name: '首次參選立法會',
      group: 'others'
    },
    {
      id: 'independent',
      name: '無政黨背景',
      group: 'others'
    }
  ];

  selectOptions = [
    {
      id: 'all',
      name: '不限',
      group: 'political_position'
    },
    {
      id: 'est',
      name: '建制派',
      group: 'political_position'
    },
    {
      id: 'dem',
      name: '民主派',
      group: 'political_position'
    },
    {
      id: 'gc',
      name: '地方選區',
      group: 'constituency_type'
    },
    {
      id: 'fc',
      name: '功能組別選區',
      group: 'constituency_type'
    }
  ];

  readonly defaultSelects: {
    [group: string]: string
  } = {
    constituency_type: '',
    constituency: '',
    political_position: 'all'
  }

  candidateSearchInputRef = createRef<HTMLInputElement>();

  constructor(props: any) {
    super(props);
    this.state = {
      keyword: '',
      checked: {},
      selected: this.defaultSelects,
      remoteSourceFetched: false
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

  async getCandidates(): Promise<Candidate[]> {
    const url = process.env.PUBLIC_URL + '/assets/candidates.json';
    return axios.get(url)
      .then(res => {
        if ([201, 200].includes(res.status)) {
          return res.data.candidates;
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
    if (candidateSearchInput !== null) {
      candidateSearchInput.focus();
    }
    try {
      this.constituencies.push(
        ...(await this.getConstituencies())
      );
      this.candidates.push(
        ...(await this.getCandidates())
      );
      this.selectOptions.push(
        ...this.constituencies.map(obj => ({
          id: obj.id,
          name: obj.name,
          group: obj.type
        }))
      );
      this.setState({
        remoteSourceFetched: true
      });
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

  /**
   * Handler for change events on the constituency type select group. Updates
   * selected state to reflect the user's choice.
   * 
   * @param event Change event on the select group.
   */
  handleConstituencyTypeChange: ChangeEventHandler<HTMLSelectElement> = event => {
    const { value } = event.target;
    this.updateSelectState('constituency_type', value);
  }

  /**
   * Handler for change events on the constituency select group. Updates
   * selected state to reflect the user's choice.
   * 
   * @param event Change event on the select group.
   */
  handleConstituencyChange: ChangeEventHandler<HTMLSelectElement> = event => {
    const { value } = event.target;
    this.updateSelectState('constituency', value);
  }

  updateSelectState = (
    name: string,
    value: string
  ) => {
    this.setState(prevState => {
      const currentState = {
        selected: {
          ...prevState.selected,
          [name]: value
        }
      };
      switch (name) {
        // Set current constituency type [1] and update constituency, if the current type is
        // different from the old one [2].
        case 'constituency_type': {
          const {
            name: prevValue,
            constituency: prevConstituency
          } = prevState.selected;
          currentState.selected['constituency'] = value !== prevValue ? this.defaultSelects['constituency_type'] : prevConstituency;
        }
      }
      return currentState;
    });
  }

  updateCheckboxState = (id: string) => {
    this.setState(prevState => {
      let previouslyChecked = prevState.checked?.[id] || false;
      return {
        checked: {
          ...prevState.checked,
          [id]: !previouslyChecked
        }
      };
    });
  }

  getFilteredCandidates = () => {
    const {
      constituency_type: selectedConstituencyType,
      constituency: selectedConstituency
    } = this.state.selected;

    let hasConstituencyTypeFilter = false;
    let hasConstituencyFilter = false;
    if (
      selectedConstituency && 
      selectedConstituency !== this.defaultSelects['constituency']
    ) {
      hasConstituencyFilter = true;
    }
    if (
      selectedConstituencyType && 
      selectedConstituencyType !== this.defaultSelects['constituency_type']
    ) {
      hasConstituencyTypeFilter = true;
    }

    const filteredCandidates = this.candidates.filter(obj => {
      if (hasConstituencyFilter) {
        return obj.constituency_id === selectedConstituency;
      }
      if (hasConstituencyTypeFilter) {
        // Type of the constituency the candidate is in
        const _type = this.constituencies
          .find(_obj => _obj.id === obj.constituency_id)?.type;
        return _type === selectedConstituencyType;
      }
      return true;
    });

    return filteredCandidates;
  }

  /**
   * Change event handler for checkbox `id` under `group`.
   * 
   * @param group Form group the checkbox belongs to.
   * @param id Identifier of the checkbox.
   */
  handleCheckboxChange = (id: string) => {
    this.updateCheckboxState(id);
  }

  handleRadioChange = (group: string, id: string) => {
    this.updateSelectState(group, id);
  }

  render() {
    const filteredCandidates = this.getFilteredCandidates();
    const countOfResults = filteredCandidates.length;
    const candidateFilterProps: CandidateFilterProps = {
      selected: this.state.selected,
      checked: this.state.checked,
      selectOptions: this.selectOptions,
      checkboxOptions: this.checkboxOptions,
      defaultSelects: this.defaultSelects,
      handleConstituencyTypeChange: this.handleConstituencyTypeChange,
      handleConstituencyChange: this.handleConstituencyChange,
      handleCheckboxChange: this.handleCheckboxChange,
      handleRadioChange: this.handleRadioChange
    };

    const selectedFiltersProps: SelectedFiltersProps = {
      selected: this.state.selected,
      checked: this.state.checked,
      selectOptions: this.selectOptions,
      checkboxOptions: this.checkboxOptions,
      defaultSelects: this.defaultSelects,
      updateSelectState: this.updateSelectState,
      updateCheckboxState: this.updateCheckboxState
    }

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
          <CandidateFilter { ...candidateFilterProps } />
          <SelectedFilters { ...selectedFiltersProps } />
        </form>
        <footer className="candidate-finder__footer">
          <div className="legco-container">
            <button type="button" className="legco-button candidate-finder__show-results">
              查看{ countOfResults }個結果
            </button>
          </div>
        </footer>
      </div>
    )
  }
}

export default CandidateFinder;