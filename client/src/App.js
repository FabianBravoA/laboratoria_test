import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'

import Auth from './modules/auth';
import Wall from './pages/wall.jsx';
var Form = require('react-bootstrap').Form;
var FormControl = require('react-bootstrap').FormControl;
var FormGroup = require('react-bootstrap').FormGroup;
var FormData = require('react-bootstrap').FormData;
var Col = require('react-bootstrap').Col;
var Button = require('react-bootstrap').Button;
var ControlLabel = require('react-bootstrap').ControlLabel;
var Panel = require('react-bootstrap').Panel;
var Grid = require('react-bootstrap').Grid;
var HelpBlock = require('react-bootstrap').HelpBlock;
var Alert = require('react-bootstrap').Alert;

const AuthRouter = () => (
    <Router>
        <div>
            <Main/>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <PrivateRoute path="/wall" component={Wall}/>
        </div>
    </Router>   
)

const Main = withRouter(({ history }) => (
    Auth.isUserAuthenticated() ? (
        <Redirect to="/wall"/>
        ) : (
        <div>
            <p>No has iniciado sesión : </p>
            <button type="login" onClick={function(){
                history.push("/login")
            }} className="btn btn-default">Log-in</button>
            <button type="login" onClick={function(){
                history.push("/register")
            }} className="btn btn-default">Registrarse</button>
        </div>
        )
    )
)

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        Auth.isUserAuthenticated() ? (
            <Component {...props}/>
            ) : (
            <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }}/>
            )
            )}/>
    )

class Register extends React.Component {
    state = {
        redirectToReferrer: false
    }

    constructor(props, context) {
        super(props, context);

        // set the initial component state
        this.state = {
            validationMessages : {
                email : "",
                name : "",
                password : ""
            },
            validationState : {
                email : null,
                name : null,
                password : null
            },
            errors: {},
            user: {
                email: '',
                name: '',
                password: ''
            }
        };

        this.validateEmail = this.validateEmail.bind(this);
        this.onRegister = this.onRegister.bind(this);
        this.onChangeUser = this.onChangeUser.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    validateForm(){
        const validationState = this.state.validationState;
        const user = this.state.user;
        const validationMessages = this.state.validationMessages;
        var validationResult = true;
        if(this.state.user.name == null || this.state.user.name == ""){
            validationMessages.name = "Tienes que ingresar tu nombre";
            validationState.name = "error";
            validationResult = false;
        }else{
            validationState.name = "success";
        }

        if(this.state.user.email == null || this.state.user.email == ""){
            validationMessages.email = "Tienes que ingresar tu correo";
            validationState.email = "error";
            validationResult = false;
        }else if(!this.validateEmail(this.state.user.email)){
            validationMessages.email = "Tienes que ingresar un correo de verdad";
            validationState.email = "error";
            validationResult = false;
        }else{
            validationState.email = "success";
        }

        if(this.state.user.password == null || this.state.user.password == ""){
            validationMessages.password = "Tienes que ingresar una contraseña";
            validationState.password = "error";
            validationResult = false;
        }

        this.setState({
            user : user,
            validationMessages : validationMessages,
            validationState : validationState
        });

        return validationResult;
    }

    onChangeUser(event) {
        const field = event.target.name;
        const user = this.state.user;
        const validationState = this.state.validationState;
        const validationMessages = this.state.validationMessages;
        user[field] = event.target.value;
        validationState[field] = null;
        validationMessages[field] = "";

        this.setState({
            user : user,
            validationState : validationState,
            validationMessages : validationMessages
        });
    }

    onRegister (event) {
        event.preventDefault();

        if(!this.validateForm()){
            return;
        }

        const name = encodeURIComponent(this.state.user.name);
        const email = encodeURIComponent(this.state.user.email);
        const password = encodeURIComponent(this.state.user.password);
        const formData = `name=${name}&email=${email}&password=${password}`;

        const xhr = new XMLHttpRequest();
        xhr.open('post', '/login/signup');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                this.setState({
                    errors: {}
                });

                localStorage.setItem('successMessage', "Registrado en laboratoriaFacebook");

                this.props.history.push('/login');
            } else {
                const errors = xhr.response.errors ? xhr.response.errors : {};
                errors.summary = xhr.response.message;

                this.setState({
                    errors
                });
            }
        });
        xhr.send(formData);
    }

    render(){
        return <Grid>
                <Panel header="Regístrate en LaboratoriaFacebook">
                    <Form horizontal>
                        <FormGroup controlId="name" validationState={this.state.validationState.name}>
                            <Col componentClass={ControlLabel} sm={2}>
                                Nombre
                            </Col>
                            <Col sm={10}>
                                <FormControl name="name" type="text" placeholder="Nombre" value={this.state.user.name} onChange={this.onChangeUser}/>
                                {this.state.validationState.name == "error" &&
                                    <HelpBlock>{this.state.validationMessages.name}</HelpBlock>
                                }
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="email" validationState={this.state.validationState.email}>
                            <Col componentClass={ControlLabel} sm={2}>
                                Email
                            </Col>
                            <Col sm={10}>
                                <FormControl name="email" type="email" placeholder="Email" value={this.state.user.email} onChange={this.onChangeUser}/>
                                {this.state.validationState.email == "error" &&
                                    <HelpBlock>{this.state.validationMessages.email}</HelpBlock>
                                }
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="password" validationState={this.state.validationState.password}>
                            <Col componentClass={ControlLabel} sm={2}>
                                Password
                            </Col>
                            <Col sm={10}>
                                <FormControl name="password" type="password" placeholder="Password" value={this.state.user.password} onChange={this.onChangeUser}/>
                                {this.state.validationState.password == "error" &&
                                    <HelpBlock>{this.state.validationMessages.password}</HelpBlock>
                                }
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col smOffset={2} sm={10}>
                                <Button type="submit" onClick={this.onRegister}>
                                    Registrarse
                                </Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </Panel>
            </Grid>
    }
}

class Login extends React.Component {
    state = {
        redirectToReferrer: false
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            validationMessages : {
                email : "",
                password : ""
            },
            validationState : {
                email : null,
                password : null
            },
            errors: {},
            user: {
                email: '',
                password: ''
            }
        };

        this.validateEmail = this.validateEmail.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onChangeUser = this.onChangeUser.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    validateForm(){
        const validationState = this.state.validationState;
        const user = this.state.user;
        const validationMessages = this.state.validationMessages;
        var validationResult = true;

        if(this.state.user.email == null || this.state.user.email == ""){
            validationMessages.email = "Tienes que ingresar tu correo";
            validationState.email = "error";
            validationResult = false;
        }else if(!this.validateEmail(this.state.user.email)){
            validationMessages.email = "Tienes que ingresar un correo de verdad";
            validationState.email = "error";
            validationResult = false;
        }else{
            validationState.email = "success";
        }

        if(this.state.user.password == null || this.state.user.password == ""){
            validationMessages.password = "Tienes que ingresar una contraseña";
            validationState.password = "error";
            validationResult = false;
        }

        this.setState({
            user : user,
            validationMessages : validationMessages,
            validationState : validationState
        });

        return validationResult;
    }

    onChangeUser(event) {
        const field = event.target.name;
        const user = this.state.user;
        const validationState = this.state.validationState;
        const validationMessages = this.state.validationMessages;
        user[field] = event.target.value;
        validationState[field] = null;
        validationMessages[field] = "";

        this.setState({
            user : user,
            validationState : validationState,
            validationMessages : validationMessages
        });
    }

    onLogin(event){
        event.preventDefault();

        if(!this.validateForm()){
            return;
        }

        // create a string for an HTTP body message
        const email = encodeURIComponent(this.state.user.email);
        const password = encodeURIComponent(this.state.user.password);
        const formData = `email=${email}&password=${password}`;

        // create an AJAX request
        const xhr = new XMLHttpRequest();
        xhr.open('post', '/login/signin');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                this.setState({
                    errors: {}
                });

                Auth.authenticateUser(xhr.response.token);

                this.props.history.push('/wall');
            } else {
                this.setState({
                    errors : {
                        message : "WRONG_USER_PASSWORD"
                    }
                });
            }
        });
        xhr.send(formData);
    }

    render() {
        return (
            <Grid>
                <Panel header="Log-in en LaboratoriaFacebook">
                    {this.state.errors && this.state.errors.message == "WRONG_USER_PASSWORD" &&
                        <Alert bsStyle="danger">
                            <strong>Email o password incorrectos</strong> Revisa que hayas escrito tu información correctamente
                        </Alert>
                    }
                    <Form horizontal>
                        <FormGroup controlId="email" validationState={this.state.validationState.email}>
                            <Col componentClass={ControlLabel} sm={2}>
                                Email
                            </Col>
                            <Col sm={10}>
                                <FormControl name="email" type="email" placeholder="Email" value={this.state.user.email} onChange={this.onChangeUser}/>
                                {this.state.validationState.email == "error" &&
                                    <HelpBlock>{this.state.validationMessages.email}</HelpBlock>
                                }
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="password" validationState={this.state.validationState.password}>
                            <Col componentClass={ControlLabel} sm={2}>
                                Password
                            </Col>
                            <Col sm={10}>
                                <FormControl name="password" type="password" placeholder="Password" value={this.state.user.password} onChange={this.onChangeUser}/>
                                {this.state.validationState.email == "error" &&
                                    <HelpBlock>{this.state.validationMessages.password}</HelpBlock>
                                }
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col smOffset={2} sm={10}>
                                <Button type="submit" onClick={this.onLogin}>
                                    Log in
                                </Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </Panel>
            </Grid>
        );
    }
}


export default AuthRouter;
