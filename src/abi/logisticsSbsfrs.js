export const AddLogistics = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "arr",
      "outputs": [
        {
          "internalType": "address",
          "name": "walletAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "sbsfrsid",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "json",
              "type": "string"
            }
          ],
          "internalType": "struct AddLogisticsSbsfrs.Json",
          "name": "json",
          "type": "tuple"
        },
        {
          "internalType": "string",
          "name": "status",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "created",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "init",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getAllData",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "walletAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "sbsfrsid",
              "type": "uint256"
            },
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "json",
                  "type": "string"
                }
              ],
              "internalType": "struct AddLogisticsSbsfrs.Json",
              "name": "json",
              "type": "tuple"
            },
            {
              "internalType": "string",
              "name": "status",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "created",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "init",
              "type": "bool"
            }
          ],
          "internalType": "struct AddLogisticsSbsfrs.LogisticsSbsfrs[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "sbsfrsid",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "json",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "status",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "created",
          "type": "string"
        }
      ],
      "name": "addLogisticsSbsfrs",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "sbsfrsid",
          "type": "uint256"
        }
      ],
      "name": "detailLogisticSBSFRS",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "walletAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "sbsfrsid",
              "type": "uint256"
            },
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "json",
                  "type": "string"
                }
              ],
              "internalType": "struct AddLogisticsSbsfrs.Json",
              "name": "json",
              "type": "tuple"
            },
            {
              "internalType": "string",
              "name": "status",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "created",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "init",
              "type": "bool"
            }
          ],
          "internalType": "struct AddLogisticsSbsfrs.LogisticsSbsfrs",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ]