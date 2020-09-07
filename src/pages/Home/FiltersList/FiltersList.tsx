import React, { 
  ChangeEventHandler 
} from 'react';

import Checkbox, { CheckboxProps } from 'components/Checkbox/Checkbox';
import Radio, { RadioProps } from 'components/Radio/Radio';
import Listbox from 'components/Listbox/Listbox';

import {
  SelectType, 
  CheckboxId,
  FiltersListProps
} from 'constants/types';

import {
  selectedDefaults
} from 'constants/defaults';

import {
  partialSelectSet,
  checkboxSet
} from 'constants/filters';

import * as _ from 'constants/utilities';

import './FiltersList.scss';

export default class FiltersList extends React.Component<FiltersListProps> {
  /**
   * Returns a select option.
   * 
   * @param value Value of this option.
   * @param label Display text of this option.
   */
  createSelectOption = (value: string, label: string) => {
    return (
      <option key={ value } value={ value }>
        { label }
      </option>
    );
  }

  createCheckbox = (
    id: CheckboxId,
    label: string,
    checked: boolean,
    group?: string,
  ) => {
    const props: CheckboxProps = {
      id,
      label,
      checked,
      // Group checkboxes by category name, or their IDs when name is not given.
      name: group || id,
      size: 'small',
      onChange: () => {
        this.props.handleCheckboxChange(id)
      }
    };

    return (
      <Checkbox key={ id } {...props} />
    );
  }

  createRadioOption = (
    id: string,
    label: string, 
    checked: boolean,
    type: SelectType
  ) => {
    const props: RadioProps = {
      id,
      label,
      checked,
      size: 'small',
      name: type,
      onChange: () => {
        this.props.handleSelectChange(type, id)
      }
    };

    return (
      <Radio key={ id } {...props} />
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
    this.props.handleSelectChange('constituencyType', value);
  }

  /**
   * Handler for change events on the constituency select group. Updates
   * selected state to reflect the user's choice.
   * 
   * @param event Change event on the select group.
   */
  handleConstChange: ChangeEventHandler<HTMLSelectElement> = event => {
    const { value } = event.target;
    this.props.handleSelectChange('constituency', value);
  }

  render() {
    const {
      selected,
      checked,
      constituencies
    } = this.props;

    const constTypeMap = _.createConstituencyTypeMap(
      constituencies
    );
    const selectSet = _.getFullSelectSet(
      partialSelectSet,
      constituencies
    );

    const {
      constituency: allConsts,
      constituencyType: allConstTypes,
      camp: allCamps
    } = selectSet;

    const {
      constituency: defaultConstId,
      constituencyType: defaultConstTypeId
    } = selectedDefaults;

    const {
      constituency: constId,
      constituencyType: constTypeId
    } = selected;

    const checkboxGroup = checkboxSet
      .map(obj => {
        const {
          id,
          name
        } = obj;
        return this.createCheckbox(
          id,
          name,
          checked[id]
        );
      });

    const constTypeSelectGroup = allConstTypes
      .map(obj => this.createSelectOption(obj.id, obj.name));

    const constSelectGroup = allConsts
      .filter(obj => constTypeMap[obj.id] === constTypeId)
      .map(obj => this.createSelectOption(obj.id, obj.name));

    const campSelectGroup = allCamps
      .map(obj => {
        const {
          id,
          name
        } = obj;
        return this.createRadioOption(
          id,
          name,
          selected.camp === id,
          'camp'
        );
      });

    return (
      <div>
        <div className="filters-group">
          <label 
            className="filters-group__label legco-label" 
            htmlFor="constituencyType"
          >選區類別</label>
          <div className="filters-group__options">
            <Listbox 
              id="constituencyType"
              name="constituencyType"
              value={ constTypeId }
              onChange={ this.handleConstTypeChange }
            >
              <option value={ defaultConstTypeId }>
                所有選區類別
              </option>
              { constTypeSelectGroup }
            </Listbox>
          </div>
        </div>
        <div className="filters-group">
          <label 
            className="filters-group__label legco-label" 
            htmlFor="constituency_name"
          >選區</label>
          <div className="filters-group__options">
            <Listbox 
              id="constituency_name"
              name="constituency"
              value={ constId }
              onChange={ this.handleConstChange }
              disabled={ constTypeId === defaultConstTypeId }
            >
              <option value={ defaultConstId }>
                所有選區
              </option>
              { constSelectGroup }
            </Listbox>
          </div>
        </div>
        <div className="filters-group">
          <label className="filters-group__label legco-label">政治立場</label>
          <div className="filters-group__options legco-form-group">
            { campSelectGroup }
          </div>
        </div>
        <div className="filters-group">
          <label className="filters-group__label legco-label">個人資料</label>
          <div className="filters-group__options legco-form-group">
            { checkboxGroup }
          </div>
        </div>
      </div>
    )
  }
}