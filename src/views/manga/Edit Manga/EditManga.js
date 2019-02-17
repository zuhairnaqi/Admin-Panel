import React, { Component } from 'react';
import { Button, FormControl, Form, InputGroup } from 'react-bootstrap';
import firebase from '../../Config/Firebase'
import swal from 'sweetalert';

var db = firebase.firestore();

class EditManga extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    ChangeAlias = (e) => { this.setState({ alias: e.target.value }) }
    ChangeArtist = (e) => { this.setState({ artist: e.target.value }) }
    ChangeAuthor = (e) => { this.setState({ author: e.target.value }) }
    ChangeReleased = (e) => { this.setState({ released: e.target.value }) }
    ChangeDescription = (e) => { this.setState({ description: e.target.value }) }
    ChangeCategory = (index, e) => {
        const { categories } = this.state;
        categories[index] = e.target.value;
        this.setState({ categories });
    }

    componentWillMount() {
        const { state } = this.props.location;
        console.log(state);
        if (state) {
            this.setState({
                title: state.manga.title,
                artist: state.manga.artist,
                alias: state.manga.alias,
                author: state.manga.author,
                released: state.manga.released,
                description: state.manga.description,
                categories: state.manga.categories
            });
        }
    }

    Update = () => {
        const { title, artist, alias, author, released, description, categories } = this.state;
        const { docId, chapters } = this.props.location.state.manga;
        const { page,manga } = this.props.location.state;
        const image = manga.image;
        db.collection(`Page_${page}`).doc(docId).update({
            artist, alias, author, released, description, categories
        })
            .then(() => {
                swal("Good job!", "Edited Profile successfully!!", "success");
                this.props.history.push({
                    pathname: `/manga/ShowDetails`,
                    state: { 
                        manga : { title, artist, alias, author, released, description, categories, docId, chapters, image },
                        page
                     }
                });
            })
            .catch(error => {
                console.error("Error updating document: ", error);
            });
    }

    render() {
        const { artist, alias, author, released, description, categories } = this.state;
        const { state } = this.props.location;
        console.log(this.props);
        return (
            <div>
                {!state && <b>Your Page is relaoded therefore data crashed</b>}
                {state && <h1 style={heading1}>Edit Manga</h1>}

                {state && <div style={Edit_Form}>
                    <br />
                    
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1"><b>Alias</b></InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            type="text"
                            value={alias}
                            onChange={this.ChangeAlias}
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1"><b>Artist</b></InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            type="text"
                            value={artist}
                            onChange={this.ChangeArtist}
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1"><b>Author</b></InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            type="text"
                            value={author}
                            onChange={this.ChangeAuthor}
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1"><b>Released Date</b></InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            type="number"
                            value={released}
                            placeholder="Enter phone number"
                            onChange={this.ChangeReleased}
                        />
                    </InputGroup>

                    <br />

                    <h4>Categories</h4>
                    <br />
                    {categories.map((value, index) => {
                        return <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">{index + 1}</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                type="text"
                                value={value}
                                placeholder="Enter your nick name"
                                onChange={this.ChangeCategory.bind(this, index)}
                            />
                        </InputGroup>
                    })}
                    <br />

                    <h4>Description</h4>
                    <br />
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control as="textarea" rows="3" onChange={this.ChangeDescription} value={description} />
                    </Form.Group>
                    <br />

                    <Button bsStyle="primary" onClick={this.Update}>Save</Button>
                    <br />
                </div>}

            </div>
        )
    }
}

export default EditManga;

const Edit_Form = {
    margin: "0 auto",
    textAlign: 'center',
    margin: '0 15% 0 15%'
}

const heading1 = {
    textAlign: 'center',
    margin: "1em 0 0.5em 0",
    color: "#343434",
    fontWeight: "normal",
    fontFamily: "'Ultra', sans-serif",
    fontSize: "36px",
    lineHeight: "42px",
    textTransform: "uppercase",
    textShadow: "0 2px white, 0 3px #777",
}