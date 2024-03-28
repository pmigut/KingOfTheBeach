<template>
    <b-form-input
        v-model="player.name"
        type="text"
        @focus="$event.target.select()"
        class="player-input">
    </b-form-input>
</template>

<script>
export default {
    props: ['player']
}
</script>

<style scoped>
input {
    margin-bottom: 1rem;
}
</style>