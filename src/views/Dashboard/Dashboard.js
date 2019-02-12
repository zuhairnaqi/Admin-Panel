import React, { Component, lazy, Suspense } from 'react';
import firebase from '../Config/Firebase';
import { Button, FormControl, Form, Table, Col } from 'react-bootstrap';

var db = firebase.firestore();

const cors = "https://cors-anywhere.herokuapp.com/";
const MANGA_LIST = "https://www.mangaeden.com/api/list/0/";
const MANGA_DETAIL = "https://www.mangaeden.com/api/manga/";
const CHAPTERLIST = "https://www.mangaeden.com/api/chapter/";

var db = firebase.firestore();
// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});



var searchTimeout = "";
var chapterQuantity = 0;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mangaId: [],
      chaptersId: [],
      chp: [],
      AllData: [],
      searchText: '',
      filterList: [],
    }
  }


  // FOR UPLOAD Chapter Images TO FIREBASE 
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
  //   for (let i = 998; i < chp.length; i++) {
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


  componentDidMount() {
    const { AllData } = this.state;

    db.collection("MANGA_DETAIL").get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var data = doc.data();
          AllData.push(data);
          chapterQuantity = chapterQuantity + data.chapters_len;
        });
        console.log(chapterQuantity);
        if (JSON.parse(localStorage.getItem("AllMangaDetails")).length < AllData.length) {
          localStorage.setItem("AllMangaDetails", JSON.stringify(AllData));
          localStorage.setItem("chapterQuantity", JSON.stringify(chapterQuantity));
          this.setState({ AllData })
        }
      })
      .catch(error => {
        console.log("Error getting documents: ", error);
      });
  }

  componentWillMount() {
    if (localStorage.getItem("AllMangaDetails") && localStorage.getItem("chapterQuantity")) {
      var AllData = JSON.parse(localStorage.getItem("AllMangaDetails"));
      chapterQuantity = parseInt(localStorage.getItem("chapterQuantity"));
      console.log(AllData);
      console.log(chapterQuantity);
      this.setState({ AllData });
    }
  }

  SearchingStuff = (event) => {
    event.preventDefault();
    var value = event.target.value;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      this.searching(value);
    }, 500);
  }

  searching = (value) => {
    const { AllData } = this.state;
    let search = value.trim();
    this.setState({
      searchText: value,
      dataList: AllData.filter(data => {
        return (data.title.toLowerCase().includes(value.toLowerCase()) ||
          data.artist.toLowerCase().includes(value.toLowerCase()) ||
          data.author.toLowerCase().includes(value.toLowerCase()))
      })
    });
  }

  Cancel = () => { this.setState({ searchText: null }) }

  GoToDetails = (title) => {
    const { dataList } = this.state;
    this.props.history.push({
      pathname: `/manga/ShowDetails${title}`,
      state: dataList,
    })
  }


  render() {
    const { mangaId, chaptersId, chapterList, chp, dataList, AllData, searchText } = this.state;
    console.log(dataList);

    return (
      <div>
        {/* To upload chapters pages press this button */}
        {/* <button onClick={this.UploadToFirebase}>Upload</button> */}

        {/* <Table striped bordered hover size="sm">
          <tr>
            <th style={Theading}>Name</th>
            <th style={Theading}>Quantity</th>
          </tr>
          <tr>
            <th style={th}>Manga </th>
            <td style={td}>{AllData.length}</td>
          </tr>
          <tr>
            <th style={th}>Chapter List</th>
            <td style={td}>{chapterQuantity}</td>
          </tr>
        </Table> */}
        <div className='container'>
        <h5 className="jumbutron">Mangas <span class="badge badge-primary">{AllData.length}</span></h5>
        <hr />
        <h5 className="jumbutron">Chapters <span class="badge badge-primary">{chapterQuantity}</span></h5>
        <hr />
        </div>

        {/* <br/> */}
        <b>Search through Alias, Artist and Author</b>
        <br/>
        <br/>

        <Col sm="6">
          <Form.Control
            type="text"
            style={{ marginBottom: '30px' }}
            placeholder="Search..."
            onChange={this.SearchingStuff}
          />
        </Col>
        {dataList && <Button bsStyle="success" onClick={this.Cancel} style={CancelBtn}>Cancel</Button>}


        {dataList && <div>
          {searchText &&  dataList.map((value, index) => {
            return <span onClick={this.GoToDetails.bind(this, value.title)}>
              {value.alias.toLowerCase().includes(searchText.toLowerCase()) &&
                <li style={ListContainer}>{value.alias}
                  <span style={searchItem}>Alias</span></li>}

              {value.artist.toLowerCase().includes(searchText.toLowerCase()) &&
                <li style={ListContainer}>{value.artist} <span style={searchItem}>Artist</span></li>}

              {value.author.toLowerCase().includes(searchText.toLowerCase()) &&
                <li style={ListContainer}>{value.author} <span style={searchItem}>Author</span></li>}
            </span>
          })}
        </div>}

      </div>
    );
  }
}

export default Dashboard;

const CancelBtn = {
  float: "right",
  marginTop: "-65px"
}

const searchItem = {
  float: "right",
  color: '#747f87'
}

const ListContainer = {
  margin: '7px',
  padding: '13px',
  border: "2px solid #0f0f0f0d",
  boxShadow: "1px 1px 1px 0px #888888",
  cursor : 'pointer'
}

const Theading = {
  textAlign: 'center',
  fontFamily: 'cursive',
  fontSize: '20px',
  padding : '6px'
}

const th = {
  textAlign: 'center',
  color: 'rgb(105, 114, 123)',
}

const td = {
  color: '#6a6e71',
  marginLeft: '10px',
  padding: '7px',
  textAlign: 'center',
}




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