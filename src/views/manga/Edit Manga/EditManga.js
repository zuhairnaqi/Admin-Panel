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


    // componentDidMount() {

    //     db.collection("MANGA_DETAIL").where("alias", "==", this.props.match.params.id)
    //         .get()
    //         .then(querySnapshot => {
    //             querySnapshot.docs.forEach(doc => {
    //                 var data = doc.data();
    //                 var chp = [];
    //                 for (let i = 0; i < data.chapters_len; i++) {
    //                     var index = data.chapters[[`${i}`]][["2"]];
    //                     chp.push(index);
    //                 }
    //                 data.chapters = chp;
    //                 this.setState({ mangaDetail: data })
    //             })
    //         })
    //         .catch(error => {
    //             console.log("Error getting documents: ", error);
    //         });
    // }


    // ChangeTitle = (e) => { this.setState({ title: e.target.value }) }
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
                // title: "Joshiraku",
                // artist: "Yasu",
                // alias: "joshiraku",
                // author: "KUMETA Kouji",
                // released: 2009,
                // description: "A joint effort between popular illustrator Yasu and KUMETA Kouji, creator of Sayonara Zet",
                // categories: ["Shounen", "Comedy", "Slice of Life"]
                title: state.title,
                artist: state.artist,
                alias: state.alias,
                author: state.author,
                released: state.released,
                description: state.description,
                categories: state.categories
            });
        }
    }

    Update = () => {
        const { title,artist, alias, author, released, description, categories } = this.state;
        const { id } = this.props.location.state;
        db.collection("MANGA_DETAIL").doc(id).update({
            artist, alias, author, released, description, categories
        })
        .then( () => {
          swal("Good job!", "Edited Profile successfully!!", "success");
          this.props.history.push(`/manga/ShowDetails${title}`);
        })
        .catch( error => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }

    render() {
        const { artist, alias, author, released, description, categories } = this.state;
        const { state } = this.props.location;
        return (
            <div>
                {!state && <b>Your Page is relaoded therefore data crashed</b>}
                {state && <h1 style={heading1}>Edit Manga</h1>}

                {state && <div style={Edit_Form}>
                    <br />

                    {/* <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1"><b>Title</b></InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                        type="text"
                        value={title}
                        onChange={this.ChangeTitle}
                    />
                    </InputGroup> */}
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
                    <br/>
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
                    <br/>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control as="textarea" rows="3" onChange={this.ChangeDescription} value={description} />
                    </Form.Group>
                    <br />

                    <Button bsStyle="primary" onClick={this.Update}>Save</Button>
                    <br/>
                </div>}

            </div>
        )
    }
}

export default EditManga;

const Edit_Form = {
    margin : "0 auto",
    textAlign : 'center',
    margin : '0 15% 0 15%'
}

const heading1 = {
    textAlign : 'center',
    margin: "1em 0 0.5em 0",
	color: "#343434",
	fontWeight: "normal",
	fontFamily: "'Ultra', sans-serif",
	fontSize: "36px",
	lineHeight: "42px",
	textTransform: "uppercase",
	textShadow: "0 2px white, 0 3px #777",
}