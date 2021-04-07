const { writeFile } = require('fs').promises
const Ceramic = require('@ceramicnetwork/http-client').default
const { createDefinition, publishSchema } = require('@ceramicstudio/idx-tools')
const { Ed25519Provider } = require('key-did-provider-ed25519')
const fromString = require('uint8arrays/from-string')

// const CERAMIC_URL = 'http://localhost:7007';
const CERAMIC_URL = 'https://ceramic-clay.3boxlabs.com';

// contract on rinkeby
const contractAddress = '0x26129f690d76480c130383ce85cda0340eee8dee'

const ProposalSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  title: 'Proposal',
  properties: {
    context: {
      type: 'string'
    },
    title: {
      type: 'string'
    },
    currency: {
      type: 'string'
    },
    amount: {
      type: 'number'
    },
    beneficiary: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    url: {
      type: 'string'
    }
  },
  additionalProperties: false,
  required: [
    'context',
    'title',
    'currency',
    'amount',
    'beneficiary',
    'url'
  ]
}

const ConvictionsSchema = {
  '$schema': 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  title: 'Convictions',
  properties: {
    context: {
      type: 'string'
    },
    supply: {
      type: 'number'
    },
    proposals: {
      type: 'array',
      items: {
        $ref: '#/definitions/proposals'
      }
    },
    convictions: {
      type: 'array',
      items: {
        $ref: '#/definitions/convictions'
      }
    }
  },
  additionalProperties: false,
  required: [
    'context',
    'proposals',
    'convictions'
  ],
  definitions: {
    proposals: {
      type: 'string',
      $ceramic: {
        type: 'tile',
        schema: '<Proposal schema docID>',
      },
      maxLength: 150
    },
    convictions: {
      type: 'object',
      properties: {
        proposal: {
          type: 'string',
          $ceramic: {
            type: 'tile',
            schema: '<Proposal schema docID>',
          },
          maxLength: 150
        },
        allocation: {
          type: 'number'
        }
      },
      required: [
        'proposal',
        'allocation'
      ]
    }
  }
}

const ConvictionsStateSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  title: 'ConvictionState',
  properties: {
    context: {
      type: 'string'
    },
    supply: {
      type: 'number'
    },
    participants: {
      type: 'array',
      items: {
        $ref: '#/definitions/participants'
      }
    },
    proposals: {
      type: 'array',
      items: {
        $ref: '#/definitions/proposals'
      }
    }
  },
  additionalProperties: false,
  required: [
    'context',
    'supply',
    'participants',
    'proposals'
  ],
  definitions: {
    participants: {
      type: 'object',
      properties: {
        account: {
          type: 'string'
        },
        balance: {
          type: 'number'
        },
        convictions: {
          type: 'string',
          $ceramic: {
            type: 'tile',
            schema: '<convictions schema docID>',
          },
          maxLength: 150
        }
      },
      required: [
        'account',
        'balance',
        'convictions'
      ]
    },
    proposals: {
      type: 'object',
      properties: {
        proposal: {
          type: 'string',
          $ceramic: {
            type: 'tile',
            schema: '<Proposal schema docID>',
          },
          maxLength: 150
        },
        totalConviction: {
          type: 'number'
        },
        triggered: {
          type: 'boolean'
        }
      },
      required: [
        'proposal',
        'totalConviction',
        'triggered'
      ]
    }
  }
}

async function run() {
  // The seed must be provided as an environment variable
  const seed = fromString(process.env.SEED, 'base16')
  // Connect to the local Ceramic node
  const ceramic = new Ceramic(CERAMIC_URL)
  // Authenticate the Ceramic instance with the provider
  await ceramic.setDIDProvider(new Ed25519Provider(seed))

  const proposalSchema = await publishSchema(ceramic, { content: ProposalSchema })
  console.log(`published schema: `, proposalSchema)

  ConvictionsSchema.definitions.proposals.$ceramic.schema = proposalSchema.commitId.toUrl()
  ConvictionsSchema.definitions.convictions.properties.proposal.$ceramic.schema = proposalSchema.commitId.toUrl()

  const convictionsSchema = await publishSchema(ceramic, { content: ConvictionsSchema })
  console.log(`published schema: `, convictionsSchema)

  ConvictionsStateSchema.definitions.participants.properties.convictions.$ceramic.schema = convictionsSchema.commitId.toUrl()
  ConvictionsStateSchema.definitions.proposals.properties.proposal.$ceramic.schema = proposalSchema.commitId.toUrl()

  const convictionsStateSchema = await publishSchema(ceramic, { content: ConvictionsStateSchema })
  console.log(`published schema: `, convictionsStateSchema)

  const convictionsDefinition = await createDefinition(ceramic, {
    name: 'convictions',
    description: 'Conviction voting data definitions',
    schema: convictionsSchema.commitId.toUrl(),
  })

  const emptyConvictionsState = {
    context: 'eip155:1/erc20:' + contractAddress,
    supply: 0,
    participants: [],
    proposals: []
  }

  convictionsStateDoc = await ceramic.createDocument('tile', {
    content: emptyConvictionsState,
    metadata: {
      // controllers: [ceramic.did.id],
      schema: convictionsStateSchema.commitId.toUrl(),
      family: convictionsDefinition.id.toString()
    },
  })
  console.log(`wrote empty convictionsState with id: ${convictionsStateDoc.id}`)

  // Write config to JSON file
  const config = {
    definitions: {
      convictions: convictionsDefinition.id.toString(),
    },
    schemas: {
      Proposal: proposalSchema.commitId.toUrl(),
      Convictions: convictionsSchema.commitId.toUrl(),
      ConvictionsState: convictionsStateSchema.commitId.toUrl()
    },
    config: {
      context: 'eip155:1/erc20:' + contractAddress,
      convictionStateDocID: convictionsStateDoc.id.toString(),
      family: convictionsDefinition.id.toString(),
      IDXdefinitionName: 'convictions'
    }
  }

  await writeFile('./src/config.json', JSON.stringify(config))
  console.log('Config written to src/config.json file:', config)

  process.exit(0)
}

run().catch(console.error)