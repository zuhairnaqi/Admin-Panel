import React, { Component, lazy, Suspense } from 'react';
import firebase from '../Config/Firebase';

const cors = "https://cors-anywhere.herokuapp.com/";
const MANGA_LIST = "https://www.mangaeden.com/api/list/0/";
const MANGA_DETAIL = "https://www.mangaeden.com/api/manga/";
const CHAPTERLIST = "https://www.mangaeden.com/api/chapter/";

var db = firebase.firestore();

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mangaId: [],
      chaptersId: [],
      chp : []
    }
  }


  // FOR UPLOAD MANGA DETAILS TO FIREBASE 
  // componentDidMount() {
  //   const { chp } = this.state;
  //   db.collection("MANGA_DETAIL").orderBy("alias").get()
  //     .then(doc => {
  //       // if (doc.exists) {
  //         for (var i = 0; i < doc.docs.length; i++) {
  //           var data = doc.docs[i].data();
  //           for (let i = 0; i < data.chapters_len; i++) {
  //             var id = data.chapters[i][3];
  //             chp.push(id);
  //           }
  //         }
  //         this.setState({ chp })
  //       // } else {
  //       //   console.log("Document is empty");
  //       // }
  //     }).catch(function (error) {
  //       console.log("Error getting document:", error);
  //     });
  // }

  // UploadToFirebase = async() => {
  //   const { chp } = this.state;
  //   for (let i = 0; i < chp.length; i++) {
  //       // const element = chapterList[i].chapters[j][3];
  //       await new Promise(resolve => setTimeout(resolve, 1200));
  //       const element = chp[i];
  //       fetch(`${CHAPTERLIST}${element}/`)
  //         .then(res => res.json())
  //         .then(value => {
  //           var chapt = [];
  //           for (let k = 0; k < value.images.length; k++) {
  //             const img = value.images[k][1];
  //             chapt.push(img);
  //           }
  //           db.collection("CHAPTER_PAGE").doc(element).set({chapt} , { merge : true })
  //             .then(function () {
  //               console.log("Document successfully written! page number " + i);
  //             })
  //             .catch(function (error) {
  //               console.error("Error writing document: ", error);
  //             });
  //         });
  //   }
  // }




  render() {
    const { mangaId, chaptersId,chapterList,chp } = this.state;
    console.log(chp);
    return (
      <div>
        <h1>Hello Dashboard</h1>
        <h3>Hello wrong answer</h3>
        
        {/* To upload chapters pages press this button */}
        <button onClick={this.UploadToFirebase}>Upload</button>
      </div>
    );
  }
}

export default Dashboard;





// TO UPLOAD FIRST API DATA
  // componentDidMount(){
  //       fetch(`${MANGA_LIST}?p=${12}&l=${12}`)
  //           .then(res => {
  //             if(res.status == 200){
  //               return res.json();
  //             }
  //           })
  //           .then(async(value) => {
  //               console.log("value ", value);
  //               var mangaList = value.manga;
  //               for(var k=0 ; k < mangaList.length ; k++){
  //                 await new Promise(resolve => setTimeout(resolve, 2000));
  //                 mangaList[k].page = 12;
  //                 console.log(`${mangaList[k].i}`);
  //                 db.collection("MANGA_LIST").doc(`${mangaList[k].i}`).set(mangaList[k])
  //                     .then(function () {
  //                         console.log("Document successfully written! page num " + k + " page " + 12);
  //                     })
  //                     .catch(function (error) {
  //                         console.error("Error writing document: ", error);
  //                     });
  //               }
  //           })
  //           .catch(err => console.log(err));
  // }


  // FOR UPLOAD MANGA DETAILS TO FIREBASE 
  // componentDidMount() {
  //   var page = 0;
  //   fetch(`${cors}${MANGA_LIST}?p=${page}&l=${page}`)
  //     .then(res => {
  //       if (res.status == 200) {
  //         return res.json();
  //       }
  //     })
  //     .then((value) => {
  //       console.log("value ", value);
  //       var mangaList = value.manga;
  //       var mangaId = [];
  //       for (var k = 0; k < mangaList.length; k++) {
  //         // await new Promise(resolve => setTimeout(resolve, 2000));
  //         mangaId[k] = `${mangaList[k].i}`
  //       }
  //       this.setState({ mangaId })
  //       this.uploadData();
  //     })
  //     .catch(err => console.log(err));
  // }

  // uploadData = async() => {
  //   const { mangaId } = this.state;
  //   for (let i = 63; i < mangaId.length; i++) {
  //     var id = mangaId[i];
  //     // https://cors-anywhere.herokuapp.com/
  //     await new Promise(resolve => setTimeout(resolve, 1200));
  //     fetch(`${cors}${MANGA_DETAIL}${id}`)
  //       .then(res => {
  //         if(res.status === 200){
  //           return res.json();
  //         }else {
  //           console.log("Failed manga also exist");
  //         }
  //       })
  //       .then(value => {
  //         if (value.chapters.length !== 0) {
  //           for (var k = 0; k < value.chapters.length; k++) {
  //             value.chapters[k] = { ...value.chapters[k] };
  //           }
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