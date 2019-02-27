import React, { Component, lazy, Suspense } from 'react';
import firebase from '../Config/Firebase';
import { Button, FormControl, Form, Table, Col } from 'react-bootstrap';

var db = firebase.firestore();

var db = firebase.firestore();
// db.settings({
//   timestampsInSnapshots: true
// });

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
      filterList: []
    }
  }

  componentDidMount() {
    // this.FetchDataFromDatabase();
  }

  FetchDataFromDatabase = async () => {
    const { AllData } = this.state;

    var a = 0;
    var isData = true;
    do {
      db.collection(`Page_${a}`).get()
        .then(querySnapshot => {
          if (querySnapshot.docs.length) {
            querySnapshot.forEach(doc => {
              var data = doc.data();
              data.page = a;
              AllData.push(data);
              chapterQuantity = chapterQuantity + data.chapters_len;
            });

            this.setState({ AllData });
            console.log(chapterQuantity);
            a++
          } else {
            isData = false;
            console.log("Empty field");
          }
        })
        .catch(error => {
          console.log("Error getting documents: ", error);
          isData = false;
        });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // var StorageData = JSON.parse(localStorage.getItem(`Manga_Page_${a}`));

      // if (StorageData) {
      //   if (StorageData.length < AllData.length) {
      //     localStorage.setItem(`Manga_Page_${a}`, JSON.stringify(currentData));
      //     localStorage.setItem("chapterQuantity", JSON.stringify(chapterQuantity));
      //     AllData.concat(currentData);
      //     this.setState({ AllData })
      //   }
      // } else {
      //   localStorage.setItem(`Manga_Page_${a}`, JSON.stringify(currentData));
      //   localStorage.setItem("chapterQuantity", JSON.stringify(chapterQuantity));
      //   AllData.concat(currentData); 
      //   this.setState({ AllData });
      // }

    } while (isData)

  }

  // componentWillMount() {
  //   var AllData = JSON.parse(localStorage.getItem(`Manga_Page_${a}`));  //error
  //   var chapterQuantity = parseInt(localStorage.getItem("chapterQuantity"));

  //   if (AllData && chapterQuantity) {
  //     console.log(AllData);
  //     console.log(chapterQuantity);
  //     this.setState({ AllData });
  //   }
  // }

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
    this.setState({
      searchText: value,
      dataList: AllData.filter(data => {
        return (data.title.toLowerCase().slice(0,value.length) === value.toLowerCase() ||
          data.artist.toLowerCase().slice(0,value.length) === value.toLowerCase() ||
          data.author.toLowerCase().slice(0,value.length) === value.toLowerCase())
      })
    });
  }

  Cancel = () => { this.setState({ searchText: null }) }

  GoToDetails = (obj) => {
    // const { dataList } = this.state;
    this.props.history.push({
      pathname: `/manga/ShowDetails`,
      state: {
        manga: obj,
        page : obj.page
      }
    })
  }


  render() {
    const { mangaId, chaptersId, chapterList, chp, dataList, AllData, searchText } = this.state;
    console.log(dataList);

    return (
      <div>
        <div className='container'>
          <h5 className="jumbutron">Mangas <span class="badge badge-primary">{AllData.length}</span></h5>
          <hr />
          <h5 className="jumbutron">Chapters <span class="badge badge-primary">{chapterQuantity}</span></h5>
          <hr />
        </div>

        {/* <br/> */}
        <b>Search through Alias, Artist and Author</b>
        <br />
        <br />

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
          {searchText && dataList.map((value, index) => {
            return <span onClick={this.GoToDetails.bind(this, value)}>
              {value.alias.toLowerCase().includes(searchText.toLowerCase()) &&
                <li style={ListContainer}>{value.alias} <span style={searchItem}>Alias</span></li>}

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
  cursor: 'pointer'
}

const Theading = {
  textAlign: 'center',
  fontFamily: 'cursive',
  fontSize: '20px',
  padding: '6px'
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