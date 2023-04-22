<script>
  import { fly } from "svelte/transition";
  //import profileIcon from "../assets/profile.svg";
  import hoodieIcon from "../assets/hoodie-icon.svg";
  import continueIcon from "../assets/continue.svg";
  import modalAction from "./modal-action";

  export let current;
  export let id;
  $: open = current === "register";
</script>

<input type="checkbox" id="register" bind:checked={open} class="modal-toggle" />
<div class="modal" use:modalAction>
  <div class="modal-box bg-neutral mx-0 px-0 pb-0 mb-0" transition:fly={{ y: 200, duration: 300 }}>
    {#if current === "register"}
      <div class="flex flex-col">
        <div class="text-white uppercase text-[25px] font-roboto-mono font-bold ">
          You've Scanned
        </div>
        <div class="w-full bg-[#f2f3f4] text-neutral py-2 my-2 text-[18px]">
          <p>{`Place/Player #${id}`}</p>
        </div>
      </div>
      <div class="mt-8 mb-16 flex items-center justify-center w-full h-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-32 h-32"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
      </div>
      <div class="modal-actions">
        <button
          on:click
          class="btn btn-block btn-secondary rounded-none text-white font-roboto-mono h-[60px]"
        >
          Continue
          <img class="ml-2" src={continueIcon} alt="continue" />
        </button>
      </div>
    {/if}
  </div>
</div>
