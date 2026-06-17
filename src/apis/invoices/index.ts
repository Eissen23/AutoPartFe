import type {
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  SearchInvoiceRequest,
  CreateInvoiceItemRequest,
  UpdateInvoiceItemRequest,
  SearchInvoiceItemRequest,
} from "#src/openapi";
import { apiClients } from "#src/utils/api";

export const creatInvoice = async (request?: CreateInvoiceRequest) => {
  const result = await apiClients.invoices.apiV1InvoicesPost({
    createInvoiceRequest: request,
  });

  return result.data;
};

export const updateInvoice = async (
  id: string,
  request?: UpdateInvoiceRequest,
) => {
  const result = await apiClients.invoices.apiV1InvoicesIdPut({
    id: id,
    updateInvoiceRequest: request,
  });

  return result.data;
};

export const deleteInvoice = async (id: string) => {
  const result = await apiClients.invoices.apiV1InvoicesIdDelete({
    id,
  });

  return result.data;
};

export const searchInvoice = async (request?: SearchInvoiceRequest) => {
  const result = await apiClients.invoices.apiV1InvoicesSearchPost({
    searchInvoiceRequest: request,
  });

  return result.data;
};

export const getInvoice = async (id: string) => {
  const result = await apiClients.invoices.apiV1InvoicesIdGet({
    id,
  });

  return result.data;
};

export const creatInvoiceItem = async (request?: CreateInvoiceItemRequest) => {
  const result = await apiClients.invoiceItems.apiV1InvoiceitemsPost({
    createInvoiceItemRequest: request,
  });

  return result.data;
};

export const updateInvoiceItem = async (
  id: string,
  request?: UpdateInvoiceItemRequest,
) => {
  const result = await apiClients.invoiceItems.apiV1InvoiceitemsIdPut({
    id,
    updateInvoiceItemRequest: request,
  });

  return result.data;
};

export const deleteInvoiceItem = async (id: string) => {
  const result = await apiClients.invoiceItems.apiV1InvoiceitemsIdDelete({
    id,
  });

  return result.data;
};

export const searchInvoiceItems = async (
  request?: SearchInvoiceItemRequest,
) => {
  const result = await apiClients.invoiceItems.apiV1InvoiceitemsSearchPost({
    searchInvoiceItemRequest: request,
  });

  return result.data;
};

export const getInvoiceItem = async (id: string) => {
  const result = await apiClients.invoiceItems.apiV1InvoiceitemsIdGet({
    id,
  });

  return result.data;
};
