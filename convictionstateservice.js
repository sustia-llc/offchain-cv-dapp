const { writeFile } = require('fs').promises
const Ceramic = require('@ceramicnetwork/http-client').default
const { IDX } = require('@ceramicstudio/idx')
const { createDefinition, publishSchema } = require('@ceramicstudio/idx-tools')
const { Ed25519Provider } = require('key-did-provider-ed25519')
const fromString = require('uint8arrays/from-string')
const { ethers }  = require('ethers');

const CERAMIC_URL = 'http://localhost:7007'
//TODO: update with real contract address
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

const convictionsDefinition = 'kjzl6cwe1jw14bh8590slzirpn9c4b1u9hrney9m8l95751lgz97wlhoey10f39';

const memberAccount1 = '0xAcE8C3100F250ff86C89E2C140c7403798F5eCAc';
const memberAccount2 = '0x509691E6e5B712a8B2e1E360C7713b911AD59C02';

//TODO: Get from contract
const totalSupply = 9001;
const memberBal1 = 1337;
const memberBal2 = 42;

//TODO: Get DID from wallet address, memberAccount1, memberAccount2
//FIXME: Holly to provide!
const memberDID1 = 'did:3:kjzl6cwe1jw146bv8bm62nq5lnvwks0gwh1amshgce0khnffwl8ahnlgyi9y2i2';
const memberDID2 = 'did:3:kjzl6cwe1jw146bv8bm62nq5lnvwks0gwh1amshgce0khnffwl8ahnlgyi9y2i2';

async function run() {
  // The seed must be provided as an environment variable
  const seed = fromString(myseed, 'base16')
  // Connect to the local Ceramic node
  const ceramic = new Ceramic(CERAMIC_URL)
  // Authenticate the Ceramic instance with the provider
  await ceramic.setDIDProvider(new Ed25519Provider(seed))
  const idx = new IDX({ ceramic: ceramic });

  // Load conviction documents for each member
  memberConvictionDoc1 = await idx.get(convictionsDefinition, memberDID1)
  memberConvictionDoc2 = await idx.get(convictionsDefinition, memberDID2)

  proposalconvictions = []

  // add all convictions from member1 doc
  for ( conviction of memberConvictionDoc1.convictions ) {
    proposalallocation = conviction.allocation * memberBal1;
    proposalconvictions.push({ proposal: conviction.proposal, totalConviction: proposalallocation, triggered: false})
  }

  for ( conviction of memberConvictionDoc2.convictions ) {
    FOUND = false
    proposalallocation = conviction.allocation * memberBal2;
    for (proposalconviction of proposalconvictions) {
      if (conviction.proposal == proposalconviction.proposal) {
          proposalconviction.totalConviction = proposalconviction.totalConviction + proposalallocation;
          FOUND = true
      }
    }
    // if it was recently added by member2
    if (!FOUND) {
      proposalconvictions.push({ proposal: conviction.proposal, totalConviction: proposalallocation, triggered: false})
    }
  }

  //TODO: set triggered based on threshold

  console.log(proposalconvictions);

  //FIXME:
  const memberCommitID1 = 'commitid1';
  const memberCommitID2 = 'commitid2';

  const emptyConvictionsState2 = {
    context: 'eip155:1/erc20:' + contractAddress,
    supply: totalSupply,
    participants: [
            {
            "account": memberAccount1,
            "balance": memberBal1,
            "convictions": memberCommitID1
            },
            {
            "account": memberAccount2,
            "balance": memberBal2,
            "convictions": memberCommitID2
            }
    ],
    proposals: [
            // {
            // proposal: "kjzl6cwe1jw148f6l3w9bdm3t9cmavjikasq1akxun9l0rsb29spklonfyrp3lf",
            // totalConviction: 234,
            // triggered: false
            // },
    ]
  }

  emptyConvictionsState2.proposals = proposalconvictions;

  convictionsStateDoc = await ceramic.loadDocument("kjzl6cwe1jw14a2h02c4ogo1evnccx7htbhp03se0ek4bx54n7qtq7fgyfzojjz");
  console.log(convictionsStateDoc.content);

  await convictionsStateDoc.change({content: emptyConvictionsState2});
  console.log(convictionsStateDoc.content);

  const abi = [
    'function totalSupply() external view returns (uint256)',
    'function balanceOf(address owner) view returns (uint256)',
    ]

  const provider = ethers.getDefaultProvider()
  const erc20 = new ethers.Contract(contractAddress, abi, provider);
  console.log(erc20);
  process.exit(0)
}

run().catch(console.error)