import React, { Component } from 'react';
import { Button, FormControl, Form, InputGroup, Col } from 'react-bootstrap';
import firebase from '../../Config/Firebase'
import swal from 'sweetalert';

var db = firebase.firestore();



class EditChapter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imagePath: '',
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
    // ChangeAlias = (e) => { this.setState({ alias: e.target.value }) }
    // ChangeArtist = (e) => { this.setState({ artist: e.target.value }) }
    // ChangeAuthor = (e) => { this.setState({ author: e.target.value }) }
    // ChangeReleased = (e) => { this.setState({ released: e.target.value }) }
    // ChangeDescription = (e) => { this.setState({ description: e.target.value }) }
    // ChangeCategory = (index, e) => {
    //     const { categories } = this.state;
    //     categories[index] = e.target.value;
    //     this.setState({ categories });
    // }

    // componentWillMount() {
    //     const { state } = this.props.location;
    //     console.log(state);
    //     if (state) {
    //         this.setState({
    //             // title: "Joshiraku",
    //             // artist: "Yasu",
    //             // alias: "joshiraku",
    //             // author: "KUMETA Kouji",
    //             // released: 2009,
    //             // description: "A joint effort between popular illustrator Yasu and KUMETA Kouji, creator of Sayonara Zet",
    //             // categories: ["Shounen", "Comedy", "Slice of Life"]
    //             title: state.title,
    //             artist: state.artist,
    //             alias: state.alias,
    //             author: state.author,
    //             released: state.released,
    //             description: state.description,
    //             categories: state.categories
    //         });
    //     }
    // }

    // Update = () => {
    //     const { title,artist, alias, author, released, description, categories } = this.state;
    //     const { id } = this.props.location.state;
    //     db.collection("MANGA_DETAIL").doc(id).update({
    //         artist, alias, author, released, description, categories
    //     })
    //     .then( () => {
    //       swal("Good job!", "Edited Profile successfully!!", "success");
    //       this.props.history.push(`/manga/ShowDetails${title}`);
    //     })
    //     .catch( error => {
    //         // The document probably doesn't exist.
    //         console.error("Error updating document: ", error);
    //     });
    // }

    FileHandler = (e) => {
        const imgPath = e.target.files[0];
        var storageRef = firebase.storage().ref();
        var imagesRef = storageRef.child('images/photo' + Math.random().toString().substring(2, 6));
        //     // FIRST IMAGE UPLOAD
        new Promise((resolve, reject) => {
            imagesRef.put(imgPath)
                .then(snapshot => {
                    imagesRef.getDownloadURL()
                        .then((downloadURL) => {
                            console.log("Image done", downloadURL);
                            this.setState({ imagePath: downloadURL })
                            resolve(downloadURL);
                        })
                        .catch((error) => {
                            reject(error);
                        })
                })
                .catch((e) => {
                    console.log('Error while uploading', e)
                });
        })
    }


    UpdateImage = () => {
        const { showButtons, imagePath, showIndex } = this.state;
        const { chptPages, chptId, id } = this.props.location.state;
        var page = id.slice(0, 1);
        chptPages[showIndex] = imagePath;
        console.log(chptPages);
        console.log(this.props);
        db.collection(`CHAPTER_PAGE_${page}`).doc(chptId).update({
            ChapterImages: chptPages
        })
            .then(() => {
                swal("Good job!", "Edited Profile successfully!!", "success");
                this.props.history.push(`/chapters/ShowChapter${id}`)
                    // pathname: '/chapters/ShowChapter/EditChapter',
                    // state: {
                    //     chptPages,
                    //     chptId,
                    //     id
                    // }
            })
            .catch(error => {
                console.error("Error updating document: ", error);
            });
    }

    render() {
        const { showButtons, showIndex, imagePath } = this.state;
        const { state } = this.props.location;
        console.log(state);
        return (
            <div>
                {!state && <b>Your Page is relaoded therefore data crashed</b>}
                {state && <h1 style={heading1}>Edit Chapter Image</h1>}

                <br />
                {state && <div style={listContainer}>

                    {state.chptPages.length && state.chptPages.map((value, index) => {
                        return <div key={index} style={{
                            margin: 5,
                            marginBottom: '10%'
                        }}>
                            {(value[2] == "/") ? <img src={`https://cdn.mangaeden.com/mangasimg/${value}`} style={imgCss} /> :
                                <img src={value} style={imgCss} />}

                            {showButtons && showIndex === index &&
                                <Col sm="5">
                                    <div className="custom-file" style={{
                                        marginTop: '10px'
                                    }}>
                                        <input className="custom-file-input" type="file" onChange={this.FileHandler} />
                                        <label class="custom-file-label" for="validatedCustomFile">Choose file...</label>
                                    </div>
                                </Col>
                            }
                            {!showButtons && showIndex !== index && <button  class="btn btn-info" style={EditBtn}
                                onClick={() => this.setState({ showButtons: true, showIndex: index })} >Replace image</button>}

                            {showButtons && showIndex === index && <button  class="btn btn-info" style={{
                                 float: 'right',
                                 marginRight: '10px'
                            }}
                                onClick={() => this.setState({ showButtons: false, showIndex: null })} >Cancel</button>}

                            {showButtons && imagePath && showIndex === index && <button  class="btn btn-info" style={EditBtn}
                                onClick={this.UpdateImage} >Update image</button>}

                        </div>
                    })}

                </div>}

            </div>
        )
    }
}

export default EditChapter;

const imgCss = {
    width: '250px',
    paddingLeft: '20px',

}
const EditBtn = {
    float: 'right',
    marginRight: '10px',
    marginTop: '125px'
}

const listContainer = {
    border: '1px solid #dad7d7',
    marginBottom: '10px',
}

// const Edit_Form = {
//     margin: "0 auto",
//     textAlign: 'center',
//     margin: '0 15% 0 15%',
//     width : '30%'
// }

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