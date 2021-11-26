import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner, JsonRpcProvider} from "@ethersproject/providers"
import {parseEther} from "@ethersproject/units"
import GovToken from "../../abis/GovToken.json"

const approveERC20 = (
	governanceToken: string,
	address: string,
	totalSupply: number,
	provider: JsonRpcProvider,
	signer: JsonRpcSigner
): Promise<void> =>
	new Promise<void>(async (resolve, reject) => {
		try {
			const ERC20Contract = new Contract(governanceToken, GovToken.abi, signer)
			const tx = await ERC20Contract.approve(address, parseEther(String(totalSupply)))

			provider.once(tx.hash, () => {
				resolve()
			})
		} catch (e) {
			reject(e)
		}
	})

export default approveERC20
