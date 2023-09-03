import {DomRender} from 'dom-render';
import {User} from './components/user/user';
import {Profile} from './components/profile/profile';
import ProfileTemplate from './components/profile/profile.html'
import ProfileStyle from './components/profile/profile.css'
import UserTemplate from './components/user/user.html'
import UserStyle from './components/user/user.css'
// const canvas = document.getElementById('canvas') as HTMLCanvasElement;
// const ctx = canvas.getContext('2d');

// const image = new Image(60, 45); // Using optional size for image
// image.onload = () => {
//     console.log('---')
//     // Use the intrinsic size of image in CSS pixels for the canvas element
//     canvas.width = image.naturalWidth;
//     canvas.height = image.naturalHeight;
//     if (ctx) {
//         ctx.drawImage(image, 0, 0);
//         // ctx.drawImage(image, 0, 0, image.width, image.height);
//     }
// }; // Draw when image has loaded

// Load an image of intrinsic size 300x227 in CSS pixels
// image.src = 'https://image1.coupangcdn.com/image/affiliate/banner/51467bdd3ca2b26c5d38a67357fc5716@2x.jpg';
// image.src = 'https://bnetcmsus-a.akamaihd.net/cms/blog_header/aj/AJF9K4O9F1IU1575917894058.jpg';
// image.src = 'https://thumbnail12.coupangcdn.com/thumbnails/remote/212x212ex/image/product/image/vendoritem/2018/11/12/3938771464/f637e89f-0725-4f32-898f-0be0d09980b7.jpg';

class Data {
    name = 'my name is dom-render';
    friends = [{name: 'a'}, {name: 'b'}, {name: 'c'}];
    sw = false;
    toggle() {
        this.sw = !this.sw;
    }
}
const data = DomRender.run(new Data(), document.querySelector('#app'), {
    targetElements: [
        DomRender.createComponent({type: Profile, template: ProfileTemplate, styles: ProfileStyle}),
        DomRender.createComponent({type: User, template: UserTemplate, styles: UserStyle})
    ]
});
setTimeout(() => {
    console.log('-->', data);
    data.friends[1].name = Date.now().toString();

    const c = document.querySelector('#c');
    c!.innerHTML = '<h1 class="text-3xl font-bold underline text-clifford p-[10vw]">222</h1>'
}, 10000);