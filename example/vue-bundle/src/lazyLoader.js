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
