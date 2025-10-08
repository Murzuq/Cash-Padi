import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Create styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#333",
  },
  logo: {
    // width: 40,
    height: 80,
    alignSelf: "center",
    marginBottom: 10,
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    borderBottom: "1pt dashed #ccc",
    paddingBottom: 10,
  },
  title: {
    fontSize: 12,
    color: "#555",
  },
  amount: {
    fontSize: 30,
    fontFamily: "Helvetica-Bold",
    marginTop: 4,
    marginBottom: 4,
    fontWeight: "bold",
  },
  recipient: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  section: {
    marginTop: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1pt solid #eee",
    paddingVertical: 8,
  },
  label: {
    color: "#555",
  },
  value: {
    fontFamily: "Helvetica-Bold",
  },
  transactionId: {
    fontFamily: "Courier",
    fontSize: 9,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    color: "grey",
    fontSize: 10,
  },
});

// Create the PDF document component
const ReceiptDocument = ({ transaction }) => {
  if (!transaction) return null;

  const { title, type, amount, date, status, description, _id, id } =
    transaction;
  const isCredit = amount > 0;
  const transactionId = _id || id;

  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    currencyDisplay: "code", // Use 'NGN' instead of '₦' to avoid font issues
  }).format(Math.abs(amount));

  const formattedDate = new Date(date).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "medium",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image
          style={styles.logo}
          src={`${window.location.origin}/cash-padi-logo.png`}
        />
        <View style={styles.header}>
          <Text style={styles.title}>{type}</Text>
          <Text
            style={[styles.amount, { color: isCredit ? "#16a34a" : "#1f2937" }]}
          >
            {isCredit ? "+" : "−"}
            {formattedAmount}
          </Text>
          <Text style={styles.recipient}>{title}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{status}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{formattedDate}</Text>
          </View>
          {description && (
            <View style={styles.row}>
              <Text style={styles.label}>Description</Text>
              <Text style={styles.value}>{description}</Text>
            </View>
          )}
          {transactionId && (
            <View style={styles.row}>
              <Text style={styles.label}>Transaction ID</Text>
              <Text style={styles.transactionId}>{transactionId}</Text>
            </View>
          )}
        </View>

        <Text style={styles.footer}>Thank you for using CashPadi!</Text>
      </Page>
    </Document>
  );
};

export default ReceiptDocument;
