type AltfinsAnalysisParams = {
  symbol: string;       // Comma-separated symbols or single symbol
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

type AltfinsCommand = {
  type: 'analysis';
  params: AltfinsAnalysisParams;
};

