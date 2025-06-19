import { relayInit } from "https://esm.sh/nostr-tools";

const relay = relayInit("wss://wss://relay-hed.edufeed.org/");
await relay.connect();

const sub = relay.sub([
  {
    kinds: [30142],
    limit: 10, // Anzahl begrenzen
  },
]);

const eventsDiv = document.getElementById("events");
eventsDiv.innerHTML = "";

sub.on("event", (event) => {
  const div = document.createElement("div");
  div.className = "event";
  div.innerHTML = `
    <strong>PubKey:</strong> ${event.pubkey.slice(0, 16)}…<br />
    <strong>Inhalt:</strong> <pre>${event.content}</pre>
  `;
  eventsDiv.appendChild(div);
});
