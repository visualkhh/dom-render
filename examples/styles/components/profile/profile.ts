import { OnInitRender } from 'dom-render/lifecycle/OnInitRender';
import { RandomUtils } from 'dom-render/utils/random/RandomUtils';

export class Profile implements OnInitRender {
  name = 'red'
  bgcolor = RandomUtils.getRandomColor();
  color = RandomUtils.getRandomColor();
  id = RandomUtils.random();

  onInitRender(data?: any): void {
    console.log('---221s----', data, this)
  }

  change() {
    this.color = RandomUtils.getRandomColor();
    this.bgcolor = RandomUtils.getRandomColor();
    this.id = RandomUtils.random();
    console.log('-->', this.id);
  }
}