import { createAction, props } from '@ngrx/store';
import { SnackBar } from './snack-bar';

export const open = createAction('[SnackBar] Open', props<{ payload: SnackBar }>());
