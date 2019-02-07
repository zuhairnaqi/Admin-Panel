import React, { Component } from 'react';
import firebase from '../Config/Firebase'
import { timeout } from 'q';
import loader from '../../images/loader.gif';
import { Button, Table } from 'react-bootstrap';
import swal from 'sweetalert';

const MANGA_DETAIL = "https://www.mangaeden.com/api/manga/";
const MANGA_LIST = "https://www.mangaeden.com/api/list/0/";
var db = firebase.firestore();
// Disable deprecated features
// db.settings({
//   timestampsInSnapshots: true
// });

class Manga extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mangaDetail: "",
      mangaId: ""
    }
  }

  componentDidMount() {
    console.log(this.props.match.params.id);
    db.collection("MANGA_DETAIL").where("title", "==", this.props.match.params.id)
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          var data = doc.data();
          console.log(data);
          var chp = [];
          for (let i = 0; i < data.chapters_len; i++) {
            var index = data.chapters[[`${i}`]][["2"]];
            chp.push(index);
          }
          data.chapters = chp;
          data.id = doc.id;
          this.setState({ mangaDetail: data })
        })
      })
      .catch(error => {
        console.log("Error getting documents: ", error);
      });

    

    // Fetch for adding manga detail in firebase 
    // fetch(`${MANGA_LIST}?p=${0}&l=${0}`)
    //   .then(res => {
    //     return res.json();
    //   })
    //   .then(value => {
    //     var mangaArray = value.manga.map(value => value.i);
    //     console.log(value);
    //     this.setState({ mangaId: mangaArray });

    //   })
    //   .catch(err => console.log(err));
  }



  // FetchDocument = async () => {
  //   const { mangaId } = this.state;
  //   for (let i = 0; i < mangaId.length; i++) {
  //     var id = mangaId[i];
  //     // https://cors-anywhere.herokuapp.com/
  //     await new Promise(resolve => setTimeout(resolve, 2000));
  //     fetch(`${MANGA_DETAIL}${id}`)
  //       .then(res => {
  //         return res.json();
  //       })
  //       .then(value => {
  //         console.log(value);
  //         if (value.chapters.length !== 0) {
  //           value.chapters = { ...value.chapters };
  //         }

  //         db.collection("MANGA_DETAIL").doc(id).set(value, { merge: true })
  //           .then(function () {
  //             console.log("Document successfully written! page " + i);
  //           })
  //           .catch(function (error) {
  //             console.error("Error writing document: ", error);
  //           });
  //       })
  //       .catch(err => console.log(err));
  //   }
  // }

  DeleteDoc = () => {
    const { mangaDetail } = this.state;
    db.collection("MANGA_DETAIL").doc(mangaDetail.id).delete().then(function () {
      console.log("Document successfully deleted!");
      swal("Poof! You deleted manga successfully!", { icon: "success" });
      db.collection("DELETED_MANGA").doc(mangaDetail.id).set(mangaDetail)
        .then(function () {
          console.log("Document successfully written!");
          this.props.history.push('/manga');
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });


  }

  render() {
    const { mangaDetail } = this.state;
    console.log(mangaDetail);
    return (
      <div className="App">
        {/* To upload the chapter on firebase  */}
        {/* <button onClick={this.FetchDocument}>Upload chapters on firebase</button> */}


        {!mangaDetail && <img src={loader} style={{ margin: '10px 50px 0px 26%', width: '45%' }} />}

        {mangaDetail && <div style={DetailContainer}>
          <h1 style={titleCss}>{mangaDetail.title}</h1>

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
            pathname: '/manga/ShowDetails/EditManga',
            state: mangaDetail
          })}>Edit Manga</Button>
          <img src={`https://cdn.mangaeden.com/mangasimg/${mangaDetail.image}`} style={img} />

          <br />
          <Table striped bordered hover size="sm">
            <tr>
              <th style={th}>Alias</th>
              <td style={td}>{mangaDetail.alias}</td>
            </tr>
            <tr>
              <th style={th}>Artist</th>
              <td style={td}>{mangaDetail.artist}</td>
            </tr>
            <tr>
              <th style={th}>Author</th>
              <td style={td}>{mangaDetail.author}</td>
            </tr>
            <tr>
              <th style={th}>Released Date</th>
              <td style={td}>{mangaDetail.released}</td>
            </tr>
            <tr>
              <th style={th}>Categories</th>
              <td style={td}><ul>{mangaDetail.categories.map(value => {
                return <li>{value}</li>
              })}</ul></td>
            </tr>
            <tr>
              <th style={th}>Discription</th>
              <td style={td}>{mangaDetail.description}</td>
            </tr>
          </Table>

          <br />
          <h1 style={{ marginBottom: '15px' }}>Chapters :  </h1>
          {mangaDetail.chapters.map(value => {
            return <li style={chp_list}>{value}</li>
          })}
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
  width: "50%",
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