<script lang="ts">
    import type {ChatMessageEntry} from "$lib";

    let {chatTarget} = $props();

    let messages: ChatMessageEntry[] = $state([]);

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

<p>Chat Window</p>