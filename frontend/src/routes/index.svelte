<script>
    import { io } from "socket.io-client";
    const socket = io("http://localhost:3005");

    export let bawt;

    const check = setInterval(() => {
        if (bawt === undefined){
            socket.emit('settings:get');
        }
    }, 250)


    socket.on('settings:push', (msg) => {
        bawt = msg
        clearInterval(check)
    });
    
    async function updateBotSetting(bot) {
        const currentState = bawt[bot].enabled
        const payload = {
            setting: bot,
            key: 'enabled',
            value: !currentState
        };
        socket.emit("settings:update", payload)
        socket.emit('settings:get');
		return;
	}
</script>

<svelte:head>
	<title>My Bawwt Manager</title>
</svelte:head>

<main>
    {#if bawt}
    <section class="card bot-settings">
        <p><strong>Bot Settings</strong></p>
        <div class="bot-setting">
            <p>Discord</p>
            <div class="toggle {bawt.discord.enabled ? 'on' : 'off'}" on:click={() => updateBotSetting('discord')}>
                <span></span>
            </div>
        </div>
        <div class="bot-setting">
            <p>Twitch</p>
            <div class="toggle {bawt.twitch.enabled ? 'on' : 'off'}"  on:click={() => updateBotSetting('twitch')}>
                <span></span>
            </div>
        </div>
    </section>
    <section class="card">
        <p><strong>Raw Data</strong></p>
        <pre>{JSON.stringify(bawt,null, 4)}</pre>
    </section>
    {/if}
</main>

<style>

@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

:global(html), :global(body) {
    font-family: 'Roboto', sans-serif;
    height: 100vh;
    margin: 0;
    padding: 0;
    background: #121212;
    color: #dbdbdb;
}

:global(main) {
    padding: 0.5em;
}

.card {
    margin: 1em;
    padding: 0.5em 1em;
    border: 1px solid #292929;
    border-radius: 10px;
    width:fit-content; 
    background: #1e1e1e;
}

.bot-setting {
    display: flex;
    align-content: center;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
}

p {
    margin: 0.3em 0;
}

.bot-setting p {
    width: 100px;
    font-size: 0.9em;
}

.toggle {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 0.2em 0.4em;
    border: 1px solid #292929;
    border-radius: 50px;
    width: 24px;
    height: 14px;
    cursor: pointer;
}

.toggle span {
    position: absolute;
    top: 2px;
    background: #1e1e1e;
    border: 1px solid #292929;
    border-radius: 10px;
    height: calc(100% - 6px);
    width: 41%;
    transition: right .5s, left .5s;
}

.toggle.on {
    background: #5cb85c;
}

.toggle.off {
    background: #b85c5c;
}

.toggle.on span {
    right: 2px;
}

.toggle.off span {
    left: 2px;
}

pre {
    margin: 1em 2em;
}


</style>