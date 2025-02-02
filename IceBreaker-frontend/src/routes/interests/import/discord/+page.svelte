<script lang="ts">
    import {onMount} from "svelte";

    import {iceBreakerAccessToken, userDiscordOAuth2Token} from "$lib/store";
    import {DISCORD_CLIENT_ID} from "$lib/constant";
    import {backend} from "$lib/backend";
    import {toast} from "@zerodevx/svelte-toast";

    const REDIRECT_URI = "http://localhost:5173/interests/import/discord";
    const SCOPE = "identify+email+guilds";
    const RESPONSE_TYPE = "token";

    function loginWithDiscord() {
        window.location.href = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
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

    let analyzedTags: string[] = $state([]);
    async function analyzeFromDiscordButton(){
        let resp = await backend.v1.tagging.analyze.discord.post({token: $iceBreakerAccessToken, discord_oauth2_token: $userDiscordOAuth2Token});
        if (resp.error){
            toast.push(`Failed to analyze from Discord: ${resp.error}`);
            return;
        }

        analyzedTags = Array.isArray(resp.data.tags) ? resp.data.tags : [resp.data.tags];
    }
</script>

{#if $userDiscordOAuth2Token}
    <p>Logged in! Token: {$userDiscordOAuth2Token.substring(0, 10)}...</p>
    <button class="button" onclick={logout}>Logout</button>
    <button class="button" onclick={analyzeFromDiscordButton}>Analyze</button>
    <br>
    {#if analyzedTags.length > 0}
        <p>Based on the servers you joined, we found these tags for you</p>
        <ul>
            {#each analyzedTags as tag}
                <li>{tag}</li>
            {/each}
        </ul>
    {/if}
{:else}
    <button class="button" onclick={loginWithDiscord}>Login with Discord</button>
{/if}
