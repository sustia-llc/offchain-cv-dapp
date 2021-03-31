import { InjectionToken} from '@angular/core';
import CeramicClient from '@ceramicnetwork/http-client';
import { environment as env } from '../../../../environments/environment';

export const CeramicToken = new InjectionToken<CeramicClient>(
    'Ceramic',
    {
        providedIn: 'root',
        factory: () => new CeramicClient(env.ceramicApiHost)
    }
);
