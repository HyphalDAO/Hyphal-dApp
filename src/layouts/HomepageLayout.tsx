import React, {FunctionComponent} from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import MainTop from "../components/MainTop"

const HomepageLayout: FunctionComponent = ({children}) => {
	return (
		<div className="fullHeight">
			<Header />
			<MainTop />
			{children}
			<Footer />
		</div>
	)
}

export default HomepageLayout
