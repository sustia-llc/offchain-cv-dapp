import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthActions, AuthSelectors, SnackBarActions, ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { AuthState } from '../../../core/auth/auth-state';

import * as ProposalSelectors from '../proposal.selectors'
import * as ProposalActions from '../proposal.actions'
import { Proposal } from '../proposal';

import { ProposalFilter, ProposalAppState } from '../proposals-state';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppearanceColor, SnackBar } from 'src/app/core/snack-bar/snack-bar';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.scss']
})
export class ProposalsComponent implements OnInit {
  auth$: Observable<AuthState>;
  proposals$: Observable<Proposal[]>;
  filter$: Observable<ProposalFilter>;
  newProposal = '';

  displayedColumns: string[] = ['title', 'amount', 'allocation', 'totalConviction', 'triggered', 'owner'];
  currencies = ['DAI'];

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  
  numberRegEx = /\-?\d*\.?\d{1,2}/;
  ethAddressRegEx = '^0x[0-9a-fA-F]{40}$';
  urlRegEx = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';  

  form = this.fb.group({
    title: ['', [Validators.required]],
    currency: ['DAI', [Validators.required]],
    amount: [0, 
      [
        Validators.required,
        Validators.pattern(this.numberRegEx),
        Validators.min(Math.pow(10,(-18)))]],
    beneficiary: ['', [Validators.required, Validators.pattern(this.ethAddressRegEx)]],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]
    ],
    url: ['', [Validators.required, Validators.pattern(this.urlRegEx)]],
  });

  proposalValueChanges$: Observable<Proposal>;

  constructor(
    private fb: FormBuilder,
    private store: Store<ProposalAppState>,
    public translateService: TranslateService) { }

  ngOnInit(): void {
    this.auth$ = this.store.pipe(select(AuthSelectors.auth));
    this.proposals$ = this.store.pipe(select(ProposalSelectors.getAllProposals));
  }

  onLoginClick() {
    this.store.dispatch(AuthActions.idxConnect());
  }

  save() {
    const { fileArg, ...model } = this.form.value;
    const proposal : Proposal = {
      title: model.title,
      currency: model.currency,
      amount: parseFloat(model.amount),
      beneficiary: model.beneficiary,
      description: model.description,
      url: model.url,
    };

    this.form.reset({ title: '', amount: 0, beneficiary: '', description: '', url: '', currency: 'DAI' });
    this.store.dispatch(ProposalActions.proposalAdd({ proposal: proposal }));
  }

  submit() {
    if (this.form.valid) {
      this.save();
    }
  }

  updateMemberAllocations(data) {
    let proposals = [];

    const allFloats = (obj) => Object.values(data).reduce((areNumbers: boolean, value) => areNumbers && !isNaN(parseFloat(value.toString())), true);

    if (!allFloats(proposals)) {
      const msg: SnackBar = {
        message: "All allocations must be floats",
        panelClass: AppearanceColor.Warn
      };
      this.store.dispatch(SnackBarActions.open({ payload: msg }));
      return;
    }

    const sumValues = (obj) => Object.values(data).reduce((acc: number, value) => acc + parseFloat(value.toString()), 0);

    if (sumValues(proposals) > 1.0) {
      const msg: SnackBar = {
        message: "Allocations must total 1.0 or less",
        panelClass: AppearanceColor.Warn
      };
      this.store.dispatch(SnackBarActions.open({ payload: msg }));
      return;
    }

    for (const [proposalkey, allocation] of Object.entries(data)) {
      const proposal : Proposal = {
        proposal: proposalkey,
        allocation: parseFloat(allocation.toString())
      };
      proposals.push(proposal);
    }

    console.log("update Allocations with" + JSON.stringify(proposals));

    this.store.dispatch(ProposalActions.updateUserCVAllocation( { proposals }));
  }

}
