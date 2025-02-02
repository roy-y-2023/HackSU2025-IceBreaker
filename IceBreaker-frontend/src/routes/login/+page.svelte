<script lang="ts">
    import {page} from "$app/state";

    import {iceBreakerAccessToken} from "$lib/store";

    let loginSuccess = false;
    if (page.url.searchParams.has("success")) {
        loginSuccess = true;
        window.history.replaceState({}, document.title, "/login");
    }
</script>

{#if loginSuccess}
    <p class="has-text-centered">Login Success!</p>
{/if}

<br>

<a href="/login/discord">Login with Discord</a>

<p>
    Or manually input an Access Token:
    <input type="text" bind:value={$iceBreakerAccessToken}>
</p>
