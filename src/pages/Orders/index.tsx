import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';

import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  HeaderTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
  CloseIconButton
} from './styles';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  thumbnail_url: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Food[]>([]);

  const { navigate } = useNavigation();
  useEffect(() => {
    async function loadOrders(): Promise<void> {
      const { data } = await api.get<Food[]>('orders');

      setOrders(
        data.map<Food>(order => ({
          ...order,
          formattedPrice: formatValue(order.price),
        })),
      );
    }
    loadOrders();
  }, []);


  async function handleNavigate(id: number): Promise<void> {
    navigate('OrderDetails', {
      id,
    });
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus pedidos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={orders}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Food key={item.id} activeOpacity={0.6} onPress={() => handleNavigate(item.id)}>
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: item.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodPricing>{item.formattedPrice}</FoodPricing>
              </FoodContent>
              <CloseIconButton>
                <MaterialIcon name="close" size={24} color="#FFB84D" />
              </CloseIconButton>
            </Food>
          )}
        />
      </FoodsContainer>
    </Container>
  );
};

export default Orders;
