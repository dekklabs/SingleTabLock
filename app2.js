const channel = new BroadcastChannel('single_instance_channel');
const sessionId = Date.now().toString();
localStorage.setItem('sessionId', sessionId);

class Tabs {
  constructor() {


    this.init();
  }

  reloadPage() {
    location.reload();
  }

  handleDuplicateInstance() {
    if (!this.isDuplicateInstance) {
      this.isDuplicateInstance = true;
      document.body.innerHTML = `
        <div>
          <h1>Esta pestaña está inactiva</h1>
          <p>Ya hay otra instancia abierta. Por favor, cierre esta pestaña manualmente.</p>
          <button id="reload">Usar aquí</button>
        </div>
      `;

      clearInterval(this.intervalId);
      document.getElementById("reload").onclick = this.reloadPage;
    }
  }

  init() {
    channel.onmessage = (event) => {
      const receivedSessionId = event.data;
      if (receivedSessionId !== sessionId) {
        this.handleDuplicateInstance();
      }
    };

    window.onload = () => {
      channel.postMessage(sessionId);
    };

    const intervalId = setInterval(() => {
      if (!this.isDuplicateInstance) {
        channel.postMessage(sessionId);
      }
    }, 1000);
  }
}

new Tabs();
