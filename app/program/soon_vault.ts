/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/soon_vault.json`.
 */
export type SoonVault = {
  address: "9PCuUZGyahj9Akup3qJVrKVVpfhjeNnVnkbrdtJ1RcXm";
  metadata: {
    name: "soonVault";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "initializeSplVault";
      discriminator: [39, 81, 6, 92, 239, 178, 237, 213];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "splMint";
        },
        {
          name: "splVaultState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  115,
                  112,
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
                ];
              },
              {
                kind: "account";
                path: "splMint";
              },
              {
                kind: "account";
                path: "authority";
              }
            ];
          };
        },
        {
          name: "splVault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "splVaultState";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "splMint";
              }
            ];
            program: {
              kind: "const";
              value: [
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
              ];
            };
          };
        },
        {
          name: "rent";
          address: "SysvarRent111111111111111111111111111111111";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "tokenProgram";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        }
      ];
      args: [
        {
          name: "pointRate";
          type: "u8";
        }
      ];
    },
    {
      name: "stakeSpl";
      discriminator: [185, 201, 132, 39, 66, 146, 241, 232];
      accounts: [
        {
          name: "authority";
          writable: true;
        },
        {
          name: "splMint";
        },
        {
          name: "splVaultState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  115,
                  112,
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
                ];
              },
              {
                kind: "account";
                path: "splMint";
              },
              {
                kind: "account";
                path: "authority";
              }
            ];
          };
        },
        {
          name: "splVault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "splVaultState";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "splMint";
              }
            ];
            program: {
              kind: "const";
              value: [
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
              ];
            };
          };
        },
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "userState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114, 95, 115, 116, 97, 116, 101];
              },
              {
                kind: "account";
                path: "splMint";
              },
              {
                kind: "account";
                path: "user";
              }
            ];
          };
        },
        {
          name: "userSplAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "user";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "splMint";
              }
            ];
            program: {
              kind: "const";
              value: [
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
              ];
            };
          };
        },
        {
          name: "rent";
          address: "SysvarRent111111111111111111111111111111111";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "tokenProgram";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "unstakeSpl";
      discriminator: [47, 102, 202, 245, 122, 89, 96, 24];
      accounts: [
        {
          name: "authority";
          writable: true;
        },
        {
          name: "splMint";
        },
        {
          name: "splVaultState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  115,
                  112,
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
                ];
              },
              {
                kind: "account";
                path: "splMint";
              },
              {
                kind: "account";
                path: "authority";
              }
            ];
          };
        },
        {
          name: "splVault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "splVaultState";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "splMint";
              }
            ];
            program: {
              kind: "const";
              value: [
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
              ];
            };
          };
        },
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "userState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [117, 115, 101, 114, 95, 115, 116, 97, 116, 101];
              },
              {
                kind: "account";
                path: "splMint";
              },
              {
                kind: "account";
                path: "user";
              }
            ];
          };
        },
        {
          name: "userSplAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "user";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "splMint";
              }
            ];
            program: {
              kind: "const";
              value: [
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
              ];
            };
          };
        },
        {
          name: "rent";
          address: "SysvarRent111111111111111111111111111111111";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "tokenProgram";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "splVaultState";
      discriminator: [88, 177, 165, 118, 214, 97, 220, 214];
    },
    {
      name: "userV2State";
      discriminator: [99, 6, 71, 8, 33, 103, 86, 224];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "invalidAuthority";
      msg: "The authority is incorrect.";
    },
    {
      code: 6001;
      name: "invalidSolKey";
      msg: "The SOL mint key is incorrect.";
    },
    {
      code: 6002;
      name: "insufficientFunds";
      msg: "Insufficient funds for withdrawal.";
    },
    {
      code: 6003;
      name: "overflow";
      msg: "Overflow.";
    }
  ];
  types: [
    {
      name: "splVaultState";
      type: {
        kind: "struct";
        fields: [
          {
            name: "stateBump";
            type: "u8";
          },
          {
            name: "totalUsers";
            type: "u64";
          },
          {
            name: "splMint";
            type: "pubkey";
          },
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "pointRate";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "userV2State";
      type: {
        kind: "struct";
        fields: [
          {
            name: "userBump";
            type: "u8";
          },
          {
            name: "splStakeAmount";
            type: "u64";
          },
          {
            name: "splTimestamp";
            type: "i64";
          },
          {
            name: "splPoints";
            type: "u64";
          }
        ];
      };
    }
  ];
};

export const idl = {
  address: "9PCuUZGyahj9Akup3qJVrKVVpfhjeNnVnkbrdtJ1RcXm",
  metadata: {
    name: "soon_vault",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  instructions: [
    {
      name: "initialize_spl_vault",
      discriminator: [39, 81, 6, 92, 239, 178, 237, 213],
      accounts: [
        {
          name: "authority",
          writable: true,
          signer: true,
        },
        {
          name: "spl_mint",
        },
        {
          name: "spl_vault_state",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  115, 112, 108, 95, 118, 97, 117, 108, 116, 95, 115, 116, 97,
                  116, 101,
                ],
              },
              {
                kind: "account",
                path: "spl_mint",
              },
              {
                kind: "account",
                path: "authority",
              },
            ],
          },
        },
        {
          name: "spl_vault",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "spl_vault_state",
              },
              {
                kind: "account",
                path: "token_program",
              },
              {
                kind: "account",
                path: "spl_mint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "rent",
          address: "SysvarRent111111111111111111111111111111111",
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
        {
          name: "token_program",
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
      ],
      args: [
        {
          name: "point_rate",
          type: "u8",
        },
      ],
    },
    {
      name: "stake_spl",
      discriminator: [185, 201, 132, 39, 66, 146, 241, 232],
      accounts: [
        {
          name: "authority",
          writable: true,
        },
        {
          name: "spl_mint",
        },
        {
          name: "spl_vault_state",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  115, 112, 108, 95, 118, 97, 117, 108, 116, 95, 115, 116, 97,
                  116, 101,
                ],
              },
              {
                kind: "account",
                path: "spl_mint",
              },
              {
                kind: "account",
                path: "authority",
              },
            ],
          },
        },
        {
          name: "spl_vault",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "spl_vault_state",
              },
              {
                kind: "account",
                path: "token_program",
              },
              {
                kind: "account",
                path: "spl_mint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "user",
          writable: true,
          signer: true,
        },
        {
          name: "user_state",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [117, 115, 101, 114, 95, 115, 116, 97, 116, 101],
              },
              {
                kind: "account",
                path: "spl_mint",
              },
              {
                kind: "account",
                path: "user",
              },
            ],
          },
        },
        {
          name: "user_spl_ata",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "user",
              },
              {
                kind: "account",
                path: "token_program",
              },
              {
                kind: "account",
                path: "spl_mint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "rent",
          address: "SysvarRent111111111111111111111111111111111",
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
        {
          name: "token_program",
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "unstake_spl",
      discriminator: [47, 102, 202, 245, 122, 89, 96, 24],
      accounts: [
        {
          name: "authority",
          writable: true,
        },
        {
          name: "spl_mint",
        },
        {
          name: "spl_vault_state",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  115, 112, 108, 95, 118, 97, 117, 108, 116, 95, 115, 116, 97,
                  116, 101,
                ],
              },
              {
                kind: "account",
                path: "spl_mint",
              },
              {
                kind: "account",
                path: "authority",
              },
            ],
          },
        },
        {
          name: "spl_vault",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "spl_vault_state",
              },
              {
                kind: "account",
                path: "token_program",
              },
              {
                kind: "account",
                path: "spl_mint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "user",
          writable: true,
          signer: true,
        },
        {
          name: "user_state",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [117, 115, 101, 114, 95, 115, 116, 97, 116, 101],
              },
              {
                kind: "account",
                path: "spl_mint",
              },
              {
                kind: "account",
                path: "user",
              },
            ],
          },
        },
        {
          name: "user_spl_ata",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "user",
              },
              {
                kind: "account",
                path: "token_program",
              },
              {
                kind: "account",
                path: "spl_mint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "rent",
          address: "SysvarRent111111111111111111111111111111111",
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
        {
          name: "token_program",
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "SplVaultState",
      discriminator: [88, 177, 165, 118, 214, 97, 220, 214],
    },
    {
      name: "UserV2State",
      discriminator: [99, 6, 71, 8, 33, 103, 86, 224],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidAuthority",
      msg: "The authority is incorrect.",
    },
    {
      code: 6001,
      name: "InvalidSOLKey",
      msg: "The SOL mint key is incorrect.",
    },
    {
      code: 6002,
      name: "InsufficientFunds",
      msg: "Insufficient funds for withdrawal.",
    },
    {
      code: 6003,
      name: "Overflow",
      msg: "Overflow.",
    },
  ],
  types: [
    {
      name: "SplVaultState",
      type: {
        kind: "struct",
        fields: [
          {
            name: "state_bump",
            type: "u8",
          },
          {
            name: "total_users",
            type: "u64",
          },
          {
            name: "spl_mint",
            type: "pubkey",
          },
          {
            name: "authority",
            type: "pubkey",
          },
          {
            name: "point_rate",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "UserV2State",
      type: {
        kind: "struct",
        fields: [
          {
            name: "user_bump",
            type: "u8",
          },
          {
            name: "spl_stake_amount",
            type: "u64",
          },
          {
            name: "spl_timestamp",
            type: "i64",
          },
          {
            name: "spl_points",
            type: "u64",
          },
        ],
      },
    },
  ],
};
