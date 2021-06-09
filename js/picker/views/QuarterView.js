import {hasProperty, pushUnique, createTagRepeat} from '../../lib/utils.js';
import {getQuarterFromDate, dateValue, dateQuarterValue} from '../../lib/date.js';
import {parseHTML} from '../../lib/dom.js';
import View from './View.js';
import de from "../../i18n/locales/de";

function computeMonthRange(range, thisYear) {
  if (!range || !range[0] || !range[1]) {
    return;
  }

  const [[startY, startM], [endY, endM]] = range;
  if (startY > thisYear || endY < thisYear) {
    return;
  }
  return [
    startY === thisYear ? startM : -1,
    endY === thisYear ? endM : 12,
  ];
}

export default class QuarterView extends View {
  constructor(picker) {
    super(picker, {
      id: 4,
      name: 'quarter',
      cellClass: 'quarter',
    });
  }

  init(options, onConstruction = true) {
    if (onConstruction) {
      this.grid = this.element;
      this.element.classList.add('quarter', 'datepicker-grid');
      this.grid.appendChild(parseHTML(createTagRepeat('span', 4, {'data-quarter': ix => ix})));
    }
    super.init(options);
  }

  setOptions(options) {
    if (options.locale) {
      this.quarters = options.locale.quarters;
    }
    if (hasProperty(options, 'minDate')) {
      if (options.minDate === undefined) {
        this.minYear = this.minMonth = this.minDate = undefined;
      } else {
        const minDateObj = new Date(options.minDate);
        this.minYear = minDateObj.getFullYear();
        this.minMonth = minDateObj.getMonth();
        this.minDate = minDateObj.setDate(1);
      }
    }
    if (hasProperty(options, 'maxDate')) {
      if (options.maxDate === undefined) {
        this.maxYear = this.maxMonth = this.maxDate = undefined;
      } else {
        const maxDateObj = new Date(options.maxDate);
        this.maxYear = maxDateObj.getFullYear();
        this.maxMonth = maxDateObj.getMonth();
        this.maxDate = dateValue(this.maxYear, this.maxMonth + 1, 0);
      }
    }
    if (options.beforeShowMonth !== undefined) {
      this.beforeShow = typeof options.beforeShowMonth === 'function'
          ? options.beforeShowMonth
          : undefined;
    }
  }

  // Update view's settings to reflect the viewDate set on the picker
  updateFocus() {
    const viewDate = new Date(this.picker.viewDate);
    this.year = viewDate.getFullYear();
    this.quarter = getQuarterFromDate(viewDate)
    this.focused = getQuarterFromDate(viewDate) - 1
  }

  // Update view's settings to reflect the selected dates
  updateSelection() {
    const {dates} = this.picker.datepicker;
    this.selected = dates.reduce((selected, timeValue) => {
      const date = new Date(timeValue);
      const year = date.getFullYear();
      const quarter = getQuarterFromDate(date);
      if (selected[year] === undefined) {
        selected[year] = [quarter - 1];
      } else {
        pushUnique(selected[year], quarter - 1);
      }
      return selected;
    }, {});

  }

  // Update the entire view UI
  render() {
    // refresh disabled months on every render in order to clear the ones added
    // by beforeShow hook at previous render
    this.disabled = [];
    this.picker.setViewSwitchLabel(this.year);
    this.picker.setPrevBtnDisabled(this.year <= this.minYear);
    this.picker.setNextBtnDisabled(this.year >= this.maxYear);

    const selected = this.selected[this.year] || [];
    const yrOutOfRange = this.year < this.minYear || this.year > this.maxYear;
    const isMinYear = this.year === this.minYear;
    const isMaxYear = this.year === this.maxYear;

    Array.from(this.grid.children).forEach((el, index) => {
      const classList = el.classList;
      const date = dateQuarterValue(this.year, index)

      el.className = `datepicker-cell ${this.cellClass}`;

      if (this.isMinView) {
        el.dataset.date = date;
      }

      // reset text on every render to clear the custom content set
      // by beforeShow hook at previous render
      el.textContent = this.quarters[index];

      if (
          yrOutOfRange
          || isMinYear && index < this.minMonth
          || isMaxYear && index > this.maxMonth
      ) {
        classList.add('disabled');
      }

      if (selected.includes(index)) {
        classList.add('selected');
      }
      if (index === this.focused) {
        classList.add('focused');
      }

      if (this.beforeShow) {
        this.performBeforeHook(el, index, date);
      }
    });
  }

  // Update the view UI by applying the changes of selected and focused items
  refresh() {
    const selected = this.selected[this.year] || [];
    this.grid
        .querySelectorAll('.selected, .focused')
        .forEach((el) => {
          el.classList.remove('selected', 'focused');
        });
    Array.from(this.grid.children).forEach((el, index) => {
      const classList = el.classList;
      if (selected.includes(index)) {
        classList.add('selected');
      }
      if (index === this.focused) {
        classList.add('focused');
      }
    });
  }

  // Update the view UI by applying the change of focused item
  refreshFocus() {
    this.grid.querySelectorAll('.focused').forEach((el) => {
      el.classList.remove('focused');
    });
    this.grid.children[this.focused].classList.add('focused');
  }
}