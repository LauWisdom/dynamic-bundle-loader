<template>
    <div>
        <button @click="handleClick">展示lazyLoader</button>
        <LazyLoader v-if="isShowLazyLoader" :component="LazyComponent" :props="{aa: 1}"></LazyLoader>
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
                isShowLazyLoader: false
            }
        },

        components: {
            LazyLoader,
            LazyComponent: LazyComponent
        },

        methods: {
            handleClick() {
                this.isShowLazyLoader = !this.isShowLazyLoader
            }
        }
    }
</script>

<style scoped>

</style>
