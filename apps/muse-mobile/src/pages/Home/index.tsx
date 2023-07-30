import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { StartReview } from './StartReview';

export const Home = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <StartReview />
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({});
