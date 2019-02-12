import React, { Component } from 'react';
import firebase from '../Config/Firebase';
import loader from '../../images/loader.gif';
import { Carousel } from 'react-responsive-carousel';
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Button, Table } from 'react-bootstrap';
import swal from 'sweetalert';

var db = firebase.firestore();
// Disable deprecated features
db.settings({
    timestampsInSnapshots: true
});
// const CHAPTER_PAGES = "https://www.mangaeden.com/api/chapter/";

class ShowChapter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chptPages: ''
        }
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        var docId = id.slice(0, id.indexOf('-'));
        db.collection("CHAPTER_PAGE").doc(docId).get()
            .then(doc => {
                if (doc.exists) {
                    console.log("Document data:", doc.data().chapt);
                    const chptPages = doc.data().chapt;
                    const chptId = doc.id;
                    this.setState({ chptPages, chptId })
                } else {
                    console.log("No such document!");
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });

    }


    DeleteDoc = async () => {
        const { mangaDetail } = this.state;
        const { id } = this.props.match.params;
        var docId = id.slice(0, id.indexOf('-'));
        var prevId = id.slice(id.indexOf('-') + 1);
        this.DeleteChapterFromMangaDetails(prevId, docId);
        this.AddDeleteChapterToFirebase(docId);
        db.collection("CHAPTER_PAGE").doc(id).delete().then(function () {
            console.log("Document successfully deleted!");
            swal("Poof! You deleted manga successfully!", { icon: "success" });
            this.props.history.push("/chapters");

        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });
    }

    DeleteChapterFromMangaDetails = (prevId, docId) => {
        db.collection("MANGA_DETAIL").doc(prevId).get()
            .then(doc => {
                console.log(doc.data());
                console.log(doc.data().chapters);
                var chapters = doc.data().chapters;
                chapters.filter((value, index) => {
                    if (value['3'] === docId) {
                        chapters.splice(index, 1);
                    }
                })
                db.collection("MANGA_DETAIL").doc(prevId).update({
                    chapters
                })
                    .then(() => {
                        console.log("Chapter successfully deleted and manga updated !!")
                    })
                    .catch(error => {
                        console.error("Error updating document: ", error);
                    });

                console.log("Document successfully deleted!");

                swal("Poof! You deleted manga successfully!", { icon: "success" });

            }).catch(function (error) {
                console.error("Error removing document: ", error);
            });
    }

    AddDeleteChapterToFirebase = async (id) => {
        const { chptPages } = this.state;
        db.collection("DELETED_IMAGES").doc(id).set({ chptPages })
            .then(function () {
                console.log("Document successfully written!");
                this.props.history.push('/manga');
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    render() {
        const { chptPages, chptId } = this.state;
        const { id } = this.props.match.params
        console.log(id);
        return (
            <div >

                <div className="jumbotron">
                    <h1 >Chapter Pages</h1>

                    <Button bsStyle="success" style={edit_btn} onClick={() => {
                        swal({
                            title: "Are you sure?",
                            text: `Do you really want to delete this manga?`,
                            icon: "info",
                            buttons: true,
                            dangerMode: true,
                        })
                            .then((willDelete) => {
                                if (willDelete) {
                                    this.DeleteDoc();
                                } else {
                                    swal("Your request is cancelled!", { icon: "error" });
                                    console.log("ohh");
                                }
                            });
                    }}>Delete Chapter</Button>

                    <Button bsStyle="success" style={edit_btn} onClick={() => this.props.history.push({
                        pathname: '/chapters/ShowChapter/EditChapter',
                        state: {
                            chptPages,
                            chptId
                        }
                    })}>Edit Images</Button>
                </div>

                <div className="container" style={crouselCss}>
                    <div class="row">
                        <div class="col-sm-6 col-md-8 col-lg-8">
                            <Carousel showArrows={true}>
                                {chptPages.length && chptPages.map((value, index) => {
                                    return <div>
                                        {value[2] == "/" ? <img src={`https://cdn.mangaeden.com/mangasimg/${value}`} style={img} /> :
                                            <img src={value} style={img} />}
                                        {/* <p className="legend">Page no {index + 1}</p> */}
                                    </div>
                                })}

                            </Carousel>
                        </div>
                    </div>
                </div>


            </div>
        )
    }
}

export default ShowChapter;

const titleCss = {
    display: 'inline',
    marginLeft: '18px',
    marginTop: '18px',
    textAlign: 'center',
    margin: "1em 0 0.5em 0",
    color: "#343434",
    fontWeight: "normal",
    fontFamily: "'Ultra', sans-serif",
    fontSize: "36px",
    lineHeight: "42px",
    textTransform: "uppercase",
    textShadow: "0 2px white, 0 3px #777",
    marginTop: '-8px'
}
const img = {
    width: '90%',
    marginBottom: '-10%'
}
const crouselCss = {
    width: "100%",
    margin: "0 auto",
    alignItems: 'center',
    // height: "100%"
}
const edit_btn = {
    float: 'right',
    margin: "2% 2% 0 0",
    marginTop: '-10px'
}
