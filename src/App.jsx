import React, { useState, useEffect, useMemo } from "react";
import { Search, RefreshCw, Filter, X } from "lucide-react";
import EmailDetailModal from "./components/EmailDetailModal";
import EmailListItem from "./components/EmailListItem";
import ThreatSummaryCards from "./components/ThreatSummaryCards";
import { LoadingState, ErrorState, EmptyState } from "./utils/uiStates";
import StatisticsFooter from "./components/StatisticsFooter";
import Pagination from "./components/Pagination";
import { mockEmails } from "./data/mockData";

// Toggle this to switch between mock data and real API
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

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [threatTypeFilter, setThreatTypeFilter] = useState("");
  const [classifierFilter, setClassifierFilter] = useState("");
  const [taxonomyFilter, setTaxonomyFilter] = useState("");

  // Filter options
  const threatTypes = ["SP", "PH", "MA", "IM", "CL"];
  const taxonomies = [
    "businessEmailSpoofing",
    "phishing",
    "spam",
    "malware",
    "businessEmailImpersonation",
    "legitimate",
  ];
  const classifiers = [
    "content_intent_attack",
    "credential_harvesting",
    "attachment_threat",
    "executive_impersonation",
    "clean_email",
  ];

  // Mock data fetch — accepts explicit filter params to avoid stale-closure bugs
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

  // Real API fetch
  const fetchEmails = async (page = 1, size = pageSize, ttf = threatTypeFilter, cf = classifierFilter, txf = taxonomyFilter) => {
    if (USE_MOCK_DATA) {
      fetchMockEmails(page, size, ttf, cf, txf);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let queryParams = `?page=${page}&page_size=${size}`;
      if (ttf) queryParams += `&threat_type__contains=${ttf}`;
      if (cf)  queryParams += `&classifier__contains=${cf}`;
      if (txf) queryParams += `&taxonomy__contains=${txf}`;

      const response = await fetch(
        API_BASE_URL + API_ENDPOINTS.threats + queryParams,
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      const emailList = data.results || data;
      setEmails(Array.isArray(emailList) ? emailList : [emailList]);
      setTotalCount(data.count || 0);
      setCurrentPage(page);
      setTotalPages(Math.ceil((data.count || 0) / size));
    } catch (err) {
      setError(`Error fetching emails: ${err.message}`);
      console.error("Error fetching emails:", err);
    }

    setLoading(false);
  };

  // Fetch single email detail
  const fetchEmailDetail = async (emailId) => {
    setDetailLoading(true);

    if (USE_MOCK_DATA) {
      setTimeout(() => {
        const email = mockEmails.find((e) => e.id === emailId);
        setSelectedEmail(email || null);
        setDetailLoading(false);
      }, 300);
      return;
    }

    try {
      const response = await fetch(
        API_BASE_URL + API_ENDPOINTS.threatDetail(emailId),
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setSelectedEmail(data);
    } catch (err) {
      console.error("Error fetching email details:", err);
      alert(`Failed to load email details: ${err.message}`);
    }

    setDetailLoading(false);
  };

  // Runs once on mount — pageSize changes are handled by handlePageSizeChange
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchEmails(1, pageSize);
  }, []);

  const handleRefresh = () => fetchEmails(currentPage, pageSize);

  const handleNextPage = () => {
    if (currentPage < totalPages) fetchEmails(currentPage + 1, pageSize);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) fetchEmails(currentPage - 1, pageSize);
  };

  const handlePageClick = (pageNumber) => fetchEmails(pageNumber, pageSize);

  const handleEmailClick = (email) => fetchEmailDetail(email.id);

  const closeDetail = () => setSelectedEmail(null);

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
    fetchEmails(1, newSize);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchEmails(1, pageSize);
  };

  const handleResetFilters = () => {
    setThreatTypeFilter("");
    setClassifierFilter("");
    setTaxonomyFilter("");
    setCurrentPage(1);
    fetchEmails(1, pageSize, "", "", "");
  };

  const hasActiveFilters =
    threatTypeFilter || classifierFilter || taxonomyFilter;

  const filteredEmails = useMemo(() => {
    if (!searchQuery) return emails;
    const q = searchQuery.toLowerCase();
    return emails.filter((email) =>
      (email.subject && email.subject.toLowerCase().includes(q)) ||
      (email.sender_domain && email.sender_domain.toLowerCase().includes(q)) ||
      (email.threat_type && email.threat_type.toLowerCase().includes(q)) ||
      (email.classifier && email.classifier.toLowerCase().includes(q)) ||
      (email.taxonomy && email.taxonomy.toLowerCase().includes(q))
    );
  }, [emails, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <div className="text-sm text-gray-500">Email Threat Protection</div>
            <h1 className="text-3xl font-light">Emails</h1>
          </div>

          {/* Search + Page Size + Filter + Refresh */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search subject, sender, threat type, classifier, or taxonomy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search emails"
              />
              <Search
                className="absolute right-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>

            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  ? "bg-blue-50 border-blue-300 text-blue-600"
                  : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
              title="Toggle filters"
              aria-label="Toggle filters"
            >
              <Filter size={20} />
            </button>

            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
              title="Refresh emails"
              aria-label="Refresh emails"
            >
              <RefreshCw
                size={20}
                className={
                  loading ? "animate-spin text-blue-600" : "text-gray-600"
                }
              />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Threat Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Threat Type Contains:
                  </label>
                  <input
                    type="text"
                    value={threatTypeFilter}
                    onChange={(e) => setThreatTypeFilter(e.target.value)}
                    placeholder="e.g., SP, PH, MA"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {threatTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setThreatTypeFilter(type)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          threatTypeFilter === type
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Classifier Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Classifier Contains:
                  </label>
                  <input
                    type="text"
                    value={classifierFilter}
                    onChange={(e) => setClassifierFilter(e.target.value)}
                    placeholder="e.g., content_intent_attack"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {classifiers.map((c) => (
                      <button
                        key={c}
                        onClick={() => setClassifierFilter(c)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          classifierFilter === c
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Taxonomy Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taxonomy Contains:
                  </label>
                  <input
                    type="text"
                    value={taxonomyFilter}
                    onChange={(e) => setTaxonomyFilter(e.target.value)}
                    placeholder="e.g., spam, phishing"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {taxonomies.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTaxonomyFilter(t)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          taxonomyFilter === t
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleApplyFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
                  >
                    Submit
                  </button>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                  >
                    Reset
                  </button>
                </div>

                {/* Active Filter Badges */}
                {hasActiveFilters && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Active Filters:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {threatTypeFilter && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          Threat Type: {threatTypeFilter}
                        </span>
                      )}
                      {classifierFilter && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          Classifier: {classifierFilter}
                        </span>
                      )}
                      {taxonomyFilter && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          Taxonomy: {taxonomyFilter}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email List */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <ThreatSummaryCards emails={USE_MOCK_DATA ? mockEmails : emails} />

        {loading && <LoadingState />}

        {error && <ErrorState error={error} apiUrl={API_BASE_URL} />}

        {!loading && !error && filteredEmails.length === 0 && (
          <EmptyState searchQuery={searchQuery} emailCount={emails.length} />
        )}

        <div className="space-y-2">
          {!loading &&
            !error &&
            filteredEmails.map((email) => (
              <EmailListItem
                key={email.id}
                email={email}
                onClick={handleEmailClick}
              />
            ))}
        </div>

        {!loading && !error && emails.length > 0 && (
          <>
            <StatisticsFooter
              emails={filteredEmails}
              totalEmails={totalCount}
            />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                onPageChange={handlePageClick}
                onPrevious={handlePrevPage}
                onNext={handleNextPage}
              />
            )}
          </>
        )}
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <EmailDetailModal
          email={selectedEmail}
          onClose={closeDetail}
          loading={detailLoading}
        />
      )}
    </div>
  );
};

export default App;
