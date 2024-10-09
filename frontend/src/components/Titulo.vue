<script>
export default {
    methods: {
        goHome() {
            this.$router.push({ name: 'Home' })
        },
    },
}


</script>

<template>
    <header class="header">
        <div class="header-container">
            <div class="logo-section"  @click="goHome">
                <img src="@/assets/logo_roxana.jpeg" alt="Logo" class="logo">
                <h1 class="app-name">Roxana</h1>
            </div>
        </div>
    </header>
</template>


