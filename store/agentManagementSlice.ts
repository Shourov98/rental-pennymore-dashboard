import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "./store";

export type AgentManagementUser = {
  _id: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  accountStatus?: string;
  profileImageUrl?: string;
};

export type AgentManagementAgent = {
  _id: string;
  userInfo: AgentManagementUser;
  licenseNumber?: string;
  brokerageName?: string;
  title?: string;
  isActive: boolean;
  hasGrantAccess?: boolean;
  powerFormLink?: string;
  docuSignPowerFormLink?: string;
  activationLink?: string;
  createdAt?: string;
  updatedAt?: string;
};

type AgentManagementState = {
  items: AgentManagementAgent[];
  selectedAgent: AgentManagementAgent | null;
};

const initialState: AgentManagementState = {
  items: [],
  selectedAgent: null,
};

const mergeAgent = (
  current: AgentManagementAgent,
  updates: Partial<AgentManagementAgent>
): AgentManagementAgent => ({
  ...current,
  ...updates,
  userInfo: {
    ...current.userInfo,
    ...(updates.userInfo ?? {}),
  },
});

const agentManagementSlice = createSlice({
  name: "agentManagement",
  initialState,
  reducers: {
    setAgents(state, action: PayloadAction<AgentManagementAgent[]>) {
      state.items = action.payload;

      if (!state.selectedAgent) return;
      const matched = action.payload.find(
        (agent) =>
          agent._id === state.selectedAgent?._id ||
          agent.userInfo?._id === state.selectedAgent?.userInfo?._id
      );

      if (matched) {
        state.selectedAgent = mergeAgent(state.selectedAgent, matched);
      }
    },
    setSelectedAgent(state, action: PayloadAction<AgentManagementAgent | null>) {
      state.selectedAgent = action.payload;
    },
    upsertAgent(state, action: PayloadAction<AgentManagementAgent>) {
      const incoming = action.payload;
      const index = state.items.findIndex(
        (agent) =>
          agent._id === incoming._id ||
          agent.userInfo?._id === incoming.userInfo?._id
      );

      if (index >= 0) {
        state.items[index] = mergeAgent(state.items[index], incoming);
      } else {
        state.items.unshift(incoming);
      }

      const selectedMatches =
        state.selectedAgent?._id === incoming._id ||
        state.selectedAgent?.userInfo?._id === incoming.userInfo?._id;

      if (selectedMatches || !state.selectedAgent) {
        state.selectedAgent = selectedMatches
          ? mergeAgent(state.selectedAgent as AgentManagementAgent, incoming)
          : incoming;
      }
    },
    updateAgentByUserId(
      state,
      action: PayloadAction<{
        userId: string;
        changes: Partial<AgentManagementAgent>;
      }>
    ) {
      const { userId, changes } = action.payload;
      const index = state.items.findIndex((agent) => agent.userInfo?._id === userId);

      if (index >= 0) {
        state.items[index] = mergeAgent(state.items[index], changes);
      }

      if (state.selectedAgent?.userInfo?._id === userId) {
        state.selectedAgent = mergeAgent(state.selectedAgent, changes);
      }
    },
  },
});

export const {
  setAgents,
  setSelectedAgent,
  upsertAgent,
  updateAgentByUserId,
} = agentManagementSlice.actions;

export const selectAgentManagement = (state: RootState) => state.agentManagement;

export const selectAgentByUserId = (state: RootState, userId: string) => {
  if (!userId) return null;

  const fromList = state.agentManagement.items.find(
    (agent) => agent.userInfo?._id === userId
  );

  if (fromList) return fromList;

  if (state.agentManagement.selectedAgent?.userInfo?._id === userId) {
    return state.agentManagement.selectedAgent;
  }

  return null;
};

export default agentManagementSlice.reducer;
