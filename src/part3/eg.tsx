import {Component, renderDom, createElement } from './index';

class MyButton extends Component {
    state = {
        num: 1,
        b: 'b'
    }
    onClick = () => {
        this.setState({
            num: this.state.num + 1
        })
    }

    render() {
        return (<div>
            <div className="red-color">
                欢迎：{this.props.name}
            </div>
            <div>num: {this.state.num + ''}</div>
            <div>b: {this.state.b}</div>
            <button onClick={this.onClick}>click</button>
        </div>)
        
    }
}

class MyComponent extends Component {
    
    state = {
        name: '何遇'
    }

    render() {
        return <MyButton name={this.state.name}/>
    }
}

renderDom(<MyComponent/>, document.getElementById('app'))