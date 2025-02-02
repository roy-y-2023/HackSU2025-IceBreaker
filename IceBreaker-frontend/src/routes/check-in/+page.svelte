<script lang="ts">
    import {backend} from "$lib/backend";
    import {iceBreakerAccessToken} from "$lib/store";
    import {onMount} from "svelte";

    let question: string = "";
    let answer: string = "";
    let respond = ""

    async function getDailyQuestion() {
        let resp = await backend.v1["system-chat"]["check-in"].get({query: {token: $iceBreakerAccessToken}});
        question = resp.data;
    }

    async function submitAnswer() {
        if (answer.trim() === "") return;
        let resp = await backend.v1["system-chat"]["check-in"].post({token: $iceBreakerAccessToken, question: question, response: answer});
        respond = resp.data.adviceToUser;
    }

    onMount(() => {
        getDailyQuestion();
    });
</script>

<div class="container">
    <div class="check-in centered">
        {#if question}
            <p>{question}</p>
            <input class="input" type="text" placeholder="Type your answer here" bind:value={answer}/>
            <button class="button" on:click={submitAnswer}>Submit</button>
            <hr>
            <p>{respond}</p>
        {:else}
            <p>Loading question...</p>
        {/if}
    </div>
</div>

<style>
    @import '../global.css';

    .check-in {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .input {
        margin-top: 10px;
        width: 50%;
    }

    .button {
        margin-top: 10px;
    }
</style>