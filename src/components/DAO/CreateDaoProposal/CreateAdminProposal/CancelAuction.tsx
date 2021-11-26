import {AuthContext} from "../../../../context/AuthContext"
import EthersContext from "../../../../context/EthersContext"
import {Auction} from "../../../../types/auction"
import Button from "../../../Controls/Button"
import Select from "../../../Controls/Select"
import {toastError, toastSuccess} from "../../../UI/Toast"
import {FunctionComponent, useContext, useState} from "react"

const CancelAuction: FunctionComponent<{
	gnosisAddress: string
	gnosisVotingThreshold: number
	title: string
	description: string
	afterSubmit: () => void
}> = ({gnosisAddress, gnosisVotingThreshold, title, description, afterSubmit}) => {
	const {signer} = useContext(EthersContext)
	const {account} = useContext(AuthContext)
	// TODO
	const auctions: Auction[] = []
	const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null)
	const [processing, setProcessing] = useState(false)

	const handleAuctionChange = (auctionId: number) => {
		setSelectedAuction(auctions.find(a => a.id === auctionId) ?? null)
	}

	const handleSubmit = async () => {
		if (!(account && signer && selectedAuction)) return
		setProcessing(true)
		try {
			console.log("TODO")
			setSelectedAuction(null)
			afterSubmit()
			toastSuccess("Proposal successfully created")
		} catch (e) {
			console.error(e)
			toastError("Failed to create proposal")
		}
		setProcessing(false)
	}

	return (
		<>
			<label htmlFor="cancel-auction-id">Auction ID</label>
			<Select<number>
				placeholder="Choose one"
				value={selectedAuction?.id}
				options={auctions
					.filter(a => a.state === "approved")
					.map(a => ({name: String(a.nftName), value: a.id}))}
				onChange={handleAuctionChange}
				id="cancel-auction-id"
				fullWidth
			/>
			<Button
				disabled={processing || !selectedAuction}
				onClick={handleSubmit}
				extraClassName="create-dao-proposal__submit-button"
			>
				{processing ? "Processing..." : "Create Proposal"}
			</Button>
		</>
	)
}

export default CancelAuction
