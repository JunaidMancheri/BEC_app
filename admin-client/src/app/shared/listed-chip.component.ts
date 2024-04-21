import { Component } from '@angular/core';

@Component({
  selector: 'app-listed-chip',
  template: `
  <div class="flex gap-1 items-center">
  <div
      class=" bg-green-600  h-2 w-2 rounded-full  mat-elevation-z3"
    >
  </div>
  <span class="text-green-600">Listed</span>

  </div>
  `,
})
export class ListedChipComponent {}
