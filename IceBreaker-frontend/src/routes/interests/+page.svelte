<!-- in this page the users can setup there tags -->

<script lang="ts">
    import {backend} from "$lib/backend";
    import {iceBreakerAccessToken} from "$lib/store";
    import {toast} from "@zerodevx/svelte-toast";

    let tags: string[] = $state([]);

    let tag: string = $state("");

    async function getTags(): Promise<string[]> {
        let resp = await backend.v1.tagging.tags.get({query: {
            token: $iceBreakerAccessToken
            }});
        if (resp.error){
            toast.push(`Failed to get tags: ${resp.error}`);
            return;
        }
        return resp.data
    }

    async function addTag(tag: string){
        if (tag == "" || tags.includes(tag)) return;
        await backend.v1.tagging.tag.post({token: $iceBreakerAccessToken, tag: tag, tag_type: "interest"});
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

<style>
    @import '../global.css';

    * {
        display: flex;
    }

    .tag button {
        margin-left: 10px;
    }
</style>
