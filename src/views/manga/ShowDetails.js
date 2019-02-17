import React, { Component } from 'react';
import firebase from '../Config/Firebase'
import { timeout } from 'q';
import loader from '../../images/loader.gif';
import { Button, Table } from 'react-bootstrap';
import swal from 'sweetalert';

var db = firebase.firestore();
// Disable deprecated features
// db.settings({
//   timestampsInSnapshots: true
// });

class Manga extends Component {
  constructor(props) {
    super(props);
    this.state = {
      manga: "",
      mangaId: ""
    }
  }

  DeleteDoc = async () => {
    const { state } = this.props.location;
    // this.DeleteFileFromMangaList();
    this.AddDeleteFileToFirebase();
    db.collection(`Page_${state.page}`).doc(state.manga.docId).delete().then(function () {
      console.log("Document successfully deleted!");

      swal("Poof! You deleted manga successfully!", { icon: "success" });

    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }

  AddDeleteFileToFirebase = async () => {
    const { manga, page } = this.props.location.state;
    db.collection(`DELETED_Page_${page}`).doc(manga.docId).set(manga)
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
    const { state } = this.props.location;
    console.log(this.props);

    return (
      <div className="App">

        {!state && <b>Page is reloaded therefore data crashed please go to back page</b> }
        <br/>

        {!state && <img src={loader} style={{ margin: '10px 50px 0px 26%', width: '45%' }} />}


        {state && <div>

          {state.manga && <div style={DetailContainer}>
            <h1 style={titleCss}>{state.manga.title}</h1>

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
                  }
                });
            }}>Delete Manga</Button>

            <Button bsStyle="success" style={edit_btn} onClick={() => this.props.history.push({
              pathname: '/manga/ShowDetails/EditManga',
              state: state
            })}>Edit Manga</Button>
            <img src={`https://cdn.mangaeden.com/mangasimg/${state.manga.image}`} style={img} />

            <br />
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th style={th}>Alias</th>
                  <td style={td}>{state.manga.alias}</td>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <th style={th}>Artist</th>
                  <td style={td}>{state.manga.artist}</td>
                </tr>
                <tr>
                  <th style={th}>Author</th>
                  <td style={td}>{state.manga.author}</td>
                </tr>
                <tr>
                  <th style={th}>Released Date</th>
                  <td style={td}>{state.manga.released}</td>
                </tr>
                <tr>
                  <th style={th}>Discription</th>
                  <td style={td}>{state.manga.description}</td>
                </tr>
                <tr>
                  <th style={th}>Categories</th>
                  <td style={td}><ul>{state.manga.categories.map(value => {
                    return <li>{value}</li>
                  })}</ul></td>
                </tr>
              </tbody>

            </Table>

            <br />
            <h1 style={{ marginBottom: '15px' }}>Chapters :  </h1>
            {state.manga.chapters.map(value => {
              return <li style={chp_list}>{value['2']}</li>
            })}
          </div>}
        </div>}




      </div>
    )
  }
}
export default Manga;

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
}

const DetailContainer = {
  border: '1px solid #dad7d7',
  marginBottom: '10px',
  margin: '0 auto',
}

const fetchedData = {
  float: 'right',
  marginRight: "60%"
}

const img = {
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
  marginTop: "10px",
  marginBottom: '20px',
  width: "35%",
}
const th = {
  textAlign: 'center',
  color: '#3c3e40',
  marginLeft: "5px",
  marginRight: '5px'
}
const td = {
  color: '#6a6e71',
  marginLeft: '10px',
  padding: '7px'
}
const edit_btn = {
  float: 'right',
  margin: "2% 2% 0 0"
}
const chp_list = {
  // fontSize : '15px',
  marginLeft: '15px',
  color: '#6a6e71'
}