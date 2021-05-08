import React, {FunctionComponent} from "react"
import {Link} from "react-router-dom"
import "./styles.scss"

const AdminToolbar: FunctionComponent = () => {
	const isAdmin = false // TODO
	if (!isAdmin) return null

	return (
		<div className="admintoolbar">
			<ul>
				<li>
					<Link to="/admin">Admin</Link>
				</li>
			</ul>
		</div>
	)
}

export default AdminToolbar
