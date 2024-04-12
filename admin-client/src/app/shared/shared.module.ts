import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListedChipComponent } from './listed-chip.component';
import { UnlistedChipComponent } from './unlisted-chip.component';

@NgModule({
  declarations: [ListedChipComponent, UnlistedChipComponent],
  imports: [CommonModule],
  exports: [ListedChipComponent, UnlistedChipComponent],
})
export class SharedModule {}
