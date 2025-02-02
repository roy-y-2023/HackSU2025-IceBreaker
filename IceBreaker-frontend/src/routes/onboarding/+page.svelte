<script lang="ts">
    import {backend} from "$lib/backend";
    import {toast} from "@zerodevx/svelte-toast";

    import {iceBreakerAccessToken} from "$lib/store";

    let showFollowUpModal = $state(false);
    let questions: string[] = $state([]);
    let responses: string[] = $state([]);
    let followupQuestion = $state("");
    let followupResponse = $state("");
    let finalSuggestion = $state("");
    
    async function getQuestions() {
        let resp = await backend.v1["system-chat"].onboarding.survey.get();
        console.log("resp.data", resp.data)
        questions = resp.data.questions;
        responses = Array(questions.length).fill("");
    }
    
    async function submitButton() {
        if (!allQuestionsAnswered()){
            toast.push("please answer all the questions");
            return;
        }

        let surveyEntries = [];
        for (let i = 0; i < questions.length; i++){
            surveyEntries.push({
                question: questions[i],
                response: responses[i],
            })
        }
        let resp1 = await backend.v1["system-chat"].onboarding.survey.post({
            token: $iceBreakerAccessToken,
            surveyEntries: surveyEntries,
        });
        followupQuestion = resp1.data;

        followupResponse = window.prompt(followupQuestion) ?? "";
        if (followupResponse == ""){
            window.alert("please answer this");
            return;
        }

        let resp2 = await backend.v1["system-chat"].onboarding.complete.post({
            token: $iceBreakerAccessToken,
            surveyEntries: surveyEntries,
            followUpQuestion: {
                question: followupQuestion,
                response: followupResponse,
            }
        });
        finalSuggestion = resp2.data;
        toast.push("Your initial profile has being created.");
    }

    function allQuestionsAnswered(): boolean {
        return responses.every(answer => answer.trim() !== "");
    }

    getQuestions();
</script>

<div class="container">
    {#if questions.length === 0}
        <p>Loading questions</p>
    {:else}
        <h1>Please answer these questions to create your profile:</h1>
        <br>

        {#each questions as question, index}
            <div>
                <p>{question}</p>
                <input type="text" bind:value={responses[index]} size="100"/>
            </div>
        {/each}

        <br>
        <button class="button" onclick={submitButton}>Submit</button>
    {/if}
</div>

<p>{finalSuggestion}</p>

{#if showFollowUpModal}
    <div class="modal is-active">

    </div>
{/if}