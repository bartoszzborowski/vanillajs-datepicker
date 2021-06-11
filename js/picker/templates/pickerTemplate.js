import {optimizeTemplateHTML} from '../../lib/utils.js';

const pickerTemplate = optimizeTemplateHTML(`<div class="v-datepicker">
  <div class="v-datepicker-picker">
    <div class="v-datepicker-header">
      <div class="v-datepicker-title"></div>
      <div class="v-datepicker-controls">
        <button type="button" class="%buttonClass% prev-btn"></button>
        <button type="button" class="%buttonClass% view-switch"></button>
        <button type="button" class="%buttonClass% next-btn"></button>
      </div>
    </div>
    <div class="v-datepicker-main"></div>
    <div class="v-datepicker-footer">
      <div class="v-datepicker-controls">
        <button type="button" class="%buttonClass% today-btn"></button>
        <button type="button" class="%buttonClass% clear-btn"></button>
      </div>
    </div>
  </div>
</div>`);

export default pickerTemplate;
