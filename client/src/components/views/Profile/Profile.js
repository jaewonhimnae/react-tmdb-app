import React, { useReducer, useState }  from 'react';
import './Profile.css';

import moment from "moment";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from "../../../_actions/user_actions";
import { useDispatch, useSelector } from "react-redux";

import {  Form,  Input,  Button,  Avatar,  Upload, message } from 'antd';
import { LoadingOutline, PlusOutline, UploadOutline, CheckOutline } from '@ant-design/icons';

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
    const user = useSelector(state => state.user)
    console.log(user);

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

    const uploadImage = async (e) => {
      const file = e.target.files[0];
      if (beforeUpload(file) === false)
        return false;
      const base64 = await convertBase64(file);
      // console.log(base64);
    };

    const convertBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
          resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    }
    return (

    <Formik

      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required('Name is required'),
        email: Yup.string()
          .email('Email is invalid'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Confirm Password is required')
      })}
    >

        {   props => {
              const {
              values,
              touched,
              errors,
              dirty,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              handleReset,
              } = props;

            
              return (
                user.userData ? (
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
                        <Form.Item label="Name">
                            <Input
                              id="name"
                              type="text"
                              value={user.userData.name}
                              onChange={handleChange}
                              className={
                                  errors.name && touched.name ? 'text-input error' : 'text-input'
                              }
                            />
                            {
                              errors.name && touched.name && 
                                (<div className="input-feedback">{errors.name}</div>)
                            }
                        </Form.Item>

                        <Form.Item label="Email"  validateStatus={errors.email && touched.email ? "error" : 'success'}>
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
                        
                        <Form.Item label="Upload">
                            <input 
                              type="file"
                              id="file"
                              onChange={(e) => {
                                // console.log(e.target.files)
                                uploadImage(e);
                              }}
                            />
                        </Form.Item>

                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" disabled={isSubmitting}>
                            Submit
                            </Button>
                        </Form.Item>
                      </Form>
                  </div>) : ('')
            ); 
            
        }}
    </Formik>
  );
};

export default Profile