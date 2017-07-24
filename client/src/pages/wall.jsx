import React from 'react';
import Auth from '../modules/auth';

var Panel = require('react-bootstrap').Panel;
var Grid = require('react-bootstrap').Grid;
var ControlLabel = require('react-bootstrap').ControlLabel;
var FormControl = require('react-bootstrap').FormControl;
var FormGroup = require('react-bootstrap').FormGroup;
var Form = require('react-bootstrap').Form;
var Button = require('react-bootstrap').Button;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;
var Col = require('react-bootstrap').Col;
var Row = require('react-bootstrap').Row;

class Wall extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            secretData: ''
        };
    }

    componentDidMount() {
        const xhr = new XMLHttpRequest();
        xhr.open('get', '/api/wall');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // set the authorization HTTP header
        xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                
            }
        });
        xhr.send();
    }

  /**
   * Render the component.
   */
   render() {
        return (
            <Grid>
                <Panel header="LaboratoriaFacebook Muro">
                    <Form>
                        <FormGroup controlId="formControlsTextarea">
                            <FormControl componentClass="textarea" placeholder="¿En qué estás pensando?" />
                        </FormGroup>
                        <Row className="show-grid">
                            <Col xs={4} xsOffset={10}>
                                <ButtonGroup >
                                    <Button bsStyle="primary">Publicar</Button>
                                    <DropdownButton title="Amigos" id="bg-nested-dropdown">
                                        <MenuItem eventKey="1">Amigos</MenuItem>
                                        <MenuItem eventKey="2">Publico</MenuItem>
                                    </DropdownButton>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </Form>
                </Panel>
            </Grid>
        );
   }

}

export default Wall;