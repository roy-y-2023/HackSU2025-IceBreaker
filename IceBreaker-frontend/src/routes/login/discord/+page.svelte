<script lang="ts">
    import {onMount} from "svelte";

    import {iceBreakerAccessToken, userDiscordOAuth2Token} from "$lib/store";
    import {DISCORD_CLIENT_ID} from "$lib/constant";
    import {backend} from "$lib/backend";
    import {toast} from "@zerodevx/svelte-toast";
    import {goto} from "$app/navigation";


    const SCOPE = "identify+email+guilds";
    const RESPONSE_TYPE = "token";

    function loginWithDiscord() {
        const REDIRECT_URI = window ? `${window.location.origin}/login/discord` : "";
        window.location.href = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
    }

    // Handle OAuth2 token retrieval on mount
    onMount(async () => {
        const hash = new URLSearchParams(window.location.hash.substring(1));
        const discordOAUTHToken = hash.get("access_token");

        if (window && discordOAUTHToken) {
            $userDiscordOAuth2Token = discordOAUTHToken;
            // Remove hash from URL
            window.history.replaceState(null, "", window.location.pathname);
            let resp = await backend.v1.auth.login.discord.post({discord_oauth2_token: discordOAUTHToken});
            if (resp.error) {
                toast.push(`Failed to login with Discord: ${resp.error}`);
                return;
            }
            $iceBreakerAccessToken = resp.data;
            await goto("/login?success=true");
        }
    });
</script>

<button class="button" onclick={loginWithDiscord}>Login with Discord</button>
