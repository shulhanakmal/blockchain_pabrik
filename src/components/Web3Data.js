import React, { useCallback } from 'react';
import { useWeb3 } from '@openzeppelin/network/react';
const infuraProjectId = '91f84cfa46204952b3494e93e583e505';

export default function Web3Data() {
	const web3Context = useWeb3(`wss://ropsten.infura.io/ws/v3/${infuraProjectId}`);
	const { networkId, networkName, accounts, providerName } = web3Context;
	const requestAuth = async web3Context => {
		try {
			await web3Context.requestAuth();
		} catch (e) {
			console.error(e);
		}
	};
	requestAuth(web3Context)
	return '';
}