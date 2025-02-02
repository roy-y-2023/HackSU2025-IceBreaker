import {LLMService} from "../llm";

type Guild = {
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: string;
}

export const DiscordAPI = {
     getUserGuilds: async (accessToken: string) => {
        const url = "https://discord.com/api/users/@me/guilds";

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${await response.text()}`);
            }

            const guilds: Guild[] = await response.json();
            return guilds;
        } catch (error) {
            console.error("Failed to fetch user guilds:", error);
            return [];
        }
    }
}