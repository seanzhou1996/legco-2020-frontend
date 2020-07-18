import React from 'react';
import axios from 'axios';

import ListOfCheckboxes from './ListOfCheckboxes';
import TextInput from './TextInput';

import './CandidateFinder.scss';

import {
  Constituency,
  PoliticalPosition 
} from '../models';

interface CandidateFinderState {
  searchText: string,
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
      id: 'center',
      name: '中間派'
    },
    {
      id: 'unclear',
      name: '未知'
    }
  ];

  constructor(props: any) {
    super(props);
    this.state = {
      searchText: '',
      isChecked: {}
    };
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
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

  handleSearchTextChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    this.setState({
      searchText: value
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

  createCheckboxes(
    options: { id: string, name: string }[], 
    name: string
  ) {
    return options.map(opt => ({
      id: opt.id,
      label: opt.name,
      name,
      checked: this.state.isChecked[opt.id] || false,
      onCheckboxChange: this.handleCheckboxChange
    }));
  }

  render() {
    const checkboxes_1 = this.createCheckboxes(
      this.geographicalConstituencies,
      'constituencies'
    );
    const checkboxes_2 = this.createCheckboxes(
      this.functionalConstituencies,
      'constituencies'
    );
    const checkboxes_3 = this.createCheckboxes(
      this.politicalPositions,
      'political_positions'
    );
    return (
      <div className="candidate-finder">
        <form className="candidate-finder__form">
          <fieldset>
            <legend>Name</legend>
            <TextInput
              name="name" 
              placeholder="Input candidate name" 
              value={ this.state.searchText } 
              onChange={ this.handleSearchTextChange } />
          </fieldset>
          <fieldset>
            <legend>Constituencies</legend>
            <div>
              <div>Geographical constituencies</div>
              <ListOfCheckboxes checkboxes={ checkboxes_1 } />
              <div>Functional constituencies</div>
              <ListOfCheckboxes checkboxes={ checkboxes_2 } />
            </div>
          </fieldset>
          <fieldset>
            <legend>Political positions</legend>
            <ListOfCheckboxes checkboxes={ checkboxes_3 } />
          </fieldset>
        </form>
      </div>
    )
  }
}

export default CandidateFinder;