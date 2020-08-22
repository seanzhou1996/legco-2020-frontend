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
  CheckboxId
} from 'constants/types';

import {
  selectedDefaults
} from 'constants/defaults';

import * as _ from 'constants/utilities';

import './FiltersPanel.scss';

export default class FiltersPanel extends React.Component {
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
      <option key={ value } value={ value }>
        { label }
      </option>
    );
  }

  createCheckbox(
    option: { id: CheckboxId, name: string }, 
    checked: boolean,
    name?: string,
  ) {
    // Group checkboxes by category name, or their IDs when name is not given.
    const group = name || option.id;

    const props: CheckboxProps = {
      className: 'legco-checkbox--small',
      id: option.id,
      label: option.name,
      name: group,
      checked,
      onChange: () => { this.handleCheckboxChange(option.id) }
    };

    return (
      <Checkbox key={ option.id } {...props} />
    );
  }

  createRadioSelect(
    option: { id: string, name: string }, 
    checked: boolean,
    type: SelectType
  ) {
    const props: RadioProps = {
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
      <Radio key={ option.id } {...props} />
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
  handleCheckboxChange = (id: CheckboxId) => {
    this.context.updateCheckedState(id);
  }

  handleRadioSelectChange = (type: SelectType, id: string) => {
    this.context.updateSelectedState(type, id);
  }

  createDelimitedItem = (text: string, key?: number | string) => {
    return (
      <span key={ key } className="app-delimited__item">
        { text }
      </span>
    );
  }

  render() {
    const {
      selected,
      checked,
      constituencies
    } = this.context;

    const constituencyTypeMap = _.getConstituencyTypeMap(
      constituencies
    );
    const selectSet = _.getSelectSet(
      constituencies
    );
    const checkboxSet = _.getCheckboxSet();

    const {
      constituency: allConsts,
      constituency_type: allConstTypes,
      political_position: allPolitiPos
    } = selectSet;

    const {
      constituency: defaultConstId,
      constituency_type: defaultConstTypeId,
      political_position: defaultPolitiPosId
    } = selectedDefaults;

    const {
      constituency: constId,
      constituency_type: constTypeId,
      political_position: politiPosId
    } = selected;

    const currentConst = allConsts.find(obj => obj.id === constId);
    const currentConstType = allConstTypes.find(obj => obj.id === constTypeId);

    const ageCheckboxGroup = checkboxSet
      .filter(obj => obj.group === 'age')
      .map(obj => {
        return this.createCheckbox(
          obj, 
          checked[obj.id] || false,
          obj.group,
        )
      });

    const otherInfoCheckboxGroup = checkboxSet
      .filter(obj => obj.group === 'other_info')
      .map(obj => {
        return this.createCheckbox(
          obj, 
          checked[obj.id] || false,
          obj.group
        );
      });

    const constSelectGroup = allConsts
      .filter(obj => {
        return constituencyTypeMap[obj.id] === constTypeId;
      })
      .map(obj => {
        return this.createOption(
          obj.id,
          obj.name
        );
      });

    const politiPosSelectGroup = allPolitiPos
      .map(obj => {
        return this.createRadioSelect(
          obj,
          selected.political_position === obj.id,
          'political_position'
        )
      });

    const delimitedConstNames = [
      currentConstType,
      currentConst
    ]
    .filter(_.notUndefined)
    .map((obj, index) => {
      return this.createDelimitedItem(
        obj.name,
        index
      );
    });

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
              delimitedConstNames.length === 0 ? 
              'visually-hidden' : 
              undefined 
            }>
              已選擇：
              <span className="app-delimited">
                { delimitedConstNames }
              </span>
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