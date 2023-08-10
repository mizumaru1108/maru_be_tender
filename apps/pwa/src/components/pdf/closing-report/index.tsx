import React from 'react';
import { Page, Text, Image, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { Grid } from '@mui/material';

// Create styles
const styles = StyleSheet.create({
  page: {
    paddingTop: '24px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: '24px',
    paddingBottom: '10px',
  },
  titleContent: {
    fontWeight: 900,
    fontSize: '16px',
    textDecoration: 'underline',
    paddingBottom: '3px',
  },
  bodyContent: {
    fontWeight: 400,
    fontSize: '14px',
    paddingBottom: '10px',
  },
  image: {
    width: '150px',
    paddingRight: '20px',
  },
  qrCodeContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function ClosingReportPdf() {
  return (
    <PDFViewer>
      <Document>
        <Page size="A5" style={styles.page}>
          <Grid>
            <View style={styles.title}>
              <Text style={styles.title}>Closing Report</Text>
            </View>
            <View style={styles.wrapper}>
              <Image
                style={styles.image}
                src={
                  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                }
              />
            </View>
            <img
              src={
                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
              }
              alt="test"
              style={styles.qrCodeContainer}
            />
          </Grid>
        </Page>
      </Document>
    </PDFViewer>
  );
}
