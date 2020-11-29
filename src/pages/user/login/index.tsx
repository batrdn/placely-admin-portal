import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {message} from 'antd';
import React, {useState} from 'react';
import ProForm, {ProFormCheckbox, ProFormText} from '@ant-design/pro-form';
import {Link, history} from 'umi';
import {login, LoginParamsType} from '@/services/login';

import styles from './index.less';
import {FormattedMessage} from '@@/plugin-locale/localeExports';

const goto = () => {
  const {query} = history.location;
  const {redirect} = query as { redirect: string };
  window.location.href = redirect || '/';
};

const Login: React.FC<{}> = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      const response = await login({...values});
      if (response) {
        message.success('Амжилттай нэвтэрлээ!');
        goto();
        return;
      }
    }
    catch (error) {
      message.error('Нэвтрэхэд алдаа гарлаа.');
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src="/logo.svg"/>
              <span className={styles.title}>Placely</span>
            </Link>
          </div>
          <div className={styles.desc}>Тавилгын AR Аппликейшн</div>
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: 'Нэвтрэх'
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values);
            }}
          >

            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon}/>,
                }}
                placeholder='Нэвтрэх нэр'
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="Нэвтрэх нэр заавал оруулна уу!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon}/>,
                }}
                placeholder='Нууц үг'
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="Нууц үг заавал оруулна уу!"
                      />
                    ),
                  },
                ]}
              />
            </>

            <div
              style={{
                marginBottom: 24,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                <FormattedMessage id="pages.login.rememberMe" defaultMessage="Намайг сана?"/>
              </ProFormCheckbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                <FormattedMessage id="pages.login.forgotPassword" defaultMessage="Нууц үг сэргээх"/>
              </a>
            </div>
          </ProForm>
        </div>
      </div>
    </div>
  );
};

export default Login;
