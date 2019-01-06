import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';

class List extends Component {

  state = {
    items: [],
    loading: true,
    todoItem: '',
    online: true
  }

  componentDidMount() {
    fetch('http://localhost:4567/items.json')
    .then(response => response.json())
    .then(items => {
      this.setState({ items, loading: false })
    })
    window.addEventListener('online', this.updateConnectionStatus);
    window.addEventListener('offline', this.updateConnectionStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.updateConnectionStatus);
    window.removeEventListener('offline', this.updateConnectionStatus);
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/Online_and_offline_events
  updateConnectionStatus = () => {
    this.setState({ online: navigator.onLine })
  }

  addItem = (e) => {
    e.preventDefault()

    fetch('http://localhost:4567/items.json', {
      method: 'POST',
      body: JSON.stringify({ item: this.state.todoItem }),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(items => {
      this.setState({ items })
    })

    this.setState({ todoItem: '' })
  }

  deleteItem = (itemId) => {
    fetch('http://localhost:4567/items.json', {
      method: 'DELETE',
      body: JSON.stringify({ id: itemId }),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(items => {
      this.setState({ items })
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar navbar-light bg-light">
          <span className="navbar-brand mb-0 h1">
            <img src={logo} className="App-logo" alt="logo" />
            Todo List
          </span>
        </nav>

        { !this.state.online &&
          <span>Offline! Some features are unavailable until you are online again</span>
        }
        <Link to="/profile">Profile</Link>

        <div className="px-3 py-2">

          <form className="form-inline my-3" onSubmit={this.addItem}>
            <div className="form-group mb-2 p-0 pr-3 col-8 col-sm-10">
              <input
                className="form-control col-12"
                placeholder="What do you need to do?"
                value={this.state.todoItem}
                onChange={e => this.setState({
                  todoItem: e.target.value
                })}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary mb-2 col-4 col-sm-2">
              Add
            </button>
          </form>

          { this.state.loading && <p>Loading...</p> }

          {
            !this.state.loading && this.state.items.length === 0 &&
            <div className="alert alert-secondary">
              No items - all done!
            </div>
          }

          {
            !this.state.loading && this.state.items &&
            <table className="table table-striped">
              <tbody>
                {
                  this.state.items.map((item, i) => {
                    return (
                      <tr key={item.id} className="row">
                        <td className="col-1">{i+1}</td>
                        <td className="col-10">{item.item}</td>
                        <td className="col-1">
                          <button
                            type="button"
                            className="close"
                            aria-label="Close"
                            onClick={() => this.deleteItem(item.id)}
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          }

        </div>

      </div>
    );
  }
}

class Profile extends Component {
  state = {
    imageSrc: null,
  };

  imageCaptured = (file) => {
    if(file !== null) {
      this.setState({ imageSrc: URL.createObjectURL(file) });
    }
  };

  render() {
    return (
      <div>
        <Link to="/">Back</Link>
        <h1>Profile</h1>
        <p>This is your profile</p>
        { this.state.imageSrc &&
          <img class="profile-image" alt="" src={this.state.imageSrc} />
        }
        {/* Assuming only one file can be selected */}
        <input type="file" accept="image/*" onChange={e => this.imageCaptured(e.target.files[0])} />
      </div>
    );
  };
};

export default () =>
  <Router>
    <div>
      <Route path="/" exact component={List} />
      <Route path="/profile" exact component={Profile} />
    </div>
  </Router>
