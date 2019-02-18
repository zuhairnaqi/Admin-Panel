import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from '../Config/Firebase';
import loader from '../../images/loader.gif'
// import { depthFrom } from 'array-flatten';
import '../../index.css'
import { Button } from 'react-bootstrap';


var db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

var page = 0;

class Manga extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mangaList: [],
        }
    }

    componentDidMount() {
        const { mangaList } = this.state;
        db.collection(`Page_${page}`).orderBy("title").get()
            .then(doc => {
                console.log(doc.docs);
                for (var i = 0; i < doc.docs.length; i++) {
                    var data = doc.docs[i].data();
                    data.docId = doc.docs[i].id;
                    mangaList.push(data);
                }
                this.setState({ mangaList });
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
    }

    render() {
        const { mangaList } = this.state;
        console.log("mangaList", mangaList);
        return (
            <div className="App">
                <h1>Manga List</h1>
                {!mangaList && <img src={loader} style={{ margin: '10px 50px 0px 26%', width: '45%' }} />}

                {mangaList && mangaList.map((value, index) => {
                    return <div onClick={() => this.props.history.push({
                        pathname: `/manga/ShowDetails`,
                        state: {
                            manga: value,
                            page
                        }
                    })} style={listContainer}>
                        <img src={`https://cdn.mangaeden.com/mangasimg/${value.image}`} style={{ width: '70px', paddingLeft: '20px' }} />
                        <span style={{ marginLeft: '15px' }}>{value.title}</span>
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
