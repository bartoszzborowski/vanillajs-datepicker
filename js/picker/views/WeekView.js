import {hasProperty, pushUnique} from '../../lib/utils.js';
import {today, dateValue, addDays, addWeeks, dayOfTheWeekOf, getWeek} from '../../lib/date.js';
import {formatDate} from '../../lib/date-format.js';
import {parseHTML, showElement, hideElement} from '../../lib/dom.js';
import weekTemplate from '../templates/weekTemplate.js';
import View from './View.js';

export default class WeekView extends View {
    constructor(picker) {
        super(picker, {
            id: 5,
            name: 'weeks',
            cellClass: 'week-list',
        });
    }

    init(options, onConstruction = true) {
        if (onConstruction) {
            const inner = parseHTML(weekTemplate).firstChild;
            this.dow = inner.firstChild;
            this.grid = inner.lastChild;
            this.element.appendChild(inner);
        }
        super.init(options);
    }

    setOptions(options) {
        let updateDOW;
        if (options.weekStart !== undefined) {
            this.weekStart = options.weekStart;
            this.weekEnd = options.weekEnd;
            updateDOW = true;
        }
        if (options.datesDisabled) {
            this.datesDisabled = options.datesDisabled;
        }
        if (options.daysOfWeekDisabled) {
            this.daysOfWeekDisabled = options.daysOfWeekDisabled;
            updateDOW = true;
        }
        if (options.locale) {
            const locale = this.locale = options.locale;
            this.dayNames = locale.daysMin;
            this.switchLabelFormat = locale.titleFormat;
            updateDOW = true;
        }

        // update days-of-week when locale, daysOfweekDisabled or weekStart is changed
        if (updateDOW) {
            Array.from(this.dow.children).forEach((el, index) => {
                const dow = (this.weekStart + index) % 7;
                el.textContent = this.dayNames[dow];
                el.className = this.daysOfWeekDisabled.includes(dow) ? 'dow disabled' : 'dow';
            });
        }
    }

    // Apply update on the focused date to view's settings
    updateFocus() {
        const viewDate = new Date(this.picker.viewDate);
        const viewYear = viewDate.getFullYear();
        const viewMonth = viewDate.getMonth();
        const firstOfMonth = dateValue(viewYear, viewMonth, 1);
        const start = dayOfTheWeekOf(firstOfMonth, this.weekStart, this.weekStart);
        this.first = firstOfMonth;
        this.last = dateValue(viewYear, viewMonth + 1, 0);
        this.start = start;
        this.focused = getWeek(viewDate);
        this.current = viewDate;
    }

    // Apply update on the selected dates to view's settings
    updateSelection() {
        const {dates} = this.picker.datepicker;
        this.selected = dates;
    }

    // Update the entire view UI
    render() {
        this.grid
            .querySelectorAll('.selected, .focused')
            .forEach((el) => {
                el.classList.remove('selected', 'focused');
            });
        // update today marker on ever render
        this.today = this.todayHighlight ? today() : undefined;
        // refresh disabled dates on every render in order to clear the ones added
        // by beforeShow hook at previous render
        this.disabled = [...this.datesDisabled];
        const switchLabel = formatDate(this.current, this.switchLabelFormat, this.locale);
        this.picker.setViewSwitchLabel(switchLabel);
        this.picker.setPrevBtnDisabled(this.first <= this.minDate);
        this.picker.setNextBtnDisabled(this.last >= this.maxDate);

        let tempIndex = 0;
        const startOfWeek = dayOfTheWeekOf(this.first, 1, 1);

        Array.from(this.grid.children).forEach((el, index) => {
            const weekDate = addWeeks(startOfWeek, index);
            el.dataset.date = weekDate.toString();

            if (getWeek(weekDate) === this.focused) {
                el.classList.add('focused');
            }

            if (this.selected.includes(weekDate)) {
                el.classList.add('selected');
            }

            Array.from(el.children).forEach((item, week) => {
                const classList = item.classList;
                const current = addDays(this.start, tempIndex);
                const date = new Date(current);
                const day = date.getDay();
                item.className = `datepicker-cell ${this.cellClass}`;
                item.dataset.date = current;
                item.textContent = date.getDate();

                if (current < this.first) {
                    classList.add('prev');
                } else if (current > this.last) {
                    classList.add('next');
                }
                tempIndex++
            })
        });
    }

    // Update the view UI by applying the changes of selected and focused items
    refresh() {
        const selected = this.selected || [];
        this.grid
            .querySelectorAll('.selected, .focused')
            .forEach((el) => {
                el.classList.remove('selected', 'focused');
            });

        Array.from(this.grid.children).forEach((el, index) => {
            const classList = el.classList;
            if (selected.includes(parseInt(el.dataset.date))) {
                classList.add('selected');
            }
            if (getWeek(el.dataset.date) === this.focused) {
                classList.add('focused');
            }
        });
    }

    // Update the view UI by applying the change of focused item
    refreshFocus() {
    }
}
