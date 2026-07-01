import React, { useState, useEffect, useMemo } from "react";
import { Search, RefreshCw, Filter, X, Moon, Sun } from "lucide-react";
import EmailDetailModal from "./components/EmailDetailModal";
import EmailListItem from "./components/EmailListItem";
import ThreatSummaryCards from "./components/ThreatSummaryCards";
import SkeletonCard from "./components/SkeletonCard";
import { ErrorState, EmptyState } from "./utils/uiStates";
import StatisticsFooter from "./components/StatisticsFooter";
import Pagination from "./components/Pagination";
import { mockEmails } from "./data/mockData";
import { getThreatTypeLabel } from "./utils/helpers";

const USE_MOCK_DATA = true;

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API_ENDPOINTS = {
  threats: "/api/threats/",
  threatDetail: (id) => `/api/threats/${id}/`,
};

const App = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [showFilters, setShowFilters] = useState(false);
  const [threatTypeFilter, setThreatTypeFilter] = useState("");
  const [classifierFilter, setClassifierFilter] = useState("");
  const [taxonomyFilter, setTaxonomyFilter] = useState("");

  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const threatTypes = ["SP", "PH", "MA", "IM", "CL"];
  const taxonomies = [
    "businessEmailSpoofing", "phishing", "spam",
    "malware", "businessEmailImpersonation", "legitimate",
  ];
  const classifiers = [
    "content_intent_attack", "credential_harvesting",
    "attachment_threat", "executive_impersonation", "clean_email",
  ];

  const fetchMockEmails = (page = 1, size = pageSize, ttf = threatTypeFilter, cf = classifierFilter, txf = taxonomyFilter) => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      let filtered = [...mockEmails];
      if (ttf) filtered = filtered.filter((e) => e.threat_type?.includes(ttf));
      if (cf)  filtered = filtered.filter((e) => e.classifier?.includes(cf));
      if (txf) filtered = filtered.filter((e) => e.taxonomy?.includes(txf));
      const totalFiltered = filtered.length;
      const startIndex = (page - 1) * size;
      setEmails(filtered.slice(startIndex, startIndex + size));
      setTotalCount(totalFiltered);
      setCurrentPage(page);
      setTotalPages(Math.ceil(totalFiltered / size));
      setLoading(false);
    }, 500);
  };

  const fetchEmails = async (page = 1, size = pageSize, ttf = threatTypeFilter, cf = classifierFilter, txf = taxonomyFilter) => {
    if (USE_MOCK_DATA) { fetchMockEmails(page, size, ttf, cf, txf); return; }
    setLoading(true);
    setError(null);
    try {
      let queryParams = `?page=${page}&page_size=${size}`;
      if (ttf) queryParams += `&threat_type__contains=${ttf}`;
      if (cf)  queryParams += `&classifier__contains=${cf}`;
      if (txf) queryParams += `&taxonomy__contains=${txf}`;
      const response = await fetch(API_BASE_URL + API_ENDPOINTS.threats + queryParams);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const emailList = data.results || data;
      setEmails(Array.isArray(emailList) ? emailList : [emailList]);
      setTotalCount(data.count || 0);
      setCurrentPage(page);
      setTotalPages(Math.ceil((data.count || 0) / size));
    } catch (err) {
      setError(`Error fetching emails: ${err.message}`);
    }
    setLoading(false);
  };

  const fetchEmailDetail = async (emailId) => {
    setDetailLoading(true);
    if (USE_MOCK_DATA) {
      setTimeout(() => {
        setSelectedEmail(mockEmails.find((e) => e.id === emailId) || null);
        setDetailLoading(false);
      }, 300);
      return;
    }
    try {
      const response = await fetch(API_BASE_URL + API_ENDPOINTS.threatDetail(emailId));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setSelectedEmail(await response.json());
    } catch (err) {
      alert(`Failed to load email details: ${err.message}`);
    }
    setDetailLoading(false);
  };

  // Runs once on mount — pageSize changes are handled by handlePageSizeChange
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchEmails(1, pageSize); }, []);

  const handleRefresh      = () => fetchEmails(currentPage, pageSize);
  const handleNextPage     = () => { if (currentPage < totalPages) fetchEmails(currentPage + 1, pageSize); };
  const handlePrevPage     = () => { if (currentPage > 1) fetchEmails(currentPage - 1, pageSize); };
  const handlePageClick    = (p) => fetchEmails(p, pageSize);
  const handleEmailClick   = (email) => fetchEmailDetail(email.id);
  const closeDetail        = () => setSelectedEmail(null);
  const handlePageSizeChange = (newSize) => { setPageSize(newSize); setCurrentPage(1); fetchEmails(1, newSize); };
  const handleResetFilters = () => {
    setThreatTypeFilter(""); setClassifierFilter(""); setTaxonomyFilter(""); setCurrentPage(1);
    fetchEmails(1, pageSize, "", "", "");
  };

  const hasActiveFilters = threatTypeFilter || classifierFilter || taxonomyFilter;

  const filteredEmails = useMemo(() => {
    if (!searchQuery) return emails;
    const q = searchQuery.toLowerCase();
    return emails.filter((e) =>
      (e.subject       && e.subject.toLowerCase().includes(q)) ||
      (e.sender_domain && e.sender_domain.toLowerCase().includes(q)) ||
      (e.threat_type   && e.threat_type.toLowerCase().includes(q)) ||
      (e.classifier    && e.classifier.toLowerCase().includes(q)) ||
      (e.taxonomy      && e.taxonomy.toLowerCase().includes(q))
    );
  }, [emails, searchQuery]);

  const inputCls = "border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const iconBtnCls = "p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Email Threat Protection</div>
            <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100">Emails</h1>
          </div>

          {/* Search + controls */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search subject, sender, threat type, classifier, or taxonomy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-2 pr-10 ${inputCls}`}
                aria-label="Search emails"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400 dark:text-gray-500" size={20} />
            </div>

            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className={`px-3 py-2 ${inputCls}`}
              aria-label="Page size"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 border rounded transition-colors ${
                hasActiveFilters
                  ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400"
                  : iconBtnCls
              }`}
              title="Toggle filters"
              aria-label="Toggle filters"
            >
              <Filter size={20} />
            </button>

            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`${iconBtnCls} disabled:opacity-50`}
              title="Refresh"
              aria-label="Refresh emails"
            >
              <RefreshCw size={20} className={loading ? "animate-spin text-blue-500" : ""} />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={iconBtnCls}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle dark mode"
            >
              {darkMode
                ? <Sun size={20} className="text-yellow-400" />
                : <Moon size={20} />}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Filter by
                </span>
                {hasActiveFilters && (
                  <button onClick={handleResetFilters} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 font-medium transition-colors">
                    Clear all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "Threat Type", value: threatTypeFilter, setter: setThreatTypeFilter, options: threatTypes, getLabel: (t) => `${t} — ${getThreatTypeLabel(t)}`, onChangeFn: (val) => fetchEmails(1, pageSize, val, classifierFilter, taxonomyFilter) },
                  { label: "Classifier",  value: classifierFilter, setter: setClassifierFilter, options: classifiers, getLabel: (c) => c, onChangeFn: (val) => fetchEmails(1, pageSize, threatTypeFilter, val, taxonomyFilter) },
                  { label: "Taxonomy",    value: taxonomyFilter,   setter: setTaxonomyFilter,   options: taxonomies,  getLabel: (t) => t, onChangeFn: (val) => fetchEmails(1, pageSize, threatTypeFilter, classifierFilter, val) },
                ].map(({ label, value, setter, options, getLabel, onChangeFn }) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">{label}</label>
                    <select
                      value={value}
                      onChange={(e) => { setter(e.target.value); onChangeFn(e.target.value); }}
                      className={`w-full px-3 py-2 text-sm ${inputCls}`}
                    >
                      <option value="">All {label}s</option>
                      {options.map((o) => <option key={o} value={o}>{getLabel(o)}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {hasActiveFilters && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    { val: threatTypeFilter, clear: () => { setThreatTypeFilter(""); fetchEmails(1, pageSize, "", classifierFilter, taxonomyFilter); }, display: getThreatTypeLabel(threatTypeFilter) },
                    { val: classifierFilter, clear: () => { setClassifierFilter(""); fetchEmails(1, pageSize, threatTypeFilter, "", taxonomyFilter); }, display: classifierFilter },
                    { val: taxonomyFilter,   clear: () => { setTaxonomyFilter("");   fetchEmails(1, pageSize, threatTypeFilter, classifierFilter, ""); }, display: taxonomyFilter },
                  ].filter(({ val }) => val).map(({ val, clear, display }) => (
                    <span key={val} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 rounded-full text-xs font-medium">
                      {display}
                      <button onClick={clear} className="text-blue-400 hover:text-blue-700 dark:hover:text-blue-200 leading-none" aria-label={`Remove ${display} filter`}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Email List */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <ThreatSummaryCards emails={USE_MOCK_DATA ? mockEmails : emails} />

        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {error && <ErrorState error={error} apiUrl={API_BASE_URL} />}

        {!loading && !error && filteredEmails.length === 0 && (
          <EmptyState searchQuery={searchQuery} emailCount={emails.length} />
        )}

        <div className="space-y-2">
          {!loading && !error && filteredEmails.map((email) => (
            <EmailListItem key={email.id} email={email} onClick={handleEmailClick} />
          ))}
        </div>

        {!loading && !error && emails.length > 0 && (
          <>
            <StatisticsFooter totalEmails={totalCount} currentPage={currentPage} pageSize={pageSize} />
            <Pagination
              currentPage={currentPage} totalPages={totalPages} totalCount={totalCount}
              onPageChange={handlePageClick} onPrevious={handlePrevPage} onNext={handleNextPage}
            />
          </>
        )}
      </div>

      {selectedEmail && (
        <EmailDetailModal email={selectedEmail} onClose={closeDetail} loading={detailLoading} />
      )}
    </div>
  );
};

export default App;
