
import React from 'react';
import { Form, Input, Button ,Select} from 'antd';
import 'antd/dist/antd.css';
import './index.css';
import { MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import axios from 'axios';


const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
   xs: { span: 16, offset: 2 },
    sm: { span: 5, offset: 0 }
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 3,
    span: 16, 
  },
};





const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 7 },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 16, offset: 0 },
    sm: { span: 7, offset: 4 },
  },
};

// get rid from duplicates and empty items 
function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j] || a[j] === null)
                a.splice(j--, 1);
        }
    }

    return a;
}

class FormSign extends React.Component {

 
constructor(props) {
  super(props);
  this.state = {
    isSubmit: false,
    name :null,
    ips:[],
    company : 'checkpoint',
    id:null
};
this.handleUnload = this.handleUnload.bind(this);
    }
  
    
   
    
//create an event refresh and exit page without saving 
    componentDidMount() {
        window.addEventListener('beforeunload', this.handleUnload);
      }
    
      //destroy an event refresh and exit page without saving 
      componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handleUnload);
      }
    

//handle when trying to leave page or refresh page without submiting 
      handleUnload(e) {
        var message = "";
    let name = null;
    let company = null;
    let ips =[];
        (e || window.event).returnValue = message; //Gecko + IE
        
        if(this.props.location.state !== undefined)
        this.setState({isSubmit :this.props.location.state.data.isSubmit}) 

        if(this.props.location.state !== undefined)
      { if(this.state.name === null && this.props.location.state.data.name !== undefined)
        name = this.props.location.state.data.name } 
        else
        name = this.state.name


if(this.props.location.state !== undefined)
      {  if(this.state.company === null  && this.props.location.state.data !== undefined)
        company = this.props.location.state.data.company
        }else 
        company = this.state.company

    if(this.props.location.state !== undefined)
        ips = arrayUnique(this.props.location.state.data.ips.concat(this.state.ips));
   else 
     ips =arrayUnique(this.state.ips)

       
    const jsend = {
            name :  name ,
            ips :ips,
            company : company,
            isSubmit : this.state.isSubmit 
        }
        this.callApi(jsend);

        return message;
      }
    
     
      
        
    
     

    
// call api for create or update a form  
callApi = (data) => {

    let exist = true ;

    if ( this.state.id === null|| this.state.id === undefined){
        exist =false ;
    }


     
    if (exist === false)
    axios.post(`http://localhost:3001/forms/create`,data)
    .then(res => {
        this.setState({id:res.data._id});
      })
        else 
        axios.put(`http://localhost:3001/forms/update`,data, {params:{formId: this.state.id}})
         .then(res => {
    })
}

// click on submit button 
    onFinish = (values) => {
      
        this.setState({isSubmit:true});
  window.removeEventListener('beforeunload', this.handleUnload);
         if(values.name ==='please insert name')
        values.name = '';
        
        if(values.ips[0] ==='please insert ip')
        values.ips[0] = '';
        
        const jsend = {
            name : values.name,
            ips :values.ips,
            company : values.company,
            isSubmit : true 
        }
        
        this.callApi(jsend)
    
        
  };

   onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

// handle with checkbox changes
  onChangeCompany = (e) => {
        if( e !== null )
    this.setState({ company: e });
    }


// handle with name changes
  onChange = e =>{ 
     this.setState({ name: e })
    }

    // handle with ips changes
    onChangeList = (e,index) =>{  
    let ipsTemp = this.state.ips; 
    ipsTemp[index] = e ;
        this.setState({ ips : ipsTemp })
        }

  render(){

    

    let data =  {name:'please insert name',ips:['please insert ip'],company:'checkpoint'};


    if(this.props.location.state !== undefined)
     {
    data = this.props.location.state.data ;
  this.setState({id : this.props.location.state.data._id});
    }

    return (
  
        <Form 
      {...layout}
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={this.onFinish}
      onFinishFailed={this.onFinishFailed}
    >
        
      <Form.Item  initialValue={data.name}
            
        label="name"
        name="name1"
        rules={[
          {
            required: true,
            message: 'Please input your form name!',
          },
        ]}
       >
        <Input        
         name="name"
    onChange={event => this.onChange(event.target.value)}/>
       </Form.Item>

  

       <Form.List   initialValue={data.ips}
                  name="ips"
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names === 'please insert ip') {
                return Promise.reject(new Error('At least 1 DNS'));
              }
            },
          },
        ]}
       >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
              {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}

                label={index === 0 ? 'DNS' : ''}
                required={false}
                key={field.key}
              >
                <Form.Item               
                     
                    
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input DNS's name or delete this field.",
                    },
                  ]}
                  noStyle
                >
                  <Input onChange={event => this.onChangeList(event.target.value,index)} placeholder="DNS name" style={{ width: '60%' }} />
                </Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={(e) => {
                        if(this.props.location.state !== undefined)
                        this.props.location.state.data.ips.splice(field.name,1)  ;
                                              console.log(field)
                        remove(field.name)}}
                    
                  />
                ) : null}
              </Form.Item>
            ))}
            <Form.Item >
              <Button 
                type="dashed"
                onClick={() => add()}
                style={{ width: '60%' }}
                icon={<PlusOutlined />}
              >
                Add DNS
              </Button>
          
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item {...tailLayout} initialValue={data.company} name="company"
                 
                  > 
      <Select  style={{ width: 120 }} onSelect={event =>this.onChangeCompany(event)} >
      <Option value="checkpoint"  >checkpoint</Option>
      <Option value="backbox" >backbox</Option>
      <Option value="bt" >bt</Option>
       </Select>
  </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );}
};


export default FormSign;
