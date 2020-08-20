import React from 'react';

import FinderContext from 'components/CandidateFinder/context';

import {
  SelectType
} from 'models';

import * as _ from 'utilities';

import './SelectedFilters.scss';

export default class SelectedFilters extends React.Component {
  static contextType = FinderContext;
  context!: React.ContextType<typeof FinderContext>;

  /**
   * Handler for click events on checkbox tags. Checkboxes are unchecked
   * when the user clicks on their tags.
   * 
   * @param id Identifier of the filter.
   */
  handleCheckboxTagClick = (id: string) => {
    // Look for the matching checkbox option
    const checkboxOption = this.context.checkboxOptions
      .find(obj => obj.id === id);
    if (!checkboxOption) {
      throw Error(`Couldn't find checkbox with ID ${id}.`);
    }
    // Uncheck the option that is currently checked.
    this.context.updateCheckedState(id);
  }

  /**
   * Handler for click events on select tags. The select group that the
   * select option belongs to resets to its initial value when the user
   * clicks on the tag.
   * 
   * @param id Identifier of the filter.
   */
  handleSelectTagClick = (id: string, type: SelectType) => {
    const selectOption = this.context.selectSet[type]
      .find(obj => obj.id === id);
    if (!selectOption) {
      throw Error(`Couldn't find checkbox with ID ${id}.`);
    }
    const initialValue = this.context.defaultSelects[type];
    // Resets the select group to its initial value
    this.context.updateSelectedState(type, initialValue);
  }

  /**
   * Returns a button that represents the checkbox with `id`. When the user
   * clicks on it, the checkbox is unchecked and the button disappears.
   * 
   * @param id Identifier of the checked option.
   */
  createCheckboxTag(id: string) {
    const filterOption = this.context.checkboxOptions
      .find(obj => obj.id === id);
    if (!filterOption) {
      throw Error(`Couldn't find filter with id ${id}.`);
    }
    const handleClick = () => {
      this.handleCheckboxTagClick(id);
    };
    return this.createFilterTag(
      handleClick,
      id,
      filterOption.name
    );
  }

  /**
   * Returns a button that represents the select option with `id`. When the user
   * clicks on it, the select group that option belongs to resets to its default
   * value and the button disappears.
   * 
   * @param id Identifier of the selected option.
   */
  createSelectTag(id: string, type: SelectType) {
    const filter = this.context.selectSet[type]
      .find(obj => obj.id === id);
    if (!filter) {
      throw Error(`Couldn't find filter with id ${id}.`);
    }
    const clickHandler = () => {
      this.handleSelectTagClick(id, type);
    };
    return this.createFilterTag(
      clickHandler,
      id,
      filter.name
    );
  }

  /**
   * 
   * @param handleClick Handler for click events on the tag.
   * @param id Identifier of the current option.
   * @param name Label of the current option.
   */
  createFilterTag(
    handleClick: React.MouseEventHandler<HTMLButtonElement>,
    id: string, 
    name: string
  ) {
    return (
      <div key={ id } className="filter-tag">
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
      defaultSelects,
      checked
    } = this.context;

    // Create tags for all select options currently chosen, given that
    // they aren't the initial value of the select group they belong
    // to.
    const selectFilterTags = Object.keys(selected)
      .filter(_.isSelectType)
      .filter(type => {
        const selectedId = selected[type];
        return selectedId !== defaultSelects[type];
      })
      .map(type => {
        const selectedId = selected[type];
        return this.createSelectTag(selectedId, type);
      });

    // Create tags for all checkboxes currently checked
    const checkboxFilterTags = Object.entries(checked)
      .filter(arr => {
        const checked = arr[1];
        return checked;
      })
      .map(arr => {
        const id = arr[0];
        return this.createCheckboxTag(id);
      });

    // [1] Filter out empty groups so they don't generate any markup
    // [2] Map each group to a list of tags with a leading label
    const filterTagGroups = [
      { tags: selectFilterTags, label: '屬於' },
      { tags: checkboxFilterTags, label: '同時是' }
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

    return (
      <div className="selected-filters">
        { filterTagGroups }
      </div>
    );
  }
}