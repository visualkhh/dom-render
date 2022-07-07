import {Config} from '../configs/Config';

export interface OnProxyDomRender {
    onProxyDomRender(config: Config): void;
}
