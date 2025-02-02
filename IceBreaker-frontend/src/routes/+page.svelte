<script lang="ts">
    function login() {
        
    }

    function register() {
        
    }
</script>

<style>
    * {
        display: flex;
    }

    .centered {
        justify-content: center;
        text-align: center;
    }

    .button {
        margin: 10px;
    }
</style>

<h1 class="centered">Welcome to IceBreaker</h1>

<div class="centered">
    <div>
        <button class="button" on:click={login}>Login</button>
        <button class="button" on:click={register}>Register</button>
    </div>
</div>