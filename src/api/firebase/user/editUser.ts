import firebase from "firebase"
import {User} from "../../../types/user"

const {REACT_APP_CLOUD_FUNCTIONS_URL} = process.env

const editUser = async (user: Omit<User, "myDaos" | "myDomains">): Promise<void> => {
	const token = await firebase.auth().currentUser?.getIdToken(true)
	if (!token) {
		throw new Error("Not authorized in firebase")
	}

	const res = await fetch(`${REACT_APP_CLOUD_FUNCTIONS_URL}/editUser`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify(user)
	})
	if (res.status !== 200) {
		throw new Error("Failed to edit user")
	}
}

export default editUser
