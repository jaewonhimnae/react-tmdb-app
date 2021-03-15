import React  from 'react';
import './Profile.css';
import axios from 'axios';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { useDispatch, useSelector } from "react-redux";

import {  Form,  Input,  Button,  Avatar, message } from 'antd';


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function Profile() {
    const user = useSelector(state => state.user)

    function beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    }

    const uploadImage = (e) => {
      const file = e.target.files[0];
      if (beforeUpload(file) === false)
        return false;
      linkToImage(file)
    };

    // function getBase64(file) {
    //   var reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   reader.onload = function () {
    //     console.log(reader.result.split(',')[1]);
    //     return reader.result.split(',')[1];
    //   };
    //   reader.onerror = function (error) {
    //     console.log('Error: ', error);
    //     return
    //   };
    //  }

    const linkToImage =  (file) => {
      const r = new XMLHttpRequest()
      const d = new FormData()
      // const e = document.getElementById('image').files[0]
      var u

      d.append('image', file)

      r.open('POST', 'https://api.imgur.com/3/image/')
      r.setRequestHeader('Authorization', `Client-ID 71ace28d96410a0`)
      r.onreadystatechange = function () {
        if(r.status === 200 && r.readyState === 4) {
          let res = JSON.parse(r.responseText)
          u = `https://i.imgur.com/${res.data.id}.png`
          // console.log (u);
          const d = document.createElement('div')
          d.className = 'image'
          document.getElementsByTagName('body')[0].appendChild(d)

          const i = document.createElement('img')
          i.className = 'image-src'
          i.src = u
          document.getElementsByClassName('image')[0].appendChild(i)

          const a = document.createElement('a')
          a.className= 'image-link'
          a.href = u
          document.getElementsByClassName('image')[0].appendChild(a)

          const p = document.createElement('p')
          p.className = 'image-url'
          p.innerHTML = u
          document.getElementsByClassName('image-link')[0].appendChild(p)
        }
      }
      r.send(d)
    }

    return (
      user.userData ? 
    (<Formik
      initialValues={{
        name: user.userData.name,
        lastname: user.userData.lastname,
        email: user.userData.email,
        phoneNumber: user.userData.phoneNumber,
        address: user.userData.address,
        image: ''
      }}

      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required('Name is required')
          .matches(/^[aA-zZ0-9\s]+$/, "Only alphabets are allowed for this field "),
        lastname: Yup.string()
          .matches(/^[aA-zZ0-9\s]+$/, "Only alphabets are allowed for this field "),
        email: Yup.string()
          .required('Email is required')
          .email('Email is invalid'),
        phoneNumber: Yup.string()
          .matches(/^[0-9]+$/, "That doesn't look like a phone number")
          .max(10),
        address: Yup.string()
          .matches(/^[a-zA-z0-9,-/\s]+$/,  "That doesn't look like a address")
      })}

      onSubmit = {(values) => {
        // console.log(values);
        const res = axios.post(`/api/users/update`, values).then(
          response => console.log("Success")
        );
      }}
    >

        {   props => {
              const {
              values,
              dirty,
              touched,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              } = props;

            
              return (
                
                  <div 
                    className="app" 
                  >
                    <div className="profile-avatar">
                      <Avatar
                          src={user.userData.image}
                          size={100}
                      />
                    </div>

                      <Form style={{ minWidth: '375px' }} {...formItemLayout} onSubmit={handleSubmit} >

                        {/* Field name */}
                        <Form.Item required label="Name">
                            <Input
                              id="name"
                              type="text"
                              value={values.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={
                                  errors.name && touched.name ? 'text-input error' : 'text-input'
                              }
                            />
                            {
                              errors.name && touched.name && 
                                (<div className="input-feedback">{errors.name}</div>)
                            }
                        </Form.Item>

                        {/* Field lastname */}
                        <Form.Item label="Last name">
                            <Input
                              id="lastname"
                              type="text"
                              value={values.lastname}
                              onChange={handleChange}
                            />
                            {
                              errors.lastname && touched.lastname && 
                                (<div className="input-feedback">{errors.lastname}</div>)
                            }
                        </Form.Item>
                          {/* Field email */}
                        <Form.Item required label="Email"  validateStatus={errors.email && touched.email ? "error" : 'success'}>
                            <Input
                              id="email"
                              type="email"
                              value={user.userData.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={
                                  errors.email && touched.email ? 'text-input error' : 'text-input'
                              }
                            />
                            {
                              errors.email && touched.email && 
                                (<div className="input-feedback">{errors.email}</div>)
                            }
                        </Form.Item>
                            {/* Field address */}
                        <Form.Item label="Address">
                            <Input
                              id="address"
                              type="text"
                              value={values.address}
                              onChange={handleChange}
                              className={
                                  errors.address && touched.address ? 'text-input error' : 'text-input'
                              }
                            />
                            {
                              errors.address && touched.address && 
                                (<div className="input-feedback">{errors.address}</div>)
                            }
                        </Form.Item>
                            {/* phoneNumber */}
                        <Form.Item label="Phone number">
                            <Input
                              id="phoneNumber"
                              type="text"
                              value={values.phoneNumber}
                              onChange={handleChange}
                              className={
                                  errors.phoneNumber && touched.phoneNumber ? 'text-input error' : 'text-input'
                              }
                            />
                            {
                              errors.phoneNumber && touched.phoneNumber && 
                                (<div className="input-feedback">{errors.phoneNumber}</div>)
                            }
                        </Form.Item>

                        <Form.Item label="Upload">
                            <input 
                              type="file"
                              id="image"
                              onChange={(e) => {
                                uploadImage(e);
                              }}
                              value={values.image}
                            />
                        </Form.Item>

                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" disabled={isSubmitting} onClick={handleSubmit}>
                            Submit
                            </Button>
                        </Form.Item>
                      </Form>
                  </div>
            ); 
            
        }}
    </Formik>) : ('')
  );
};

export default Profile