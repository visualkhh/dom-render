import {RouteData} from 'dom-render/routers/Router';
import {OnCreateRender} from 'dom-render/lifecycle/OnCreateRender';
import {CreatorMetaData} from 'dom-render/rawsets/CreatorMetaData';

export class Detail implements OnCreateRender {
    name = 'Detail';

    onCreateRender(data: CreatorMetaData) {
        console.log('routeData->', data);
    }

    routerData(routeData: RouteData) {
        console.log('--------', routeData);
    }
}