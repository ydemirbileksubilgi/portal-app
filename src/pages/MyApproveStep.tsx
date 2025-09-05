import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Collapse,
  Card,
  CardContent,
  Divider,
  AppBar,
  Toolbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useNavigate } from 'react-router';

const MyApproveStep = () => {
     const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gelişmiş filtreler
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [buyerFilter, setBuyerFilter] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sıralama
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // LocalStorage'dan kullanıcı bilgilerini al
      const username = localStorage.getItem('username');
      const password = localStorage.getItem('password');

      if (!username || !password) {
        setError("Kullanıcı bilgileri bulunamadı. Lütfen tekrar giriş yapın.");
        setData([]);
        return;
      }

      // API'ye POST isteği gönder
      const response = await fetch('https://localhost:63085/api/Ifs/getmystep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      if (!response.ok) {
        throw new Error(`Sunucu hatası: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.steps) {
        setData(result.steps);
        setError(null);
      } else {
        setError("Veri formatı beklenenden farklı.");
        setData([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu";
      setError(`Veri yüklenemedi: ${errorMessage}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const processData = (data: any) => {
    return data.map((item: any) => {
      return {
        teklifNo: item.InquiryNo,
        revNo: item.RevisionNo,
        onayAdimNo: item.StepNo,
        onaylayacakKisi: item.ApproverName,
        personId: item.PersonId,
        onaylayacakGrup: item.ApprovalGroup || "-",
        onayDurumu: item.ApprovalStatus,
        satinAlmaci: item.BuyerName,
      };
    });
  };

  const processedData = processData(data);

  // Gelişmiş filtreleme
  const filteredData = processedData.filter((row: any) => {
    const matchesSearch = Object.values(row).some((val) =>
      val?.toString().toLowerCase().includes(search.toLowerCase())
    );

    const matchesStatus = !statusFilter || row.onayDurumu === statusFilter;
    const matchesBuyer = !buyerFilter || row.satinAlmaci === buyerFilter;

    return matchesSearch && matchesStatus && matchesBuyer;
  });

  // Sıralama fonksiyonu
  const sortedData = [...filteredData].sort((a, b) => {
    if (!orderBy) return 0;
    const aVal = a[orderBy];
    const bVal = b[orderBy];
    if (order === "asc") {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: any, newPage: any) => {
    console.log(event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setBuyerFilter("");
    setPage(0);
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      "Onaylandı": {
        color: "success" as const,
        icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
        label: "Onaylandı",
      },
      "Onay Bekliyor": {
        color: "warning" as const,
        icon: <PendingIcon sx={{ fontSize: 16 }} />,
        label: "Onay Bekliyor",
      },
      "Reddedildi": {
        color: "error" as const,
        icon: <CancelIcon sx={{ fontSize: 16 }} />,
        label: "Reddedildi",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "default" as const,
      icon: <InfoIcon sx={{ fontSize: 16 }} />,
      label: status || "-",
    };

    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const uniqueBuyers = [
    ...new Set(processedData.map((row: any) => row.satinAlmaci)),
  ];

  return (
    <Box
      sx={{
        width: "100%",
        padding: 3,
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <AppBar position="static" sx={{ background: "#360165" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            List Of Quotation Awaiting Your Approval
          </Typography>
        </Toolbar>
      </AppBar>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2, mt: 2 }}
          action={
            <Button color="inherit" size="small" onClick={loadData}>
              Tekrar Dene
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3, mt: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Tüm alanlarda ara..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ backgroundColor: "white" }}
              />
            </Grid>
            <Grid>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  endIcon={
                    showAdvancedFilters ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )
                  }
                  sx={{
                    minWidth: 140,
                    color: "#360165",
                    borderColor: "#360165",
                    "&:hover": {
                      borderColor: "#360165",
                      backgroundColor: "rgba(54, 1, 101, 0.08)",
                    },
                  }}
                >
                  Gelişmiş Filtre
                </Button>
                <Tooltip title="Verileri yenile">
                  <IconButton onClick={loadData} disabled={loading}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>

          <Collapse in={showAdvancedFilters}>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid>
                <FormControl fullWidth size="small">
                  <InputLabel>Onay Durumu</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Onay Durumu"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ backgroundColor: "white",width: 200 }}
                  >
                    <MenuItem value="">Tümü</MenuItem>
                    <MenuItem value="Onaylandı">Onaylandı</MenuItem>
                    <MenuItem value="Onay Bekliyor">Onay Bekliyor</MenuItem>
                    <MenuItem value="Reddedildi">Reddedildi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid>
                <FormControl fullWidth size="small">
                  <InputLabel>Satın Almacı</InputLabel>
                  <Select
                    value={buyerFilter}
                    label="Satın Almacı"
                    onChange={(e) => setBuyerFilter(e.target.value)}
                    sx={{ backgroundColor: "white",width: 200 }}
                  >
                    <MenuItem value="">Tümü</MenuItem>
                    {(uniqueBuyers as string[]).map((buyer) => (
                      <MenuItem key={buyer} value={buyer}>
                        {buyer}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={clearFilters}
                variant="outlined"
                size="small"
                sx={{
                  minWidth: 140,
                  color: "#360165",
                  borderColor: "#360165",
                  "&:hover": {
                    borderColor: "#360165",
                    backgroundColor: "rgba(54, 1, 101, 0.08)",
                  },
                }}
              >
                Filtreleri Temizle
              </Button>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      <Paper
        sx={{
          width: "100%",
          mb: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          borderRadius: 2,
        }}
      >
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table
            stickyHeader
            sx={{ minWidth: 750 }}
            aria-label="onay adımları tablosu"
          >
            <TableHead>
              <TableRow>
                {[
                  { key: "teklifNo", label: "Teklif No" },
                  { key: "revNo", label: "Rev No" },
                  { key: "onayAdimNo", label: "Onay Adım No" },
                  { key: "onaylayacakKisi", label: "Onaylayacak Kişi" },
                  { key: "personId", label: "Person ID" },
                  { key: "onaylayacakGrup", label: "Onaylayacak Grup" },
                  { key: "onayDurumu", label: "Onay Durumu" },
                  { key: "satinAlmaci", label: "Satın Almacı" },
                  { key: "actions", label: "İşlemler" },
                ].map((column) => (
                  <TableCell
                    key={column.key}
                    sx={{
                      backgroundColor: "#360165",
                      color: "white",
                      fontWeight: "bold",
                      cursor: "pointer",
                      userSelect: "none",
                      "&:hover": { backgroundColor: "#360165" },
                    }}
                    onClick={() => handleSort(column.key)}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {column.label}
                      {orderBy === column.key && (
                        <Typography variant="caption">
                          {order === "asc" ? "↑" : "↓"}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography>Yükleniyor...</Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {search || statusFilter || buyerFilter
                        ? "Arama kriterlerinize uygun kayıt bulunamadı"
                        : "Kayıt bulunamadı"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row: any, index: any) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "rgba(123, 119, 237, 0.02)",
                      },
                      "&:hover": {
                        backgroundColor: "rgba(123, 119, 237, 0.08)",
                        transform: "scale(1.001)",
                        transition: "all 0.2s ease-in-out",
                      },
                      cursor: "pointer",
                    }}
                  >
                    <TableCell sx={{ fontWeight: "500" }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#360165", fontWeight: 600 }}
                      >
                        {row.teklifNo}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Chip
                        label={row.revNo}
                        size="small"
                        color="primary"
                        sx={{ minWidth: 40 }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Chip
                        label={row.onayAdimNo}
                        size="small"
                        color="secondary"
                        sx={{ minWidth: 40 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.onaylayacakKisi}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {row.personId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {row.onaylayacakGrup}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(row.onayDurumu)}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.satinAlmaci}
                        size="small"
                        variant="outlined"
                        color="info"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: "#360165",
                          "&:hover": {
                            backgroundColor: "#2c014a",
                          },
                        }}
                        onClick={() => navigate(`/qutation-detail?inquiryNo=${row.teklifNo}&revNo=${row.revNo}&stepNo=${row.onayAdimNo}`)}
                      >
                        Detaylar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Sayfa başına:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} / ${count !== -1 ? count : `${to}'den fazla`}`
          }
          sx={{
            borderTop: "1px solid #e0e0e0",
            backgroundColor: "#fafafa",
          }}
        />
      </Paper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Toplam {sortedData.length} kayıt gösteriliyor
          {search && ` • "${search}" için arama sonuçları`}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Son güncelleme: {new Date().toLocaleString("tr-TR")}
        </Typography>
      </Box>
    </Box>
  );
};

export default MyApproveStep;
