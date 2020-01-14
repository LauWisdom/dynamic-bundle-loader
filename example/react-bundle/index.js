import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import LazyComponent from 'LazyLoader!./src/LazyComponent.js'
import LazyLoader from './src/lazyloader'


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowLazyLoader: false
        }

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        const {isShowLazyLoader} = this.state
        this.setState({
            isShowLazyLoader: !isShowLazyLoader
        })
    }

    render() {
        const {isShowLazyLoader} = this.state
        return (
            <div>
                <button onClick={this.handleClick}>show lazyLoader</button>
                {
                    isShowLazyLoader && <LazyLoader component={LazyComponent}/>
                }
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'))

