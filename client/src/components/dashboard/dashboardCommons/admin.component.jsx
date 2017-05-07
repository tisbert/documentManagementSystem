import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { bindActionCreators } from 'redux';
import jwtDecode from 'jwt-decode';
import { Pagination } from 'react-materialize';
import Navbar from '../../commons/nav.component.js';
import SubNavBar from '../../commons/subNavBar.jsx';
import AllDocs from '../userDashboard/allDocs.component.jsx';
import Users from '../../dashboard/adminDashboard/usersView.component.js';
import Roles from '../../dashboard/adminDashboard/rolesView.component.js';
import MyDocs from '../userDashboard/myDocs.component.jsx';
import Search from '../userDashboard/search.component.jsx';
import EditDocument from '../../modals/editDocForm.component.jsx';
import * as userActions from '../../../actions/userManagement/getUsers.js';
import * as roleActions from '../../../actions/roleManagement/getRoles.js';
import deleteUserAction from '../../../actions/userManagement/deleteUser';
import editUserActions from '../../../actions/userManagement/editUser.js';
import searchDocs from '../../../actions/documentManagement/searchDocs.js';
import searchUsers from '../../../actions/userManagement/searchUsers.js';


class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.setEditDocument = this.setEditDocument.bind(this);
    this.setDeleteDocument = this.setDeleteDocument.bind(this);
    this.setViewDocument = this.setViewDocument.bind(this);
    this.handleSearchBarView = this.handleSearchBarView.bind(this);
    this.updateUser = this.updateUser.bind(this);
    const token = window.localStorage.getItem('token');
    this.state = {
      AdminRoleId: 1,
      searchBarView: 'noShow',
      authUser: jwtDecode(token) || {},
    };
  }
  componentWillReceiveProps(nextProps){
    const keys = ['users', 'documents', 'roles'];
    keys.forEach(key=>{
      if(nextProps[key]){
        this.setState({
          [key]: nextProps[key]
        });
      }
    });
  }

  handleSearchBarView(view) {
    this.setState({ searchBarView: view });
    $('ul.tabs').tabs('select_tab', 'searchTab');    
  }

  setViewDocument(document) {
    this.setState({
      viewTitle: document.title,
      viewDocument: document.content,
      documentId: document.id
    });
  }
  setEditDocument(document){
    this.setState({
      editDocument: document,
      documentId: document.id
    });
  }
  updateUser(values, id) {
    this.props.actionEditUser(values, id);
  }
  setDeleteDocument(documentId) {
    this.props.DeleteDocument(documentId);
  }
  componentWillMount() {
    const userId = this.state.authUser.userId || null
    this.props.actionsUser.viewUsers();
    this.props.actionsRole.viewRoles();
  }
  componentDidMount() {
    $('ul.tabs').tabs();
  }
  render() {
    return (
      <div>
        <div id="modalEdit" className="modal modal-fixed-footer">
          <div className="modal-content">
            <h4>Edit Document</h4>
            <EditDocument document={this.state.editDocument || null} documentId={this.state.documentId || null} onEdit={this.props.EditDocument} />
          </div>
          <div className="modal-footer">
            <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat ">Close</a>
          </div>
        </div>
        <div id="modalView" className="modal modal-fixed-footer">
          <div className="modal-content">
            <h4 className="center">View Document</h4>
            <h5>Title</h5>
            <div>{ this.state.viewTitle }</div>
            <h5>Content</h5>            
            <div dangerouslySetInnerHTML={{ __html: this.state.viewDocument}} />
          </div>
          <div className="modal-footer">
            <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat ">Closet</a>
          </div>
        </div>
        
        <div className="mainContainer">
          <div className="bg"></div>
          <Navbar />
          <SubNavBar handleSearchBarView={this.handleSearchBarView}/>
          <div className="row">
            <div className="tabRow">
              <ul className="tabs tabs-fixed-width">
                <li className="tab"><Link to="#test1" className="active">All Documents</Link></li>
                <li className="tab"><Link to="#test2">User List</Link></li>
                <li className="tab"><Link to="#test3">Role List</Link></li>
                <li className="tab"><Link to="#test4">My Documents</Link></li>
                <li className="tab"><Link to="#searchTab">Search</Link></li>
              </ul>
            </div>

            <div id="test1" className="tabContent col s12">
              <center className="paginationKey">
                <Pagination id="allPagination" className="pag"
                  items={this.props.documentPages}
                  maxButtons={8}
                  onSelect={(page) => {
                    const offset = (page - 1) * 10;
                    this.props.pagination(offset);
                  }}
                  />
              </center>
              <AllDocs document={this.props.documents} setViewDocument={this.setViewDocument} />
            </div>
            <div id="test2" className="tabContent col s12">
              <center className="paginationKey">
                <Pagination id="allPagination" className="pag"
                  items={this.props.userPages}
                  maxButtons={8}
                  onSelect={(page) => {
                    const offset = (page - 1) * 10;
                    this.props.actionsUser.viewUsers(offset);
                  }}
                  />
              </center>
              <Users updateUser={this.updateUser} users={this.props.users} roles={this.props.roles} deleteUser={this.props.deleteUser}/>
            </div>
            <div id="test3" className="tabContent col s12">
              <Roles roles={this.props.roles} />
            </div>
            <div id="test4" className="tabContent col s12">
              <MyDocs document={this.props.documents} setEditDocument={this.setEditDocument} setViewDocument={this.setViewDocument} setDeleteDocument={this.setDeleteDocument} />
            </div>
            <div id="searchTab" className="tabContent col s12">
              <center className="paginationKey">
                <Pagination id="searchPagination" className="pag"
                  items={this.state.searchBarView ? this.props.documentSearchPages : this.props.userSearchPages}
                  maxButtons={8}
                  onSelect={(page) => {
                    const offset = (page - 1) * 10;
                    {this.state.searchBarView ?
                    this.props.DocSearch(this.props.documentSearchQuery, offset)
                    :
                    this.props.UserSearch(this.props.userSearchQuery, offset) }
                  }}
                  />
              </center>
              <Search document={this.props.documents} setViewDocument={this.setViewDocument} users={this.props.users} view= {this.state.searchBarView} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// export default Dashboard;
const mapStoreToProps = (state) => {
  return {
    documentPages: state.documentReducer.pageCount,
    documentSearchPages: state.documentReducer.searchPageCount,
    documentSearchQuery: state.documentReducer.query,
    userSearchPages: state.userReducer.searchPageCount,
    userSearchQuery: state.userReducer.query,
    userPages: state.userReducer.pageCount
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    EditDocument: (documentDetails, documentId) => dispatch(EditDocument(documentDetails, documentId)),
    DeleteDocument: (documentId) => dispatch(DeleteDocument(documentId)),
    actionsUser: bindActionCreators(userActions, dispatch),
    actionsRole: bindActionCreators(roleActions, dispatch),
    viewUser: (usertoken, userId) => dispatch(viewUserAction(usertoken, userId)),
    deleteUser: (userId) => dispatch(deleteUserAction(userId)),
    actionEditUser: bindActionCreators(editUserActions, dispatch),
    UserSearch: (query, offset) => dispatch(searchUsers(query, offset)),
    DocSearch: (query, offset) => dispatch(searchDocs(query, offset))
  };
};
export default connect(mapStoreToProps, mapDispatchToProps)(AdminDashboard);
