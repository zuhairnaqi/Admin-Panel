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
        db.collection("CHAPTER_PAGE").doc(id).get()
            .then(doc => {
                if (doc.exists) {
                    console.log("Document data:", doc.data().chapt);
                    const chptPages = doc.data().chapt;
                    const chptId = doc.id;
                    this.setState({ chptPages,chptId })
                } else {
                    console.log("No such document!");
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });

    }

    render() {
        const { chptPages,chptId } = this.state;
        const { id } = this.props.match.params
        console.log(id);
        return (
            <div>
                <h1 style={titleCss}>Chapter Pages</h1>
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
                }}>Delete Manga</Button>

                <Button bsStyle="success" style={edit_btn} onClick={() => this.props.history.push({
                    pathname: '/chapters/ShowChapter/EditChapter',
                    state : {
                        chptPages,
                        chptId
                    }
                })}>Edit Manga</Button>

                <div style={crouselCss}>
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
    marginTop : '-8px'
}
const img = {
    width: '55%',
    marginBottom: '-10%'
}
const crouselCss = {
    width: "60%",
    margin: "0 auto",
    alignItems: 'center',
    height: "100vh"
}
const edit_btn = {
    float: 'right',
    margin: "2% 2% 0 0",
    marginTop : '-10px'
  }
