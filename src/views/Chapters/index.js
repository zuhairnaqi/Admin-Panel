import React, { Component } from 'react';
import firebase from '../Config/Firebase';
import loader from '../../images/loader.gif';
import { Button } from 'react-bootstrap';
const CHAPTERLIST = "https://www.mangaeden.com/api/chapter/";

var db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});
var page = 0;

class Charts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chapterList: [],
    }
  }

  componentDidMount() {
    const { chapterList } = this.state;
    db.collection(`Page_${page}`).orderBy("title").limit(20).get()
      .then(doc => {
        for (var i = 0; i < doc.docs.length; i++) {
          console.log(doc.docs[i].data());
          var data = doc.docs[i].data();
          var detailId = doc.docs[i].id;

          if (data.chapters.length) {
            var chp = [];
            for (let j = 0; j < data.chapters_len; j++) {
              if (data.chapters[j]) {
                var page = data.chapters[j]['2'];
                var id = data.chapters[j]['3'];
                chp.push({ page, id });
              }
            }
            data.chapters = chp;
          }

          data.mangaId = detailId;
          chapterList.push(data);
        }

        console.log(chapterList);
        this.setState({ chapterList });

      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
  }


  render() {
    const { chapterList, showIndex, showButtons } = this.state;
    console.log(chapterList);
    return (
      <div className="App">
        <h1>Chapter List</h1>
        {!chapterList.length && <img src={loader} style={{ margin: '10px 50px 0px 26%', width: '45%' }} />}

        {chapterList && chapterList.map((value, index) => {
          return <div style={listContainer}>
            <div onClick={() => this.setState({ showButtons: !showButtons, showIndex: index })} >
              <img src={`https://cdn.mangaeden.com/mangasimg/${value.image}`} style={imgCss} />

              <span style={Chapter_link} >{value.alias}</span></div>

            {/*  ONCLICK TO SHOW THE SELECTIVE CHAPTER'S TOPICS AND Btn TO OPEN THAT BOOK */}
            {showButtons && showIndex === index && <div>
              {value.chapters.map(data => {
                return <div>
                  <b style={{ margin: '0px 20px 0px 13px' }}>.</b>
                  {data.page}
                  <Button bsStyle="success" onClick={() => this.props.history.push(`/chapters/ShowChapter${page}${data.id}-${value.mangaId}`)} style={buttonCss} >
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