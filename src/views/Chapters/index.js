import React, { Component } from 'react';
import firebase from '../Config/Firebase';
import loader from '../../images/loader.gif';
import { Button } from 'react-bootstrap';
const CHAPTERLIST = "https://www.mangaeden.com/api/chapter/";

var db = firebase.firestore();
// Disable deprecated features
// db.settings({
//   timestampsInSnapshots: true
// });

class Charts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chapterList: [],
    }
  }

  componentDidMount() {
    const { chapterList } = this.state;
    db.collection("MANGA_DETAIL").orderBy("alias").limit(10).get()
      .then(doc => {
        // if (doc.exists) {
          for (var i = 0; i < doc.docs.length; i++) {
            var data = doc.docs[i].data();
            var chp = [];
            for (let i = 0; i < data.chapters_len; i++) {
              // console.log(data.chapters[[`${i}`]]);
              var page = data.chapters[[`${i}`]][2];
              var id = data.chapters[[`${i}`]][3];
              chp.push({page,id});
            }
            data.chapters = chp;
            chapterList.push(data);
          }
          console.log(chapterList);
          this.setState({ chapterList });
        // } else {
        //   console.log("Document is empty");
        // }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
  }


  render() {
    const { chapterList, showIndex, showButtons } = this.state;
    return (
      <div className="App">
        <h1>Chapter List</h1>
        {!chapterList && <img src={loader} style={{ margin: '10px 50px 0px 26%', width: '45%' }} />}

        {/* To upload chapters pages press this button */}
        {/* <button onClick={this.UploadToFirebase}>Upload</button> */}

        {/* {chapterList && chapterList.map((value, index) => {
          return <div>
            <p style={{ marginLeft: '15px' }}>{value.author}</p>
            <span>chapter : {value.chapters.map(val => {
            if(val){
              return <li>{val}</li>
            }else{
              return null
            }
          })}</span>
          </div>
        })} */}
        {chapterList && chapterList.map((value, index) => {
          return <div style={listContainer}>
            <div onClick={() => this.setState({ showButtons: !showButtons, showIndex: index })} >

              {value.image[2] == "/" ? <img src={`https://cdn.mangaeden.com/mangasimg/${value.image}`} style={imgCss} /> : 
              <img src={value.image} style={imgCss} />}
              
              <span style={Chapter_link} >{value.alias}</span></div>

            {/*  ONCLICK TO SHOW THE SELECTIVE CHAPTER'S TOPICS AND Btn TO OPEN THAT BOOK */}
            {showButtons && showIndex === index && <div>
              {value.chapters.map(data => {
                return <div>
                  <b style={{ margin: '0px 20px 0px 13px' }}>.</b>
                  {data.page}
                  <Button bsStyle="success" onClick={() => this.props.history.push(`/chapters/ShowChapter${data.id}`)} style={buttonCss} >
                    Open this book</Button>
                </div>
              })}
            </div>}

          </div>
        })}
      </div>
    )
  }
}

export default Charts;

const Chapter_link = {
  cursor: 'pointer',
  marginLeft: '15px'
}

const buttonCss = {
  float: 'right',
  margin: '28px 10px 0px 0px',
  cursor: 'pointer'
}
const listContainer = {
  border: '1px solid #dad7d7',
  marginBottom: '10px',
  fontSize: '17px',
  lineHeight: '90px',
}
const imgCss = {
  width: '70px',
  paddingLeft: '20px',
  cursor: 'pointer',
}



// componentDidMount() {
  //   const { chapterList } = this.state;
  //   // db.collection("MANGA_DETAIL").orderBy("alias").limit(10).get()
  //   db.collection("MANGA_DETAIL").orderBy("alias").get()
  //     .then(doc => {
  //       // if (doc.exists) {
  //         for (var i = 0; i < doc.docs.length; i++) {
  //           var data = doc.docs[i].data();
  //           var chp = [];
  //           for (let i = 0; i < data.chapters_len; i++) {
  //             // console.log(data.chapters[[`${i}`]]);
  //             var page = data.chapters[[`${i}`]][2];
  //             var id = data.chapters[[`${i}`]][3];
  //             chp.push({page,id});
  //           }
  //           data.chapters = chp;
  //           chapterList.push(data);
  //         }
  //         this.setState({ chapterList })
  //       // } else {
  //       //   console.log("Document is empty");
  //       // }
  //     }).catch(function (error) {
  //       console.log("Error getting document:", error);
  //     });
  // }

  // UploadToFirebase = async() => {
  //   const { chapterList } = this.state;
  //   for (let i = 116; i < chapterList.length; i++) {
  //     for (let j = 0; j < chapterList[i].chapters_len; j++) {
  //       // const element = chapterList[i].chapters[j][3];
  //       await new Promise(resolve => setTimeout(resolve, 1000));
  //       const element = chapterList[i].chapters[j].id;
  //       fetch(`${CHAPTERLIST}${element}/`)
  //         .then(res => res.json())
  //         .then(async (value) => {
  //           var chapt = [];
  //           for (let k = 0; k < value.images.length; k++) {
  //             const img = value.images[k][1];
  //             chapt.push(img);
  //           }
  //           await new Promise(resolve => setTimeout(resolve, 2000));
  //           db.collection("CHAPTER_PAGE").doc(element).set({ chapt })
  //             .then(function () {
  //               console.log("Document successfully written! page number " + i + " sub " + j);
  //             })
  //             .catch(function (error) {
  //               console.error("Error writing document: ", error);
  //             });
  //         });
  //     }
  //   }
  // }