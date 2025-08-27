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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";

const ApproveList = () => {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  // Gelişmiş filtreler
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
  const [dateTo, setDateTo] = useState<Dayjs | null>(null);

  // Sıralama
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      fetch("/örnek_json.json")
        .then((res) => res.json())
        .then((json) => {
          setData(json.value || []);
        })
        .catch((err) => console.error("JSON okunamadı:", err));
    } catch (err) {
      console.error("Veri yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const processData = (data: any) => {
    return data.map((item: any) => {
      const keyRefParts = item.KeyRef.split("^");
      const inquiryNo =
        keyRefParts
          .find((part: any) => part.startsWith("INQUIRY_NO="))
          ?.split("=")[1] || "";
      const vendorNo =
        keyRefParts
          .find((part: any) => part.startsWith("VENDOR_NO="))
          ?.split("=")[1] || "";

      const approverOrder = Math.floor(item.StepNo / 10);

      const formatDate = (dateStr: any) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return (
          date.toLocaleDateString("tr-TR") +
          " " +
          date.toLocaleTimeString("tr-TR")
        );
      };

      return {
        teklifNumarasi: inquiryNo,
        tedarikci: vendorNo,
        onayciSirasi: approverOrder.toString(),
        note: item.Note || "-",
        prevApprovalDate: formatDate(item.PrevApprovalDate),
        groupId: item.GroupId || "-",
        personId: item.PersonId || "-",
        approvalStatus: item.ApprovalStatus || "-",
      };
    });
  };

  const processedData = processData(data);

  // Gelişmiş filtreleme
  const filteredData = processedData.filter((row: any) => {
    const matchesSearch = Object.values(row).some((val) =>
      val?.toString().toLowerCase().includes(search.toLowerCase())
    );

    const matchesStatus = !statusFilter || row.approvalStatus === statusFilter;
    const matchesSupplier = !supplierFilter || row.tedarikci === supplierFilter;

    let matchesDate = true;
    if (dateFrom || dateTo) {
      const rowDate = new Date(
        row.prevApprovalDate.split(" ")[0].split(".").reverse().join("-")
      );

      if (dateFrom) matchesDate = matchesDate && rowDate >= dateFrom.toDate();
      if (dateTo) matchesDate = matchesDate && rowDate <= dateTo.toDate();
    }

    return matchesSearch && matchesStatus && matchesSupplier && matchesDate;
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
    setSupplierFilter("");
    setDateFrom(null);
    setDateTo(null);
    setPage(0);
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      Approved: {
        color: "success" as const,
        icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
        label: "Onaylandı",
      },
      Pending: {
        color: "warning" as const,
        icon: <PendingIcon sx={{ fontSize: 16 }} />,
        label: "Beklemede",
      },
      Rejected: {
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

  const uniqueSuppliers = [
    ...new Set(processedData.map((row: any) => row.tedarikci)),
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

      <Card sx={{ mb: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
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
                    color: "#360165", // yazı ve ikon rengi
                    borderColor: "#360165", // border rengi
                    "&:hover": {
                      borderColor: "#360165",
                      backgroundColor: "rgba(54, 1, 101, 0.08)", // hover arka plan (hafif şeffaf mor)
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
                    sx={{ backgroundColor: "white", width: "150px" }}
                  >
                    <MenuItem value="">Tümü</MenuItem>
                    <MenuItem value="Approved">Onaylandı</MenuItem>
                    <MenuItem value="Pending">Beklemede</MenuItem>
                    <MenuItem value="Rejected">Reddedildi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid>
                <FormControl fullWidth size="small">
                  <InputLabel>Tedarikçi</InputLabel>
                  <Select
                    value={supplierFilter}
                    label="Tedarikçi"
                    onChange={(e) => setSupplierFilter(e.target.value)}
                    sx={{ backgroundColor: "white", width: "150px" }}
                  >
                    <MenuItem value="">Tümü</MenuItem>
                    {(uniqueSuppliers as string[]).map((supplier) => (
                      <MenuItem key={supplier} value={supplier}>
                        {supplier}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={2}>
                  <Grid>
                    <DatePicker
                      label="Başlangıç Tarihi"
                      value={dateFrom}
                      onChange={(newValue) => setDateFrom(newValue)}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          placeholder: "Tarih seçiniz",
                        },
                      }}
                    />
                  </Grid>
                  <Grid>
                    <DatePicker
                      label="Bitiş Tarihi"
                      value={dateTo}
                      onChange={(newValue) => setDateTo(newValue)}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          placeholder: "Tarih seçiniz",
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </Grid>
            <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={clearFilters}
                variant="outlined"
                size="small"
                sx={{
                  minWidth: 140,
                  color: "#360165", // yazı ve ikon rengi
                  borderColor: "#360165", // border rengi
                  "&:hover": {
                    borderColor: "#360165",
                    backgroundColor: "rgba(54, 1, 101, 0.08)", // hover arka plan (hafif şeffaf mor)
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
            aria-label="teklif verileri tablosu"
          >
            <TableHead>
              <TableRow>
                {[
                  { key: "teklifNumarasi", label: "Teklif Numarası" },
                  { key: "tedarikci", label: "Tedarikçi" },
                  { key: "onayciSirasi", label: "Onaycı Sırası" },
                  { key: "note", label: "Not" },
                  { key: "prevApprovalDate", label: "Önceki Onay Tarihi" },
                  { key: "groupId", label: "Grup ID" },
                  { key: "personId", label: "Kişi ID" },
                  { key: "approvalStatus", label: "Onay Durumu" },
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
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography>Yükleniyor...</Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {search ||
                      statusFilter ||
                      supplierFilter ||
                      dateFrom ||
                      dateTo
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
                        {row.teklifNumarasi}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.tedarikci}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Chip
                        label={row.onayciSirasi}
                        size="small"
                        color="primary"
                        sx={{ minWidth: 40 }}
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Tooltip title={row.note} placement="top">
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.note}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        minWidth: 150,
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                      }}
                    >
                      {row.prevApprovalDate}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {row.groupId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {row.personId}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(row.approvalStatus)}</TableCell>
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

export default ApproveList;
