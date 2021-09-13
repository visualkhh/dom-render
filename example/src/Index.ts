import {DomRender} from 'dom-render/DomRender';
import {ScriptUtils} from 'dom-render/utils/script/ScriptUtils';
declare var naver: any;
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
    }

    map?: any;

    constructor(name: string, age: number, gender: string, friends: User[] = []) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.friends = friends;
    }

    async onInitRender() {
        console.log('-->onInitRender');
        // <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
        // const tt = await ScriptUtils.loadElement('link', {href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css', ref: 'stylesheet', integrity: 'sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU', crossorigin: 'anonymous'})
        const tt = await ScriptUtils.loadStyleSheet('https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css', {integrity: 'sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU', crossorigin: 'anonymous'})
        console.log('-->', tt)
        const data = await ScriptUtils.loadScript('https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=83bfuniegk&amp;submodules=panorama,geocoder,drawing,visualization')
        const mapElement = document.querySelector('#map');

        this.map = Object.freeze(new naver.maps.Map(mapElement, {
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
}
const friends = [new User('friend1', 15, 'M'), new User('friend2', 16, 'F')]
const target = document.querySelector('#app');
if (target) {
    const user = DomRender.run(new User('parent', 10, 'M', friends), target);
}
