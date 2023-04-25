<script>
  import { fly } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  // import profileIcon from "../assets/profile.svg";
  // import hoodieIcon from "../assets/hoodie-icon.svg";
  // import continueIcon from "../assets/continue.svg";
  //import stamp from "../assets/stamp.svg";
  import StampIcon from "./svgs/stamp.svelte";
  import profile from "../assets/profile.svg";
  import modalAction from "./modal-action";
  import StampedAvatars from "./common/stamped-avatars.svelte";

  export let current;
  export let player;
  const dispatch = createEventDispatcher();

  $: open = current === "player";
  let slicedStampList = player.stamps.slice(0, 7);
</script>

<input type="checkbox" id="player" bind:checked={open} class="modal-toggle" />

<div class="modal" use:modalAction>
  <div class="m-wrapper" transition:fly={{ y: 200, duration: 300 }}>
    <div class="m-container">
      <div class="m-body-container">
        <div class="pc-wrapper">
          <p class="pc-header">
            {"You've Scanned"}
          </p>
          <div class="pc-u-container" style="margin: 0 0 20px 0;">
            <p>{`@${player.handle}`}</p>
          </div>
          {#if player.handle !== "start"}
            <div class="pc-a-container">
              <img src={`https://arweave.net/${player.avatar}`} alt={"Avatar"} />
            </div>

            <div class="pc-b-container">
              <p>{player.bio}</p>
            </div>
          {/if}
          {#if player.handle === "start"}
            <div class="flex flex-col items-start text-white space-y-2 mx-4 mt-4">
              <div>Welcome to the Scavenger Hunt Game!</div>
              <div class="text-left">
                In this game your objective is to STAMP as many QR Code marked locations as possible
                at Permapalooza.
              </div>
              <div class="text-left">
                In order to, STAMP places you will need an Arweave Wallet, these steps will setup
                your wallet and STAMP your first place. "Start"
              </div>
              <ul class="text-left numbers">
                <li>1. Click "Stamp"</li>
                <li>2. On "Arweave.App" click "Add Wallet"</li>
                <li>3. Click "Create new Wallet"</li>
                <li>
                  4. When "generation complete" click "Passphased Saved? Click here to proceed"
                </li>
                <li>5. Click Connect</li>
                <li>6. Click Accept</li>
                <li>7. Tab back to the "Svanger Hunt App"</li>
              </ul>
              <blockquote class="text-left">
                * NOTE: make sure you have private tabs disabled or the wallet will not stay stored
                in your browser.
              </blockquote>
            </div>
          {/if}
          <div class="pc-sl-container-p">
            {#if player.stamps.length > 0}
              <StampedAvatars stamps={player.stamps} amount={7} />
            {:else}
              <div class="pc-empty-wrapper">
                <p>Be the first to stamp this player</p>
              </div>
            {/if}
          </div>
        </div>
      </div>
      <div class="m-action-container">
        {#if player.admin}
          <button class="mb-wrapper" on:click|stopPropagation={() => dispatch("reset")}>
            <div class="mb-label-wrapper">
              <span class="mb-label font-roboto-mono font-bold">Reset</span>
            </div>
          </button>
        {/if}
        <button class="mb-wrapper" on:click|stopPropagation={() => dispatch("stamp")}>
          <div class="mb-label-wrapper">
            <div class={"mi-wrapper mi-icon-start"}>
              <!-- <img src={stamp} alt={"Stamp Icon"} /> -->
              <StampIcon />
            </div>
            <span class="mb-label font-roboto-mono font-bold">Stamp</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</div>
