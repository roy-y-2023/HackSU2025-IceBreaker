type Guild = {
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: string;
}

type User = {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    email: string;
    verified: boolean;
    mfa_enabled: boolean;
    locale: string;
    flags: number;
    premium_type: number;
    public_flags: number;
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
    },
    getUserEmail: async (accessToken: string): Promise<string> => {
        const url = "https://discord.com/api/users/@me";
        
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
            
            const user: User = await response.json();
            return user.email;
        } catch (error) {
            console.error("Failed to fetch user email:", error);
            return "";
        }
    },
    getUserNameAndEmail: async (accessToken: string): Promise<{username: string, email: string}> => {
        const url = "https://discord.com/api/users/@me";
        
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
            
            const user: User = await response.json();
            return {username: user.username, email: user.email};
        } catch (error) {
            console.error("Failed to fetch user email:", error);
            return {username: "", email: ""};
        }
    }
}
