import { Component } from '@angular/core';

@Component({
  selector: 'app-unlisted-chip',
  template: `
    <div
      class="relative grid w-20 text-center  items-center whitespace-nowrap bg-red-500/25 border-red-800 rounded-full border py-1.5 px-3 font-sans text-xs text-gray-700"
    >
      <span>unlisted</span>
    </div>
  `,
})
export class UnlistedChipComponent {}
