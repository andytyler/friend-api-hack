<script>
	import { onMount } from "svelte";

	let canvas;
	let ctx;

	onMount(() => {
		ctx = canvas.getContext("2d");
		animate();
	});

	function animate() {
		// Animation code for background particles
		// ...
		requestAnimationFrame(animate);
	}
</script>

<svelte:head>
	<title>Voice of the Future</title>
</svelte:head>

<main>
	<canvas bind:this={canvas}></canvas>
	<div class="content">
		<img src="/logo.png" alt="AwesomeStartup Logo" class="logo" />
		<h1>Welcome to <span class="highlight">AwesomeStartup</span></h1>
		<p>Revolutionizing the future with cutting-edge technology</p>
		<button>Get Started</button>
	</div>
	<div class="shape circle" style="top: 20%; left: 30%;"></div>
	<div class="shape square" style="top: 60%; left: 70%;"></div>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
		font-family: "Roboto", sans-serif;
	}

	main {
		width: 100vw;
		height: 100vh;
		background: radial-gradient(at 0% 0%, rgba(255, 107, 107, 0.3) 0, transparent 50%),
			radial-gradient(at 100% 100%, rgba(78, 205, 196, 0.3) 0, transparent 50%), linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
		display: flex;
		justify-content: center;
		align-items: center;
		color: #ffffff;
		position: relative;
		overflow: hidden;
	}

	.shape {
		position: absolute;
		opacity: 0.1;
		filter: blur(40px);
		mix-blend-mode: overlay;
	}

	.circle {
		width: 300px;
		height: 300px;
		border-radius: 50%;
		background: #ff6b6b;
	}

	.square {
		width: 250px;
		height: 250px;
		background: #4ecdc4;
		transform: rotate(45deg);
	}

	canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.content {
		text-align: center;
		z-index: 1;
		position: relative;
	}

	.logo {
		width: 120px;
		height: auto;
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.highlight {
		background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	p {
		font-size: 1.2rem;
		margin-bottom: 2rem;
		opacity: 0.8;
	}

	button {
		background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
		border: none;
		color: white;
		padding: 12px 24px;
		font-size: 1rem;
		border-radius: 30px;
		cursor: pointer;
		transition: transform 0.3s ease;
	}

	button:hover {
		transform: scale(1.05);
	}
</style>
