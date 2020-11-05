import {Component, renderDom, createElement } from './index';

class Button extends Component {
    render() {
        return <div>button</div>
    }
}

class MyCom extends Component {
    render() {
        return <Button>ddd</Button>
    }
}

renderDom(<MyCom>123</MyCom>, document.getElementById('app'))