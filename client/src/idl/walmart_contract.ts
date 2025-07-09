/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/walmart_contract.json`.
 */
export type WalmartContract = {
  "address": "4Jm1ZvaFtKQ5RXbCawUcbumaZtb6sBbn4TdmM9zv6TGL",
  "metadata": {
    "address": "4Jm1ZvaFtKQ5RXbCawUcbumaZtb6sBbn4TdmM9zv6TGL",
    "name": "walmartContract",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "completeCampaign",
      "discriminator": [
        238,
        164,
        40,
        81,
        211,
        55,
        55,
        26
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true
        },
        {
          "name": "campaign"
        },
        {
          "name": "tokenMint",
          "writable": true
        },
        {
          "name": "userTokenAccount",
          "writable": true
        },
        {
          "name": "vaultAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "initializeCampaign",
      "discriminator": [
        169,
        88,
        7,
        6,
        9,
        165,
        65,
        132
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "campaignId"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "campaignId",
          "type": "string"
        },
        {
          "name": "brand",
          "type": "string"
        },
        {
          "name": "requiredSkus",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "scanCountReq",
          "type": "u32"
        },
        {
          "name": "rewardTokens",
          "type": "u64"
        },
        {
          "name": "tokenMint",
          "type": "pubkey"
        },
        {
          "name": "startDate",
          "type": "u64"
        },
        {
          "name": "endDate",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeUser",
      "discriminator": [
        111,
        17,
        185,
        250,
        60,
        122,
        38,
        254
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "logScan",
      "discriminator": [
        119,
        230,
        251,
        37,
        121,
        12,
        83,
        214
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "scanLog",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  99,
                  97,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "sku"
              },
              {
                "kind": "arg",
                "path": "timestamp"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "sku",
          "type": "string"
        },
        {
          "name": "timestamp",
          "type": "u64"
        },
        {
          "name": "warrantyDays",
          "type": "u64"
        }
      ]
    },
    {
      "name": "upgradeLoyalty",
      "discriminator": [
        211,
        175,
        151,
        232,
        196,
        121,
        173,
        227
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "campaign",
      "discriminator": [
        50,
        40,
        49,
        11,
        157,
        220,
        229,
        192
      ]
    },
    {
      "name": "scanLog",
      "discriminator": [
        77,
        138,
        52,
        209,
        52,
        135,
        9,
        27
      ]
    },
    {
      "name": "userAccount",
      "discriminator": [
        211,
        33,
        136,
        16,
        186,
        110,
        242,
        127
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "insufficientScans",
      "msg": "Not enough scans to complete campaign"
    },
    {
      "code": 6001,
      "name": "campaignNotActive",
      "msg": "Campaign is not active"
    }
  ],
  "types": [
    {
      "name": "campaign",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaignId",
            "type": "string"
          },
          {
            "name": "brand",
            "type": "string"
          },
          {
            "name": "requiredSkus",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "scanCountReq",
            "type": "u32"
          },
          {
            "name": "rewardTokens",
            "type": "u64"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "startDate",
            "type": "u64"
          },
          {
            "name": "endDate",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "scanLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "sku",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "u64"
          },
          {
            "name": "warrantyDays",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "userAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wallet",
            "type": "pubkey"
          },
          {
            "name": "scanCount",
            "type": "u32"
          },
          {
            "name": "tokensEarned",
            "type": "u64"
          },
          {
            "name": "loyaltyTier",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
