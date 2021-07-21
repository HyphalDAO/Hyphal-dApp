import {Contract} from "@ethersproject/contracts"
import {_TypedDataEncoder} from "@ethersproject/hash"
import {BigNumber, BigNumberish} from "@ethersproject/bignumber"
import {arrayify} from "@ethersproject/bytes"
import {AddressZero} from "@ethersproject/constants"
import {JsonRpcSigner} from "@ethersproject/providers"
import {Wallet} from "@ethersproject/wallet"

const EIP712_SAFE_TX_TYPE = {
	SafeTx: [
		{type: "address", name: "to"},
		{type: "uint256", name: "value"},
		{type: "bytes", name: "data"},
		{type: "uint8", name: "operation"},
		{type: "uint256", name: "safeTxGas"},
		{type: "uint256", name: "baseGas"},
		{type: "uint256", name: "gasPrice"},
		{type: "address", name: "gasToken"},
		{type: "address", name: "refundReceiver"},
		{type: "uint256", name: "nonce"}
	]
}

const EIP712_SAFE_MESSAGE_TYPE = {
	SafeMessage: [{type: "bytes", name: "message"}]
}

interface MetaTransaction {
	to: string
	value: string | number | BigNumber
	data: string
	operation: number
}

export interface SafeTransaction extends MetaTransaction {
	safeTxGas: string | number
	baseGas: string | number
	gasPrice: string | number
	gasToken: string
	refundReceiver: string
	nonce: string | number
}

export interface SafeSignature {
	signer: string
	data: string
}

export const calculateSafeTransactionHash = (
	safe: Contract,
	safeTx: SafeTransaction,
	chainId: BigNumberish
): string =>
	_TypedDataEncoder.hash({verifyingContract: safe.address, chainId}, EIP712_SAFE_TX_TYPE, safeTx)

export const calculateSafeMessageHash = (
	safe: Contract,
	message: string,
	chainId: BigNumberish
): string =>
	_TypedDataEncoder.hash({verifyingContract: safe.address, chainId}, EIP712_SAFE_MESSAGE_TYPE, {
		message
	})

export const safeSignTypedData = async (
	signer: Wallet,
	safe: Contract,
	safeTx: SafeTransaction,
	chainId?: BigNumberish
): Promise<SafeSignature> => {
	if (!chainId && !signer.provider) throw new Error("Provider required to retrieve chainId")
	const cid = (await signer.provider!.getNetwork()).chainId
	const signerAddress = await signer.getAddress()
	return {
		signer: signerAddress,
		data: await signer._signTypedData(
			{verifyingContract: safe.address, chainId: cid},
			EIP712_SAFE_TX_TYPE,
			safeTx
		)
	}
}

export const signHash = async (signer: JsonRpcSigner, hash: string): Promise<SafeSignature> => {
	const typedDataHash = arrayify(hash)
	const signerAddress = await signer.getAddress()
	return {
		signer: signerAddress,
		data: (await signer.signMessage(typedDataHash)).replace(/1b$/, "1f").replace(/1c$/, "20")
	}
}

export const safeSignMessage = async (
	signer: JsonRpcSigner,
	safe: Contract,
	safeTx: SafeTransaction,
	chainId?: BigNumberish
): Promise<SafeSignature> => {
	const cid = chainId || (await signer.provider!.getNetwork()).chainId
	return signHash(signer, calculateSafeTransactionHash(safe, safeTx, cid))
}

export const buildSignatureBytes = (signatures: SafeSignature[]): string => {
	signatures.sort((left, right) =>
		left.signer.toLowerCase().localeCompare(right.signer.toLowerCase())
	)
	let signatureBytes = "0x"
	for (const sig of signatures) {
		signatureBytes += sig.data.slice(2)
	}
	return signatureBytes
}

export const executeTx = async (
	safe: Contract,
	safeTx: SafeTransaction,
	signatures: SafeSignature[],
	overrides?: unknown
): Promise<any> => {
	const signatureBytes = buildSignatureBytes(signatures)
	return safe.execTransaction(
		safeTx.to,
		safeTx.value,
		safeTx.data,
		safeTx.operation,
		safeTx.safeTxGas,
		safeTx.baseGas,
		safeTx.gasPrice,
		safeTx.gasToken,
		safeTx.refundReceiver,
		signatureBytes,
		overrides || {}
	)
}

export const buildContractCall = (
	contract: Contract,
	method: string,
	params: unknown[],
	nonce: number,
	delegateCall?: boolean,
	overrides?: Partial<SafeTransaction>
): SafeTransaction => {
	const data = contract.interface.encodeFunctionData(method, params)
	return buildSafeTransaction(
		Object.assign(
			{
				to: contract.address,
				data,
				operation: delegateCall ? 1 : 0,
				nonce
			},
			overrides
		)
	)
}

export const buildSafeTransaction = (template: {
	to: string
	value?: BigNumber | number | string
	data?: string
	operation?: number
	safeTxGas?: number | string
	baseGas?: number | string
	gasPrice?: number | string
	gasToken?: string
	refundReceiver?: string
	nonce: number
}): SafeTransaction => {
	return {
		to: template.to,
		value: template.value || 0,
		data: template.data || "0x",
		operation: template.operation || 0,
		safeTxGas: template.safeTxGas || 0,
		baseGas: template.baseGas || 0,
		gasPrice: template.gasPrice || 0,
		gasToken: template.gasToken || AddressZero,
		refundReceiver: template.refundReceiver || AddressZero,
		nonce: template.nonce
	}
}

// TODO: unused stuff

// export const signTransaction = async (
// 	safeAddress: string,
// 	call: SafeTransaction,
// 	signatures: [SafeSignature],
// 	signer: JsonRpcSigner,
// 	provider: Web3Provider
// ): Promise<[SafeSignature]> => {
// 	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, provider)
// 	const signature = await safeSignMessage(signer, safeContract, call)
// 	signatures.push(signature)
// 	return signatures
// }

// export const calculateSafeDomainSeparator = (safe: Contract, chainId: BigNumberish): string =>
// 	_TypedDataEncoder.hashDomain({verifyingContract: safe.address, chainId})

// export const preimageSafeTransactionHash = (
// 	safe: Contract,
// 	safeTx: SafeTransaction,
// 	chainId: BigNumberish
// ): string => _TypedDataEncoder.encode(
// 	{verifyingContract: safe.address, chainId},
// 	EIP712_SAFE_TX_TYPE,
// 	safeTx
// )

// export const executeTxWithSigners = async (
// 	safe: Contract,
// 	tx: SafeTransaction,
// 	signers: Wallet[],
// 	overrides?: any
// ) => {
// 	const sigs = await Promise.all(signers.map(signer => safeSignTypedData(signer, safe, tx)))
// 	return executeTx(safe, tx, sigs, overrides)
// }

// export const executeContractCallWithSigners = async (
// 	safe: Contract,
// 	contract: Contract,
// 	method: string,
// 	params: any[],
// 	signers: Wallet[],
// 	delegateCall?: boolean,
// 	overrides?: Partial<SafeTransaction>
// ) => {
// 	const tx = buildContractCall(
// 		contract,
// 		method,
// 		params,
// 		await safe.nonce(),
// 		delegateCall,
// 		overrides
// 	)
// 	return executeTxWithSigners(safe, tx, signers)
// }

// export const populateExecuteTx = async (
// 	safe: Contract,
// 	safeTx: SafeTransaction,
// 	signatures: SafeSignature[],
// 	overrides?: any
// ): Promise<PopulatedTransaction> => {
// 	const signatureBytes = buildSignatureBytes(signatures)
// 	return safe.populateTransaction.execTransaction(
// 		safeTx.to,
// 		safeTx.value,
// 		safeTx.data,
// 		safeTx.operation,
// 		safeTx.safeTxGas,
// 		safeTx.baseGas,
// 		safeTx.gasPrice,
// 		safeTx.gasToken,
// 		safeTx.refundReceiver,
// 		signatureBytes,
// 		overrides || {}
// 	)
// }

// export const logGas = async (message: string, tx: Promise<any>, skip?: boolean): Promise<any> => {
// 	return tx.then(async result => {
// 		const receipt = await result.wait()
// 		if (!skip) console.log("           Used", receipt.gasUsed.toNumber(), `gas for >${message}<`)
// 		return result
// 	})
// }

// export const safeApproveHash = async (
// 	signer: JsonRpcSigner,
// 	safe: Contract,
// 	safeTx: SafeTransaction,
// 	skipOnChainApproval?: boolean
// ): Promise<SafeSignature> => {
// 	if (!skipOnChainApproval) {
// 		if (!signer.provider) throw new Error("Provider required for on-chain approval")
// 		const chainId = (await signer.provider.getNetwork()).chainId
// 		const typedDataHash = arrayify(calculateSafeTransactionHash(safe, safeTx, chainId))
// 		const signerSafe = safe.connect(signer)
// 		await signerSafe.approveHash(typedDataHash)
// 	}
// 	const signerAddress = await signer.getAddress()
// 	return {
// 		signer: signerAddress,
// 		data:
// 			`0x000000000000000000000000${
// 			signerAddress.slice(2)}000000000000000000000000000000000000000000000000000000000000000001`
// 	}
// }
