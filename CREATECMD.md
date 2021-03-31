# Steps to create
Adapted from:
https://blog.ceramic.network/how-to-build-a-simple-notes-app-with-idx/

# Install NPM, Create Angular Project with ngrx, material, flex-layout

create angular project:
```
ng new offchain-cv-dapp
  NO stricter type checking angularCompilerOptions
  angular routing
  SCSS
```
```
cd offchain-cv-dapp
```
add ngrx:
```
npm i -—save @ngrx/store@latest @ngrx/effects@latest @ngrx/store-devtools@latest @ngrx/router-store@latest @ngrx/entity@latest
```
add layout:
```
ng add @angular/material
ng add @fortawesome/angular-fontawesome
npm i @fortawesome/free-brands-svg-icons
npm i browser-detect
npm i @ngx-translate/core @ngx-translate/http-loader
npm i bootstrap
```

add error handling:
```
npm i serialize-error
```

```
npm i --save-dev @types/node
```

add custom webpack for crypto
```
npm i @angular-builders/custom-webpack
```

# Ceramic imports require
add to tsconfig.json compilerOptions:
```
"resolveJsonModule": true,
"skipLibCheck": true,
```

add custom webpack to angular.json

## Install Ceramic Studio Tools
```
npm i @ceramicnetwork/cli @ceramicstudio/idx-cli
npm i @ceramicnetwork/http-client @ceramicstudio/idx @ceramicstudio/idx-tools 3id-connect@next dids
npm i authereum fortmatic web3modal @walletconnect/web3-provider
npm i @walletconnect/3id-provider
```

add to package.json, scripts:
```
"bootstrap": "node ./bootstrap.js",
"ceramic": "ceramic daemon",
```

## Run Local Ceramic node
open terminal and run:
```
npm run ceramic
```

## Core module
```
ng g module core
ng g component app
```

## Snack Bar
```
ng g @ngrx/schematics:action core/snack-bar/snack-bar
ng g @ngrx/schematics:reducer core/snack-bar/snack-bar
ng g @ngrx/schematics:effect core/snack-bar/snack-bar -m core/core.module.ts
ng g interface core/snack-bar/snack-bar
ng g service core/snack-bar/snack-bar
ng g component core/snack-bar/my-snack-bar
```

## Spinner
```
ng g @ngrx/schematics:action core/spinner/spinner
ng g @ngrx/schematics:reducer core/spinner/spinner
ng g @ngrx/schematics:selector core/spinner/spinner
ng g @ngrx/schematics:effect core/spinner/spinner -m core/core.module.ts
ng g interface core/spinner/spinner-state
ng g service core/spinner/spinner-overlay
```

## Root store setup
```
npm i -—save @ngrx/schematics@latest --legacy-peer-deps
npm i -—save @ngrx/router-store@latest --legacy-peer-deps
npm i -—save @ngrx/data@latest --legacy-peer-deps
ng g @ngrx/schematics:store State --root --module core/core.module.ts
```

above creates reducers/index.ts move to core.state.ts

```
ng config cli.defaultCollection @ngrx/schematics
```

## Settings
```
ng g @ngrx/schematics:action core/settings/settings
ng g @ngrx/schematics:reducer core/settings/settings
ng g @ngrx/schematics:selector core/settings/settings
ng g @ngrx/schematics:effect core/settings/settings -m core/core.module.ts
ng g interface core/settings/settings-state
```

## Auth
```
ng g @ngrx/schematics:action core/auth/auth
ng g @ngrx/schematics:reducer core/auth/auth
ng g @ngrx/schematics:selector core/auth/auth
ng g @ngrx/schematics:effect core/auth/auth -m core/core.module.ts
ng g interface core/auth/auth-state
ng g service core/auth/auth-guard
ng g service core/auth/idx-provider
```

## Meta Reducers
```
ng g @ngrx/schematics:reducer core/meta-reducers/init-state-from-local-storage
ng g @ngrx/schematics:reducer core/meta-reducers/debug
ng g service core/local-storage/local-storage
```

## Router
```
ng g interface core/router/router-state
```

## Title
```
ng g service core/title/title
```

## Error Handling
```
ng g interceptor core/http-interceptors/http-error
ng g service core/error-handler/app-error-handler
ng g @ngrx/schematics:action core/error-handler/error
ng g @ngrx/schematics:reducer core/error-handler/error
ng g @ngrx/schematics:effect core/error-handler/error -m core/core.module.ts
ng g service core/notifications/notification
```

## Animations
```
ng g service core/animations/animations
```

## Shared
```
ng g module shared
ng g component shared/big-input/big-input
ng g component shared/big-input/big-input-action
ng g directive shared/rtl-support/rtl-support
```

## Features - About
```
ng g module features/about
ng g component features/about/about
```

## Features - Proposals
```
ng g module features/proposals
ng g component features/proposals/proposals
ng g @ngrx/schematics:action features/proposals/proposal
ng g @ngrx/schematics:reducer features/proposals/proposal
ng g @ngrx/schematics:selector features/proposals/proposal
ng g @ngrx/schematics:effect features/proposals/proposal -m features/proposals/proposals.module.ts
ng g interface features/proposals/Proposal
ng g interface features/proposals/proposals-state
ng g service features/proposals/proposal
```

## Features - Settings
```
ng g module features/settings
ng g component features/settings/settings-container
```


************************TODO********************

ng g @angular/material:nav core/components/nav
ng g @angular/material:dashboard core/components/home
ng generate component core/containers/NotFoundPage


## Bootstrap local node with IDX documents
open second terminal and run
```
idx bootstrap
```

## Create Ceramic schema and definition
create bootstrap.js document on root

run:
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
run:
```
SEED=<your seed from above> npm run bootstrap
```

creates config.json with globally unique schemas and definition DocIDs and can be shared with other apps

run:
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

FIXME Local User Seed: f80aded2939e3943e89f386345d044085bb98009b3915d36e48affe5b4daf2e8

```
idx did:create --label=local --seed=<seed from above>
```

returns:
did:key:z6MkoU3XveeHLQ1jLzZorHFjRFeEzG47hzzcMavycbtwxo2G

from config.json get the schema URL

```
idx tile:create local '{"title":"My task title"}' --schema=ceramic://k3y52l7qbv1frxyrxtjpyg1lw0br7hp1boy3e2oqxe5xl88ukpfyrimqz4w5aue4g
```

returns:
DocID: kjzl6cwe1jw14axqvirxii39agxjwt0n5tga3ntoivqgvg77xhkubvx0my6h3i7


from config.json get "definitions"/"tasks"
kjzl6cwe1jw149bvnp5g1m21zc0zoeca28pohircfeutcrkozbeeu69vx4yx33u

```
idx index:set local kjzl6cwe1jw149bvnp5g1m21zc0zoeca28pohircfeutcrkozbeeu69vx4yx33u '{"tasks":[{"id":"ceramic://kjzl6cwe1jw14axqvirxii39agxjwt0n5tga3ntoivqgvg77xhkubvx0my6h3i7","title":"First"}]}'
```

```
idx index:set local kjzl6cwe1jw1486y8ahz88noyg8vmra4erhraskiv117b08lgu28ql4epvlg46l '{
    "tasks": [
        {
            "id": "ceramic://kjzl6cwe1jw146lwcdn6y31t3vg4n7nk17mdf0ziwc08s8ew9t5sva2hg20rs79",
            "title": "First"
        },
        {
            "id": "ceramic://kjzl6cwe1jw148u1veneb9tvgvoembezgin32ncw44ajgd7ockpjex4of56qlyn",
            "title": "Second"
        }
    ]
}'
```


## Check task and task lists can be created
put definition key into next call:
```
idx index:get local kjzl6cwe1jw1486y8ahz88noyg8vmra4erhraskiv117b08lgu28ql4epvlg46l
```

get tasks by DocID:
```
idx tile:get ceramic://kjzl6cwe1jw146lwcdn6y31t3vg4n7nk17mdf0ziwc08s8ew9t5sva2hg20rs79
idx tile:get ceramic://kjzl6cwe1jw148u1veneb9tvgvoembezgin32ncw44ajgd7ockpjex4of56qlyn
```

## add idx and random
```
npm install @ceramicstudio/idx @stablelib/random
```

## Tasks module
```
ng g module tasks
ng g component tasks/containers/ListDisplay
ng g component tasks/components/List
ng g interface tasks/models/Task
ng g service tasks/services/Task
ng g @ngrx/schematics:action tasks/store/actions/task -group
ng g @ngrx/schematics:reducer tasks/store/reducers/task -group
ng g @ngrx/schematics:effect tasks/store/effects/task -m tasks/tasks.module.ts -group
```



modify core.module.ts to create COMPONENTS Array
```
  declarations: COMPONENTS,
  exports: COMPONENTS,
```

add core module to app.module.ts
```
import { CoreModule } from './core/core.module';
```

add RouterModule to core.module.ts:
```
import { RouterModule } from '@angular/router';
```

## Navigation

add to NavComponent in navcomponent.ts
```
menuItems = ['home', 'tasks'];
```

modify navcomponent.html
```
    <mat-nav-list>
      <a *ngFor="let item of menuItems" mat-list-item [routerLink]="'/'+item"> {{item | titlecase}} </a>
    </mat-nav-list>
```

remove everything from app.component.html and add this:
```
<app-nav></app-nav>
```

replace <--Add Content ...> in nav.component.html with:
```
<router-outlet></router-outlet>
```

## Add Home to Routing

modify app-routing.module.ts with
```
const routes: Routes = [
  {
    path: '',
    redirectTo: '/home', 
    pathMatch: 'full' 
  },
  {
    path: 'home',
    component: HomeComponent
  },  
  {
    path: 'tasks',
    loadChildren: () => import('./tasks/tasks.module').then(value => value.TasksModule),
    // FIXME: canLoad: [guards.IdxConnectGuard]
  },
];
```


