import React, { 
  ChangeEventHandler 
} from 'react';

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

import FinderContext from 'components/CandidateFinder/context';

import {
  SelectType, 
  ConstituencyType
} from 'types';

import * as _ from 'utilities';

import './CandidateFilter.scss';

export default class CandidateFilter extends React.Component {
  static contextType = FinderContext;
  context!: React.ContextType<typeof FinderContext>;

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

    const context: CheckboxProps = {
      className: 'legco-checkbox--small',
      id: option.id,
      label: option.name,
      name: group,
      checked: this.context.checked?.[option.id] || false,
      onChange: () => { this.handleCheckboxChange(option.id) }
    };

    return (
      <Checkbox key={ option.id } {...context} />
    );
  }

  createRadioSelect(
    option: { id: string, name: string }, 
    type: SelectType
  ) {
    let checked = this.context.selected[type] === option.id;
    const context: RadioProps = {
      className: 'legco-radio--small',
      id: option.id,
      label: option.name,
      name: type,
      checked,
      onChange: () => { 
        this.handleRadioSelectChange(type, option.id)
      }
    };

    return (
      <Radio key={ option.id } {...context} />
    );
  }

  /**
   * Handler for change events on the constituency type select group. Updates
   * selected state to reflect the user's choice.
   * 
   * @param event Change event on the select group.
   */
  handleConstTypeChange: ChangeEventHandler<HTMLSelectElement> = event => {
    const { value } = event.target;
    this.context.updateSelectedState('constituency_type', value);
  }

  /**
   * Handler for change events on the constituency select group. Updates
   * selected state to reflect the user's choice.
   * 
   * @param event Change event on the select group.
   */
  handleConstChange: ChangeEventHandler<HTMLSelectElement> = event => {
    const { value } = event.target;
    this.context.updateSelectedState('constituency', value);
  }

  /**
   * Change event handler for checkbox `id`.
   * 
   * @param id Identifier of the checkbox.
   */
  handleCheckboxChange = (id: string) => {
    this.context.updateCheckedState(id);
  }

  handleRadioSelectChange = (type: SelectType, id: string) => {
    this.context.updateSelectedState(type, id);
  }

  render() {
    const {
      constituencies,
      selectSet,
      defaultSelects,
      selected,
      checkboxOptions,
      checked
    } = this.context;

    // Create a map from constituency IDs to constituency types
    const constTypeMap: {
      [constId: string]: ConstituencyType
    } = constituencies.reduce((previous, current) => {
      const accumulator = {
        ...previous,
        [current.id]: current.type
      }
      return accumulator;
    }, {});

    const {
      constituency: allConsts,
      constituency_type: allConstTypes,
      political_position: allPolitiPos
    } = selectSet;

    const {
      constituency: defaultConstId,
      constituency_type: defaultConstTypeId,
      political_position: defaultPolitiPosId
    } = defaultSelects;

    const {
      constituency: constId,
      constituency_type: constTypeId,
      political_position: politiPosId
    } = selected;

    const currentConst = allConsts.find(obj => obj.id === constId);
    const currentConstType = allConstTypes.find(obj => obj.id === constTypeId);

    const ageCheckboxGroup = checkboxOptions
      .filter(obj => obj.group === 'age')
      .map(obj => this.createCheckbox(obj, 'age'));

    const otherInfoCheckboxGroup = checkboxOptions
      .filter(obj => obj.group === 'other_info')
      .map(obj => this.createCheckbox(obj, 'other_info'));

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
    .filter(_.notUndefined)
    .map(obj => obj.name);

    let activeInfoFiltersCounter = Object.values(checked)
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
                onChange={ this.handleConstTypeChange }
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
                onChange={ this.handleConstChange }
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
                { ageCheckboxGroup }
              </div>
            </fieldset>
            <fieldset className="legco-fieldset">
              <legend className="candidate-filter__label legco-label">其他</legend>
              <div className="candidate-filter__options legco-form-group">
                { otherInfoCheckboxGroup }
              </div>
            </fieldset>
          </ExpanderPanel>
        </Expander>
      </div>
    )
  }
}