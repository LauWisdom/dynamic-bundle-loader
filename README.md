# dynamic-bundle-loader

> dynamic import bundle and should be used for creating lazy-loaded component



## install

```
npm install dynamic-bundle-loader
```



## Usage

The original purpose of writing this loader is mainly to reduce the size of the first screen js, so that some components are only loaded when they are needed, such as clicking a button to pop up a modal box. The code of the modal box will not be loaded before clicking, but only be loaded after clicking. At the same time, you need to make the lazy-loaded component use as similar to the original use as possible. Therefore, **i recommend using dynamic-bundle-loader to do this thing.**

The following briefly shows how to use **dynamic-bundle-loader** in react and vue to lazily load component. What's more, the components that need to be lazy loaded are used as much as possible as the original components (but the related use of react hook is not provided for the time being, interested parties can refer to the following code to rewrite into the react hook version ). The code can be found in the "example" folder. Obviously, the function of the code may be incomplete.I just borrow and provide an simple idea.

### 1、React

Firstly, we define a **Higher-Order Components** called LazyLoader for loading components that need lazy loading.

```react
import React, { Component } from 'react'

class LazyLoader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            component: null,
            props: null
        };
        this._isMounted = false
    }

    componentWillMount() {
        this._load()
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillReceiveProps(next) {
        if (next.component === this.props.component) {
            return null
        }
        this._load()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    async _load() {
        const module = await this.props.component()
        const component = module.default
        this.setState({
            component
        })
    }

    render() {
        const LazyComponent = this.state.component
        const props = Object.assign({}, this.props)
        delete props.component
        return LazyComponent ? (
            <LazyComponent {...props}/>
        ) : null
    }
}

export default LazyLoader
```

Now, let's see how to use **LazyLoader** for loading component lazily.

```react
// Define a component that needs to be lazy loaded.
import React, { Component } from 'react'

class LazyComponent extends Component {
    render() {
        return (
            <div>
                this is a lazy Component!!!
            </div>
        );
    }
}

export default LazyComponent
```

```react
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
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'))


```

It can be seen from the above code that if you need to lazy load the component (called LazyComponent in the code), you only need to pass the lazy-loaded component into **LazyLoader** as its props. Of course, the lazy-loaded components must be parsed by **dynamic-bundle-loader.** In the above code, we can see how to import lazy-loaded components in the code.

```javascript
import LazyComponent from 'LazyLoader!./src/LazyComponent.js'
```

We added "LazyLoader!" in front of path, so we need to configure it in webpack.config.js.

```javascript
module.exports = {
    resolveLoader: {
        alias: {
            LazyLoader: 'dynamic-bundle-loader'
        }
    },
}
```

Why do we need to import component like this and use such a webpack configuration? The reason is that not every component needs to be loaded lazily. In this way, we can only perform dynamic-bundle-loader parsing for components that need to be loaded lazily.

### 2、Vue

Similarly, we need to define a Higher-Order Components called LazyLoader for loading components that need lazy loading.

```javascript
export default {
    name: 'lazy-loader',

    data() {
        return {
            lazyComponent: null,
            _isMounted: false
        }
    },

    props: {
        component: {
            type: Function,
            default: () => {}
        },

        props: {
            type: Object,
            default: () => ({})
        }
    },

    computed: {
        finalProps() {
            const props = Object.assign({}, this.props)
            return props
        }
    },

    methods: {
        async _load() {
            const module = await this.component()
            const component = module.default
            this.lazyComponent = component
        },
    },

    created() {
        this._load()
    },

    mounted() {
        this._isMounted = true
    },

    beforeDestroy() {
        this._isMounted = false
    },

    watch: {
        component(val, oldVal) {
            if (val === oldVal) return null
            this._load()
        }
    },

    render(createElement) {
        const LazyComponent = this.lazyComponent
        if(LazyComponent) {
            return createElement(
                LazyComponent,
                {
                    props: {...this.finalProps},
                    attrs: this.$attrs,
                    on: this.$listeners
                }
            )
        } else {
            return
        }
    }
}

```

And then define a component that needs to be lazy loaded.

```vue
<template>
    <div>
        this is a lazy Component!!!
        <div>{{count}}</div>
        <button @click="$emit('myclick')">emit click!!!</button>
    </div>
</template>

<script>
    export default {
        name: "lazyComponent",

        props: {
            count: {
                type: Number,
                default: 0
            }
        }
    }
</script>

<style scoped>

</style>

```

Now, let's see how to use **LazyLoader** for loading component lazily. Just see the code.

```vue
<template>
    <div>
        <button @click="handleClick">show lazyLoader</button>
        <LazyLoader v-if="isShowLazyLoader" :component="LazyComponent" :props="{count}" @myclick="emitMyClick"></LazyLoader>
    </div>
</template>

<script>
    import LazyLoader from './lazyLoader.js'
    import LazyComponent from 'LazyLoader!./lazyComponent.vue'
    export default {
        name: "index",

        data() {
            return {
                LazyComponent,
                isShowLazyLoader: false,
                count: 0
            }
        },

        components: {
            LazyLoader,
            LazyComponent: LazyComponent
        },

        methods: {
            handleClick() {
                this.count++
                this.isShowLazyLoader = !this.isShowLazyLoader
            },

            emitMyClick() {
                console.log('emit my click success!!!')
            }
        }
    }
</script>
```

Now, child components not only can receive props, but also can use "$emit" to notify the parent component.