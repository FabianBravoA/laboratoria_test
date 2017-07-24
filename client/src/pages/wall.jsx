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
var HelpBlock = require('react-bootstrap').HelpBlock;
var Tabs = require('react-bootstrap').Tabs;
var Tab = require('react-bootstrap').Tab;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var Modal = require('react-bootstrap').Modal;

class Wall extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            entryToDelete : null,
            validationEntryError : false,
            newEntry : "",
            entries : [],
            selectedPrivacy : "Amigos"
        };

        this.refreshEntries = this.refreshEntries.bind(this);
        this.onEntryChange = this.onEntryChange.bind(this);
        this.onPrivacySelect = this.onPrivacySelect.bind(this);
        this.onPublish = this.onPublish.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onEditSubmit = this.onEditSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onPreDelete = this.onPreDelete.bind(this);
        this.dismissDelete = this.dismissDelete.bind(this);
    }

    componentDidMount() {
        console.log("Component mount, now refreshing entries for this user")
        this.refreshEntries();
    }

    refreshEntries(){
        const xhr = new XMLHttpRequest();
        xhr.open('get', '/api/wall/list');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                this.setState({
                    entries : xhr.response
                });
            }
        });
        xhr.send();
    }

    onPreDelete(event, entryId){
        this.setState({
            entryToDelete : entryId
        });
    }

    dismissDelete(event){
        this.setState({
            entryToDelete : null
        });
    }

    onDelete(){
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/api/wall/'+this.state.entryToDelete, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                this.refreshEntries();
                this.setState({
                    entryToDelete : null
                });
            }
        });
        xhr.send();
    }

    onPrivacySelect(event){
        this.setState({
            selectedPrivacy : event
        });
    }

    onEntryChange(event){
        this.setState({
            validationEntryError : false,
            newEntry : event.target.value
        });
    }

    onEntryEdit(event, entryId){
        const entry = this.state.entries.find((entry)=>{return entry._id == entryId});
        if(entry != null){
            entry.message = event.target.value;
        }

        this.setState({
            entries : this.state.entries
        });
    }

    onEditSubmit(event, entryId){
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', '/api/wall/'+entryId, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                this.setState({
                    entries : this.state.entries.concat([xhr.response]).filter((entry) => {return !entry.editMode})
                });
            }
        });
        xhr.send(JSON.stringify({
            message : this.state.entries.find((entry) => {return entry._id == entryId}).message,
        }));
    }

    onPublish(event){
        event.preventDefault();

        if(!this.state.newEntry || this.state.newEntry == ""){
            this.setState({
                validationEntryError : true
            });
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/wall/', true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                this.setState({
                    newEntry : "",
                    entries : this.state.entries.concat([xhr.response])
                });
            }
        });
        xhr.send(JSON.stringify({
            message : this.state.newEntry,
            privacyLevel : this.state.selectedPrivacy
        }));
    }

    onEdit(event, entryId){
        const entry = this.state.entries.find((entry)=>{return entry._id == entryId});
        if(entry != null){
            entry.editMode = true;
        }

        console.log("Entry edit mode > "+JSON.stringify(entry));

        this.setState({
            entries : this.state.entries
        });
    }

    render() {
        const publicPosts     = this.state.entries.filter((entry) => {return entry.privacyLevel == "Público"})
                                    .map((entry)=>
                                        <Panel key={entry._id}>
                                            {entry.editMode &&
                                                <div>
                                                    <FormControl name={entry._id} onChange={(event) => {this.onEntryEdit(event, entry._id)}} componentClass="textarea" placeholder="Tu publicación editada" value={entry.message} />
                                                    <Button bsSize="xsmall" onClick={(event)=>{this.onEditSubmit(event, entry._id);}}>Editar</Button>
                                                </div>
                                            }
                                            {!entry.editMode &&
                                                <div>
                                                    {entry.message}
                                                    <ButtonToolbar>
                                                        <Button bsSize="xsmall" onClick={(event)=>{this.onEdit(event, entry._id);}}>Editar</Button>
                                                        <Button bsSize="xsmall" onClick={(event)=>{this.onPreDelete(event, entry._id);}}>Eliminar</Button>
                                                    </ButtonToolbar>
                                                </div>
                                            }
                                        </Panel>
                                    );
        const friendPosts     = this.state.entries.filter((entry) => {return entry.privacyLevel == "Amigos"})
                                    .map((entry)=>
                                        <Panel key={entry._id}>
                                            {entry.editMode &&
                                                <div>
                                                    <FormControl name={entry._id} onChange={(event) => {this.onEntryEdit(event, entry._id)}} componentClass="textarea" placeholder="Tu publicación editada" value={entry.message} />
                                                    <Button bsSize="xsmall" onClick={(event)=>{this.onEditSubmit(event, entry._id);}}>Editar</Button>
                                                </div>
                                            }
                                            {!entry.editMode &&
                                                <div>
                                                    {entry.message}
                                                    <ButtonToolbar>
                                                        <Button bsSize="xsmall" onClick={(event)=>{this.onEdit(event, entry._id);}}>Editar</Button>
                                                        <Button bsSize="xsmall" onClick={(event)=>{this.onPreDelete(event, entry._id);}}>Eliminar</Button>
                                                    </ButtonToolbar>
                                                </div>
                                            }
                                        </Panel>
                                    );
        return (
            <Grid>
                <Panel header="LaboratoriaFacebook Muro">
                    <Form>
                        <FormGroup controlId="formControlsTextarea" validationState={this.state.validationEntryError ? "error" : null}>
                            <FormControl value={this.state.newEntry} componentClass="textarea" placeholder="¿En qué estás pensando?" name="entry" onChange={this.onEntryChange} />
                            {this.state.validationEntryError &&
                                <HelpBlock>Debes escribir algo para poder publicar</HelpBlock>
                            }
                        </FormGroup>
                        <Row className="show-grid">
                            <Col xs={4} xsOffset={10}>
                                <ButtonGroup >
                                    <Button bsStyle="primary" onClick={this.onPublish}>Publicar</Button>
                                    <DropdownButton title={this.state.selectedPrivacy} id="bg-nested-dropdown" onSelect={this.onPrivacySelect}>
                                        <MenuItem eventKey="Amigos">Amigos</MenuItem>
                                        <MenuItem eventKey="Público">Público</MenuItem>
                                    </DropdownButton>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </Form>

                    <Tabs defaultActiveKey={1} id="entriesTabs">
                        <Tab eventKey={1} title="Público">
                            {publicPosts}
                        </Tab>
                        <Tab eventKey={2} title="Amigos">
                            {friendPosts}
                        </Tab>
                    </Tabs>
                </Panel>
                <Modal show={this.state.entryToDelete} onHide={this.dismissDelete}>
                    <Modal.Header closeButton>
                        <Modal.Title>¿Estás seguro de borrar esta entrada?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>¡La entrada se borrará permanentemente!</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.onDelete}>Borrar</Button>
                    </Modal.Footer>
                </Modal>
            </Grid>
        );
   }

}

export default Wall;