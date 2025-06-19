const relays = [
  "wss://relay.nostr.band",
  "wss://relay.damus.io",
  "wss://relay.snort.social"
];

const eventKind = 30142;
const eventList = document.getElementById("event-list");
const seenEventIds = new Set();

for (const url of relays) {
  const relay = window.NostrTools.relayInit(url);

  relay.on('connect', () => {
    console.log(`✅ Verbunden mit ${url}`);
  });

  relay.on('error', () => {
    console.warn(`❌ Fehler beim Verbinden mit ${url}`);
  });

  relay.connect().then(() => {
    const sub = relay.sub([
      {
        kinds: [eventKind]
      }
    ]);

    sub.on('event', event => {
      if (seenEventIds.has(event.id)) return;
      seenEventIds.add(event.id);

      const div = document.createElement("div");
      div.className = "event";
      div.innerHTML = `
        <strong>Von:</strong> ${event.pubkey}<br />
        <strong>Erstellt:</strong> ${new Date(event.created_at * 1000).toLocaleString()}<br />
        <pre>${JSON.stringify(event, null, 2)}</pre>
      `;
      eventList.appendChild(div);
    });

    sub.on('eose', () => {
      console.log(`🔚 EOSE von ${url}`);
      sub.unsub();
    });
  });
}
