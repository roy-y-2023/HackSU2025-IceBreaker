<script lang="ts">
    import "bulma/css/bulma.css";

    import {SvelteToast} from "@zerodevx/svelte-toast";

    import {iceBreakerAccessToken} from "$lib/store";
</script>

<SvelteToast/>

<nav>
    <h1>IceBreaker</h1>
    {#if !$iceBreakerAccessToken}
        <p style="background-color: red">Not logged in</p>
    {/if}
</nav>

<hr>

<slot></slot>

<hr>

<a href="/login">Login</a>
<a href="/chat">Gets Start Here</a>
<a href="/onboarding">Onboarding Question</a>
<a href="/interests">Interests</a>