import {persisted} from "svelte-persisted-store";

export const iceBreakerAccessToken = persisted("iceBreakerAccessToken", "");
export const userDiscordOAuth2Token = persisted("userDiscordOAuth2Token", "")