import {DomRender} from 'dom-render/DomRender';
import {ScriptUtils} from 'dom-render/utils/script/ScriptUtils';
import {Shield} from 'dom-render/Shield';
import {RawSet} from 'dom-render/RawSet';
import {DomRenderProxy} from 'dom-render/DomRenderProxy';

declare const naver: any;

class User {
    name: string;
    age: number;
    gender: string;
    friends: User[];
    birth = new Date();
    office = {
        name: 'guro',
        addr: {
            first: 'guro',
            last: ' digital',
            street: ' complex'
        }
    };

    shield: any = new Shield();

    // map?: any = {};

    constructor(name: string, age: number, gender: string, friends: User[] = []) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.friends = friends;
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
        var locationBtnHtml = '<a href="#" class="btn_mylct"><span class="spr_trff spr_ico_mylct">NAVER 그린팩토리</span></a>';
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
                        var infowindow = new naver.maps.InfoWindow();
                        var location = new naver.maps.LatLng(position.coords.latitude, position.coords.longitude);
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
        console.log('inputElement onInit', e.value)
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
}

const friends = [new User('friend1', 15, 'M'), new User('friend2', 16, 'F')]
const target = document.querySelector('#app');
if (target) {
    const user = DomRender.run(new User('parent', 10, 'M', friends), target,
        {
            scripts: {
                say: function(m: string, t: RawSet) {
                    console.log('------', this)
                    // new Promise((resolve, reject) => {
                    //     // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
                    //     // In this example, we use setTimeout(...) to simulate async code.
                    //     // In reality, you will probably be using something like XHR or an HTML5 API.
                    //     setTimeout(() => {
                    //         resolve(m);
                    //     }, 5000);
                    // }).then(it => {
                    //     t.childAllRemove();
                    //     console.log('--->', it)
                    // });
                    // console.log('---------sssau', m, t);
                    return true;
                }
            }
        }
    );
    // setTimeout(() => {
    //     ((user as any)._DomRender_proxy as DomRenderProxy<any>).render();
    //     // console.log((user as any)._DomRender_proxy)
    // }, 10000)
}
