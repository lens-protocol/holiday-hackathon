# Touch Grass Meme Token

## PR Format:

- Project Name: Touching Grass
- Team Members: nuconomy.eth
- Project Description: This is a simple memecoin to experiment with deploying a token to Lens via Third Web.
- Source Code Link: https://github.com/nuconomy/holiday-hackathon/
- Preview Link (Optional): N/A
- Demo Video/Slide Deck Link (Optional): https://github.com/nuconomy/holiday-hackathon/blob/master/touchgrass.pdf
- Screenshots (Optional): N/A

CA: `0xE5D45Cd408fC63e690De1d02ACD50fC842C55282`

> "It's a pudgy world and we're all living in it."

## Third Web Notes

Interact with this contract from your app
Install the latest version of the SDK:

```
npm i thirdweb
```

Initialize the SDK and contract on your project:

```
import {
  createThirdwebClient,
  getContract,
} from "thirdweb";
import { defineChain } from "thirdweb/chains";

// create the client with your clientId, or secretKey if in a server environment
const client = createThirdwebClient({
  clientId: "YOUR_CLIENT_ID",
});

// connect to your contract
const contract = getContract({
  client,
  chain: defineChain(37111),
  address: "0xE5D45Cd408fC63e690De1d02ACD50fC842C55282",
});
```
