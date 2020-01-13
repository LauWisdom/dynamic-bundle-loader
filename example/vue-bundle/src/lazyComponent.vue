<template>
    <div>
        this is a lazy Component!!!
        <div>{{aa}}</div>
    </div>
</template>

<script>
    export default {
        name: "lazyComponent",

        props: {
            aa: {
                type: Number
            }
        }
    }
</script>

<style scoped>

</style>
