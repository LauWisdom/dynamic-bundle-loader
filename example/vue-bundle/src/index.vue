<template>
    <div>
        <button @click="handleClick">展示lazyLoader</button>
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

<style scoped>

</style>
