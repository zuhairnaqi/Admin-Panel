import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from '../Config/Firebase';
import loader from '../../images/loader.gif'
// import { depthFrom } from 'array-flatten';
import '../../index.css'
import { Button } from 'react-bootstrap';


var db = firebase.firestore();
// Disable deprecated features
// db.settings({
//   timestampsInSnapshots: true
// });

class Manga extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mangaData: [],
            page: 1,
            mangaList: [],
        }
    }

    componentDidMount() {
        // db.collection("MANGA_LIST").where("manga","array-contains","i")
        // .get()
        // .then(querySnapshot =>{
        //     console.log("query snapshot",querySnapshot)
        //     querySnapshot.docs.forEach(doc => {
        //         console.log("doc ==>",doc);
        //         console.log("doc data ==>",doc.data());
        //     })
        // })
        // .catch(error => {
        //     console.log("Error getting documents: ", error);
        // });

      
        // FOR RENDERING DATA
        const { mangaList } = this.state;
        db.collection("MANGA_LIST").orderBy("i").limit(15).get()
            .then(doc => {
                console.log(doc.docs[0].data);
                for (var i = 0; i < doc.docs.length; i++) {
                    var data = doc.docs[i].data();
                    mangaList.push(data);
                  }
                  this.setState({ mangaList });
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
    }

    // this.getData();

    //     let { mangaData } = this.state;
    //     fetch("https://www.mangaeden.com/api/list/0/?p=1")
    //       .then(res => res.json())
    //       .then(value => {
    //         mangaData = value.manga.filter((data, index) => {
    //           return index < 10;
    //         })
    //         this.setState({ mangaData });
    //       })
    //       .catch(err => {
    //         console.log("Error while scrapping => ", err.message);
    //       })

    // getData = () => {
    //     const { page } = this.state;
    //     fetch(`${MANGA_LIST}?p=${page}&l=${page}`)
    //         .then(res => {
    //             if (res.status !== 404 && res.status !== 403) {
    //                 return res.json();
    //             }
    //         })
    //         .then(value => {
    //             console.log("value ", value);
    //             this.setState({ mangaList: value.manga })
    //         })
    //         .catch(err => console.log(err));
    // }

    render() {
        const { mangaList } = this.state;
        console.log("mangaList", mangaList);
        return (
            <div className="App">
                <h1>Manga List</h1>
                {!mangaList && <img src={loader} style={{ margin: '10px 50px 0px 26%', width: '45%' }} />}

                {mangaList && mangaList.map((value, index) => {
                    return <div onClick={() => this.props.history.push(`/manga/ShowDetails${value.t}`)} style={listContainer}>
                        <img src={`https://cdn.mangaeden.com/mangasimg/${value.im}`} style={{ width: '70px', paddingLeft: '20px' }} />
                        <span style={{ marginLeft: '15px' }}>{value.t}</span>
                    </div>
                })}
            </div>
        )
    }
}
export default Manga;

const listContainer = {
    border: '1px solid #dad7d7',
    marginBottom: '10px',
    fontSize: '17px',
    lineHeight: '90px',
}
