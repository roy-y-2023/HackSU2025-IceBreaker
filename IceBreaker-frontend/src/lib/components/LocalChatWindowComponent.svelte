<script lang="ts">
    import type {ChatMessageEntry} from "$lib";
    import {backend} from "$lib/backend";
    import {iceBreakerAccessToken} from "$lib/store";


    let {chatTarget} = $props();
    let messageInputBox = $state("");

    let messages: ChatMessageEntry[] = $state([]);

    async function sendMessage(message: string) {
        messages.push({name: "user", content: message});
        let resp = await backend.v1["system-chat"].onboarding.post({
            token: $iceBreakerAccessToken,
            conversations: messages.map((ele) => {
                return {
                    role: ele.name == "system" ? "system" : "user",
                    message: ele.content,
                }
            })
        })
    }
</script>

<div>
    {#each messages as message}
        <div>
            <p>{message.name} says:</p>
            <br>
            <p>{message.content}</p>
        </div>
    {/each}
</div>

<div>
    <input type="text" placeholder="Type your message here" bind:value={messageInputBox}/>
    <button class="button" onclick={() => {
        sendMessage(messageInputBox);
        messageInputBox = "";
    }}>Send</button>
</div>
