import React from 'react';
import classnames from 'classnames';

import {
  SelectType,
  CheckboxId,
  ActiveFiltersProps
} from 'constants/types';

import {
  selectedDefaults,
  checkedDefaults
} from 'constants/defaults';

import {
  partialSelectSet,
  checkboxSet
} from 'constants/filters';

import * as _ from 'constants/utilities';

import './ActiveFilters.scss';

export default class ActiveFilters extends React.Component<ActiveFiltersProps> {

  /**
   * Handler for click events on checkbox tags. Checkboxes are unchecked
   * when the user clicks on their tags.
   * 
   * @param id Identifier of the filter.
   */
  handleCheckboxTagClick = (id: CheckboxId) => {
    this.props.handleCheckboxChange(id);
  }

  /**
   * Handler for click events on select tags. The select group that the
   * select option belongs to resets to its initial value when the user
   * clicks on the tag.
   * 
   * @param type Identifier of the filter.
   */
  handleSelectTagClick = (type: SelectType) => {
    const initialValue = selectedDefaults[type];
    // Resets the select group to its initial value
    this.props.handleSelectChange(type, initialValue);
  }

  /**
   * 
   * @param handleClick Handler for click events on the tag.
   * @param id Identifier of the current option.
   * @param name Label of the current option.
   */
  createFilterTag(
    handleClick: React.MouseEventHandler<HTMLButtonElement>,
    name: string,
    key?: string
  ) {
    return (
      <div key={ key } className="filter-tag">
        <button 
          className="filter-tag__button" 
          type="button"
          onClick={ handleClick }
        >
          <span className="filter-tag__cross-sign">✕</span>
          { name }
        </button>
      </div>
    );
  }

  render() {
    const {
      selected,
      checked,
      constituencies
    } = this.props;

    const selectSet = _.getFullSelectSet(
      partialSelectSet,
      constituencies
    );

    // Create tags for all select options currently chosen, given that
    // they aren't the initial value of the select group they belong
    // to.
    const constituencyTags = Object.keys(selected)
      .filter(_.isSelectType)
      .filter(type => {
        if (type === 'camp') return false;

        const selectedId = selected[type];
        return selectedId !== selectedDefaults[type];
      })
      .map(type => {
        const selectedId = selected[type];
        const selectOption = selectSet[type].find(opt => opt.id === selectedId);
        if (!selectOption) {
          throw Error(`Couldn't find select option with ID ${selectedId}.`);
        }
        return this.createFilterTag(
          () => { this.handleSelectTagClick(type) }, 
          selectOption.name, 
          selectedId
        );
      });

    // Create tags for all checkboxes currently checked
    const personalInfoTags = Object.keys(checked)
      .filter(_.isCheckboxId)
      .filter(id => {
        return checked[id] !== checkedDefaults[id];
      })
      .map(id => {
        const checkboxOption = checkboxSet.find(obj => obj.id === id);
        if (!checkboxOption) {
          throw Error(`Couldn't find checkbox with ID ${id}.`);
        }
        return this.createFilterTag(
          () => { this.handleCheckboxTagClick(id); },
          checkboxOption.name,
          id
        );
      });
    
    let campTag: JSX.Element | null;

    if (selected.camp === selectedDefaults.camp) {
      campTag = null;
    } else {
      const selectedID = selected.camp;
      const selectedOption = selectSet.camp.find(opt => opt.id === selectedID);
      if (!selectedOption) {
        throw Error(`Couldn't find select option with ID ${selectedID}`);
      }
      campTag = this.createFilterTag(
        () => { this.handleSelectTagClick('camp') },
        selectedOption.name,
        selectedID
      );
    }

    // [1] Filter out empty groups so they don't generate any markup
    // [2] Map each group to a list of tags with a leading label
    const filterTagGroups = [
      {
        tags: constituencyTags,
        label: '所屬選區'
      },
      {
        tags: campTag ? [campTag] : [],
        label: '政治立場'
      },
      {
        tags: personalInfoTags,
        label: '個人資料'
      }
    ]
    .filter(obj => obj.tags.length > 0) // [1]
    .map((obj, index) => { // [2]
      const { tags, label } = obj;
      return (
        <div key={ index } className="selected-filters__group">
          <span className="selected-filters__label">
            { label }
          </span>
          { tags }
        </div>
      );
    });

    const activeFiltersClass = classnames(
      'selected-filters',
      filterTagGroups.length > 0 ? 'selected-filters--active' : null
    )

    return (
      <div className={ activeFiltersClass }>
        { filterTagGroups }
      </div>
    );
  }
}