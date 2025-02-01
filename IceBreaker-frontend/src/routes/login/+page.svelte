<script lang="ts">
    import {iceBreakerAccessToken} from "$lib/store";
</script>

<p>
    Access Token:
    <input type="text" bind:value={$iceBreakerAccessToken}>
</p>