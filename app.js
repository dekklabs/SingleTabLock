const channel = new BroadcastChannel('single_instance_channel');
const sessionId = Date.now().toString();
localStorage.setItem('sessionId', sessionId);

let isDuplicateInstance = false;

function reloadPage() {
  location.reload();
}

function handleDuplicateInstance() {
    if (!isDuplicateInstance) {
        isDuplicateInstance = true;
        document.body.innerHTML = `
          <h1>Esta pestaña está inactiva</h1>
          <p>Ya hay otra instancia abierta. Por favor, cierre esta pestaña manualmente.</p>
          <button id="reload">Usar aquí</button>
        `;
        clearInterval(intervalId);

        document.getElementById("reload").onclick = reloadPage;
    }
}

channel.onmessage = (event) => {
    const receivedSessionId = event.data;
    if (receivedSessionId !== sessionId) {
        handleDuplicateInstance();
    }
};

window.onload = () => {
    channel.postMessage(sessionId);
};

const intervalId = setInterval(() => {
    if (!isDuplicateInstance) {
        channel.postMessage(sessionId);
    }
}, 1000);
