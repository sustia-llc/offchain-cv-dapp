import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ConvictionState, Proposal, UserConviction } from './proposal';

import type { CeramicApi } from '@ceramicnetwork/common'
import { CeramicToken, IDXWrapper, IdxWrapperToken }  from 'src/app/core/auth/tokens';
import DocID from '@ceramicnetwork/docid';

import { schemas, config } from '../../../config.json'
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {

  constructor(
    @Inject(CeramicToken) private ceramic: CeramicApi,
    @Inject(IdxWrapperToken) private idxWrapper: IDXWrapper,
    private httpClient: HttpClient) { }

  public createProposal(proposal: Proposal): Observable<Proposal> {
    return from(this.ceramic.createDocument('tile', {
      content: {
        "context": config.context,
        "title": proposal.title,
        "currency": proposal.currency,
        "amount": proposal.amount,
        "beneficiary": proposal.beneficiary,
        "description": proposal.description,
        "url": proposal.url
      },
      metadata: {
        controllers: [this.idxWrapper.value.id],
        schema: schemas.Proposal,
        family: config.family},
    })).pipe(
      map((response) => {
        return {
          proposal: "ceramic://" + response.id.toString(),
          context: response.content.context,
          title: response.content.title,
          currency: response.content.currency,
          amount: response.content.amount,
          beneficiary: response.content.beneficiary,
          description: response.content.description,
          url: response.content.url,
          totalConviction: null,
          triggered: null,
          allocation: 0,
          owner: true,
        }
      })
    );
  }

  public getConvictionStateDoc(): Observable<Proposal[]> {
    return from(this.ceramic.loadDocument(config.convictionStateDocID)).pipe(
      map(data => data.content.proposals)
    );
  }

  public getProposal(proposalDocID): Observable<Proposal> {
    return from(this.ceramic.loadDocument(proposalDocID)).pipe(
      map(data => data.content)
    );    
  }

  public getUserConviction(): Observable<UserConviction> {
    return from(this.idxWrapper.value.get(config.IDXdefinitionName, this.idxWrapper.value.id)).pipe(
      tap((response) => console.log(response)),
      map((response) => response as UserConviction)
    );
  }

  public setUserConviction(proposals : Proposal[]): Observable<Proposal[]> {
    //create JSON doc
    const userConviction = {
      "context": config.context,
      "proposals": [],
      "convictions": []
    }

    for (const proposal of proposals) {
      if (proposal.owner) {
        userConviction.proposals.push(proposal.proposal);
      }
      const conviction = {
        "proposal": proposal.proposal,
        "allocation": proposal.allocation
      }
      userConviction.convictions.push(conviction);
    }

    console.log(JSON.stringify(userConviction));

    return from(this.idxWrapper.value.set(config.IDXdefinitionName, userConviction )).pipe(
      tap((response) => console.log("convictions document was set" + response)),
      map(() => proposals)
    );
  }

  
}
