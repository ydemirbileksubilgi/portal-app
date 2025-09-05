import React, { useState, useEffect } from "react";
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
  Alert,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useLocation } from "react-router";

interface QuotationLine {
  LineNo: number;
  VendorNo: string;
  VendorName: string;
  PartNo: string;
  Description: string;
  Qty: number;
  PriceUnitMeas: string;
  Price: number;
  PriceInclTax: number;
  NetAmount: number;
  GrossAmount: number;
  Rowtype: string;
  CurrencyCode: string;
  NetAmountTry: number;
  GrossAmountTry: number;
  DiscountPrice: number;
  AppStatus: string | null;
}

interface ApiResponse {
  success: boolean;
  quotationLines: QuotationLine[];
  errorMessage: string | null;
  totalCount: number;
  responseTime: string;
  inquiryNo: number;
}

interface ProcessedProduct {
  lineNo: number;
  partNo: string;
  description: string;
  qty: number;
  uom: string;
}

interface ProcessedVendor {
  name: string;
  vendorNo: string;
  offers: {
    unitPrice: number;
    currency: string;
    totalNet: number;
    totalNetTRY: number;
  }[];
  total: number;
}

const theme = createTheme({
  palette: {
    primary: { main: "#360165" },
    secondary: { main: "#dc004e" },
    background: { default: "#f4f6f8" },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",

    fontSize: 13,
    h5: { fontWeight: 600, fontSize: "1.25rem" },
    h6: { fontWeight: 600, fontSize: "1.0rem" },
    body1: { fontSize: "0.9rem" },
    body2: { fontSize: "0.8rem" },
    caption: { fontSize: "0.7rem" },
  },
});

const DesktopComparisonTable = ({
  products,
  vendors,
  selectedItems,
  onSelectionChange,
  quotationLines,
}: {
  products: ProcessedProduct[];
  vendors: ProcessedVendor[];
  selectedItems: Map<number, string>;
  onSelectionChange: (
    lineNo: number,
    vendorNo: string,
    checked: boolean
  ) => void;
  quotationLines: QuotationLine[];
}) => (
  <TableContainer
    component={Paper}
    sx={{
      width: "100%",
      maxHeight: 450,
      overflow: "auto",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }}
  >
    <Table size="small" sx={{ minWidth: "100%" }}>
      {" "}
      {/* size="small" ile daha kompakt tablo */}
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: "bold" }}>Açıklama</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Miktar</TableCell>
          {vendors.map((vendor) => (
            <TableCell
              key={vendor.vendorNo}
              colSpan={5}
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
              <TableCell align="right">İndirimli Fiyat</TableCell>
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
                {(() => {
                  const quotationLine = quotationLines.find(
                    line => line.LineNo === product.lineNo && line.VendorNo === vendor.vendorNo
                  );
                  const isApproved = quotationLine?.AppStatus === "APP";
                  const isRejected = quotationLine?.AppStatus === "REJ";
                  
                  const cellBgColor = isApproved ? "#e8f5e8" : isRejected ? "#ffebee" : "inherit";
                  const cellBorderColor = isApproved ? "#4caf50" : isRejected ? "#f44336" : "#ddd";
                  
                  return (
                    <>
                      <TableCell 
                        align="center" 
                        sx={{ 
                          borderLeft: `2px solid ${cellBorderColor}`,
                          backgroundColor: cellBgColor,
                          position: "relative"
                        }}
                      >
                        <Checkbox
                          size="small"
                          checked={
                            isApproved || selectedItems.get(product.lineNo) === vendor.vendorNo
                          }
                          disabled={isApproved || isRejected}
                          onChange={(e) =>
                            onSelectionChange(
                              product.lineNo,
                              vendor.vendorNo,
                              e.target.checked
                            )
                          }
                          sx={{
                            color: isApproved ? "success.main" : isRejected ? "error.main" : "inherit",
                            '&.Mui-checked': {
                              color: isApproved ? "success.main" : "primary.main"
                            }
                          }}
                        />
                        {/* Status indicator */}
                        {isApproved && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              position: "absolute", 
                              bottom: 2, 
                              left: "50%", 
                              transform: "translateX(-50%)",
                              color: "success.main",
                              fontWeight: "bold",
                              fontSize: "0.6rem"
                            }}
                          >
                            ONAY
                          </Typography>
                        )}
                        {isRejected && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              position: "absolute", 
                              bottom: 2, 
                              left: "50%", 
                              transform: "translateX(-50%)",
                              color: "error.main",
                              fontWeight: "bold",
                              fontSize: "0.6rem"
                            }}
                          >
                            RED
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          backgroundColor: cellBgColor,
                          borderLeft: `1px solid ${cellBorderColor}`
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: isApproved ? "success.dark" : isRejected ? "error.dark" : "inherit",
                            fontWeight: isApproved || isRejected ? "bold" : "normal"
                          }}
                        >
                          {vendor.offers[index]
                            ? `${vendor.offers[index].unitPrice.toFixed(2)} ${
                                vendor.offers[index].currency
                              }`
                            : "-"}
                        </Typography>
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          backgroundColor: cellBgColor,
                          borderLeft: `1px solid ${cellBorderColor}`
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: isApproved ? "success.dark" : isRejected ? "error.dark" : "inherit",
                            fontWeight: isApproved || isRejected ? "bold" : "normal"
                          }}
                        >
                          {(() => {
                            const quotationLine = quotationLines.find(
                              line => line.LineNo === product.lineNo && line.VendorNo === vendor.vendorNo
                            );
                            return quotationLine
                              ? `${quotationLine.DiscountPrice.toFixed(2)} ${quotationLine.CurrencyCode}`
                              : "-";
                          })()}
                        </Typography>
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          backgroundColor: cellBgColor,
                          borderLeft: `1px solid ${cellBorderColor}`
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: isApproved ? "success.dark" : isRejected ? "error.dark" : "inherit",
                            fontWeight: isApproved || isRejected ? "bold" : "normal"
                          }}
                        >
                          {vendor.offers[index]
                            ? vendor.offers[index].totalNet.toLocaleString("tr-TR")
                            : "-"}
                        </Typography>
                      </TableCell>
                      <TableCell 
                        align="right" 
                        sx={{ 
                          backgroundColor: isApproved ? "#c8e6c9" : isRejected ? "#ffcdd2" : "#e3f2fd",
                          borderLeft: `1px solid ${cellBorderColor}`
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          fontWeight="bold"
                          sx={{ 
                            color: isApproved ? "success.dark" : isRejected ? "error.dark" : "inherit"
                          }}
                        >
                          {vendor.offers[index]
                            ? vendor.offers[index].totalNetTRY.toLocaleString("tr-TR")
                            : "-"}
                        </Typography>
                      </TableCell>
                    </>
                  );
                })()}
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
              colSpan={5}
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

const MobileComparisonCards = ({
  products,
  vendors,
  selectedItems,
  onSelectionChange,
  quotationLines,
}: {
  products: ProcessedProduct[];
  vendors: ProcessedVendor[];
  selectedItems: Map<number, string>;
  onSelectionChange: (
    lineNo: number,
    vendorNo: string,
    checked: boolean
  ) => void;
  quotationLines: QuotationLine[];
}) => (
  <Grid container spacing={2}>
    {vendors.map((vendor) => (
      <Grid key={vendor.vendorNo}>
        <Card variant="outlined">
          <CardContent sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {vendor.name}
            </Typography>
            {products.map((product, index) => {
              const quotationLine = quotationLines.find(
                line => line.LineNo === product.lineNo && line.VendorNo === vendor.vendorNo
              );
              const isApproved = quotationLine?.AppStatus === "APP";
              const isRejected = quotationLine?.AppStatus === "REJ";
              
              return (
                <Box 
                  key={product.partNo} 
                  sx={{ 
                    mb: 2,
                    p: 2,
                    backgroundColor: isApproved ? "#e8f5e8" : isRejected ? "#ffebee" : "#f9f9f9",
                    borderRadius: 1,
                    border: `2px solid ${isApproved ? "#4caf50" : isRejected ? "#f44336" : "#e0e0e0"}`,
                    position: "relative"
                  }}
                >
                  {/* Status Badge */}
                  {(isApproved || isRejected) && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: isApproved ? "#4caf50" : "#f44336",
                        color: "white",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.7rem",
                        fontWeight: "bold"
                      }}
                    >
                      {isApproved ? "ONAYLANMIŞ" : "REDDEDİLMİŞ"}
                    </Box>
                  )}
                  
                  <Typography 
                    variant="body1" 
                    fontWeight="bold"
                    sx={{ 
                      color: isApproved ? "success.dark" : isRejected ? "error.dark" : "inherit",
                      pr: 8 // Space for status badge
                    }}
                  >
                    {product.description}
                  </Typography>
                  
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mt: 1 }}
                  >
                    <Typography variant="body2">Birim Fiyat:</Typography>
                    <Typography 
                      variant="body2"
                      sx={{ 
                        color: isApproved ? "success.dark" : isRejected ? "error.dark" : "inherit",
                        fontWeight: isApproved || isRejected ? "bold" : "normal"
                      }}
                    >
                      {vendor.offers[index]
                        ? `${vendor.offers[index].unitPrice.toFixed(2)} ${
                            vendor.offers[index].currency
                          }`
                        : "-"}
                    </Typography>
                  </Box>
                  
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mt: 1 }}
                  >
                    <Typography variant="body2">İndirimli Fiyat:</Typography>
                    <Typography 
                      variant="body2"
                      sx={{ 
                        color: isApproved ? "success.dark" : isRejected ? "error.dark" : "inherit",
                        fontWeight: isApproved || isRejected ? "bold" : "normal"
                      }}
                    >
                      {(() => {
                        const quotationLine = quotationLines.find(
                          line => line.LineNo === product.lineNo && line.VendorNo === vendor.vendorNo
                        );
                        return quotationLine
                          ? `${quotationLine.DiscountPrice.toFixed(2)} ${quotationLine.CurrencyCode}`
                          : "-";
                      })()}
                    </Typography>
                  </Box>
                  
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mt: 1 }}
                  >
                    <Typography variant="body2">Toplam Net (TRY):</Typography>
                    <Typography 
                      variant="body2" 
                      fontWeight="bold" 
                      sx={{ 
                        color: isApproved ? "success.main" : isRejected ? "error.main" : "primary.main"
                      }}
                    >
                      {vendor.offers[index]
                        ? vendor.offers[index].totalNetTRY.toLocaleString("tr-TR")
                        : "-"}
                    </Typography>
                  </Box>
                  
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    sx={{ 
                      mt: 2, 
                      p: 1, 
                      backgroundColor: isApproved ? "#c8e6c9" : isRejected ? "#ffcdd2" : "#f0f0f0",
                      borderRadius: 1,
                      border: `1px solid ${isApproved ? "#4caf50" : isRejected ? "#f44336" : "#ddd"}`
                    }}
                  >
                    <Checkbox
                      size="small"
                      checked={
                        isApproved || selectedItems.get(product.lineNo) === vendor.vendorNo
                      }
                      disabled={isApproved || isRejected}
                      onChange={(e) =>
                        onSelectionChange(
                          product.lineNo,
                          vendor.vendorNo,
                          e.target.checked
                        )
                      }
                      sx={{
                        color: isApproved ? "success.main" : isRejected ? "error.main" : "inherit",
                        '&.Mui-checked': {
                          color: isApproved ? "success.main" : "primary.main"
                        }
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      fontWeight="bold"
                      sx={{ 
                        color: isApproved ? "success.main" : isRejected ? "error.main" : "inherit"
                      }}
                    >
                      {isApproved ? "✅ Onaylanmış" : isRejected ? "❌ Reddedilmiş" : "⬜ Seç"}
                    </Typography>
                  </Box>
                  
                  {index < products.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              );
            })}
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

// Seçili öğelerin detaylarını gösteren bileşen
const SelectedItemsDetails = ({
  selectedItemsSummary,
}: {
  selectedItemsSummary: {
    totalItems: number;
    totalNetAmountTRY: number;
    totalGrossAmountTRY: number;
    currencies: Set<string>;
    vendors: Set<string>;
    items: Array<{
      line: QuotationLine;
      itemKey: string;
      lineNo: number;
      vendorNo: string;
    }>;
  };
}) => {
  if (selectedItemsSummary.totalItems === 0) {
    return (
      <Card sx={{ height: "fit-content" }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            📊 Talep Detayları
          </Typography>
          <Box
            sx={{
              textAlign: "center",
              py: 3,
              color: "text.secondary",
            }}
          >
            <Typography variant="body1">
              Henüz seçili ürün bulunmamaktadır.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Yukarıdaki tablodan ürün seçerek detayları görüntüleyebilirsiniz.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "fit-content" }}>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          📊 Seçili Ürünler Detayları
        </Typography>

        {/* Seçili Ürünler Listesi */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          Seçili Ürünler:
        </Typography>
        <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.75rem" }}>
                  Ürün
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.75rem" }}>
                  Satıcı
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", fontSize: "0.75rem" }}
                >
                  Miktar
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", fontSize: "0.75rem" }}
                >
                  Birim Fiyat
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", fontSize: "0.75rem" }}
                >
                  İndirimli Fiyat
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", fontSize: "0.75rem" }}
                >
                  Net Tutar (TRY)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedItemsSummary.items.map(({ line, itemKey }) => (
                <TableRow key={itemKey}>
                  <TableCell sx={{ fontSize: "0.75rem" }}>
                    <Typography variant="body2" fontWeight="bold">
                      {line.Description.length > 30
                        ? `${line.Description.substring(0, 30)}...`
                        : line.Description}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {line.PartNo}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem" }}>
                    <Typography variant="body2">{line.VendorName}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {line.VendorNo}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "0.75rem" }}>
                    {line.Qty} {line.PriceUnitMeas}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "0.75rem" }}>
                    {line.Price.toFixed(2)} {line.CurrencyCode}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "0.75rem" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary"
                      }}
                    >
                      {line.DiscountPrice.toFixed(2)} {line.CurrencyCode}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "0.75rem" }}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="primary"
                    >
                      {line.NetAmountTry.toLocaleString("tr-TR")}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Genel Toplam */}
        <Box sx={{ mt: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            💰 Genel Toplam
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              Toplam Net Tutar:
            </Typography>
            <Typography variant="h6" color="success.main" fontWeight="bold">
              {selectedItemsSummary.totalNetAmountTRY.toLocaleString("tr-TR")}{" "}
              TRY
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              Toplam Brüt Tutar:
            </Typography>
            <Typography variant="h6" color="warning.main" fontWeight="bold">
              {selectedItemsSummary.totalGrossAmountTRY.toLocaleString("tr-TR")}{" "}
              TRY
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

function QuotationScreen() {
  const muiTheme = useTheme();

  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const inquiryNo = searchParams.get("inquiryNo") || "468";
  const revNo = searchParams.get("revNo") || "1";

  const [quotationLines, setQuotationLines] = useState<QuotationLine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedProducts, setProcessedProducts] = useState<
    ProcessedProduct[]
  >([]);
  const [processedVendors, setProcessedVendors] = useState<ProcessedVendor[]>(
    []
  );
  const [selectedItems, setSelectedItems] = useState<Map<number, string>>(
    new Map()
  ); // LineNo -> VendorNo
  const [note, setNote] = useState("");
  const [approving, setApproving] = useState(false);

  const loadQuotationData = async () => {
    setLoading(true);
    setError(null);
    try {
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");

      if (!username || !password) {
        setError("Kullanıcı bilgileri bulunamadı. Lütfen tekrar giriş yapın.");
        return;
      }

      const response = await fetch(
        "https://localhost:63085/api/Ifs/getquotationlines",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
            inquiryNo: parseInt(inquiryNo),
            revisionNo: parseInt(revNo),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Sunucu hatası: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success && result.quotationLines) {
        console.log("API Response:", result);
        console.log("Quotation Lines:", result.quotationLines);
        setQuotationLines(result.quotationLines);
        processQuotationData(result.quotationLines);
        setError(null);
      } else {
        setError(result.errorMessage || "Veri formatı beklenenden farklı.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu";
      setError(`Veri yüklenemedi: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const processQuotationData = (lines: QuotationLine[]) => {
    const productMap = new Map<number, ProcessedProduct>();
    const vendorMap = new Map<string, ProcessedVendor>();

    // Pre-populate selected items with approved items
    const preSelectedItems = new Map<number, string>();

    lines.forEach((line) => {
      if (!productMap.has(line.LineNo)) {
        productMap.set(line.LineNo, {
          lineNo: line.LineNo,
          partNo: line.PartNo,
          description: line.Description,
          qty: line.Qty,
          uom: line.PriceUnitMeas,
        });
      }

      if (!vendorMap.has(line.VendorNo)) {
        vendorMap.set(line.VendorNo, {
          name: line.VendorName,
          vendorNo: line.VendorNo,
          offers: [],
          total: 0,
        });
      }

      // Auto-select approved items
      if (line.AppStatus === "APP") {
        preSelectedItems.set(line.LineNo, line.VendorNo);
      }

      const vendor = vendorMap.get(line.VendorNo)!;

      const lineIndex = line.LineNo - 1;
      vendor.offers[lineIndex] = {
        unitPrice: line.Price,
        currency: line.CurrencyCode,
        totalNet: line.NetAmount,
        totalNetTRY: line.NetAmountTry,
      };

      vendor.total += line.GrossAmountTry;
    });

    if (lines.length > 0) {
      const maxLineNo = Math.max(...lines.map((line) => line.LineNo));
      vendorMap.forEach((vendor) => {
        for (let i = 0; i < maxLineNo; i++) {
          if (!vendor.offers[i]) {
            vendor.offers[i] = {
              unitPrice: 0,
              currency: "TRY",
              totalNet: 0,
              totalNetTRY: 0,
            };
          }
        }
      });
    }

    const products = Array.from(productMap.values());
    const vendors = Array.from(vendorMap.values());

    console.log("Processed Products:", products);
    console.log("Processed Vendors:", vendors);
    console.log("Pre-selected items:", preSelectedItems);

    setProcessedProducts(products);
    setProcessedVendors(vendors);
    
    // Update selected items with pre-approved ones, keeping any manual selections
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      preSelectedItems.forEach((vendorNo, lineNo) => {
        newMap.set(lineNo, vendorNo);
      });
      return newMap;
    });
  };

  // Seçim fonksiyonları - Her ürün için sadece bir tedarikçi
  const handleSelectionChange = (
    lineNo: number,
    vendorNo: string,
    checked: boolean
  ) => {
    // Check if this item is already approved - if so, don't allow changes
    const quotationLine = quotationLines.find(
      line => line.LineNo === lineNo && line.VendorNo === vendorNo
    );
    
    if (quotationLine?.AppStatus === "APP" || quotationLine?.AppStatus === "REJ") {
      return; // Don't allow changes to approved or rejected items
    }

    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      if (checked) {
        // Bu ürün için yeni tedarikçiyi seç (eskisinin yerine)
        newMap.set(lineNo, vendorNo);
      } else {
        // Bu ürün için seçimi kaldır
        newMap.delete(lineNo);
      }
      return newMap;
    });
  };

  // Seçili öğelerin verilerini çıkarma
  const getSelectedItemsData = () => {
    const selectedData: Array<{
      line: QuotationLine;
      itemKey: string;
      lineNo: number;
      vendorNo: string;
    }> = [];

    selectedItems.forEach((vendorNo, lineNo) => {
      const line = quotationLines.find(
        (line) => line.LineNo === lineNo && line.VendorNo === vendorNo
      );

      if (line) {
        selectedData.push({
          line,
          itemKey: `${lineNo}-${vendorNo}`,
          lineNo,
          vendorNo,
        });
      }
    });

    return selectedData;
  };

  // Seçili öğelerin özet bilgilerini hesaplama
  const getSelectedItemsSummary = () => {
    const selectedData = getSelectedItemsData();

    if (selectedData.length === 0) {
      return {
        totalItems: 0,
        totalNetAmountTRY: 0,
        totalGrossAmountTRY: 0,
        currencies: new Set<string>(),
        vendors: new Set<string>(),
        items: [],
      };
    }

    let totalNetAmountTRY = 0;
    let totalGrossAmountTRY = 0;
    const currencies = new Set<string>();
    const vendors = new Set<string>();

    selectedData.forEach(({ line }) => {
      totalNetAmountTRY += line.NetAmountTry;
      totalGrossAmountTRY += line.GrossAmountTry;
      currencies.add(line.CurrencyCode);
      vendors.add(line.VendorName);
    });

    return {
      totalItems: selectedData.length,
      totalNetAmountTRY,
      totalGrossAmountTRY,
      currencies,
      vendors,
      items: selectedData,
    };
  };

  // Ana onaylama fonksiyonu - Promise.all ile paralel istekler
  const handleApprove = async () => {
    if (selectedItems.size === 0) {
      alert("Lütfen onaylamak için en az bir öğe seçin.");
      return;
    }

    setApproving(true);
    setError(null);

    try {
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");

      if (!username || !password) {
        setError("Kullanıcı bilgileri bulunamadı. Lütfen tekrar giriş yapın.");
        return;
      }

      const selectedData = getSelectedItemsData();

      console.log(
        "Starting parallel API requests for items:",
        selectedData.map((item) => ({
          lineNo: item.lineNo,
          vendorNo: item.vendorNo,
          description: item.line.Description,
          vendorName: item.line.VendorName,
          price: item.line.Price,
          currency: item.line.CurrencyCode,
        }))
      );

      // Tüm API isteklerini paralel olarak hazırla
      const apiPromises = selectedData.map(async (item) => {
        const requestBody = {
          username: username,
          password: password,
          LuName: item.line.Rowtype,
          InquiryNo: parseInt(inquiryNo),
          QuotLineNo: item.line.LineNo,
          RevisionNo: parseInt(revNo),
          VendorNo: item.line.VendorNo,
          Status: "APP",
          Note: note || "",
        };

        try {
          const response = await fetch(
            "https://localhost:63085/api/Ifs/setnextappstep",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBody),
            }
          );

          if (!response.ok) {
            throw new Error(`Sunucu hatası: ${response.status}`);
          }

          const result = await response.json();

          return {
            item,
            success: result.success,
            error: result.errorMessage,
            requestBody,
          };
        } catch (err) {
          return {
            item,
            success: false,
            error: err instanceof Error ? err.message : "Bilinmeyen hata",
            requestBody,
          };
        }
      });

      console.log(`Executing ${apiPromises.length} parallel API requests...`);
      const startTime = Date.now();

      const results = await Promise.all(apiPromises);

      const endTime = Date.now();
      console.log(`All API requests completed in ${endTime - startTime}ms`);

      const successful = results.filter((r) => r.success);
      const failed = results.filter((r) => !r.success);

      console.log("Approval Results:", {
        total: results.length,
        successful: successful.length,
        failed: failed.length,
        successfulItems: successful.map((r) => ({
          lineNo: r.item.lineNo,
          vendorNo: r.item.vendorNo,
          description: r.item.line.Description,
        })),
        failedItems: failed.map((r) => ({
          lineNo: r.item.lineNo,
          vendorNo: r.item.vendorNo,
          description: r.item.line.Description,
          error: r.error,
        })),
      });

      let message = "";
      if (successful.length > 0) {
        message += `✅ ${successful.length} öğe başarıyla onaylandı`;
      }
      if (failed.length > 0) {
        if (message) message += "\n";
        message += `❌ ${failed.length} öğe onaylanamadı`;
        if (failed.length <= 3) {
          message +=
            ":\n" +
            failed
              .map(
                (f) =>
                  `• ${f.item.line.Description.substring(0, 50)}... - ${
                    f.error
                  }`
              )
              .join("\n");
        }
        console.error("Failed approvals:", failed);
      }

      alert(message);

      if (successful.length > 0) {
        setSelectedItems((prev) => {
          const newMap = new Map(prev);
          successful.forEach((result) => {
            newMap.delete(result.item.lineNo);
          });
          return newMap;
        });

        loadQuotationData();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu";
      setError(`Onaylama işlemi başarısız: ${errorMessage}`);
      console.error("Promise.all error:", err);
    } finally {
      setApproving(false);
    }
  };

  const handleSelectAll = () => {
    const productVendors = new Map<number, string>();

    quotationLines.forEach((line) => {
      const currentVendor = productVendors.get(line.LineNo);
      if (!currentVendor || line.VendorNo < currentVendor) {
        productVendors.set(line.LineNo, line.VendorNo);
      }
    });

    setSelectedItems(productVendors);
    console.log("All items selected:", Array.from(productVendors.entries()));
  };

  const handleDeselectAll = () => {
    setSelectedItems(new Map());
  };

  console.log(handleSelectAll, handleDeselectAll);

  useEffect(() => {
    loadQuotationData();
  }, [inquiryNo]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DETAILS OF QUOTATION - Teklif No: {inquiryNo}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={loadQuotationData}>
                Tekrar Dene
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {loading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ my: 4 }}
          >
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Veriler yükleniyor...</Typography>
          </Box>
        )}

        {!loading &&
          processedProducts.length > 0 &&
          processedVendors.length > 0 && (
            <Box>
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      💰 Teklif Karşılaştırma Tablosu
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        backgroundColor:
                          selectedItems.size > 0 ? "#e3f2fd" : "#f5f5f5",
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        color: selectedItems.size > 0 ? "#1565c0" : "#666",
                      }}
                    >
                      {selectedItems.size} / {processedProducts.length} ürün
                      seçili
                    </Typography>
                  </Box>
                  {isMobile ? (
                    <MobileComparisonCards
                      products={processedProducts}
                      vendors={processedVendors}
                      selectedItems={selectedItems}
                      onSelectionChange={handleSelectionChange}
                      quotationLines={quotationLines}
                    />
                  ) : (
                    <DesktopComparisonTable
                      products={processedProducts}
                      vendors={processedVendors}
                      selectedItems={selectedItems}
                      onSelectionChange={handleSelectionChange}
                      quotationLines={quotationLines}
                    />
                  )}
                </CardContent>
              </Card>

              <Grid container spacing={3}>
                <Grid>
                  <SelectedItemsDetails
                    selectedItemsSummary={getSelectedItemsSummary()}
                  />
                </Grid>

                <Grid>
                  <Card sx={{ height: "fit-content" }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        📝 Notlar
                      </Typography>
                      <TextField
                        multiline
                        rows={6}
                        fullWidth
                        variant="outlined"
                        placeholder="Notunuzu buraya yazın..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid>
                  <Card>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        ⚡ Hızlı İşlemler
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                       
                        <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                          <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            size="small"
                            sx={{ py: 0.8 }}
                            onClick={handleApprove}
                            disabled={approving || selectedItems.size === 0}
                          >
                            {approving
                              ? `Onaylanıyor... (${selectedItems.size})`
                              : `Onayla (${selectedItems.size})`}
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            fullWidth
                            size="small"
                            sx={{ py: 0.8 }}
                          >
                            Reddet
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

        {!loading &&
          !error &&
          (processedProducts.length === 0 || processedVendors.length === 0) && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ my: 4 }}
            >
              <Typography variant="h6" color="text.secondary">
                Görüntülenecek teklif verisi bulunamadı.
              </Typography>
            </Box>
          )}
      </Container>
    </ThemeProvider>
  );
}

export default QuotationScreen;
