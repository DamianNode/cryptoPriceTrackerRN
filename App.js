import React, { useRef, useMemo, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import ListItem from './components/ListItem';
import Chart from './components/Chart';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { SAMPLE_DATA } from './assets/data/sampleData';
import { getMarketData } from './services/cryptoService';

const ListHeader = () => (
  <>
    <View style={styles.titleWrapper}>
      <Text style={styles.largTitle}>Markets</Text>
    </View>
    <View style={styles.divider} />
  </>
)

export default function App() {
  const [data, setData] = useState([]);
  const [selectedCoinData, setSelectedCoinData] = useState(null);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['50%'], []);

  const handlePresentModalPress = (item) => {
    setSelectedCoinData(item);
    bottomSheetModalRef.current?.present();
  }

  useEffect(() => {
    const fetchMarketData = async () => {
      const marketData = await getMarketData();
      setData(marketData);
    }

    fetchMarketData();
  }, [])

  return (
    <BottomSheetModalProvider>
      <SafeAreaView  style={styles.container}>
        <FlatList
          keyExtractor={(item) => item.id}
          data={data}
          renderItem={({ item }) => (
            <ListItem 
              name={item.name} 
              symbol={item.symbol} 
              currentPrice={item.current_price}
              priceChangePercentage7d={item.price_change_percentage_7d_in_currency} 
              logoUrl={item.image}
              onPress={() => handlePresentModalPress(item)}   
            />
          )}
          ListHeaderComponent={ListHeader}
        />
      </SafeAreaView>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        style={styles.bottomSheet}
      >
        {selectedCoinData && (
          <Chart 
            name={selectedCoinData.name}
            symbol={selectedCoinData.symbol}
            currentPrice={selectedCoinData.current_price}
            priceChangePercentage7d={selectedCoinData.price_change_percentage_7d_in_currency}
            logoUrl={selectedCoinData.image}
            sparkline={selectedCoinData.sparkline_in_7d.price}
          />
        )}
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleWrapper: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  largTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#A9ABB1',
    marginHorizontal: 16,
    marginTop: 16,
  },
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: .25,
    shadowRadius: 4,
    elevation: 5,
  }
});
