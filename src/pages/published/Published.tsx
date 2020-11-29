import {PageContainer} from '@ant-design/pro-layout';
import React, {ReactNode, useEffect, useState} from 'react';
import {Avatar, Card, Select} from 'antd';
import {EditOutlined, DeleteOutlined, AreaChartOutlined} from '@ant-design/icons/lib';
import {gql} from 'apollo-boost';
import {client} from '../../../config/graphqlConfig';
import {Furniture, FurnitureTypeResolver} from '@/pages/unpublished/table.model';

const { Meta } = Card;
const { Option } = Select;

const LIST_PUBLISHED_FURNITURE = gql`
  query listAllByPublishStatus($isPublished: Boolean!) {
    listAllByPublishStatus(isPublished: $isPublished) {
      id,
      name,
      type,
      price,
      code,
      count,
      isPublished,
      image,
      models,
      description
    }
  }
`;

const Published: React.FC = () => {
  const [furnitureList, setFurnitureList] = useState<Furniture[]>([]);

  const fetchData = (): Promise<Furniture[]>=> {
    return client.query({query: LIST_PUBLISHED_FURNITURE, variables: {isPublished: true}, fetchPolicy: 'no-cache'}).then((res) => {
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
          image: item.image,
          model3D: item.model,
          description: item.description,
        });
      }

      return items;
    });
  };

  useEffect(() => {
    fetchData().then((furniture: Furniture[]) => {
      setFurnitureList(furniture);
    });
  }, []);

  return (<PageContainer>
      <Select defaultValue="all" style={{ width: 120, marginBottom: 10 }} onChange={() => console.log('Hello')}>
        <Option value="all">Бүгд</Option>
        <Option value="chair">Сандал</Option>
        <Option value="bed">Ор</Option>
        <Option value="table">Ширээ</Option>
      </Select>

      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {furnitureList.map((furniture: Furniture) => <div style={{marginRight: 15, marginBottom: 15}}>
          <Card
            style={{ width: 300, height: 350 }}
            cover={
              <img
                style={{maxWidth: 300, maxHeight: 225}}
                alt="example"
                src={`http://localhost:4000/placely/images/${furniture.image}`}
              />
            }
            actions={[
              <EditOutlined key="edit" />,
              <AreaChartOutlined key="statistics" />,
              <DeleteOutlined key="delete" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
              title={furniture.name}
              description={furniture.description}
            />
          </Card>
        </div>)}
      </div>

    </PageContainer>
  );
};

export default Published;
