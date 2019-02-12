import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import firebase from '../../Config/Firebase'


var db = firebase.firestore();

const cors = "https://cors-anywhere.herokuapp.com/";
const MANGA_LIST = "https://www.mangaeden.com/api/list/0/";
const MANGA_DETAIL = "https://www.mangaeden.com/api/manga/";
const CHAPTERLIST = "https://www.mangaeden.com/api/chapter/";

class Breadcrumbs extends Component {
  constructor(props){
    super(props);
    this.state = {
      page : 1,
    }
  }

  // FOR UPLOAD MANGA DETAILS TO FIREBASE 
  UploadDataToFirebase = () => {
    const { page } = this.state;
    fetch(`${cors}${MANGA_LIST}?p=${page}&l=${page}`)
      .then(res => {
        if (res.status == 200) {
          return res.json();
        }
      })
      .then((value) => {
        if(value){
          console.log("value ", value);
          var mangaList = value.manga;
          var mangaId = [];
          for (var k = 0; k < mangaList.length; k++) {
            // await new Promise(resolve => setTimeout(resolve, 2000));
            mangaId[k] = `${mangaList[k].i}`
          }
          this.setState({ mangaId })
          this.uploadData();
        }
      })
      .catch(err => console.log(err));
  }

  uploadData = async() => {
    const { mangaId,page } = this.state;
    for (let i = 0; i < mangaId.length; i++) {
      var id = mangaId[i];
      // https://cors-anywhere.herokuapp.com/
      await new Promise(resolve => setTimeout(resolve, 1500));
      fetch(`${cors}${MANGA_DETAIL}${id}`)
        .then(res => {
          if(res.status === 200){
            return res.json();
          }else {
            console.log("Failed manga also exist");
          }
        })
        .then(value => {
          if(value){
            if (value.chapters.length !== 0) {
              for (var k = 0; k < value.chapters.length; k++) {
                value.chapters[k] = { ...value.chapters[k] };
              }
            }
  
            db.collection(`Page_${page}`).doc(id).set(value, { merge: true })
              .then(function () {
                console.log("Document successfully written! page " + i + "page number " + page);
              })
              .catch(function (error) {
                console.error("Error writing document: ", error);
              });
          }
        })
        .catch(err => console.log(err));
    }
    this.setState({page : page + 1});
    this.UploadDataToFirebase();
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i><strong>Breadcrumbs</strong>
                <div className="card-header-actions">
                  <a href="https://reactstrap.github.io/components/breadcrumbs/" rel="noreferrer noopener" target="_blank" className="card-header-action">
                    <small className="text-muted">docs</small>
                  </a>
                </div>
              </CardHeader>
              <CardBody>
                <Breadcrumb>
                  <BreadcrumbItem active>Home</BreadcrumbItem>
                  <button onClick={this.UploadDataToFirebase}>Uplaod to firebase</button>
                </Breadcrumb>
                <Breadcrumb>
                  {/*eslint-disable-next-line*/}
                  <BreadcrumbItem><a href="#">Home</a></BreadcrumbItem>
                  <BreadcrumbItem active>Library</BreadcrumbItem>
                </Breadcrumb>
                <Breadcrumb>
                  {/*eslint-disable-next-line*/}
                  <BreadcrumbItem><a href="#">Home</a></BreadcrumbItem>
                  {/* eslint-disable-next-line*/}
                  <BreadcrumbItem><a href="#">Library</a></BreadcrumbItem>
                  <BreadcrumbItem active>Data</BreadcrumbItem>
                </Breadcrumb>
                <Breadcrumb tag="nav">
                  <BreadcrumbItem tag="a" href="#">Home</BreadcrumbItem>
                  <BreadcrumbItem tag="a" href="#">Library</BreadcrumbItem>
                  <BreadcrumbItem tag="a" href="#">Data</BreadcrumbItem>
                  <BreadcrumbItem active tag="span">Bootstrap</BreadcrumbItem>
                </Breadcrumb>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Breadcrumbs;
