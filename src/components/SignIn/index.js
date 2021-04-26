import React, { Component } from 'react'
import './styles.scss'
import { signInWithGoogle, auth } from './../../firebase/utils'

import FormInput from './../Forms/FormInput'
import Button from './../Forms/Button'

const initialState = {
	email: '',
	password: ''
}

class SignIn extends Component {
	constructor(props) {
		super(props)
		this.setState({
			...initialState
		})

		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(e) {
		const { name, value } = e.target
		this.setState({
			[name]: value
		})
	}

	handleSubmit = async e => {
		const { email, password } = this.state
		e.preventDefault()

		try {
			await auth.signInWithEmailAndPassword(email, password)
			this.setState({
				...initialState
			})
		} catch (err) {
			console.log(err)
		}
	}

	render() {
		const { email, password } = this.setState

		return (
			<div className="signin">
				<div className="wrap">
					<h2>
						Login
					</h2>

					<div className="formWrap">
						<form onSubmit={this.handleSubmit}>

							<FormInput
								type="email"
								name="email"
								value={email}
								placeholder="Email"
								handleChange={this.handleChange}
							/>

							<FormInput
								type="password"
								name="password"
								value={password}
								placeholder="Password"
								handleChange={this.handleChange}
							/>

							<Button type="submit">
								LogIn
							</Button>

							<div className="socialSignin">
								<div className="row">
									<Button onClick={signInWithGoogle}>
										Sign In With Google
									</Button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

export default SignIn