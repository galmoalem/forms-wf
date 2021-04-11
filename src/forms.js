import React from "react";
import {Redirect} from "react-router-dom";
import FormSign from './form-sign';
import { Table} from 'antd';
import axios from 'axios';




 class Forms extends React.Component{

  constructor(props){
    super(props)
 this.state ={
    redirect:false,
    forms:null,
    record : null,
    loading:true,
   }
  
}
 


async getUsersData(){
  const res = await axios.get('http://localhost:3001/forms/all')
  this.setState({loading:false, forms: res.data})
}

componentDidMount(){
  this.getUsersData()
}

render(){

  // create table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
     
      key : 'name',
      render: text => <a href = "!#" >{text}</a>,
      
    },
    {
      title: 'DNS',
      dataIndex: 'ips',
      render: text => <a href = "!#" key={text} >{ " "+text}</a>,
    },
    {
      title: 'company',
      dataIndex: 'company',
      render: text => <a href = "!#" key={text}>{text}</a>
    },

    {
      title: 'isSubmit',
      dataIndex: 'isSubmit',
      render: text => <a href = "!#" key={text}>{String(text)}</a>
      
    },
  ];

  // redirect to form-sign page when double clicking on a row 
  if(this.state.redirect === true){
    return <Redirect  to={{pathname:"/", state:{data:this.state.record} }} Component={FormSign}  />
    } 

// we will stay in the loading state untill data will arrive
  if (this.state.loading )
 return <div key="r">Loading Please wait...</div>
 
 

 return (<Table 
    onRow={  (record,rowIndex) => {
   
    return {
     
      onDoubleClick: event => { 
    this.setState({record:record,redirect:true});
  }// double click row
 
    };
  }}

  rowKey="_id"   columns={columns} dataSource={this.state.forms} />);
}

}

export default Forms;