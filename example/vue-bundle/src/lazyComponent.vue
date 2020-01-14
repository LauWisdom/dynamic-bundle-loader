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
