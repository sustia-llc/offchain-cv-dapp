export interface Proposal {
    proposal?: string,
    totalConviction?: number,
    triggered?: boolean,
    
    context?: string,
    title?: string,
    currency?: string,
    amount?: number,
    beneficiary?: string,
    description?: string,
    url?: string,

    allocation?: number,
    owner?: boolean,
}

// used in proposal.service.ts to specify type being returned by HttpClient
export interface ConvictionState {
    proposals: Proposal[];
}


// used in proposal.service.ts to specify type being returned by HttpClient
export interface UserConviction {
    proposals: String[];
    convictions: Proposal[];
}
