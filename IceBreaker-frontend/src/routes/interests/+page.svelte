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

<div>
    {#each tags as tag}
        <div style="display: flex;">
            <p>{tag}</p>
            <button class="button" onclick={() => removeTag(tag)}>Remove</button>
        </div>
    {/each}
</div>

<hr>

<div>
    <input type="text" placeholder="Type your tag here" bind:value={tag}/>
    <button onclick={() => {
        addTag(tag);
        tag = "";
    }}>Add</button>
</div>    

