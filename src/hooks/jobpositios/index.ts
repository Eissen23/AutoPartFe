import {
  createJobPosition,
  deleteJobPosition,
  getJobPosition,
  searchJobPosition,
  updateJobPosition,
} from "#src/apis/jobpositios";
import type {
  CreateJobPositionRequest,
  SearchJobPositionsRequest,
  UpdateJobPositionRequest,
} from "#src/openapi";
import { useApiMutation, useFetch } from "#src/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { useMessage } from "#src/utils/message";

export function useJobPositionsQuery(payload?: SearchJobPositionsRequest) {
  return useFetch({
    queryKey: ["jobpositions", payload],
    queryFn: async () => {
      const result = await searchJobPosition(payload);

      return result?.data;
    },
    staleTime: 1000 * 60,
  });
}

export function useJobPositionById(id: string) {
  return useFetch({
    queryKey: ["jobposition", id],
    queryFn: async () => {
      const result = await getJobPosition(id);

      return result?.data;
    },
  });
}

export function useCreateJobPosition() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: CreateJobPositionRequest) => {
      const resp = await createJobPosition(payload);

      return resp?.data;
    },
    onSuccess: () => {
      message.success("Job position created successfully");
      qc.invalidateQueries({ queryKey: ["jobpositions"] });
    },
    onError: () => {
      message.error("Failed to create job position");
    },
  });
}

export function useUpdateJobPosition() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: { id: string; data?: UpdateJobPositionRequest }) => {
      const resp = await updateJobPosition(payload.id, payload.data);

      return resp?.data;
    },
    onSuccess: (_data, variable) => {
      message.success("Job position has been updated");
      qc.invalidateQueries({ queryKey: ["jobpositions"] });
      qc.invalidateQueries({ queryKey: ["jobposition", variable.id] });
    },
    onError: () => {
      message.error("Failed to update job position");
    },
  });
}

export function useDeleteJobPosition() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (id: string) => {
      const resp = await deleteJobPosition(id);

      return resp?.data;
    },
    onSuccess: () => {
      message.success("Job position has been deleted");
      qc.invalidateQueries({ queryKey: ["jobpositions"] });
    },
    onError: () => {
      message.error("Failed to delete job position");
    },
  });
}
