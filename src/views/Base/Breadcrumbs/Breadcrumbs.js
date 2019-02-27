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

  componentDidMount() {
    this.CheckForUpdates();
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

      await fetch(`${MANGA_LIST}${pageForUpdate}`)
        .then(res => res.json())
        .then(value => {

          var mangas = value.manga;
          for (var j = 0; j < mangas.length; j++) {
            mangaId.push(mangas[j].i);
          }
        })

      await db.collection(`Page_${pageForUpdate}`).get()
        .then(querySnapshot => {
          if (querySnapshot.docs.length) {
            querySnapshot.forEach(doc => {
              var data = doc.data();
              var id = doc.id;
              if (mangaId.includes(id)) {
                var index = mangaId.indexOf(id);
                mangaId.splice(index, 1);
              }
            });
          } else {
            console.log("Empty field");
          }
        })
        .catch(error => {
          console.log("Error getting documents: ", error);
        });
        console.log(mangaId.length,pageForUpdate);
      var data = {
        mangaId,
        page: pageForUpdate,
      }
      await this.UploadToDatabase(data);
      pagesDataToUpdate.push(data);
      this.setState({ pagesDataToUpdate })
      pageForUpdate++;
    }
  }

  async UploadToDatabase(data) {
    // const { pagesDataToUpdate } = this.state;
    // console.log(pagesDataToUpdate);
    // console.log(index);
    // var data = pagesDataToUpdate[index];
    var mangaId = data.mangaId;
    for (var i = 0; i < mangaId.length; i++) {
      await fetch(`${MANGA_DETAIL}${mangaId[i]}`)
        .then(response => response.json())
        .then(async (value) => {
          console.log(value);
          if (value.chapters.length !== 0) {
            for (var k = 0; k < value.chapters.length; k++) {
              value.chapters[k] = { ...value.chapters[k] };
            }
          }
          if (value) {
            await db.collection(`Page_${data.page}`).doc(mangaId[i]).set(value, { merge: true })
              .then(async () => {
                console.log("Document successfully written! page " + i);
                await this.uploadChapters(value, mangaId[i], data.page);
              })
              .catch(function (error) {
                console.error("Error writing document: ", error);
              });
          }
        })
    }
    db.collection(`UpdatedValue`).doc("LRAJSYafH4DrlQxmfUM0").update({Page : data.page})
    alert(`Page ${data.page} is successfully updated`);
    setInterval(() => { 
      this.CheckForUpdates();
    }, 18000000)
  }

  uploadChapters = async (value, docId, page) => {
    var chp = [];
    for (let i = 0; i < value.chapters_len; i++) {
      var id = value.chapters[i][3];
      chp.push({ id, docId });
    }
    for (let i = 0; i < chp.length; i++) {
      const ChapterImageId = chp[i].id;
      const ChapterGetFromMangaId = chp[i].docId;
      await fetch(`${CHAPTERLIST}${ChapterImageId}/`)
        .then(res => res.json())
        .then(value => {
          var ChapterImages = [];
          for (let k = 0; k < value.images.length; k++) {
            const img = value.images[k][1];
            ChapterImages.push(img);
          }
          db.collection(`CHAPTER_PAGE_${page}`).doc(ChapterImageId).set({
            ChapterImageId, ChapterGetFromMangaId, ChapterImages
          }, { merge: true })
            .then(function () {
              console.log("Document successfully written! page number " + i);
            })
            .catch(function (error) {
              console.error("Error writing document: ", error);
            });
        });
    }
  }


  render() {
    const { loader, pagesDataToUpdate } = this.state;
    console.log(pagesDataToUpdate);

    return (
      <div className="animated fadeIn">
      <h1>Working on updates</h1>
      {loader && <img src={loaderImg} style={{ margin: '10px 50px 0px 26%', width: '45%' }} />}

        {/* <h2>
          Check for updates
        </h2>

        <Button bsStyle="success" onClick={this.CheckForUpdates} >Updates</Button>
        <br />

        {loader && !pagesDataToUpdate.length && <img src={loaderImg} style={{ margin: '10px 50px 0px 26%', width: '45%' }} />}

        {pagesDataToUpdate && pagesDataToUpdate.map((value, index) => {
          return <div>
            <b>Update only one time and wait for message popup to fully update</b>
            <h3>{value.page} is ready to upload with {value.mangaId.length} mangas </h3>
            <Button bsStyle="primary" onClick={this.UploadToDatabase.bind(this, index)}>Update</Button>
          </div>
        })} */}

      </div>
    );
  }
}

export default Breadcrumbs;
