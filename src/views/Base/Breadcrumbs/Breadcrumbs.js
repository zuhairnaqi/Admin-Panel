import React, { Component } from 'react';
import firebase from '../../Config/Firebase';
import loaderImg from '../../../images/loader.gif';
import { Button, Table } from 'react-bootstrap';


var db = firebase.firestore();

const cors = "https://cors-anywhere.herokuapp.com/";
const GENERAL_MANGA_API = "https://www.mangaeden.com/api/list/0";
const MANGA_LIST = "https://www.mangaeden.com/api/list/0/?p=";
const MANGA_DETAIL = "https://www.mangaeden.com/api/manga/";
const CHAPTERLIST = "https://www.mangaeden.com/api/chapter/";

class Breadcrumbs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      pagesDataToUpdate: [],
    }
  }

  CheckForUpdates = () => {
    this.setState({ loader: true })
    db.collection(`UpdatedValue`).get()
      .then(snapshot => {
        console.log(snapshot.docs[0].data());
        this.setState({ GetLastUpdatedTime: snapshot.docs[0].data() })
        
        fetch(`${MANGA_LIST}0`)
          .then(res => {
            return res.json();
          })
          .then(value => {
            console.log(value.total);
            var updatePage = Math.floor(value.total / 500);
            this.updation(updatePage)
          });
      })
  }

  updation = async (updatePage) => {
    const { GetLastUpdatedTime, pagesDataToUpdate } = this.state;
    var pageForUpdate = GetLastUpdatedTime.Page;

    while (updatePage >= pageForUpdate) {
      console.log(pageForUpdate);
      var mangaId = [];
      var uploadingManga = [];

      fetch(`${MANGA_LIST}${pageForUpdate}`)
        .then(res => res.json())
        .then(value => {

          var mangas = value.manga;
          for (var j = 0; j < mangas.length; j++) {
            mangaId.push(mangas[j].i);
          }
        })

      db.collection(`Page_${pageForUpdate}`).get()
        .then(querySnapshot => {
          if (querySnapshot.docs.length) {
            querySnapshot.forEach(doc => {
              var data = doc.data();
              var id = doc.id;
              if (mangaId.includes(id)) {
                console.log("Data is already exists")
              }
              else {
                uploadingManga.push(id);
              }
            });
          } else {
            console.log("Empty field");
          }
        })
        .catch(error => {
          console.log("Error getting documents: ", error);
        });
      await new Promise(resolve => setTimeout(resolve, 2000));
      var data = {
        uploadingManga,
        page: pageForUpdate,
      }
      pagesDataToUpdate.push(data);
      this.setState({ pagesDataToUpdate })
      pageForUpdate++;
    }
  }

  UploadToDatabase = (index) => {
    const { pagesDataToUpdate } = this.state;
    var uploadingObject = pagesDataToUpdate[index];
    var uploadingManga = uploadingObject.uploadingManga;
    for (var i = 0; i < uploadingManga.length; i++) {
      fetch(`${MANGA_DETAIL}${uploadingManga[i]}`)
        .then(response => response.json())
        .then(value => {
          if (value) {
            db.collection(`Page_${uploadingObject.page}`).doc(uploadingManga[i]).set(value, { merge: true })
              .then(function () {
                console.log("Document successfully written! page " + i);
              })
              .catch(function (error) {
                console.error("Error writing document: ", error);
              });
          }
        })
    }
    alert(`Page ${uploadingObject.page} is successfully updated`);
  }

render() {
  const { loader, pagesDataToUpdate } = this.state;

  return (
    <div className="animated fadeIn">
      <h2>
        Check for updates
        </h2>

      <Button bsStyle="success" onClick={this.CheckForUpdates} >Updates</Button>
      <br />

      {loader && <img src={loaderImg} style={{ margin: '10px 50px 0px 26%', width: '45%' }} />}

      {pagesDataToUpdate && pagesDataToUpdate.map((value, index) => {
        return <div>
          <b>Update only on time and wait for message popup to fully update</b>
          <h3>{value.page} is ready to upload with {value.uploadingManga.length} mangas </h3>
          <Button bsStyle="primary" onClick={this.UploadToDatabase.bind(this, index)}>Update</Button>
        </div>
      })}

    </div>
  );
}
}

export default Breadcrumbs;
