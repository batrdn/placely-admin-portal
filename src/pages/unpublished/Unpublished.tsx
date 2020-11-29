import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Button, Divider, Modal, Table, Form, Select, Input, InputNumber, Upload} from 'antd'
import {InboxOutlined, PlusOutlined, PaperClipOutlined} from '@ant-design/icons/lib';
import {gql} from 'apollo-boost';
import {Furniture, FurnitureTypeResolver} from '@/pages/unpublished/table.model';
import styles from './style.less';
import {client} from '../../../config/graphqlConfig';

const {Option} = Select;
const {TextArea} = Input;
const {Dragger} = Upload;

const axios = require('axios');

const CREATE_FURNITURE = gql`
  mutation createFurniture($name: String!, $type: FurnitureType!, $code: String!, $price: Float!, $count: Int!, $description: String) {
    createFurniture(name: $name, type: $type, code: $code, price: $price, count: $count, description: $description) {
      id,
      name,
      type,
      price,
      code,
      count,
      isPublished,
      description
    }
  }
`;

const LIST_UNPUBLISHED_FURNITURE = gql`
  query listAllByPublishStatus($isPublished: Boolean!) {
    listAllByPublishStatus(isPublished: $isPublished) {
      id,
      name,
      type,
      price,
      code,
      count,
      isPublished,
      description
    }
  }
`;

const PUBLISH_FURNITURE = gql`
  mutation publish($id: String!, $image: String!, $models: [String]!) {
    publish(id: $id, image: $image, models: $models)
  }
`;

const Unpublished: React.FC = () => {
  const [modalState, setModalState] = useState(false);
  const [publishState, setPublishState] = useState(false);
  const [form] = Form.useForm();
  const [tableLoading, setTableLoading] = useState(true);
  const [dataSource, setDataSource] = useState<Furniture[]>([]);
  const [image, setImage] = useState();
  const [models] = useState<string[]>([]);
  const [selectedFurniture, setSelectedFurniture] = useState<string>();

  const onPublishClick = (selected: Furniture) => {
    setSelectedFurniture(selected.id);
    setPublishState(true);
  };

  const columns = [
    {
      title: 'Тавилгын нэр',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Тавилгын төрөл',
      dataIndex: 'type',
      key: 'type',
    },
    {title: 'Код', dataIndex: 'code', key: 'code'},
    {title: 'Тоо ширхэг', dataIndex: 'count', key: 'count'},
    {title: 'Үнэ', dataIndex: 'price', key: 'price'},
    {title: 'Тайлбар', dataIndex: 'description', key: 'description'},
    {
      title: 'Сонголт',
      key: 'option',
      render: (_, data) => (
        <>
          <a onClick={() => onPublishClick(data)}>
            Нийтлэх
          </a>
          <Divider type="vertical"/>
          <a onClick={() => console.log(data)}>Өөрчлөх</a>
          <Divider type="vertical"/>
          <a href="">Устгах</a>
        </>
      ),
    },
  ];

  const fetchData = () => {
    client.query({query: LIST_UNPUBLISHED_FURNITURE, variables: {isPublished: false}, fetchPolicy: 'no-cache'}).then((res) => {
      const items: Furniture[] = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const item of res.data.listAllByPublishStatus) {
        items.push({
          id: item.id,
          name: item.name,
          type: FurnitureTypeResolver.resolve((item.type as string).toUpperCase()),
          code: item.code,
          price: item.price,
          count: item.count,
          isPublished: item.isPublished,
          description: item.description
        });
      }

      setDataSource(items);
      setTableLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        setTableLoading(true);
        client.mutate({
          mutation: CREATE_FURNITURE, variables: {
            name: values.name,
            type: (values.type as string).toUpperCase(),
            code: values.code,
            price: values.price,
            count: values.count,
            description: values.description
          }
        }).then(() => {
          setModalState(false);
          fetchData();
        });
      })
      .catch(info => {
        console.log(info);
      });
  };

  const handleCancel = () => {
    setModalState(false);
  };

  const handleImageUpload = (info) => {
    const {status} = info.file;

    if (status === 'done') {
      const file = info.file.originFileObj;
      const formData = new FormData();
      formData.append('image', file);
      axios.post('http://localhost:4000/placely/upload-furniture-image', formData).then((res) => {
        setImage(res.data.filename);
      });
    }
  };

  const handleModelUpload = (info) => {
    const {status} = info.file;

    if (status === 'done') {
      const file = info.file.originFileObj;
      const formData = new FormData();
      formData.append('model', file);
      axios.post('http://localhost:4000/placely/upload-3d-model', formData).then((res) => {
        models.push(res.data.filename);
      });
    }
  };

  const handlePublish = () => {
    client.mutate({
      mutation: PUBLISH_FURNITURE, variables: {
        id: selectedFurniture,
        image,
        models
      }
    }).then(() => {
      window.location.href = '/published';
    });
  };

  return (
    <PageContainer>
      <Button
        type="primary"
        className={styles.createButton}
        icon={<PlusOutlined/>}
        onClick={() => setModalState(true)}
      >
        Үүсгэх
      </Button>

      <Modal
        title="Тавилга үүсгэх"
        visible={modalState}
        onOk={handleSubmit}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Цуцлах
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Үүсгэх
          </Button>,
        ]}
      >
        <Form form={form}>
          <Form.Item id='name'
                     name='name'
                     required>
            <Input type='text' size='large' placeholder='Тавилгын нэр'/>
          </Form.Item>
          <div style={{display: 'flex'}}>
            <Form.Item id='type' name='type' required>
              <Select placeholder="Сонгох..." style={{width: 120, marginBottom: 10}} onChange={() => console.log('Hello')}>
                <Option value="chair">Сандал</Option>
                <Option value="bed">Ор</Option>
                <Option value="table">Ширээ</Option>
                <Option value="other">Бусад</Option>
              </Select>
            </Form.Item>
            <Form.Item id='code' name='code' className={styles.code} required>
              <Input type='text' placeholder='Тавилгын код'/>
            </Form.Item>
            <Form.Item id='price' name='price' className={styles.price} required>
              <InputNumber
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                // parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            <Form.Item id='count' name='count' className={styles.count} required>
              <InputNumber
                placeholder='Барааны тоо'
              />
            </Form.Item>
          </div>
          <Form.Item id='description' name='description' required>
            <TextArea placeholder='Тайлбар' rows={4}/>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Тавилга нийтлэх"
             visible={publishState}
             footer={[
               <Button key="back" onClick={() => setPublishState(false)}>
                 Цуцлах
               </Button>,
               <Button key="submit" type="primary" onClick={handlePublish}>
                 Нийтлэх
               </Button>,
             ]}>
        <h3>Тавилгын зураг оруулах</h3>
        <Dragger name='file' onChange={handleImageUpload}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined/>
          </p>
          <p className="ant-upload-text">Файлыг чирж эсвэл энд дарж оруулна уу.</p>
          <p className="ant-upload-hint">
            Тавилгын зургийг оруулах
          </p>
        </Dragger>
        <h3>Тавилгын 3D моделыг оруулах</h3>
        <Dragger name='file' onChange={handleModelUpload} multiple={true}>
          <p className="ant-upload-drag-icon">
            <PaperClipOutlined/>
          </p>
          <p className="ant-upload-text">Файлыг чирж эсвэл энд дарж оруулна уу.</p>
          <p className="ant-upload-hint">
            Тавилгын 3D мопелыг оруулах. 3D модел нь заавал .GLTF өргөтгөлтэй байна.
          </p>
        </Dragger>
      </Modal>

      <Table columns={columns} loading={tableLoading} dataSource={dataSource} scroll={{x: 1000}} locale={{emptyText: 'Мэдээлэл олдсонгүй'}}/>
    </PageContainer>
  );
};

export default Unpublished;
