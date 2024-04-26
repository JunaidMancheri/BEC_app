import { Component } from '@angular/core';

@Component({
  selector: 'app-unlisted-chip',
  template: `
  <div class="flex gap-1 items-center">
  <div
      class=" bg-red-600  h-2 w-2 rounded-full  mat-elevation-z3"
    >
  </div>
  <span class="text-gray-600 text-xs">Unlisted</span>

  </div>
  `,
})
export class UnlistedChipComponent {}
