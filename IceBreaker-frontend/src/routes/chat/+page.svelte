<script lang="ts">
    import {ChatWindowComponent, LocalChatWindowComponent} from "$lib/components";

    let conversations = ["system", "check-in", "onboarding"];
    let currentConversation = $state(conversations[0]);

</script>

<div class="columns">
    <div class="column is-one-quarter">
        Chat:
        <br>
        {#each conversations as conv}
            {#if conv === currentConversation}
                <b>{conv}</b>
            {:else}
                <p onclick={() => currentConversation = conv}>{conv}</p>
            {/if}
        {/each}
    </div>
    <div class="column">
        {#if currentConversation === "onboarding"}
            <LocalChatWindowComponent chatTarget={"onboarding"}/>
        {:else}
            <ChatWindowComponent chatTarget={currentConversation}/>
        {/if}
    </div>
</div>

