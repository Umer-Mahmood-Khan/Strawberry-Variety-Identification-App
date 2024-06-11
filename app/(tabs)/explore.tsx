import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cheerio from 'cheerio';
import { StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Define a type for strawberry information
interface StrawberryInfo {
  name: string;
  description: string;
  physicalCharacteristics: string;
  culinaryRecommendations: string;
  growthConditions: string;
}

export default function TabTwoScreen() {
  const [strawberryInfo, setStrawberryInfo] = useState<StrawberryInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://en.wikipedia.org/wiki/List_of_strawberry_cultivars');
        const html = response.data;
        const $ = cheerio.load(html);

        // Example: Extracting the first row from the table
        const firstRow = $('table.wikitable tbody tr').first();
        const columns = $(firstRow).find('td').toArray();
        const name = $(columns[0]).text().trim();
        const description = $(columns[1]).text().trim();
        const physicalCharacteristics = $(columns[2]).text().trim();
        const culinaryRecommendations = $(columns[3]).text().trim();
        const growthConditions = $(columns[4]).text().trim();

        // Example: Storing extracted information in state
        setStrawberryInfo({
          name,
          description,
          physicalCharacteristics,
          culinaryRecommendations,
          growthConditions,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}
    >
      {strawberryInfo ? (
        <>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">{strawberryInfo.name}</ThemedText>
          </ThemedView>
          <ThemedText>Description: {strawberryInfo.description}</ThemedText>
          <ThemedText>Physical Characteristics: {strawberryInfo.physicalCharacteristics}</ThemedText>
          <ThemedText>Culinary Recommendations: {strawberryInfo.culinaryRecommendations}</ThemedText>
          <ThemedText>Growth Conditions: {strawberryInfo.growthConditions}</ThemedText>
        </>
      ) : (
        <ThemedText>Loading...</ThemedText>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
