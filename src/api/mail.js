import request from "@/utils/request.js";
export const mailApi = (page, pageSize) => {
  return request()({
    url: `/mail?page=${page}&page_size=${pageSize}`,
    method: "get",
  });
};

export const readMailApi = (data) => {
  return request()({
    url: "/mail/read",
    method: "put",
    data,
  });
};

export const mailNotificationApi = () => {
  return request()({
    url: "/mail/unread",
    method: "get",
  });
};

export const deleteMailApi = (data) => {
  return request()({
    url: "/mail",
    method: "delete",
    data,
  });
};
