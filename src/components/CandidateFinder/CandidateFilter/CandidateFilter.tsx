import React from 'react';

import Checkbox, { CheckboxProps } from 'components/Checkbox/Checkbox';
import Radio, { RadioProps } from 'components/Radio/Radio';
import Expander from 'components/Expander/Expander';
import ExpanderHeader, { ExpanderButton, ExpanderLabel } from 'components/Expander/ExpanderHeader';
import ExpanderPanel from 'components/Expander/ExpanderPanel';
import Listbox from 'components/Listbox/Listbox';

import './CandidateFilter.scss';

export interface CandidateFilterProps {
  selected: {
    [group: string]: string
  },
  checked: {
    [id: string]: boolean
  },
  selectOptions: {
    id: string,
    name: string,
    group: string
  }[],
  checkboxOptions: {
    id: string,
    name: string,
    group: string
  }[],
  defaultSelects: {
    [group: string]: string
  },
  handleConstituencyTypeChange: React.ChangeEventHandler<HTMLSelectElement>,
  handleConstituencyChange: React.ChangeEventHandler<HTMLSelectElement>,
  handleCheckboxChange: (id: string) => void,
  handleRadioChange: (group: string, id: string) => void
}

export default class CandidateFilter extends React.Component<CandidateFilterProps> {
  /**
   * Returns a select option.
   * 
   * @param value Value of this option.
   * @param label Display text of this option.
   */
  createOption(value: string, label: string) {
    return (
      <option key={ value } value={ value } >
        { label }
      </option>
    );
  }

  createCheckbox(
    option: { id: string, name: string }, 
    name?: string
  ) {
    // Group checkboxes by category name, or their IDs when name is not given.
    const group = name || option.id;

    const props: CheckboxProps = {
      className: 'legco-checkbox--small',
      id: option.id,
      label: option.name,
      name: group,
      checked: this.props.checked?.[option.id] || false,
      onChange: () => { this.props.handleCheckboxChange(option.id) }
    };

    return (
      <Checkbox key={ option.id } {...props} />
    );
  }

  createRadioSelect(
    option: { id: string, name: string }, 
    name?: string
  ) {
    // Group radio inputs by category name, or their IDs when name is not given.
    const group = name || option.id;

    const props: RadioProps = {
      className: 'legco-radio--small',
      id: option.id,
      label: option.name,
      name: group,
      checked: this.props.selected?.[group] === option.id,
      onChange: () => { this.props.handleRadioChange(group, option.id) }
    };

    return (
      <Radio key={ option.id } {...props} />
    );
  }

  render() {
    const selectedConstituencies = [
      this.props.selectOptions.find(obj => obj.id === this.props.selected['constituency_type'])?.name,
      this.props.selectOptions.find(obj => obj.id === this.props.selected.constituency)?.name
    ].filter(str => str !== undefined).join('，');

    const countOfSelectedPersonalInfoFilters = 
      this.props.checkboxOptions.filter(obj => this.props.checked?.[obj.id] === true).length +
      this.props.selectOptions.filter(obj => {
        return obj.id === this.props.selected['political_position'] && 
          obj.id !== this.props.defaultSelects['political_position'];
      }).length;

    return (
      <div className="candidate-filter">
        <Expander className="candidate-filter__expander">
          <ExpanderHeader>
            <ExpanderButton>所在選區</ExpanderButton>
            <ExpanderLabel className={ selectedConstituencies === '' ? 'visually-hidden' : undefined }>
              { '已選擇：' + selectedConstituencies }
            </ExpanderLabel>
          </ExpanderHeader>
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
                value={ this.props.selected['constituency_type'] }
                onChange={ this.props.handleConstituencyTypeChange }
              >
                <option value={ this.props.defaultSelects['constituency_type'] }>
                  所有選區類別
                </option>
                { 
                  this.props.selectOptions
                    .filter(obj => obj.group === 'constituency_type')
                    .map(obj => this.createOption(obj.id, obj.name))
                }
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
                value={ this.props.selected.constituency }
                onChange={ this.props.handleConstituencyChange }
                disabled={ this.props.selected['constituency_type'] === this.props.defaultSelects['constituency_type'] }
              >
                <option value={ this.props.defaultSelects['constituency'] }>
                  所有選區
                </option>
                {
                  this.props.selectOptions
                    .filter(obj => obj.group === this.props.selected['constituency_type'])
                    .map(obj => this.createOption(obj.id, obj.name))
                }
              </Listbox>
            </div>
          </ExpanderPanel>
        </Expander>
        <Expander className="candidate-filter__expander">
          <ExpanderHeader>
            <ExpanderButton>個人資料</ExpanderButton>
            <ExpanderLabel className={ countOfSelectedPersonalInfoFilters === 0 ? 'visually-hidden' : undefined }>
              { '已選擇：' + countOfSelectedPersonalInfoFilters + '項' }
            </ExpanderLabel>
          </ExpanderHeader>
          <ExpanderPanel>
            <fieldset className="legco-fieldset">
              <legend className="candidate-filter__label legco-label">政治立場</legend>
              <div className="candidate-filter__options legco-form-group">
                {
                  this.props.selectOptions
                    .filter(obj => obj.group === 'political_position')
                    .map(obj => this.createRadioSelect(obj, obj.group))
                }
              </div>
            </fieldset>
            <fieldset className="legco-fieldset">
              <legend className="candidate-filter__label legco-label">年齡</legend>
              <div className="candidate-filter__options legco-form-group">
                {
                  this.props.checkboxOptions
                    .filter(obj => obj.group === 'age')
                    .map(obj => this.createCheckbox(obj, obj.group))
                }
              </div>
            </fieldset>
            <fieldset className="legco-fieldset">
              <legend className="candidate-filter__label legco-label">其他</legend>
              <div className="candidate-filter__options legco-form-group">
                {
                  this.props.checkboxOptions
                    .filter(obj => obj.group === 'others')
                    .map(obj => this.createCheckbox(obj, obj.group))
                }
              </div>
            </fieldset>
          </ExpanderPanel>
        </Expander>
      </div>
    )
  }
}