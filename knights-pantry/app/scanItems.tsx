import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { GEMINI_API_KEY } from '../config';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';

export default function ScanItemsPage() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any | null>(null);
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera permission is required!');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setBarcode(null);
    }
  };

  const extractBarcode = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64 = await FileSystem.readAsStringAsync(image, { encoding: FileSystem.EncodingType.Base64 });
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: "This is a photo of a product barcode. Please read the barcode number (UPC or EAN) from the image and return only the number. If you cannot find a barcode, reply with 'NO BARCODE'."
                  },
                  {
                    inlineData: {
                      mimeType: 'image/jpeg',
                      data: base64,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );
      const result = await response.json();
      console.log('Gemini API response:', JSON.stringify(result, null, 2));
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      setBarcode(text || 'No barcode found');
    } catch (e) {
      setBarcode('Error extracting barcode');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductInfo = async () => {
    if (!barcode || barcode === 'No barcode found' || barcode === 'Error extracting barcode') return;
    setProductLoading(true);
    setProductError(null);
    setProduct(null);
    try {
      const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`);
      const data = await response.json();
      console.log('UPCItemDB API response:', JSON.stringify(data, null, 2));
      if (data.items && data.items.length > 0) {
        const prod = data.items[0];
        router.push({
          pathname: '/confirmProduct',
          params: {
            title: prod.title,
            description: prod.description,
            image: prod.images && prod.images[0] ? prod.images[0] : '',
          },
        });
      } else {
        setProductError('No product found for this barcode.');
      }
    } catch (e) {
      setProductError('Error fetching product info.');
    } finally {
      setProductLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TopBar onLogout={() => router.replace('/')} />
        <Text style={styles.heading}>Scan Items</Text>
        <View style={styles.cameraBox}>
          {!image ? (
            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Text style={styles.photoButtonText}>Take Photo</Text>
            </TouchableOpacity>
          ) : (
            <Image source={{ uri: image }} style={styles.photo} />
          )}
        </View>
        {image && !barcode && !loading && (
          <TouchableOpacity style={styles.logButton} onPress={extractBarcode}>
            <Text style={styles.logButtonText}>Extract Barcode</Text>
          </TouchableOpacity>
        )}
        {loading && <ActivityIndicator size="large" color={YELLOW} style={{ marginTop: 18 }} />}
        {barcode && !product && !productLoading && (
          <TouchableOpacity style={styles.logButton} onPress={fetchProductInfo}>
            <Text style={styles.logButtonText}>Next</Text>
          </TouchableOpacity>
        )}
        {productLoading && <ActivityIndicator size="large" color={YELLOW} style={{ marginTop: 18 }} />}
        {product && (
          <View style={styles.productBox}>
            {product.images && product.images[0] && (
              <Image source={{ uri: product.images[0] }} style={styles.productImage} />
            )}
            <Text style={styles.productTitle}>{product.title}</Text>
            <Text style={styles.productBrand}>{product.brand}</Text>
            <Text style={styles.productDesc}>{product.description}</Text>
          </View>
        )}
        {productError && (
          <Text style={{ color: 'red', marginTop: 18 }}>{productError}</Text>
        )}
      </View>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BLACK,
  },
  container: {
    flex: 1,
    backgroundColor: BLACK,
    paddingHorizontal: 20,
    paddingTop: 16,
    justifyContent: 'flex-start',
  },
  heading: {
    color: WHITE,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    marginTop: 10,
    lineHeight: 32,
  },
  cameraBox: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#222',
    marginBottom: 24,
    minHeight: 320,
    maxHeight: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButton: {
    backgroundColor: YELLOW,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  photoButtonText: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 18,
  },
  photo: {
    width: 220,
    height: 220,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  logButton: {
    backgroundColor: YELLOW,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 18,
  },
  logButtonText: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 18,
  },
  resultBox: {
    backgroundColor: WHITE,
    borderRadius: 10,
    padding: 16,
    marginTop: 18,
    alignItems: 'center',
  },
  resultText: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 20,
  },
  productBox: {
    backgroundColor: WHITE,
    borderRadius: 10,
    padding: 16,
    marginTop: 18,
    alignItems: 'center',
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  productTitle: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 4,
    textAlign: 'center',
  },
  productBrand: {
    color: '#444',
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  productDesc: {
    color: '#333',
    fontSize: 15,
    textAlign: 'center',
  },
}); 