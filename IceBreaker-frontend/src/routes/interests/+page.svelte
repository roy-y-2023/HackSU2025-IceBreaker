<!-- in this page the users can setup there tags -->

<script lang="ts">
    let tags: string[] = $state([]);

    let tag = $state("");

    function getTags(): string[] {
        return tags;
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
</script>

<div>
    {#each tags as tag}
        <div style="display: flex;">
            <p>{tag}</p>
            <button onclick={() => removeTag(tag)}>Remove</button>
        </div>
    {/each}
</div>

<div>
    <input type="text" placeholder="Type your tag here" bind:value={tag}/>
    <button onclick={() => {
        addTag(tag);
        tag = "";
    }}>Add</button>
</div>    

