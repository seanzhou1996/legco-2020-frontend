import React from 'react';

import './SelectedFilters.scss';

export interface SelectedFiltersProps {
  selected: {
    [group: string]: string
  }
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
  updateCheckboxState: (id: string) => void,
  updateSelectState: (group: string, selected: string) => void
}

export default class SelectedFilters extends React.Component<SelectedFiltersProps> {
  /**
   * Handler for click events on checkbox tags. Checkboxes are unchecked
   * when the user clicks on their tags.
   * 
   * @param id Identifier of the filter.
   */
  handleCheckboxTagClick = (id: string) => {
    // Look for the matching checkbox option
    const checkboxOption = this.props.checkboxOptions
      .find(obj => obj.id === id);
    if (!checkboxOption) {
      throw Error(`Couldn't find checkbox with ID ${id}.`);
    }
    // Uncheck the option that is currently checked.
    this.props.updateCheckboxState(id);
  }

  /**
   * Handler for click events on select tags. The select group that the
   * select option belongs to resets to its initial value when the user
   * clicks on the tag.
   * 
   * @param id Identifier of the filter.
   */
  handleSelectTagClick = (id: string) => {
    const selectOption = this.props.selectOptions
      .find(obj => obj.id === id);
    if (!selectOption) {
      throw Error(`Couldn't find checkbox with ID ${id}.`);
    }
    const group = ['gc', 'fc'].includes(selectOption.group) 
      ? 'constituency' 
      : selectOption.group;
    const initialValue = this.props.defaultSelects[group];
    // Resets the select group to its initial value
    this.props.updateSelectState(group, initialValue);
  }

  /**
   * Returns a button that represents the checkbox with `id`. When the user
   * clicks on it, the checkbox is unchecked and the button disappears.
   * 
   * @param id Identifier of the checked option.
   */
  createCheckboxTag(id: string) {
    const filterOption = this.props.checkboxOptions
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
  createSelectTag(id: string) {
    const filterOption = this.props.selectOptions
      .find(obj => obj.id === id);
    if (!filterOption) {
      throw Error(`Couldn't find filter with id ${id}.`);
    }
    const clickHandler = () => {
      this.handleSelectTagClick(id);
    };
    return this.createFilterTag(
      clickHandler,
      id,
      filterOption.name
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
    // Create tags for all select options currently chosen, given that
    // they aren't the initial value of the select group they belong
    // to.
    const selectFilterTags = Object.entries(this.props.selected)
      .filter(arr => {
        const [group, id] = arr;
        return id !== this.props.defaultSelects[group];
      })
      .map(arr => {
        const id = arr[1];
        return this.createSelectTag(id);
      });

    // Create tags for all checkboxes currently checked
    const checkboxFilterTags = Object.entries(this.props.checked)
      .filter(arr => {
        const checked = arr[1];
        return checked;
      })
      .map(arr => {
        const id = arr[0];
        return this.createCheckboxTag(id);
      });

    // Labels for all filter groups. A label and a filter group match
    // using their indexes in the array.
    const labelsForFilterGroups = [
      '屬於',
      '同時是'
    ];

    const filterTagGroups = [
      selectFilterTags,
      checkboxFilterTags
    ]
    // Filter out empty groups so they don't generate any markup
    .filter(group => group.length > 0)
    // Map each group into a list of tags with a leading label
    .map((tags, index) => {
      return (
        <div key={ index } className="selected-filters__group">
          <span className="selected-filters__label">
            { labelsForFilterGroups[index] }
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