import {RouteData} from 'dom-render/routers/Router';
import {OnCreateRender} from 'dom-render/lifecycle/OnCreateRender';

export class Detail implements OnCreateRender {
    name = 'Detail';

    onCreateRender(routeData: RouteData) {
        console.log('routeData->', routeData);
    }
}