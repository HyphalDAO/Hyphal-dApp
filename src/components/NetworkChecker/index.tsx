import {FunctionComponent, useContext} from "react"
import config from "../../config"
import EthersContext from "../../context/EthersContext"

const NetworkChecker: FunctionComponent = () => {
	const {chainId} = useContext(EthersContext)

	if (chainId && chainId !== config.CHAIN_ID) {
		return (
			<div
				style={{
					position: "fixed",
					zIndex: 1000,
					width: "100vw",
					height: "100vh",
					backgroundColor: "white",
					display: "flex",
					justifyContent: "center",
					alignItems: "center"
				}}
			>
				{/* TODO: not forget to remove this hard-code */}
				Wrong network: Please switch to Rinkeby
			</div>
		)
	}

	return null
}

export default NetworkChecker
