
import { TimegraphClient } from "@analog-labs/timegraph-js";
import { new_cert, build_apikey, encode_ssk, build_ssk } from "@analog-labs/timegraph-wasm";
import { Keyring } from "@polkadot/keyring";
import { waitReady } from "@polkadot/wasm-crypto";
 
(async () => {
    await waitReady();
    let cert_data, secret;
    const addr = "5FgiqkcAfT7cee7YJGy2Pq33taPcGkEGJWm6H4epnjF3QYYn";
    const PHRASE = "myself silly foil possible forum race canyon universe valley devote athlete absurd";
 
    const keyring = new Keyring({ type: "sr25519" });
    const keyPair = keyring.addFromUri(PHRASE);
 
    [cert_data, secret] = new_cert(addr, "developer");
 
    const signature = keyPair.sign(cert_data);
    const key = build_apikey(secret, cert_data, signature);
 
    const ssk_data = encode_ssk({
        ns: 0,
        key: addr,
        user_id: 1,
        expiration: 0,
    });
 
    const ssk_signature = keyPair.sign(ssk_data);
    const ssk = build_ssk(ssk_data, ssk_signature);
 
    const client = new TimegraphClient({
        url: "https://timegraph.testnet.analog.one/graphql",
        sessionKey: ssk,
    });
 
    const response1 = await client.alias.add({
        hashId: "QmZQAt1ooNcEX2xzi3efLGSV3WDVMwR8n3mx5VXA2HR756", // Look at watch.analog
        name: "Anyar1", // Look at watch.analog
    });
 
    console.log(response1);
 
    const response2 = await client.view.data({
        hashId: "QmZQAt1ooNcEX2xzi3efLGSV3WDVMwR8n3mx5VXA2HR756", // Look at watch.analog
        fields: ["_clock", "_index"], // Fields to return
        limit: "10", // Number of records required
    });
 
    console.log(response2);
})();
