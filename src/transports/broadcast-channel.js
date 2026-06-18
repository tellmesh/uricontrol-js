export class BroadcastChannelBridge {
  constructor(name = 'uricontrol.bus', { BroadcastChannelImpl = globalThis.BroadcastChannel } = {}) {
    if (!BroadcastChannelImpl) throw new Error('BroadcastChannel is not available in this environment.');
    this.channel = new BroadcastChannelImpl(name);
    this.pending = new Map();
  }

  attachRuntime(runtime) {
    this.channel.addEventListener('message', async (event) => {
      const msg = event.data;
      if (!msg || msg.protocol !== 'uricontrol' || msg.type !== 'call') return;
      const result = await runtime.call(msg.uri, msg.payload || {}, msg.context || {});
      this.channel.postMessage({ protocol: 'uricontrol', type: 'result', id: msg.id, result });
    });
  }

  call(uri, payload = {}, context = {}) {
    const id = `bc_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    this.channel.postMessage({ protocol: 'uricontrol', type: 'call', id, uri, payload, context });
    return new Promise((resolve) => {
      const handler = (event) => {
        const msg = event.data;
        if (msg?.protocol === 'uricontrol' && msg.type === 'result' && msg.id === id) {
          this.channel.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      this.channel.addEventListener('message', handler);
    });
  }

  close() {
    this.channel.close();
  }
}
