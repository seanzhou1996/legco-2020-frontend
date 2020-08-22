import React, { 
  ChangeEventHandler, 
  createRef, 
  Component 
} from 'react';
import classnames from 'classnames';

import Input from 'components/Input/Input';

import FinderContext, { 
  FinderContextValue 
} from './context';

import FiltersPanel from './FiltersPanel/FiltersPanel';

import ActiveFilters from './ActiveFilters/ActiveFilters';

import './CandidateFinder.scss';

import {
  Candidate,
  Constituency,
  ConstituencyTypeMap,
  CandidateInfoMap,
  Selected,
  SelectType,
  CheckboxId,
  Checked
} from 'constants/types';

import * as _ from 'constants/utilities';

import {
  checkedDefaults,
  selectedDefaults
} from 'constants/defaults';

interface CandidateFinderState {
  keyword: string,
  checked: Checked,
  selected: Selected,
  resourceFetched: boolean
}

class CandidateFinder extends Component<any, CandidateFinderState> {
  constituencies: Constituency[] = [];
  candidates: Candidate[] = [];
  filtered: Candidate[] = [];
  candidateInfoMap: CandidateInfoMap = {};
  constituencyTypeMap: ConstituencyTypeMap = {};

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
      checked: checkedDefaults,
      selected: selectedDefaults,
      resourceFetched: false
    };
  }

  async componentDidMount() {
    // Get the referred element
    const candidateSearchInput = this.candidateSearchInputRef.current;
    // If the current reference is valid, focus the input.
    if (candidateSearchInput !== null) {
      candidateSearchInput.focus();
    }
    try {
      this.constituencies = await _.getConstituencies();
      this.candidates = await _.getCandidates();
      this.candidateInfoMap = (await _.getCandidateInfoList())
        .reduce((prev, current) => {
          const {
            id,
            ...personalInfo
          } = current;
          return {
            [id]: personalInfo,
            ...prev
          };
        }, {});
      this.constituencyTypeMap = _.getConstituencyTypeMap(
        this.constituencies
      );
      
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
          currentState.selected.constituency = selectedDefaults.constituency; // [1]
        } else {
          currentState.selected.constituency = prevConst;
        }
      }
      return currentState;
    });
  }

  updateCheckedState = (id: CheckboxId) => {
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

  filterCandidates = () => {
    const currentFilters = {
      ...this.state.selected,
      ...this.state.checked
    };

    const filterDefaults = {
      ...selectedDefaults,
      ...checkedDefaults
    };

    this.filtered = this.candidates.filter(obj => {
      const constituency = obj.constituencyId;
      const constituency_type = this.constituencyTypeMap[constituency];
      const personalInfo = this.candidateInfoMap[obj.id];
      const dob = personalInfo?.dob;
      // TODO: remove fallback when info list is ready.
      // Fallback: since candidate info map is incomplete, `personalInfo` can be
      // undefined, in which occasion `dob` is null and consequently, `age`
      // undefined. Therefore, we have to check `age` before comparing it with
      // 36.
      const age = dob ? _.calculateAge(dob) : undefined;
      const younger_than_36 = age ? age < 36 : false;

      const currentCandidate = {
        ...personalInfo,
        constituency_type,
        constituency,
        younger_than_36
      };
      // Loop over all filters. For each filter, we call type guard to confirm its
      // identity as filter [1]. Then, check if that filter is active [2]. If so, 
      // check filter against current candidate, remove the candidate if they
      // do not meet the filter condition [3].
      for (let prop in currentFilters) {
        if (_.isFilter(prop)) { // [1]
          const filter = prop;
          if (currentFilters[filter] === filterDefaults[filter]) // [2]
            continue;
          if (currentFilters[filter] !== currentCandidate[filter]) { // [3]
            return false;
          }
        }
      }
      return true;
    });
  }

  render() {
    this.filterCandidates();
    const contextValue: FinderContextValue = {
      candidates: this.candidates,
      constituencies: this.constituencies,
      selected: this.state.selected,
      checked: this.state.checked,
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
            <FiltersPanel />
            <ActiveFilters />
          </form>
          <footer className="candidate-finder__footer">
            <div className="legco-container">
              <button type="button" className="legco-button candidate-finder__show-results">
                查看{ this.filtered.length }個結果
              </button>
            </div>
          </footer>
        </div>
      </FinderContext.Provider>
    );
  }
}

export default CandidateFinder;