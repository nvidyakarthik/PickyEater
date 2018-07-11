import React, { Component } from "react";
import Container from "../../components/Container";
import "./signUp.css";
import API from "../../utils/API";
import { Redirect } from 'react-router-dom'

class SignUp extends Component {
   constructor(){ 
       super();
    this.state = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPass: "",
        restaurantOwner: false,
        redirectTo:null
    };
    this.handleInputChange=this.handleInputChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
}

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };
    handleSubmit=(event)=>{
        event.preventDefault();
        API.signUpUser({
            firstName:this.state.firstName,
            lastName:this.state.lastName,
            email:this.state.email,
            password:this.state.password,
            restaurantOwner:this.state.restaurantOwner
        })
        .then(response => {
            console.log(response)
            if (!response.data.errmsg) {
                console.log('youre good')
                this.setState({
                    redirectTo: '/login'
                })
            } else {
                console.log('duplicate')
            }
        });
    }

    render() {
        if (this.state.redirectTo) {
			return <Redirect to={{ pathname: this.state.redirectTo }} />
		}
        return (
            <Container>
                <div className="half">
                    <h3 className="title">Sign Up</h3>

                    <form>
                        <input
                            name="firstName"
                            placeholder="First Name (required)"
                            value={this.state.firstName}
                            onChange={this.handleInputChange}
                        />
                        <input
                            name="lastName"
                            placeholder="Last Name (required)"
                            value={this.state.lastName}
                            onChange={this.handleInputChange}
                        />
                        <input
                            name="email"
                            placeholder="Email (required)"
                            value={this.state.username}
                            onChange={this.handleInputChange}
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password (required)"
                            value={this.state.password}
                            onChange={this.handleInputChange}
                        />
                        <input
                            name="confirmPass"
                            type="password"
                            placeholder="Confirm Password (required)"
                            value={this.state.confirmPass}
                            onChange={this.handleInputChange}
                        />
                        <button id="createAcc" onClick={this.handleSubmit}>Create Account</button>
                    </form>
                </div>               
            </Container>
        )
    }
};

export default SignUp;