import React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  Checkbox,
  AppBar,
  Toolbar,
  CssBaseline,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// --- VERİ SETLERİ (Değişiklik yok) ---
const products = [
  {
    lineNo: 1,
    partNo: "E100005",
    description: "Moleküler Sieve",
    qty: 12,
    uom: "kg",
  },
  {
    lineNo: 2,
    partNo: "E100008",
    description: "Powermite Ø 50 mm Kartuş 625 g (:43300500625)",
    qty: 1000,
    uom: "kg",
  },
];

const vendors = [
  // --- Mevcut Teklifler ---
  {
    name: "AKKOL HAZIR YEMEK SANAYİ VE TİCARET A.Ş.",
    vendorNo: "300004",
    offers: [
      { unitPrice: 25.0, currency: "USD", totalNet: 300.0, totalNetTRY: 12197.19 },
      { unitPrice: 30.0, currency: "USD", totalNet: 30000.0, totalNetTRY: 1219719.0 },
    ],
    total: 1231916.19,
  },
  {
    name: "ASKOM MAKİNE MÜHENDİSLİK SANAYİ VE TİCARET A.Ş.",
    vendorNo: "300005",
    offers: [
      { unitPrice: 45.0, currency: "USD", totalNet: 540.0, totalNetTRY: 21954.94 },
      { unitPrice: 50.0, currency: "USD", totalNet: 50000.0, totalNetTRY: 2032865.0 },
    ],
    total: 2054819.94,
  },
  {
    name: "ASYA MAKİNA ARAÇ ÜSTÜ EKİPMAN KAYNAKLI VE TALAŞLI İMALAT SANAYİ",
    vendorNo: "300006",
    offers: [
      { unitPrice: 30.0, currency: "USD", totalNet: 360.0, totalNetTRY: 14636.63 },
      { unitPrice: 35.0, currency: "USD", totalNet: 35000.0, totalNetTRY: 1423005.5 },
    ],
    total: 1437642.13,
  },
  // --- YENİ EKLENEN 3 TEKLİF ---
  {
    name: "YILMAZ METALURJİ VE MAKİNA SAN.",
    vendorNo: "300007",
    offers: [
      { unitPrice: 28.5, currency: "USD", totalNet: 342.0, totalNetTRY: 13915.86 },
      { unitPrice: 32.5, currency: "USD", totalNet: 32500.0, totalNetTRY: 1321417.5 },
    ],
    total: 1335333.36,
  },
  {
    name: "GÜVEN HIRDAVAT TİCARET LTD. ŞTİ.",
    vendorNo: "300008",
    offers: [
      { unitPrice: 24.0, currency: "USD", totalNet: 288.0, totalNetTRY: 11710.08 },
      { unitPrice: 29.5, currency: "USD", totalNet: 29500.0, totalNetTRY: 1200000.0 }, // Yuvarlak rakam
    ],
    total: 1211710.08,
  },
  {
    name: "MEGA ENDÜSTRİYEL ÜRÜNLER A.Ş.",
    vendorNo: "300009",
    offers: [
      { unitPrice: 48.0, currency: "USD", totalNet: 576.0, totalNetTRY: 23419.14 },
      { unitPrice: 55.0, currency: "USD", totalNet: 55000.0, totalNetTRY: 2236151.0 },
    ],
    total: 2259570.14,
  },
];

const inquiryDetails = [
  // --- Mevcut Detaylar ---
  {
    inquiryNo: 119,
    vendorNo: "300004",
    vendorName: "AKKOL HAZIR YEMEK SANAYİ VE TİCARET A.Ş.",
    dateExpires: "24.01.2025",
    buyerName: "Utku Gün",
    wantedDate: "24.01.2025",
  },
  {
    inquiryNo: 119,
    vendorNo: "300005",
    vendorName: "ASKOM MAKİNE MÜHENDİSLİK SANAYİ VE TİCARET A.Ş.",
    dateExpires: "24.01.2025",
    buyerName: "Utku Gün",
    wantedDate: "24.01.2025",
  },
  {
    inquiryNo: 119,
    vendorNo: "300006",
    vendorName: "ASYA MAKİNA ARAÇ ÜSTÜ EKİPMAN KAYNAKLI VE TALAŞLI İMALAT SANAYİ",
    dateExpires: "24.01.2025",
    buyerName: "Utku Gün",
    wantedDate: "24.01.2025",
  },
  // --- YENİ EKLENEN 3 SATICI İÇİN DETAYLAR ---
  {
    inquiryNo: 119,
    vendorNo: "300007",
    vendorName: "YILMAZ METALURJİ VE MAKİNA SAN.",
    dateExpires: "24.01.2025",
    buyerName: "Utku Gün",
    wantedDate: "24.01.2025",
  },
  {
    inquiryNo: 119,
    vendorNo: "300008",
    vendorName: "GÜVEN HIRDAVAT TİCARET LTD. ŞTİ.",
    dateExpires: "24.01.2025",
    buyerName: "Utku Gün",
    wantedDate: "24.01.2025",
  },
  {
    inquiryNo: 119,
    vendorNo: "300009",
    vendorName: "MEGA ENDÜSTRİYEL ÜRÜNLER A.Ş.",
    dateExpires: "24.01.2025",
    buyerName: "Utku Gün",
    wantedDate: "24.01.2025",
  },
];

// --- TEMA AYARLARI (Yazı boyutları küçültüldü) ---
const theme = createTheme({
  palette: {
    primary: { main: "#360165" },
    secondary: { main: "#dc004e" },
    background: { default: "#f4f6f8" },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    // Genel yazı boyutunu küçültelim
    fontSize: 13,
    h5: { fontWeight: 600, fontSize: "1.25rem" },
    h6: { fontWeight: 600, fontSize: "1.0rem" },
    body1: { fontSize: "0.9rem" },
    body2: { fontSize: "0.8rem" }, // Tablo içi metinler için daha küçük boyut
    caption: { fontSize: "0.7rem" }, // En küçük metinler için
  },
});

// --- RESPONSIVE BİLEŞENLER ---

// Masaüstü için Geniş Tablo Görünümü
const DesktopComparisonTable = () => (
  <TableContainer
  component={Paper}
  sx={{ maxWidth: 1100, maxHeight: 400, margin: "auto" }}
>
    <Table size="small" sx={{ minWidth: 1200 }}>
      {" "}
      {/* size="small" ile daha kompakt tablo */}
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: "bold" }}>Açıklama</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Miktar</TableCell>
          {vendors.map((vendor) => (
            <TableCell
              key={vendor.vendorNo}
              colSpan={4}
              align="center"
              sx={{
                borderLeft: "1px solid #ddd",
                backgroundColor: "#f9f9f9",
                fontWeight: "bold",
              }}
            >
              {vendor.name}
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell></TableCell>
          <TableCell></TableCell>
          {vendors.map((vendor) => (
            <React.Fragment key={vendor.vendorNo}>
              <TableCell align="center">Seç</TableCell>
              <TableCell align="right">Birim Fiyat</TableCell>
              <TableCell align="right">Toplam Net</TableCell>
              <TableCell align="right">Toplam Net (TRY)</TableCell>
            </React.Fragment>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map((product, index) => (
          <TableRow key={product.partNo}>
            <TableCell>
              <Typography variant="body2" fontWeight="bold">
                {product.description}
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
              >{`Parça No: ${product.partNo}`}</Typography>
            </TableCell>
            <TableCell>{`${product.qty} ${product.uom}`}</TableCell>
            {vendors.map((vendor) => (
              <React.Fragment key={vendor.vendorNo}>
                <TableCell align="center" sx={{ borderLeft: "1px solid #ddd" }}>
                  <Checkbox size="small" />
                </TableCell>
                <TableCell align="right">{`${vendor.offers[
                  index
                ].unitPrice.toFixed(2)} ${
                  vendor.offers[index].currency
                }`}</TableCell>
                <TableCell align="right">
                  {vendor.offers[index].totalNet.toLocaleString("tr-TR")}
                </TableCell>
                <TableCell align="right" sx={{ backgroundColor: "#e3f2fd" }}>
                  <Typography variant="body2" fontWeight="bold">
                    {vendor.offers[index].totalNetTRY.toLocaleString("tr-TR")}
                  </Typography>
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
        ))}
        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
          <TableCell colSpan={2} align="right">
            <Typography variant="h6">Genel Toplam (TRY)</Typography>
          </TableCell>
          {vendors.map((vendor) => (
            <TableCell
              key={vendor.vendorNo}
              colSpan={4}
              align="right"
              sx={{ borderLeft: "1px solid #ddd" }}
            >
              <Typography variant="h6" color="primary">
                {vendor.total.toLocaleString("tr-TR")}
              </Typography>
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);

// Mobil için Kart Görünümü
const MobileComparisonCards = () => (
  <Grid container spacing={2}>
    {vendors.map((vendor) => (
      <Grid key={vendor.vendorNo}>
        <Card variant="outlined">
          <CardContent sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {vendor.name}
            </Typography>
            {products.map((product, index) => (
              <Box key={product.partNo} sx={{ mb: 2 }}>
                <Typography variant="body1" fontWeight="bold">
                  {product.description}
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2">Birim Fiyat:</Typography>
                  <Typography variant="body2">{`${vendor.offers[
                    index
                  ].unitPrice.toFixed(2)} ${
                    vendor.offers[index].currency
                  }`}</Typography>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2">Toplam Net (TRY):</Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {vendor.offers[index].totalNetTRY.toLocaleString("tr-TR")}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Checkbox size="small" /> Seç
                </Box>
                {index < products.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Genel Toplam:</Typography>
              <Typography variant="h6" color="primary">
                {vendor.total.toLocaleString("tr-TR")} TRY
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

// Ana Sayfa Bileşeni
function QuotationScreen() {
  const muiTheme = useTheme();
  // 'md' breakpoint (900px) altında ise isMobile true döner.
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DETAILS OF QUOTATION
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Ürün Bilgileri ve Teklifler */}
          <Grid>
            <Card>
              <CardContent>
                {isMobile ? (
                  <MobileComparisonCards />
                ) : (
                  <DesktopComparisonTable />
                )}
              </CardContent>
            </Card>
          </Grid>
          {/* Talep ve Satıcı Bilgileri */}
          <Grid>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Talep Detayları
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {!isMobile && <TableCell>Talep No</TableCell>}
                        <TableCell>Satıcı No</TableCell>
                        <TableCell>Satıcı Adı</TableCell>
                        <TableCell>Bitiş Tarihi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inquiryDetails.map((row) => (
                        <TableRow key={row.vendorNo}>
                          {!isMobile && <TableCell>{row.inquiryNo}</TableCell>}
                          <TableCell>{row.vendorNo}</TableCell>
                          <TableCell>{row.vendorName}</TableCell>
                          <TableCell>{row.dateExpires}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Notlar ve Aksiyonlar */}
          <Grid>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Not
                </Typography>
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  placeholder="Notunuzu buraya yazın..."
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                gap: 2,
              }}
            >
              <Button variant="contained" color="primary" fullWidth>
                Kontrol Et
              </Button>
              <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                <Button variant="contained" color="success" fullWidth>
                  Onayla
                </Button>
                <Button variant="contained" color="error" fullWidth>
                  Reddet
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
        {/* Kaydetme Butonları */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
        >
          <Button variant="outlined" color="secondary">
            İptal
          </Button>
          <Button variant="contained">Kaydet</Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default QuotationScreen;
