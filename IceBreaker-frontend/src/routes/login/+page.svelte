<script lang="ts">
    import {page} from "$app/state";

    import {iceBreakerAccessToken} from "$lib/store";
    import {backend} from "$lib/backend";
    import {onMount} from "svelte";

    let loginSuccess = false;
    onMount(async () => {
        if (page.url.searchParams.has("success")) {
            loginSuccess = true;
            window.history.replaceState({}, document.title, "/login");

            if (!(await backend.v1.user.onboarding.survey.get({query: {token: $iceBreakerAccessToken}})).data) {
                window.location.href = "/onboarding";
            }
        }
    });
</script>

{#if loginSuccess}
    <p class="has-text-centered">Login Success!</p>
{/if}

<style>
    @import '../global.css';

    * {
        display: flex;
        flex-wrap: wrap;
    }

</style>

<div class="centered" style="flex-direction: column;">
    <a class="button" href="/login/discord">Login with Discord</a>

    <br>

    <p>
        Or manually input an Access Token:
        <input type="text" style="margin-left: 10px;" bind:value={$iceBreakerAccessToken}>
    </p>

</div>
