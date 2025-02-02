<script lang="ts">
    import "bulma/css/bulma.css";

    import {SvelteToast} from "@zerodevx/svelte-toast";

    import {iceBreakerAccessToken} from "$lib/store";

    let isNavbarBurgerActive = $state(false);
</script>

<SvelteToast/>

<nav class="navbar">
    <div class="navbar-start">
        <div class="navbar-brand">
            <a href="/"><h1 class="title">IceBreaker</h1></a>
        </div>
    </div>
    <div class="navbar-menu" class:is-active={isNavbarBurgerActive}>
        <div class="navbar-end">
            <div class="navbar-item">
                <a href="/onboarding">Onboarding Question</a>
            </div>
            <div class="navbar-item">
                <a href="/check-in">Daily Check-in Question</a>
            </div>
            <div class="navbar-item">
                <a href="/interests">Interests</a>
            </div>
            <div class="navbar-item">
                <a href="/login">Login</a>
            </div>
        </div>
    </div>
    <button class="navbar-burger" onclick={() => isNavbarBurgerActive = !isNavbarBurgerActive} aria-label="menu" aria-expanded="false">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
    </button>
</nav>

{#if !$iceBreakerAccessToken}
    <p style="background-color: red">Not logged in</p>
{/if}

<hr style="margin-top: 0">

<slot></slot>

<hr>
