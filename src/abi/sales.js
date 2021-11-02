export const AddSales = [
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
          "name": "saleid",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "date",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "nodo",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "buyer",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "price",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "sugar",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "volume",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "status",
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
              "name": "saleid",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "date",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "nodo",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "buyer",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "price",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "sugar",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "volume",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "status",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "init",
              "type": "bool"
            }
          ],
          "internalType": "struct AddSales.Sales[]",
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
          "name": "saleid",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "date",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "nodo",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "buyer",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "price",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "sugar",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "volume",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "status",
          "type": "string"
        }
      ],
      "name": "addSales",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]