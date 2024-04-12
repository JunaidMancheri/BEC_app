import { Component } from '@angular/core';

@Component({
  selector: 'app-listed-chip',
  template: `
    <div
      class="relative grid w-20 text-center  items-center whitespace-nowrap bg-green-500/25 border-green-800 rounded-full border py-1.5 px-3 font-sans text-xs text-gray-700"
    >
      <span>listed</span>
    </div>
  `,
})
export class ListedChipComponent {}
