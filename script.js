import { relayInit, getEventHash, verifySignature, nip19 } from 'nostr-tools';

const relays = [
  "wss://relay.damus.io",
  "wss://nostr.fmt.wiz.biz",
  "wss://relay.snort.social"
];

const eventKind = 30142;
const pubkey = ""; // Optional: nur Events eines bestimmten Users laden

async function fetchEvent30142FromRelays() {
  for (const relayUrl of relays) {
    try {
      const relay = relayInit(relayUrl);

      relay.on('connect', () => {
        console.log(`✅ Verbunden mit ${relayUrl}`);
      });

      relay.on('error', () => {
        console.warn(`❌ Fehler beim Verbinden mit ${relayUrl}`);
      });

      await relay.connect();

      const sub = relay.sub([
        {
          kinds: [eventKind],
          ...(pubkey ? { authors: [pubkey] } : {})
        }
      ]);

      sub.on('event', event => {
        console.log(`📥 Event von ${relayUrl}:`, event);
      });

      sub.on('eose', () => {
        console.log(`🔚 EOSE von ${relayUrl}`);
        sub.unsub();
      });

    } catch (err) {
      console.error(`💥 Fehler bei ${relayUrl}:`, err);
    }
  }
}

fetchEvent30142FromRelays();
