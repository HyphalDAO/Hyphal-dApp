import React, {FunctionComponent} from "react"
import "./styles.scss"
import Logo from "../../icons/Logo"
import {Link} from "react-router-dom"

const Footer: FunctionComponent = () => {
	return (
		<footer className="footer">
			<div className="footer__wrap">
				<div className="footer__col">
					<Link to="/">
						<Logo width={150} height={30} fill="white" />
					</Link>
					© TokenWalk 2021
				</div>
				<div className="footer__col">
					<h3>Resources</h3>
					<a>Learn</a>
					<a>Guidelines</a>
					<a>FAQ</a>
					<a>Report Content</a>
				</div>
				<div className="footer__col">
					<h3>Company</h3>
					<a>Terms of Service</a>
					<a>Privacy Policy</a>
				</div>
			</div>
		</footer>
	)
}

export default Footer
