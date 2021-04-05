import { InjectionToken} from '@angular/core';
import Ceramic from '@ceramicnetwork/http-client';
import { environment as env } from '../../../../environments/environment';

export const CeramicToken = new InjectionToken<Ceramic>(
    'Ceramic',
    {
        providedIn: 'root',
        factory: () => new Ceramic(env.ceramicApiHost)
    }
);
