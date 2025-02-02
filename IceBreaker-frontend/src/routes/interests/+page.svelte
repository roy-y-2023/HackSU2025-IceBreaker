<!-- in this page the users can setup there tags -->

<script lang="ts">
    import {backend} from "$lib/backend";
    import {iceBreakerAccessToken} from "$lib/store";
    import {get} from "svelte/store";

    let tags: string[] = $state([]);

    let tag = $state("");

    async function getTags(): Promise<string[]> {
        let resp = await backend.v1.tagging.tags.get({query: {
            token: $iceBreakerAccessToken
            }});
        return resp.data
    }

    function addTag(tag: string){
        if (tag == "" || tags.includes(tag)) return;
        tags.push(tag);
    }

    function removeTag(tag: string){
        tags.find((t, index) => {
            if (t == tag){
                tags.splice(index, 1);
            }
        });
    }

    getTags().then(r => tags = r);
</script>

<style>
    @import '../global.css';

    * {
        display: flex;
    }

    .tag button {
        margin-left: 10px;
    }
</style>

<div class="tags centered">
    {#each tags as tag}
        <div class="tag is-medium">
            <p>{tag}</p>
            <button class="delete" onclick={() => removeTag(tag)} aria-labelledby="span"></button>
        </div>
    {/each}
</div>

<hr>

<div class="centered">
    <input class="input" style="width: 25vw" type="text" placeholder="Type your tag here" bind:value={tag}/>
    <button class="button" onclick={() => {
        addTag(tag);
        tag = "";
    }}>Add</button>
</div>

<hr>

<div class="centered">
    <a href="/interests/import/discord">Analyze from Discord servers joined</a>
</div>

