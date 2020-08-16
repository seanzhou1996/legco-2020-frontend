import React from 'react';

import Checkbox, { 
  CheckboxProps 
} from 'components/Checkbox/Checkbox';
import Radio, { 
  RadioProps 
} from 'components/Radio/Radio';
import Expander from 'components/Expander/Expander';
import ExpanderHeader, { 
  ExpanderButton, 
  ExpanderLabel 
} from 'components/Expander/ExpanderHeader';
import ExpanderPanel from 'components/Expander/ExpanderPanel';
import Listbox from 'components/Listbox/Listbox';

import {
  Selected,
  SelectType,
  SelectSet,
  ConstituencyTypeMap
} from 'models';

import './CandidateFilter.scss';

export interface CandidateFilterProps {
  selected: Selected,
  checked: {
    [id: string]: boolean
  },
  selectSet: SelectSet,
  checkboxOptions: {
    id: string,
    name: string,
    group: string
  }[],
  defaultSelects: Selected,
  constituencyTypeMap: ConstituencyTypeMap,
  handleConstituencyTypeChange: React.ChangeEventHandler<HTMLSelectElement>,
  handleConstituencyChange: React.ChangeEventHandler<HTMLSelectElement>,
  handleCheckboxChange: (id: string) => void,
  handleRadioSelectChange: (type: SelectType, id: string) => void
}

export default class CandidateFilter extends React.Component<CandidateFilterProps> {
  notUndefined<T>(x: T | undefined): x is T {
    return x !== undefined;
  }
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
    type: SelectType
  ) {
    let checked = this.props.selected[type] === option.id;
    const props: RadioProps = {
      className: 'legco-radio--small',
      id: option.id,
      label: option.name,
      name: type,
      checked,
      onChange: () => { 
        this.props.handleRadioSelectChange(type, option.id)
      }
    };

    return (
      <Radio key={ option.id } {...props} />
    );
  }

  render() {
    const constTypeMap = this.props.constituencyTypeMap;

    const {
      constituency: allConsts,
      constituency_type: allConstTypes,
      political_position: allPolitiPos
    } = this.props.selectSet;

    const {
      constituency: defaultConstId,
      constituency_type: defaultConstTypeId,
      political_position: defaultPolitiPosId
    } = this.props.defaultSelects;

    const {
      constituency: constId,
      constituency_type: constTypeId,
      political_position: politiPosId
    } = this.props.selected;

    const currentConst = allConsts.find(obj => obj.id === constId);
    const currentConstType = allConstTypes.find(obj => obj.id === constTypeId);
    // const currentPolitiPos = allPolitiPos.find(obj => obj.id === politiPosId);

    const constSelectGroup = allConsts
      .filter(obj => {
        return constTypeMap[obj.id] === constTypeId;
      })
      .map(obj => {
        return this.createOption(
          obj.id,
          obj.name
        );
      });

    const politiPosSelectGroup = allPolitiPos
      .map(obj => this.createRadioSelect(obj, 'political_position'));

    const constSelects = [
      currentConstType,
      currentConst
    ]
    .filter(this.notUndefined)
    .map(obj => obj.name);

    let activeInfoFiltersCounter = Object.values(this.props.checked)
      .filter(checked => checked).length;

    if (
      politiPosId !== defaultPolitiPosId
    ) {
      activeInfoFiltersCounter++;
    }

    return (
      <div className="candidate-filter">
        <Expander className="candidate-filter__expander">
          <ExpanderHeader>
            <ExpanderButton>所在選區</ExpanderButton>
            <ExpanderLabel className={ 
              constSelects.length === 0 ? 
              'visually-hidden' : 
              undefined 
            }>
              已選擇：{ constSelects.join('，') }
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
                value={ constTypeId }
                onChange={ this.props.handleConstituencyTypeChange }
              >
                <option value={ defaultConstTypeId }>
                  所有選區類別
                </option>
                { 
                  allConstTypes
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
                value={ constId }
                onChange={ this.props.handleConstituencyChange }
                disabled={ constTypeId === defaultConstTypeId }>
                <option value={ defaultConstId }>
                  所有選區
                </option>
                { constSelectGroup }
              </Listbox>
            </div>
          </ExpanderPanel>
        </Expander>
        <Expander className="candidate-filter__expander">
          <ExpanderHeader>
            <ExpanderButton>個人資料</ExpanderButton>
            <ExpanderLabel className={ 
              activeInfoFiltersCounter === 0 ? 
              'visually-hidden' : 
              undefined 
            }>
              已選擇：{ activeInfoFiltersCounter }項
            </ExpanderLabel>
          </ExpanderHeader>
          <ExpanderPanel>
            <fieldset className="legco-fieldset">
              <legend className="candidate-filter__label legco-label">政治立場</legend>
              <div className="candidate-filter__options legco-form-group">
                { politiPosSelectGroup }
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