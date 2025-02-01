<script lang="ts">
    import type {ChatMessageEntry} from "$lib";

    let {chatTarget} = $props();
    let message = $state("");

    let messages: ChatMessageEntry[] = $state([]);
    setInterval(() => {
        messages = getMessages();
    }, 1000);

    // I'll implement these two later
    // treat them as placeholder to interact with the backend
    function getMessages(): ChatMessageEntry[] {

    }
    function sendMessage(message: string) {

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
    <input type="text" placeholder="Type your message here" bind:value={message}/>
    <button onclick={() => {
        sendMessage(message);
        message = "";
    }}>Send</button>
</div>

<p>Chat Window</p>