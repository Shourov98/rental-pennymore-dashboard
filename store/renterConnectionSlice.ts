import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type RenterRequestDetail = {
  _id: string;
  requestId?: string;
  requestNumber?: number;
  renterId?: string;
  requestName?: string;
  movingDateRange?: {
    earliest?: string;
    latest?: string;
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
  locations?: Array<{
    borough?: string;
    neighborhoods?: string[];
  }>;
  bedrooms?: string[];
  bathrooms?: string[];
  unitFeatures?: {
    laundryInUnit?: boolean;
    privateOutdoorSpace?: boolean;
    dishwasher?: boolean;
  };
  buildingFeatures?: {
    doorman?: boolean;
    elevator?: boolean;
    laundryInBuilding?: boolean;
  };
  petPolicy?: {
    catsAllowed?: boolean;
    dogsAllowed?: boolean;
  };
  guarantorRequired?: {
    personalGuarantor?: boolean;
    thirdPartyGuarantor?: boolean;
  };
  status?: "Available" | "pending" | "paid" | "free" | "rejected";
  isActive?: boolean;
  preferences?: string[];
  viewedBy?: {
    grantAccessAgents?: string[];
    normalAgents?: string[];
  };
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  renterInfo?: {
    renterId?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    profileImageUrl?: string;
    registrationType?: string;
    referralInfo?: {
      referrerId?: string;
      referrerName?: string;
      referrerType?: string;
    };
  };
  agentRequestSummary?: {
    total?: number;
    approved?: number;
    pending?: number;
  };
  agentRequests?: Array<{
    _id?: string;
    status?: string;
    agentId?: string;
    agent?: {
      agentId?: string;
      fullName?: string;
      email?: string;
      phoneNumber?: string;
      role?: string;
      profileImageUrl?: string;
    };
    requestedAt?: string;
    payment?: {
      amount?: number;
      currency?: string;
      status?: "pending" | "paid" | "free";
    };
  }>;
};

type RenterConnectionState = {
  currentRequest: RenterRequestDetail | null;
};

const initialState: RenterConnectionState = {
  currentRequest: null,
};

const renterConnectionSlice = createSlice({
  name: "renterConnection",
  initialState,
  reducers: {
    setCurrentRequest: (
      state,
      action: PayloadAction<RenterRequestDetail | null>,
    ) => {
      state.currentRequest = action.payload;
    },
    clearCurrentRequest: (state) => {
      state.currentRequest = null;
    },
  },
});

export const { setCurrentRequest, clearCurrentRequest } =
  renterConnectionSlice.actions;
export default renterConnectionSlice.reducer;
