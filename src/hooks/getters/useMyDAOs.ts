import {useContext, useEffect, useState} from "react"
import {AuthContext} from "../../context/AuthContext"
import {DAO} from "../../types/DAO"
import getDAO from "../../api/firebase/DAO/getDAO"
import getVotingThreshold from "../../api/ethers/functions/gnosisSafe/getVotingThreshold"
import getOwners from "../../api/ethers/functions/gnosisSafe/getOwners"
import EthersContext from "../../context/EthersContext"
import getUser from "../../api/firebase/user/getUser"

const useMyDAOs = (): {
	DAOs: DAO[]
	loading: boolean
	error: boolean
	refetch: () => Promise<void>
} => {
	const [DAOs, setDAOs] = useState<DAO[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const {account} = useContext(AuthContext)
	const {provider} = useContext(EthersContext)

	const getData = async () => {
		if (account) {
			setLoading(true)
			setError(false)
			try {
				const user = await getUser(account)
				const res = await Promise.all(
					user!.myDaos.map(async dao => {
						const firebaseData = await getDAO(dao)
						const gnosisVotingThreshold = await getVotingThreshold(dao, provider)
						const owners = await getOwners(dao, provider)
						const tokenSymbol = ""
						const balance = 0
						const fundedProjects = 0
						return {
							...firebaseData,
							tokenSymbol,
							balance,
							fundedProjects,
							gnosisVotingThreshold,
							owners
						}
					})
				)
				setDAOs(res)
			} catch (e) {
				console.error(e)
				setError(true)
			}
			setLoading(false)
		}
	}

	useEffect(() => {
		getData()
	}, [account])

	return {
		DAOs,
		loading,
		error,
		refetch: getData
	}
}

export default useMyDAOs