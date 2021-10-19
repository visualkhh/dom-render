import {DomRender} from 'dom-render/DomRender';
import {ScriptUtils} from 'dom-render/utils/script/ScriptUtils';
import {Shield} from 'dom-render/types/Types';
import {RawSet} from 'dom-render/RawSet';
import {Profile} from './components/Profile';
import {Validator} from 'dom-render/validators/Validator';
import {NotEmptyValidator} from 'dom-render/validators/NotEmptyValidator';
import {RequiredValidator} from 'dom-render/validators/RequiredValidator';
import {EmptyValidator} from 'dom-render/validators/EmptyValidator';
import {RegExpTestValidator} from 'dom-render/validators/RegExpTestValidator';
import {MultipleValidator} from 'dom-render/validators/MultipleValidator';
import {ValidValidatorArray} from 'dom-render/validators/ValidValidatorArray';
import {FormValidator} from 'dom-render/validators/FormValidator';
import {AllCheckedValidatorArray} from 'dom-render/validators/AllCheckedValidatorArray';
import {AllUnCheckedValidatorArray} from 'dom-render/validators/AllUnCheckedValidatorArray';
import {CountCheckedValidatorArray} from 'dom-render/validators/CountCheckedValidatorArray';
import {IncludeCheckedValidatorArray} from 'dom-render/validators/IncludeCheckedValidatorArray';
import {ExcludeCheckedValidatorArray} from 'dom-render/validators/ExcludeCheckedValidatorArray';
import {ValueEqualsValidator} from 'dom-render/validators/ValueEqualsValidator';

declare const naver: any;

class PageValidator extends FormValidator {
    // required = new RequiredValidator();
    // notEmpty = new NotEmptyValidator();
    // empty = new EmptyValidator();
    // regexp = new RegExpTestValidator(/[0-9]/);
    // mix = new MultipleValidator([new RequiredValidator(), new NotEmptyValidator()]);

    all = new ExcludeCheckedValidatorArray(['a', 'c']);

    // gender = new ValidValidatorArray((v, t, e) => {
    //     return ((v ?? []).filter(it => it.checked).length > 0);
    // });
    equals = new ValueEqualsValidator('c');
}

class User {
    // public __domrender_components = {}
    name: string;
    age: number;
    gender: string;
    friends: User[];
    birth = new Date();
    form = new PageValidator();
    currentFriendName: string;
    office = {
        name: 'guro',
        addr: {
            first: 'guro',
            last: ' digital',
            street: ' complex',
            onBeforeReturnSet: (name: string, value: any, fullpath: string[]) => {
                console.log('set office addr name-->', name, value, fullpath);
            },
            onBeforeReturnGet: (name: string, value: any, fullpath: string[]) => {
                console.log('get office addr name-->', name, value, fullpath);
            }
        },
        onBeforeReturnSet: (name: string, value: any, fullpath: string[]) => {
            console.log('set office name-->', name, value, fullpath);
        },
        onBeforeReturnGet: (name: string, value: any, fullpath: string[]) => {
            console.log('get office name-->', name, value, fullpath);
        }
    };

    office2 = this.office;
    shield: any = new Shield();

    nullValue = null;
    inputElement?: HTMLInputElement;
    canvasElement?: HTMLCanvasElement;

    // map?: any = {};

    constructor(name: string, age: number, gender: string, friends: User[] = []) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.friends = friends;
        this.currentFriendName = this.friends[1]?.name ?? 'none';
    }

    public cangeCurrentFriendName() {
        this.currentFriendName = 'friend2';
    }

    async onInitRender() {
        return;
        // const tt = await ScriptUtils.loadStyleSheet('https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css', {integrity: 'sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU', crossorigin: 'anonymous'})
        // console.log('-->', tt)
        const data = await ScriptUtils.loadScript('https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=83bfuniegk&amp;submodules=panorama,geocoder,drawing,visualization')
        const mapElement = document.querySelector('#map');

        this.shield.map = (new naver.maps.Map(mapElement, {
            // zoom: 13, //지도의 초기 줌 레벨
            // minZoom: 7, //지도의 최소 줌 레벨
            useStyleMap: true,
            zoomControl: true, // 줌 컨트롤의 표시 여부
            mapTypeControl: true,
            zoomControlOptions: { // 줌 컨트롤의 옵션
                style: naver.maps.ZoomControlStyle.SMALL
                //     position: naver.maps.Position.CENTER_LEFT
            }
        }));
        const locationBtnHtml = '<a href="#" class="btn_mylct"><span class="spr_trff spr_ico_mylct">NAVER 그린팩토리</span></a>';
        naver.maps.Event.once(this.shield.map, 'init_stylemap', () => {
            // customControl 객체 이용하기
            const customControl = new naver.maps.CustomControl(locationBtnHtml, {
                position: naver.maps.Position.TOP_LEFT
            });
            const searchBtn = new naver.maps.CustomControl('<button class="btn btn-primary btn-search" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">Toggle bottom offcanvas</button>', {
                position: naver.maps.Position.LEFT_BOTTOM
            });

            customControl.setMap(this.shield.map);
            searchBtn.setMap(this.shield.map);

            const domEventListener = naver.maps.Event.addDOMListener(customControl.getElement(), 'click', () => {
                if (navigator.geolocation) {
                    /**
                     * navigator.geolocation 은 Chrome 50 버젼 이후로 HTTP 환경에서 사용이 Deprecate 되어 HTTPS 환경에서만 사용 가능 합니다.
                     * http://localhost 에서는 사용이 가능하며, 테스트 목적으로, Chrome 의 바로가기를 만들어서 아래와 같이 설정하면 접속은 가능합니다.
                     * chrome.exe --unsafely-treat-insecure-origin-as-secure="http://example.com"
                     */
                    navigator.geolocation.getCurrentPosition((position) => {
                        const infowindow = new naver.maps.InfoWindow();
                        const location = new naver.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        this.shield.map.setCenter(location); // 얻은 좌표를 지도의 중심으로 설정합니다.
                        this.shield.map.setZoom(18); // 지도의 줌 레벨을 변경합니다.
                        infowindow.setContent('<div style="padding:20px;">' + 'geolocation.getCurrentPosition() 위치' + '</div>');
                        infowindow.open(this.shield.map, location);
                        // console.log('Coordinates: ' + location.toString());
                    }, () => {
                    });
                }
                // map.setCenter(new naver.maps.LatLng(37.3595953, 127.1053971));
            });
        });
    }

    onInitElement(e: HTMLInputElement) {
        this.inputElement = e;
        this.inputElement.value = '100';
        // console.log('inputElement onInit', e.value)
    }

    onInitCanvasElement(e: HTMLCanvasElement) {
        this.canvasElement = e;
        console.log('---canvas->', this.canvasElement instanceof HTMLCanvasElement);
        const context = this.canvasElement.getContext('2d')!;
        context.fillRect(0, 0, 10, 10);
    }

    public e?: Profile.Component;

    onInitMyElement(e: Profile.Component) {
        this.e = e;
        console.log('onInitMyElement,  ', e, this.e)
        // setTimeout(() => {
        //     console.log('--->time', e);
        //     e.name = 'wow';
        // }, 5000)
    }

    changeIdMyElement() {
        console.log('clicked-->', this, this.e)
        if (this.e) {
            this.e.name = 'zzzzzzzzzzzzz'
        }
    }

    getOfficeFullAddr() {
        return `${this.office.addr.first}, ${this.office.addr.last}, ${this.office.addr.street} (${this.office.name})`
    }

    sayName() {
        console.log(this.name)
    }

    getName() {
        console.log('getNamegetNamegetNamegetName', 'getName');
        return (this.name)
    }

    // onBeforeReturnSet(name: string, value: any, fullpath: string[]) {
    //     console.log('set root name-->', name, value, fullpath);
    // }
    //
    // onBeforeReturnGet(name: string, value: any, fullpath: string[]) {
    //     console.log('get root name-->', name, value, fullpath);
    // }

    submit() {
        console.log('submit valid->', this.form.valid());
    }
}

const friends = [new User('friend1', 15, 'M'), new User('friend2', 16, 'F')]
const target = document.querySelector('#app');
if (target) {
    // customElement

    // setup
    const scripts = {
        say: function (m: string) {
            return '-->' + m;
            // const render = this.__render as Render;
            // // console.log('--scriptsscriptsscripts----', m, this.i18n, render)
            // if (!this.__i18n) {
            //     this.__i18n = {};
            // }
            // if (!this.__i18n?.[m]) {
            //     new Promise((resolve, reject) => {
            //         // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
            //         // In this example, we use setTimeout(...) to simulate async code.
            //         // In reality, you will probably be using something like XHR or an HTML5 API.
            //         setTimeout(() => {
            //             resolve(m);
            //         }, 5000);
            //     }).then(it => {
            //         // t.childAllRemove();
            //         this.__i18n[m] = 'nnnnnn';
            //         // console.log('-??????-->', this, it, render);
            //         (this._DomRender_proxy as DomRenderProxy<any>).render([render.rawset]);
            //     });
            // } else {
            //     // console.log('---------sssau', this, this.__i18n);
            //     return this.__i18n[m];
            // }
            // // console.log('---------sssau', m, t);
            // return m;
        }
    };
    const user = DomRender.run(new User('parent', 10, 'M', friends), target,
        {
            proxyExcludeOnBeforeReturnGets: [],
            proxyExcludeOnBeforeReturnSets: [],
            proxyExcludeTyps: [HTMLCanvasElement],
            targetElements: [
                RawSet.createComponentTargetElement('my-element', (e, o, r) => new Profile.Component(), Profile.templat, Profile.styles, scripts)
            ],
            scripts: scripts
        }
    );
    // setTimeout(() => {
    //     ((user as any)._DomRender_proxy as DomRenderProxy<any>).render();
    //     // console.log((user as any)._DomRender_proxy)
    // }, 10000)
    console.log('created-->', user)
}

//
//
// import {WebComponentUtils} from 'dom-render/utils/dom/WebComponentUtils';
// import {CustomElements} from 'dom-render/utils/dom/WebComponentUtils';
// class WOW implements CustomElements {
//     constructor() {
//         console.log('cr222222222222eate')
//     }
//
//     connectedCallback() {
//         (this as any).innerHTML = '<div id="wow">asd</div>'
//     }
//
//     get observedAttributes() {
//         return ['z', 'b']
//     }
//
//     attributeChangedCallback(name:string, oldValue: string, newValue: string) {
//         console.log(name, oldValue, newValue)
//     }
// }
// // const wow = new WOW();
// const myElement = WebComponentUtils.defineCustomElements({name: 'my-element', customElementClass: WOW })

// console.log('------->', myElement)
// console.log('------->', (myElement as any).observedAttributes)
// console.log('------->', myElement.prototype)
// window.customElements.define('my-element', MyApplication);
