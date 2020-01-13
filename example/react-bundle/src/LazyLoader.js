import React, { Component } from 'react';

class LazyLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            component: null,
            props: null,
        };
        this._isMounted = false;  // 这个需要考虑
    }

    componentWillMount() {
        this._load();
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillReceiveProps(next) {
        if (next.component === this.props.component) {
            return null;
        }
        this._load();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async _load() {
        const module = await this.props.component()
        const component = module.default
        this.setState({
            component
        })
    }

    render() {
        const LazyComponent = this.state.component;
        const props = Object.assign({}, this.props);    // clone props
        delete props.component;                         // 去掉 component
        return LazyComponent ? (
            <LazyComponent {...props}/>
        ) : null;
    }
}

export default LazyLoader;
