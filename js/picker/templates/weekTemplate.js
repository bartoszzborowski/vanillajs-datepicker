import {createTagRepeat, optimizeTemplateHTML} from '../../lib/utils.js';

const weekTemplate = optimizeTemplateHTML(`<div class="days">
  <div class="days-of-week">${createTagRepeat('span', 7, {class: 'dow'})}</div>
  <div class="datepicker-grid">
    <div class="week-panel-row">${createTagRepeat('span', 7)}</div>
    <div class="week-panel-row">${createTagRepeat('span', 7)}</div>
    <div class="week-panel-row">${createTagRepeat('span', 7)}</div>
    <div class="week-panel-row">${createTagRepeat('span', 7)}</div>
    <div class="week-panel-row">${createTagRepeat('span', 7)}</div>
    <div class="week-panel-row">${createTagRepeat('span', 7)}</div>
  </div>
</div>`);

export default weekTemplate;
