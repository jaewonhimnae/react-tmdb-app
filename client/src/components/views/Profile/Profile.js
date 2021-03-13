import React, { useReducer, useState }  from 'react';
import './Profile.css';
import axios from 'axios';

import moment from "moment";
import { ErrorMessage, Formik } from 'formik';
import * as Yup from 'yup';

import { useDispatch, useSelector } from "react-redux";

import {  Form,  Input,  Button,  Avatar,  Upload, message } from 'antd';
import { LoadingOutline, PlusOutline, UploadOutline, CheckOutline } from '@ant-design/icons';

const imageToBase64 = require('image-to-base64');

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

function Profile(props) {
  
    const dispatch = useDispatch();
    function auth(){
      const request = axios.get(`/api/users/auth`).then(response => console.log(response));
  
      return {
          payload: request
      }
    }

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
      const base64 = getBase64(file);
      console.log(base64)
      linkToImage(base64);
      return base64
    };

    function getBase64(file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        console.log(reader.result.split(',')[1]);
        return reader.result.split(',')[1];
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
        return
      };
   }
    // const linkToImage = (base64) => {
    //   var FormData = require('form-data');
    //   var data = new FormData();
    //   data.append('image', 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');

    //   var config = {
    //     method: 'post',
    //     url: 'https://api.imgur.com/3/image',
    //     headers: { 
    //       'Authorization': 'Client-ID 71ace28d96410a0', 
    //       'Content-Type': 'application/json',
    //       'Connection': 'keep-alive',
    //       'Accept': '*/*',
    //       'Accept-Encoding': 'gzip, deflate, br',
    //     },
    //     data : data
    //   };

    //   axios(config)
    //   .then(function (response) {
    //     console.log(JSON.stringify(response.data));
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
    // }
    const linkToImage =  (base64) => {
      let data = new FormData();
      data.append('image', base64);
      try {
        axios({
          method: "post",
          url: "https://api.imgur.com/3/image",
          headers: { 
            'Authorization' : 'Client-ID 71ace28d96410a0',
            'Content-Type': 'application/json',
            'Connection': 'keep-alive',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
          },
          data: data,
        })
        .then((response) => {
            //handle success
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            //handle error
            console.log(error);
        });
      } catch (error) {
        console.error(error);
      }
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
        console.log(values);
        const res = axios.post(`/api/users/update`, values).then(
          response => console.log(response)
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
                                const base64 = uploadImage(e);
                                linkToImage(base64);
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