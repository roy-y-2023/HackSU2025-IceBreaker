<script>
    import { onMount } from "svelte";

    import {iceBreakerAccessToken, userDiscordOAuth2Token} from "$lib/store";
    import {DISCORD_CLIENT_ID} from "$lib/constant";
    import {backend} from "$lib/backend";

    const REDIRECT_URI = "http://localhost:5173/interests/import/discord";
    const SCOPE = "identify+guilds";
    const RESPONSE_TYPE = "token";

    function loginWithDiscord() {
        const authUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
            REDIRECT_URI
        )}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
        window.location.href = authUrl;
    }

    function logout() {
        $userDiscordOAuth2Token = "";
    }

    // Handle OAuth2 token retrieval on mount
    onMount(() => {
        const hash = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hash.get("access_token");

        if (accessToken) {
            $userDiscordOAuth2Token = accessToken;
            // Remove hash from URL
            window.history.replaceState(null, "", window.location.pathname);
        }
    });

    async function analyzeFromDiscordButton(){
        await backend.v1.tagging.analyze.discord.post({token: $iceBreakerAccessToken, discord_oauth2_token: $userDiscordOAuth2Token})
    }
</script>

{#if $userDiscordOAuth2Token}
    <p>Logged in! Token: {$userDiscordOAuth2Token.substring(0, 10)}...</p>
    <button class="button" on:click={logout}>Logout</button>
    <button class="button" on:click={analyzeFromDiscordButton}>Analyze</button>
{:else}
    <button class="button" on:click={loginWithDiscord}>Login with Discord</button>
{/if}
