<script lang="ts">
    import {page} from "$app/state";

    import {iceBreakerAccessToken} from "$lib/store";

    let loginSuccess = false;
    if (page.url.searchParams.has("success")) {
        loginSuccess = true;
        window.history.replaceState({}, document.title, "/login");
    }

    let username = $state("");
    let email = $state("");
    let password = $state("");
    let supportOption = $state("support-seeking"); // "seeking" or "giving"

    function registerSubmit() {
        
    }
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

    .form {
        justify-items: left;
        flex-direction: column;
    }
</style>

<div class="centered" style="flex-direction: column;">
    <a class="button" href="./login/discord">Login with Discord</a>
</div>

<hr>

<div class="centered form">
    <div class="field">
        <div class="control has-icons-left has-icons-right">
            <input class="input is-success" type="text" placeholder="Username" bind:value={username}>
            <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
            </span>
            <span class="icon is-small is-right">
                <i class="fas fa-check"></i>
            </span>
        </div>
    </div>

    <div class="field">
        <div class="control has-icons-left has-icons-right">
            <input class="input is-danger" type="email" placeholder="Email" bind:value={email}>
            <span class="icon is-small is-left">
                <i class="fas fa-envelope"></i>
            </span>
            <span class="icon is-small is-right">
                <i class="fas fa-exclamation-triangle"></i>
            </span>
        </div>
    </div>

    <div class="field">
        <p class="control has-icons-left">
            <input class="input" type="password" placeholder="Password" bind:value={password}>
            <span class="icon is-small is-left">
            <i class="fas fa-lock"></i>
            </span>
        </p>
    </div>

    <div class="field">
        <div class="control radios">
            <label class="radio">
                <input type="radio" name="option" bind:group={supportOption} value="seeking" checked />
                Here for support.
            </label>
            <label class="radio">
                <input type="radio" name="option" bind:group={supportOption} value="giving" />
                Here to give support.
            </label>
        </div>
    </div>

    <br>

    <div class="field is-grouped">
        <div class="control">
            <button class="button is-link" onclick={registerSubmit}>Submit</button>
        </div>
        <div class="control">
            <a class="button is-link is-light" href="./">Cancel</a>
        </div>
    </div>
</div>