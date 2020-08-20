import React, { 
  ChangeEventHandler, 
  createRef, 
  Component 
} from 'react';
import axios from 'axios';
import classnames from 'classnames';

import Input from 'components/Input/Input';

import FinderContext, { 
  FinderContextValue 
} from './context';

import CandidateFilter from './CandidateFilter/CandidateFilter';

import SelectedFilters from './SelectedFilters/SelectedFilters';

import './CandidateFinder.scss';

import {
  Constituency,
  Candidate,
  SelectOption,
  Selected,
  SelectType,
  SelectSet,
  CheckboxOption,
  Checked
} from 'types';

interface CandidateFinderState {
  keyword: string,
  checked: Checked,
  selected: Selected,
  resourceFetched: boolean
}

class CandidateFinder extends Component<any, CandidateFinderState> {
  candidates: Candidate[] = [];
  constituencies: Constituency[] = [];
  checkboxOptions: CheckboxOption[] = [
    {
      id: '35_or_younger', 
      name: '35嵗及以下候選人',
      group: 'age'
    },
    {
      id: 'dem_primary',
      name: '參與民主派初選',
      group: 'other_info'
    },
    {
      id: 'fresh_face',
      name: '首次參選立法會',
      group: 'other_info'
    },
    {
      id: 'independent',
      name: '無政黨背景',
      group: 'other_info'
    }
  ];

  // Unlike checkbox options, we use a map to store different types of
  // select options. The map allows to get a specific type of options
  // without filtering.
  selectSet: SelectSet = {
    constituency_type: [
      {
        id: 'gc',
        name: '地方選區'
      },
      {
        id: 'fc',
        name: '功能組別選區'
      }  
    ],
    constituency: [],
    political_position: [
      {
        id: 'all',
        name: '不限'
      },
      {
        id: 'est',
        name: '建制派'
      },
      {
        id: 'dem',
        name: '民主派'
      },  
    ]
  }

  // Default values for all select types. We use "all" for 
  // political position because it's a real option in the
  // select set.
  readonly defaultSelects: Selected = {
    constituency_type: '',
    constituency: '',
    political_position: 'all'
  }

  // A reference to the native candidate search input element
  candidateSearchInputRef = createRef<HTMLInputElement>();

  constructor(props: any) {
    super(props);
    // Set initial state. While `checked` is empty, we must
    // initialize `selected` with the default selects so
    // that all select inputs correctly display the default
    // selections.
    this.state = {
      keyword: '',
      checked: {},
      selected: this.defaultSelects,
      resourceFetched: false
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
    // Get the referred element
    const candidateSearchInput = this.candidateSearchInputRef.current;
    // If the current reference is valid, focus the input.
    if (candidateSearchInput !== null) {
      candidateSearchInput.focus();
    }
    try {
      const constituencies = await this.getConstituencies();
      const candidates = await this.getCandidates();
      
      constituencies.forEach(obj => {
        const option: SelectOption = {
          id: obj.id,
          name: obj.name
        };
        this.selectSet.constituency.push(option);
        this.constituencies.push(obj);
      });
      this.candidates = candidates;
      // Update resource fetched flag to trigger a re-render
      this.setState({
        resourceFetched: true
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

  updateSelectedState = (
    type: SelectType,
    value: string
  ) => {
    this.setState(prevState => {
      const currentState = {
        selected: {
          ...prevState.selected,
          [type]: value
        }
      };
      if (type === 'constituency_type') {
        // If constituency type is changed, reset constituency to its default [1].
        const currentConstType = value;
        const {
          constituency_type: prevConstType,
          constituency: prevConst
        } = prevState.selected;
        if (prevConstType !== currentConstType) {
          currentState.selected.constituency = this.defaultSelects.constituency; // [1]
        } else {
          currentState.selected.constituency = prevConst;
        }
      }
      return currentState;
    });
  }

  updateCheckedState = (id: string) => {
    this.setState(prevState => {
      let previouslyChecked = prevState.checked[id] || false;
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
        return obj.constituencyId === selectedConstituency;
      }
      if (hasConstituencyTypeFilter) {
        // Type of the constituency the candidate is in
        const _type = this.constituencies
          .find(_obj => _obj.id === obj.constituencyId)?.type;
        return _type === selectedConstituencyType;
      }
      return true;
    });

    return filteredCandidates;
  }

  render() {
    const filteredCandidates = this.getFilteredCandidates();
    const countOfResults = filteredCandidates.length;
    const contextValue: FinderContextValue = {
      constituencies: this.constituencies,
      selected: this.state.selected,
      checked: this.state.checked,
      selectSet: this.selectSet,
      checkboxOptions: this.checkboxOptions,
      defaultSelects: this.defaultSelects,
      updateSelectedState: this.updateSelectedState,
      updateCheckedState: this.updateCheckedState
    };

    // To visually hide label, we lift input up when
    // [1] input is in focus (handled by CSS) or
    // [2] input is not empty.
    const candidateSearchInputClass = classnames(
      'candidate-search__input',
      {
        'candidate-search__input--non-empty': this.state.keyword !== '' // [2]
      }
    );

    return (
      <FinderContext.Provider value = { contextValue }> 
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
            <CandidateFilter />
            <SelectedFilters />
          </form>
          <footer className="candidate-finder__footer">
            <div className="legco-container">
              <button type="button" className="legco-button candidate-finder__show-results">
                查看{ countOfResults }個結果
              </button>
            </div>
          </footer>
        </div>
      </FinderContext.Provider>
    );
  }
}

export default CandidateFinder;