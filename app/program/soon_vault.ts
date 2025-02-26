export type Vault = {
 "address": "2h1ghABKLrkEPK9YengE7ZBEYep6Dj8BHVQUj3AMde9p",
 "metadata": {
   "name": "soonVault",
   "version": "0.1.0",
   "spec": "0.1.0",
   "description": "Created with Anchor"
 },
 "instructions": [
   {
     "name": "initializeEthVault",
     "discriminator": [
       138,
       65,
       60,
       15,
       208,
       31,
       179,
       23
     ],
     "accounts": [
       {
         "name": "authority",
         "writable": true,
         "signer": true
       },
       {
         "name": "ethVaultState",
         "writable": true,
         "pda": {
           "seeds": [
             {
               "kind": "const",
               "value": [
                 101,
                 116,
                 104,
                 95,
                 118,
                 97,
                 117,
                 108,
                 116,
                 95,
                 115,
                 116,
                 97,
                 116,
                 101
               ]
             },
             {
               "kind": "account",
               "path": "authority"
             }
           ]
         }
       },
       {
         "name": "ethVault",
         "pda": {
           "seeds": [
             {
               "kind": "const",
               "value": [
                 101,
                 116,
                 104,
                 95,
                 118,
                 97,
                 117,
                 108,
                 116
               ]
             },
             {
               "kind": "account",
               "path": "ethVaultState"
             }
           ]
         }
       },
       {
         "name": "systemProgram",
         "address": "11111111111111111111111111111111"
       }
     ],
     "args": []
   },
   {
     "name": "initializeSolVault",
     "discriminator": [
       25,
       89,
       248,
       49,
       109,
       89,
       34,
       231
     ],
     "accounts": [
       {
         "name": "authority",
         "writable": true,
         "signer": true
       },
       {
         "name": "solMint"
       },
       {
         "name": "solVaultState",
         "writable": true,
         "pda": {
           "seeds": [
             {
               "kind": "const",
               "value": [
                 115,
                 111,
                 108,
                 95,
                 118,
                 97,
                 117,
                 108,
                 116,
                 95,
                 115,
                 116,
                 97,
                 116,
                 101
               ]
             },
             {
               "kind": "account",
               "path": "authority"
             }
           ]
         }
       },
       {
         "name": "solVault",
         "writable": true,
         "pda": {
           "seeds": [
             {
               "kind": "account",
               "path": "solVaultState"
             },
             {
               "kind": "account",
               "path": "tokenProgram"
             },
             {
               "kind": "account",
               "path": "solMint"
             }
           ],
           "program": {
             "kind": "const",
             "value": [
               140,
               151,
               37,
               143,
               78,
               36,
               137,
               241,
               187,
               61,
               16,
               41,
               20,
               142,
               13,
               131,
               11,
               90,
               19,
               153,
               218,
               255,
               16,
               132,
               4,
               142,
               123,
               216,
               219,
               233,
               248,
               89
             ]
           }
         }
       },
       {
         "name": "rent",
         "address": "SysvarRent111111111111111111111111111111111"
       },
       {
         "name": "systemProgram",
         "address": "11111111111111111111111111111111"
       },
       {
         "name": "tokenProgram",
         "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
       },
       {
         "name": "associatedTokenProgram",
         "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
       }
     ],
     "args": []
   },
   {
     "name": "initializeToken",
     "discriminator": [
       38,
       209,
       150,
       50,
       190,
       117,
       16,
       54
     ],
     "accounts": [
       {
         "name": "authority",
         "writable": true,
         "signer": true
       },
       {
         "name": "mint",
         "writable": true,
         "signer": true
       },
       {
         "name": "ata",
         "writable": true,
         "pda": {
           "seeds": [
             {
               "kind": "account",
               "path": "authority"
             },
             {
               "kind": "account",
               "path": "tokenProgram"
             },
             {
               "kind": "account",
               "path": "mint"
             }
           ],
           "program": {
             "kind": "const",
             "value": [
               140,
               151,
               37,
               143,
               78,
               36,
               137,
               241,
               187,
               61,
               16,
               41,
               20,
               142,
               13,
               131,
               11,
               90,
               19,
               153,
               218,
               255,
               16,
               132,
               4,
               142,
               123,
               216,
               219,
               233,
               248,
               89
             ]
           }
         }
       },
       {
         "name": "rent",
         "address": "SysvarRent111111111111111111111111111111111"
       },
       {
         "name": "systemProgram",
         "address": "11111111111111111111111111111111"
       },
       {
         "name": "tokenProgram",
         "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
       },
       {
         "name": "associatedTokenProgram",
         "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
       }
     ],
     "args": [
       {
         "name": "args",
         "type": {
           "defined": {
             "name": "initializeTokenArgs"
           }
         }
       }
     ]
   },
   {
     "name": "stakeEth",
     "discriminator": [
       38,
       118,
       142,
       244,
       162,
       2,
       120,
       98
     ],
     "accounts": [
       {
         "name": "authority",
         "writable": true
       },
       {
         "name": "ethVaultState",
         "writable": true,
         "pda": {
           "seeds": [
             {
               "kind": "const",
               "value": [
                 101,
                 116,
                 104,
                 95,
                 118,
                 97,
                 117,
                 108,
                 116,
                 95,
                 115,
                 116,
                 97,
                 116,
                 101
               ]
             },
             {
               "kind": "account",
               "path": "authority"
             }
           ]
         }
       },
       {
         "name": "ethVault",
         "writable": true,
         "pda": {
           "seeds": [
             {
               "kind": "const",
               "value": [
                 101,
                 116,
                 104,
                 95,
                 118,
                 97,
                 117,
                 108,
                 116
               ]
             },
             {
               "kind": "account",
               "path": "ethVaultState"
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
         "name": "userState",
         "writable": true,
         "pda": {
           "seeds": [
             {
               "kind": "const",
               "value": [
                 117,
                 115,
                 101,
                 114,
                 95,
                 115,
                 116,
                 97,
                 116,
                 101
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
         "name": "rent",
         "address": "SysvarRent111111111111111111111111111111111"
       },
       {
         "name": "systemProgram",
         "address": "11111111111111111111111111111111"
       }
     ],
     "args": [
       {
         "name": "amount",
         "type": "u64"
       }
     ]
   },
   {
     "name": "stakeSol",
     "discriminator": [
       200,
       38,
       157,
       155,
       245,
       57,
       236,
       168
     ],
     "accounts": [
       {
         "name": "authority",
         "writable": true
       },
       {
         "name": "solMint"
       },
       {
         "name": "solVaultState",
         "writable": true,
         "pda": {
           "seeds": [
             {
               "kind": "const",
               "value": [
                 115,
                 111,
                 108,
                 95,
                 118,
                 97,
                 117,
                 108,
                 116,
                 95,
                 115,
                 116,
                 97,
                 116,
                 101
               ]
             },
             {
               "kind": "account",
               "path": "authority"
             }
           ]
         }
       },
       {
         "name": "solVault",
         "writable": true,
         "pda": {
           "seeds": [
             {
               "kind": "account",
               "path": "solVaultState"
             },
             {
               "kind": "account",
               "path": "tokenProgram"
             },
             {
               "kind": "account",
               "path": "solMint"
             }
           ],
           "program": {
             "kind": "const",
             "value": [
               140,
               151,
               37,
               143,
               78,
               36,
               137,
               241,
               187,
               61,
               16,
               41,
               20,
               142,
               13,
               131,
               11,
               90,
               19,
               153,
               218,
               255,
               16,
               132,
               4,
               142,
               123,
               216,
               219,
               233,
               248,
               89
             ]
           }
         }
       },
       {
         "name": "user",
         "writable": true,
         "signer": true
       },
       {
         "name": "userState",
         "writable": true,
         "pda": {
           "seeds": [
             {
               "kind": "const",
               "value": [
                 117,
                 115,
                 101,
                 114,
                 95,
                 115,
                 116,
                 97,
                 116,
                 101
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
         "name": "userSolAta",
         "writable": true,
         "pda": {
           "seeds": [
             {
               "kind": "account",
               "path": "user"
             },
             {
               "kind": "account",
               "path": "tokenProgram"
             },
             {
               "kind": "account",
               "path": "solMint"
             }
           ],
           "program": {
             "kind": "const",
             "value": [
               140,
               151,
               37,
               143,
               78,
               36,
               137,
               241,
               187,
               61,
               16,
               41,
               20,
               142,
               13,
               131,
               11,
               90,
               19,
               153,
               218,
               255,
               16,
               132,
               4,
               142,
               123,
               216,
               219,
               233,
               248,
               89
             ]
           }
         }
       },
       {
         "name": "rent",
         "address": "SysvarRent111111111111111111111111111111111"
       },
       {
         "name": "systemProgram",
         "address": "11111111111111111111111111111111"
       },
       {
         "name": "tokenProgram",
         "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
       },
       {
         "name": "associatedTokenProgram",
         "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
       }
     ],
     "args": [
       {
         "name": "amount",
         "type": "u64"
       }
     ]
   },
   {
     "name": "unstakeEth",
     "discriminator": [
       57,
       21,
       142,
       168,
       199,
       15,
       156,
       24
     ],
     "accounts": [
       {
         "name": "authority",
         "writable": true
       },
       {
         "name": "ethVaultState",
         "writable": true,
         "pda": {
           "seeds": [
             {
               "kind": "const",
               "value": [
                 101,
                 116,
                 104,
                 95,
                 118,
                 97,
                 117,
                 108,
                 116,
                 95,
                 115,
                 116,
                 97,
                 116,
                 101
               ]
             },
             {
               "kind": "account",
               "path": "authority"
             }
           ]
         }
       },
       {
         "name": "ethVault",
         "writable": true,
         "pda": {
           "seeds": [
             {
               "kind": "const",
               "value": [
                 101,
                 116,
                 104,
                 95,
                 118,
                 97,
                 117,
                 108,
                 116
               ]
             },
             {
               "kind": "account",
               "path": "ethVaultState"
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
         "name": "userState",
         "writable": true,
         "pda": {
           "seeds": [
             {
               "kind": "const",
               "value": [
                 117,
                 115,
                 101,
                 114,
                 95,
                 115,
                 116,
                 97,
                 116,
                 101
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
         "name": "rent",
         "address": "SysvarRent111111111111111111111111111111111"
       },
       {
         "name": "systemProgram",
         "address": "11111111111111111111111111111111"
       }
     ],
     "args": [
       {
         "name": "amount",
         "type": "u64"
       }
     ]
   },
   {
     "name": "unstakeSol",
     "discriminator": [
       70,
       150,
       140,
       208,
       166,
       13,
       252,
       150
     ],
     "accounts": [
       {
         "name": "authority",
         "writable": true
       },
       {
         "name": "solMint"
       },
       {
         "name": "solVaultState",
         "writable": true,
         "pda": {
           "seeds": [
             {
               "kind": "const",
               "value": [
                 115,
                 111,
                 108,
                 95,
                 118,
                 97,
                 117,
                 108,
                 116,
                 95,
                 115,
                 116,
                 97,
                 116,
                 101
               ]
             },
             {
               "kind": "account",
               "path": "authority"
             }
           ]
         }
       },
       {
         "name": "solVault",
         "writable": true,
         "pda": {
           "seeds": [
             {
               "kind": "account",
               "path": "solVaultState"
             },
             {
               "kind": "account",
               "path": "tokenProgram"
             },
             {
               "kind": "account",
               "path": "solMint"
             }
           ],
           "program": {
             "kind": "const",
             "value": [
               140,
               151,
               37,
               143,
               78,
               36,
               137,
               241,
               187,
               61,
               16,
               41,
               20,
               142,
               13,
               131,
               11,
               90,
               19,
               153,
               218,
               255,
               16,
               132,
               4,
               142,
               123,
               216,
               219,
               233,
               248,
               89
             ]
           }
         }
       },
       {
         "name": "user",
         "writable": true,
         "signer": true
       },
       {
         "name": "userState",
         "writable": true,
         "pda": {
           "seeds": [
             {
               "kind": "const",
               "value": [
                 117,
                 115,
                 101,
                 114,
                 95,
                 115,
                 116,
                 97,
                 116,
                 101
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
         "name": "userSolAta",
         "writable": true,
         "pda": {
           "seeds": [
             {
               "kind": "account",
               "path": "user"
             },
             {
               "kind": "account",
               "path": "tokenProgram"
             },
             {
               "kind": "account",
               "path": "solMint"
             }
           ],
           "program": {
             "kind": "const",
             "value": [
               140,
               151,
               37,
               143,
               78,
               36,
               137,
               241,
               187,
               61,
               16,
               41,
               20,
               142,
               13,
               131,
               11,
               90,
               19,
               153,
               218,
               255,
               16,
               132,
               4,
               142,
               123,
               216,
               219,
               233,
               248,
               89
             ]
           }
         }
       },
       {
         "name": "rent",
         "address": "SysvarRent111111111111111111111111111111111"
       },
       {
         "name": "systemProgram",
         "address": "11111111111111111111111111111111"
       },
       {
         "name": "tokenProgram",
         "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
       },
       {
         "name": "associatedTokenProgram",
         "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
       }
     ],
     "args": [
       {
         "name": "amount",
         "type": "u64"
       }
     ]
   }
 ],
 "accounts": [
   {
     "name": "ethVaultState",
     "discriminator": [
       163,
       189,
       198,
       167,
       102,
       249,
       29,
       251
     ]
   },
   {
     "name": "solVaultState",
     "discriminator": [
       73,
       192,
       113,
       251,
       77,
       219,
       213,
       95
     ]
   },
   {
     "name": "userState",
     "discriminator": [
       72,
       177,
       85,
       249,
       76,
       167,
       186,
       126
     ]
   }
 ],
 "errors": [
   {
     "code": 6000,
     "name": "invalidAuthority",
     "msg": "The authority is incorrect."
   },
   {
     "code": 6001,
     "name": "invalidSolKey",
     "msg": "The SOL mint key is incorrect."
   },
   {
     "code": 6002,
     "name": "insufficientFunds",
     "msg": "Insufficient funds for withdrawal."
   },
   {
     "code": 6003,
     "name": "overflow",
     "msg": "Overflow."
   }
 ],
 "types": [
   {
     "name": "ethVaultState",
     "type": {
       "kind": "struct",
       "fields": [
         {
           "name": "stateBump",
           "type": "u8"
         },
         {
           "name": "vaultBump",
           "type": "u8"
         },
         {
           "name": "totalUsers",
           "type": "u64"
         },
         {
           "name": "authority",
           "type": "pubkey"
         }
       ]
     }
   },
   {
     "name": "initializeTokenArgs",
     "type": {
       "kind": "struct",
       "fields": [
         {
           "name": "name",
           "type": "string"
         },
         {
           "name": "symbol",
           "type": "string"
         },
         {
           "name": "uri",
           "type": "string"
         },
         {
           "name": "amount",
           "type": "u64"
         }
       ]
     }
   },
   {
     "name": "solVaultState",
     "type": {
       "kind": "struct",
       "fields": [
         {
           "name": "stateBump",
           "type": "u8"
         },
         {
           "name": "totalUsers",
           "type": "u64"
         },
         {
           "name": "solMint",
           "type": "pubkey"
         },
         {
           "name": "authority",
           "type": "pubkey"
         }
       ]
     }
   },
   {
     "name": "userState",
     "type": {
       "kind": "struct",
       "fields": [
         {
           "name": "userBump",
           "type": "u8"
         },
         {
           "name": "ethStakeAmount",
           "type": "u64"
         },
         {
           "name": "ethTimestamp",
           "type": "i64"
         },
         {
           "name": "ethPoints",
           "type": "u64"
         },
         {
           "name": "solStakeAmount",
           "type": "u64"
         },
         {
           "name": "solTimestamp",
           "type": "i64"
         },
         {
           "name": "solPoints",
           "type": "u64"
         }
       ]
     }
   }
 ]
};



export const IDL: Vault = {
  "address": "2h1ghABKLrkEPK9YengE7ZBEYep6Dj8BHVQUj3AMde9p",
  "metadata": {
    "name": "soon_vault",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initialize_eth_vault",
      "discriminator": [
        138,
        65,
        60,
        15,
        208,
        31,
        179,
        23
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "eth_vault_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  116,
                  104,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "eth_vault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  116,
                  104,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "eth_vault_state"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initialize_sol_vault",
      "discriminator": [
        25,
        89,
        248,
        49,
        109,
        89,
        34,
        231
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "sol_mint"
        },
        {
          "name": "sol_vault_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "sol_vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "sol_vault_state"
              },
              {
                "kind": "account",
                "path": "token_program"
              },
              {
                "kind": "account",
                "path": "sol_mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "token_program",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": []
    },
    {
      "name": "initialize_token",
      "discriminator": [
        38,
        209,
        150,
        50,
        190,
        117,
        16,
        54
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint",
          "writable": true,
          "signer": true
        },
        {
          "name": "ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "account",
                "path": "token_program"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "token_program",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "InitializeTokenArgs"
            }
          }
        }
      ]
    },
    {
      "name": "stake_eth",
      "discriminator": [
        38,
        118,
        142,
        244,
        162,
        2,
        120,
        98
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true
        },
        {
          "name": "eth_vault_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  116,
                  104,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "eth_vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  116,
                  104,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "eth_vault_state"
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
          "name": "user_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
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
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "stake_sol",
      "discriminator": [
        200,
        38,
        157,
        155,
        245,
        57,
        236,
        168
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true
        },
        {
          "name": "sol_mint"
        },
        {
          "name": "sol_vault_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "sol_vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "sol_vault_state"
              },
              {
                "kind": "account",
                "path": "token_program"
              },
              {
                "kind": "account",
                "path": "sol_mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "user_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
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
          "name": "user_sol_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "token_program"
              },
              {
                "kind": "account",
                "path": "sol_mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "token_program",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "unstake_eth",
      "discriminator": [
        57,
        21,
        142,
        168,
        199,
        15,
        156,
        24
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true
        },
        {
          "name": "eth_vault_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  116,
                  104,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "eth_vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  116,
                  104,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "eth_vault_state"
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
          "name": "user_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
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
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "unstake_sol",
      "discriminator": [
        70,
        150,
        140,
        208,
        166,
        13,
        252,
        150
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true
        },
        {
          "name": "sol_mint"
        },
        {
          "name": "sol_vault_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "sol_vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "sol_vault_state"
              },
              {
                "kind": "account",
                "path": "token_program"
              },
              {
                "kind": "account",
                "path": "sol_mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "user_state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
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
          "name": "user_sol_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "token_program"
              },
              {
                "kind": "account",
                "path": "sol_mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "token_program",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "EthVaultState",
      "discriminator": [
        163,
        189,
        198,
        167,
        102,
        249,
        29,
        251
      ]
    },
    {
      "name": "SolVaultState",
      "discriminator": [
        73,
        192,
        113,
        251,
        77,
        219,
        213,
        95
      ]
    },
    {
      "name": "UserState",
      "discriminator": [
        72,
        177,
        85,
        249,
        76,
        167,
        186,
        126
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAuthority",
      "msg": "The authority is incorrect."
    },
    {
      "code": 6001,
      "name": "InvalidSOLKey",
      "msg": "The SOL mint key is incorrect."
    },
    {
      "code": 6002,
      "name": "InsufficientFunds",
      "msg": "Insufficient funds for withdrawal."
    },
    {
      "code": 6003,
      "name": "Overflow",
      "msg": "Overflow."
    }
  ],
  "types": [
    {
      "name": "EthVaultState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "state_bump",
            "type": "u8"
          },
          {
            "name": "vault_bump",
            "type": "u8"
          },
          {
            "name": "total_users",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "InitializeTokenArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "SolVaultState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "state_bump",
            "type": "u8"
          },
          {
            "name": "total_users",
            "type": "u64"
          },
          {
            "name": "sol_mint",
            "type": "pubkey"
          },
          {
            "name": "authority",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "UserState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user_bump",
            "type": "u8"
          },
          {
            "name": "eth_stake_amount",
            "type": "u64"
          },
          {
            "name": "eth_timestamp",
            "type": "i64"
          },
          {
            "name": "eth_points",
            "type": "u64"
          },
          {
            "name": "sol_stake_amount",
            "type": "u64"
          },
          {
            "name": "sol_timestamp",
            "type": "i64"
          },
          {
            "name": "sol_points",
            "type": "u64"
          }
        ]
      }
    }
  ]
}