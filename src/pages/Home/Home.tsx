import React, {
  Component
} from 'react';

import classnames from 'classnames';

import SearchBox from './SearchBox/SearchBox';
import FiltersList from './FiltersList/FiltersList';
import ActiveFilters from './ActiveFilters/ActiveFilters';
import CandidateCard from 'components/CandidateCard/CandidateCard';

import {
  Candidate,
  Constituency,
  PersonalInfo,
  KeywordChangeHandler,
  FiltersListProps,
  CandidateCardProps,
  ActiveFiltersProps,
  SearchBoxProps,
  HomePageState,
  CheckboxChangeHandler,
  SelectChangeHandler,
} from 'constants/types';

import {
  checkedDefaults,
  selectedDefaults
} from 'constants/defaults';

import {
  partialSelectSet
} from 'constants/filters';

import * as _ from 'constants/utilities';

import './Home.scss';

export default class Home extends Component<any, HomePageState> {
  constituencies: Constituency[] = [];
  candidates: Candidate[] = [];
  personalInfoList: PersonalInfo[] = [];
  personalInfoMap: Record<string, PersonalInfo> = {};
  constTypeLabelMap: {
    [id: string]: string
  } = (
    partialSelectSet.constituencyType.reduce((prev, current) => ({
      ...prev,
      [current.id]: current.name
    }), {})
  );

  constructor(props: any) {
    super(props);
    this.state = {
      keyword: '',
      checked: checkedDefaults,
      selected: selectedDefaults,
      resourceFetched: false,
      showFiltersPanel: false
    };
  }

  async componentDidMount() {
    Promise.all(
      [
        _.getConstituencies(),
        _.getCandidates(),
        _.getPersonalInfoList()
      ]
    )
    .then(results => {
      const [
        constituencies,
        candidates,
        personalInfoList
      ] = results;

      this.constituencies.push(...constituencies);
      this.candidates.push(...candidates);
      this.personalInfoList.push(...personalInfoList);
      this.personalInfoMap = _.createPersonalInfoMap(personalInfoList);

      this.setState({
        resourceFetched: true
      });
    })
    .catch(err => {
      console.error(err);
    })
  }

  toggleFilterPanel = () => {
    this.setState(prevState => {
      return {
        showFiltersPanel: !prevState.showFiltersPanel
      }
    });
  }

  handleKeywordChange: KeywordChangeHandler = (event) => {
    const { value } = event.target;
    this.setState({
      keyword: value
    });
  }

  handleSelectChange: SelectChangeHandler = (type, value) => {
    this.setState(prevState => {
      const currentState = {
        selected: {
          ...prevState.selected,
          [type]: value
        }
      };
      if (type === 'constituencyType') {
        // If constituency type is changed, reset constituency to its default [1].
        const currentConstType = value;
        const {
          constituencyType: prevConstType,
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

  handleCheckboxChange: CheckboxChangeHandler = (id) => {
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

  filterCandidates = (candidates: Candidate[]) => {
    const {
      keyword,
      selected,
      checked
    } = this.state;

    const currentFilters = {
      ...selected,
      ...checked
    };

    const filterDefaults = {
      ...selectedDefaults,
      ...checkedDefaults
    };

    const constTypeMap = _.createConstituencyTypeMap(
      this.constituencies
    );

    const filtered = candidates.filter(obj => {
      const {
        constituencyId: constId,
        names
      } = obj;
      const firstCandidate = Array.isArray(names) ? names[0] : names;
      if (keyword.length > 0) {
        if (firstCandidate.search(keyword) === -1) {
          return false;
        }
      }
      const constTypeId = constTypeMap[constId];
      const personalInfo = this.personalInfoMap[obj.id];
      const { dob, affiliation } = personalInfo;
      const age = dob ? _.calculateAge(dob) : null;

      const currentCandidate = {
        ...personalInfo,
        constituencyType: constTypeId,
        constituency: constId,
        youngerThan36: age ? age < 36 : false,
        independent: !affiliation
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

    return filtered;
  }

  createCandidateCard(candidate: Candidate) {
    const {
      id,
      names
    } = candidate;

    const firstCandInfo = this.personalInfoMap[id];
    if (!firstCandInfo) {
      throw Error(`Couldn't find information of candidate with ID ${id}.`);
    }
    const {
      name: firstCandidate,
      affiliation,
      camp
    } = firstCandInfo;
    const props: CandidateCardProps = {
      id,
      firstCandidate,
      list: Array.isArray(names) ? names : null,
      affiliation,
      camp
    };
    return <CandidateCard { ...props } />;
  }

  createConstituencySection(
    constituency: Constituency,
    candidates: Candidate[]
  ) {
    if (!this.state.resourceFetched) return null;

    const {
      id: constId,
      name: constName,
      type: typeId
    } = constituency;

    const constType = this.constTypeLabelMap[typeId];

    const filteredCands = (
      candidates.filter(candObj => candObj.constituencyId === constId)
    );

    if (filteredCands.length === 0) return null;

    const candListItems = filteredCands.map(candObj => (
      <li key={ candObj.id } className="candidates__item">
        { this.createCandidateCard(candObj) }
      </li>
    ));

    return (
      <section key={ constId } className="candidates__section">
        <header className="candidates__header">
          <h3 className="candidates__constituency-name">{ constName }</h3>
          <span className="candidates__constituency-type">{ constType }</span>
        </header>
        <ul className="candidates__list">
          { candListItems }
        </ul>
      </section>
    );
  }

  render() {
    const {
      keyword,
      selected,
      checked,
      showFiltersPanel,
    } = this.state;

    const filtered = this.filterCandidates(this.candidates);
    const constSections = this.constituencies
      .map(constObj => this.createConstituencySection(constObj, filtered))
      .filter(_.notNull);

    const searchBoxProps: SearchBoxProps = {
      keyword,
      handleKeywordChange: this.handleKeywordChange
    };

    const filtersListProps: FiltersListProps = {
      selected,
      checked,
      constituencies: this.constituencies,
      handleSelectChange: this.handleSelectChange,
      handleCheckboxChange: this.handleCheckboxChange
    };

    const activeFiltersProps: ActiveFiltersProps = {
      selected,
      checked,
      constituencies: this.constituencies,
      handleCheckboxChange: this.handleCheckboxChange,
      handleSelectChange: this.handleSelectChange
    };

    const filtersPanelClass = classnames(
      'filters-panel',
      showFiltersPanel ? 'filters-panel--active' : null
    );

    const homeClass = classnames(
      'home-page',
      showFiltersPanel ? 'home-page--filters-panel-on' : null
    );
    
    return (
        <div className={ homeClass }>
          <header className="home-page__header">
            <div className="legco-container">
              <h1 className="app-title">
                <span className="app-subtitle">
                  2016年立法會選舉
                </span>
                候選人查詢
              </h1>
            </div>
          </header>
          <div className="candidate-finder">
            <div className="legco-container">
            <form>
              <SearchBox { ...searchBoxProps } />
              <div>
                <button 
                  className="candidate-finder__show-filters-btn" 
                  type="button" 
                  onClick={ this.toggleFilterPanel }
                >
                  顯示篩選條件
                </button>
              </div>
              <div className={ filtersPanelClass }>
                <header className="filters-panel__header">
                  <h1 className="filters-panel__title">篩選條件</h1>
                  <button 
                    className="filters-panel__go-back-btn" 
                    type="button"
                    onClick={ this.toggleFilterPanel }
                  >返回主頁</button>
                </header>
                <div className="filters-panel__body">
                  <FiltersList { ...filtersListProps } />
                </div>
                <footer className="filters-panel__footer">
                  <div className="legco-container">
                    <button 
                      type="button" 
                      className="legco-button filters-panel__show-results-btn"
                      onClick={ this.toggleFilterPanel }
                    >
                      查看{ filtered.length }個結果
                    </button>
                  </div>
                </footer>
              </div>
            </form>
            </div>
          </div>
          <div className="legco-container">
            <ActiveFilters { ...activeFiltersProps } />
            <div className="candidates">
              { constSections }
            </div>
          </div>
        </div>
    );
  }
}
