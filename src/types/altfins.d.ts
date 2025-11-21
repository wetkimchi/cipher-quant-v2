type AltfinsAnalysisParams = {
  symbol: string;       // Comma-separated symbols or single symbol
  page?: number;        // Zero-based page index (default: 0)
  size?: number;        // Results per page (default: 100)
  sort?: string;        // Format: "property,direction" (default: "updatedDate,DESC")
};

type AltfinsAnalyticsParams = {
  symbol: string;       // Cryptocurrency symbol (e.g., "BTC")
  timeInterval?: string; // Time interval (default: "DAILY")
  analyticsType?: string; // Analytics type (default: "SMA10")
  from?: string;        // Start date ISO string (default: 30 days ago)
  to?: string;          // End date ISO string (default: now)
};

type AltfinsAnalysisContent = {
  symbol: string;
  friendlyName: string;
  updatedDate: string;
  nearTermOutlook: string;
  patternType: string;
  patternStage: string;
  description: string;
  imgChartUrl: string;
  imgChartUrlDark: string;
  logoUrl: string;
};

type AltfinsAnalysisResponse = {
  size: number;
  number: number;
  content: AltfinsAnalysisContent[];
  totalElements: number;
  numberOfElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

type AltfinsAnalyticsContent = {
  symbol: string;
  time: string;
  value: string;
  nonNumericalValue: string;
};

type AltfinsAnalyticsResponse = {
  size: number;
  number: number;
  content: AltfinsAnalyticsContent[];
  totalElements: number;
  numberOfElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

type AltfinsAnalyticsType = {
  id: string;
  friendlyName: string;
  isNumerical: boolean;
};

type AltfinsCommand = {
  type: 'analysis';
  params: AltfinsAnalysisParams;
} | {
  type: 'analytics';
  params: AltfinsAnalyticsParams;
} | {
  type: 'list';
  params: {};
};

